import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { SoftwareClient } from './software-client'

export default async function SoftwarePage() {
    const session = await auth()

    const categories = await prisma.category.findMany({
        where: { type: 'SOFTWARE' },
        include: {
            software: {
                orderBy: { createdAt: 'desc' },
            },
        },
        orderBy: { displayOrder: 'asc' },
    })

    const serializedCategories = categories.map(cat => ({
        ...cat,
        software: cat.software.map(sw => ({
            ...sw,
            fileSize: sw.fileSize ? Number(sw.fileSize) : null,
        })),
    }))

    return <SoftwareClient categories={serializedCategories} />
}
