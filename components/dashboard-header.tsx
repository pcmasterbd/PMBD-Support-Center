'use client'

import { useState } from 'react'
import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/language-context'

interface DashboardHeaderProps {
    userName: string | null | undefined
    userEmail: string | null | undefined
    userImage?: string | null
    userRole?: string
    signOutAction: () => Promise<void>
}

import { DashboardSidebar } from './dashboard-sidebar'
import { GlobalSearch } from './global-search'
import { UserNav } from './user-nav'

export function DashboardHeader({ userName, userEmail, userImage, userRole, signOutAction }: DashboardHeaderProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN'
    const { t } = useLanguage()

    return (
        <>
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
                <div className="flex h-16 items-center justify-between px-4 sm-std:px-6">
                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            className="md:hidden p-2.5 rounded-xl hover:bg-muted active:scale-95 transition-all duration-200 bg-slate-100/50 border border-slate-200 shadow-sm"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5 text-slate-700" />
                        </button>
                        <div className="hidden md:flex flex-col">
                            <h1 className="text-sm sm-std:text-base md:text-lg font-black text-slate-800 dark:text-slate-200 line-clamp-1 leading-none">
                                PC MASTER <span className="text-primary italic">BD</span>
                            </h1>
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mt-1">{t('sidebar.supportCenter')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm-std:gap-3">
                        <div className="hidden md:block mr-2">
                            <GlobalSearch />
                        </div>
                        <LanguageToggle />
                        <ThemeToggle />
                        <UserNav
                            user={{
                                name: userName,
                                email: userEmail,
                                image: userImage,
                                role: userRole
                            }}
                            signOutAction={signOutAction}
                        />
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar - MUST be outside <header> to avoid backdrop-blur stacking context */}
            <DashboardSidebar
                userRole={userRole}
                userName={userName}
                userEmail={userEmail}
                mobile
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
        </>
    )
}
