'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

// Customer: Submit feedback
export async function submitFeedback(ticketId: string, rating: number, comment?: string) {
    try {
        const session = await auth()
        if (!session?.user) {
            return { success: false, error: "Unauthorized" }
        }

        // Verify ticket belongs to user and is resolved
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            include: { feedback: true }
        })

        if (!ticket) return { success: false, error: "Ticket not found" }
        if (ticket.userId !== session.user.id) return { success: false, error: "Unauthorized" }
        // Logic: Allow feedback even if not resolved? Usually only on resolved.
        // Spec says "When ticket is marked RESOLVED"
        if (ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED') {
            return { success: false, error: "Ticket is not resolved yet" }
        }

        if (ticket.feedback) {
            return { success: false, error: "Feedback already submitted" }
        }

        await prisma.ticketFeedback.create({
            data: {
                ticketId,
                rating,
                comment
            }
        })

        revalidatePath(`/dashboard/customer/tickets/${ticketId}`)
        return { success: true, message: "Thank you for your feedback!" }
    } catch (error) {
        console.error("Failed to submit feedback:", error)
        return { success: false, error: "Failed to submit feedback" }
    }
}

// Admin: Get Feedback Stats
export async function getFeedbackStats() {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        const feedbacks = await prisma.ticketFeedback.findMany({
            select: { rating: true }
        })

        if (feedbacks.length === 0) {
            return { success: true, average: 0, count: 0 }
        }

        const total = feedbacks.reduce((acc, curr) => acc + curr.rating, 0)
        const average = total / feedbacks.length

        return { success: true, average, count: feedbacks.length }
    } catch (error) {
        return { success: false, error: "Failed to load stats" }
    }
}
