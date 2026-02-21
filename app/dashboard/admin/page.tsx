import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "./admin-dashboard-client";

export default async function AdminDashboardPage() {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    const [
        userCount,
        ticketCount,
        pendingTickets,
        softwareDownloads,
        pendingRequests,
        recentActivity,
        ratingStats
    ] = await Promise.all([
        prisma.user.count(),
        prisma.supportTicket.count(),
        prisma.supportTicket.count({ where: { status: 'OPEN' } }),
        prisma.software.aggregate({ _sum: { downloadCount: true } }),
        prisma.accountRequest.count({ where: { status: 'PENDING' } }),
        prisma.userActivity.findMany({
            take: 8,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        }),
        prisma.ticketFeedback.aggregate({
            _avg: { rating: true }
        })
    ]);

    const serializedActivity = recentActivity.map(a => ({
        id: a.id,
        action: a.action,
        createdAt: a.createdAt.toISOString(),
        userName: a.user.name,
    }));

    const avgRating = ratingStats._avg.rating || 0;

    return (
        <AdminDashboardClient
            role={session.user.role}
            userCount={userCount}
            pendingTickets={pendingTickets}
            totalDownloads={softwareDownloads._sum.downloadCount || 0}
            pendingRequests={pendingRequests}
            recentActivity={serializedActivity}
            avgRating={avgRating}
        />
    );
}
