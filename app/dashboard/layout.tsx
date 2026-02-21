import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { signOut } from '@/auth'
import { LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { DashboardHeader } from '@/components/dashboard-header'
import { AnnouncementBanner } from '@/components/announcement-banner'

import { prisma } from '@/lib/prisma'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user) {
        redirect('/login')
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { avatarUrl: true, name: true, email: true, role: true }
    })

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar userRole={session.user.role} />

            <div className="flex-1 min-w-0 flex flex-col">
                <DashboardHeader
                    userName={dbUser?.name || session.user.name}
                    userEmail={dbUser?.email || session.user.email}
                    userImage={dbUser?.avatarUrl}
                    userRole={dbUser?.role || session.user.role}
                    signOutAction={async () => {
                        'use server'
                        await signOut({ redirectTo: '/' })
                    }}
                />

                <AnnouncementBanner />

                <main className="flex-1 p-3 sm-std:p-4 md-tab:p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
