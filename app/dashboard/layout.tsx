import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { signOut } from '@/auth'
import { LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

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

            <div className="flex-1">
                <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                    <div className="flex h-16 items-center justify-between px-6">
                        <div>
                            <h1 className="text-xl font-semibold">স্বাগতম, {session.user.name}</h1>
                            <p className="text-sm text-muted-foreground">{session.user.email}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <form
                                action={async () => {
                                    'use server'
                                    await signOut({ redirectTo: '/' })
                                }}
                            >
                                <Button variant="outline" size="sm" type="submit">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    লগআউট
                                </Button>
                            </form>
                        </div>
                    </div>
                </header>

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
