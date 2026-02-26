'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Ticket,
    Clock,
    AlertCircle,
    CheckCircle2,
    MessageSquare,
    User,
    Filter,
    Search,
    AlertTriangle,
    ChevronRight,
    MoreHorizontal
} from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { bulkReplyToTickets } from '@/lib/actions/ticket-actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface TicketListProps {
    tickets: any[]
}

export function TicketList({ tickets }: TicketListProps) {
    const [selectedTickets, setSelectedTickets] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [bulkReplyOpen, setBulkReplyOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const filteredTickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.includes(searchTerm)
    )

    const toggleSelectAll = () => {
        if (selectedTickets.length === filteredTickets.length) {
            setSelectedTickets([])
        } else {
            setSelectedTickets(filteredTickets.map(t => t.id))
        }
    }

    const toggleSelectTicket = (id: string) => {
        if (selectedTickets.includes(id)) {
            setSelectedTickets(selectedTickets.filter(tid => tid !== id))
        } else {
            setSelectedTickets([...selectedTickets, id])
        }
    }

    const handleBulkReply = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)
        const message = formData.get('message') as string
        const status = formData.get('status') as string

        if (!message) {
            toast.error('Please enter a message')
            setIsSubmitting(false)
            return
        }

        const result = await bulkReplyToTickets(selectedTickets, message, status === 'NO_CHANGE' ? undefined : status)

        if (result.success) {
            toast.success(`Replied to ${selectedTickets.length} tickets`)
            setBulkReplyOpen(false)
            setSelectedTickets([])
            router.refresh()
        } else {
            toast.error(result.error || 'Failed to send replies')
        }
        setIsSubmitting(false)
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                <div className="space-y-1">
                    <h3 className="font-black text-xl sm:text-2xl tracking-tighter">সকল টিকেট লিস্ট ({filteredTickets.length})</h3>
                    <div className="h-1 w-12 bg-primary/20 rounded-full" />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="টিকেট সার্চ করুন..."
                            className="pl-11 h-12 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedTickets.length > 0 && (
                <div className="bg-primary/5 border-2 border-primary/20 p-3 sm:p-5 rounded-[2rem] flex items-center justify-between animate-in slide-in-from-top-2 duration-300 shadow-lg shadow-primary/5">
                    <div className="flex items-center gap-3 ml-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="font-black text-primary text-sm sm:text-lg tracking-tight">{selectedTickets.length} Selected</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Dialog open={bulkReplyOpen} onOpenChange={setBulkReplyOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="gap-2 h-11 px-6 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                    <MessageSquare className="w-5 h-5" />
                                    <span className="hidden xs:inline text-sm">Bulk Reply</span>
                                    <span className="xs:hidden text-sm">Reply</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px] rounded-[2.5rem] p-8 border-none shadow-2xl">
                                <form onSubmit={handleBulkReply}>
                                    <DialogHeader className="mb-6">
                                        <DialogTitle className="text-3xl font-black tracking-tighter">Bulk Reply</DialogTitle>
                                        <DialogDescription className="text-sm font-medium opacity-70">
                                            Send a message to {selectedTickets.length} selected tickets.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-6 py-4">
                                        <div className="grid gap-3">
                                            <Label htmlFor="message" className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Message</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Type your reply here..."
                                                className="min-h-[140px] rounded-3xl border-2 bg-muted/20 focus:bg-background transition-all p-4 resize-none"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="status" className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Update Status</Label>
                                            <Select name="status" defaultValue="NO_CHANGE">
                                                <SelectTrigger className="h-12 rounded-2xl border-2 bg-muted/20 focus:bg-background transition-all">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl">
                                                    <SelectItem value="NO_CHANGE">No Change</SelectItem>
                                                    <SelectItem value="OPEN">Open</SelectItem>
                                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                                                    <SelectItem value="CLOSED">Closed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter className="mt-8">
                                        <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20" disabled={isSubmitting}>
                                            {isSubmitting ? 'Sending...' : 'Send Replies'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button variant="ghost" className="h-11 rounded-2xl font-black text-muted-foreground hover:bg-muted/50 transition-colors px-4" onClick={() => setSelectedTickets([])}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                <div className="flex items-center gap-4 px-6 py-2">
                    <Checkbox
                        id="select-all-tickets"
                        className="rounded-lg w-5 h-5 border-2"
                        checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                        onCheckedChange={toggleSelectAll}
                    />
                    <label htmlFor="select-all-tickets" className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground cursor-pointer select-none">
                        Select All Tickets
                    </label>
                </div>

                {filteredTickets.map((ticket: any) => (
                    <div key={ticket.id} className="relative group/container">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                            <Checkbox
                                className="rounded-lg w-5 h-5 border-2 shadow-sm"
                                checked={selectedTickets.includes(ticket.id)}
                                onCheckedChange={() => toggleSelectTicket(ticket.id)}
                            />
                        </div>
                        <Link href={`/dashboard/admin/support/${ticket.id}`} className="block pl-12 xs:pl-14">
                            <Card className={`group relative p-4 sm:p-5 transition-all duration-300 border-2 rounded-3xl overflow-hidden ${selectedTickets.includes(ticket.id)
                                    ? 'border-primary bg-primary/[0.02] shadow-xl shadow-primary/5'
                                    : 'border-muted/40 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 bg-background'
                                }`}>
                                <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-primary/[0.03] to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0 space-y-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase border-2 tracking-tighter ${ticket.status === 'OPEN' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                                    ticket.status === 'IN_PROGRESS' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                                                        'bg-green-500/10 text-green-600 border-green-500/20'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                            {ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? (
                                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 text-red-600 px-2 py-0.5 bg-red-500/10 rounded-full border border-red-500/20">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {ticket.priority}
                                                </span>
                                            ) : (
                                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tighter text-muted-foreground/60 px-2 py-0.5 bg-muted/50 rounded-full border border-muted/20">
                                                    {ticket.priority}
                                                </span>
                                            )}
                                            <span className="text-[10px] text-muted-foreground/40 font-mono tracking-tight ml-auto sm:ml-0">#{ticket.id.slice(-6).toUpperCase()}</span>
                                        </div>

                                        <h4 className="font-black text-sm sm:text-lg group-hover:text-primary transition-colors leading-tight tracking-tight truncate">{ticket.subject}</h4>

                                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <User className="w-3 h-3" />
                                                </div>
                                                <span className="text-xs font-black tracking-tight">{ticket.user.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-60">
                                                <MessageSquare className="w-4 h-4 text-primary" />
                                                <span className="text-xs font-bold">{ticket._count?.messages || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-60 ml-auto sm:ml-0">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-xs font-bold">
                                                    {new Date(ticket.updatedAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex p-3 rounded-2xl bg-muted/30 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300 shadow-sm">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="flex justify-center pt-6">
                <Button variant="outline">View All Tickets</Button>
            </div>
        </div>
    )
}
