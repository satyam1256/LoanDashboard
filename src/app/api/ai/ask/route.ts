import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from '@/lib/supabase/server'
import prisma from "@/lib/db"

const SYSTEM_PROMPT = `
You are an expert AI Loan Assistant for "Loan Picks", a platform recommending loan products.
Your goal is to help users select the best loan product based on their profile and answer specific questions about terms, eligibility, and repayment.

*Context:*
- You have access to the specific product the user is viewing.
- You have access to the user's basic profile (income, credit score, employment) if they are logged in.
- You have access to computed "eligibility" status.

*Tone & Style:*
- Professional, empathetic, and clear.
- Be concise (CRITICAL: 80-90 words max per response).
- Exception: If providing a detailed calculation (like EMI breakdown), you may exceed the word limit to ensure clarity.
- Use formatting (bullet points, bold text) to make it readable.

*Knowledge Base:*
- *Interest Rates:* APR, fixed vs floating.
- *Fees:* Processing fees, prepayment penalties, late fees.
- *Eligibility:* Income requirements, credit score thresholds (750+ usually good), employment stability.
- *Documents:* ID proof, address proof, income proof (salary slips, ITR).
- *Process:* Application -> Verification -> Disbursal.

*Common Questions to Handle:*
1. "Am I eligible?" (Check their score/income against product rules)
2. "What is the EMI?" (Explain the formula or give an estimate if amount/tenure known)
3. "Hidden charges?" (Explain processing fees, etc.)
4. "Required documents?"

*Refusal Strategy:*
- If asked about non-loan topics (e.g., "Write code", "Recipe"), politely decline and steer back to loans.
- If asked for definitive financial advice ("Should I invest in stocks?"), disclaim you are an AI and suggest consulting a certified advisor.

*Specific Rules:*
- If User Income < Product Min Income -> Warn about eligibility.
- If User Credit Score < Product Min Score -> Warn about eligibility.
- Always be encouraging but realistic.

*Response Structure:*
- Direct Answer
- Key Detail/Warning (if applicable)
- Helpful Next Step (e.g., "Check your documents", "Apply now")

*Key Topics:*
- Application Process: Steps: Application → Document verification → Credit check → Approval → Disbursal
- Repayment: Explain EMI calculation, Payment methods, Prepayment
- IMPORTANT: ALWAYS stay within 80-90 words unless calculating.
`

