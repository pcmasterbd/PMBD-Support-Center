'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Loader2 } from 'lucide-react'
import { updateTicketPriority } from '@/lib/actions/ticket-actions'

export function TicketPriorityToggle({ ticketId, currentPriority }: { ticketId: string, currentPriority: string }) {
    const [isPending, startTransition] = useTransition()

    const handleToggle = () => {
        const newPriority = currentPriority === 'URGENT' ? 'MEDIUM' : 'URGENT'
        startTransition(async () => {
            try {
                await updateTicketPriority(ticketId, newPriority)
            } catch (err) {
                alert('Failed to update priority')
            }
        })
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className={`gap-2 ${currentPriority === 'URGENT' ? 'text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700' : ''}`}
            onClick={handleToggle}
            disabled={isPending}
        >
            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <AlertCircle className="w-4 h-4" />
            )}
            {currentPriority === 'URGENT' ? 'Urgent Priority' : 'Mark as Urgent'}
        </Button>
    )
}
