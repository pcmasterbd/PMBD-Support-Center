'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

// Public/User: Get active announcements
export async function getActiveAnnouncements() {
    try {
        const now = new Date()
        const announcements = await prisma.announcement.findMany({
            where: {
                isActive: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: now } }
                ]
            },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, data: announcements }
    } catch (error) {
        console.error("Failed to fetch announcements:", error)
        return { success: false, error: "Failed to load announcements" }
    }
}

// SuperAdmin: Get all announcements
export async function getAllAnnouncements() {
    try {
        const session = await auth()
        if (session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        const announcements = await prisma.announcement.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, data: announcements }
    } catch (error) {
        return { success: false, error: "Failed to load announcements" }
    }
}

// SuperAdmin: Create Announcement
export async function createAnnouncement(data: {
    title: string
    message: string
    type: string
    isActive: boolean
    expiresAt?: string | null
}) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        await prisma.announcement.create({
            data: {
                title: data.title,
                message: data.message,
                type: data.type,
                isActive: data.isActive,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null
            }
        })

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/superadmin/announcements')
        return { success: true, message: "Announcement created" }
    } catch (error) {
        return { success: false, error: "Failed to create announcement" }
    }
}

// SuperAdmin: Update Announcement
export async function updateAnnouncement(id: string, data: {
    title?: string
    message?: string
    type?: string
    isActive?: boolean
    expiresAt?: string | null
}) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        await prisma.announcement.update({
            where: { id },
            data: {
                ...data,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : (data.expiresAt === null ? null : undefined)
            }
        })

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/superadmin/announcements')
        return { success: true, message: "Announcement updated" }
    } catch (error) {
        return { success: false, error: "Failed to update announcement" }
    }
}

// SuperAdmin: Delete Announcement
export async function deleteAnnouncement(id: string) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        await prisma.announcement.delete({ where: { id } })

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/superadmin/announcements')
        return { success: true, message: "Announcement deleted" }
    } catch (error) {
        return { success: false, error: "Failed to delete announcement" }
    }
}
