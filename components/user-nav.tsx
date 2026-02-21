'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    User,
    Settings,
    Mail,
    HelpCircle,
    LogOut,
    Edit2,
    ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'

interface UserNavProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
        role?: string | null
    }
    signOutAction: () => Promise<void>
}

export function UserNav({ user, signOutAction }: UserNavProps) {
    const { t } = useLanguage()
    const initials = user.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-primary/10 p-0 hover:bg-primary/5 transition-all">
                    <Avatar className="h-9 w-9 border border-white dark:border-slate-800">
                        <AvatarImage src={user.image || ''} alt={user.name || ''} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-2xl border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200" align="end" sideOffset={10} forceMount>
                <div className="absolute -top-1 right-4 w-3 h-3 rotate-45 bg-white dark:bg-slate-900 border-t border-l border-slate-200/60 dark:border-slate-800/60" />

                <div className="flex flex-col space-y-1 p-4 mb-2 text-center relative z-10">
                    <p className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight">
                        {user.name || 'Someone Famous'}
                    </p>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-tight">
                        {user.role === 'SUPERADMIN' ? 'Super Admin' : user.role === 'ADMIN' ? 'Administrator' : 'Website Designer'}
                    </p>
                </div>

                <DropdownMenuSeparator className="mx-2 my-1 opacity-50" />

                <DropdownMenuGroup className="space-y-0.5 relative z-10 p-1">
                    <Link href="/dashboard/profile">
                        <DropdownMenuItem className="flex items-center gap-4 px-3 py-2.5 rounded-xl cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                            <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                                <User className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{t('header.myProfile')}</span>
                        </DropdownMenuItem>
                    </Link>

                    <Link href="/dashboard/profile?edit=true">
                        <DropdownMenuItem className="flex items-center gap-4 px-3 py-2.5 rounded-xl cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                            <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                                <Edit2 className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{t('header.editProfile')}</span>
                        </DropdownMenuItem>
                    </Link>

                    <DropdownMenuItem className="flex items-center gap-4 px-3 py-2.5 rounded-xl cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                        <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                            <Mail className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{t('header.inbox')}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center gap-4 px-3 py-2.5 rounded-xl cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                        <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                            <Settings className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{t('header.settings')}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center gap-4 px-3 py-2.5 rounded-xl cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                        <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                            <HelpCircle className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{t('header.help')}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="mx-2 my-1 opacity-50" />
                <form action={signOutAction} className="w-full">
                    <button type="submit" className="w-full">
                        <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 transition-colors">
                            <div className="p-1.5 rounded-md bg-red-50 dark:bg-red-950/20">
                                <LogOut className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-sm font-black">{t('header.logout')}</span>
                        </DropdownMenuItem>
                    </button>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
