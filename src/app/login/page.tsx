"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login, signup } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (formData: FormData, action: typeof login | typeof signup, type: 'login' | 'signup') => {
        setIsLoading(true)
        const res = await action(formData)

        if (res?.error) {
            setIsLoading(false)
            toast({
                variant: "destructive",
                title: "Error",
                description: res.error
            })
        } else if (res?.success && res?.redirectTo) {
            toast({
                title: "Success",
                description: type === 'login' ? "Logged in successfully" : "Account created successfully"
            })

            // Allow cookies to set, then navigate.
            // Do NOT set isLoading(false) here, keep it true while navigating to prevent UI flash
            await new Promise(resolve => setTimeout(resolve, 100))
            router.push(res.redirectTo)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>Enter your email below to login to your account.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <form action={(formData) => handleSubmit(formData, login, 'login')} className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={isLoading} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" required disabled={isLoading} />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Logging in...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sign Up</CardTitle>
                            <CardDescription>Create a new account to see personalized offers.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <form action={(formData) => handleSubmit(formData, signup, 'signup')} className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" placeholder="John Doe" required disabled={isLoading} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={isLoading} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" required disabled={isLoading} />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
