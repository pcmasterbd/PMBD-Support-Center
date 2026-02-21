import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActivityClient } from "./activity-client";

export default async function ActivityPage() {
    const session = await auth();

    if (!session?.user?.id) return null;

    const activities = await prisma.userActivity.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    const serialized = activities.map(a => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
    }));

    return <ActivityClient activities={serialized} />;
}
