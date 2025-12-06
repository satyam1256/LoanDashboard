"use client"

import { useState } from "react"
import { submitOnboarding } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function OnboardingPage() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        const res = await submitOnboarding(formData)
        if (res?.error) {
            setIsLoading(false)
            toast({
                variant: "destructive",
                title: "Error",
                description: res.error
            })
        }
        // Redirect happens on server
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Complete Your Profile</CardTitle>
                    <CardDescription>
                        To find the best loans for you, we need a few details about your finances.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="income">Monthly Income (₹)</Label>
                            <Input
                                id="income"
                                name="income"
                                type="number"
                                placeholder="e.g. 50000"
                                min="0"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="creditScore">Credit Score</Label>
                            <Input
                                id="creditScore"
                                name="creditScore"
                                type="number"
                                placeholder="e.g. 750"
                                min="300"
                                max="900"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="employment">Employment Type</Label>
                            <Select name="employment" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="salaried">Salaried</SelectItem>
                                    <SelectItem value="self_employed">Self Employed</SelectItem>
                                    <SelectItem value="business">Business Owner</SelectItem>
                                    <SelectItem value="student">Student</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Saving..." : "See My Loan Picks"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
