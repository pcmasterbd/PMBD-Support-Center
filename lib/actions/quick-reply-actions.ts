'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getQuickReplies() {
    return await prisma.quickReply.findMany({
        orderBy: { category: 'asc' }
    })
}

export async function addQuickReply(category: string, message: string) {
    await prisma.quickReply.create({
        data: { category, message }
    })
    revalidatePath('/dashboard/admin/support')
}

export async function deleteQuickReply(id: string) {
    await prisma.quickReply.delete({
        where: { id }
    })
    revalidatePath('/dashboard/admin/support')
}
