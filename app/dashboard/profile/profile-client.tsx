'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Shield,
    User,
    Mail,
    Lock,
    Phone,
    Edit2,
    Save,
    X,
    Calendar,
    BadgeCheck,
    ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'
import { updateProfile } from '@/lib/actions/user-actions'

interface UserData {
    id: string
    name?: string | null
    email?: string | null
    phone?: string | null
    emailVerified?: string | null
    avatarUrl?: string | null
    createdAt: string
    serialNumber?: {
        code: string
        assignedAt?: string | null
    } | null
}

export function ProfileClient({ user }: { user: UserData | null }) {
    const { t, language } = useLanguage()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        avatarUrl: user?.avatarUrl || null as string | null
    })

    const locale = language === 'bn' ? 'bn-BD' : 'en-US'
    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'

    const handleSave = async () => {
        if (!user) return
        setLoading(true)
        try {
            await updateProfile(user.id, {
                name: formData.name,
                phone: formData.phone,
                avatarUrl: formData.avatarUrl
            })
            toast.success(t('profilePage.updateSuccess'))
            setIsEditing(false)
        } catch (error) {
            toast.error(t('profilePage.updateError'))
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error(t('profilePage.invalidFileType'))
            return
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error(t('profilePage.imageTooLarge'))
            return
        }

        setUploading(true)
        const reader = new FileReader()
        reader.onloadend = async () => {
            const base64String = reader.result as string
            setFormData(prev => ({ ...prev, avatarUrl: base64String }))

            // Auto-save the image update
            if (user) {
                try {
                    await updateProfile(user.id, {
                        ...formData,
                        avatarUrl: base64String
                    })
                    toast.success(t('profilePage.updateSuccess'))
                } catch (error) {
                    toast.error(t('profilePage.updateError'))
                }
            }
            setUploading(false)
        }
        reader.readAsDataURL(file)
    }

    const handleRemoveImage = async () => {
        if (!user) return
        setUploading(true)
        try {
            setFormData(prev => ({ ...prev, avatarUrl: null }))
            await updateProfile(user.id, {
                ...formData,
                avatarUrl: null
            })
            toast.success(t('profilePage.updateSuccess'))
        } catch (error) {
            toast.error(t('profilePage.updateError'))
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-8 max-w-5xl pb-10">
            {/* Header / Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-blue-600 p-8 sm:p-12 text-white shadow-2xl shadow-primary/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                        />
                        <div
                            className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-4xl sm:text-5xl font-black shadow-xl overflow-hidden cursor-pointer hover:bg-white/30 transition-all ${uploading ? 'animate-pulse' : ''}`}
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                        >
                            {formData.avatarUrl ? (
                                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : initials}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
                                <Edit2 className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 p-1.5 bg-green-500 rounded-lg border-4 border-white shadow-lg">
                            <BadgeCheck className="w-4 h-4 text-white" />
                        </div>
                        {formData.avatarUrl && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage();
                                }}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full border-2 border-white shadow-md hover:bg-red-600 transition-colors"
                                title={t('profilePage.removePhoto')}
                            >
                                <X className="w-3 h-3 text-white" />
                            </button>
                        )}
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{user?.name || "User"}</h2>
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-white/80 font-medium text-sm">
                            <span className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {user?.email}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {t('profilePage.memberSince')}: {user ? new Date(user.createdAt).toLocaleDateString(locale, { month: 'long', year: 'numeric' }) : ""}
                            </span>
                        </div>
                    </div>

                    <div className="md:ml-auto">
                        {!isEditing ? (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-11 px-6 shadow-lg active:scale-95 transition-all"
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                {t('profilePage.editProfile')}
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setIsEditing(false)}
                                    variant="outline"
                                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-bold rounded-xl h-11 px-6"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    {t('profilePage.cancel')}
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-11 px-6 shadow-lg active:scale-95 transition-all"
                                >
                                    {loading ? <Save className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    {t('profilePage.saveChanges')}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Basic Info Card */}
                <Card className="md:col-span-2 p-6 sm:p-8 rounded-3xl border-2 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <User className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-black text-xl">{t('profilePage.generalInfo')}</h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('profilePage.fullName')}</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!isEditing || loading}
                                    className="pl-10 h-12 bg-muted/50 border-none focus-visible:ring-primary rounded-xl font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('profilePage.phoneNumber')}</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!isEditing || loading}
                                    className="pl-10 h-12 bg-muted/50 border-none focus-visible:ring-primary rounded-xl font-medium"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2 space-y-2.5">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('profilePage.emailAddress')}</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input value={user?.email || ""} disabled className="pl-10 h-12 bg-muted/30 border-none rounded-xl font-medium opacity-70" />
                                {user?.emailVerified && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-green-500/10 rounded-full">
                                        <Shield className="w-3.5 h-3.5 text-green-500" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Product Status Widget */}
                <Card className="p-6 sm:p-8 rounded-3xl border-2 shadow-sm bg-gradient-to-br from-blue-500/5 to-primary/5 border-primary/10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-blue-500/10 rounded-xl">
                            <Shield className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="font-black text-xl">{t('profilePage.productInfo')}</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 bg-background rounded-2xl border-2 border-dashed border-primary/20">
                            <p className="text-[10px] font-black uppercase text-primary mb-1">{t('profilePage.serialNumber')}</p>
                            <code className="text-base font-black tracking-wider block">{user?.serialNumber?.code || "-"}</code>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-medium">{t('profilePage.activationDate')}</span>
                            <span className="font-bold">{user?.serialNumber?.assignedAt ? new Date(user.serialNumber.assignedAt).toLocaleDateString(locale) : t('profilePage.unknown')}</span>
                        </div>

                        <div className="pt-2">
                            <div className="bg-green-500/10 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-xs font-black flex items-center justify-between">
                                {t('profilePage.licenseStatus')}
                                <BadgeCheck className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Security Card */}
                <Card className="md:col-span-3 p-6 sm:p-8 rounded-3xl border-2 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-red-500/10 rounded-xl">
                            <Lock className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-black text-xl">{t('profilePage.security')}</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                {t('profilePage.securityDesc')}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => toast.info('Feature coming soon!')}
                                    className="rounded-xl font-bold h-11 px-6 border-2"
                                >
                                    {t('profilePage.resetPassword')}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => toast.info('Feature coming soon!')}
                                    className="rounded-xl font-bold h-11 px-6 border-2"
                                >
                                    {t('profilePage.twoFactor')}
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-5 rounded-2xl bg-muted/30 border-2">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-background rounded-xl border-2 shadow-sm">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-black text-sm">{t('profilePage.emailVerification')}</p>
                                    <p className="text-xs text-muted-foreground font-bold">{user?.emailVerified ? t('profilePage.verified') : t('profilePage.pending')}</p>
                                </div>
                            </div>
                            {user?.emailVerified ? (
                                <div className="p-1 px-3 bg-green-500/10 text-green-600 rounded-lg text-[10px] font-black uppercase">
                                    Confirmed
                                </div>
                            ) : (
                                <Button
                                    variant="link"
                                    onClick={() => toast.info('Verification email sent!')}
                                    className="text-primary font-black text-xs hover:no-underline flex items-center gap-1 group"
                                >
                                    {t('profilePage.verify')}
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
