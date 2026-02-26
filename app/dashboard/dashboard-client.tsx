'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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
    serialNumber: {
        code: string;
        assignedAt: string | null;
        expiresAt: string | null;
        packageType?: string | null
    } | null
    activities: { id: string; action: string; details: string | null; createdAt: string }[]
    downloads: { id: string; softwareName: string; downloadedAt: string }[]
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

    const getDaysRemaining = () => {
        if (!user?.serialNumber?.expiresAt) return null
        const expiry = new Date(user.serialNumber.expiresAt)
        const diffTime = expiry.getTime() - new Date().getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays > 0 ? diffDays : 0
    }

    const daysRemaining = getDaysRemaining()

    return (
        <div className="space-y-6 sm:space-y-8 pb-10">

            {/* ── Hero Welcome Banner ── */}
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-blue-700 dark:from-primary dark:via-primary/80 dark:to-indigo-900 p-5 sm:p-8 md:p-10 text-white shadow-2xl shadow-primary/20">
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white/70">
                                <span>{getTimeEmoji()}</span>
                                <span className="uppercase tracking-widest">{getGreeting()}</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight">
                                {t('userDashboard.hello') !== 'userDashboard.hello' ? t('userDashboard.hello') : 'Hello'}, {user?.name || 'User'}! <span className="text-white/40 font-light">👋</span>
                            </h2>
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider border border-white/20">
                                    {user?.serialNumber ? (user?.serialNumber?.packageType?.split(' - ')[0] || 'Premium') : 'Free'} User
                                </span>
                                {user?.serialNumber ? (
                                    daysRemaining !== null ? (
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border",
                                            daysRemaining < 30
                                                ? "bg-red-500/20 text-red-100 border-red-500/30"
                                                : "bg-emerald-500/20 text-emerald-100 border-emerald-500/30"
                                        )}>
                                            Validity: {daysRemaining} Days
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-100 border-emerald-500/30 rounded-full text-xs font-black uppercase tracking-wider">
                                            Validity: Lifetime
                                        </span>
                                    )
                                ) : (
                                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-full text-xs font-black uppercase tracking-wider">
                                        Pending Activation
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[120px]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Downloads</p>
                                <p className="text-2xl font-black">{user?._count.downloads || 0}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[120px]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Tickets</p>
                                <p className="text-2xl font-black">{user?._count.tickets || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -ml-20 -mb-20 blur-2xl" />
            </div>

            {/* ── Quick Links Group ── */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <h3 className="font-bold text-base sm:text-lg tracking-tight">Quick Resources</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickTile
                        href="/dashboard/software"
                        title="Software"
                        desc="Downloads & Tools"
                        icon={<Download className="w-6 h-6" />}
                        gradient="from-blue-500 to-blue-600 shadow-blue-500/25"
                    />
                    <QuickTile
                        href="/dashboard/tutorials"
                        title="Tutorials"
                        desc="Video Guides"
                        icon={<Video className="w-6 h-6" />}
                        gradient="from-emerald-500 to-green-600 shadow-emerald-500/25"
                    />
                    <QuickTile
                        href="/dashboard/support"
                        title="Tickets"
                        desc="Get Help Now"
                        icon={<LifeBuoy className="w-6 h-6" />}
                        gradient="from-orange-500 to-amber-600 shadow-orange-500/25"
                    />
                    <QuickTile
                        href="/dashboard/premium/licenses"
                        title="Premium Keys"
                        desc="Keys & accounts"
                        icon={<Key className="w-6 h-6" />}
                        gradient="from-purple-500 to-indigo-600 shadow-purple-500/25"
                    />
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">

                {/* ── Recent Activity & Downloads ── */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-3xl border-2 overflow-hidden">
                        <div className="p-5 border-b bg-muted/30 flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary" />
                                Recent Downloads
                            </h3>
                            <Link href="/dashboard/software" className="text-xs font-bold text-primary hover:underline">View All</Link>
                        </div>
                        <div className="p-2">
                            {user?.downloads && user.downloads.length > 0 ? (
                                <div className="divide-y">
                                    {user.downloads.map((dl) => (
                                        <div key={dl.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-xl group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                    <Download className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-foreground">{dl.softwareName}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                                                        {new Date(dl.downloadedAt).toLocaleDateString('bn-BD', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 rounded-lg" asChild>
                                                <Link href="/dashboard/software">Download Again</Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-muted-foreground italic text-sm">No downloads yet.</div>
                            )}
                        </div>
                    </Card>

                    {/* Support Status Inline */}
                    <Card className="rounded-3xl border-2 bg-gradient-to-br from-orange-500/5 to-transparent p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                                    <LifeBuoy className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg">Support Center</h3>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Active Tickets</p>
                                </div>
                            </div>
                            <Button className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20" asChild>
                                <Link href="/dashboard/support">New Ticket</Link>
                            </Button>
                        </div>

                        {user?.tickets && user.tickets.length > 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-orange-200/50 dark:border-orange-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold truncate max-w-xs">{user.tickets[0].subject}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Pending Reply</span>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-lg h-9 border-2 font-black text-xs" asChild>
                                    <Link href="/dashboard/support">Track Status</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-emerald-500/5 rounded-2xl p-5 border border-emerald-500/10 flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                </div>
                                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Everything looks great! No issues reported.</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* ── Side Info ── */}
                <div className="space-y-6">
                    {/* Expiry Card */}
                    <Card className="rounded-3xl border-2 p-6 bg-slate-900 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-4">Account Snapshot</p>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs text-white/40 font-bold mb-1 uppercase tracking-widest">Valid Until</p>
                                    <p className="text-xl font-black text-blue-400">
                                        {user?.serialNumber?.expiresAt
                                            ? new Date(user.serialNumber.expiresAt).toLocaleDateString('bn-BD', { day: '2-digit', month: 'long', year: 'numeric' })
                                            : 'Lifetime Support'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 font-bold mb-1 uppercase tracking-widest">Serial Number</p>
                                    <p className="font-mono font-bold tracking-[0.1em] text-sm break-all bg-white/5 p-3 rounded-xl border border-white/10">
                                        {user?.serialNumber?.code || '••••-••••-••••-••••'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                    </Card>

                    {/* Simple Activity Feed */}
                    <Card className="rounded-3xl border-2 h-full max-h-[400px] flex flex-col overflow-hidden">
                        <div className="p-4 border-b bg-muted/50 font-black text-xs uppercase tracking-widest">System Logs</div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 customize-scrollbar">
                            {user?.activities.map((a) => (
                                <div key={a.id} className="flex gap-3 relative pb-4 last:pb-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 ring-4 ring-primary/10 flex-shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-foreground leading-tight">{a.action}</p>
                                        <p className="text-[10px] text-muted-foreground leading-snug">{a.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

/* ── Refined Sub Components ── */

function QuickTile({ href, title, desc, icon, gradient }: { href: string, title: string, desc: string, icon: React.ReactNode, gradient: string }) {
    return (
        <Link href={href}>
            <div className="group relative p-5 rounded-3xl bg-card border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl cursor-pointer h-full overflow-hidden">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mb-4`}>
                    {icon}
                </div>
                <div className="space-y-0.5">
                    <p className="text-sm font-black tracking-tight">{title}</p>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-tight line-clamp-1">{desc}</p>
                </div>
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-[2] transition-transform duration-500" />
            </div>
        </Link>
    )
}
