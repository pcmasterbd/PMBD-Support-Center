'use client'

import { useState } from 'react'
import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface DashboardHeaderProps {
    userName: string | null | undefined
    userEmail: string | null | undefined
    userRole?: string
    signOutAction: () => Promise<void>
}

import { DashboardSidebar } from './dashboard-sidebar'

export function DashboardHeader({ userName, userEmail, userRole, signOutAction }: DashboardHeaderProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN'

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
                        <div>
                            <h1 className="text-sm sm-std:text-base md:text-xl font-semibold line-clamp-1 truncate max-w-[120px] xs:max-w-[150px] sm-std:max-w-[200px] md:max-w-none">
                                স্বাগতম, {userName}
                            </h1>
                            <p className="text-[10px] sm-std:text-xs text-muted-foreground hidden xs:block">{userEmail}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm-std:gap-4">
                        <ThemeToggle />
                        <form action={signOutAction}>
                            <Button variant="outline" size="sm" type="submit" className="hidden sm-std:flex">
                                <LogOut className="w-4 h-4 mr-2" />
                                লগআউট
                            </Button>
                            <Button variant="outline" size="icon" type="submit" className="sm-std:hidden">
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </form>
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
