'use client'

import { Card } from '@/components/ui/card'
import {
    Shield,
    Video,
    Download,
    Key,
    Activity,
    CheckCircle2,
    Clock,
    ChevronRight,
    LifeBuoy,
    ArrowUpRight,
    Zap,
    HeartHandshake,
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'

interface UserData {
    name: string | null
    serialNumber: { code: string; assignedAt: string | null } | null
    activities: { id: string; action: string; details: string | null; createdAt: string }[]
    tickets: { subject: string }[]
    _count: { downloads: number; activities: number; tickets: number }
}

export function UserDashboardClient({ user, videoCount }: { user: UserData | null; videoCount: number }) {
    const { t } = useLanguage()

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return t('userDashboard.goodMorning')
        if (hour < 18) return t('userDashboard.goodAfternoon')
        return t('userDashboard.goodEvening')
    }

    const getTimeEmoji = () => {
        const hour = new Date().getHours()
        if (hour < 12) return '🌅'
        if (hour < 18) return '☀️'
        return '🌙'
    }

    return (
        <div className="space-y-6 sm:space-y-8 pb-10">

            {/* ── Hero Welcome Banner ── */}
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-blue-700 dark:from-primary dark:via-primary/80 dark:to-indigo-900 p-5 sm:p-8 md:p-10 text-white shadow-2xl shadow-primary/20">
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white/70">
                                <span>{getTimeEmoji()}</span>
                                <span className="uppercase tracking-widest">{getGreeting()}</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                                {user?.name} <span className="text-white/60 font-light">|</span> <span className="text-blue-200 italic font-semibold text-xl sm:text-2xl md:text-3xl">{t('userDashboard.premiumUser')}</span>
                            </h2>
                            <p className="text-sm sm:text-base text-white/60 font-medium max-w-xl leading-relaxed">
                                {t('userDashboard.welcomeDesc')}
                            </p>
                        </div>
                        <Link href="/dashboard/profile" className="self-start md:self-auto flex-shrink-0">
                            <div className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3 transition-all duration-300 group">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-black">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-bold">{t('header.myProfile')}</p>
                                    <p className="text-[10px] text-white/50">{t('header.settings')}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -ml-20 -mb-20 blur-2xl" />
            </div>

            {/* ── Product Card + Stats ── */}
            <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">

                <div className="lg:col-span-2 space-y-5 sm:space-y-6">

                    {/* Serial Number Card */}
                    <Card className="relative overflow-hidden border-2 border-primary/10 bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-5 sm:p-7 rounded-2xl md:rounded-3xl hover:border-primary/20 transition-all duration-300">
                        <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 rounded-xl">
                                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest">{t('userDashboard.registeredProduct')}</p>
                                    <p className="text-xs text-muted-foreground/60 font-medium">Premium Support Pack</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Verified</span>
                            </div>
                        </div>

                        <div className="space-y-1 mb-6">
                            <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">{t('userDashboard.serialNumber')}</p>
                            <p className="text-2xl sm:text-3xl md:text-4xl font-mono font-black tracking-tight text-foreground">
                                {user?.serialNumber?.code || "N/A"}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                            <div>
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">{t('userDashboard.registrationDate')}</p>
                                <p className="text-xs sm:text-sm font-bold">{user?.serialNumber?.assignedAt ? new Date(user.serialNumber.assignedAt).toLocaleDateString('bn-BD') : t('userDashboard.unknown')}</p>
                            </div>
                            <div>
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">{t('userDashboard.status')}</p>
                                <p className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    {t('userDashboard.active')}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
                        <StatCard title={t('userDashboard.tutorialsWatched')} value={user?._count.activities || 0} total={videoCount} icon={<Video className="w-5 h-5" />} color="blue" />
                        <StatCard title={t('userDashboard.softwareDownloads')} value={user?._count.downloads || 0} icon={<Download className="w-5 h-5" />} color="green" />
                        <StatCard title={t('userDashboard.supportTickets')} value={user?._count.tickets || 0} icon={<LifeBuoy className="w-5 h-5" />} color="purple" />
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <h3 className="font-bold text-base sm:text-lg tracking-tight">{t('userDashboard.quickAccess')}</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <QuickTile href="/dashboard/tutorials" title={t('userDashboard.tutorials')} icon={<Video className="w-5 h-5" />} gradient="from-blue-500 to-blue-600" />
                            <QuickTile href="/dashboard/software" title={t('userDashboard.software')} icon={<Download className="w-5 h-5" />} gradient="from-emerald-500 to-green-600" />
                            <QuickTile href="/dashboard/premium/accounts" title={t('userDashboard.premium')} icon={<Key className="w-5 h-5" />} gradient="from-purple-500 to-violet-600" />
                            <QuickTile href="/dashboard/support" title={t('sidebar.support')} icon={<HeartHandshake className="w-5 h-5" />} gradient="from-rose-500 to-red-600" />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-5 sm:space-y-6">

                    {/* Support Status */}
                    <Card className="overflow-hidden border-2 rounded-2xl md:rounded-3xl hover:shadow-lg transition-all duration-300">
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-500/10 to-amber-500/5 border-b border-orange-200/30 dark:border-orange-900/30">
                            <h4 className="font-bold flex items-center gap-2 text-sm sm:text-base">
                                <div className="p-1.5 bg-orange-500/10 rounded-lg">
                                    <LifeBuoy className="w-4 h-4 text-orange-500" />
                                </div>
                                {t('userDashboard.supportStatus')}
                            </h4>
                        </div>
                        <div className="p-4 sm:p-5">
                            {user?.tickets && user.tickets.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-xl text-xs sm:text-sm border border-orange-100 dark:border-orange-900/50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                            <p className="font-bold text-orange-800 dark:text-orange-400">{t('userDashboard.activeTicket')}</p>
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-orange-700/80 dark:text-orange-500/80 font-medium line-clamp-1 pl-4">&quot;{user.tickets[0].subject}&quot;</p>
                                    </div>
                                    <Link href="/dashboard/support" className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1 font-bold">
                                        {t('userDashboard.viewTicket')} <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-1">{t('userDashboard.allGood')}</p>
                                    <p className="text-xs text-muted-foreground font-medium mb-4">{t('userDashboard.noPendingTickets')}</p>
                                    <Link href="/dashboard/support">
                                        <button className="w-full h-10 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                            {t('userDashboard.openNewTicket')}
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Activity Timeline */}
                    <Card className="overflow-hidden flex flex-col h-full max-h-[500px] rounded-2xl md:rounded-3xl border-2 hover:shadow-lg transition-all duration-300">
                        <div className="p-4 sm:p-5 border-b bg-muted/30 flex items-center justify-between">
                            <h4 className="font-bold flex items-center gap-2 text-sm sm:text-base">
                                <div className="p-1.5 bg-primary/10 rounded-lg">
                                    <Clock className="w-4 h-4 text-primary" />
                                </div>
                                {t('userDashboard.recentLog')}
                            </h4>
                            <Link href="/dashboard/activity" className="text-[10px] sm:text-xs text-primary hover:underline font-bold uppercase tracking-wider flex items-center gap-1">
                                {t('userDashboard.viewAll')} <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5 customize-scrollbar">
                            {user?.activities && user.activities.length > 0 ? (
                                user.activities.map((activity, idx) => (
                                    <div key={activity.id} className="relative pl-5 sm:pl-6 pb-4 sm:pb-5 last:pb-0">
                                        {idx !== user.activities.length - 1 && (
                                            <div className="absolute left-[3px] top-[14px] bottom-[-16px] sm:bottom-[-18px] w-[2px] bg-gradient-to-b from-primary/30 to-transparent" />
                                        )}
                                        <div className="absolute left-0 top-[6px] w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10" />
                                        <div className="space-y-1">
                                            <p className="text-xs sm:text-sm font-bold leading-none">{activity.action}</p>
                                            {activity.details && (
                                                <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug font-medium line-clamp-2">{activity.details}</p>
                                            )}
                                            <p className="text-[9px] sm:text-[10px] text-muted-foreground/60 pt-1 font-bold uppercase tracking-tight">
                                                {new Date(activity.createdAt).toLocaleString('bn-BD', {
                                                    hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-40 flex flex-col items-center justify-center text-center">
                                    <Activity className="w-8 h-8 text-muted/30 mb-2" />
                                    <p className="text-sm text-muted-foreground font-medium">{t('userDashboard.noRecords')}</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

/* ── Sub Components ── */

function StatCard({ title, value, total, icon, color }: { title: string, value: number, total?: number, icon: React.ReactNode, color: string }) {
    const colorMap: any = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-500/20' },
        green: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500/20' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', ring: 'ring-purple-500/20' },
    }
    const c = colorMap[color] || colorMap.blue

    return (
        <Card className="p-4 sm:p-5 hover:shadow-md transition-all duration-300 border-2 hover:border-primary/20 rounded-2xl group">
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${c.bg} ${c.text} ring-1 ${c.ring} group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                {total && total > 0 && (
                    <span className="text-[9px] font-black bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-tight">
                        {Math.round((value / total) * 100)}%
                    </span>
                )}
            </div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">{title}</p>
            <p className="text-2xl sm:text-3xl font-black tabular-nums tracking-tight">{value}</p>
        </Card>
    )
}

function QuickTile({ href, title, icon, gradient }: { href: string, title: string, icon: React.ReactNode, gradient: string }) {
    return (
        <Link href={href}>
            <div className="group relative p-4 sm:p-5 rounded-2xl bg-card border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg cursor-pointer text-center h-full">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 mb-3`}>
                    {icon}
                </div>
                <p className="text-xs sm:text-sm font-bold tracking-tight">{title}</p>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all" />
            </div>
        </Link>
    )
}
