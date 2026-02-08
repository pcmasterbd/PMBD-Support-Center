'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Settings2, Loader2 } from 'lucide-react'
import { updateTicketStatus } from '@/lib/actions/ticket-actions'

export function TicketStatusSwitcher({ ticketId, currentStatus }: { ticketId: string, currentStatus: string }) {
    const [isPending, startTransition] = useTransition()

    const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

    const handleStatusChange = (newStatus: string) => {
        if (newStatus === currentStatus) return
        startTransition(async () => {
            try {
                await updateTicketStatus(ticketId, newStatus)
            } catch (err) {
                alert('Failed to update status')
            }
        })
    }

    return (
        <div className="flex items-center gap-2">
            <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isPending}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-bold uppercase focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
            >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {isPending && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
        </div>
    )
}
