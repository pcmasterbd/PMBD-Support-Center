import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { serialNumber: true }
    });

    const serializedUser = user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified?.toISOString() || null,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt.toISOString(),
        serialNumber: user.serialNumber ? {
            code: user.serialNumber.code,
            assignedAt: user.serialNumber.assignedAt?.toISOString() || null,
        } : null,
    } : null;

    return <ProfileClient user={serializedUser} />;
}
