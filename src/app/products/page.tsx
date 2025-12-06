import prisma from "@/lib/db"
import { ProductsClient } from "@/components/products/products-client"

// Force dynamic to avoid caching stale data
export const dynamic = 'force-dynamic'

export default async function AllProductsPage() {
    // Fetch products from DB
    const allProducts = await prisma.product.findMany()

    // Map Decimal to number for the client
    const formatProduct = (p: any) => ({
        ...p,
        rate_apr: Number(p.rate_apr),
        min_income: Number(p.min_income),
        processing_fee_pct: Number(p.processing_fee_pct)
    })

    return (
        <ProductsClient initialProducts={allProducts.map(formatProduct)} />
    )
}
