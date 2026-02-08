import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Shield, HelpCircle, ExternalLink, Clock, CheckCircle2, AlertCircle, Copy } from "lucide-react";
import Link from "next/link";
import { PremiumRequestButton } from "@/components/premium-request-button";
import { CopyButton } from "@/components/copy-button";

export default async function PremiumAccountsPage() {
    const session = await auth();

    if (!session?.user?.id) return null;

    const [accounts, requests] = await Promise.all([
        prisma.premiumAccount.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { serviceName: 'asc' }
        }),
        prisma.accountRequest.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    // Create a set of resource names that have pending requests
    const pendingRequests = new Set(
        requests
            .filter(r => r.status === 'PENDING')
            .map(r => r.resourceName)
    );

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-extrabold tracking-tight">প্রিমিয়াম রিসোর্স</h2>
                <p className="text-muted-foreground">আপনার প্রয়োজনীয় প্রিমিয়াম একাউন্ট এবং লাইসেন্স কী এখান থেকে সংগ্রহ করুন</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Available Resources */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        উপলব্ধ সেবাসমূহ
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        {accounts.length > 0 ? (
                            accounts.map((account) => (
                                <Card key={account.id} className="p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-primary/20 group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Key className="w-6 h-6" />
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${account.type === 'PRIVATE' ? 'bg-purple-500/10 text-purple-600 border-purple-200' : 'bg-blue-500/10 text-blue-600 border-blue-200'
                                            }`}>
                                            {account.type} Access
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{account.serviceName}</h4>
                                    <p className="text-xs text-muted-foreground mb-6 pr-10">{account.notes || "প্রিমিয়াম একাউন্ট অ্যাক্সেস"}</p>

                                    <PremiumRequestButton
                                        resourceId={account.id}
                                        resourceType="PREMIUM_ACCOUNT"
                                        resourceName={account.serviceName}
                                        isPending={pendingRequests.has(account.serviceName)}
                                    />
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-2 p-12 text-center border-2 border-dashed rounded-2xl bg-muted/20">
                                <Key className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                                <p className="text-muted-foreground font-medium">এই মুহূর্তে কোনো একাউন্ট উপলব্ধ নেই।</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Request Status */}
                <div className="space-y-6">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        আবেদন লিস্ট
                    </h3>
                    <div className="space-y-3">
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                <Card key={request.id} className="p-4 space-y-3 overflow-hidden">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h5 className="font-bold text-sm tracking-tight uppercase">{request.resourceName}</h5>
                                            <p className="text-[10px] text-muted-foreground font-bold">{new Date(request.createdAt).toLocaleDateString('bn-BD')}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${request.status === 'APPROVED' ? 'bg-green-500 text-white' :
                                            request.status === 'PENDING' ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
                                            }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    {request.status === 'APPROVED' && request.adminNotes && (
                                        <div className="mt-2 space-y-2">
                                            <div className="p-3 bg-green-50 border border-green-100 rounded-lg relative group/item">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-[10px] font-bold text-green-700 uppercase opacity-70 tracking-wider">Access Details</p>
                                                    <CopyButton text={request.adminNotes} />
                                                </div>
                                                <p className="text-xs font-mono font-bold text-green-900 break-all leading-relaxed whitespace-pre-wrap">
                                                    {request.adminNotes}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {request.status === 'REJECTED' && request.adminNotes && (
                                        <div className="p-2.5 bg-red-50 border border-red-100 rounded text-[10px] text-red-700 font-medium">
                                            <span className="font-bold">কারণ:</span> {request.adminNotes}
                                        </div>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <div className="p-8 text-center border-2 border-dashed rounded-xl bg-muted/10">
                                <p className="text-xs text-muted-foreground font-bold uppercase italic tracking-widest">No Requests Found</p>
                            </div>
                        )}
                    </div>

                    <Card className="p-6 bg-primary text-primary-foreground space-y-4 border-none shadow-xl shadow-primary/20">
                        <h4 className="font-bold flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 animate-pulse" />
                            ব্যবহার বিধি
                        </h4>
                        <ul className="text-xs space-y-3 list-disc pl-4 opacity-90 font-medium leading-relaxed">
                            <li>একটি একাউন্ট একবারই রিকোয়েস্ট করা যাবে।</li>
                            <li>অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন করা কঠোরভাবে নিষিদ্ধ।</li>
                            <li>সাধারণত ১২-২৪ ঘণ্টার মধ্যে আবেদনটি রিভিউ করা হয়।</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
}
