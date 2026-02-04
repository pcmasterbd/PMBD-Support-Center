import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { type, data } = body

        if (type === 'VIDEO') {
            const video = await prisma.videoTutorial.create({
                data: {
                    title: data.title,
                    description: data.description,
                    youtubeId: data.youtubeId,
                    categoryId: data.categoryId,
                    isPremium: data.isPremium || false,
                    displayOrder: data.displayOrder || 0,
                },
            })
            return NextResponse.json(video, { status: 201 })
        }

        if (type === 'SOFTWARE') {
            const software = await prisma.software.create({
                data: {
                    name: data.name,
                    version: data.version,
                    description: data.description,
                    categoryId: data.categoryId,
                    fileUrl: data.fileUrl,
                    isPremium: data.isPremium || false,
                },
            })
            return NextResponse.json(software, { status: 201 })
        }

        if (type === 'CATEGORY') {
            const category = await prisma.category.create({
                data: {
                    name: data.name,
                    type: data.type,
                    icon: data.icon,
                    displayOrder: data.displayOrder || 0,
                },
            })
            return NextResponse.json(category, { status: 201 })
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    } catch (error) {
        console.error('Content creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create content' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    try {
        if (type === 'CATEGORY') {
            const categories = await prisma.category.findMany({
                orderBy: { displayOrder: 'asc' },
            })
            return NextResponse.json(categories)
        }
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
}
