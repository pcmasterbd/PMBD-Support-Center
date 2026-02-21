'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

interface GetLogsParams {
    page?: number
    limit?: number
    adminId?: string
    action?: string
    startDate?: string
    endDate?: string
}

export async function getAuditLogs({
    page = 1,
    limit = 20,
    adminId,
    action,
    startDate,
    endDate
}: GetLogsParams) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'SUPERADMIN' && session?.user?.role !== 'ADMIN') {
            // Admins might also need to see logs? Requirement says "view admin's activity log". 
            // But page is /superadmin/logs so restricting to superadmin for now unless required otherwise.
            // Super Admin Exclusive features section implies restriction.
            if (session?.user?.role !== 'SUPERADMIN') {
                return { success: false, error: "Unauthorized" }
            }
        }

        const skip = (page - 1) * limit

        // Build filter
        const where: any = {}

        if (adminId && adminId !== 'ALL') {
            where.adminId = adminId
        }

        if (action && action !== 'ALL') {
            where.action = action
        }

        if (startDate || endDate) {
            where.createdAt = {}
            if (startDate) where.createdAt.gte = new Date(startDate)
            if (endDate) where.createdAt.lte = new Date(endDate)
        }

        const [logs, total] = await prisma.$transaction([
            prisma.adminAuditLog.findMany({
                where,
                take: limit,
                skip,
                orderBy: { createdAt: 'desc' },
                include: {
                    admin: {
                        select: { name: true, email: true }
                    }
                }
            }),
            prisma.adminAuditLog.count({ where })
        ])

        return {
            success: true,
            data: logs,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                current: page
            }
        }
    } catch (error) {
        console.error("Failed to fetch logs:", error)
        return { success: false, error: "Failed to fetch audit logs" }
    }
}

// Helper to get unique actions for filter
export async function getUniqueActions() {
    const actions = await prisma.adminAuditLog.findMany({
        select: { action: true },
        distinct: ['action']
    })
    return actions.map(a => a.action)
}
