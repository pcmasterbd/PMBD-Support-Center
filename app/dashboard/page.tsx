import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserDashboardClient } from './dashboard-client'

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.id) {
        return null
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            serialNumber: true,
            activities: {
                take: 5,
                orderBy: { createdAt: 'desc' },
            },
            tickets: {
                where: { status: 'OPEN' },
                take: 1,
            },
            _count: {
                select: {
                    downloads: true,
                    activities: {
                        where: { action: 'WATCH' }
                    },
                    tickets: true,
                }
            }
        },
    })

    const [videoCount, softwareCount] = await Promise.all([
        prisma.videoTutorial.count(),
        prisma.software.count(),
    ])

    // Serialize dates for client
    const serializedUser = user ? {
        name: user.name,
        serialNumber: user.serialNumber ? {
            code: user.serialNumber.code,
            assignedAt: user.serialNumber.assignedAt?.toISOString() || null,
        } : null,
        activities: user.activities.map(a => ({
            id: a.id,
            action: a.action,
            details: a.details,
            createdAt: a.createdAt.toISOString(),
        })),
        tickets: user.tickets.map(t => ({
            subject: t.subject,
        })),
        _count: user._count,
    } : null

    return (
        <UserDashboardClient
            user={serializedUser}
            videoCount={videoCount}
        />
    )
}
