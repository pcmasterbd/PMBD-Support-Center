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
        <div className="space-y-8">
            <div className="flex flex-col md-tab:flex-row md-tab:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm-std:text-3xl font-bold tracking-tight">{t('supportPage.title')}</h2>
                    <p className="text-muted-foreground">{t('supportPage.subtitle')}</p>
                </div>
                <Link href="/dashboard/support/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        {t('supportPage.newTicket')}
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                        <Link key={ticket.id} href={`/dashboard/support/${ticket.id}`}>
                            <Card className="p-4 hover:border-primary/50 transition-all cursor-pointer group">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                            <span className={`text-[10px] uppercase font-bold ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority} {t('supportPage.priority')}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-1">{ticket.subject}</h3>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="w-3 h-3" />
                                                <span>{ticket._count.messages} {t('supportPage.messages')}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{t('supportPage.updated')}: {new Date(ticket.updatedAt).toLocaleDateString(locale)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <Card className="p-8 sm:p-20 text-center flex flex-col items-center justify-center border-dashed">
                        <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                            <AlertCircle className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold">{t('supportPage.noTickets')}</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                            {t('supportPage.noTicketsDesc')}
                        </p>
                        <Link href="/dashboard/support/new" className="mt-8">
                            <Button size="lg">{t('supportPage.startNow')}</Button>
                        </Link>
                    </Card>
                )}
            </div>

            {/* FAQ/Help section */}
            <div className="pt-10">
                <h3 className="font-bold text-xl mb-6">{t('supportPage.faq')}</h3>
                <div className="grid md-tab:grid-cols-2 gap-4">
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
        <Card className="p-5">
            <h4 className="font-bold text-sm mb-2 text-primary">{qLabel}: {q}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{aLabel}: {a}</p>
        </Card>
    )
}
