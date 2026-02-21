'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2, AlertCircle, Zap, ShieldCheck, ImageIcon, X } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/lib/language-context'

interface QuickReply {
    id: string
    category: string
    message: string
}

interface AdminTicketReplyFormProps {
    ticketId: string
    quickReplies: QuickReply[]
}

export default function AdminTicketReplyForm({ ticketId, quickReplies }: AdminTicketReplyFormProps) {
    const { t } = useLanguage()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [image, setImage] = useState<string | null>(null)
    const [showQuickReplies, setShowQuickReplies] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
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
                const errorMessage = data.error || t('common.error');
                setError(errorMessage)
                toast.error(errorMessage)
                setLoading(false)
                return
            }

            toast.success(t('common.success'))
            setMessage('')
            setImage(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            router.refresh()
            setLoading(false)
        } catch (err) {
            const errorMessage = t('common.error');
            setError(errorMessage)
            toast.error(errorMessage)
            setLoading(false)
        }
    }

    // Group replies by category
    const repliesByCategory = quickReplies.reduce((acc, reply) => {
        if (!acc[reply.category]) acc[reply.category] = []
        acc[reply.category].push(reply)
        return acc
    }, {} as Record<string, QuickReply[]>)

    const categories = Object.keys(repliesByCategory)
    const [activeCategory, setActiveCategory] = useState(categories[0] || '')

    const handleQuickReply = (temp: string) => {
        setMessage(prev => {
            if (!prev) return temp
            return prev.trimEnd() + "\n\n" + temp
        })

        // Focus and scroll to bottom
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus()
                textareaRef.current.scrollTop = textareaRef.current.scrollHeight
            }
        }, 0)
    }

    return (
        <Card className="p-6 border-primary/20 bg-primary/5 shadow-inner">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Admin Response
                </h3>
                <button
                    onClick={() => setShowQuickReplies(!showQuickReplies)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all border ${showQuickReplies
                        ? 'bg-orange-100 border-orange-200'
                        : 'bg-background border-transparent hover:bg-muted'
                        }`}
                >
                    <Zap className={`w-3 h-3 ${showQuickReplies ? 'text-orange-600' : 'text-muted-foreground'}`} />
                    <span className={`text-[10px] font-bold uppercase ${showQuickReplies ? 'text-orange-700' : 'text-muted-foreground'}`}>
                        Quick Reply Mode {showQuickReplies ? 'ON' : 'OFF'}
                    </span>
                </button>
            </div>

            {/* Quick Reply Tabs */}
            {showQuickReplies && categories.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex gap-1 mb-2 border-b">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-[9px] px-2 py-1 font-bold uppercase transition-all ${activeCategory === cat
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-muted-foreground hover:text-primary'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Templates Suggestion */}
                    <div className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
                        {repliesByCategory[activeCategory]?.map((reply) => (
                            <button
                                key={reply.id}
                                type="button"
                                onClick={() => handleQuickReply(reply.message)}
                                className="text-[10px] bg-background border px-2 py-1.5 rounded-md hover:bg-primary/5 hover:border-primary/30 transition-all text-muted-foreground hover:text-primary text-left max-w-[200px] truncate shadow-sm"
                                title={reply.message}
                            >
                                {reply.message}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                    ref={textareaRef}
                    placeholder={t('supportTickets.adminReplyVisibility')}
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                    className="resize-none bg-background font-medium"
                    required={!image}
                />

                {image && (
                    <div className="relative w-full max-w-sm rounded-lg overflow-hidden border shadow-sm group bg-white dark:bg-slate-900">
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
                            className="gap-2 bg-background border-primary/20 hover:bg-primary/5"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading}
                        >
                            <ImageIcon className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold">{t('supportTickets.addPhoto')}</span>
                        </Button>
                        {image && (
                            <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                                {t('supportTickets.imageSelected')}
                            </span>
                        )}
                    </div>

                    <Button type="submit" disabled={loading || (!message.trim() && !image)} className="gap-2 px-8">
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t('supportTickets.sendingMessage')}
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
