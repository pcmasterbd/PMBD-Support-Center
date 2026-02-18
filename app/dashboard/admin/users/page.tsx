import { UserSearch } from "@/components/admin/user-search";
import { UserStatusToggle } from "@/components/admin/user-status-toggle";
import { UserAddButton } from "@/components/admin/user-add-button";
import { UserActionButtons } from "@/components/admin/user-action-buttons";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Shield,
    ShieldAlert,
    Mail,
    TrendingUp,
    Users
} from "lucide-react";
import { redirect } from "next/navigation";

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

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">ইউজার ম্যানেজমেন্ট</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">সিস্টেমের সকল ইউজার এবং তাদের অ্যাক্সেস লেভেল কন্ট্রোল করুন</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 h-9 text-xs sm:text-sm rounded-xl">
                        <TrendingUp className="w-4 h-4" />
                        Growth Stats
                    </Button>
                    <UserAddButton />
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card className="p-4 sm:p-6 bg-primary/5 border-primary/20 rounded-2xl border-2">
                    <h4 className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Registered</h4>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl sm:text-3xl font-extrabold">{totalUsers}</p>
                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary/40" />
                    </div>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <UserSearch />
                </div>

                <div className="md:hidden space-y-4">
                    {users.map((user) => (
                        <Card key={user.id} className="p-4 border-2 rounded-2xl hover:border-primary/20 transition-all transition-colors duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-sm uppercase">
                                        {user.name?.slice(0, 2)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-base">{user.name}</span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                                <UserActionButtons user={user} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-muted/50">
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Role</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${user.role === 'SUPERADMIN' ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-200' :
                                        user.role === 'ADMIN' ? 'bg-blue-500/10 text-blue-600 border border-blue-200' :
                                            'bg-muted text-muted-foreground border border-muted'
                                        }`}>
                                        {user.role === 'SUPERADMIN' ? <ShieldAlert className="w-2.5 h-2.5" /> : <Shield className="w-2.5 h-2.5" />}
                                        {user.role}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Status</span>
                                    <UserStatusToggle userId={user.id} initialStatus={user.isActive} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Serial</span>
                                    {user.serialNumber ? (
                                        <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded border leading-none block w-fit">
                                            {user.serialNumber.code}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground italic">No Serial</span>
                                    )}
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Joined</span>
                                    <div className="flex items-center gap-1.5 text-xs font-medium">
                                        <Calendar className="w-3 h-3 text-muted-foreground" />
                                        {new Date(user.createdAt).toLocaleDateString('bn-BD')}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {users.length === 0 && (
                        <Card className="p-8 text-center border-2 border-dashed rounded-2xl">
                            <Users className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">কোনো ইউজার পাওয়া যায়নি।</p>
                        </Card>
                    )}
                </div>

                <Card className="hidden md:block overflow-hidden border-2 rounded-2xl">
                    <div className="overflow-x-auto customize-scrollbar">
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
                                            <UserActionButtons user={user} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
