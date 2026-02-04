import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { isValidSerialFormat } from '@/lib/utils'

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
        const { serials } = body

        if (!Array.isArray(serials) || serials.length === 0) {
            return NextResponse.json(
                { error: 'No serials provided' },
                { status: 400 }
            )
        }

        // Filter and validate serials
        const validSerials = serials
            .map(s => s.trim())
            .filter(s => isValidSerialFormat(s))

        if (validSerials.length === 0) {
            return NextResponse.json(
                { error: 'No valid serial numbers found (Incorrect format)' },
                { status: 400 }
            )
        }

        const data = validSerials.map(code => ({
            code,
            status: 'AVAILABLE',
            batch: 'CSV-IMPORT',
        }))

        const result = await prisma.serialNumber.createMany({
            data,
            skipDuplicates: true,
        })

        return NextResponse.json({
            message: `${result.count} serial numbers imported`,
            count: result.count,
        }, { status: 201 })
    } catch (error) {
        console.error('Serial import error:', error)
        return NextResponse.json(
            { error: 'Failed to import serial numbers' },
            { status: 500 }
        )
    }
}