export async function POST(req: NextRequest) {
    try {
        const { productId, message, history } = await req.json()

        if (!productId || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // 1. Fetch Product Context (Flat schema)
        const product = await prisma.product.findUnique({
            where: { id: productId }
        })

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        // 2. Fetch User Profile
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()

        let authenticatedUser = null
        let userProfile = {
            monthly_income: 0,
            credit_score: 0,
            employment_type: 'Not specified'
        }

        if (authUser && authUser.email) {
            let dbUser = await prisma.user.findUnique({
                where: { email: authUser.email }
            })

            if (!dbUser) {
                try {
                    dbUser = await prisma.user.create({
                        data: {
                            id: authUser.id,
                            email: authUser.email,
                            display_name: authUser.user_metadata?.display_name || 'User',
                            monthly_income: null,
                            credit_score: null
                        }
                    })
                } catch (createError) {
                    dbUser = await prisma.user.findUnique({ where: { id: authUser.id } })
                }
            }

            if (dbUser) {
                authenticatedUser = dbUser
                if (dbUser.monthly_income && dbUser.credit_score) {
                    userProfile = {
                        monthly_income: Number(dbUser.monthly_income) || 0,
                        credit_score: dbUser.credit_score ?? 0,
                        employment_type: dbUser.employment_type || 'Not specified'
                    }
                }
            }
        }

        // Fallback for unauthenticated or incomplete users
        if (!authenticatedUser) {
            authenticatedUser = await prisma.user.findFirst({
                where: {
                    monthly_income: { not: null },
                    credit_score: { not: null }
                }
            })
            if (authenticatedUser) {
                userProfile = {
                    monthly_income: Number(authenticatedUser.monthly_income) || 0,
                    credit_score: authenticatedUser.credit_score ?? 0,
                    employment_type: authenticatedUser.employment_type || 'Not specified'
                }
            }
        }

        // 3. Construct System Context
        // Note: Using fields directly from the flat Product model
        const productContext = `
        ACTIVE PRODUCT: ${product.name}
        Bank: ${product.bank}
        Type: ${product.type}
        Interest Rate (APR): ${product.rate_apr}%
        Processing Fee: ${product.processing_fee_pct}%
        Min Income Required: ${product.min_income}
        Min Credit Score: ${product.min_credit_score}
        Tenure: ${product.tenure_min_months} - ${product.tenure_max_months} months
        Disbursal Speed: ${product.disbursal_speed}
        Docs Level: ${product.docs_level}
        Summary: ${product.summary || "N/A"}
        Terms: ${JSON.stringify(product.terms)}
        `

        const userContext = `
        USER PROFILE:
        Monthly Income: ${userProfile.monthly_income}
        Credit Score: ${userProfile.credit_score}
        Employment: ${userProfile.employment_type}
        `

        // 4. Initialize OpenRouter (OpenAI SDK)
        const apiKey = process.env.OPENROUTER_API_KEY

        if (!apiKey) {
            return NextResponse.json({
                answer: `[MOCK AI] I clearly see you are asking about "${message}". However, the API key is missing. Please check your .env file.`
            })
        }

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
            defaultHeaders: {
                "HTTP-Referer": "http://localhost:3000", // Optional, for including your app on OpenRouter rankings
                "X-Title": "Loan Picks Dashboard", // Optional. Shows in rankings on openrouter.ai.
            }
        })

        // 5. Build Message History for Chat Completion
        const messages: any[] = [
            { role: "system", content: SYSTEM_PROMPT + "\n\n" + productContext + "\n\n" + userContext },
        ]

        // Add history
        if (history && Array.isArray(history)) {
            history.forEach((msg: any) => {
                if (msg.role === 'user' || msg.role === 'assistant') {
                    messages.push({ role: msg.role, content: msg.content })
                }
            })
        }

        // Add current message
        messages.push({ role: "user", content: message })

        // 6. Generate Response
        const completion = await openai.chat.completions.create({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: messages,
            max_tokens: 300,
            temperature: 0.7,
        })

        const answer = completion.choices[0].message.content || "I couldn't generate a response. Please try again."

        // 7. Save Chat Session
        if (process.env.DATABASE_URL && authenticatedUser) {
            try {
                // Fetch the EXISTING session for this user+product
                const existingSession = await prisma.aiChatMessage.findUnique({
                    where: {
                        user_id_product_id: {
                            user_id: authenticatedUser.id,
                            product_id: productId
                        }
                    }
                })

                const newMessages = [
                    { role: 'user', content: message, createdAt: new Date() },
                    { role: 'assistant', content: answer, createdAt: new Date() }
                ]

                if (existingSession) {
                    // APPEND to existing messages
                    const currentMessages = existingSession.messages as any[] || []
                    const updatedMessages = [...currentMessages, ...newMessages]

                    await prisma.aiChatMessage.update({
                        where: { id: existingSession.id },
                        data: {
                            messages: updatedMessages
                        }
                    })
                } else {
                    // CREATE new session
                    await prisma.aiChatMessage.create({
                        data: {
                            user_id: authenticatedUser.id,
                            product_id: productId,
                            messages: newMessages
                        }
                    })
                }
            } catch (dbError) {
                console.error("Failed to save chat session:", dbError)
            }
        }

        return NextResponse.json({
            answer: answer
        })

    } catch (error: any) {
        console.error("AI Ask Error:", error)

        // Handle Rate Limits
        if (error.status === 429 || error.message?.includes('429')) {
            return NextResponse.json({
                error: "AI usage limit reached (OpenRouter). Please wait a moment before trying again.",
                isRateLimit: true
            }, { status: 429 })
        }

        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }
}
