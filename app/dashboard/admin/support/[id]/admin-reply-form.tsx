'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2, AlertCircle, Zap, ShieldCheck } from 'lucide-react'

interface AdminTicketReplyFormProps {
    ticketId: string
}

export default function AdminTicketReplyForm({ ticketId }: AdminTicketReplyFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return

        setError('')
        setLoading(true)

        try {
            const response = await fetch(`/api/support/tickets/${ticketId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            })

            if (!response.ok) {
                const data = await response.json()
                setError(data.error || 'উত্তর পাঠানো সম্ভব হয়নি')
                setLoading(false)
                return
            }

            setMessage('')
            router.refresh()
            setLoading(false)
        } catch (err) {
            setError('সার্ভার সমস্যা হয়েছে। আবার চেষ্টা করুন।')
            setLoading(false)
        }
    }

    const templates = [
        "বায়োস সেটিংসে গিয়ে বুট মোড 'UEFI' এ পরিবর্তন করে দেখুন।",
        "দয়া করে আপনার পেনড্রাইভটি অন্য একটি ইউএসবি পোর্টে চেক করে দেখুন।",
        "আপনার পিসির 'Secure Boot' অপশনটি ডিজেবল করে চেষ্টা করুন।",
    ]

    return (
        <Card className="p-6 border-primary/20 bg-primary/5 shadow-inner">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Admin Response
                </h3>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-[10px] h-7 gap-1">
                        <Zap className="w-3 h-3" />
                        Quick Reply
                    </Button>
                </div>
            </div>

            {/* Templates Suggestion */}
            <div className="flex flex-wrap gap-2 mb-4">
                {templates.map((temp, i) => (
                    <button
                        key={i}
                        onClick={() => setMessage(temp)}
                        className="text-[10px] bg-background border px-2 py-1 rounded hover:bg-primary/5 hover:border-primary/30 transition-all text-muted-foreground hover:text-primary"
                    >
                        {temp.slice(0, 25)}...
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                    placeholder="Type your official response here..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={loading}
                    className="resize-none bg-background font-medium"
                />

                {error && (
                    <div className="p-3 rounded bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                        <Loader2 className={`w-3 h-3 ${loading ? 'animate-spin' : 'hidden'}`} />
                        {loading ? 'Sending official response...' : 'Your reply will be visible to the user.'}
                    </span>
                    <Button type="submit" disabled={loading || !message.trim()} className="gap-2 px-8">
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Post Reply
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    )
}
