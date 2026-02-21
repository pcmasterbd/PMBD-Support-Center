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
import { useLanguage } from '@/lib/language-context'
import { LanguageToggle } from '@/components/language-toggle'
import { toast } from 'sonner'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const { t } = useLanguage()
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
                const errorMessage = result.error === "CredentialsSignin"
                    ? 'ইউজারনেম বা পাসওয়ার্ড ভুল'
                    : result.error;
                setError(errorMessage)
                toast.error(errorMessage)
                setLoading(false)
                return
            }

            toast.success('লগইন সফল হয়েছে!')
            router.push('/dashboard')
            router.refresh()
        } catch (err) {
            const errorMessage = 'লগইন করতে সমস্যা হয়েছে';
            setError(errorMessage)
            toast.error(errorMessage)
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md p-5 sm-std:p-6 md:p-8">
            <div className="flex justify-end mb-4">
                <LanguageToggle />
            </div>
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <LogIn className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">{t('login.title')}</h1>
                <p className="text-muted-foreground">
                    {t('login.subtitle')}
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
                    <span>ইমেইল সফলভাবে ভেরিফাই হয়েছে! এখন লগইন করুন</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="identifier">{t('login.email')}</Label>
                    <Input
                        id="identifier"
                        name="identifier"
                        type="text"
                        placeholder={t('login.emailPlaceholder')}
                        value={formData.identifier}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="password">{t('login.password')}</Label>
                    </div>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder={t('login.passwordPlaceholder')}
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
                            {t('login.loggingIn')}
                        </>
                    ) : (
                        <>
                            <LogIn className="mr-2 h-4 w-4" />
                            {t('login.loginButton')}
                        </>
                    )}
                </Button>
            </form>

            <div className="mt-8 pt-6 border-t text-center">
                <p className="text-sm text-muted-foreground mb-4 px-2">
                    {t('login.adminNote')}
                </p>
                <Link href="/" className="text-sm font-medium text-primary hover:underline">
                    {t('login.backToHome')}
                </Link>
            </div>
        </Card>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-3 sm-std:px-4 py-8 sm-std:py-12 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5">
            <Suspense fallback={
                <Card className="w-full max-w-md p-5 sm-std:p-6 md:p-8 flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </Card>
            }>
                <LoginForm />
            </Suspense>
        </div>
    )
}
