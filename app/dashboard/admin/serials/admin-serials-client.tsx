'use client'

import { useLanguage } from '@/lib/language-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Hash,
    CheckCircle2,
    Box,
    TrendingUp,
    Download,
    Calendar,
    User
} from 'lucide-react'
import { SerialImport } from '@/components/admin/serial-import'

interface SerialData {
    id: string
    code: string
    isActivated: boolean
    assignedAt?: string | null
    user?: {
        name?: string | null
        email?: string | null
    } | null
    createdAt: string
}

interface SerialStatsProps {
    totalSerials: number
    activatedCount: number
    availableCount: number
    serials: SerialData[]
}

export function AdminSerialsClient({
    totalSerials,
    activatedCount,
    availableCount,
    serials
}: SerialStatsProps) {
    const { t, language } = useLanguage()
    const locale = language === 'bn' ? 'bn-BD' : 'en-US'

    const activationRate = totalSerials > 0 ? Math.round((activatedCount / totalSerials) * 100) : 0

    const stats = [
        { label: t('adminSerials.totalGenerated'), value: totalSerials, icon: Hash, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: t('adminSerials.activated'), value: activatedCount, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
        { label: t('adminSerials.available'), value: availableCount, icon: Box, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: t('adminSerials.activationRate'), value: `${activationRate}%`, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
    ]

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('adminSerials.title')}</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">{t('adminSerials.subtitle')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 h-9 text-xs sm:text-sm rounded-xl">
                        <Download className="w-4 h-4" />
                        {t('adminSerials.export')}
                    </Button>
                    <SerialImport />
                </div>
            </div>

            {/* Stats */}
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

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {serials.map((serial) => (
                    <Card key={serial.id} className="p-4 border-2 rounded-2xl hover:border-primary/20 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <code className="font-mono text-sm font-bold bg-muted px-2 py-1 rounded border">{serial.code}</code>
                            {serial.isActivated ? (
                                <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-bold uppercase">{t('adminSerials.activated')}</span>
                            ) : (
                                <span className="text-[10px] bg-yellow-500 text-white px-2 py-0.5 rounded-full font-bold uppercase">{t('adminSerials.available')}</span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t text-xs text-muted-foreground">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest block mb-1">{t('adminSerials.activatedBy')}</span>
                                {serial.user ? (
                                    <span className="flex items-center gap-1 font-medium text-foreground">
                                        <User className="w-3 h-3" />
                                        {serial.user.name}
                                    </span>
                                ) : (
                                    <span className="italic">{t('adminSerials.notActivated')}</span>
                                )}
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest block mb-1">{t('adminSerials.activationDate')}</span>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {serial.assignedAt ? new Date(serial.assignedAt).toLocaleDateString(locale) : '-'}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
                {serials.length === 0 && (
                    <Card className="p-8 text-center border-2 border-dashed rounded-2xl">
                        <Hash className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">{t('adminSerials.noSerials')}</p>
                    </Card>
                )}
            </div>

            {/* Desktop Table */}
            <Card className="hidden md:block overflow-hidden border-2 rounded-2xl">
                <div className="overflow-x-auto customize-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-4 py-3 font-bold">{t('adminSerials.serialCode')}</th>
                                <th className="px-4 py-3 font-bold">{t('adminUsers.status')}</th>
                                <th className="px-4 py-3 font-bold">{t('adminSerials.activatedBy')}</th>
                                <th className="px-4 py-3 font-bold">{t('adminSerials.activationDate')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {serials.map((serial) => (
                                <tr key={serial.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-4">
                                        <code className="font-mono text-sm font-bold bg-muted px-2 py-1 rounded border">{serial.code}</code>
                                    </td>
                                    <td className="px-4 py-4">
                                        {serial.isActivated ? (
                                            <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-bold uppercase">{t('adminSerials.activated')}</span>
                                        ) : (
                                            <span className="text-[10px] bg-yellow-500 text-white px-2 py-0.5 rounded-full font-bold uppercase">{t('adminSerials.available')}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        {serial.user ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold uppercase">
                                                    {serial.user.name?.slice(0, 2)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{serial.user.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">{serial.user.email}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground italic">{t('adminSerials.notActivated')}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-xs">
                                        {serial.assignedAt ? (
                                            <div className="flex items-center gap-2 font-medium">
                                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                                {new Date(serial.assignedAt).toLocaleDateString(locale)}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {serials.length === 0 && (
                    <div className="p-12 text-center border-t">
                        <Hash className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">{t('adminSerials.noSerials')}</p>
                    </div>
                )}
            </Card>
        </div>
    )
}
