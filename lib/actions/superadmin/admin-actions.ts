'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { hash } from "bcryptjs"
import { auth } from "@/auth"

export async function getAdmins() {
    try {
        const admins = await prisma.user.findMany({
            where: {
                role: {
                    in: ['ADMIN', 'SUPERADMIN']
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                lastLogin: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return { success: true, data: admins }
    } catch (error) {
        console.error("Failed to fetch admins:", error)
        return { success: false, error: "Failed to fetch admins" }
    }
}

export async function createAdmin(formData: FormData) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const role = formData.get('role') as string || 'ADMIN'

        if (!name || !email || !password) {
            return { success: false, error: "Missing required fields" }
        }

        // Check existing
        const existing = await prisma.user.findUnique({
            where: { email }
        })

        if (existing) {
            return { success: false, error: "User with this email already exists" }
        }

        const hashedPassword = await hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                phone: `admin-phone-${Math.floor(Date.now() / 1000)}`,
                role,
                isActive: true,
                emailVerified: new Date() // Auto verify admin emails
            }
        })

        // Log action (will implement logging later properly)

        revalidatePath('/dashboard/superadmin/admins')
        return { success: true, message: "Admin created successfully" }
    } catch (error) {
        console.error("Create admin failed:", error)
        return { success: false, error: "Failed to create admin" }
    }
}

export async function updateAdmin(id: string, formData: FormData) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const role = formData.get('role') as string
        const isActive = formData.get('isActive') === 'true'

        await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                role,
                isActive
            }
        })

        revalidatePath('/dashboard/superadmin/admins')
        return { success: true, message: "Admin updated successfully" }
    } catch (error) {
        return { success: false, error: "Failed to update admin" }
    }
}

export async function deleteAdmin(id: string) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        if (session.user.id === id) {
            return { success: false, error: "Cannot delete yourself" }
        }

        await prisma.user.delete({
            where: { id }
        })

        revalidatePath('/dashboard/superadmin/admins')
        return { success: true, message: "Admin deleted successfully" }
    } catch (error) {
        return { success: false, error: "Failed to delete admin" }
    }
}

export async function resetAdminPassword(id: string, newPassword: string) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        const hashedPassword = await hash(newPassword, 10)

        await prisma.user.update({
            where: { id },
            data: {
                passwordHash: hashedPassword
            }
        })

        revalidatePath('/dashboard/superadmin/admins')
        return { success: true, message: "Password reset successfully" }
    } catch (error) {
        return { success: false, error: "Failed to reset password" }
    }
}
