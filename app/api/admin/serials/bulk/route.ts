import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { generateSerialNumber } from '@/lib/utils'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { count, batch } = body

        if (!count || count <= 0 || count > 100) {
            return NextResponse.json(
                { error: 'Invalid count (1-100 allowed)' },
                { status: 400 }
            )
        }

        const serials = []
        for (let i = 0; i < count; i++) {
            serials.push({
                code: generateSerialNumber(),
                batch: batch || 'GENERAL',
                status: 'AVAILABLE',
            })
        }

        // Using createMany for better performance
        // Note: PostgreSQL createMany is supported by Prisma
        const result = await prisma.serialNumber.createMany({
            data: serials,
            skipDuplicates: true, // In case of rare collision
        })

        return NextResponse.json(
            {
                message: `${result.count} serial numbers generated successfully`,
                count: result.count,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Bulk serial generation error:', error)
        return NextResponse.json(
            { error: 'Failed to generate serial numbers' },
            { status: 500 }
        )
    }
}
