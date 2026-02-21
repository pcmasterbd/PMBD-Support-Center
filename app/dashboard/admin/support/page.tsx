import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminSupportClient } from "./admin-support-client";

export default async function AdminSupportDashboard() {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    let stats = {
        totalTickets: 0,
        openTickets: 0,
        inProgressTickets: 0,
        resolvedTickets: 0,
        urgentTickets: [] as any[],
        allTickets: [] as any[]
    };

    try {
        const [
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            urgentTickets,
            allTickets
        ] = await Promise.all([
            prisma.supportTicket.count(),
            prisma.supportTicket.count({ where: { status: 'OPEN' } }),
            prisma.supportTicket.count({ where: { status: 'IN_PROGRESS' } }),
            prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),
            prisma.supportTicket.findMany({
                where: { priority: 'URGENT' as any, status: { not: 'CLOSED' } },
                include: { user: { select: { name: true } } },
                take: 5,
                orderBy: { updatedAt: 'desc' }
            }),
            prisma.supportTicket.findMany({
                include: {
                    user: { select: { name: true } },
                    _count: { select: { messages: true } }
                },
                orderBy: { updatedAt: 'desc' },
                take: 20
            })
        ]);

        stats = {
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            urgentTickets,
            allTickets
        };
    } catch (error) {
        console.error("Dashboard data fetch failed, attempting sequential retry:", error);
        // Sequential fallback if parallel Promise.all fails due to connection pool saturation
        try {
            stats.totalTickets = await prisma.supportTicket.count();
            stats.openTickets = await prisma.supportTicket.count({ where: { status: 'OPEN' } });
            stats.inProgressTickets = await prisma.supportTicket.count({ where: { status: 'IN_PROGRESS' } });
            stats.resolvedTickets = await prisma.supportTicket.count({ where: { status: 'RESOLVED' } });
            stats.urgentTickets = await prisma.supportTicket.findMany({
                where: { priority: 'URGENT' as any, status: { not: 'CLOSED' } },
                include: { user: { select: { name: true } } },
                take: 5,
                orderBy: { updatedAt: 'desc' }
            });
            stats.allTickets = await prisma.supportTicket.findMany({
                include: {
                    user: { select: { name: true } },
                    _count: { select: { messages: true } }
                },
                orderBy: { updatedAt: 'desc' },
                take: 20
            });
        } catch (retryError) {
            console.error("Sequential retry also failed:", retryError);
        }
    }

    const serializedUrgent = stats.urgentTickets.map(t => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
    }));

    const serializedAll = stats.allTickets.map(t => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
    }));

    return (
        <AdminSupportClient
            totalTickets={stats.totalTickets}
            openTickets={stats.openTickets}
            inProgressTickets={stats.inProgressTickets}
            resolvedTickets={stats.resolvedTickets}
            urgentTickets={serializedUrgent}
            allTickets={serializedAll}
        />
    );
}
