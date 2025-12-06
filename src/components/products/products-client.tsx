"use client"

import { useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { ProductCard } from "@/components/dashboard/product-card"
import { ProductFilters } from "@/components/products/product-filters"
import { useChatStore } from "@/hooks/use-chat-store"
import { Product } from "@/types"

interface ProductsClientProps {
    initialProducts: Product[]
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
    const { openChat } = useChatStore()

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Initialize state from URL params
    const filters = {
        search: searchParams.get('search') || "",
        maxApr: Number(searchParams.get('maxApr')) || 20,
        minIncome: Number(searchParams.get('minIncome')) || 0,
        minCreditScore: Number(searchParams.get('minCreditScore')) || 0
    }

    const setFilters = (newFilters: typeof filters) => {
        const params = new URLSearchParams(searchParams)
        if (newFilters.search) params.set('search', newFilters.search)
        else params.delete('search')

        if (newFilters.maxApr < 20) params.set('maxApr', newFilters.maxApr.toString())
        else params.delete('maxApr')

        if (newFilters.minIncome > 0) params.set('minIncome', newFilters.minIncome.toString())
        else params.delete('minIncome')

        if (newFilters.minCreditScore > 0) params.set('minCreditScore', newFilters.minCreditScore.toString())
        else params.delete('minCreditScore')

        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

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
