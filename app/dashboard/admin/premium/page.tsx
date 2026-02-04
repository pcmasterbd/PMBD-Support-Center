import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Key,
    Clock,
    CheckCircle2,
    XCircle,
    User,
    ExternalLink,
    Filter,
    Search,
    AlertCircle,
    Info,
    MoreVertical,
    Send,
    Plus
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PremiumRequestActions } from "@/components/admin/premium-request-actions";
import { PremiumRequestSearch } from "@/components/admin/premium-request-search";

export default async function AdminPremiumPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;

    const requests = await prisma.accountRequest.findMany({
        where: searchQuery ? {
            OR: [
                { resourceName: { contains: searchQuery, mode: 'insensitive' } },
                { user: { name: { contains: searchQuery, mode: 'insensitive' } } },
                { user: { email: { contains: searchQuery, mode: 'insensitive' } } }
            ]
        } : {},
        include: {
            user: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
    });

    const pendingCount = await prisma.accountRequest.count({ where: { status: 'PENDING' } });

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">প্রিমিয়াম রিসোর্স ম্যানেজমেন্ট</h2>
                    <p className="text-muted-foreground">ইউজারদের প্রিমিয়াম অ্যাকাউন্ট রিকোয়েস্ট এবং লাইসেন্স কি ম্যানেজ করুন</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Key className="w-4 h-4" />
                        Manage Inventory
                    </Button>
                    <Button className="gap-2" disabled>
                        <Plus className="w-4 h-4" />
                        Add Resource
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card className="p-4 border-2 border-orange-100 bg-orange-50/10">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-orange-500" />
                        <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase">Pending Requests</p>
                            <p className="text-2xl font-extrabold text-orange-600">{pendingCount}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" />
                        Account & Key Requests
                    </h3>
                    <div className="flex items-center gap-2">
                        <PremiumRequestSearch />
                        <Button variant="outline" size="icon">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {requests.map((request: any) => (
                        <Card key={request.id} className="p-5 hover:bg-muted/10 transition-all border-2">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${request.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                            request.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                            {request.status}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-bold uppercase">Requested on {new Date(request.createdAt).toLocaleDateString('bn-BD')}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-muted rounded-xl">
                                            <Key className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg leading-tight uppercase tracking-tight">{request.resourceName}</h4>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <User className="w-3.5 h-3.5" />
                                                <span className="font-medium">{request.user.name}</span>
                                                <span className="text-xs">({request.user.email})</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {request.status === 'PENDING' ? (
                                        <PremiumRequestActions requestId={request.id} />
                                    ) : (
                                        <Button variant="ghost" className="gap-2">
                                            <Send className="w-4 h-4" />
                                            Resend Credentials
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
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
