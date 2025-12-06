"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "@/components/dashboard/product-card"
import { ProductFilters } from "@/components/products/product-filters"
import { useChatStore } from "@/hooks/use-chat-store"
import { Product } from "@/types"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

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
        <div className="container py-8 space-y-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">All Loan Products</h1>
                    <p className="text-muted-foreground mt-1">Found {filteredProducts.length} loan options matching your criteria</p>
                </div>

                {/* Mobile Filter Button */}
                <div className="md:hidden w-full">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full gap-2">
                                <Filter className="w-4 h-4" />
                                Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[540px] overflow-y-auto">
                            <div className="py-4">
                                <h3 className="text-lg font-semibold mb-4">Filter Products</h3>
                                <ProductFilters filters={filters} setFilters={setFilters} banks={banks} />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Desktop Sidebar Filters */}
                <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0 sticky top-24">
                    <ProductFilters filters={filters} setFilters={setFilters} banks={banks} />
                </aside>

                {/* Product Grid */}
                <div className="flex-1 w-full">
                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 bg-muted/30 rounded-xl border border-dashed border-muted-foreground/25">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Filter className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">No products found</h3>
                            <p className="text-muted-foreground text-center max-w-sm mt-2">
                                We couldn't find any loans matching your current filters. Try adjusting your search criteria.
                            </p>
                            <Button
                                variant="link"
                                onClick={() => setFilters({ search: "", maxApr: 20, minIncome: 0, minCreditScore: 0 })}
                                className="mt-4"
                            >
                                Clear all filters
                            </Button>
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
