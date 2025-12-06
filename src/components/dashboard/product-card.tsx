import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from "@/types"
import { MessageCircle, CheckCircle2, Zap, FileText } from "lucide-react"

interface ProductCardProps {
    product: Product
    onAskClick?: (product: Product) => void
}

export function ProductCard({ product, onAskClick }: ProductCardProps) {
    // Dynamic Badge Logic
    const badges = []

    if (product.rate_apr < 11) {
        badges.push({ label: "Low APR", color: "bg-green-500 hover:bg-green-600" })
    }
    if (product.prepayment_allowed) {
        badges.push({ label: "No Prepayment Fee", color: "bg-blue-500 hover:bg-blue-600" })
    }
    if (product.disbursal_speed.includes("hour") || product.disbursal_speed === "instant") {
        badges.push({ label: "Fast Disbursal", icon: Zap, color: "bg-amber-500 hover:bg-amber-600" })
    }
    if (product.docs_level === "minimal") {
        badges.push({ label: "Low Docs", icon: FileText, color: "bg-indigo-500 hover:bg-indigo-600" })
    }
    if (product.processing_fee_pct === 0) {
        badges.push({ label: "Zero Processing Fee", color: "bg-emerald-600 hover:bg-emerald-700" })
    }

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardDescription className="text-xs font-semibold uppercase tracking-wider mb-1">{product.bank}</CardDescription>
                        <CardTitle className="text-xl font-bold text-gray-900">{product.name}</CardTitle>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-bold text-primary">{product.rate_apr}%</span>
                        <span className="text-xs text-muted-foreground">APR</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-grow space-y-4">
                <div className="flex flex-wrap gap-2">
                    {badges.slice(0, 3).map((badge, idx) => ( // Show top 3 badges
                        <Badge key={idx} className={`${badge.color} text-white border-0`}>
                            {badge.icon && <badge.icon className="w-3 h-3 mr-1" />}
                            {badge.label}
                        </Badge>
                    ))}
                    {badges.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{badges.length - 3} more</Badge>
                    )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">{product.summary}</p>

                <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Min Score</span>
                        <span className="font-semibold">{product.min_credit_score > 0 ? product.min_credit_score : 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Tenure</span>
                        <span className="font-semibold">{product.tenure_min_months}-{product.tenure_max_months} mo</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    className="w-full gap-2"
                    variant="default"
                    onClick={() => onAskClick?.(product)}
                >
                    <MessageCircle className="w-4 h-4" />
                    Ask About Product
                </Button>
            </CardFooter>
        </Card>
    )
}
