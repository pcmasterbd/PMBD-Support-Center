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
        const { isActive } = body

        if (typeof isActive !== 'boolean') {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            )
        }

        const user = await prisma.user.update({
            where: { id: id },
            data: { isActive },
        })

        return NextResponse.json({
            message: `User ${user.name} is now ${isActive ? 'active' : 'inactive'}`,
            user,
        })
    } catch (error) {
        console.error('User status update error:', error)
        return NextResponse.json(
            { error: 'Failed to update user status' },
            { status: 500 }
        )
    }
}
