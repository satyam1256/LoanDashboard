"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "@/components/dashboard/product-card"
import { ProductFilters } from "@/components/products/product-filters"
import { useChatStore } from "@/hooks/use-chat-store"
import { Product } from "@/types"

interface ProductsClientProps {
    initialProducts: Product[]
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
    const { openChat } = useChatStore()

    const [filters, setFilters] = useState({
        search: "",
        maxApr: 20,
        minIncome: 0,
        minCreditScore: 0
    })

    // Extract unique banks for potential dropdown (optional usage)
    const banks = useMemo(() => Array.from(new Set(initialProducts.map(p => p.bank))), [initialProducts])

    const filteredProducts = useMemo(() => {
        return initialProducts.filter(product => {
            // Bank Name Search
            if (filters.search && !product.bank.toLowerCase().includes(filters.search.toLowerCase())) {
                return false
            }
            // APR Filter (Product APR should be <= Selected Max APR)
            if (product.rate_apr > filters.maxApr) {
                return false
            }
            // Income Filter (User inputs THEIR income, show loans where min_income <= THEIR income)
            if (product.min_income > filters.minIncome && filters.minIncome > 0) {
                return false
            }

            // Credit Score Filter: Show products that require at least the selected score
            if (product.min_credit_score < filters.minCreditScore && filters.minCreditScore > 0) {
                return false
            }

            return true
        })
    }, [filters, initialProducts])

    const handleAsk = (product: Product) => {
        openChat(product)
    }

    return (
        <div className="container py-8">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
                    <ProductFilters filters={filters} setFilters={setFilters} banks={banks} />
                </aside>

                {/* Product Grid */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">All Loan Products</h1>
                        <p className="text-muted-foreground">{filteredProducts.length} results found</p>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
                            <h3 className="text-lg font-semibold">No products found</h3>
                            <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} onAskClick={handleAsk} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
