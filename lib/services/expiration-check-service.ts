import { prisma } from "@/lib/prisma"
import { NotificationService } from "./notification-service"
import { startOfDay, endOfDay, addDays } from "date-fns"

export const ExpirationCheckService = {
    /**
     * Checks for serial numbers expiring in exactly 7 days and sends notifications.
     * This should ideally run once per day.
     */
    async checkAndNotifyExpirations() {
        const targetDate = addDays(new Date(), 7)
        const startOfTargetDay = startOfDay(targetDate)
        const endOfTargetDay = endOfDay(targetDate)

        // Find serials expiring on the target day
        const expiringSerials = await prisma.serialNumber.findMany({
            where: {
                expiresAt: {
                    gte: startOfTargetDay,
                    lte: endOfTargetDay
                },
                status: 'ASSIGNED'
            },
            include: {
                user: true
            }
        })

        for (const serial of expiringSerials) {
            if (!serial.user) continue

            // Check if we already sent an expiration warning recently to avoid duplicates
            const existingNotification = await prisma.notification.findFirst({
                where: {
                    userId: serial.user.id,
                    type: 'EXPIRATION_WARNING',
                    createdAt: {
                        gte: startOfDay(new Date()) // Sent today
                    }
                }
            })

            if (!existingNotification) {
                await NotificationService.create({
                    userId: serial.user.id,
                    title: "Account Expiring Soon",
                    message: `Your account will expire on ${serial.expiresAt?.toLocaleDateString()}. Please renew soon to avoid service interruption.`,
                    type: 'EXPIRATION_WARNING',
                    link: '/dashboard/profile'
                })
            }
        }

        return expiringSerials.length
    }
}
