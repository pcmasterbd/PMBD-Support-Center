'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PremiumRequestActionsProps {
    requestId: string
}

export function PremiumRequestActions({ requestId }: PremiumRequestActionsProps) {
    const [loading, setLoading] = useState<string | null>(null)
    const router = useRouter()

    const handleUpdate = async (status: 'APPROVED' | 'REJECTED') => {
        const adminNotes = window.prompt(`Enter notes for ${status.toLowerCase()}:`)

        setLoading(status)
        try {
            const response = await fetch(`/api/admin/premium/requests/${requestId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, adminNotes }),
            })

            if (!response.ok) throw new Error('Failed to update')

            alert(`Request ${status.toLowerCase()} successfully`)
            router.refresh()
        } catch (error) {
            alert('Error updating request')
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                className="text-red-600 border-red-100 hover:bg-red-50 gap-2 font-bold px-6"
                onClick={() => handleUpdate('REJECTED')}
                disabled={loading !== null}
            >
                {loading === 'REJECTED' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Deny
            </Button>
            <Button
                className="gap-2 bg-green-600 hover:bg-green-700 font-bold px-6"
                onClick={() => handleUpdate('APPROVED')}
                disabled={loading !== null}
            >
                {loading === 'APPROVED' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Approve
            </Button>
        </div>
    )
}
