import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ActivationClient } from "./activate-client";

export default async function ActivatePage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    if ((session.user as any).serialId) {
        redirect('/dashboard');
    }

    // Check for pending activation request
    const pendingRequest = await prisma.accountRequest.findFirst({
        where: {
            userId: session.user.id,
            resourceType: 'SERIAL_ACTIVATION',
            status: 'PENDING'
        }
    });

    return (
        <ActivationClient
            initialPending={!!pendingRequest}
            initialSerial={pendingRequest?.resourceName || ''}
        />
    );
}
