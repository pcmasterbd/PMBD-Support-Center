'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Settings,
    Bell,
    Shield,
    Clock,
    Save,
    AlertTriangle
} from "lucide-react"
import { updateSystemSettings } from "@/lib/actions/superadmin/settings-actions"
import { cn } from "@/lib/utils"

interface SettingsClientProps {
    initialSettings: Record<string, string>
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
    const [settings, setSettings] = useState(initialSettings)
    const [activeTab, setActiveTab] = useState("general")
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const handleToggle = (key: string, checked: boolean) => {
        setSettings(prev => ({ ...prev, [key]: String(checked) }))
    }

    const handleSave = async () => {
        startTransition(async () => {
            const result = await updateSystemSettings(settings)
            if (result.success) {
                toast.success(result.message)
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const tabs = [
        { id: "general", label: "General", icon: Settings },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "maintenance", label: "Maintenance", icon: AlertTriangle },
        { id: "security", label: "Security & Session", icon: Shield },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <Button onClick={handleSave} disabled={isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Tabs */}
                <aside className="w-full md:w-64 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                activeTab === tab.id
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Content Area */}
                <main className="flex-1 space-y-6">
                    {activeTab === "general" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>General Information</CardTitle>
                                <CardDescription>Basic details about the platform.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Site Name</Label>
                                    <Input
                                        value={settings.site_name || "PC MASTER BD Support Center"}
                                        onChange={e => handleChange('site_name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Support Email</Label>
                                    <Input
                                        type="email"
                                        value={settings.contact_email || "support@pcmasterbd.com"}
                                        onChange={e => handleChange('contact_email', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Contact Phone</Label>
                                    <Input
                                        value={settings.contact_phone || "+880 1XXX-XXXXXX"}
                                        onChange={e => handleChange('contact_phone', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "notifications" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Events</CardTitle>
                                <CardDescription>Choose which events trigger email notifications.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">New Ticket Created</Label>
                                        <p className="text-sm text-muted-foreground">Notify admins when a new ticket is submitted.</p>
                                    </div>
                                    <Switch
                                        checked={settings.notify_new_ticket === 'true'}
                                        onCheckedChange={c => handleToggle('notify_new_ticket', c)}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Premium Request</Label>
                                        <p className="text-sm text-muted-foreground">Notify admins on new premium account request.</p>
                                    </div>
                                    <Switch
                                        checked={settings.notify_premium_request === 'true'}
                                        onCheckedChange={c => handleToggle('notify_premium_request', c)}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">New User Registration</Label>
                                        <p className="text-sm text-muted-foreground">Notify admins when a new user registers.</p>
                                    </div>
                                    <Switch
                                        checked={settings.notify_new_user === 'true'}
                                        onCheckedChange={c => handleToggle('notify_new_user', c)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "maintenance" && (
                        <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
                            <CardHeader>
                                <CardTitle className="text-amber-700 dark:text-amber-500">Maintenance Mode</CardTitle>
                                <CardDescription>
                                    When enabled, only admins can access the site. Customers will see a maintenance page.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-lg border">
                                    <div className="space-y-0.5">
                                        <Label className="text-base font-bold">Enable Maintenance Mode</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Use this when performing critical updates.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.maintenance_mode === 'true'}
                                        onCheckedChange={c => handleToggle('maintenance_mode', c)}
                                        className="data-[state=checked]:bg-amber-600"
                                    />
                                </div>
                                {settings.maintenance_mode === 'true' && (
                                    <div className="space-y-2">
                                        <Label>Maintenance Message</Label>
                                        <Input
                                            value={settings.maintenance_message || "We are currently undergoing maintenance. Please check back later."}
                                            onChange={e => handleChange('maintenance_message', e.target.value)}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "security" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Security & Session</CardTitle>
                                <CardDescription>Manage session timeouts and security preferences.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Admin Session Timeout (minutes)</Label>
                                    <Input
                                        type="number"
                                        value={settings.session_timeout_admin || "60"}
                                        onChange={e => handleChange('session_timeout_admin', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>User Session Timeout (minutes)</Label>
                                    <Input
                                        type="number"
                                        value={settings.session_timeout_user || "1440"}
                                        onChange={e => handleChange('session_timeout_user', e.target.value)}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Force 2FA for Admins</Label>
                                        <p className="text-sm text-muted-foreground">Require Two-Factor Authentication for all admin accounts.</p>
                                    </div>
                                    <Switch
                                        checked={settings.security_force_2fa_admin === 'true'}
                                        onCheckedChange={c => handleToggle('security_force_2fa_admin', c)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div>
        </div>
    )
}
