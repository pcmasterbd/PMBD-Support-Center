import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const session = await auth()

        if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { status, adminNotes } = body

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            )
        }

        const accountRequest = await prisma.accountRequest.update({
            where: { id: id },
            data: {
                status,
                adminNotes: adminNotes || undefined,
            },
        })

        // Log activity
        await prisma.userActivity.create({
            data: {
                userId: accountRequest.userId,
                action: 'REQUEST_UPDATE',
                details: `Your request for ${accountRequest.resourceName} was ${status.toLowerCase()}`,
            }
        })

        return NextResponse.json({
            message: `Request ${status.toLowerCase()} successfully`,
            request: accountRequest,
        })
    } catch (error) {
        console.error('Request status update error:', error)
        return NextResponse.json(
            { error: 'Failed to update request status' },
            { status: 500 }
        )
    }
}
