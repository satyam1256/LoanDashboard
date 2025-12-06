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
        <Card className="group h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-muted/60">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-gray-200">
                            {product.bank}
                        </Badge>
                        <CardTitle className="text-xl font-bold text-foreground leading-tight">{product.name}</CardTitle>
                    </div>
                    <div className="text-right bg-primary/5 px-3 py-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                        <span className="block text-2xl font-extrabold text-primary leading-none">{product.rate_apr}%</span>
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">APR</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-grow space-y-5">
                <div className="flex flex-wrap gap-2 min-h-[56px]">
                    {badges.slice(0, 3).map((badge, idx) => ( // Show top 3 badges
                        <Badge key={idx} className={`${badge.color} text-white border-0 shadow-sm font-medium px-2 py-0.5`}>
                            {badge.icon && <badge.icon className="w-3 h-3 mr-1.5" />}
                            {badge.label}
                        </Badge>
                    ))}
                    {badges.length > 3 && (
                        <Badge variant="secondary" className="text-xs font-medium">+{badges.length - 3} more</Badge>
                    )}
                </div>

                <div className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {product.summary}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
                    <div className="flex flex-col p-2 rounded-md bg-muted/30">
                        <span className="text-muted-foreground text-[10px] uppercase font-semibold">Min Score</span>
                        <span className="font-bold text-foreground">{product.min_credit_score > 0 ? product.min_credit_score : 'N/A'}</span>
                    </div>
                    <div className="flex flex-col p-2 rounded-md bg-muted/30">
                        <span className="text-muted-foreground text-[10px] uppercase font-semibold">Tenure</span>
                        <span className="font-bold text-foreground">{product.tenure_min_months}-{product.tenure_max_months} mo</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2">
                <Button
                    className="w-full gap-2 font-semibold shadow-sm group-hover:shadow-md transition-all"
                    variant="default"
                    size="lg"
                    onClick={() => onAskClick?.(product)}
                    aria-label={`Ask AI about ${product.name}`}
                >
                    <MessageCircle className="w-4 h-4" />
                    Ask Assistant
                </Button>
            </CardFooter>
        </Card>
    )
}
