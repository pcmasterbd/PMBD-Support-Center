import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    User,
    Calendar,
    Shield,
    ShieldAlert,
    MoreVertical,
    Search,
    Filter,
    Mail,
    Phone,
    TrendingUp,
    Users
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserSearch } from "@/components/admin/user-search";
import { UserStatusToggle } from "@/components/admin/user-status-toggle";

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;

    const users = await prisma.user.findMany({
        where: searchQuery ? {
            OR: [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { email: { contains: searchQuery, mode: 'insensitive' } },
                { phone: { contains: searchQuery, mode: 'insensitive' } },
                { serialNumber: { code: { contains: searchQuery, mode: 'insensitive' } } }
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

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">ইউজার ম্যানেজমেন্ট</h2>
                    <p className="text-muted-foreground">সিস্টেমের সকল ইউজার এবং তাদের অ্যাক্সেস লেভেল কন্ট্রোল করুন</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Growth Stats
                    </Button>
                    <Button className="gap-2">
                        <Users className="w-4 h-4" />
                        Add New User
                    </Button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 bg-primary/5 border-primary/20">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Registered</h4>
                    <div className="flex items-center justify-between">
                        <p className="text-3xl font-extrabold">{totalUsers}</p>
                        <Users className="w-8 h-8 text-primary/40" />
                    </div>
                </Card>
                {/* Placeholder for more stats */}
            </div>

            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <UserSearch />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2 h-9">
                            <Filter className="w-4 h-4" />
                            Filters
                        </Button>
                    </div>
                </div>

                <Card className="overflow-hidden border-2">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-4 py-3 font-bold">User</th>
                                <th className="px-4 py-3 font-bold">Role</th>
                                <th className="px-4 py-3 font-bold">Serial Number</th>
                                <th className="px-4 py-3 font-bold">Activity</th>
                                <th className="px-4 py-3 font-bold">Joined</th>
                                <th className="px-4 py-3 font-bold">Status</th>
                                <th className="px-4 py-3 font-bold text-right pr-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-bold text-xs uppercase">
                                                {user.name?.slice(0, 2)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold">{user.name}</span>
                                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-2.5 h-2.5" />
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${user.role === 'SUPERADMIN' ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-200' :
                                            user.role === 'ADMIN' ? 'bg-blue-500/10 text-blue-600 border border-blue-200' :
                                                'bg-muted text-muted-foreground border border-muted'
                                            }`}>
                                            {user.role === 'SUPERADMIN' ? <ShieldAlert className="w-2.5 h-2.5" /> : <Shield className="w-2.5 h-2.5" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col gap-1">
                                            {user.serialNumber ? (
                                                <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded border leading-none">
                                                    {user.serialNumber.code}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground italic">No Serial</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                                            <span>{user._count.tickets} Tickets</span>
                                            <span>{user._count.downloads} Downloads</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-xs">
                                        <div className="flex items-center gap-2 font-medium">
                                            <Calendar className="w-3 h-3 text-muted-foreground" />
                                            {new Date(user.createdAt).toLocaleDateString('bn-BD')}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <UserStatusToggle userId={user.id} initialStatus={user.isActive} />
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    );
}
