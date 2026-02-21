import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SupportClient } from "./support-client";

export default async function SupportPage() {
    const session = await auth();

    if (!session?.user?.id) return null;

    const tickets = await prisma.supportTicket.findMany({
        where: { userId: session.user.id },
        include: {
            _count: {
                select: { messages: true }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    const serializedTickets = tickets.map(t => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
    }));

    return <SupportClient tickets={serializedTickets} />;
}
