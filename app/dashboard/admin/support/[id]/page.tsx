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
import { TicketStatusSwitcher } from "@/components/admin/ticket-status-switcher";
import { TicketPriorityToggle } from "@/components/admin/ticket-priority-toggle";
import { ManagementNotes } from "@/components/admin/management-notes";
import { QuickReplyManager } from "@/components/admin/quick-reply-manager";
import { getQuickReplies } from "@/lib/actions/quick-reply-actions";
import { TicketMessageReactions } from "@/components/ticket-message-reactions";
import { VideoCallButton } from "@/components/video-call-button";

export default async function AdminTicketDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = await paramsPromise;
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    const [ticket, quickReplies]: any = await Promise.all([
        prisma.supportTicket.findUnique({
            where: { id: params.id },
            include: {
                messages: {
                    include: {
                        user: {
                            select: { name: true, role: true }
                        },
                        reactions: {
                            include: {
                                user: {
                                    select: { name: true }
                                }
                            }
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
        }),
        getQuickReplies()
    ]);

    if (!ticket) return notFound();

    return (
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-10 pb-20 px-0 sm:px-2">
            {/* Header with Navigation and Quick Actions */}
            <div className="flex flex-col gap-6 border-b border-muted/40 pb-8 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <Link href="/dashboard/admin/support">
                            <Button variant="outline" size="icon" className="w-11 h-11 rounded-2xl border-2 hover:bg-muted/50 transition-all shrink-0">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="space-y-1.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-tight border-2 ${ticket.status === 'OPEN' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600' :
                                    ticket.status === 'RESOLVED' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-muted/30 border-muted/40 text-muted-foreground'
                                    }`}>
                                    {ticket.status}
                                </span>
                                {ticket.priority === 'URGENT' && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-tight bg-red-500/10 border-2 border-red-500/20 text-red-600 animate-pulse">
                                        Urgent Priority
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-black tracking-tighter truncate">Ticket #{ticket.id.slice(-6).toUpperCase()}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-[1.5rem] border border-muted/30 self-start sm:self-auto overflow-x-auto no-scrollbar max-w-full">
                        <VideoCallButton
                            ticketId={ticket.id}
                            isAdmin={true}
                            userName={session.user.name || 'Admin'}
                        />
                        <QuickReplyManager quickReplies={quickReplies} />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-3 bg-background border-2 border-muted/40 p-1.5 rounded-2xl shadow-sm">
                        <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden xs:block">Status</div>
                        <TicketStatusSwitcher ticketId={ticket.id} currentStatus={ticket.status} />
                    </div>
                    <div className="flex items-center gap-3 bg-background border-2 border-muted/40 p-1.5 rounded-2xl shadow-sm">
                        <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden xs:block">Priority</div>
                        <TicketPriorityToggle ticketId={ticket.id} currentPriority={ticket.priority} />
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
                {/* Main Conversation Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-black text-xl tracking-tighter">Conversation History</h3>
                        <div className="h-0.5 flex-1 mx-4 bg-muted/30 rounded-full hidden sm:block" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                            {ticket.messages?.length || 0} Messages
                        </span>
                    </div>

                    <div className="space-y-8 sm:space-y-10">
                        {(ticket.messages || []).map((message: any) => {
                            const isUserAdmin = message.user.role === 'ADMIN' || message.user.role === 'SUPERADMIN';
                            return (
                                <div key={message.id} className={`flex ${isUserAdmin ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                    <div className={`max-w-[95%] sm:max-w-[85%] space-y-2.5 group`}>
                                        <div className={`flex items-center gap-2 mb-1 px-1 ${isUserAdmin ? 'justify-end text-right' : 'justify-start'}`}>
                                            {!isUserAdmin && (
                                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-muted-foreground/10">
                                                    <User className="w-3.5 h-3.5" />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black tracking-tight flex items-center gap-1.5">
                                                    {message.user.name}
                                                    {isUserAdmin && <Shield className="w-3 h-3 text-primary" />}
                                                </span>
                                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter opacity-60">
                                                    {new Date(message.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {isUserAdmin && (
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                                                    <Shield className="w-3.5 h-3.5" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative group/bubble">
                                            <Card className={`p-4 sm:p-5 shadow-sm border-2 transition-all group-hover/bubble:shadow-md ${isUserAdmin
                                                ? 'bg-primary/5 border-primary/20 rounded-2xl rounded-tr-none'
                                                : 'bg-muted/10 border-muted/60 rounded-2xl rounded-tl-none'
                                                }`}>
                                                <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed tracking-tight text-foreground/90">{message.message}</p>
                                                {message.attachmentUrl && (
                                                    <div className="mt-5">
                                                        {message.attachmentUrl.startsWith('data:image/') ? (
                                                            <Link href={message.attachmentUrl} target="_blank" className="block relative overflow-hidden rounded-2xl border-2 border-muted/50 hover:border-primary/30 transition-all shadow-sm">
                                                                <img
                                                                    src={message.attachmentUrl}
                                                                    alt="Attachment"
                                                                    className="max-w-full h-auto hover:scale-105 transition-transform duration-700"
                                                                />
                                                            </Link>
                                                        ) : (
                                                            <Link href={message.attachmentUrl} target="_blank" className="flex items-center gap-3 p-4 bg-muted/20 border-2 border-dashed border-muted rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-muted/30 hover:border-primary/20 transition-all group/file">
                                                                <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center group-hover/file:text-primary transition-colors">
                                                                    <ExternalLink className="w-4 h-4" />
                                                                </div>
                                                                সংযুক্ত ফাইলটি দেখুন
                                                            </Link>
                                                        )}
                                                    </div>
                                                )}
                                            </Card>

                                            <div className={`absolute -bottom-3 sm:-bottom-4 ${isUserAdmin ? 'right-2' : 'left-2'} z-10`}>
                                                <TicketMessageReactions
                                                    ticketId={ticket.id}
                                                    messageId={message.id}
                                                    initialReactions={message.reactions || []}
                                                    currentUserId={session.user.id}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Admin Reply Area */}
                    <div className="pt-12 border-t border-muted/40">
                        <AdminTicketReplyForm ticketId={ticket.id} quickReplies={quickReplies} />
                    </div>
                </div>

                {/* User Information Sidebar */}
                <div className="space-y-8">
                    <Card className="p-8 rounded-[2.5rem] border-2 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

                        <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-6 flex items-center gap-2">
                            <Info className="w-3.5 h-3.5" />
                            User Identification
                        </h4>

                        <div className="space-y-6 relative">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                                    <User className="w-7 h-7 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-lg font-black tracking-tight truncate">{ticket.user.name}</p>
                                    <p className="text-xs text-muted-foreground/70 font-medium truncate">{ticket.user.email}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-muted/40 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                                        <Shield className="w-3 h-3 text-green-500" />
                                        Serial Status
                                    </span>
                                    <span className="text-xs font-black text-green-600 px-2.5 py-0.5 bg-green-500/10 rounded-full border border-green-500/20">Active</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                                        <Info className="w-3 h-3 text-primary" />
                                        Identifier code
                                    </span>
                                    <span className="font-mono text-xs bg-muted/50 p-3 rounded-2xl border-2 border-muted/20 tracking-wider font-bold text-center">
                                        {ticket.user.serialNumber?.code || 'NO_SERIAL'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" />
                                        Member Since
                                    </span>
                                    <span className="text-xs font-bold">
                                        {new Date(ticket.user.createdAt).toLocaleDateString('bn-BD')}
                                    </span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full h-12 rounded-2xl text-sm font-black tracking-tight border-2 hover:bg-primary hover:text-white hover:border-primary transition-all group" asChild>
                                <Link href={`/dashboard/admin/users/${ticket.user.id}`}>
                                    View Detailed Profile
                                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </Card>

                    <ManagementNotes userId={ticket.user.id} initialNotes={ticket.user.adminNotes} />
                </div>
            </div>
        </div>
    );
}
