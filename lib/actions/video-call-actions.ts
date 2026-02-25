'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NotificationService } from "../services/notification-service"
import { v4 as uuidv4 } from "uuid"

export async function createMeetingLink(ticketId: string) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        // Generate a unique room ID
        const roomName = `pmbd-call-${ticketId.slice(-6)}-${uuidv4().slice(0, 6)}`

        // Find the ticket to get the userId of the customer
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            select: { userId: true, subject: true }
        })

        if (!ticket) return { success: false, error: "Ticket not found" }

        // Send a notification to the user
        await NotificationService.create({
            userId: ticket.userId,
            title: "Expert Video Call Invite",
            message: `Admin is inviting you to a video call for ticket: ${ticket.subject}`,
            type: "VIDEO",
            link: `/dashboard/support/${ticketId}?roomId=${roomName}`
        })

        return { success: true, roomName }
    } catch (error) {
        console.error("Failed to create meeting link:", error)
        return { success: false, error: "Failed to initiate call" }
    }
}
