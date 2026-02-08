'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { AlertCircle, Save, Edit2, X, Loader2 } from 'lucide-react'
import { updateUserAdminNotes } from '@/lib/actions/user-profile-actions'

interface ManagementNotesProps {
    userId: string
    initialNotes: string | null
}

export function ManagementNotes({ userId, initialNotes }: ManagementNotesProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [notes, setNotes] = useState(initialNotes || '')
    const [isPending, startTransition] = useTransition()

    const handleSave = () => {
        startTransition(async () => {
            try {
                await updateUserAdminNotes(userId, notes)
                setIsEditing(false)
            } catch (err) {
                alert('পাসওয়ার্ড সেভ করা যায়নি')
            }
        })
    }

    if (!isEditing) {
        return (
            <Card className="p-6 bg-red-50/50 border-red-100">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Management Notes
                    </h4>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="text-red-600 h-8 gap-2 hover:bg-red-100/50"
                    >
                        <Edit2 className="w-3 h-3" />
                        Edit Notes
                    </Button>
                </div>
                {notes ? (
                    <p className="text-xs text-muted-foreground leading-relaxed italic whitespace-pre-wrap">
                        "{notes}"
                    </p>
                ) : (
                    <p className="text-xs text-muted-foreground italic">কোনো নোট নেই...</p>
                )}
            </Card>
        )
    }

    return (
        <Card className="p-6 border-red-200 shadow-lg">
            <h4 className="font-bold text-sm text-red-600 mb-4">Edit Management Notes</h4>
            <div className="space-y-4">
                <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ইউজার সম্পর্কে নোট লিখুন..."
                    className="min-h-[120px] text-xs resize-none"
                    disabled={isPending}
                />
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setNotes(initialNotes || '')
                            setIsEditing(false)
                        }}
                        disabled={isPending}
                        className="h-8"
                    >
                        <X className="w-3 h-3 mr-1" /> Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isPending}
                        className="h-8 bg-red-600 hover:bg-red-700 h-8 min-w-[80px]"
                    >
                        {isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <>
                                <Save className="w-3 h-3 mr-1" /> Save Notes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
