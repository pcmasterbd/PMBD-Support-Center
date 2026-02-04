import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Bell,
    Mail,
    MessageSquare,
    Save,
    ChevronLeft,
    Code,
    Info,
    Layout
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function NotificationTemplatesPage() {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== 'SUPERADMIN') {
        redirect('/dashboard');
    }

    const templates = [
        { id: "email_welcome", name: "Welcome Email", type: "EMAIL", subject: "Welcome to PC MASTER BD Support" },
        { id: "sms_otp", name: "Phone Verification (OTP)", type: "SMS", body: "Your PC MASTER BD verification code is: {{otp}}" },
        { id: "email_ticket_update", name: "Ticket Reply Notification", type: "EMAIL", subject: "New Reply on Ticket #{{ticket_id}}" },
    ];

    return (
        <div className="space-y-8 pb-10 max-w-5xl">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/settings">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">নোটিফিকেশন টেমপ্লেট</h2>
                    <p className="text-muted-foreground">সিস্টেম থেকে পাঠানো অটোমেটিক মেসেজ এবং ইমেইলগুলো কাস্টমাইজ করুন</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <Card className="p-4 bg-muted/30 border-2">
                        <h4 className="font-bold flex items-center gap-2 mb-4">
                            <Code className="w-4 h-4" /> Available Variables
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs p-2 bg-background border rounded font-mono">
                                <span>{"{{name}}"}</span>
                                <span className="text-muted-foreground italic">ইউজারের নাম</span>
                            </div>
                            <div className="flex justify-between items-center text-xs p-2 bg-background border rounded font-mono">
                                <span>{"{{otp}}"}</span>
                                <span className="text-muted-foreground italic">সিকিউরিটি কোড</span>
                            </div>
                            <div className="flex justify-between items-center text-xs p-2 bg-background border rounded font-mono">
                                <span>{"{{ticket_id}}"}</span>
                                <span className="text-muted-foreground italic">টিকেট নম্বর</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-blue-100 bg-blue-50/10">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-blue-600 mt-1" />
                            <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                টেমপ্লেট পরিবর্তনের পর সেগুলো সেভ করতে ভুলবেন না। পরিবর্তনের সাথে সাথেই সকল অটোমেটিক নোটিফিকেশন আপডেট হয়ে যাবে।
                            </p>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {templates.map((template) => (
                        <Card key={template.id} className="p-6 space-y-4 border-2">
                            <div className="flex items-center justify-between border-b pb-3">
                                <div className="flex items-center gap-3">
                                    {template.type === 'EMAIL' ? <Mail className="w-5 h-5 text-primary" /> : <MessageSquare className="w-5 h-5 text-green-600" />}
                                    <h3 className="font-bold text-lg">{template.name}</h3>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] bg-muted font-bold uppercase">{template.type}</span>
                            </div>

                            <div className="space-y-4">
                                {template.type === 'EMAIL' && (
                                    <div className="space-y-2">
                                        <Label>Subject Line</Label>
                                        <Input defaultValue={template.subject} />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label>Message Body</Label>
                                    <Textarea
                                        className="min-h-[120px] font-medium"
                                        defaultValue={template.body || "Hi {{name}},\n\nআপনার PC MASTER BD একাউন্টে স্বাগতম। আপনার প্রোফাইলটি সফলভাবে তৈরি করা হয়েছে।\n\nধন্যবাদ,\nএডমিন টিম।"}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Layout className="w-3.5 h-3.5" />
                                        Preview
                                    </Button>
                                    <Button size="sm" className="gap-2">
                                        <Save className="w-3.5 h-3.5" />
                                        Save Template
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
