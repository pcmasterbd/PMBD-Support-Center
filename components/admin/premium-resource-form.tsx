'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createPremiumAccount, createLicenseKey } from '@/lib/actions/premium-actions'
import { useFormStatus } from 'react-dom'
import { Key, User } from 'lucide-react'

interface PremiumResourceFormProps {
    onSuccess: () => void
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full font-bold" disabled={pending}>
            {pending ? 'সেভ হচ্ছে...' : 'রিসোর্স যোগ করুন'}
        </Button>
    )
}

export function PremiumResourceForm({ onSuccess }: PremiumResourceFormProps) {
    const [error, setError] = useState<string | null>(null)
    const [resourceType, setResourceType] = useState<'ACCOUNT' | 'KEY'>('ACCOUNT')

    async function handleSubmit(formData: FormData) {
        try {
            if (resourceType === 'ACCOUNT') {
                await createPremiumAccount(formData)
            } else {
                await createLicenseKey(formData)
            }
            onSuccess()
        } catch (err: any) {
            setError(err.message || 'Error creating resource')
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-lg">
                <Button
                    type="button"
                    variant={resourceType === 'ACCOUNT' ? 'default' : 'ghost'}
                    onClick={() => setResourceType('ACCOUNT')}
                    className="w-full font-bold"
                >
                    <User className="w-4 h-4 mr-2" />
                    Premium Account
                </Button>
                <Button
                    type="button"
                    variant={resourceType === 'KEY' ? 'default' : 'ghost'}
                    onClick={() => setResourceType('KEY')}
                    className="w-full font-bold"
                >
                    <Key className="w-4 h-4 mr-2" />
                    License Key
                </Button>
            </div>

            <form action={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-bold">
                        {error}
                    </div>
                )}

                {resourceType === 'ACCOUNT' ? (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="serviceName">সার্ভিস নাম (Service Name)</Label>
                            <Input id="serviceName" name="serviceName" placeholder="e.g. Adobe Creative Cloud" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">অ্যাক্সেস টাইপ</Label>
                                <select
                                    id="type"
                                    name="type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="SHARED">SHARED</option>
                                    <option value="PRIVATE">PRIVATE</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxUsers">ম্যাক্স ইউজার</Label>
                                <Input id="maxUsers" name="maxUsers" type="number" defaultValue="1" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">ইউজারনেম / ইমেইল</Label>
                            <Input id="username" name="username" placeholder="example@gmail.com" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">পাসওয়ার্ড</Label>
                            <Input id="password" name="password" type="text" placeholder="********" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">নোটস (Notes)</Label>
                            <textarea
                                id="notes"
                                name="notes"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="অতিরিক্ত তথ্য..."
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="softwareName">সফ্টওয়্যার নাম (Software Name)</Label>
                            <Input id="softwareName" name="softwareName" placeholder="e.g. Windows 11 Pro" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="key">লাইসেন্স কী (License Key)</Label>
                            <Input id="key" name="key" placeholder="XXXX-XXXX-XXXX-XXXX" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">স্ট্যাটাস</Label>
                            <select
                                id="status"
                                name="status"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                            >
                                <option value="AVAILABLE">AVAILABLE</option>
                                <option value="ASSIGNED">ASSIGNED</option>
                            </select>
                        </div>
                    </>
                )}

                <div className="pt-4">
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
}
