export type Product = {
    id: string
    name: string
    bank: string
    type: string
    rate_apr: number
    min_income: number
    min_credit_score: number
    tenure_min_months: number
    tenure_max_months: number
    processing_fee_pct: number
    prepayment_allowed: boolean
    disbursal_speed: string
    docs_level: string
    summary?: string
}
