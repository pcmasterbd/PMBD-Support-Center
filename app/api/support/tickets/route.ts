import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { subject, priority, message } = body

        if (!subject || !message) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        // Create ticket and first message in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const ticket = await tx.supportTicket.create({
                data: {
                    userId: session.user.id,
                    subject,
                    priority,
                    status: 'OPEN',
                }
            })

            await tx.ticketMessage.create({
                data: {
                    ticketId: ticket.id,
                    userId: session.user.id,
                    message,
                }
            })

            // Log activity
            await tx.userActivity.create({
                data: {
                    userId: session.user.id,
                    action: 'SUPPORT_TICKET_CREATED',
                    details: `New ticket: ${subject}`,
                }
            })

            return ticket
        })

        return NextResponse.json({
            success: true,
            ticketId: result.id
        })

    } catch (error) {
        console.error('[TICKET_CREATE_ERROR]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
