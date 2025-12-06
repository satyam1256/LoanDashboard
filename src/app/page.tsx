import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/db"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import LandingPage from "@/components/landing/landing-page"

// Force dynamic since we check auth
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is not logged in, show landing page
  if (!user) {
    return <LandingPage />
  }

  // If user is logged in, show dashboard
  // Fetch products from DB
  const allProducts = await prisma.product.findMany()

  // Simulate personalization logic
  // In a real app, this would query based on user preferences.
  // For now, take the first as best match, next 4 as top picks.
  const bestMatch = allProducts[0]
  const topPicks = allProducts.slice(1, 5)

  // Map Decimal to number for the client
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatProduct = (p: any) => ({
    ...p,
    rate_apr: Number(p.rate_apr),
    min_income: Number(p.min_income),
    processing_fee_pct: Number(p.processing_fee_pct)
  })

  // Safe checks if DB is empty
  if (!bestMatch) {
    return (
      <main className="min-h-screen bg-gray-50/50 p-6 md:p-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold">No loans found</h1>
          <p>Please seed the database.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 md:p-12 space-y-10">
      <DashboardClient
        bestMatch={formatProduct(bestMatch)}
        topPicks={topPicks.map(formatProduct)}
        totalCount={allProducts.length}
      />
    </main>
  )
}
