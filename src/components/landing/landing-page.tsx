"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Shield, Zap } from "lucide-react"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 bg-gradient-to-b from-background to-muted/30">
                <div className="space-y-6 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 pb-2">
                        Find Your Perfect Loan <br /> With AI Precision
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Stop guessing. Our AI analyzes your profile to find the best personal, home, and education loans instantly.
                    </p>
                    <div className="flex gap-4 justify-center pt-4">
                        <Link href="/login">
                            <Button size="lg" className="h-12 px-8 text-lg gap-2 shadow-lg shadow-primary/25">
                                Get Started <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/products">
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                                View All Loans
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4 bg-muted/20">
                <div className="container max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-background p-8 rounded-2xl shadow-sm border space-y-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">Instantly Personalized</h3>
                            <p className="text-muted-foreground">We filter through hundreds of products to match your income and credit score.</p>
                        </div>
                        <div className="bg-background p-8 rounded-2xl shadow-sm border space-y-4">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">Unbiased & Transparent</h3>
                            <p className="text-muted-foreground">Clear details on APR, processing fees, and hidden charges. No surprises.</p>
                        </div>
                        <div className="bg-background p-8 rounded-2xl shadow-sm border space-y-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">AI Assistant</h3>
                            <p className="text-muted-foreground">Have specific questions? Our AI reads the fine print so you don't have to.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
