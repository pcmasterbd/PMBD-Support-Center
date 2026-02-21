import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminUsersClient } from "./admin-users-client";

export default async function AdminUsersPage({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await searchParamsPromise;
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;

    const users = await prisma.user.findMany({
        where: searchQuery ? {
            OR: [
                { name: { contains: searchQuery } },
                { email: { contains: searchQuery } },
                { phone: { contains: searchQuery } },
                { serialNumber: { code: { contains: searchQuery } } }
            ]
        } : {},
        include: {
            serialNumber: true,
            _count: {
                select: {
                    tickets: true,
                    downloads: true
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    const totalUsers = await prisma.user.count();

    const serializedUsers = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt.toISOString(),
        serialNumber: u.serialNumber ? { code: u.serialNumber.code } : null,
        _count: u._count,
    }));

    return <AdminUsersClient users={serializedUsers} totalUsers={totalUsers} />;
}
