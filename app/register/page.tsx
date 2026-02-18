'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, ArrowRight, Loader2, Mail, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const [step, setStep] = useState(1) // 1: Form, 2: Verification Message
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        serialNumber: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('পাসওয়ার্ড মিলছে না')
            return
        }

        if (formData.password.length < 8) {
            setError('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে')
                setLoading(false)
                return
            }

            setStep(2) // Move to email verification instruction step
            setLoading(false)
        } catch (err) {
            setError('সার্ভার সমস্যা হয়েছে')
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setLoading(true)
        try {
            const { resendVerificationEmail } = await import('@/lib/actions/auth-actions')
            const result = await resendVerificationEmail(formData.email)

            if (result.error) {
                alert(result.error)
            } else {
                alert('ইমেইল পাঠানো হয়েছে! চেক করুন। (স্প্যাম ফোল্ডার চেক করতে ভুলবেন না)')
            }
        } catch (error) {
            alert('Something went wrong!')
        } finally {
            setLoading(false)
        }
    }

    if (step === 2) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5">
                <Card className="w-full max-w-[400px] p-4 sm-std:p-6 md:p-8 text-center shadow-md mx-4 sm:mx-0">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
                        <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl sm-std:text-3xl font-bold mb-4">ইমেইল ভেরিফাই করুন</h1>
                    <p className="text-muted-foreground mb-8">
                        আমরা আপনার ইমেইল ঠিকানায় (<strong>{formData.email}</strong>) একটি ভেরিফিকেশন লিঙ্ক পাঠিয়েছি। অনুগ্রহ করে আপনার ইনবক্স চেক করুন এবং আপনার অ্যাকাউন্টটি সক্রিয় করুন।
                    </p>
                    <div className="space-y-4">
                        <Button variant="outline" className="w-full" onClick={() => setStep(1)} disabled={loading}>
                            তথ্য পরিবর্তন করুন
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            ইমেইল পাননি?
                            <button
                                onClick={handleResend}
                                disabled={loading}
                                className="text-primary hover:underline font-medium ml-1 disabled:opacity-50"
                            >
                                {loading ? 'পাঠানো হচ্ছে...' : 'রিসেন্ড করুন'}
                            </button>
                        </p>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-3 sm-std:px-4 py-8 sm-std:py-12 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5">
            <Card className="w-full max-w-xl p-4 sm-std:p-6 md:p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl sm-std:text-3xl font-bold mb-2">রেজিস্ট্রেশন করুন</h1>
                    <p className="text-muted-foreground">
                        পেনড্রাইভের সিরিয়াল নম্বর দিয়ে রেজিস্ট্রেশন সম্পন্ন করুন
                    </p>
                </div>

                <div className="flex justify-between mb-8 px-0 sm-std:px-4">
                    <div className="flex flex-col items-center gap-1 sm-std:gap-2">
                        <div className="w-6 h-6 sm-std:w-8 sm-std:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] sm-std:text-sm font-bold">1</div>
                        <span className="text-[10px] sm-std:text-xs font-medium">তথ্য প্রদান</span>
                    </div>
                    <div className="flex-1 h-px bg-border mt-3 sm-std:mt-4 mx-1 sm-std:mx-2" />
                    <div className="flex flex-col items-center gap-1 sm-std:gap-2">
                        <div className="w-6 h-6 sm-std:w-8 sm-std:h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] sm-std:text-sm font-bold">2</div>
                        <span className="text-[10px] sm-std:text-xs font-medium text-muted-foreground">সিরিয়াল যাচাই</span>
                    </div>
                    <div className="flex-1 h-px bg-border mt-3 sm-std:mt-4 mx-1 sm-std:mx-2" />
                    <div className="flex flex-col items-center gap-1 sm-std:gap-2">
                        <div className="w-6 h-6 sm-std:w-8 sm-std:h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] sm-std:text-sm font-bold">3</div>
                        <span className="text-[10px] sm-std:text-xs font-medium text-muted-foreground">ইমেইল ভেরিফাই</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm-tab:grid-cols-2 gap-4 sm-std:gap-6">
                    <div className="space-y-4 col-span-1">
                        <div className="space-y-2">
                            <Label htmlFor="name">পূর্ণ নাম</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Karim Ahmed"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">ইমেইল</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="example@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">মোবাইল নম্বর</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="01712345678"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 col-span-1">
                        <div className="space-y-2">
                            <Label htmlFor="serialNumber">সিরিয়াল নম্বর</Label>
                            <Input
                                id="serialNumber"
                                name="serialNumber"
                                type="text"
                                placeholder="PCMBD-2024-XXXX-XXXX"
                                value={formData.serialNumber}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="font-mono"
                            />
                            <p className="text-[10px] text-muted-foreground">
                                ফরম্যাট: PCMBD-YYYY-XXXX-XXXX
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">পাসওয়ার্ড</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm col-span-1 sm-tab:col-span-2">
                            {error}
                        </div>
                    )}

                    <div className="col-span-1 sm-tab:col-span-2 pt-4">
                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    প্রসেসিং হচ্ছে...
                                </>
                            ) : (
                                <>
                                    রেজিস্ট্রেশন এবং যাচাই সম্পন্ন করুন
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm border-t pt-6">
                    <span className="text-muted-foreground">ইতিমধ্যে একাউন্ট আছে? </span>
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        লগইন করুন
                    </Link>
                </div>
            </Card>
        </div>
    )
}
