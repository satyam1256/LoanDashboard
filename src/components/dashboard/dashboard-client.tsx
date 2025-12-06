"use client"

import { BestMatchCard } from "@/components/dashboard/best-match-card"
import { ProductCard } from "@/components/dashboard/product-card"
import { Product } from "@/types"
import { useChatStore } from "@/hooks/use-chat-store"

interface DashboardClientProps {
    bestMatch: Product
    topPicks: Product[]
    totalCount: number
}

export function DashboardClient({ bestMatch, topPicks, totalCount }: DashboardClientProps) {
    const { openChat } = useChatStore()

    const handleAsk = (product: Product) => {
        openChat(product)
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">Your Loan Picks</h1>
                <p className="text-lg text-muted-foreground">
                    We found <span className="font-semibold text-primary">{totalCount} loan offers</span> matching your profile.
                    Here are your top recommendations.
                </p>
            </div>

            {/* Best Match Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    🏆 Top Recommendation
                </h2>
                {bestMatch && <BestMatchCard product={bestMatch} onAskClick={handleAsk} />}
            </section>

            {/* Top Picks Grid */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Other Top Picks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {topPicks.map(product => (
                        <ProductCard key={product.id} product={product} onAskClick={handleAsk} />
                    ))}
                </div>
            </section>

            {/* Explore All CTA */}
            <section className="text-center pt-8">
                <p className="text-muted-foreground mb-4">Looking for something else?</p>
                <a href="/products" className="text-primary font-semibold hover:underline">
                    View all {totalCount} loan products →
                </a>
            </section>
        </div>
    )
}
