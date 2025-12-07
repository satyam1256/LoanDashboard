"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatStore } from "@/hooks/use-chat-store"
import { useToast } from "@/hooks/use-toast"

import { getChatHistory } from "@/app/actions/chat"

export function ChatInterface() {
    const { messages, addMessage, setMessages, isLoading, setLoading, activeProduct } = useChatStore()
    const [input, setInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)
    const { toast } = useToast()

    // Load chat history
    useEffect(() => {
        const loadHistory = async () => {
            if (activeProduct?.id) {
                const history = await getChatHistory(activeProduct.id)
                if (history.length > 0) {
                    setMessages(history)
                }
            }
        }
        loadHistory()
    }, [activeProduct?.id, setMessages])

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isLoading])

    const handleSend = async () => {
        if (!input.trim() || !activeProduct) return

        const userMsg = {
            id: Date.now().toString(),
            role: 'user' as const,
            content: input,
            createdAt: new Date()
        }
        addMessage(userMsg)
        setInput("")
        setLoading(true)

        try {
            const response = await fetch('/api/ai/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: activeProduct.id,
                    message: userMsg.content,
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Failed to get response")

            addMessage({
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.answer,
                createdAt: new Date()
            })
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to connect to AI assistant. Please try again."
            })
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full max-h-full">
            <ScrollArea className="flex-1 min-h-0 pr-4">
                <div className="space-y-4 pb-4">
                    {messages.length === 0 && (
                        <div className="text-center text-muted-foreground py-10 px-4">
                            <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Ask anything about <strong>{activeProduct?.name}</strong>!</p>
                            <p className="text-sm mt-2">"What are the documents required?"</p>
                            <p className="text-sm">"Is there a prepayment penalty?"</p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`rounded-lg p-3 text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-muted rounded-lg p-3 text-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="pt-4 flex-shrink-0 border-t">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend() }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question..."
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
