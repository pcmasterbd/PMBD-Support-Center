'use client'

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Ticket,
    Download,
    Key,
    AlertCircle,
    ArrowRight,
    ArrowUpRight,
    Play,
    Shield,
    Activity,
    UserPlus,
    LayoutDashboard,
    Zap,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

interface ActivityItem {
    id: string;
    action: string;
    createdAt: string;
    userName: string | null;
}

interface AdminDashboardClientProps {
    role: string;
    userCount: number;
    pendingTickets: number;
    totalDownloads: number;
    pendingRequests: number;
    avgRating: number;
    recentActivity: ActivityItem[];
}

export function AdminDashboardClient({
    role,
    userCount,
    pendingTickets,
    totalDownloads,
    pendingRequests,
    avgRating,
    recentActivity,
}: AdminDashboardClientProps) {
    const { t } = useLanguage();

    const stats = [
        { label: t('adminDashboard.totalUsers'), value: userCount, icon: Users, color: "blue", href: "/dashboard/admin/users" },
        { label: t('adminDashboard.pendingTickets'), value: pendingTickets, icon: AlertCircle, color: "orange", href: "/dashboard/admin/support" },
        { label: t('adminDashboard.totalDownloads'), value: totalDownloads, icon: Download, color: "green", href: "/dashboard/admin/content/software" },
        { label: t('adminDashboard.avgRating'), value: avgRating.toFixed(1), icon: Activity, color: "yellow", href: "/dashboard/admin/support" },
    ];

    const quickLinks = [
        { label: t('adminDashboard.supportDashboard'), icon: Ticket, href: "/dashboard/admin/support", desc: t('adminDashboard.supportDashboardDesc'), color: "from-orange-500 to-red-500" },
        { label: t('adminDashboard.userManagement'), icon: UserPlus, href: "/dashboard/admin/users", desc: t('adminDashboard.userManagementDesc'), color: "from-blue-500 to-cyan-500" },
        { label: t('adminDashboard.serialNumbers'), icon: Shield, href: "/dashboard/admin/serials", desc: t('adminDashboard.serialNumbersDesc'), color: "from-emerald-500 to-green-500" },
        { label: t('adminDashboard.softwareLibrary'), icon: Download, href: "/dashboard/admin/content/software", desc: t('adminDashboard.softwareLibraryDesc'), color: "from-violet-500 to-purple-500" },
        { label: t('adminDashboard.videoTutorials'), icon: Play, href: "/dashboard/admin/content/videos", desc: t('adminDashboard.videoTutorialsDesc'), color: "from-pink-500 to-rose-500" },
        { label: t('adminDashboard.systemSettings'), icon: LayoutDashboard, href: "/dashboard/admin/settings", desc: t('adminDashboard.systemSettingsDesc'), color: "from-slate-500 to-gray-600" },
    ];

    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'hover:border-blue-500/30' },
        orange: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'hover:border-orange-500/30' },
        green: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'hover:border-emerald-500/30' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'hover:border-purple-500/30' },
        yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', border: 'hover:border-yellow-500/30' },
    };

    return (
        <div className="space-y-6 sm:space-y-8 pb-10">

            {/* ── Admin Hero Header ── */}
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-5 sm:p-8 md:p-10 text-white shadow-2xl">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                                <Shield className="w-4 h-4 text-indigo-400" />
                            </div>
                            <span className="text-[10px] sm:text-xs font-black text-indigo-300 uppercase tracking-[0.2em]">{role} ACCESS</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                            {t('adminDashboard.adminLabel')} <span className="text-indigo-400">{t('adminDashboard.commandCenter')}</span>
                        </h2>
                        <p className="text-sm text-white/50 font-medium max-w-lg">
                            {t('adminDashboard.systemDesc')}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 self-start sm:self-auto">
                        {pendingTickets > 0 && (
                            <Link href="/dashboard/admin/support">
                                <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-xl px-4 py-2.5 hover:bg-orange-500/30 transition-colors">
                                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                                    <span className="text-xs font-bold text-orange-300">{pendingTickets} {t('adminDashboard.pendingTickets')}</span>
                                </div>
                            </Link>
                        )}
                        {pendingRequests > 0 && (
                            <Link href="/dashboard/admin/premium">
                                <div className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-xl px-4 py-2.5 hover:bg-purple-500/30 transition-colors">
                                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                                    <span className="text-xs font-bold text-purple-300">{pendingRequests} {t('adminDashboard.requests')}</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 rounded-full -mr-36 -mt-36 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-blue-500/5 rounded-full -mb-24 blur-2xl" />
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat, i) => {
                    const c = colorMap[stat.color];
                    return (
                        <Link key={i} href={stat.href}>
                            <Card className={`p-4 sm:p-5 hover:shadow-xl transition-all duration-300 cursor-pointer group rounded-2xl border-2 ${c.border} h-full`}>
                                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                                    <div className={`p-2.5 sm:p-3 rounded-xl ${c.bg} ${c.text} group-hover:scale-110 transition-transform ring-1 ring-black/5`}>
                                        <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-muted-foreground/20 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <p className="text-[10px] sm:text-xs text-muted-foreground font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-2xl sm:text-3xl font-black tabular-nums tracking-tight">{stat.value}</h3>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* ── Quick Management + Activity ── */}
            <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">

                {/* Quick Links */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <h3 className="font-bold text-base sm:text-lg tracking-tight">{t('adminDashboard.quickManagement')}</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        {quickLinks.map((link, i) => (
                            <Link key={i} href={link.href}>
                                <Card className="p-4 sm:p-5 hover:shadow-lg transition-all duration-300 flex items-center gap-3 sm:gap-4 group cursor-pointer border-2 hover:border-primary/20 rounded-2xl h-full">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${link.color} text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                                        <link.icon className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-sm tracking-tight">{link.label}</h4>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">{link.desc}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Urgent Alerts */}
                    <Card className="p-5 sm:p-8 border-2 border-dashed border-emerald-500/20 flex flex-col items-center justify-center bg-emerald-500/5 rounded-2xl">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500/30 mb-3" />
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-bold mb-1">{t('adminDashboard.noUrgentIssues')}</p>
                        <p className="text-xs text-muted-foreground font-medium text-center">{t('adminDashboard.noHardwareFailure')}</p>
                    </Card>
                </div>

                {/* Live Activity Stream */}
                <div className="space-y-4 sm:space-y-5">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        <h3 className="font-bold text-base sm:text-lg tracking-tight">{t('adminDashboard.liveActivity')}</h3>
                    </div>
                    <Card className="p-4 sm:p-5 space-y-4 border-2 rounded-2xl max-h-[500px] overflow-y-auto customize-scrollbar">
                        {recentActivity.map((log) => (
                            <div key={log.id} className="flex gap-3 group">
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10 mt-1" />
                                    <div className="w-[2px] flex-1 bg-gradient-to-b from-primary/20 to-transparent my-1" />
                                </div>
                                <div className="pb-3 min-w-0">
                                    <p className="text-xs font-bold leading-none mb-1.5 truncate">{log.userName}</p>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{log.action}</p>
                                    <span className="text-[9px] text-muted-foreground/50 font-bold uppercase mt-2 block tracking-tight">
                                        {new Date(log.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-primary gap-2 h-10 rounded-xl border border-primary/10 hover:border-primary/30" asChild>
                            <Link href="/dashboard/admin/logs">
                                {t('adminDashboard.viewSystemLogs')}
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
