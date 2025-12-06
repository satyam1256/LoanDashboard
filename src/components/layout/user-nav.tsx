import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { logout } from "@/app/auth/actions"

export async function UserNav() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden md:inline-block">
                    {user.email}
                </span>
                <form action={logout}>
                    <Button variant="ghost" size="sm">
                        Sign Out
                    </Button>
                </form>
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
