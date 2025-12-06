'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'

export async function login(formData: FormData) {
    const supabase = createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log("Attempting Login:", email)

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error("Login Error:", error.message)
        if (error.message.includes("Email not confirmed")) {
            return { error: "This account needs email verification. Go to Supabase Dashboard → Authentication → Users → find your email → click the 3 dots → 'Confirm Email'. Or try signing up with a different email." }
        }
        return { error: error.message }
    }

    console.log("Login Success")
    revalidatePath('/', 'layout')
    return { success: true, redirectTo: '/' }
}

export async function signup(formData: FormData) {
    const supabase = createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const displayName = formData.get('name') as string

    console.log("Attempting Signup:", email)

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: displayName
            }
        }
    })

    if (error) {
        console.error("Signup Error:", error.message)
        return { error: error.message }
    }

    if (data.user) {
        console.log("Supabase User Created:", data.user.id)
        // Sync to Prisma with a timeout to prevent hanging
        try {
            const syncPromise = prisma.user.upsert({
                where: { id: data.user.id },
                create: {
                    id: data.user.id,
                    email: data.user.email!,
                    display_name: displayName
                },
                update: {
                    email: data.user.email!,
                    display_name: displayName
                }
            })

            // Race against a 3-second timeout
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("DB Sync Timeout")), 3000)
            )

            await Promise.race([syncPromise, timeoutPromise])
            console.log("Prisma Sync Success")
        } catch (e: unknown) {
            console.error("Prisma Sync Failed/Timed Out:", e)
            // Continue anyway - don't block auth
        }
    }

    console.log("Signup Success")
    revalidatePath('/', 'layout')
    return { success: true, redirectTo: '/onboarding' }
}

export async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    return { success: true, redirectTo: '/login' }
}
