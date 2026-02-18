import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
    Globe,
    Mail,
    MessageSquare,
    ShieldCheck,
    Bell,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
    const session = await auth();

    // Only SUPERADMIN can access system settings
    if (!session?.user?.id || session.user.role !== 'SUPERADMIN') {
        redirect('/dashboard');
    }

    // Fetch all system settings
    const rawSettings = await prisma.systemSetting.findMany();

    // Convert to Record<string, string>
    const initialSettings = rawSettings.reduce((acc: any, setting) => {
        acc[setting.key] = setting.value;
        return acc;
    }, {});

    return (
        <div className="space-y-8 pb-10 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">সিস্টেম সেটিংস</h2>
                    <p className="text-muted-foreground">সিস্টেমের গ্লোবাল কনফিগারেশন এবং সিকিউরিটি ম্যানেজ করুন</p>
                </div>
            </div>

            <div className="grid md-tab:grid-cols-4 gap-4 sm-std:gap-6 md:gap-8">
                {/* Navigation Sidebar */}
                <div className="md-tab:col-span-1 flex md-tab:flex-col gap-2 overflow-x-auto pb-2 md-tab:pb-0 customize-scrollbar">
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

                <SettingsForm initialSettings={initialSettings} />
            </div>
        </div>
    );
}
