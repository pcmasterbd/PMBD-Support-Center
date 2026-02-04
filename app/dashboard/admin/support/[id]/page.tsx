import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Clock,
    Shield,
    User,
    ExternalLink,
    CheckCircle,
    AlertCircle,
    Info,
    Calendar,
    Settings2
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminTicketReplyForm from "./admin-reply-form";

export default async function AdminTicketDetailPage({ params }: { params: { id: string } }) {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    const ticket: any = await prisma.supportTicket.findUnique({
        where: { id: params.id },
        include: {
            messages: {
                include: {
                    user: {
                        select: { name: true, role: true }
                    }
                },
                orderBy: { createdAt: 'asc' }
            },
            user: {
                include: {
                    serialNumber: true
                }
            }
        }
    });

    if (!ticket) return notFound();

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Header with Navigation and Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/support">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Ticket #{ticket.id.slice(-6).toUpperCase()}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border-2 ${ticket.status === 'OPEN' ? 'border-blue-500/50 text-blue-500' :
                                    ticket.status === 'RESOLVED' ? 'border-green-500/50 text-green-500' : 'text-muted-foreground'
                                }`}>
                                {ticket.status}
                            </span>
                            <span className={`text-[10px] font-bold uppercase ${ticket.priority === 'URGENT' ? 'text-red-500' : 'text-muted-foreground'
                                }`}>
                                {ticket.priority} Priority
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Settings2 className="w-4 h-4" />
                        Change Status
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                        <AlertCircle className="w-4 h-4" />
                        Mark as Urgent
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Conversation Area */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-lg mb-4">Conversation History</h3>
                    <div className="space-y-6">
                        {(ticket.messages || []).map((message: any) => {
                            const isUserAdmin = message.user.role === 'ADMIN' || message.user.role === 'SUPERADMIN';
                            return (
                                <div key={message.id} className={`flex ${isUserAdmin ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] space-y-2`}>
                                        <div className={`flex items-center gap-2 mb-1 px-1 ${isUserAdmin ? 'justify-end text-right' : 'justify-start'}`}>
                                            {isUserAdmin && <Shield className="w-3 h-3 text-primary" />}
                                            {!isUserAdmin && <User className="w-3 h-3 text-muted-foreground" />}
                                            <span className="text-xs font-bold">{message.user.name} {isUserAdmin && '(Admin)'}</span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {new Date(message.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <Card className={`p-4 shadow-sm border-2 ${isUserAdmin
                                                ? 'bg-primary/5 border-primary/20 rounded-tr-none'
                                                : 'bg-muted/10 border-muted rounded-tl-none'
                                            }`}>
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
                                            {message.attachmentUrl && (
                                                <Link href={message.attachmentUrl} target="_blank" className="mt-4 block p-2 bg-background border rounded-md text-xs font-medium hover:text-primary transition-colors">
                                                    সংযুক্ত ফাইলটি দেখুন
                                                </Link>
                                            )}
                                        </Card>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Admin Reply Area */}
                    <div className="pt-10">
                        <AdminTicketReplyForm ticketId={ticket.id} />
                    </div>
                </div>

                {/* User Information Sidebar */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">User Information</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{ticket.user.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{ticket.user.email}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        Serial Status
                                    </span>
                                    <span className="font-bold text-green-600">Active</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Info className="w-3 h-3" />
                                        Serial No.
                                    </span>
                                    <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">
                                        {ticket.user.serialNumber?.code || 'NO_SERIAL'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Joined
                                    </span>
                                    <span className="font-medium">
                                        {new Date(ticket.user.createdAt).toLocaleDateString('bn-BD')}
                                    </span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full text-xs h-8" asChild>
                                <Link href={`/dashboard/admin/users/${ticket.user.id}`}>
                                    View Full Profile
                                    <ExternalLink className="w-3 h-3 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-6 bg-red-50/50 border-red-100">
                        <h4 className="font-bold text-sm text-red-600 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Management Notes
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                            "ইউজারকে বায়োস সেটিংস চেক করতে বলা হয়েছে। পেনড্রাইভটি সম্ভবত ইউইএফআই মুডে বুট হচ্ছে না।"
                        </p>
                        <Button variant="link" className="text-red-600 text-[10px] p-0 h-auto mt-2">Edit Notes</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
