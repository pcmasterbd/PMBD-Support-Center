'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Loader2, Send, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NewTicketPage() {
    const router = useRouter()
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        subject: '',
        priority: 'MEDIUM',
        message: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.message.length < 10) {
            setError(t('newTicket.minChars'))
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/support/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                const errorMessage = data.error || t('common.error');
                setError(errorMessage)
                toast.error(errorMessage)
                setLoading(false)
                return
            }

            toast.success(t('common.success'))
            router.push(`/dashboard/support/${data.ticketId}`)
        } catch (err) {
            const errorMessage = t('common.error');
            setError(errorMessage)
            toast.error(errorMessage)
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/support">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{t('newTicket.title')}</h2>
                    <p className="text-sm text-muted-foreground">{t('newTicket.subtitle')}</p>
                </div>
            </div>

            <Card className="p-4 sm-std:p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="subject">{t('newTicket.subject')}</Label>
                            <Input
                                id="subject"
                                placeholder={t('newTicket.subjectPlaceholder')}
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priority">{t('newTicket.priorityLabel')}</Label>
                            <Select
                                disabled={loading}
                                value={formData.priority}
                                onValueChange={(val) => setFormData({ ...formData, priority: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('newTicket.priorityPlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">{t('newTicket.lowPriority')}</SelectItem>
                                    <SelectItem value="MEDIUM">{t('newTicket.mediumPriority')}</SelectItem>
                                    <SelectItem value="HIGH">{t('newTicket.highPriority')}</SelectItem>
                                    <SelectItem value="URGENT">{t('newTicket.urgentPriority')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">{t('newTicket.description')}</Label>
                        <Textarea
                            id="message"
                            placeholder={t('newTicket.descPlaceholder')}
                            rows={8}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                            disabled={loading}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">{t('newTicket.minChars')}</p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" size="lg" disabled={loading} className="w-full sm-std:w-auto gap-2">
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {t('newTicket.processing')}
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    {t('newTicket.submitTicket')}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/20 space-y-4">
                <h4 className="font-bold flex items-center gap-2 text-primary">
                    <AlertCircle className="w-5 h-5" />
                    {t('newTicket.refundPolicy')}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('newTicket.refundDesc')}
                </p>
            </div>
        </div>
    )
}
