'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2, AlertCircle, ImageIcon, X } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { toast } from 'sonner'

interface TicketReplyFormProps {
    ticketId: string
}

export default function TicketReplyForm({ ticketId }: TicketReplyFormProps) {
    const { t } = useLanguage()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [image, setImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error(t('profile.imageTooLarge'))
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setImage(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const removeImage = () => {
        setImage(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() && !image) return

        setError('')
        setLoading(true)

        try {
            const response = await fetch(`/api/support/tickets/${ticketId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    attachmentUrl: image
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                setError(data.error || t('common.error'))
                setLoading(false)
                return
            }

            setMessage('')
            setImage(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            router.refresh()
            toast.success(t('common.success'))
            setLoading(false)
        } catch (err) {
            setError(t('common.error'))
            setLoading(false)
        }
    }

    return (
        <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" />
                {t('navbar.support')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                    placeholder={t('supportTickets.replyVisibility')}
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                    className="resize-none"
                    required={!image}
                />

                {image && (
                    <div className="relative w-full max-w-sm rounded-lg overflow-hidden border shadow-sm group">
                        <img src={image} alt="Preview" className="w-full h-auto max-h-48 object-cover" />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {error && (
                    <div className="p-3 rounded bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading}
                        >
                            <ImageIcon className="w-4 h-4" />
                            {t('supportTickets.addPhoto')}
                        </Button>
                        {image && (
                            <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                                {t('supportTickets.imageSelected')}
                            </span>
                        )}
                    </div>

                    <Button type="submit" disabled={loading || (!message.trim() && !image)} className="gap-2">
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t('supportTickets.sendingMessage')}
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                {t('navbar.support')}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    )
}
