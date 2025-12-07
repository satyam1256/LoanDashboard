"use client"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useChatStore } from "@/hooks/use-chat-store"
import { ChatInterface } from "./chat-interface"
import { Badge } from "@/components/ui/badge"

export function ChatSheet() {
    const { isOpen, closeChat, activeProduct } = useChatStore()

    if (!activeProduct) return null

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && closeChat()}>
            <SheetContent className="w-[90%] sm:w-[400px] flex flex-col p-6">
                <SheetHeader className="mb-4">
                    <SheetTitle className="flex items-center gap-2">
                        Ask AI Assistant
                        <Badge variant="secondary" className="text-xs font-normal">Beta</Badge>
                    </SheetTitle>
                    <SheetDescription className="text-left">
                        Asking about: <span className="font-semibold text-foreground">{activeProduct.name}</span>
                    </SheetDescription>
                    <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{activeProduct.rate_apr}% APR</Badge>
                        <Badge variant="outline">{activeProduct.type}</Badge>
                    </div>
                </SheetHeader>

                <div className="flex-1 min-h-0 flex flex-col">
                    <ChatInterface />
                </div>

            </SheetContent>
        </Sheet>
    )
}
