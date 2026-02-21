import { prisma } from '@/lib/prisma'
import { TutorialsClient } from './tutorials-client'

export default async function TutorialsPage() {
    const categories = await prisma.category.findMany({
        where: { type: 'VIDEO' },
        include: {
            videos: {
                orderBy: { displayOrder: 'asc' },
            },
        },
        orderBy: { displayOrder: 'asc' },
    })

    const serialized = categories.map(cat => ({
        ...cat,
        createdAt: cat.createdAt.toISOString(),
        videos: cat.videos.map(v => ({
            ...v,
            createdAt: v.createdAt.toISOString(),
            updatedAt: v.updatedAt.toISOString(),
        })),
    }))

    return <TutorialsClient categories={serialized} />
}
