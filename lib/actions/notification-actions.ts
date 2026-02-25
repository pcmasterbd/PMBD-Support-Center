'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { ExpirationCheckService } from "../services/expiration-check-service"

export async function runExpirationCheck() {
    try {
        const session = await auth()
        if (session?.user?.role !== 'SUPERADMIN' && session?.user?.role !== 'ADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        const notifiedCount = await ExpirationCheckService.checkAndNotifyExpirations()
        return { success: true, count: notifiedCount }
    } catch (error) {
        console.error("Expiration check failed:", error)
        return { success: false, error: "Check failed" }
    }
}

export async function getUserNotifications() {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "Unauthorized" }

        const notifications = await prisma.notification.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 20
        })

        return { success: true, data: notifications }
    } catch (error) {
        console.error("Failed to fetch notifications:", error)
        return { success: false, error: "Failed to load notifications" }
    }
}

export async function markNotificationAsRead(id: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "Unauthorized" }

        await prisma.notification.update({
            where: { id, userId: session.user.id },
            data: { isRead: true }
        })

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to update notification" }
    }
}

export async function markAllNotificationsAsRead() {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "Unauthorized" }

        await prisma.notification.updateMany({
            where: { userId: session.user.id, isRead: false },
            data: { isRead: true }
        })

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to update notifications" }
    }
}

export async function getUnreadNotificationCount() {
    try {
        const session = await auth()
        if (!session?.user?.id) return 0

        const count = await prisma.notification.count({
            where: { userId: session.user.id, isRead: false }
        })

        return count
    } catch (error) {
        return 0
    }
}
