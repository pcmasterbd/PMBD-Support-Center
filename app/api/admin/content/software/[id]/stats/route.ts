import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(
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

        const downloads = await prisma.userDownload.findMany({
            where: { softwareId: id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        serialNumber: { select: { code: true } }
                    }
                }
            },
            orderBy: { downloadedAt: 'desc' },
        })

        return NextResponse.json(downloads)
    } catch (error) {
        console.error('Software stats fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch software statistics' },
            { status: 500 }
        )
    }
}
