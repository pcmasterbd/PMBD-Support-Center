import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PremiumClient } from "./premium-client";

export default async function PremiumAccountsPage() {
    const session = await auth();

    if (!session?.user?.id) return null;

    const [accounts, requests] = await Promise.all([
        prisma.premiumAccount.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { serviceName: 'asc' }
        }),
        prisma.accountRequest.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    const pendingResourceNames = requests
        .filter(r => r.status === 'PENDING')
        .map(r => r.resourceName);

    const serializedAccounts = accounts.map(a => ({
        id: a.id,
        serviceName: a.serviceName,
        type: a.type,
        notes: a.notes,
    }));

    const serializedRequests = requests.map(r => ({
        id: r.id,
        resourceName: r.resourceName,
        status: r.status,
        adminNotes: r.adminNotes,
        createdAt: r.createdAt.toISOString(),
    }));

    return (
        <PremiumClient
            accounts={serializedAccounts}
            requests={serializedRequests}
            pendingResourceNames={pendingResourceNames}
        />
    );
}
