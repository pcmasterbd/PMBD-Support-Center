'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function createUser(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            name,
            email,
            phone,
            passwordHash,
            role,
        }
    })

    revalidatePath('/dashboard/admin/users')
}

export async function updateUser(userId: string, formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const role = formData.get('role') as string
    const isActive = formData.get('isActive') === 'true'

    await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            email,
            phone,
            role,
            isActive
        }
    })

    revalidatePath('/dashboard/admin/users')
}

export async function deleteUser(userId: string) {
    await prisma.user.delete({
        where: { id: userId }
    })

    revalidatePath('/dashboard/admin/users')
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
    await prisma.user.update({
        where: { id: userId },
        data: { isActive }
    })

    revalidatePath('/dashboard/admin/users')
}

export async function searchUsers(query: string) {
    if (!query || query.length < 2) return []

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                { phone: { contains: query, mode: 'insensitive' } }
            ]
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true
        },
        take: 5
    })

    return users
}
