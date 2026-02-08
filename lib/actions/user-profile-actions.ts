'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateUserAdminNotes(userId: string, notes: string) {
    await prisma.user.update({
        where: { id: userId },
        data: { adminNotes: notes }
    })

    // Revalidate multiple potential paths where this info is displayed
    revalidatePath(`/dashboard/admin/users/${userId}`)
    revalidatePath(`/dashboard/admin/support`)
}

export async function getUserProfileData(userId: string) {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            serialNumber: true,
            _count: {
                select: {
                    tickets: true,
                    downloads: true,
                    activities: true
                }
            },
            tickets: {
                take: 5,
                orderBy: { updatedAt: 'desc' }
            },
            downloads: {
                take: 5,
                orderBy: { downloadedAt: 'desc' },
                include: { software: { select: { name: true } } }
            }
        }
    })
}
