import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Ticket,
    Clock,
    AlertCircle,
    CheckCircle2,
    MessageSquare,
    User,
    Filter,
    Search,
    AlertTriangle,
    ChevronRight,
    BarChart3
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { TicketList } from "@/components/admin/support/ticket-list";

export default async function AdminSupportDashboard() {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    // Fetch stats and priority tickets
    const [
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        urgentTickets,
        allTickets
    ] = await Promise.all([
        prisma.supportTicket.count(),
        prisma.supportTicket.count({ where: { status: 'OPEN' } }),
        prisma.supportTicket.count({ where: { status: 'IN_PROGRESS' } }),
        prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),
        prisma.supportTicket.findMany({
            where: { priority: 'URGENT' as any, status: { not: 'CLOSED' } },
            include: { user: { select: { name: true } } },
            take: 5,
            orderBy: { updatedAt: 'desc' }
        }),
        prisma.supportTicket.findMany({
            include: {
                user: { select: { name: true } },
                _count: { select: { messages: true } }
            },
            orderBy: { updatedAt: 'desc' },
            take: 20
        })
    ]);

    const stats = [
        { label: "Total Tickets", value: totalTickets, icon: Ticket, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Open", value: openTickets, icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "In Progress", value: inProgressTickets, icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Resolved", value: resolvedTickets, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">সাপোর্ট টিকেট ম্যানেজমেন্ট</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">ইউজারদের টেকনিক্যাল সমস্যার সমাধান এবং টিকেট পরিচালনা করুন</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 h-9 text-xs sm:text-sm rounded-xl" asChild>
                        <Link href="/dashboard/admin/support/analytics">
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-4 sm:p-6 rounded-2xl border-2">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className={`p-2 sm:p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-2xl sm:text-3xl font-black">{stat.value}</h3>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Priority Queue */}
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="font-bold text-xl flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Urgent Priority Queue
                    </h3>
                    <div className="space-y-3">
                        {urgentTickets.length > 0 ? (
                            urgentTickets.map((ticket: any) => (
                                <Link key={ticket.id} href={`/dashboard/admin/support/${ticket.id}`}>
                                    <Card className="p-4 hover:border-red-500/50 transition-all border-l-4 border-l-red-500">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-sm truncate pr-4">{ticket.subject}</h4>
                                            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">Urgent</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {ticket.user.name}
                                            </span>
                                            <span>{new Date(ticket.updatedAt).toLocaleDateString('bn-BD')}</span>
                                        </div>
                                    </Card>
                                </Link>
                            ))
                        ) : (
                            <Card className="p-10 text-center border-dashed">
                                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground">এখন কোনো আর্জেন্ট টিকেট নেই। সাবাস!</p>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Master Ticket List */}
                <div className="lg:col-span-2 space-y-6">
                    <TicketList tickets={allTickets} />
                </div>
            </div>
        </div>
    );
}
