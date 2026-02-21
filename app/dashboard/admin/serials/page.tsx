import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminSerialsClient } from "./admin-serials-client";

export default async function AdminSerialsPage() {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    const [totalSerials, activatedCount, serials] = await Promise.all([
        prisma.serialNumber.count(),
        prisma.serialNumber.count({ where: { status: 'ASSIGNED' } }),
        prisma.serialNumber.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        })
    ]);

    const availableCount = totalSerials - activatedCount;

    const serializedSerials = serials.map(s => ({
        id: s.id,
        code: s.code,
        isActivated: s.status === 'ASSIGNED',
        assignedAt: s.assignedAt?.toISOString() || null,
        user: s.user ? { name: s.user.name, email: s.user.email } : null,
        createdAt: s.createdAt.toISOString(),
    }));

    return (
        <AdminSerialsClient
            totalSerials={totalSerials}
            activatedCount={activatedCount}
            availableCount={availableCount}
            serials={serializedSerials}
        />
    );
}
