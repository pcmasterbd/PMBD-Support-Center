'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

interface AnalyticsData {
    summary: {
        totalUsers: number
        totalTickets: number
        avgResolutionTime: number // in hours
        customerSatisfaction: number // 1-5 scale
    }
    newCustomers: { date: string; count: number }[]
    ticketVolume: { status: string; count: number }[]
    ticketCategories: { name: string; value: number }[]
}

export async function getAnalyticsData(): Promise<{ success: boolean; data?: AnalyticsData; error?: string }> {
    try {
        const session = await auth()
        if (session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        // 1. Summary Cards
        const totalUsers = await prisma.user.count({ where: { role: 'USER' } })
        const totalTickets = await prisma.supportTicket.count()
        // Mocking satisfaction and resolution time as schema might not support it directly yet or needs complex query
        // Resolution time: avg(resolvedAt - createdAt) where status = RESOLVED
        // For now, returning mock/placeholder for complex metrics if not easily queryable
        const avgResolutionTime = 24.5 // Placeholder hours
        const customerSatisfaction = 4.8 // Placeholder rating

        // 2. New Customers (Last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const users = await prisma.user.findMany({
            where: {
                role: 'USER',
                createdAt: { gte: thirtyDaysAgo }
            },
            select: { createdAt: true }
        })

        // Group by date
        const customerMap = new Map<string, number>()
        users.forEach(u => {
            const date = u.createdAt.toISOString().split('T')[0]
            customerMap.set(date, (customerMap.get(date) || 0) + 1)
        })

        const newCustomers = Array.from({ length: 30 }, (_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - (29 - i))
            const dateStr = d.toISOString().split('T')[0]
            return {
                date: dateStr,
                count: customerMap.get(dateStr) || 0
            }
        })

        // 3. Ticket Volume by Status
        const ticketStatusGroups = await prisma.supportTicket.groupBy({
            by: ['status'],
            _count: { status: true }
        })

        const ticketVolume = ticketStatusGroups.map(g => ({
            status: g.status,
            count: g._count.status
        }))

        // 4. Ticket Categories (Subject/Tag? Schema has subject only. Maybe check QuickReply categories or infer?)
        // Using mock categories for now as schema doesn't have category field on Ticket
        const ticketCategories = [
            { name: 'Technical Support', value: 45 },
            { name: 'Billing', value: 25 },
            { name: 'Feature Request', value: 15 },
            { name: 'Other', value: 15 },
        ]

        return {
            success: true,
            data: {
                summary: {
                    totalUsers,
                    totalTickets,
                    avgResolutionTime,
                    customerSatisfaction
                },
                newCustomers,
                ticketVolume,
                ticketCategories
            }
        }
    } catch (error) {
        console.error("Failed to fetch analytics:", error)
        return { success: false, error: "Failed to fetch analytics data" }
    }
}
