'use client'

import { useLanguage } from '@/lib/language-context'
import { UserSearch } from '@/components/admin/user-search'
import { UserStatusToggle } from '@/components/admin/user-status-toggle'
import { UserAddButton } from '@/components/admin/user-add-button'
import { UserActionButtons } from '@/components/admin/user-action-buttons'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Calendar,
    Shield,
    ShieldAlert,
    Mail,
    TrendingUp,
    Users
} from 'lucide-react'

interface UserData {
    id: string
    name?: string | null
    email?: string | null
    phone?: string | null
    role: string
    isActive: boolean
    createdAt: string
    serialNumber?: { code: string } | null
    _count: { tickets: number; downloads: number }
}

export function AdminUsersClient({ users, totalUsers }: { users: UserData[]; totalUsers: number }) {
    const { t, language } = useLanguage()
    const locale = language === 'bn' ? 'bn-BD' : 'en-US'

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('adminUsers.title')}</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">{t('adminUsers.subtitle')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 h-9 text-xs sm:text-sm rounded-xl">
                        <TrendingUp className="w-4 h-4" />
                        {t('adminUsers.growthStats')}
                    </Button>
                    <UserAddButton />
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card className="p-4 sm:p-6 bg-primary/5 border-primary/20 rounded-2xl border-2">
                    <h4 className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('adminUsers.totalRegistered')}</h4>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl sm:text-3xl font-extrabold">{totalUsers}</p>
                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary/40" />
                    </div>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <UserSearch />
                </div>

                <div className="md:hidden space-y-4">
                    {users.map((user) => (
                        <Card key={user.id} className="p-4 border-2 rounded-2xl hover:border-primary/20 transition-all transition-colors duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-sm uppercase">
                                        {user.name?.slice(0, 2)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-base">{user.name}</span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                                <UserActionButtons user={user} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-muted/50">
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">{t('adminUsers.role')}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${user.role === 'SUPERADMIN' ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-200' :
                                        user.role === 'ADMIN' ? 'bg-blue-500/10 text-blue-600 border border-blue-200' :
                                            'bg-muted text-muted-foreground border border-muted'
                                        }`}>
                                        {user.role === 'SUPERADMIN' ? <ShieldAlert className="w-2.5 h-2.5" /> : <Shield className="w-2.5 h-2.5" />}
                                        {user.role}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">{t('adminUsers.status')}</span>
                                    <UserStatusToggle userId={user.id} initialStatus={user.isActive} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">{t('adminUsers.serial')}</span>
                                    {user.serialNumber ? (
                                        <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded border leading-none block w-fit">
                                            {user.serialNumber.code}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground italic">{t('adminUsers.noSerial')}</span>
                                    )}
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">{t('adminUsers.joined')}</span>
                                    <div className="flex items-center gap-1.5 text-xs font-medium">
                                        <Calendar className="w-3 h-3 text-muted-foreground" />
                                        {new Date(user.createdAt).toLocaleDateString(locale)}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {users.length === 0 && (
                        <Card className="p-8 text-center border-2 border-dashed rounded-2xl">
                            <Users className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">{t('adminUsers.noUsers')}</p>
                        </Card>
                    )}
                </div>

                <Card className="hidden md:block overflow-hidden border-2 rounded-2xl">
                    <div className="overflow-x-auto customize-scrollbar">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-4 py-3 font-bold">{t('adminUsers.user')}</th>
                                    <th className="px-4 py-3 font-bold">{t('adminUsers.role')}</th>
                                    <th className="px-4 py-3 font-bold">{t('adminUsers.serial')}</th>
                                    <th className="px-4 py-3 font-bold">{t('adminUsers.activity')}</th>
                                    <th className="px-4 py-3 font-bold">{t('adminUsers.joined')}</th>
                                    <th className="px-4 py-3 font-bold">{t('adminUsers.status')}</th>
                                    <th className="px-4 py-3 font-bold text-right pr-6">{t('adminUsers.action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-bold text-xs uppercase">
                                                    {user.name?.slice(0, 2)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{user.name}</span>
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <Mail className="w-2.5 h-2.5" />
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${user.role === 'SUPERADMIN' ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-200' :
                                                user.role === 'ADMIN' ? 'bg-blue-500/10 text-blue-600 border border-blue-200' :
                                                    'bg-muted text-muted-foreground border border-muted'
                                                }`}>
                                                {user.role === 'SUPERADMIN' ? <ShieldAlert className="w-2.5 h-2.5" /> : <Shield className="w-2.5 h-2.5" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1">
                                                {user.serialNumber ? (
                                                    <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded border leading-none">
                                                        {user.serialNumber.code}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-muted-foreground italic">{t('adminUsers.noSerial')}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                                                <span>{user._count.tickets} {t('adminUsers.tickets')}</span>
                                                <span>{user._count.downloads} {t('adminUsers.downloads')}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-xs">
                                            <div className="flex items-center gap-2 font-medium">
                                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                                {new Date(user.createdAt).toLocaleDateString(locale)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <UserStatusToggle userId={user.id} initialStatus={user.isActive} />
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <UserActionButtons user={user} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}
