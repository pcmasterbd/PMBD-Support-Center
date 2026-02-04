'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2, AlertCircle } from 'lucide-react'

interface TicketReplyFormProps {
    ticketId: string
}

export default function TicketReplyForm({ ticketId }: TicketReplyFormProps) {
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

    return (
        <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" />
                উত্তর দিন
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                    placeholder="আপনার মেসেজ এখানে লিখুন..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={loading}
                    className="resize-none"
                />

                {error && (
                    <div className="p-3 rounded bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading || !message.trim()} className="gap-2">
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                পাঠানো হচ্ছে...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                মেসেজ পাঠান
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    )
}
