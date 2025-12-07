'use server'

import { createClient } from '@/lib/supabase/server'

export async function getChatHistory(productId: string) {
    try {
        if (!process.env.DATABASE_URL) return []

        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (!authUser || !authUser.email) return []

        const user = await prisma.user.findUnique({
            where: { email: authUser.email }
        })

        if (!user) return []

        const chatSession = await prisma.aiChatMessage.findUnique({
            where: {
                user_id_product_id: {
                    user_id: user.id,
                    product_id: productId
                }
            }
        })

        if (!chatSession || !chatSession.messages) return []

        const messages = (chatSession.messages as any[]).map((msg, index) => ({
            id: `${chatSession.id}-${index}`,
            role: msg.role,
            content: msg.content,
            createdAt: msg.timestamp ? new Date(msg.timestamp) : new Date()
        }))

        return messages
    } catch (error) {
        console.error("Failed to fetch chat history:", error)
        return []
    }
}
