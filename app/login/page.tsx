'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    })

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 5000)
        }
        if (searchParams.get('verified') === 'true') {
            setIsVerified(true)
            setTimeout(() => setIsVerified(false), 5000)
        }
    }, [searchParams])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                identifier: formData.identifier,
                password: formData.password,
                redirect: false,
            })

            if (result?.error) {
                if (result.error === "CredentialsSignin") {
                    setError('ইউজারনেম বা পাসওয়ার্ড ভুল')
                } else {
                    setError(result.error)
                }
                setLoading(false)
                return
            }

            router.push('/dashboard')
            router.refresh()
        } catch (err) {
            setError('লগইন করতে সমস্যা হয়েছে')
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md p-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <LogIn className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">লগইন করুন</h1>
                <p className="text-muted-foreground">
                    ইমেইল, ফোন অথবা সিরিয়াল নম্বর দিয়ে লগইন করুন
                </p>
            </div>

            {showSuccess && (
                <div className="mb-6 p-4 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>রেজিস্ট্রেশন সফল! ইমেইল ভেরিফাই করে লগইন করুন</span>
                </div>
            )}

            {isVerified && (
                <div className="mb-6 p-4 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>ইমেইল সফলভাবে ভেরিফাই হয়েছে! এখন লগইন করুন</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="identifier">ইমেইল / ফোন / সিরিয়াল</Label>
                    <Input
                        id="identifier"
                        name="identifier"
                        type="text"
                        placeholder="Email, Phone or Serial"
                        value={formData.identifier}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="password">পাসওয়ার্ড</Label>
                        <Link href="/auth/forgot-password" title="যাচাই করুন" className="text-xs text-primary hover:underline">
                            পাসওয়ার্ড ভুলে গেছেন?
                        </Link>
                    </div>
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

                {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            লগইন হচ্ছে...
                        </>
                    ) : (
                        <>
                            <LogIn className="mr-2 h-4 w-4" />
                            লগইন করুন
                        </>
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">নতুন ব্যবহারকারী? </span>
                <Link href="/register" className="text-primary hover:underline font-medium">
                    রেজিস্ট্রেশন করুন
                </Link>
            </div>

            <div className="mt-4 text-center">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                    হোম পেজে ফিরে যান
                </Link>
            </div>
        </Card>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5">
            <Suspense fallback={
                <Card className="w-full max-w-md p-8 flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </Card>
            }>
                <LoginForm />
            </Suspense>
        </div>
    )
}
