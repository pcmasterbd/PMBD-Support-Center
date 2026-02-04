import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Shield, HelpCircle, ExternalLink, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

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

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">প্রিমিয়াম রিসোর্স</h2>
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
                                <Card key={account.id} className="p-6 hover:shadow-md transition-all border-2 border-transparent hover:border-primary/20">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-primary/10 rounded-xl">
                                            <Key className="w-6 h-6 text-primary" />
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${account.type === 'PRIVATE' ? 'bg-purple-500/10 text-purple-600 border-purple-200' : 'bg-blue-500/10 text-blue-600 border-blue-200'
                                            }`}>
                                            {account.type} Access
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1">{account.serviceName}</h4>
                                    <p className="text-xs text-muted-foreground mb-4 pr-10">{account.notes || "প্রিমিয়াম একাউন্ট অ্যাক্সেস"}</p>

                                    <Button className="w-full gap-2">
                                        অ্যাক্সেস রিকোয়েস্ট করুন
                                    </Button>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-2 p-12 text-center border-2 border-dashed rounded-2xl">
                                <Key className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                                <p className="text-muted-foreground">এই মুহূর্তে কোনো একাউন্ট উপলব্ধ নেই।</p>
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
                                <Card key={request.id} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h5 className="font-bold text-sm tracking-tight">{request.resourceName}</h5>
                                            <p className="text-[10px] text-muted-foreground">{new Date(request.createdAt).toLocaleDateString('bn-BD')}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${request.status === 'APPROVED' ? 'bg-green-500 text-white' :
                                                request.status === 'PENDING' ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
                                            }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    {request.status === 'APPROVED' && request.adminNotes && (
                                        <div className="p-2 bg-green-50 border border-green-100 rounded text-[11px] text-green-800 font-mono break-all">
                                            <p className="font-bold mb-1 uppercase opacity-70">Admin Response:</p>
                                            {request.adminNotes}
                                        </div>
                                    )}
                                    {request.status === 'REJECTED' && request.adminNotes && (
                                        <p className="text-[10px] text-red-600">কারন: {request.adminNotes}</p>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-lg text-center">আপনার কোনো আবেদন নেই</p>
                        )}
                    </div>

                    <Card className="p-6 bg-primary text-primary-foreground space-y-4">
                        <h4 className="font-bold flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            ব্যবহার বিধি
                        </h4>
                        <ul className="text-xs space-y-2 list-disc pl-4 opacity-90">
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
