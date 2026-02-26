'use client'

import { useLanguage } from '@/lib/language-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Ticket,
    Clock,
    AlertCircle,
    CheckCircle2,
    AlertTriangle,
    ChevronRight,
    User,
    BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { TicketList } from '@/components/admin/support/ticket-list'

interface AdminSupportClientProps {
    totalTickets: number
    openTickets: number
    inProgressTickets: number
    resolvedTickets: number
    urgentTickets: any[]
    allTickets: any[]
}

export function AdminSupportClient({
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    urgentTickets,
    allTickets
}: AdminSupportClientProps) {
    const { t, language } = useLanguage()
    const locale = language === 'bn' ? 'bn-BD' : 'en-US'

    const stats = [
        { label: t('adminSupport.totalTickets'), value: totalTickets, icon: Ticket, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: t('adminSupport.open'), value: openTickets, icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: t('adminSupport.inProgress'), value: inProgressTickets, icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: t('adminSupport.resolved'), value: resolvedTickets, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    ]

    return (
        <div className="space-y-6 sm:space-y-10 pb-10 px-0 sm:px-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        {t('adminSupport.title')}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        {t('adminSupport.subtitle')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="lg" className="gap-2 h-11 px-6 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all group" asChild>
                        <Link href="/dashboard/admin/support/analytics">
                            <BarChart3 className="w-5 h-5 group-hover:text-primary transition-colors" />
                            {t('adminSupport.analytics')}
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="relative overflow-hidden p-4 sm:p-6 rounded-[2rem] border-2 group hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700" />
                        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className={`p-3 sm:p-4 rounded-2xl ${stat.bg} shadow-inner`}>
                                <stat.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] sm:text-xs text-muted-foreground font-black uppercase tracking-[0.15em] opacity-60">{stat.label}</p>
                                <h3 className="text-2xl sm:text-3xl font-black tabular-nums tracking-tight">{stat.value}</h3>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8 sm:gap-10">
                {/* Priority Queue */}
                <div className="lg:col-span-1 space-y-6 sm:space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-xl sm:text-2xl flex items-center gap-2.5 text-red-600 tracking-tighter">
                            <AlertTriangle className="w-6 h-6 animate-pulse" />
                            {t('adminSupport.urgentQueue')}
                        </h3>
                        <span className="px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20">
                            {urgentTickets.length} Active
                        </span>
                    </div>
                    <div className="space-y-4">
                        {urgentTickets.length > 0 ? (
                            urgentTickets.map((ticket: any) => (
                                <Link key={ticket.id} href={`/dashboard/admin/support/${ticket.id}`}>
                                    <Card className="p-5 hover:border-red-500/30 transition-all border-l-[6px] border-l-red-500 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-red-500/5 group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full -mr-8 -mt-8" />
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-black text-sm sm:text-base truncate pr-2 group-hover:text-red-600 transition-colors leading-tight">{ticket.subject}</h4>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground font-bold">
                                            <span className="flex items-center gap-2 opacity-80">
                                                <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
                                                    <User className="w-3 h-3" />
                                                </div>
                                                {ticket.user.name}
                                            </span>
                                            <span className="flex items-center gap-1 opacity-60">
                                                <Clock className="w-3 h-3" />
                                                {new Date(ticket.updatedAt).toLocaleDateString(locale)}
                                            </span>
                                        </div>
                                    </Card>
                                </Link>
                            ))
                        ) : (
                            <Card className="p-12 sm:p-20 text-center border-dashed border-2 rounded-[2.5rem] bg-muted/5">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-4 shadow-inner">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <p className="text-base font-bold text-muted-foreground tracking-tight">{t('adminSupport.noUrgentTickets')}</p>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Master Ticket List */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    <TicketList tickets={allTickets} />
                </div>
            </div>
        </div>
    )
}
