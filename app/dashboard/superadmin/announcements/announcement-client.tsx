'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Megaphone, AlertCircle, Info } from "lucide-react"
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/lib/actions/announcement-actions"
import { format } from "date-fns"

interface Announcement {
    id: string
    title: string
    message: string
    type: string
    isActive: boolean
    expiresAt: Date | null
    createdAt: Date
}

interface AnnouncementClientProps {
    initialAnnouncements: Announcement[]
}

export function AnnouncementClient({ initialAnnouncements }: AnnouncementClientProps) {
    const [announcements, setAnnouncements] = useState(initialAnnouncements)
    const [isPending, startTransition] = useTransition()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Announcement | null>(null)
    const router = useRouter()

    const [formData, setFormData] = useState({
        title: "",
        message: "",
        type: "INFO",
        isActive: true,
        expiresAt: ""
    })

    const resetForm = () => {
        setFormData({
            title: "",
            message: "",
            type: "INFO",
            isActive: true,
            expiresAt: ""
        })
        setEditingItem(null)
    }

    const handleOpenCreate = () => {
        resetForm()
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (item: Announcement) => {
        setEditingItem(item)
        setFormData({
            title: item.title,
            message: item.message,
            type: item.type,
            isActive: item.isActive,
            expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().split('T')[0] : ""
        })
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this announcement?")) return
        startTransition(async () => {
            const result = await deleteAnnouncement(id)
            if (result.success) {
                toast.success(result.message)
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleSubmit = async () => {
        if (!formData.title || !formData.message) {
            toast.error("Title and message are required")
            return
        }

        startTransition(async () => {
            let result
            const data = {
                ...formData,
                expiresAt: formData.expiresAt || null
            }

            if (editingItem) {
                result = await updateAnnouncement(editingItem.id, data)
            } else {
                result = await createAnnouncement(data)
            }

            if (result.success) {
                toast.success(result.message)
                setIsDialogOpen(false)
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'WARNING': return <Badge variant="destructive">Warning</Badge>
            case 'UPDATE': return <Badge className="bg-blue-500 hover:bg-blue-600">Update</Badge>
            default: return <Badge variant="secondary">Info</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
                    <p className="text-muted-foreground">Manage global banners for customers.</p>
                </div>
                <Button onClick={handleOpenCreate}>
                    <Plus className="mr-2 h-4 w-4" /> New Announcement
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {announcements.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No announcements created.
                                </TableCell>
                            </TableRow>
                        ) : (
                            announcements.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{item.title}</span>
                                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">{item.message}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getTypeBadge(item.type)}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.isActive ? "outline" : "secondary"}>
                                            {item.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {item.expiresAt ? format(new Date(item.expiresAt), 'MMM d, yyyy') : 'Never'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Edit Announcement" : "New Announcement"}</DialogTitle>
                        <DialogDescription>
                            This message will appear at the top of the customer dashboard.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., System Maintenance"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Brief details..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INFO">Info</SelectItem>
                                        <SelectItem value="WARNING">Warning</SelectItem>
                                        <SelectItem value="UPDATE">Update</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="expiry">Expires At (Optional)</Label>
                                <Input
                                    id="expiry"
                                    type="date"
                                    value={formData.expiresAt}
                                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="active"
                                checked={formData.isActive}
                                onCheckedChange={(c) => setFormData({ ...formData, isActive: c })}
                            />
                            <Label htmlFor="active">Active</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isPending}>
                            {editingItem ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
