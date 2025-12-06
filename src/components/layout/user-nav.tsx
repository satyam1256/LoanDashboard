"use client"

import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"

export function UserNav() {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isInitializing, setIsInitializing] = useState(true)

    useEffect(() => {
        const supabase = createClient()

        // Get initial user immediately
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
            setIsInitializing(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setIsInitializing(false)
        })

        return () => subscription.unsubscribe()
    }, [pathname]) // Re-run when pathname changes

    const handleLogout = async () => {
        setIsLoading(true)
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
        setIsLoading(false)
    }

    // Show loading skeleton while initializing
    if (isInitializing) {
        return (
            <div className="flex items-center gap-4">
                <div className="h-8 w-32 bg-muted animate-pulse rounded hidden md:block" />
                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            </div>
        )
    }

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden md:inline-block">
                    {user.email}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    disabled={isLoading}
                >
                    {isLoading ? "Signing out..." : "Sign Out"}
                </Button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <Link href="/login">
                <Button variant="ghost" size="sm">
                    Log in
                </Button>
            </Link>
            <Link href="/login">
                <Button size="sm">Sign Up</Button>
            </Link>
        </div>
    )
}
