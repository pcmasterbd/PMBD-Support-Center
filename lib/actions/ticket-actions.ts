'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateTicketStatus(id: string, status: string) {
    await prisma.supportTicket.update({
        where: { id },
        data: { status }
    })
    revalidatePath('/dashboard/admin/support')
    revalidatePath(`/dashboard/admin/support/${id}`)
}

export async function updateTicketPriority(id: string, priority: string) {
    await prisma.supportTicket.update({
        where: { id },
        data: { priority }
    })
    revalidatePath('/dashboard/admin/support')
    revalidatePath(`/dashboard/admin/support/${id}`)
}

export async function deleteTicket(id: string) {
    await prisma.supportTicket.delete({ where: { id } })
    revalidatePath('/dashboard/admin/support')
}

export async function addTicketMessage(ticketId: string, userId: string, message: string) {
    await prisma.ticketMessage.create({
        data: {
            ticketId,
            userId,
            message
        }
    })

    // Also update ticket's updatedAt
    await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { updatedAt: new Date() }
    })

    revalidatePath('/dashboard/admin/support')
    revalidatePath(`/dashboard/admin/support/${ticketId}`)
}
