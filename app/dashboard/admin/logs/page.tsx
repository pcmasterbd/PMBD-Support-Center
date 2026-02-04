import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Activity,
    Search,
    Filter,
    Download,
    Trash2,
    User,
    Clock,
    Globe,
    AlertCircle,
    Shield
} from "lucide-react";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";

export default async function AdminAuditLogsPage() {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    const logs: any = await prisma.userActivity.findMany({
        include: {
            user: { select: { name: true, email: true, role: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 100
    });

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">সিস্টেম অডিট লগ</h2>
                    <p className="text-muted-foreground">সিস্টেমের সকল ক্রিয়াকলাপ এবং ইউজারের কার্যক্রম ট্র্যাক করুন</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export Logs
                    </Button>
                    {session.user.role === 'SUPERADMIN' && (
                        <Button variant="destructive" className="gap-2">
                            <Trash2 className="w-4 h-4" />
                            Clear Old Logs
                        </Button>
                    )}
                </div>
            </div>

            <Card className="p-4 border-2 border-primary/10 bg-primary/5 mb-8">
                <div className="flex items-start gap-4">
                    <Shield className="w-6 h-6 text-primary mt-1" />
                    <div>
                        <h4 className="font-bold text-sm">Security Monitoring Active</h4>
                        <p className="text-xs text-muted-foreground">বর্তমানে সকল আইপি অ্যাড্রেস এবং লগইন সেশন রেকর্ড করা হচ্ছে। কোনো প্রকার সন্দেহজনক কার্যকলাপ শনাক্ত হলে সিস্টেম অটোমেটিক অ্যালার্ট পাঠাবে।</p>
                    </div>
                </div>
            </Card>

            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="ইউজার বা অ্যাকশন দিয়ে সার্চ করুন..." className="pl-9" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2 h-9 text-xs font-bold uppercase">
                            <Filter className="w-3.5 h-3.5" />
                            Filter Activity
                        </Button>
                    </div>
                </div>

                <Card className="overflow-hidden border-2 shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-4 py-3 font-bold">User</th>
                                <th className="px-4 py-3 font-bold">Action</th>
                                <th className="px-4 py-3 font-bold">Details</th>
                                <th className="px-4 py-3 font-bold">IP Address</th>
                                <th className="px-4 py-3 font-bold">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-xs">
                            {logs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold flex items-center gap-1">
                                                <User className="w-3 h-3 text-primary" />
                                                {log.user.name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">{log.user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${log.action === 'LOGIN' ? 'bg-green-100 text-green-700' :
                                                log.action === 'DOWNLOAD' ? 'bg-blue-100 text-blue-700' :
                                                    log.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 max-w-xs truncate font-medium">
                                        {log.details || 'N/A'}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Globe className="w-3 h-3" />
                                            {log.ipAddress || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <Clock className="w-3 h-3 text-muted-foreground" />
                                            {new Date(log.createdAt).toLocaleString('bn-BD')}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    );
}
