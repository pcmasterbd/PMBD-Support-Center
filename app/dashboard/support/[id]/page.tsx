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
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/support">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-xl sm-std:text-2xl font-bold tracking-tight">{ticket.subject}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border-2 ${ticket.status === 'OPEN' ? 'border-blue-500/50 text-blue-500' :
                                ticket.status === 'RESOLVED' ? 'border-green-500/50 text-green-500' : 'text-muted-foreground'
                                }`}>
                                {ticket.status}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                শুরু হয়েছে: {new Date(ticket.createdAt).toLocaleDateString('bn-BD')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {ticket.messages.map((message) => {
                    const isUserAdmin = message.user.role === 'ADMIN' || message.user.role === 'SUPERADMIN';
                    return (
                        <div key={message.id} className={`flex ${isUserAdmin ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[95%] sm-std:max-w-[85%] space-y-2 group`}>
                                <div className={`flex items-center gap-2 mb-1 px-1 ${isUserAdmin ? 'justify-start' : 'justify-end text-right'}`}>
                                    {isUserAdmin && <Shield className="w-3 h-3 text-primary" />}
                                    {!isUserAdmin && <User className="w-3 h-3 text-muted-foreground" />}
                                    <span className="text-xs font-bold">{message.user.name} {isUserAdmin && '(Admin)'}</span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(message.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="relative">
                                    <Card className={`p-3 sm-std:p-4 shadow-sm border-2 ${isUserAdmin
                                        ? 'bg-primary/5 border-primary/10 rounded-tl-none'
                                        : 'bg-muted/30 border-muted rounded-tr-none'
                                        }`}>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
                                        {message.attachmentUrl && (
                                            <div className="mt-4">
                                                {message.attachmentUrl.startsWith('data:image/') ? (
                                                    <Link href={message.attachmentUrl} target="_blank">
                                                        <img
                                                            src={message.attachmentUrl}
                                                            alt="Attachment"
                                                            className="max-width-full h-auto rounded-lg border shadow-sm hover:opacity-90 transition-opacity"
                                                        />
                                                    </Link>
                                                ) : (
                                                    <Link href={message.attachmentUrl} target="_blank" className="block p-2 bg-background border rounded-md text-xs font-medium hover:text-primary transition-colors">
                                                        সংযুক্ত ফাইলটি দেখুন
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </Card>

                                    <div className={`absolute -bottom-3 ${isUserAdmin ? 'left-2' : 'right-2'}`}>
                                        <TicketMessageReactions
                                            ticketId={ticket.id}
                                            messageId={message.id}
                                            initialReactions={message.reactions as any}
                                            currentUserId={session.user.id}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Reply Section */}
            {ticket.status !== 'CLOSED' ? (
                <div className="pt-10">
                    <TicketReplyForm ticketId={ticket.id} />
                </div>
            ) : (
                <Card className="p-4 sm-std:p-6 border-dashed text-center flex flex-col items-center">
                    <CheckCircle className="w-8 h-8 sm-std:w-10 sm-std:h-10 text-green-500 mb-4" />
                    <h3 className="text-base sm-std:text-lg font-bold">এই টিকেটটি বন্ধ করা হয়েছে</h3>
                    <p className="text-xs sm-std:text-sm text-muted-foreground">সমস্যাটি সমাধান হওয়ায় টিকেটটি ক্লোজ করা হয়েছে। আপনার আরও সাহায্যের প্রয়োজন হলে নতুন টিকেট ওপেন করুন।</p>
                </Card>
            )}

            {/* Feedback Section */}
            {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && isOwner && (
                <TicketFeedback
                    ticketId={ticket.id}
                    isResolved={true}
                    existingFeedback={ticket.feedback}
                />
            )}
        </div>
    );
}
