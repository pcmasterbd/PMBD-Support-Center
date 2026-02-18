import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Clock, AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function SupportPage() {
    const session = await auth();

    if (!session?.user?.id) return null;

    const tickets = await prisma.supportTicket.findMany({
        where: { userId: session.user.id },
        include: {
            _count: {
                select: { messages: true }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-500/10 text-blue-500 border-blue-200';
            case 'IN_PROGRESS': return 'bg-orange-500/10 text-orange-500 border-orange-200';
            case 'RESOLVED': return 'bg-green-500/10 text-green-500 border-green-200';
            case 'CLOSED': return 'bg-muted text-muted-foreground border-muted';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'text-red-600 font-bold';
            case 'HIGH': return 'text-orange-600 font-bold';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md-tab:flex-row md-tab:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm-std:text-3xl font-bold tracking-tight">সাপোর্ট সেন্টার</h2>
                    <p className="text-muted-foreground">আপনার সকল টেকনিক্যাল সমস্যা এখানে জানান</p>
                </div>
                <Link href="/dashboard/support/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        নতুন টিকেট তৈরি করুন
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                        <Link key={ticket.id} href={`/dashboard/support/${ticket.id}`}>
                            <Card className="p-4 hover:border-primary/50 transition-all cursor-pointer group">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                            <span className={`text-[10px] uppercase font-bold ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority} Priority
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-1">{ticket.subject}</h3>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="w-3 h-3" />
                                                <span>{ticket._count.messages} টি মেসেজ</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>আপডেট: {new Date(ticket.updatedAt).toLocaleDateString('bn-BD')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <Card className="p-8 sm:p-20 text-center flex flex-col items-center justify-center border-dashed">
                        <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                            <AlertCircle className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold">আপনার কোনো টিকেট নেই</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                            আপনার যদি কোনো সমস্যা থাকে তবে "নতুন টিকেট তৈরি করুন" বাটনে ক্লিক করে আমাদের জানান। আমরা দ্রুত সমাধান করার চেষ্টা করব।
                        </p>
                        <Link href="/dashboard/support/new" className="mt-8">
                            <Button size="lg">শুরু করুন</Button>
                        </Link>
                    </Card>
                )}
            </div>

            {/* FAQ/Help section */}
            <div className="pt-10">
                <h3 className="font-bold text-xl mb-6">সাধারণ কিছু জিজ্ঞাসা (FAQ)</h3>
                <div className="grid md-tab:grid-cols-2 gap-4">
                    <FaqItem
                        q="আমার পেনড্রাইভ কাজ করছে না, কি করব?"
                        a="প্রথমে নিশ্চিত করুন আপনার ইউএসবি পোর্টটি ঠিক আছে কি না। সমস্যাটি অন্য কম্পিউটারেও হচ্ছে কি না দেখুন। সমস্যা সমাধান না হলে একটি সাপোর্ট টিকেট দিন।"
                    />
                    <FaqItem
                        q="সিরিয়াল নম্বর কোথায় পাব?"
                        a="আপনার কেনা পেনড্রাইভের প্যাকেজিংয়ের ভেতরে একটি কার্ডে ১১-২৪ ডিজিটের সিরিয়াল নম্বরটি পাবেন।"
                    />
                    <FaqItem
                        q="সফটওয়্যার ডাউনলোড হচ্ছে না কেন?"
                        a="আপনার ইন্টারনেট কানেকশন চেক করুন। অনেক সময় ফায়ারওয়াল ডাউনলোড ব্লক করতে পারে, সেটি সাময়িকভাবে বন্ধ করে চেষ্টা করুন।"
                    />
                    <FaqItem
                        q="সাপোর্ট টিকেট দিলে কতক্ষণে উত্তর পাব?"
                        a="আমরা সাধারণত ২৪-৪৮ ঘণ্টার মধ্যে সকল টিকেটের উত্তর দেওয়ার চেষ্টা করি।"
                    />
                </div>
            </div>
        </div>
    );
}

function FaqItem({ q, a }: { q: string, a: string }) {
    return (
        <Card className="p-5">
            <h4 className="font-bold text-sm mb-2 text-primary">প্রশ্ন: {q}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">উত্তর: {a}</p>
        </Card>
    )
}
