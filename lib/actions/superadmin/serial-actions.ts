'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"
import { z } from "zod"

// Schema for validation
const createSerialSchema = z.object({
    code: z.string().min(5, "Serial number must be at least 5 characters"),
    packageType: z.enum(["PREMIUM_128GB", "STANDARD_64GB"]),
})

export async function getSerials() {
    try {
        const serials = await prisma.serialNumber.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return { success: true, data: serials }
    } catch (error) {
        console.error("Failed to fetch serials:", error)
        return { success: false, error: "Failed to fetch serial numbers" }
    }
}

export async function addSerialNumber(formData: FormData) {
    try {
        const code = formData.get('code') as string
        const packageType = formData.get('packageType') as string

        if (!code || !packageType) {
            return { success: false, error: "Missing required fields" }
        }

        // Check if exists
        const existing = await prisma.serialNumber.findUnique({
            where: { code }
        })

        if (existing) {
            return { success: false, error: "Serial number already exists" }
        }

        await prisma.serialNumber.create({
            data: {
                code,
                packageType,
                status: 'AVAILABLE'
            }
        })

        revalidatePath('/dashboard/superadmin/serials')
        return { success: true, message: "Serial number added successfully" }
    } catch (error) {
        console.error("Failed to add serial:", error)
        return { success: false, error: "Failed to add serial number" }
    }
}

export async function bulkImportSerials(data: { code: string, packageType: string }[]) {
    try {
        if (!data || data.length === 0) {
            return { success: false, error: "No data provided" }
        }

        // Validate and filter duplicates
        const ValidPackageTypes = ["PREMIUM_128GB", "STANDARD_64GB"]
        const validRows = data.filter(row =>
            row.code &&
            row.packageType &&
            ValidPackageTypes.includes(row.packageType)
        )

        if (validRows.length === 0) {
            return { success: false, error: "No valid rows found to import" }
        }

        // Use createMany
        await prisma.serialNumber.createMany({
            data: validRows.map(row => ({
                code: row.code,
                packageType: row.packageType,
                status: 'AVAILABLE'
            })),
            skipDuplicates: true // Skip if serial already exists
        })

        revalidatePath('/dashboard/superadmin/serials')
        return { success: true, message: `Successfully processed ${validRows.length} serials` }
    } catch (error) {
        console.error("Bulk import failed:", error)
        return { success: false, error: "Failed to import serials" }
    }
}

export async function deleteSerial(id: string) {
    try {
        await prisma.serialNumber.delete({
            where: { id }
        })
        revalidatePath('/dashboard/superadmin/serials')
        return { success: true, message: "Serial deleted successfully" }
    } catch (error) {
        return { success: false, error: "Failed to delete serial" }
    }
}

export async function unlinkCustomer(serialId: string) {
    try {
        // Transaction to update serial and user
        await prisma.$transaction(async (tx) => {
            // 1. Get serial to find connected user
            const serial = await tx.serialNumber.findUnique({
                where: { id: serialId },
                include: { user: true }
            })

            if (!serial) throw new Error("Serial not found")

            // 2. Update serial
            await tx.serialNumber.update({
                where: { id: serialId },
                data: {
                    status: 'AVAILABLE',
                    assignedAt: null,
                    user: { disconnect: true }
                }
            })

            // 3. If there was a user, update their serialId to null if needed (though disconnect handles relation)
            // Double check user side updates if needed by business logic
        })

        revalidatePath('/dashboard/superadmin/serials')
        return { success: true, message: "Customer unlinked successfully" }
    } catch (error) {
        console.error("Unlink failed:", error)
        return { success: false, error: "Failed to unlink customer" }
    }
}
