'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { History, Trash2, RotateCcw } from 'lucide-react'
import { deleteSerial, revokeSerial } from '@/lib/actions/serial-actions'

export function SerialActionButtons({ serial }: { serial: any }) {
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this serial number?')) return
        setLoading(true)
        try {
            await deleteSerial(serial.id)
        } catch (err) {
            alert('Failed to delete serial')
        } finally {
            setLoading(false)
        }
    }

    async function handleRevoke() {
        if (!confirm('Are you sure you want to revoke this serial? The user will lose access to premium content until they activate a new serial.')) return
        setLoading(true)
        try {
            await revokeSerial(serial.id)
        } catch (err) {
            alert('Failed to revoke serial')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-end gap-1">
            {serial.status === 'ASSIGNED' && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    onClick={handleRevoke}
                    title="Revoke (Available again)"
                    disabled={loading}
                >
                    <RotateCcw className="w-4 h-4" />
                </Button>
            )}

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-primary"
                title="History"
            >
                <History className="w-4 h-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleDelete}
                disabled={loading}
                title="Delete"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    )
}
