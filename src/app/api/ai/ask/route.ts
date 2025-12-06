import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

// Generic interface for DB Product
type ProductContext = {
    name: string;
    bank: string;
    rate_apr: number | string; // simple parsing
    summary: string | null;
    [key: string]: any;
}

import { z } from 'zod'

// ... imports remain same

// Schema for input validation
const ChatRequestSchema = z.object({
    productId: z.string(),
    message: z.string().min(1),
    history: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string()
    })).optional().default([])
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validation = ChatRequestSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid request data", details: validation.error.format() }, { status: 400 })
        }

        const { productId, message, history } = validation.data

        // 1. Fetch Product Context (DB)
        let product: ProductContext | undefined
        // Try DB first
        if (process.env.DATABASE_URL) {
            try {
                const dbProduct = await prisma.product.findUnique({ where: { id: productId } })
                if (dbProduct) {
                    product = {
                        ...dbProduct,
                        rate_apr: dbProduct.rate_apr.toNumber(),
                        min_income: dbProduct.min_income.toNumber(),
                        processing_fee_pct: dbProduct.processing_fee_pct.toNumber()
                    }
                }
            } catch (e) {
                console.error("DB Connection failed", e)
            }
        }

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        // 2. AI Processing
        const contextString = `
Product: ${product.name}
Bank: ${product.bank}
Type: ${product.type}
APR: ${product.rate_apr}%
Min Credit Score: ${product.min_credit_score}
Tenure: ${product.tenure_min_months}-${product.tenure_max_months} months
Summary: ${product.summary || "N/A"}
Processing Fee: ${product.processing_fee_pct}%
Disbursal Speed: ${product.disbursal_speed}
Docs Level: ${product.docs_level}
Terms: ${JSON.stringify(product.terms || {})}
FAQs: ${JSON.stringify(product.faq || [])}
        `.trim()

        const systemPrompt = `You are a helpful loan assistant for "LoanPicks". 
You are answering a user's question about a SPECIFIC loan product. 
Strictly base your answer on the provided product details below.
If the answer is not in the data, state that you don't have that information.
Do not invent features.
Keep answers concise and helpful.
Use markdown for formatting.

Product Details:
${contextString}
`

        // Check for API Key (Gemini)
        const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY

        if (!apiKey) {
            // Return Mock AI Response
            await new Promise(r => setTimeout(r, 1000)) // Simulate delay
            return NextResponse.json({
                answer: `[MOCK AI] I see you're asking about "${message}". \n\nI am ready to use Gemini, but **GOOGLE_API_KEY** is missing in your .env file.\n\nPlease add it to get real responses.`
            })
        }

        const genAI = new GoogleGenerativeAI(apiKey)

        // Use standard flash 2.0 which is generally available and stable
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-001",
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ],
        })

        // Construct chat history for Gemini
        const chatHistory = history.map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }))

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }]
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I will answer questions about this loan product based on the details provided. I will not invent features." }]
                },
                ...chatHistory
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        })

        const result = await chat.sendMessage(message)
        const response = await result.response
        const answer = response.text()

        return NextResponse.json({
            answer: answer
        })

    } catch (error) {
        console.error("AI Ask Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}


