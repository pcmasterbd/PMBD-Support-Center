import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    Download,
    Ticket,
    Clock,
    Activity,
    ArrowLeft,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    XCircle
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ManagementNotes } from "@/components/admin/management-notes";

export default async function AdminUserProfilePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = await paramsPromise;
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    const user = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
            serialNumber: true,
            _count: {
                select: {
                    tickets: true,
                    downloads: true,
                    activities: true
                }
            },
            tickets: {
                take: 5,
                orderBy: { updatedAt: 'desc' }
            },
            downloads: {
                take: 5,
                orderBy: { downloadedAt: 'desc' },
                include: { software: { select: { name: true } } }
            },
            activities: {
                take: 10,
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!user) return notFound();

    const stats = [
        { label: "Total Tickets", value: user._count.tickets, icon: Ticket, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Downloads", value: user._count.downloads, icon: Download, color: "text-green-600", bg: "bg-green-50" },
        { label: "Total Actions", value: user._count.activities, icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 border-b pb-6">
                <Link href="/dashboard/admin/users">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === 'SUPERADMIN' ? 'bg-indigo-600 text-white' : user.role === 'ADMIN' ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                            {user.role}
                        </span>
                        <span>User ID: {user.id}</span>
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info & Stats */}
                <div className="space-y-6">
                    {/* Basic Info */}
                    <Card className="p-6">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Account Information</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Email Address</p>
                                    <p className="text-sm font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Phone Number</p>
                                    <p className="text-sm font-medium">{user.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Joined On</p>
                                    <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Last Login</p>
                                    <p className="text-sm font-medium">{user.lastLogin ? new Date(user.lastLogin).toLocaleString('bn-BD') : 'Never'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t flex items-center justify-between">
                            <span className="text-sm font-bold">Account Status</span>
                            <div className="flex items-center gap-2">
                                {user.isActive ? (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                                        <CheckCircle2 className="w-4 h-4" /> Active
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                                        <XCircle className="w-4 h-4" /> Inactive
                                    </span>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Serial Info */}
                    <Card className="p-6 border-2 border-primary/10 bg-primary/5">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4" /> Serial Number Status
                        </h4>
                        {user.serialNumber ? (
                            <div className="space-y-3">
                                <div className="p-3 bg-white rounded-lg border font-mono text-center text-lg font-bold tracking-widest">
                                    {user.serialNumber.code}
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Assigned Date:</span>
                                    <span className="font-medium">{new Date(user.serialNumber.assignedAt || user.serialNumber.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className={`font-bold ${user.serialNumber.status === 'ACTIVE' ? 'text-green-600' : 'text-orange-600'}`}>{user.serialNumber.status}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <AlertCircle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                <p className="text-xs text-muted-foreground">No serial number assigned to this user.</p>
                                <Button size="sm" variant="outline" className="mt-4 w-full text-xs">Assign Serial</Button>
                            </div>
                        )}
                    </Card>

                    <ManagementNotes userId={user.id} initialNotes={user.adminNotes} />
                </div>

                {/* Right Column: Stats & Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {stats.map((stat, i) => (
                            <Card key={i} className="p-6 text-center shadow-sm">
                                <div className={`w-10 h-10 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
                            </Card>
                        ))}
                    </div>

                    {/* Activity Tabs-like Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Recent Tickets */}
                        <Card className="p-6">
                            <h4 className="font-bold text-sm mb-4">Recent Support Tickets</h4>
                            <div className="space-y-3">
                                {user.tickets.length > 0 ? (
                                    user.tickets.map((ticket) => (
                                        <Link key={ticket.id} href={`/dashboard/admin/support/${ticket.id}`}>
                                            <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors flex items-center justify-between group">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold truncate pr-4">{ticket.subject}</p>
                                                    <p className="text-[9px] text-muted-foreground mt-1 uppercase font-bold">{ticket.status} • {new Date(ticket.updatedAt).toLocaleDateString()}</p>
                                                </div>
                                                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground text-center py-6 border border-dashed rounded-lg italic">কোনো টিকেট নেই</p>
                                )}
                            </div>
                        </Card>

                        {/* Recent Downloads */}
                        <Card className="p-6">
                            <h4 className="font-bold text-sm mb-4">Recent Software Downloads</h4>
                            <div className="space-y-3">
                                {user.downloads.length > 0 ? (
                                    user.downloads.map((download) => (
                                        <div key={download.id} className="p-3 rounded-lg border flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold truncate pr-4">{download.software.name}</p>
                                                <p className="text-[9px] text-muted-foreground mt-1 uppercase font-bold">{new Date(download.downloadedAt).toLocaleDateString('bn-BD')}</p>
                                            </div>
                                            <Download className="w-3 h-3 text-muted-foreground" />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground text-center py-6 border border-dashed rounded-lg italic">কোনো ডাউনলোড লিস্ট নেই</p>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Live Activity Log */}
                    <Card className="p-6">
                        <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            Security & Activity Logs
                        </h4>
                        <div className="space-y-4">
                            {user.activities.length > 0 ? (
                                user.activities.map((activity) => (
                                    <div key={activity.id} className="flex gap-4 relative">
                                        <div className="flex flex-col items-center">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            <div className="w-0.5 flex-1 bg-muted my-1" />
                                        </div>
                                        <div className="pb-4 flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-bold">{activity.action}</p>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {new Date(activity.createdAt).toLocaleString('bn-BD')}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mt-1 italic">{activity.details || "No additional details recorded"}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-6 border border-dashed rounded-lg italic">অ্যাটিভিটি লগ খালি</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
