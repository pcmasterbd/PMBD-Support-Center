'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

// Public: Get all published FAQs
export async function getPublishedFAQs() {
    try {
        const faqs = await prisma.fAQ.findMany({
            where: { isPublished: true },
            orderBy: { displayOrder: 'asc' }
        })
        return { success: true, data: faqs }
    } catch (error) {
        console.error("Failed to fetch FAQs:", error)
        return { success: false, error: "Failed to load FAQs" }
    }
}

// Admin: Get all FAQs
export async function getAllFAQs() {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        const faqs = await prisma.fAQ.findMany({
            orderBy: { displayOrder: 'asc' }
        })
        return { success: true, data: faqs }
    } catch (error) {
        return { success: false, error: "Failed to load FAQs" }
    }
}

// Admin: Create FAQ
export async function createFAQ(data: {
    question: string
    answer: string
    category: string
    tags?: string
    displayOrder?: number
}) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        await prisma.fAQ.create({
            data: {
                ...data,
                isPublished: true // Default to published
            }
        })

        revalidatePath('/support/faq')
        revalidatePath('/dashboard/admin/content/faq')
        return { success: true, message: "FAQ created successfully" }
    } catch (error) {
        return { success: false, error: "Failed to create FAQ" }
    }
}

// Admin: Update FAQ
export async function updateFAQ(id: string, data: {
    question?: string
    answer?: string
    category?: string
    tags?: string
    isPublished?: boolean
    displayOrder?: number
}) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        await prisma.fAQ.update({
            where: { id },
            data
        })

        revalidatePath('/support/faq')
        revalidatePath('/dashboard/admin/content/faq')
        return { success: true, message: "FAQ updated successfully" }
    } catch (error) {
        return { success: false, error: "Failed to update FAQ" }
    }
}

// Admin: Delete FAQ
export async function deleteFAQ(id: string) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        await prisma.fAQ.delete({ where: { id } })

        revalidatePath('/support/faq')
        revalidatePath('/dashboard/admin/content/faq')
        return { success: true, message: "FAQ deleted successfully" }
    } catch (error) {
        return { success: false, error: "Failed to delete FAQ" }
    }
}
