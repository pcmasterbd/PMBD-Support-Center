import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const ticket = await prisma.supportTicket.findUnique({
            where: { id: id },
            select: { userId: true, status: true }
        })

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
        }

        // Security check
        const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN'
        const isOwner = ticket.userId === session.user.id

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (ticket.status === 'CLOSED') {
            return NextResponse.json({ error: 'Ticket is closed' }, { status: 400 })
        }

        const body = await req.json()
        const { message } = body

        if (!message) {
            return NextResponse.json({ error: 'Missing message' }, { status: 400 })
        }

        // Create message and update ticket timestamp in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const newMessage = await tx.ticketMessage.create({
                data: {
                    ticketId: id,
                    userId: session.user.id,
                    message,
                }
            })

            // Update ticket status if admin replied, or just updatedAt
            await tx.supportTicket.update({
                where: { id: id },
                data: {
                    updatedAt: new Date(),
                    status: isAdmin ? 'IN_PROGRESS' : undefined
                }
            })

            // Log activity
            await tx.userActivity.create({
                data: {
                    userId: session.user.id,
                    action: 'SUPPORT_MESSAGE_SENT',
                    details: `Replied to ticket ${id}`,
                }
            })

            return newMessage
        })

        return NextResponse.json({ success: true, messageId: result.id })

    } catch (error) {
        console.error('[TICKET_MESSAGE_ERROR]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
