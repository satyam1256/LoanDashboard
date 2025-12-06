import { create } from 'zustand'
import { Product } from '@/types'

export type Message = {
    id: string
    role: 'user' | 'assistant'
    content: string
    createdAt: Date
}

interface ChatState {
    isOpen: boolean
    activeProduct: Product | null
    messages: Message[]
    isLoading: boolean

    openChat: (product: Product) => void
    closeChat: () => void
    addMessage: (message: Message) => void
    setLoading: (loading: boolean) => void
}

export const useChatStore = create<ChatState>((set) => ({
    isOpen: false,
    activeProduct: null,
    messages: [],
    isLoading: false,

    openChat: (product) => set((state) => {
        // If opening for a different product, clear messages
        if (state.activeProduct?.id !== product.id) {
            return { isOpen: true, activeProduct: product, messages: [] }
        }
        return { isOpen: true, activeProduct: product }
    }),

    closeChat: () => set({ isOpen: false }),

    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),

    setLoading: (loading) => set({ isLoading: loading })
}))
