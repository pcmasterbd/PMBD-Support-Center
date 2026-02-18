'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
    Home,
    Video,
    Download,
    Key,
    CreditCard,
    HelpCircle,
    Settings,
    Shield,
    Users,
    FileText,
    X,
    ChevronRight,
} from 'lucide-react'

const menuItems = [
    {
        title: 'ড্যাশবোর্ড',
        href: '/dashboard',
        icon: Home,
    },
    {
        title: 'অ্যাক্টিভিটি লগ',
        href: '/dashboard/activity',
        icon: FileText,
    },
    {
        title: 'ভিডিও টিউটোরিয়াল',
        href: '/dashboard/tutorials',
        icon: Video,
    },
    {
        title: 'সফটওয়্যার',
        href: '/dashboard/software',
        icon: Download,
    },
    {
        title: 'প্রিমিয়াম একাউন্ট',
        href: '/dashboard/premium/accounts',
        icon: CreditCard,
    },
    {
        title: 'লাইসেন্স কী',
        href: '/dashboard/premium/licenses',
        icon: Key,
    },
    {
        title: 'সাপোর্ট',
        href: '/dashboard/support',
        icon: HelpCircle,
    },
    {
        title: 'প্রোফাইল',
        href: '/dashboard/profile',
        icon: Settings,
    },
]

const adminMenuItems = [
    {
        title: 'অ্যাডমিন ড্যাশবোর্ড',
        href: '/dashboard/admin',
        icon: Shield,
    },
    {
        title: 'সাপোর্ট ম্যানেজমেন্ট',
        href: '/dashboard/admin/support',
        icon: HelpCircle,
    },
    {
        title: 'ইউজার ম্যানেজমেন্ট',
        href: '/dashboard/admin/users',
        icon: Users,
    },
    {
        title: 'সিরিয়াল ম্যানেজমেন্ট',
        href: '/dashboard/admin/serials',
        icon: Key,
    },
    {
        title: 'সফটওয়্যার কন্টেন্ট',
        href: '/dashboard/admin/content/software',
        icon: Download,
    },
    {
        title: 'ভিডিও টিউটোরিয়াল',
        href: '/dashboard/admin/content/videos',
        icon: Video,
    },
    {
        title: 'প্রিমিয়াম রিকোয়েস্ট',
        href: '/dashboard/admin/premium',
        icon: CreditCard,
    },
    {
        title: 'সিস্টেম সেটিংস',
        href: '/dashboard/admin/settings',
        icon: Settings,
    },
    {
        title: 'কাস্টমার ম্যানেজমেন্ট',
        href: '/dashboard/admin/customers',
        icon: Users,
    },
    {
        title: 'অডিট লগ',
        href: '/dashboard/admin/logs',
        icon: FileText,
    },
]

interface DashboardSidebarProps {
    userRole?: string
    userName?: string | null
    userEmail?: string | null
    mobile?: boolean
    isOpen?: boolean
    onClose?: () => void
}

