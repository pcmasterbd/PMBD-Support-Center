'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { requestPremiumResource } from '@/lib/actions/premium-actions'

interface PremiumRequestButtonProps {
    resourceId: string
    resourceType: 'PREMIUM_ACCOUNT' | 'LICENSE_KEY'
    resourceName: string
    isPending?: boolean
}

export function PremiumRequestButton({ resourceId, resourceType, resourceName, isPending = false }: PremiumRequestButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleRequest = async () => {
        if (isPending) return
        setLoading(true)
        try {
            await requestPremiumResource(resourceId, resourceType, resourceName)
            // If toast isn't available, I'll use a more generic way to show success
            alert('আপনার আবেদনটি সফলভাবে জমা দেওয়া হয়েছে।')
        } catch (err: any) {
            alert(err.message || 'আবেদন করতে সমস্যা হয়েছে')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleRequest}
            disabled={loading || isPending}
            className="w-full gap-2 font-bold"
            variant={isPending ? "secondary" : "default"}
        >
            {loading ? 'প্রসেসিং...' : isPending ? 'আবেদন করা হয়েছে' : 'অ্যাক্সেস রিকোয়েস্ট করুন'}
        </Button>
    )
}
