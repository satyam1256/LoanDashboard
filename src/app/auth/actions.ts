'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'

export async function login(formData: FormData) {
    const supabase = createClient()

    // Type-casting for simplicity, use Zod in real apps
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const displayName = formData.get('name') as string

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
        return { error: error.message }
    }

    // Sync user to our Postgres 'users' table if needed (via Prisma)
    // Note: triggers are better, but basic sync here for the assignment
    if (data.user) {
        try {
            await prisma.user.create({
                data: {
                    id: data.user.id,
                    email: data.user.email!,
                    display_name: displayName
                }
            })
        } catch (e) {
            console.error("Failed to create user record in Prisma:", e)
            // Don't block auth if sync fails, but ideally handle this
        }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
