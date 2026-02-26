import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Shield, User, Loader2, Send, CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import TicketReplyForm from "./reply-form";
import { TicketFeedback } from "@/components/ticket-feedback";
import { TicketMessageReactions } from "@/components/ticket-message-reactions";
import { VideoCallButton } from "@/components/video-call-button";

export default async function TicketDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = await paramsPromise;
    const session = await auth();

    if (!session?.user?.id) return null;

    const ticket = await prisma.supportTicket.findUnique({
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
                select: { id: true }
            },
            feedback: true
        }
    });

    if (!ticket) return notFound();

    // Basic security check: only the ticket owner or admins can view
    const isOwner = ticket.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN';

    if (!isOwner && !isAdmin) {
        redirect('/dashboard/support');
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 pb-20 px-0 sm:px-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-muted/40 pb-8 transition-all">
                <div className="flex items-start gap-4">
                    <Link href="/dashboard/support">
                        <Button variant="outline" size="icon" className="w-11 h-11 rounded-2xl border-2 hover:bg-muted/50 transition-all shrink-0">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-tight border-2 ${ticket.status === 'OPEN' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600' :
                                    ticket.status === 'RESOLVED' ? 'bg-green-500/10 border-green-500/20 text-green-600' :
                                        'bg-muted/30 border-muted/40 text-muted-foreground'
                                }`}>
                                {ticket.status}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                                <Clock className="w-3 h-3" />
                                {new Date(ticket.createdAt).toLocaleDateString('bn-BD')}
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tighter truncate leading-tight">{ticket.subject}</h2>
                    </div>
                </div>
                <div className="flex items-center self-start sm:self-auto">
                    <VideoCallButton
                        ticketId={ticket.id}
                        isAdmin={false}
                        userName={session.user.name || 'User'}
                    />
                </div>
            </div>

            <div className="space-y-10 sm:space-y-14">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-black text-xl tracking-tighter">Conversation History</h3>
                    <div className="h-0.5 flex-1 mx-4 bg-muted/30 rounded-full hidden sm:block" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                        {ticket.messages.length} Messages
                    </span>
                </div>

                <div className="space-y-8 sm:space-y-12">
                    {ticket.messages.map((message: any) => {
                        const isOwnMessage = message.userId === session.user.id;
                        const isStaff = message.user.role === 'ADMIN' || message.user.role === 'SUPERADMIN';

                        return (
                            <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                <div className={`max-w-[95%] sm:max-w-[85%] space-y-2.5 group`}>
                                    <div className={`flex items-center gap-2 mb-1 px-1 ${isOwnMessage ? 'justify-end text-right' : 'justify-start'}`}>
                                        {!isOwnMessage && (
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                                                <Shield className="w-3.5 h-3.5" />
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black tracking-tight flex items-center gap-1.5">
                                                {message.user.name}
                                                {isStaff && <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">Staff</span>}
                                            </span>
                                            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter opacity-60">
                                                {new Date(message.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        {isOwnMessage && (
                                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-muted-foreground/10">
                                                <User className="w-3.5 h-3.5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative group/bubble">
                                        <Card className={`p-4 sm:p-5 shadow-sm border-2 transition-all group-hover/bubble:shadow-md ${isOwnMessage
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
                                                            <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center group-hover/file:text-primary transition-colors text-muted-foreground">
                                                                <Clock className="w-4 h-4" />
                                                            </div>
                                                            সংযুক্ত ফাইলটি দেখুন
                                                        </Link>
                                                    )}
                                                </div>
                                            )}
                                        </Card>

                                        <div className={`absolute -bottom-3 sm:-bottom-4 ${isOwnMessage ? 'right-2' : 'left-2'} z-10`}>
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

                <div className="pt-12 sm:pt-16 border-t border-muted/40">
                    <div className="bg-muted/5 p-6 sm:p-10 rounded-[2.5rem] border-2 border-dashed border-muted/40">
                        <TicketReplyForm ticketId={ticket.id} />
                    </div>
                </div>

                {ticket.status === 'RESOLVED' && (
                    <div className="pt-10 animate-in zoom-in-95 duration-700">
                        <Card className="p-8 sm:p-12 rounded-[3rem] border-2 border-green-500/20 bg-green-500/[0.02] shadow-xl shadow-green-500/5 text-center">
                            <h3 className="text-2xl font-black tracking-tighter mb-4">আপনার সমস্যাটি কি সমাধান হয়েছে?</h3>
                            <p className="text-muted-foreground text-sm font-medium mb-10 max-w-sm mx-auto">আমাদের সার্ভিস নিয়ে আপনার মূল্যবান মতামত প্রদান করুন।</p>
                            <div className="max-w-md mx-auto p-6 bg-background rounded-[2rem] border-2 border-muted/30">
                                <TicketFeedback ticketId={ticket.id} isResolved={true} existingFeedback={ticket.feedback} />
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
