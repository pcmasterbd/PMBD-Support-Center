import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string, messageId: string }> }
) {
    const { id, messageId } = await params
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN'

        // Check if ticket exists and user has access
        const ticket = await prisma.supportTicket.findUnique({
            where: { id },
            select: { userId: true }
        })

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
        }

        if (ticket.userId !== session.user.id && !isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { emoji } = body

        if (!emoji) {
            return NextResponse.json({ error: 'Missing emoji' }, { status: 400 })
        }

        // Toggle reaction
        const existingReaction = await prisma.ticketMessageReaction.findUnique({
            where: {
                messageId_userId: {
                    messageId,
                    userId: session.user.id,
                }
            }
        })

        if (existingReaction) {
            if (existingReaction.emoji === emoji) {
                // Same emoji, remove it (toggle off)
                await prisma.ticketMessageReaction.delete({
                    where: { id: existingReaction.id }
                })
                return NextResponse.json({ success: true, action: 'removed' })
            } else {
                // Different emoji, update it
                await prisma.ticketMessageReaction.update({
                    where: { id: existingReaction.id },
                    data: { emoji }
                })
                return NextResponse.json({ success: true, action: 'updated' })
            }
        } else {
            // New reaction
            await prisma.ticketMessageReaction.create({
                data: {
                    messageId,
                    userId: session.user.id,
                    emoji
                }
            })
            return NextResponse.json({ success: true, action: 'added' })
        }

    } catch (error) {
        console.error('[TICKET_REACTION_ERROR]', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
