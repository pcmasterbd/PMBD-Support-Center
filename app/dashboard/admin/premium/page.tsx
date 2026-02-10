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
    Plus,
    LayoutGrid,
    Database
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PremiumRequestActions } from "@/components/admin/premium-request-actions";
import { PremiumRequestSearch } from "@/components/admin/premium-request-search";
import { PremiumResourceAddButton } from "@/components/admin/premium-resource-add-button";
import { AssignLicenseDialog } from "@/components/admin/premium/assign-license-dialog";

export default async function AdminPremiumPage({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await searchParamsPromise;
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;

    const [requests, accounts, keys] = await Promise.all([
        prisma.accountRequest.findMany({
            where: searchQuery ? {
                OR: [
                    { resourceName: { contains: searchQuery } },
                    { user: { name: { contains: searchQuery } } },
                    { user: { email: { contains: searchQuery } } }
                ]
            } : {},
            include: {
                user: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.premiumAccount.findMany({
            orderBy: { serviceName: 'asc' }
        }),
        prisma.licenseKey.findMany({
            orderBy: { softwareName: 'asc' }
        })
    ]);

    const pendingCount = requests.filter(r => r.status === 'PENDING').length;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">প্রিমিয়াম রিসোর্স ম্যানেজমেন্ট</h2>
                    <p className="text-muted-foreground">ইউজারদের প্রিমিয়াম অ্যাকাউন্ট রিকোয়েস্ট এবং লাইসেন্স কি ম্যানেজ করুন</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 font-bold" asChild>
                        <Link href="#inventory">
                            <Database className="w-4 h-4" />
                            Manage Inventory
                        </Link>
                    </Button>
                    <PremiumResourceAddButton />
                </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card className="p-4 border-2 border-orange-200 bg-orange-50/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Pending Requests</p>
                            <p className="text-2xl font-black text-orange-600">{pendingCount}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-2 border-primary/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <LayoutGrid className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Accounts</p>
                            <p className="text-2xl font-black">{accounts.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-2 border-primary/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Key className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">License Keys</p>
                            <p className="text-2xl font-black">{keys.length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Requests Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="font-extrabold text-xl flex items-center gap-2">
                            <Send className="w-5 h-5 text-primary" />
                            Resource Requests
                        </h3>
                        <div className="flex items-center gap-2">
                            <PremiumRequestSearch />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {requests.length > 0 ? (
                            requests.map((request: any) => (
                                <Card key={request.id} className="p-5 hover:bg-muted/10 transition-all border-2 group">
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
                                                <div className="p-3 bg-muted rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <Key className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg leading-tight uppercase tracking-tight">{request.resourceName}</h4>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                        <User className="w-3.5 h-3.5" />
                                                        <span className="font-bold">{request.user.name}</span>
                                                        <span className="text-xs opacity-70">({request.user.email})</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {request.status === 'PENDING' ? (
                                                <PremiumRequestActions requestId={request.id} />
                                            ) : (
                                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground mr-4">
                                                    Action Taken
                                                </div>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/5">
                                <p className="text-muted-foreground font-bold uppercase text-sm tracking-widest">No Requests at the moment</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Quick Inventory View */}
                <div id="inventory" className="space-y-6">
                    <h3 className="font-extrabold text-xl flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        Inventory
                    </h3>

                    <Card className="p-1 bg-muted/30 border-2 overflow-hidden">
                        <div className="max-h-[600px] overflow-y-auto space-y-1 p-2">
                            <p className="text-[10px] font-black uppercase text-muted-foreground p-2 tracking-widest">Premium Accounts</p>
                            {accounts.map(acc => (
                                <div key={acc.id} className="p-3 bg-background border rounded-lg hover:border-primary/30 transition-all group">
                                    <div className="flex items-center justify-between mb-1">
                                        <h5 className="font-bold text-sm tracking-tight">{acc.serviceName}</h5>
                                        <span className="text-[8px] font-black px-1.5 py-0.5 bg-muted rounded uppercase">{acc.type}</span>
                                    </div>
                                    <p className="text-[10px] font-mono text-muted-foreground truncate opacity-70">{acc.username}</p>
                                </div>
                            ))}
                            {accounts.length === 0 && <p className="text-xs text-center p-4 italic text-muted-foreground">No accounts added</p>}

                            <div className="h-4" />
                            <p className="text-[10px] font-black uppercase text-muted-foreground p-2 tracking-widest">License Keys</p>
                            {keys.map(key => (
                                <div key={key.id} className="p-3 bg-background border rounded-lg hover:border-primary/30 transition-all group">
                                    <div className="flex items-center justify-between mb-1">
                                        <h5 className="font-bold text-sm tracking-tight">{key.softwareName}</h5>
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${key.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                                            key.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                            {key.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-mono text-muted-foreground truncate opacity-70 mb-2">{key.key}</p>

                                    <div className="flex justify-end">
                                        <AssignLicenseDialog
                                            licenseId={key.id}
                                            softwareName={key.softwareName}
                                            isAssigned={key.status === 'ASSIGNED'}
                                            currentAssigneeId={key.assignedToUser}
                                            trigger={
                                                <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                                                    <User className="w-3 h-3" />
                                                    {key.status === 'ASSIGNED' ? 'Manage' : 'Assign'}
                                                </Button>
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                            {keys.length === 0 && <p className="text-xs text-center p-4 italic text-muted-foreground">No license keys added</p>}
                        </div>
                    </Card>

                    <Card className="p-6 bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20">
                        <h4 className="font-bold flex items-center gap-2 mb-2 uppercase text-sm tracking-tight">
                            <AlertCircle className="w-4 h-4" />
                            Admin Note
                        </h4>
                        <p className="text-xs opacity-90 leading-relaxed font-medium">
                            ইউজার যখন কোনো রিসোর্স রিকোয়েস্ট করবে, তা "Resource Requests" সেকশনে দেখা যাবে। Approve বাটনে ক্লিক করলে আপনি ইউজারকে ইউজারনেম/পাসওয়ার্ড বা লাইসেন্স কী পাঠাতে পারবেন।
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
