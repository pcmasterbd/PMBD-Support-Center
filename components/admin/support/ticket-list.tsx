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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-bold text-lg sm:text-xl">সকল টিকেট লিস্ট ({filteredTickets.length})</h3>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="টিকেট সার্চ করুন..."
                            className="pl-10 h-10 rounded-xl bg-muted/50 border-transparent focus:bg-background transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedTickets.length > 0 && (
                <div className="bg-primary/5 border-2 border-primary/20 p-3 sm:p-4 rounded-2xl flex items-center justify-between animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2">
                        <span className="font-extrabold text-primary text-sm sm:text-base">{selectedTickets.length} selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={bulkReplyOpen} onOpenChange={setBulkReplyOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-2 h-9 px-4 rounded-xl font-bold shadow-lg shadow-primary/20">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="hidden xs:inline">Bulk Reply</span>
                                    <span className="xs:hidden">Reply</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px] rounded-3xl">
                                <form onSubmit={handleBulkReply}>
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">Bulk Reply</DialogTitle>
                                        <DialogDescription className="text-xs font-medium">
                                            Send a message to {selectedTickets.length} selected tickets.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="message" className="font-bold text-xs uppercase tracking-widest text-slate-400">Message</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Type your reply here..."
                                                className="min-h-[120px] rounded-2xl border-2 focus:ring-0"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="status" className="font-bold text-xs uppercase tracking-widest text-slate-400">Update Status</Label>
                                            <Select name="status" defaultValue="NO_CHANGE">
                                                <SelectTrigger className="h-11 rounded-xl border-2">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="NO_CHANGE">Don't Change Status</SelectItem>
                                                    <SelectItem value="OPEN">Open</SelectItem>
                                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                                                    <SelectItem value="CLOSED">Closed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold shadow-xl shadow-primary/20" disabled={isSubmitting}>
                                            {isSubmitting ? 'Sending...' : 'Send Replies'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl font-bold text-muted-foreground" onClick={() => setSelectedTickets([])}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid gap-3">
                <div className="flex items-center gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
                    <Checkbox
                        checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                        onCheckedChange={toggleSelectAll}
                    />
                    <span>Select All</span>
                </div>

                {filteredTickets.map((ticket: any) => (
                    <div key={ticket.id} className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                            <Checkbox
                                checked={selectedTickets.includes(ticket.id)}
                                onCheckedChange={() => toggleSelectTicket(ticket.id)}
                            />
                        </div>
                        <Link href={`/dashboard/admin/support/${ticket.id}`} className="block pl-10 xs:pl-12">
                            <Card className={`p-3 sm:p-4 hover:bg-muted/30 transition-all border-2 rounded-2xl ${selectedTickets.includes(ticket.id) ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' : 'border-transparent hover:border-primary/10'}`}>
                                <div className="flex items-center justify-between gap-3 sm:gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-lg uppercase border ${ticket.status === 'OPEN' ? 'bg-blue-500/10 text-blue-500 border-blue-200' :
                                                ticket.status === 'IN_PROGRESS' ? 'bg-purple-500/10 text-purple-500 border-purple-200' :
                                                    'bg-green-500/10 text-green-500 border-green-200'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                            <span className={`text-[9px] sm:text-[10px] font-bold uppercase ${ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'text-red-500' : 'text-muted-foreground'
                                                }`}>
                                                {ticket.priority}
                                            </span>
                                            <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">#{ticket.id.slice(-6).toUpperCase()}</span>
                                        </div>
                                        <h4 className="font-bold text-sm sm:text-base truncate leading-tight">{ticket.subject}</h4>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-[10px] text-muted-foreground">
                                            <span className="flex items-center gap-1.5 font-bold">
                                                <User className="w-3 h-3 text-primary/60" />
                                                <span className="truncate max-w-[100px]">{ticket.user.name}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5 font-bold">
                                                <MessageSquare className="w-3 h-3 text-primary/60" />
                                                {ticket._count?.messages || 0}
                                            </span>
                                            <span className="flex items-center gap-1.5 font-medium ml-auto sm:ml-0 opacity-70">
                                                <Clock className="w-3 h-3" />
                                                {new Date(ticket.updatedAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="hidden xs:flex p-2 rounded-xl bg-muted/30 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
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
