'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

interface SearchResult {
    type: 'CUSTOMER' | 'TICKET' | 'TUTORIAL'
    id: string
    title: string
    subtitle?: string
    url: string
}

export async function globalSearch(query: string) {
    try {
        const session = await auth()
        if (!session?.user) return { success: false, error: "Unauthorized" }

        const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN'

        if (!query || query.length < 2) return { success: true, data: [] }

        const results: SearchResult[] = []

        // 1. Search Tickets (All for Admin, Own for User)
        const tickets = await prisma.supportTicket.findMany({
            where: {
                OR: [
                    { subject: { contains: query, mode: 'insensitive' } },
                    { id: { contains: query, mode: 'insensitive' } }
                ],
                ...(isAdmin ? {} : { userId: session.user.id })
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        })

        tickets.forEach(t => {
            results.push({
                type: 'TICKET',
                id: t.id,
                title: `#${t.id.slice(-6)}: ${t.subject}`,
                subtitle: isAdmin ? `By ${t.user.name} • ${t.status}` : t.status,
                url: isAdmin ? `/dashboard/support/${t.id}` : `/dashboard/customer/tickets/${t.id}`
            })
        })

        // 2. Search Tutorials (Public)
        const tutorials = await prisma.videoTutorial.findMany({
            where: {
                title: { contains: query, mode: 'insensitive' }
            },
            take: 3,
            include: { category: true }
        })

        tutorials.forEach(t => {
            results.push({
                type: 'TUTORIAL',
                id: t.id,
                title: t.title,
                subtitle: t.category.name,
                url: `/dashboard/tutorials`
            })
        })

        // 3. Search Customers (Admin Only)
        if (isAdmin) {
            const customers = await prisma.user.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } }
                    ],
                    role: 'USER'
                },
                take: 5
            })

            customers.forEach(c => {
                results.push({
                    type: 'CUSTOMER',
                    id: c.id,
                    title: c.name || 'Unnamed',
                    subtitle: c.email,
                    url: `/dashboard/admin/users?search=${c.email}`
                })
            })
        }

        return { success: true, data: results }

    } catch (error) {
        console.error("Search error:", error)
        return { success: false, error: "Search failed" }
    }
}
