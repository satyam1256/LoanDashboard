import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const products = [
        {
            name: "HDFC Personal Loan",
            bank: "HDFC Bank",
            type: "personal",
            rate_apr: 10.5,
            min_income: 25000,
            min_credit_score: 750,
            tenure_min_months: 12,
            tenure_max_months: 60,
            processing_fee_pct: 1.5,
            prepayment_allowed: true,
            disbursal_speed: "24 hours",
            docs_level: "minimal", // "low docs"
            summary: "Quick personal loan for salaried individuals with low documentation."
        },
        {
            name: "SBI Education Loan",
            bank: "SBI",
            type: "education",
            rate_apr: 8.5,
            min_income: 0,
            min_credit_score: 0,
            tenure_min_months: 12,
            tenure_max_months: 180,
            processing_fee_pct: 0,
            prepayment_allowed: true,
            disbursal_speed: "7 days",
            docs_level: "high",
            summary: "Comprehensive education loan for studies in India and abroad."
        },
        {
            name: "ICICI Home Loan",
            bank: "ICICI Bank",
            type: "home",
            rate_apr: 9.0,
            min_income: 40000,
            min_credit_score: 700,
            tenure_min_months: 60,
            tenure_max_months: 360,
            processing_fee_pct: 0.5,
            prepayment_allowed: true,
            disbursal_speed: "standard",
            docs_level: "high",
            summary: "Affordable home loans with balance transfer facilities."
        },
        {
            name: "Axis Vehicle Loan",
            bank: "Axis Bank",
            type: "vehicle",
            rate_apr: 9.5,
            min_income: 30000,
            min_credit_score: 700,
            tenure_min_months: 12,
            tenure_max_months: 84,
            processing_fee_pct: 1.0,
            prepayment_allowed: false,
            disbursal_speed: "48 hours",
            docs_level: "standard",
            summary: "Get on the road quickly with flexible repayment options."
        },
        {
            name: "Kotak Personal Loan",
            bank: "Kotak Mahindra",
            type: "personal",
            rate_apr: 11.0,
            min_income: 30000,
            min_credit_score: 720,
            tenure_min_months: 12,
            tenure_max_months: 48,
            processing_fee_pct: 2.0,
            prepayment_allowed: true,
            disbursal_speed: "instant",
            docs_level: "minimal",
            summary: "Instant personal loan for existing customers."
        },
        {
            name: "Bajaj Finserv PL",
            bank: "Bajaj Finserv",
            type: "personal",
            rate_apr: 13.0,
            min_income: 20000,
            min_credit_score: 650,
            tenure_min_months: 12,
            tenure_max_months: 60,
            processing_fee_pct: 2.5,
            prepayment_allowed: true,
            disbursal_speed: "2 hours",
            docs_level: "minimal", // "Limited-Time Offer" candidate
            summary: "Super fast disbursal for urgent cash needs."
        },
        {
            name: "IDFC First Credit Line",
            bank: "IDFC First Bank",
            type: "credit_line",
            rate_apr: 14.0,
            min_income: 25000,
            min_credit_score: 700,
            tenure_min_months: 3,
            tenure_max_months: 36,
            processing_fee_pct: 1.0,
            prepayment_allowed: true,
            disbursal_speed: "instant",
            docs_level: "minimal",
            summary: "Flexible credit line, pay interest only on what you use."
        },
        {
            name: "Tata Capital Debt Consolidation",
            bank: "Tata Capital",
            type: "debt_consolidation",
            rate_apr: 11.5,
            min_income: 35000,
            min_credit_score: 680,
            tenure_min_months: 12,
            tenure_max_months: 60,
            processing_fee_pct: 1.5,
            prepayment_allowed: true,
            disbursal_speed: "72 hours",
            docs_level: "standard",
            summary: "Consolidate your debts into one manageable EMI."
        },
        {
            name: "Yes Bank Home Loan",
            bank: "Yes Bank",
            type: "home",
            rate_apr: 9.25,
            min_income: 50000,
            min_credit_score: 750,
            tenure_min_months: 60,
            tenure_max_months: 300,
            processing_fee_pct: 0.5,
            prepayment_allowed: true,
            disbursal_speed: "standard",
            docs_level: "high",
            summary: "Home loans with special rates for women applicants."
        },
        {
            name: "IndusInd Personal Loan",
            bank: "IndusInd Bank",
            type: "personal",
            rate_apr: 10.99,
            min_income: 25000,
            min_credit_score: 700,
            tenure_min_months: 12,
            tenure_max_months: 60,
            processing_fee_pct: 2.0,
            prepayment_allowed: true,
            disbursal_speed: "24 hours",
            docs_level: "minimal",
            summary: "Hassle-free personal loans providing quick liquidity."
        }
    ]

    console.log('Seeding...')
    for (const p of products) {
        await prisma.product.create({
            data: p
        })
    }
    console.log('Seeding finished.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
