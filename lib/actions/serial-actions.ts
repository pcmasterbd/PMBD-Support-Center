'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"

export async function createSerial(formData: FormData) {
    const code = formData.get('code') as string
    const status = (formData.get('status') as string) || 'AVAILABLE'

    await prisma.serialNumber.create({
        data: { code, status: status as any }
    })
    revalidatePath('/dashboard/admin/serials')
}

export async function bulkGenerateSerials(formData: FormData) {
    const count = parseInt(formData.get('count') as string || '10')
    const prefix = (formData.get('prefix') as string) || 'PMBD'

    const data = Array.from({ length: count }).map(() => ({
        code: `${prefix}-${nanoid(10).toUpperCase()}`,
        status: 'AVAILABLE'
    }))

    await prisma.serialNumber.createMany({
        data: data as any
    })
    revalidatePath('/dashboard/admin/serials')
}

export async function deleteSerial(id: string) {
    await prisma.serialNumber.delete({ where: { id } })
    revalidatePath('/dashboard/admin/serials')
}

export async function revokeSerial(id: string) {
    await prisma.serialNumber.update({
        where: { id },
        data: {
            status: 'AVAILABLE',
            user: { disconnect: true },
            assignedAt: null
        }
    })
    revalidatePath('/dashboard/admin/serials')
}

export async function bulkImportSerialNumbers(data: { code: string, packageType?: string }[]) {
    if (!data || data.length === 0) return { success: false, error: "No data provided" }

    try {
        await prisma.serialNumber.createMany({
            data: data.map(item => ({
                code: item.code,
                packageType: item.packageType || 'STANDARD_64GB',
                status: 'AVAILABLE'
            })),
            skipDuplicates: true
        })
        revalidatePath('/dashboard/admin/serials')
        return { success: true, count: data.length }
    } catch (error) {
        console.error("Bulk import error:", error)
        return { success: false, error: "Failed to import serials" }
    }
}
