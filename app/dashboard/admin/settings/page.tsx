import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Settings,
    Mail,
    MessageSquare,
    ShieldCheck,
    Save,
    Globe,
    Bell,
    Lock,
    RefreshCw
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default async function AdminSettingsPage() {
    const session = await auth();

    // Only SUPERADMIN can access system settings
    if (!session?.user?.id || session.user.role !== 'SUPERADMIN') {
        redirect('/dashboard');
    }

    // Fetch all system settings
    const settings: any = await (prisma as any).systemSetting.findMany();

    const getSetting = (key: string) => settings.find((s: any) => s.key === key)?.value || "";

    return (
        <div className="space-y-8 pb-10 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">সিস্টেম সেটিংস</h2>
                    <p className="text-muted-foreground">সিস্টেমের গ্লোবাল কনফিগারেশন এবং সিকিউরিটি ম্যানেজ করুন</p>
                </div>
                <Button className="gap-2">
                    <Save className="w-4 h-4" />
                    Save All Changes
                </Button>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    <Button variant="secondary" className="w-full justify-start gap-3">
                        <Globe className="w-4 h-4" /> General
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <Mail className="w-4 h-4" /> Email (SMTP)
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <MessageSquare className="w-4 h-4" /> SMS Gateway
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <ShieldCheck className="w-4 h-4" /> Security
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3" asChild>
                        <Link href="/dashboard/admin/settings/notifications">
                            <Bell className="w-4 h-4" /> Notifications
                        </Link>
                    </Button>
                </div>

                {/* Settings Form */}
                <div className="lg:col-span-3 space-y-6">
                    {/* General Settings */}
                    <Card className="p-6 space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <Globe className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-lg">General Information</h3>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>Site Name</Label>
                                <Input defaultValue={getSetting("site_name") || "PC MASTER BD Support Center"} />
                            </div>
                            <div className="space-y-2">
                                <Label>Support Email</Label>
                                <Input defaultValue={getSetting("support_email") || "support@pcmbdbd.com"} />
                            </div>
                            <div className="space-y-2">
                                <Label>Contact Phone</Label>
                                <Input defaultValue={getSetting("contact_phone") || "+880 1XXX-XXXXXX"} />
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <div className="space-y-0.5">
                                    <Label>Maintenance Mode</Label>
                                    <p className="text-[10px] text-muted-foreground">ইউজারদের জন্য সাইটটি সাময়িকভাবে বন্ধ রাখুন</p>
                                </div>
                                <Switch />
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
                                <Label>Resend API Key</Label>
                                <Input type="password" value="••••••••••••••••" readOnly />
                                <p className="text-[10px] text-muted-foreground">সুরক্ষার জন্য API কী এনক্রিপ্টেড থাকে</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Sender Name</Label>
                                <Input defaultValue={getSetting("smtp_from_name") || "PC MASTER BD"} />
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
                                <Switch />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Login Attempt Limit</Label>
                                    <p className="text-[10px] text-muted-foreground">ভুল পাসওয়ার্ড দিলে ৫ মিনিটের জন্য একাউন্ট লক হবে</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
