import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Activity, Clock, Download, Video, LogIn, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function ActivityPage() {
    const session = await auth();

    if (!session?.user?.id) return null;

    const activities = await prisma.userActivity.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    const getIcon = (action: string) => {
        switch (action) {
            case 'LOGIN': return <LogIn className="w-4 h-4 text-blue-500" />;
            case 'DOWNLOAD': return <Download className="w-4 h-4 text-green-500" />;
            case 'WATCH': return <Video className="w-4 h-4 text-purple-500" />;
            default: return <Activity className="w-4 h-4 text-primary" />;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">অ্যাক্টিভিটি লগ</h2>
                    <p className="text-muted-foreground">আপনার একাউন্টের সকল কার্যক্রমের ইতিহাস</p>
                </div>
                <div className="px-4 py-2 bg-muted rounded-full text-xs font-semibold">মোট ৫ট কার্যক্রম দেখাচ্ছে</div>
            </div>

            <Card className="overflow-hidden">
                <div className="divide-y">
                    {activities.length > 0 ? (
                        activities.map((activity) => (
                            <div key={activity.id} className="p-4 hover:bg-muted/30 transition-colors">
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="mt-1 p-2 bg-background border rounded-lg shadow-sm">
                                        {getIcon(activity.action)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <h4 className="font-bold text-sm">{activity.action}</h4>
                                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(activity.createdAt).toLocaleString('bn-BD', {
                                                    dateStyle: 'full',
                                                    timeStyle: 'short'
                                                })}
                                            </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{activity.details || "কোনো বিস্তারিত তথ্য নেই"}</p>
                                        <div className="mt-2 flex items-center gap-4">
                                            <p className="text-[10px] text-muted-foreground italic">IP: {activity.ipAddress || "Unknown"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 sm:p-20 text-center flex flex-col items-center justify-center">
                            <Activity className="w-12 h-12 text-muted/30 mb-4" />
                            <h3 className="text-lg font-medium">কোনো রেকর্ড পাওয়া যায়নি</h3>
                            <p className="text-sm text-muted-foreground">আপনি যখন সাইটটি ব্যবহার করবেন তখন আপনার সকল কার্যক্রম এখানে দেখা যাবে।</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
