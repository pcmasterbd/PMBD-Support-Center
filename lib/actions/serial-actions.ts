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
export async function activateUserAccount(userId: string, serialCode: string) {
    if (!userId || !serialCode) return { success: false, error: "সব ফিল্ড পূরণ করুন" }

    try {
        const serial = await prisma.serialNumber.findUnique({
            where: { code: serialCode },
        })

        if (!serial) {
            return { success: false, error: "সিরিয়াল নম্বর পাওয়া যায়নি" }
        }

        if (serial.status !== 'AVAILABLE') {
            return { success: false, error: "এই সিরিয়াল নম্বর ইতিমধ্যে ব্যবহৃত হয়েছে" }
        }

        // Check for existing pending request
        const existingRequest = await prisma.accountRequest.findFirst({
            where: {
                userId,
                resourceType: 'SERIAL_ACTIVATION',
                status: 'PENDING'
            }
        })

        if (existingRequest) {
            return { success: false, error: "আপনার একটি অ্যাক্টিভেশন রিকোয়েস্ট অলরেডি পেন্ডিং আছে।" }
        }

        // Create Account Request for Admin Approval
        await prisma.accountRequest.create({
            data: {
                userId,
                resourceType: 'SERIAL_ACTIVATION',
                resourceName: serialCode,
                reason: `Activation for Serial: ${serialCode}`,
                status: 'PENDING'
            }
        })

        revalidatePath('/activate')
        return { success: true, pending: true }
    } catch (error) {
        console.error("Activation request error:", error)
        return { success: false, error: "রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে" }
    }
}

export async function approveActivationRequest(requestId: string, validityYears: number) {
    try {
        const request = await prisma.accountRequest.findUnique({
            where: { id: requestId },
            include: { user: true }
        })

        if (!request || request.status !== 'PENDING') {
            return { success: false, error: "Invalid request" }
        }

        const serialCode = request.resourceName
        const serial = await prisma.serialNumber.findUnique({
            where: { code: serialCode }
        })

        if (!serial || serial.status !== 'AVAILABLE') {
            return { success: false, error: "Serial no longer available" }
        }

        // Calculate entropy
        let expiresAt: Date | null = new Date()
        if (validityYears === 99) {
            expiresAt = null // Lifetime
        } else {
            expiresAt.setFullYear(expiresAt.getFullYear() + validityYears)
        }

        let role = 'FREE'
        if (serial.packageType?.toUpperCase().includes('PREMIUM') ||
            serial.packageType?.toUpperCase().includes('STANDARD')) {
            role = 'PREMIUM'
        }

        await prisma.$transaction([
            prisma.user.update({
                where: { id: request.userId },
                data: {
                    serialId: serial.id,
                    role: role
                }
            }),
            prisma.serialNumber.update({
                where: { id: serial.id },
                data: {
                    status: 'ASSIGNED',
                    assignedAt: new Date(),
                    expiresAt: expiresAt
                }
            }),
            prisma.accountRequest.update({
                where: { id: requestId },
                data: {
                    status: 'APPROVED',
                    adminNotes: `Approved for ${validityYears === 99 ? 'Lifetime' : validityYears + ' Year(s)'}`
                }
            })
        ])

        revalidatePath('/dashboard/admin/activations')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error("Approval error:", error)
        return { success: false, error: "Failed to approve activation" }
    }
}

export async function rejectActivationRequest(requestId: string, reason: string) {
    try {
        await prisma.accountRequest.update({
            where: { id: requestId },
            data: {
                status: 'REJECTED',
                adminNotes: reason
            }
        })
        revalidatePath('/dashboard/admin/activations')
        return { success: true }
    } catch (error) {
        console.error("Rejection error:", error)
        return { success: false, error: "Failed to reject request" }
    }
}
