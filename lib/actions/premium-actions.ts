'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

// User Actions
export async function requestPremiumResource(resourceId: string, resourceType: 'PREMIUM_ACCOUNT' | 'LICENSE_KEY', resourceName: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // Check for existing pending request
    const existing = await prisma.accountRequest.findFirst({
        where: {
            userId: session.user.id,
            resourceName,
            status: 'PENDING'
        }
    })

    if (existing) throw new Error("আপনার আবেদনটি ইতিমধ্যে প্রক্রিয়াধীন আছে")

    await prisma.accountRequest.create({
        data: {
            userId: session.user.id,
            resourceType,
            resourceName,
            status: 'PENDING'
        }
    })

    revalidatePath('/dashboard/premium/accounts')
    revalidatePath('/dashboard/admin/premium')
}

// Admin Actions
export async function updatePremiumRequestStatus(id: string, status: 'APPROVED' | 'REJECTED', adminNotes?: string | null) {
    await prisma.accountRequest.update({
        where: { id },
        data: {
            status,
            adminNotes,
            updatedAt: new Date()
        }
    })
    revalidatePath('/dashboard/admin/premium')
    revalidatePath('/dashboard/premium/accounts')
}

export async function deletePremiumRequest(id: string) {
    await prisma.accountRequest.delete({ where: { id } })
    revalidatePath('/dashboard/admin/premium')
}

export async function createPremiumAccount(formData: FormData) {
    const serviceName = formData.get('serviceName') as string
    const type = formData.get('type') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const notes = formData.get('notes') as string
    const maxUsers = parseInt(formData.get('maxUsers') as string) || 1

    await prisma.premiumAccount.create({
        data: {
            serviceName,
            type,
            username,
            password,
            notes,
            maxUsers,
            status: 'ACTIVE'
        }
    })

    revalidatePath('/dashboard/admin/premium')
}

export async function updatePremiumAccount(id: string, formData: FormData) {
    const serviceName = formData.get('serviceName') as string
    const type = formData.get('type') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const notes = formData.get('notes') as string
    const maxUsers = parseInt(formData.get('maxUsers') as string) || 1
    const status = formData.get('status') as string

    await prisma.premiumAccount.update({
        where: { id },
        data: {
            serviceName,
            type,
            username,
            password,
            notes,
            maxUsers,
            status
        }
    })

    revalidatePath('/dashboard/admin/premium')
}

export async function deletePremiumAccount(id: string) {
    await prisma.premiumAccount.delete({ where: { id } })
    revalidatePath('/dashboard/admin/premium')
}

// License Key Actions
export async function createLicenseKey(formData: FormData) {
    const softwareName = formData.get('softwareName') as string
    const key = formData.get('key') as string
    const status = formData.get('status') as string || 'AVAILABLE'

    await prisma.licenseKey.create({
        data: {
            softwareName,
            key,
            status
        }
    })

    revalidatePath('/dashboard/admin/premium')
}

export async function updateLicenseKey(id: string, formData: FormData) {
    const softwareName = formData.get('softwareName') as string
    const key = formData.get('key') as string
    const status = formData.get('status') as string

    await prisma.licenseKey.update({
        where: { id },
        data: {
            softwareName,
            key,
            status
        }
    })

    revalidatePath('/dashboard/admin/premium')
}


export async function assignLicenseKey(licenseId: string, userId: string) {
    if (!licenseId || !userId) throw new Error("Missing license or user ID")

    await prisma.licenseKey.update({
        where: { id: licenseId },
        data: {
            assignedToUser: userId,
            status: 'ASSIGNED'
        }
    })

    revalidatePath('/dashboard/admin/premium')
    revalidatePath('/dashboard/premium/licenses')
}

export async function unassignLicenseKey(licenseId: string) {
    await prisma.licenseKey.update({
        where: { id: licenseId },
        data: {
            assignedToUser: null,
            status: 'AVAILABLE'
        }
    })

    revalidatePath('/dashboard/admin/premium')
    revalidatePath('/dashboard/premium/licenses')
}
