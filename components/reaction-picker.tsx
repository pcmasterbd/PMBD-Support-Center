'use client'

import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Smile } from 'lucide-react'
import { cn } from '@/lib/utils'

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏']

interface ReactionPickerProps {
    onSelect: (emoji: string) => void
    isLoading?: boolean
    className?: string
}

export function ReactionPicker({ onSelect, isLoading, className }: ReactionPickerProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity", className)}
                    disabled={isLoading}
                >
                    <Smile className="h-4 w-4 text-muted-foreground" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1 rounded-full shadow-lg border bg-background" align="start" side="top">
                <div className="flex gap-1">
                    {EMOJIS.map((emoji) => (
                        <button
                            key={emoji}
                            onClick={() => {
                                onSelect(emoji)
                                setOpen(false)
                            }}
                            className="p-2 hover:bg-muted rounded-full transition-transform hover:scale-125 active:scale-90 text-xl"
                            disabled={isLoading}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
