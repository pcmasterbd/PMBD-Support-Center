'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    CheckCircle2,
    XCircle,
    Clock,
    ShieldCheck,
    User,
    Hash
} from 'lucide-react'
import { toast } from 'sonner'
import { approveActivationRequest, rejectActivationRequest } from '@/lib/actions/serial-actions'
import { cn } from '@/lib/utils'

interface ActivationRequest {
    id: string
    userId: string
    userName: string
    userEmail: string
    userPhone: string
    serialCode: string
    status: string
    createdAt: string
}

export function ActivationsClient({ initialRequests }: { initialRequests: ActivationRequest[] }) {
    const [requests, setRequests] = useState(initialRequests)
    const [processingId, setProcessingId] = useState<string | null>(null)

    const handleApprove = async (requestId: string, years: number) => {
        setProcessingId(requestId)
        try {
            const result = await approveActivationRequest(requestId, years)
            if (result.success) {
                toast.success('অ্যাক্টিভেশন রিকোয়েস্ট অ্যাপ্রুভ করা হয়েছে')
                setRequests(requests.filter(r => r.id !== requestId))
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setProcessingId(null)
        }
    }

    const handleReject = async (requestId: string) => {
        const reason = window.prompt('প্রত্যাখ্যানের কারণ লিখুন:')
        if (reason === null) return

        setProcessingId(requestId)
        try {
            const result = await rejectActivationRequest(requestId, reason)
            if (result.success) {
                toast.success('রিকোয়েস্ট প্রত্যাখ্যাত হয়েছে')
                setRequests(requests.filter(r => r.id !== requestId))
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setProcessingId(null)
        }
    }

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    অ্যাক্টিভেশন পেন্ডিং লিস্ট
                </h2>
                <p className="text-sm text-muted-foreground font-medium mt-1">পেন্ড্রাইভ সিরিয়াল অ্যাক্টিভেশন রিকোয়েস্টগুলো রিভিউ করুন</p>
            </div>

            {requests.length === 0 ? (
                <Card className="p-16 text-center border-2 border-dashed rounded-3xl">
                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <p className="text-lg font-bold text-muted-foreground">কোন পেন্ডিং রিকোয়েস্ট নেই</p>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {requests.map((request) => (
                        <Card key={request.id} className="p-5 sm:p-6 rounded-3xl border-2 hover:border-primary/20 transition-all group relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-black text-lg leading-none">{request.userName}</h3>
                                        <p className="text-sm text-muted-foreground font-medium">{request.userEmail} • {request.userPhone}</p>
                                        <div className="flex items-center gap-2 pt-2">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border font-mono text-xs font-bold text-foreground">
                                                <Hash className="w-3 h-3 text-muted-foreground" />
                                                {request.serialCode}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-black uppercase tracking-wider">
                                                <Clock className="w-3 h-3" />
                                                Pending Admin Approval
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-0.5 bg-muted rounded-xl p-1 border">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="rounded-lg h-9 font-black text-[10px] uppercase tracking-wider px-3"
                                            onClick={() => handleApprove(request.id, 1)}
                                            disabled={processingId === request.id}
                                        >
                                            1 Year
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="rounded-lg h-9 font-black text-[10px] uppercase tracking-wider px-3"
                                            onClick={() => handleApprove(request.id, 2)}
                                            disabled={processingId === request.id}
                                        >
                                            2 Years
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="rounded-lg h-9 font-black text-[10px] uppercase tracking-wider px-3 bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                            onClick={() => handleApprove(request.id, 99)}
                                            disabled={processingId === request.id}
                                        >
                                            Lifetime
                                        </Button>
                                    </div>

                                    <div className="h-8 w-px bg-border hidden md:block" />

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="rounded-xl font-black text-[11px] uppercase tracking-wider px-4 h-11"
                                        onClick={() => handleReject(request.id)}
                                        disabled={processingId === request.id}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                    </Button>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">
                                {new Date(request.createdAt).toLocaleDateString('bn-BD', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
