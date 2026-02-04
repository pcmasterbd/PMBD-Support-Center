import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

function generateSerial() {
    const year = new Date().getFullYear()
    const part1 = Math.random().toString(36).substring(2, 6).toUpperCase()
    const part2 = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `PCMBD-${year}-${part1}-${part2}`
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { count } = body

        if (!count || count < 1 || count > 100) {
            return NextResponse.json(
                { error: 'Invalid count (1-100)' },
                { status: 400 }
            )
        }

        const serials = []
        for (let i = 0; i < count; i++) {
            serials.push({
                code: generateSerial(),
                status: 'AVAILABLE',
            })
        }

        await prisma.serialNumber.createMany({
            data: serials,
        })

        return NextResponse.json({ message: `${count} serials generated` }, { status: 201 })
    } catch (error) {
        console.error('Serial generation error:', error)
        return NextResponse.json(
            { error: 'Failed to generate serials' },
            { status: 500 }
        )
    }
}
