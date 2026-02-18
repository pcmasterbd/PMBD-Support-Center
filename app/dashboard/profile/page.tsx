import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Shield, User, Mail, Phone, Calendar, Lock } from "lucide-react";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { serialNumber: true }
    });

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">আপনার প্রোফাইল</h2>
                <p className="text-muted-foreground">আপনার একাউন্ট তথ্য এবং নিরাপত্তা সেটিংস</p>
            </div>

            <div className="grid md-tab:grid-cols-2 gap-4 sm-std:gap-6">
                {/* Basic Info */}
                <Card className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg">সাধারণ তথ্য</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>পূর্ণ নাম</Label>
                            <Input value={user?.name || ""} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label>ইমেইল ঠিকানা</Label>
                            <div className="flex items-center gap-2">
                                <Input value={user?.email || ""} disabled />
                                {user?.emailVerified && <Shield className="w-4 h-4 text-green-500" />}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>মোবাইল নম্বর</Label>
                            <Input value={user?.phone || ""} disabled />
                        </div>
                    </div>
                </Card>

                {/* Product Info */}
                <Card className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 className="font-bold text-lg">পণ্য তথ্য</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>সিরিয়াল নম্বর</Label>
                            <Input value={user?.serialNumber?.code || ""} disabled className="font-mono bg-muted/50" />
                        </div>
                        <div className="space-y-2">
                            <Label>অ্যাক্টিভেশন তারিখ</Label>
                            <Input value={user?.serialNumber?.assignedAt ? new Date(user.serialNumber.assignedAt).toLocaleDateString('bn-BD') : "অজানা"} disabled />
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-100 dark:border-green-900/50">
                            <p className="text-xs text-green-700 dark:text-green-400 font-medium">আপনার লাইসেন্স স্ট্যাটাস: একটিভ</p>
                        </div>
                    </div>
                </Card>

                {/* Security Settings */}
                <Card className="p-4 sm-std:p-6 md-tab:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <Lock className="w-5 h-5 text-red-500" />
                        </div>
                        <h3 className="font-bold text-lg">নিরাপত্তা এবং পাসওয়ার্ড</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">পাসওয়ার্ড পরিবর্তন করতে কিংবা টু-ফ্যাক্টর অথেন্টিকেশন (2FA) চালু করতে নিচের বাটনগুলো ব্যবহার করুন।</p>
                            <div className="flex flex-wrap gap-2">
                                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">পাসওয়ার্ড রিসেট করুন</button>
                                <button className="px-4 py-2 border border-input bg-background rounded-md text-sm font-medium hover:bg-accent">২-ফ্যাক্টর নিরাপত্তা</button>
                            </div>
                        </div>

                        <div className="space-y-4 border-t md-tab:border-t-0 md-tab:border-l pt-6 md-tab:pt-0 md-tab:pl-8">
                            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">ইমেইল ভেরিফিকেশন</p>
                                        <p className="text-xs text-muted-foreground">{user?.emailVerified ? "ভেরিফাইড" : "পেন্ডিং"}</p>
                                    </div>
                                </div>
                                {user?.emailVerified ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                    <button className="text-xs text-primary font-bold">ভেরিফাই করুন</button>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function CheckCircle2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
        </svg>
    );
}
