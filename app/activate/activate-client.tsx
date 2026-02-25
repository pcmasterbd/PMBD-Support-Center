'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Key, Loader2, ShieldCheck, AlertCircle, QrCode, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { activateUserAccount } from '@/lib/actions/serial-actions'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

interface ActivationClientProps {
    initialPending: boolean;
    initialSerial?: string;
}

export function ActivationClient({ initialPending, initialSerial = '' }: ActivationClientProps) {
    const router = useRouter()
    const { data: session, update } = useSession()
    const [serial, setSerial] = useState(initialSerial)
    const [loading, setLoading] = useState(false)
    const [isPending, setIsPending] = useState(initialPending)
    const [error, setError] = useState('')

    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session?.user?.id) return

        setError('')
        setLoading(true)

        try {
            const result = await activateUserAccount(session.user.id, serial)

            if (result.success) {
                if (result.pending) {
                    setIsPending(true)
                    toast.info('আপনার অ্যাক্টিভেশন রিকোয়েস্ট পাঠানো হয়েছে। অ্যাডমিন অ্যাপ্রুভ করলে অ্যাকাউন্ট সচল হবে।')
                } else {
                    toast.success('অ্যাকাউন্ট সফলভাবে অ্যাক্টিভেট হয়েছে!')
                    await update() // Refresh session
                    router.push('/dashboard')
                    router.refresh()
                }
            } else {
                setError(result.error || 'অ্যাক্টিভেশন ব্যর্থ হয়েছে')
                toast.error(result.error)
            }
        } catch (err) {
            setError('সার্ভার সমস্যা হয়েছে')
            toast.error('কিছু ভুল হয়েছে')
        } finally {
            setLoading(false)
        }
    }

    if (isPending) {
        return (
            <div className="min-h-screen flex flex-col pt-16">
                <Navbar />
                <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5">
                    <Card className="w-full max-w-md p-8 border-2 shadow-2xl bg-card rounded-3xl text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-500/10 mb-2 ring-8 ring-amber-500/5">
                            <Clock className="w-12 h-12 text-amber-500 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tight">অ্যাপ্রুভাল পেন্ডিং</h1>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                আপনার অ্যাক্টিভেশন রিকোয়েস্টটি অ্যাডমিন রিভিউ এর জন্য পাঠানো হয়েছে। সাধারণত ১-২ ঘণ্টার মধ্যে অ্যাকাউন্ট অ্যাক্টিভেট হয়ে যায়।
                            </p>
                        </div>
                        {serial && (
                            <div className="p-4 bg-muted/50 rounded-2xl text-xs font-bold text-muted-foreground uppercase tracking-widest border">
                                Serial: {serial}
                            </div>
                        )}
                        <Button className="w-full h-12 rounded-xl font-bold" variant="outline" onClick={() => router.push('/')}>
                            হোম পেজে ফিরে যান
                        </Button>
                    </Card>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col pt-16">
            <Navbar />
            <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5">
                <Card className="w-full max-w-md p-6 sm:p-8 border-2 shadow-2xl bg-card/50 backdrop-blur-xl rounded-3xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full -ml-16 -mb-16 blur-3xl" />

                    <div className="text-center mb-8 relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 border border-primary/20 rotate-3">
                            <Key className="w-10 h-10 text-primary -rotate-3" />
                        </div>
                        <h1 className="text-3xl font-black mb-3 tracking-tight">অ্যাকাউন্ট অ্যাক্টিভেশন</h1>
                        <p className="text-muted-foreground font-medium">
                            পেনড্রাইভের সিরিয়াল নম্বর অথবা QR কোড স্ক্যান করে অ্যাক্টিভেট করুন
                        </p>
                    </div>

                    <form onSubmit={handleActivate} className="space-y-6 relative z-10">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="serial" className="text-sm font-bold ml-1 uppercase tracking-wider text-muted-foreground">সিরিয়াল নম্বর</Label>
                                <Input
                                    id="serial"
                                    placeholder="PCMBD-YYYY-XXXX-YYYY"
                                    value={serial}
                                    onChange={(e) => setSerial(e.target.value)}
                                    className="h-14 bg-background/50 border-2 focus:border-primary text-lg font-mono text-center tracking-widest uppercase rounded-2xl"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-dashed" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground font-bold tracking-widest">অথবা</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 border-2 border-dashed rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all font-bold"
                                onClick={() => toast.info('QR Scanner coming soon!')}
                            >
                                <QrCode className="w-5 h-5 text-primary" />
                                QR কোড স্ক্যান করুন
                            </Button>
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm flex items-center gap-3 border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ভেরিফাই হচ্ছে...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="mr-2 h-6 w-6" />
                                    অ্যাক্টিভেট রিকোয়েস্ট পাঠান
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border/50 text-center relative z-10">
                        <p className="text-sm text-muted-foreground font-medium">
                            পেনড্রাইভটি কি আপনার কাছে আছে? <button className="text-primary hover:underline font-bold" type="button">হেল্প গাইড দেখুন</button>
                        </p>
                    </div>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
