import { prisma } from "@/lib/prisma"

export const NotificationService = {
    /**
     * Create a notification for a specific user
     */
    async create({
        userId,
        title,
        message,
        type,
        link
    }: {
        userId: string
        title: string
        message: string
        type: string
        link?: string
    }) {
        return await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                link,
                isRead: false
            }
        })
    },

    /**
     * Create a notification for all active users
     */
    async createGlobal({
        title,
        message,
        type,
        link
    }: {
        title: string
        message: string
        type: string
        link?: string
    }) {
        const users = await prisma.user.findMany({
            where: { isActive: true },
            select: { id: true }
        })

        if (users.length === 0) return

        // Create individual notifications for all users
        return await prisma.notification.createMany({
            data: users.map(user => ({
                userId: user.id,
                title,
                message,
                type,
                link,
                isRead: false
            }))
        })
    }
}
