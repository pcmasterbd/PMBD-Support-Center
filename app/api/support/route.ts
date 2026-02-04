import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { subject, message } = body

        if (!subject || !message) {
            return NextResponse.json(
                { error: 'Subject and message are required' },
                { status: 400 }
            )
        }

        const ticket = await prisma.supportTicket.create({
            data: {
                userId: session.user.id,
                subject,
                status: 'OPEN',
                messages: {
                    create: {
                        userId: session.user.id,
                        message,
                    }
                }
            },
            include: {
                messages: true,
            }
        })

        return NextResponse.json(ticket, { status: 201 })
    } catch (error) {
        console.error('Support ticket error:', error)
        return NextResponse.json(
            { error: 'Failed to create support ticket' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const tickets = await prisma.supportTicket.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(tickets)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch tickets' },
            { status: 500 }
        )
    }
}
