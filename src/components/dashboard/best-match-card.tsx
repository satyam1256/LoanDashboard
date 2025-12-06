import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from "@/types"
import { MessageCircle, Check, Star } from "lucide-react"

interface BestMatchCardProps {
    product: Product
    onAskClick?: (product: Product) => void
}

export function BestMatchCard({ product, onAskClick }: BestMatchCardProps) {
    return (
        <Card className="w-full bg-gradient-to-br from-primary/5 via-primary/10 to-background border-primary/20 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg flex items-center gap-1 z-10">
                <Star className="w-3 h-3 fill-current" /> BEST MATCH
            </div>

            <div className="grid md:grid-cols-3 gap-6 p-6">
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-background">{product.bank}</Badge>
                            <Badge variant="secondary" className="capitalize">{product.type}</Badge>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight">{product.name}</h3>
                        <p className="text-muted-foreground mt-2">{product.summary}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                        <div className="bg-background/50 p-3 rounded-lg border">
                            <p className="text-xs text-muted-foreground uppercase">Interest Rate</p>
                            <p className="text-2xl font-bold text-primary">{product.rate_apr}%</p>
                        </div>
                        <div className="bg-background/50 p-3 rounded-lg border">
                            <p className="text-xs text-muted-foreground uppercase">Loan Tenure</p>
                            <p className="text-xl font-semibold">{product.tenure_min_months}-{product.tenure_max_months} Months</p>
                        </div>
                        <div className="bg-background/50 p-3 rounded-lg border">
                            <p className="text-xs text-muted-foreground uppercase">Processing Fee</p>
                            <p className="text-xl font-semibold">{product.processing_fee_pct}%</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-3 border-l pl-6 border-dashed border-primary/20">
                    <h4 className="font-semibold text-sm mb-2">Why this works for you:</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>High approval chance</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>Fits your credit score ({product.min_credit_score}+)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 mt-0.5" />
                            <span>{product.disbursal_speed} disbursal</span>
                        </li>
                    </ul>

                    <Button
                        onClick={() => onAskClick?.(product)}
                        className="w-full mt-4 gap-2 shadow-lg hover:shadow-xl transition-all"
                        size="lg"
                    >
                        <MessageCircle className="w-4 h-4" /> Ask AI Assistant
                    </Button>
                </div>
            </div>
        </Card>
    )
}
