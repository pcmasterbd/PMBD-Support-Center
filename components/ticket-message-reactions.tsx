'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ReactionPicker } from '@/components/reaction-picker'
import { MessageReactions } from '@/components/message-reactions'
import { toast } from 'sonner'

interface Reaction {
    emoji: string
    userId: string
    user: {
        name: string
    }
}

interface TicketMessageReactionsProps {
    ticketId: string
    messageId: string
    initialReactions: Reaction[]
    currentUserId: string
}

export function TicketMessageReactions({
    ticketId,
    messageId,
    initialReactions,
    currentUserId
}: TicketMessageReactionsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleReact = async (emoji: string) => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/support/tickets/${ticketId}/messages/${messageId}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emoji })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to react')
            }

            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative group/react flex flex-col">
            <div className="absolute -top-4 right-0 z-10">
                <ReactionPicker
                    onSelect={handleReact}
                    isLoading={isLoading}
                />
            </div>
            <MessageReactions
                reactions={initialReactions.map(r => ({
                    emoji: r.emoji,
                    userId: r.userId,
                    userName: r.user.name
                }))}
                currentUserId={currentUserId}
                onEmojiClick={handleReact}
                isLoading={isLoading}
            />
        </div>
    )
}
