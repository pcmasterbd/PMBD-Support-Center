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
        title: 'প্রিমিয়াম রিকোয়েস্ট',
        href: '/dashboard/admin/premium',
        icon: CreditCard,
    },
    {
        title: 'সিস্টেম সেটিংস',
        href: '/dashboard/admin/settings',
        icon: Settings,
    },
    {
        title: 'অডিট লগ',
        href: '/dashboard/admin/logs',
        icon: FileText,
    },
]

interface DashboardSidebarProps {
    userRole?: string
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
    const pathname = usePathname()
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN'

    return (
        <aside className="w-64 border-r bg-muted/30 min-h-screen p-6 hidden md:block">
            <div className="mb-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">PM</div>
                    <div>
                        <h2 className="text-lg font-bold leading-tight">PC MASTER BD</h2>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">Support Center</p>
                    </div>
                </Link>
            </div>

            <nav className="space-y-1">
                {/* Admin Menu Section */}
                {isAdmin && (
                    <>
                        <div className="pb-2">
                            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider opacity-70">
                                অ্যাডমিন প্যানেল
                            </p>
                        </div>
                        {adminMenuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1',
                                        isActive
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.title}</span>
                                </Link>
                            )
                        })}
                        <div className="my-4 border-t border-muted" />
                    </>
                )}

                {/* User Menu Section */}
                {isAdmin && (
                    <div className="pb-2">
                        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider opacity-70">
                            ইউজার ভিউ
                        </p>
                    </div>
                )}

                {menuItems.map((item) => {
                    // Hide User Dashboard link for admins since they have Admin Dashboard
                    if (isAdmin && item.href === '/dashboard') return null

                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1',
                                isActive
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.title}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
