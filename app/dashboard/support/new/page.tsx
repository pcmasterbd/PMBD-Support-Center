'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Loader2, Send, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function NewTicketPage() {
    const router = useRouter()
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
            setError('দয়া করে সমস্যার বিস্তারিত অন্তত ১০ অক্ষরে বর্ণনা করুন')
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
                setError(data.error || 'টিকেট তৈরি করতে সমস্যা হয়েছে')
                setLoading(false)
                return
            }

            router.push(`/dashboard/support/${data.ticketId}`)
        } catch (err) {
            setError('সার্ভার সমস্যা হয়েছে। আবার চেষ্টা করুন।')
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
                    <h2 className="text-2xl font-bold tracking-tight">নতুন সাপোর্ট টিকেট</h2>
                    <p className="text-sm text-muted-foreground">আপনার সমস্যাটি বিস্তারিতভাবে এখানে লিখুন</p>
                </div>
            </div>

            <Card className="p-4 sm-std:p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="subject"> টিকেটের বিষয়বস্তু (Subject)</Label>
                            <Input
                                id="subject"
                                placeholder="যেমন: পেনড্রাইভ কানেক্ট হচ্ছে না"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priority">গুরুত্ব (Priority)</Label>
                            <Select
                                disabled={loading}
                                value={formData.priority}
                                onValueChange={(val) => setFormData({ ...formData, priority: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Priority সিলেক্ট করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">Low (সাধারণ সমস্যা)</SelectItem>
                                    <SelectItem value="MEDIUM">Medium (জরুরী)</SelectItem>
                                    <SelectItem value="HIGH">High (খুবই জরুরী)</SelectItem>
                                    <SelectItem value="URGENT">Urgent (তাতক্ষনিক সমাধান প্রয়োজন)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">বিস্তারিত বর্ণনা করুন</Label>
                        <Textarea
                            id="message"
                            placeholder="আপনার সমস্যার বিস্তারিত এখানে লিখুন। আপনি আপনার অর্ডারের তথ্য বা আগের কোনো টিকেটের রেফারেন্স দিতে পারেন।"
                            rows={8}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                            disabled={loading}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">কমপক্ষে ১০টি অক্ষর লিখুন।</p>
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
                                    প্রসেসিং...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    টিকেট সাবমিট
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/20 space-y-4">
                <h4 className="font-bold flex items-center gap-2 text-primary">
                    <AlertCircle className="w-5 h-5" />
                    টাকা রিফান্ড বা প্রোডাক্ট রিটার্ন পলিসি
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    সফটওয়্যার বা লাইসেন্স সংক্রান্ত সমস্যার ক্ষেত্রে আমরা আমাদের সাপোর্ট পলিসি অনুযায়ী সমাধান দিয়ে থাকি। যদি হার্ডওয়্যার (পেনড্রাইভ) এবং ওয়ারেন্টি সংক্রান্ত কোনো ইস্যু থাকে তবে দয়া করে আপনার পেনড্রাইভের সিরিয়াল নম্বর টিকেটের শুরুতে উল্লেখ করুন।
                </p>
            </div>
        </div>
    )
}
