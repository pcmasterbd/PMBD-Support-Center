'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function BulkGenerateButton() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleBulkGenerate = async () => {
        const count = window.prompt('How many serial numbers do you want to generate? (Max 100)', '10')

        if (!count) return

        const countNum = parseInt(count)
        if (isNaN(countNum) || countNum <= 0 || countNum > 100) {
            alert('Please enter a valid number between 1 and 100')
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/admin/serials/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ count: countNum, batch: 'BULK-GEN' }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate')
            }

            alert(`${data.count} serial numbers generated!`)
            router.refresh()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            className="gap-2"
            onClick={handleBulkGenerate}
            disabled={loading}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Plus className="w-4 h-4" />
            )}
            Generate Bulk
        </Button>
    )
}
