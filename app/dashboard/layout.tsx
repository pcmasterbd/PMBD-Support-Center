import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { signOut } from '@/auth'
import { LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { DashboardHeader } from '@/components/dashboard-header'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user) {
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar userRole={session.user.role} />

            <div className="flex-1 min-w-0">
                <DashboardHeader
                    userName={session.user.name}
                    userEmail={session.user.email}
                    userRole={session.user.role}
                    signOutAction={async () => {
                        'use server'
                        await signOut({ redirectTo: '/' })
                    }}
                />

                <main className="p-3 sm-std:p-4 md-tab:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
