"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import prisma from "@/lib/db"

export async function submitOnboarding(formData: FormData) {
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Not authenticated" }
    }

    const income = parseFloat(formData.get("income") as string)
    const creditScore = parseInt(formData.get("creditScore") as string)
    const employment = formData.get("employment") as string

    if (!income || !creditScore) {
        return { error: "Missing required fields" }
    }

    try {
        await prisma.user.update({
            where: { email: user.email! },
            data: {
                monthly_income: income,
                credit_score: creditScore,
                employment_type: employment
            }
        })
    } catch (e) {
        console.error("Onboarding error:", e)
        return { error: "Failed to update profile" }
    }

    revalidatePath("/")
    redirect("/")
}