export function DashboardSidebar({ userRole, userName, userEmail, mobile, isOpen, onClose }: DashboardSidebarProps) {
    const pathname = usePathname()
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN'

    const sideBarItems = [...menuItems]
    const adminItems = [...adminMenuItems]

    const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U'

    // Shared menu item renderer
    const renderMenuItem = (item: typeof menuItems[0], extraClasses?: string) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
            <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                    'flex items-center gap-2.5 sm-std:gap-3 px-3 sm-std:px-4 py-2.5 sm-std:py-3 rounded-xl transition-all duration-300 group',
                    isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-1 ring-white/10 translate-x-1'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700/50 hover:shadow-sm hover:translate-x-1',
                    extraClasses
                )}
            >
                <div className={cn(
                    "p-1 sm-std:p-1.5 rounded-lg transition-colors flex-shrink-0",
                    isActive ? "bg-white/20" : "bg-slate-100 dark:bg-slate-700 group-hover:bg-white dark:group-hover:bg-slate-600"
                )}>
                    <Icon className={cn("w-3.5 h-3.5 sm-std:w-4 sm-std:h-4", isActive ? "text-white" : "text-slate-500 dark:text-slate-400")} />
                </div>
                <span className={cn(
                    "text-xs sm-std:text-sm font-bold tracking-tight flex-1 min-w-0",
                    isActive ? "text-white" : "text-slate-700 dark:text-slate-200"
                )}>
                    {item.title}
                </span>
                {isActive && (
                    <ChevronRight className="w-3 h-3 sm-std:w-3.5 sm-std:h-3.5 text-white/70 flex-shrink-0" />
                )}
            </Link>
        )
    }

    const content = (
        <div className={cn("flex flex-col", !mobile && "h-full overflow-hidden")}>
            {/* Logo - Only shown on desktop sidebar */}
            <div className={cn("px-3 mb-4 sm-std:mb-6", mobile ? "hidden" : "block")}>
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-sm">PM</div>
                    <div>
                        <h2 className="text-lg font-bold leading-tight">PC MASTER BD</h2>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">Support Center</p>
                    </div>
                </Link>
            </div>

            <nav className={cn("space-y-4 sm-std:space-y-6 pr-1 customize-scrollbar py-1 sm-std:py-2", !mobile && "flex-1 overflow-y-auto")}>
                {/* Admin Menu Section */}
                {isAdmin && (
                    <div className={cn(
                        "space-y-0.5 sm-std:space-y-1",
                        mobile && "bg-slate-50/80 dark:bg-slate-800/60 rounded-xl sm-std:rounded-2xl mx-1.5 sm-std:mx-2 py-3 sm-std:py-4 border border-slate-100 dark:border-slate-700/50 shadow-sm"
                    )}>
                        <p className="px-3 sm-std:px-4 text-[9px] sm-std:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] sm-std:tracking-[0.2em] mb-2 sm-std:mb-3">
                            অ্যাডমিন ম্যানেজমেন্ট
                        </p>
                        <div className="space-y-0.5 sm-std:space-y-1 px-1.5 sm-std:px-2">
                            {adminItems.map((item) => renderMenuItem(item))}
                        </div>
                    </div>
                )}

                {/* User Menu Section */}
                <div className={cn(
                    "space-y-0.5 sm-std:space-y-1",
                    mobile && "mx-1.5 sm-std:mx-2"
                )}>
                    <p className="px-3 sm-std:px-4 text-[9px] sm-std:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] sm-std:tracking-[0.2em] mb-2 sm-std:mb-3">
                        ইউজার প্যানেল
                    </p>
                    <div className="space-y-0.5 sm-std:space-y-1 px-1.5 sm-std:px-2">
                        {sideBarItems.map((item) => {
                            if (isAdmin && item.href === '/dashboard' && pathname.startsWith('/dashboard/admin')) return null
                            return renderMenuItem(item)
                        })}
                    </div>
                </div>
            </nav>

            {/* User Profile Section at Bottom - only in desktop */}
            {!mobile && (
                <div className="mt-auto border-t dark:border-slate-700 p-4 px-3">
                    <Link href="/dashboard/profile" className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                {userInitial}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{userName || 'User'}</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[120px]">{userEmail}</span>
                            </div>
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                            <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </div>
                    </Link>
                </div>
            )}
        </div>
    )

    if (mobile) {
        return (
            <>
                {/* Backdrop overlay */}
                <div
                    className={cn(
                        "fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm md:hidden transition-all duration-300",
                        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                    onClick={onClose}
                />

                {/* Sidebar panel - responsive width */}
                <aside
                    className={cn(
                        "fixed left-0 top-0 z-[101] h-full w-[85vw] max-w-[300px] bg-white dark:bg-slate-900 border-r dark:border-slate-700 p-0 shadow-2xl md:hidden transition-all duration-300 transform ease-in-out",
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="flex flex-col h-full">
                        {/* Mobile Header Branding */}
                        <div className="p-4 sm-std:p-5 border-b dark:border-slate-700 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md">
                            <Link href="/" onClick={onClose} className="flex items-center gap-2.5 sm-std:gap-3">
                                <div className="w-9 h-9 sm-std:w-10 sm-std:h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm sm-std:text-base shadow-lg shadow-primary/20">PM</div>
                                <div className="flex flex-col min-w-0">
                                    <h2 className="text-sm sm-std:text-base font-black leading-tight tracking-tight truncate">PC MASTER <span className="text-primary italic">BD</span></h2>
                                    <p className="text-[8px] sm-std:text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">Support Center</p>
                                </div>
                            </Link>
                            <button
                                onClick={onClose}
                                className="p-1.5 sm-std:p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors flex-shrink-0"
                            >
                                <X className="w-4 h-4 sm-std:w-5 sm-std:h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Scrollable menu content */}
                        <div className="flex-1 overflow-y-auto px-0.5 sm-std:px-1 py-3 sm-std:py-4 customize-scrollbar">
                            {content}
                        </div>

                        {/* Mobile Profile Section at Bottom */}
                        <div className="border-t dark:border-slate-700 p-3 sm-std:p-4 bg-slate-50/50 dark:bg-slate-800/50">
                            <Link href="/dashboard/profile" onClick={onClose} className="flex items-center gap-2.5 sm-std:gap-3 px-1 sm-std:px-2">
                                <div className="w-9 h-9 sm-std:w-10 sm-std:h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-base sm-std:text-lg shadow-md flex-shrink-0">
                                    {userInitial}
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-xs sm-std:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{userName || 'User'}</span>
                                    <span className="text-[9px] sm-std:text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">{userEmail}</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                            </Link>
                        </div>
                    </div>
                </aside>
            </>
        )
    }

    return (
        <aside className="w-72 border-r dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen p-6 hidden md:block sticky top-0 h-screen overflow-y-auto">
            {content}
        </aside>
    )
}
