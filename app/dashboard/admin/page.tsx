import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Ticket,
    Download,
    Key,
    TrendingUp,
    AlertCircle,
    Clock,
    ArrowRight,
    Play,
    Shield,
    Activity,
    UserPlus,
    LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    // Fetch High-level aggregate data
    const [
        userCount,
        ticketCount,
        pendingTickets,
        softwareDownloads,
        pendingRequests,
        recentActivity
    ] = await Promise.all([
        prisma.user.count(),
        prisma.supportTicket.count(),
        prisma.supportTicket.count({ where: { status: 'OPEN' } }),
        prisma.software.aggregate({ _sum: { downloadCount: true } }),
        prisma.accountRequest.count({ where: { status: 'PENDING' } }),
        prisma.userActivity.findMany({
            take: 8,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        })
    ]);

    const stats = [
        { label: "Total Users", value: userCount, icon: Users, color: "text-blue-600", bg: "bg-blue-600/10", href: "/dashboard/admin/users" },
        { label: "Pending Tickets", value: pendingTickets, icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-600/10", href: "/dashboard/admin/support" },
        { label: "Downloads", value: softwareDownloads._sum.downloadCount || 0, icon: Download, color: "text-green-600", bg: "bg-green-600/10", href: "/dashboard/admin/content/software" },
        { label: "Resource Requests", value: pendingRequests, icon: Key, color: "text-purple-600", bg: "bg-purple-600/10", href: "/dashboard/admin/premium" },
    ];

    const quickLinks = [
        { label: "Support Dashboard", icon: Ticket, href: "/dashboard/admin/support", desc: "Manage tickets and replies" },
        { label: "User Management", icon: UserPlus, href: "/dashboard/admin/users", desc: "Roles, status and details" },
        { label: "Serial Numbers", icon: Shield, href: "/dashboard/admin/serials", desc: "Activation and inventory" },
        { label: "Software Library", icon: Download, href: "/dashboard/admin/content/software", desc: "Mirrors and versions" },
        { label: "Tutorial Videos", icon: Play, href: "/dashboard/admin/content/videos", desc: "Content and categories" },
        { label: "System Settings", icon: LayoutDashboard, href: "/dashboard/admin/settings", desc: "General configuration" },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Admin Command Center</h2>
                    <p className="text-muted-foreground">পাওয়ার এডমিন প্যানেল: সিস্টেমের সকল কার্যক্রম এখান থেকে নিয়ন্ত্রণ করুন</p>
                </div>
                <div className="flex items-center gap-2 font-bold bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg border border-indigo-100 shadow-sm">
                    <Shield className="w-5 h-5" />
                    {session.user.role} ACCESS
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Link key={i} href={stat.href}>
                        <Card className="p-6 hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
                                    <h3 className="text-3xl font-black">{stat.value}</h3>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Quick Management Links */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Quick Management
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {quickLinks.map((link, i) => (
                            <Link key={i} href={link.href}>
                                <Card className="p-4 hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-4 group cursor-pointer border-2">
                                    <div className="p-3 rounded-lg bg-muted group-hover:bg-primary-foreground/20 transition-colors">
                                        <link.icon className="w-5 h-5 group-hover:text-primary-foreground" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{link.label}</h4>
                                        <p className="text-[10px] opacity-70 group-hover:opacity-100">{link.desc}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all" />
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Recent Ticket Alerts */}
                    <div className="pt-4">
                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            Urgent Alerts
                        </h3>
                        <Card className="p-8 border-dashed flex flex-col items-center justify-center bg-red-50/20">
                            <Activity className="w-12 h-12 text-red-100 mb-2" />
                            <p className="text-sm text-muted-foreground font-medium">বর্তমানে কোনো হার্ডওয়্যার ফেলিউর বা সিরিয়াল ইমপোর্ট এরর নেই।</p>
                        </Card>
                    </div>
                </div>

                {/* System Activity Stream */}
                <div className="space-y-6">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Live Activity
                    </h3>
                    <Card className="p-6 space-y-6 shadow-sm border-2">
                        {recentActivity.map((log) => (
                            <div key={log.id} className="flex gap-4 relative">
                                <div className="flex flex-col items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10" />
                                    <div className="w-0.5 flex-1 bg-muted my-1" />
                                </div>
                                <div className="pb-4">
                                    <p className="text-xs font-bold leading-none mb-1">{log.user.name}</p>
                                    <p className="text-[11px] text-muted-foreground line-clamp-2">{log.action}</p>
                                    <span className="text-[9px] text-muted-foreground font-bold uppercase mt-2 block">
                                        {new Date(log.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <Button variant="ghost" className="w-full text-xs font-bold text-primary gap-2" asChild>
                            <Link href="/dashboard/admin/logs">
                                View Full System Logs
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
