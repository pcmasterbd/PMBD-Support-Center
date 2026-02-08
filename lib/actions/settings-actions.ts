'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateSystemSetting(key: string, value: string) {
    await prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
    })
    revalidatePath('/dashboard/admin/settings')
}

export async function updateSystemSettings(settings: Record<string, string>) {
    const operations = Object.entries(settings).map(([key, value]) =>
        prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        })
    )

    await prisma.$transaction(operations)
    revalidatePath('/dashboard/admin/settings')
}
