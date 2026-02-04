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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">সাপোর্ট টিকেট ম্যানেজমেন্ট</h2>
                    <p className="text-muted-foreground">ইউজারদের টেকনিক্যাল সমস্যার সমাধান এবং টিকেট পরিচালনা করুন</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                    </Button>
                    <Button className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Bulk Reply
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="font-bold text-xl">সকল টিকেট লিস্ট</h3>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="টিকেট সার্চ করুন..." className="pl-9 w-64" />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {allTickets.map((ticket: any) => (
                            <Link key={ticket.id} href={`/dashboard/admin/support/${ticket.id}`}>
                                <Card className="p-4 hover:bg-muted/30 transition-all border-2 border-transparent hover:border-primary/10">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border ${ticket.status === 'OPEN' ? 'bg-blue-500/10 text-blue-500 border-blue-200' :
                                                        ticket.status === 'IN_PROGRESS' ? 'bg-purple-500/10 text-purple-500 border-purple-200' :
                                                            'bg-green-500/10 text-green-500 border-green-200'
                                                    }`}>
                                                    {ticket.status}
                                                </span>
                                                <span className={`text-[10px] font-bold uppercase ${ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'text-red-500' : 'text-muted-foreground'
                                                    }`}>
                                                    {ticket.priority}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">#{ticket.id.slice(-6).toUpperCase()}</span>
                                            </div>
                                            <h4 className="font-bold text-sm md:text-base truncate">{ticket.subject}</h4>
                                            <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                                                <span className="flex items-center gap-1 font-medium">
                                                    <User className="w-3 h-3" />
                                                    {ticket.user.name}
                                                </span>
                                                <span className="flex items-center gap-1 font-medium">
                                                    <MessageSquare className="w-3 h-3" />
                                                    {ticket._count?.messages || 0} Replies
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(ticket.updatedAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-full hover:bg-muted transition-colors">
                                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    <div className="flex justify-center pt-6">
                        <Button variant="outline">View All Tickets</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
