'use client'

import { useLanguage } from '@/lib/language-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, MessageSquare, Clock, AlertCircle, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface TicketData {
    id: string
    subject: string
    status: string
    priority: string
    updatedAt: string
    _count: { messages: number }
}

export function SupportClient({ tickets }: { tickets: TicketData[] }) {
    const { t, language } = useLanguage()

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-500/10 text-blue-500 border-blue-200'
            case 'IN_PROGRESS': return 'bg-orange-500/10 text-orange-500 border-orange-200'
            case 'RESOLVED': return 'bg-green-500/10 text-green-500 border-green-200'
            case 'CLOSED': return 'bg-muted text-muted-foreground border-muted'
            default: return 'bg-muted text-muted-foreground'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'text-red-600 font-bold'
            case 'HIGH': return 'text-orange-600 font-bold'
            default: return 'text-muted-foreground'
        }
    }

    const locale = language === 'bn' ? 'bn-BD' : 'en-US'

    return (
        <div className="space-y-10 pb-10 px-0 sm:px-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        {t('supportPage.title')}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        {t('supportPage.subtitle')}
                    </p>
                </div>
                <Link href="/dashboard/support/new">
                    <Button className="h-12 px-6 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        <Plus className="w-5 h-5" />
                        {t('supportPage.newTicket')}
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 sm:gap-6">
                {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                        <Link key={ticket.id} href={`/dashboard/support/${ticket.id}`} className="group relative">
                            <Card className="p-5 sm:p-6 rounded-[2rem] border-2 border-muted/40 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden group">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-primary/[0.03] to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                                <div className="flex items-center justify-between gap-6">
                                    <div className="flex-1 min-w-0 space-y-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-tight border-2 ${ticket.status === 'OPEN' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600' :
                                                    ticket.status === 'RESOLVED' ? 'bg-green-500/10 border-green-500/20 text-green-600' :
                                                        ticket.status === 'IN_PROGRESS' ? 'bg-purple-500/10 border-purple-500/20 text-purple-600' :
                                                            'bg-muted/30 border-muted/40 text-muted-foreground'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority} {t('supportPage.priority')}
                                            </span>
                                        </div>

                                        <h3 className="text-lg sm:text-xl font-black tracking-tight group-hover:text-primary transition-colors truncate">{ticket.subject}</h3>

                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] sm:text-xs text-muted-foreground font-bold">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                </div>
                                                <span>{ticket._count.messages} {t('supportPage.messages')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-60">
                                                <Clock className="w-4 h-4" />
                                                <span>{t('supportPage.updated')}: {new Date(ticket.updatedAt).toLocaleDateString(locale)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex p-3 rounded-2xl bg-muted/30 group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-12 transition-all duration-300">
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <Card className="p-12 sm:p-24 text-center flex flex-col items-center justify-center border-dashed border-2 rounded-[3rem] bg-muted/5">
                        <div className="w-20 h-20 rounded-[2rem] bg-muted/30 flex items-center justify-center mb-8 rotate-12 group-hover:rotate-0 transition-transform">
                            <AlertCircle className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter">{t('supportPage.noTickets')}</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-4 text-sm font-medium leading-relaxed">
                            {t('supportPage.noTicketsDesc')}
                        </p>
                        <Link href="/dashboard/support/new" className="mt-10">
                            <Button size="lg" className="h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-primary/10">
                                {t('supportPage.startNow')}
                            </Button>
                        </Link>
                    </Card>
                )}
            </div>

            {/* FAQ/Help section */}
            <div className="pt-16 sm:pt-20 border-t border-muted/40">
                <div className="flex items-center gap-4 mb-8">
                    <h3 className="font-black text-2xl sm:text-3xl tracking-tighter">{t('supportPage.faq')}</h3>
                    <div className="h-1 w-20 bg-primary/20 rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FaqItem q={t('supportPage.faqQ1')} a={t('supportPage.faqA1')} qLabel={t('supportPage.question')} aLabel={t('supportPage.answer')} />
                    <FaqItem q={t('supportPage.faqQ2')} a={t('supportPage.faqA2')} qLabel={t('supportPage.question')} aLabel={t('supportPage.answer')} />
                    <FaqItem q={t('supportPage.faqQ3')} a={t('supportPage.faqA3')} qLabel={t('supportPage.question')} aLabel={t('supportPage.answer')} />
                    <FaqItem q={t('supportPage.faqQ4')} a={t('supportPage.faqA4')} qLabel={t('supportPage.question')} aLabel={t('supportPage.answer')} />
                </div>
            </div>
        </div>
    )
}

function FaqItem({ q, a, qLabel, aLabel }: { q: string; a: string; qLabel: string; aLabel: string }) {
    return (
        <Card className="p-6 sm:p-8 rounded-3xl border-2 border-muted/30 hover:border-primary/20 hover:shadow-xl transition-all group">
            <h4 className="font-black text-base sm:text-lg mb-4 text-primary tracking-tight leading-snug group-hover:translate-x-1 transition-transform">{qLabel}: {q}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium opacity-80">{aLabel}: {a}</p>
        </Card>
    )
}
