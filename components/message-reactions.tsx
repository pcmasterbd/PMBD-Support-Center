'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface Reaction {
    emoji: string
    userId: string
    userName?: string
}

interface MessageReactionsProps {
    reactions: Reaction[]
    currentUserId: string
    onEmojiClick: (emoji: string) => void
    isLoading?: boolean
}

export function MessageReactions({ reactions, currentUserId, onEmojiClick, isLoading }: MessageReactionsProps) {
    if (reactions.length === 0) return null

    // Group reactions by emoji
    const groupedReactions = reactions.reduce((acc, react) => {
        if (!acc[react.emoji]) acc[react.emoji] = []
        acc[react.emoji].push(react)
        return acc
    }, {} as Record<string, Reaction[]>)

    return (
        <div className="flex flex-wrap gap-1 mt-1 px-2">
            {Object.entries(groupedReactions).map(([emoji, reacts]) => {
                const hasReacted = reacts.some(r => r.userId === currentUserId)

                return (
                    <button
                        key={emoji}
                        onClick={() => onEmojiClick(emoji)}
                        disabled={isLoading}
                        className={cn(
                            "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-all border",
                            hasReacted
                                ? "bg-primary/10 border-primary/30 text-primary"
                                : "bg-muted border-transparent text-muted-foreground hover:bg-muted/80"
                        )}
                        title={reacts.map(r => r.userName || 'User').join(', ')}
                    >
                        <span>{emoji}</span>
                        {reacts.length > 1 && <span className="font-semibold">{reacts.length}</span>}
                    </button>
                )
            })}
        </div>
    )
}
