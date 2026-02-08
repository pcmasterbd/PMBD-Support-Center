'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Loader2, Zap } from 'lucide-react'
import { addQuickReply, deleteQuickReply } from '@/lib/actions/quick-reply-actions'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

interface QuickReply {
    id: string
    category: string
    message: string
}

interface QuickReplyManagerProps {
    quickReplies: QuickReply[]
}

export function QuickReplyManager({ quickReplies }: QuickReplyManagerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [category, setCategory] = useState('')
    const [message, setMessage] = useState('')
    const [isPending, startTransition] = useTransition()

    const handleAdd = () => {
        if (!category.trim() || !message.trim()) return

        startTransition(async () => {
            await addQuickReply(category, message)
            setCategory('')
            setMessage('')
            setIsOpen(false)
        })
    }

    const handleDelete = (id: string) => {
        startTransition(async () => {
            await deleteQuickReply(id)
        })
    }

    const categories = Array.from(new Set(quickReplies.map(r => r.category)))

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Zap className="w-4 h-4" />
                    Manage Quick Replies
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        Quick Reply Templates Management
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-8 py-4">
                    {/* Add New Reply */}
                    <Card className="p-6 border-dashed border-2 shadow-sm bg-muted/20">
                        <h4 className="font-bold text-sm mb-5 flex items-center gap-2 text-primary">
                            <Plus className="w-4 h-4" />
                            Add New Template
                        </h4>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label className="text-sm font-semibold text-muted-foreground">Category Name</Label>
                                <Input
                                    placeholder="e.g., BIOS/Boot, Serial/Key"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    disabled={isPending}
                                    className="bg-background"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-sm font-semibold text-muted-foreground">Reply Message</Label>
                                <Textarea
                                    placeholder="Type the full reply message here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    disabled={isPending}
                                    className="bg-background resize-none"
                                />
                            </div>
                            <Button
                                onClick={handleAdd}
                                disabled={isPending || !category.trim() || !message.trim()}
                                className="w-full mt-2"
                            >
                                {isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Plus className="w-4 h-4 mr-2" />
                                )}
                                Add to Library
                            </Button>
                        </div>
                    </Card>

                    {/* Existing Replies by Category */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h4 className="font-bold text-lg">Existing Templates</h4>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                {quickReplies.length} Total
                            </span>
                        </div>

                        {categories.map(cat => (
                            <div key={cat} className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                                        {cat}
                                    </h5>
                                    <div className="h-px bg-border flex-1" />
                                </div>

                                <div className="grid gap-3">
                                    {quickReplies
                                        .filter(r => r.category === cat)
                                        .map(reply => (
                                            <div key={reply.id} className="group flex items-start justify-between gap-4 p-4 border rounded-xl bg-card hover:shadow-md transition-all hover:border-primary/30">
                                                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                                    {reply.message}
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleDelete(reply.id)}
                                                    disabled={isPending}
                                                    title="Delete Template"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))}

                        {categories.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
                                <Zap className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                <p className="text-muted-foreground font-medium">No templates found</p>
                                <p className="text-xs text-muted-foreground mt-1">Start by adding your first quick reply template above.</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
