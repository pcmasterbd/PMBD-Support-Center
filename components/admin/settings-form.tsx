'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { Save, Globe, Mail, Lock, RefreshCw, Loader2 } from 'lucide-react'
import { updateSystemSettings } from '@/lib/actions/settings-actions'

export function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
    const [isPending, startTransition] = useTransition()
    const [settings, setSettings] = useState(initialSettings)

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = () => {
        startTransition(async () => {
            try {
                await updateSystemSettings(settings)
                alert('Settings saved successfully!')
            } catch (err) {
                alert('Failed to save settings')
            }
        })
    }

    const getSetting = (key: string) => settings[key] || ""

    return (
        <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-end mb-4">
                <Button onClick={handleSave} disabled={isPending} className="gap-2">
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save All Changes
                </Button>
            </div>

            {/* General Settings */}
            <Card className="p-6 space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Globe className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">General Information</h3>
                </div>

                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label>Site Name</Label>
                        <Input
                            value={getSetting("site_name")}
                            onChange={(e) => handleChange("site_name", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Support Email</Label>
                        <Input
                            value={getSetting("support_email")}
                            onChange={(e) => handleChange("support_email", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Contact Phone</Label>
                        <Input
                            value={getSetting("contact_phone")}
                            onChange={(e) => handleChange("contact_phone", e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="space-y-0.5">
                            <Label>Maintenance Mode</Label>
                            <p className="text-[10px] text-muted-foreground">ইউজারদের জন্য সাইটটি সাময়িকভাবে বন্ধ রাখুন</p>
                        </div>
                        <Switch
                            checked={getSetting("maintenance_mode") === "true"}
                            onCheckedChange={(checked) => handleChange("maintenance_mode", checked.toString())}
                        />
                    </div>
                </div>
            </Card>

            {/* Email Settings */}
            <Card className="p-6 space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Mail className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Email Configuration (SMTP)</h3>
                </div>

                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label>Sender Name</Label>
                        <Input
                            value={getSetting("smtp_from_name")}
                            onChange={(e) => handleChange("smtp_from_name", e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" className="w-fit gap-2">
                        <RefreshCw className="w-3 h-3" />
                        Test Connection
                    </Button>
                </div>
            </Card>

            {/* Security Settings */}
            <Card className="p-6 border-red-100 bg-red-50/10 space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-red-100">
                    <Lock className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-lg text-red-600">Advanced Security</h3>
                </div>

                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Force 2FA for Admins</Label>
                            <p className="text-[10px] text-muted-foreground">সকল এডমিন ইউজারদের জন্য 2FA বাধ্যতামূলক করুন</p>
                        </div>
                        <Switch
                            checked={getSetting("force_2fa") === "true"}
                            onCheckedChange={(checked) => handleChange("force_2fa", checked.toString())}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Login Attempt Limit</Label>
                            <p className="text-[10px] text-muted-foreground">ভুল পাসওয়ার্ড দিলে ৫ মিনিটের জন্য একাউন্ট লক হবে</p>
                        </div>
                        <Switch
                            checked={getSetting("login_limit") === "true"}
                            onCheckedChange={(checked) => handleChange("login_limit", checked.toString())}
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}
