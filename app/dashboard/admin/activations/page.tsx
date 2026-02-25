import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ActivationsClient } from "./activations-client";

export default async function AdminActivationsPage() {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    const requests = await prisma.accountRequest.findMany({
        where: {
            resourceType: 'SERIAL_ACTIVATION',
            status: 'PENDING'
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const serializedRequests = requests.map(r => ({
        id: r.id,
        userId: r.userId,
        userName: r.user.name,
        userEmail: r.user.email,
        userPhone: r.user.phone,
        serialCode: r.resourceName,
        status: r.status,
        createdAt: r.createdAt.toISOString()
    }));

    return (
        <ActivationsClient initialRequests={serializedRequests} />
    );
}
