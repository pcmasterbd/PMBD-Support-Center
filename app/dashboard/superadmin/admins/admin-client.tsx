'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { nanoid } from "nanoid"
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
    Plus,
    MoreHorizontal,
    Trash,
    RefreshCw,
    Copy,
    RotateCcw,
    Activity
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { createAdmin, updateAdmin, deleteAdmin, resetAdminPassword } from "@/lib/actions/superadmin/admin-actions"

interface AdminUser {
    id: string
    name: string
    email: string
    role: string
    isActive: boolean
    lastLogin: Date | null
    createdAt: Date
}

interface AdminClientProps {
    initialAdmins: AdminUser[]
    currentUserId: string
}

export function AdminClient({ initialAdmins, currentUserId }: AdminClientProps) {
    const [admins, setAdmins] = useState(initialAdmins)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    // Create Admin State
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newAdmin, setNewAdmin] = useState({
        name: "",
        email: "",
        password: "",
        role: "ADMIN"
    })

    // Edit Admin State
    const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)

    // Reset Password State
    const [resettingId, setResettingId] = useState<string | null>(null)
    const [newPassword, setNewPassword] = useState("")

    const generatePassword = () => {
        const pwd = nanoid(12)
        setNewAdmin(prev => ({ ...prev, password: pwd }))
        return pwd
    }

    const generateResetPassword = () => {
        const pwd = nanoid(12)
        setNewPassword(pwd)
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const formData = new FormData()
            formData.append('name', newAdmin.name)
            formData.append('email', newAdmin.email)
            formData.append('password', newAdmin.password)
            formData.append('role', newAdmin.role)

            const result = await createAdmin(formData)
            if (result.success) {
                toast.success(result.message)
                setIsCreateOpen(false)
                setNewAdmin({ name: "", email: "", password: "", role: "ADMIN" })
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingAdmin) return

        startTransition(async () => {
            const formData = new FormData()
            formData.append('name', editingAdmin.name)
            formData.append('email', editingAdmin.email)
            formData.append('role', editingAdmin.role)
            formData.append('isActive', String(editingAdmin.isActive))

            const result = await updateAdmin(editingAdmin.id, formData)
            if (result.success) {
                toast.success(result.message)
                setEditingAdmin(null)
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this admin? This action cannot be undone.")) return

        startTransition(async () => {
            const result = await deleteAdmin(id)
            if (result.success) {
                toast.success(result.message)
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleResetPassword = async () => {
        if (!resettingId || !newPassword) return

        startTransition(async () => {
            const result = await resetAdminPassword(resettingId, newPassword)
            if (result.success) {
                toast.success(result.message)
                setResettingId(null)
                setNewPassword("")
            } else {
                toast.error(result.error)
            }
        })
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => generatePassword()}>
                            <Plus className="mr-2 h-4 w-4" /> Create Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Admin</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={newAdmin.name}
                                    onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newAdmin.email}
                                    onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={newAdmin.role} onValueChange={v => setNewAdmin({ ...newAdmin, role: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="password"
                                        value={newAdmin.password}
                                        onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                        required
                                    />
                                    <Button type="button" variant="outline" size="icon" onClick={generatePassword} title="Generate">
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                    <Button type="button" variant="outline" size="icon" onClick={() => copyToClipboard(newAdmin.password)} title="Copy">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <Button type="submit" disabled={isPending} className="w-full">
                                {isPending ? "Creating..." : "Create Admin"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {admins.map((admin) => (
                            <TableRow key={admin.id}>
                                <TableCell className="font-medium">{admin.name}</TableCell>
                                <TableCell>{admin.email}</TableCell>
                                <TableCell>
                                    <Badge variant={admin.role === 'SUPERADMIN' ? 'default' : 'secondary'}>
                                        {admin.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={admin.isActive ? 'outline' : 'destructive'}>
                                        {admin.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                                </TableCell>
                                <TableCell>
                                    {new Date(admin.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => setEditingAdmin(admin)}>
                                                Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setResettingId(admin.id)
                                                generateResetPassword()
                                            }}>
                                                <RotateCcw className="mr-2 h-4 w-4" /> Reset Password
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push(`/dashboard/superadmin/logs?adminId=${admin.id}`)}>
                                                <Activity className="mr-2 h-4 w-4" /> View Activity
                                            </DropdownMenuItem>
                                            {admin.id !== currentUserId && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDelete(admin.id)} className="text-red-600">
                                                        <Trash className="mr-2 h-4 w-4" /> Delete Admin
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingAdmin} onOpenChange={(open) => !open && setEditingAdmin(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Admin</DialogTitle>
                    </DialogHeader>
                    {editingAdmin && (
                        <form onSubmit={handleUpdate} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editingAdmin.name}
                                    onChange={e => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editingAdmin.email}
                                    onChange={e => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-role">Role</Label>
                                <Select value={editingAdmin.role} onValueChange={v => setEditingAdmin({ ...editingAdmin, role: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit-active"
                                    checked={editingAdmin.isActive}
                                    onCheckedChange={c => setEditingAdmin({ ...editingAdmin, isActive: c })}
                                />
                                <Label htmlFor="edit-active">Account Active</Label>
                            </div>
                            <Button type="submit" disabled={isPending} className="w-full">
                                {isPending ? "Updating..." : "Update Admin"}
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Reset Password Dialog */}
            <Dialog open={!!resettingId} onOpenChange={(open) => !open && setResettingId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>New Password</Label>
                            <div className="flex gap-2">
                                <Input value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                <Button type="button" variant="outline" size="icon" onClick={generateResetPassword} title="Generate">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button type="button" variant="outline" size="icon" onClick={() => copyToClipboard(newPassword)} title="Copy">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <Button onClick={handleResetPassword} disabled={isPending || !newPassword} className="w-full">
                            {isPending ? "Resetting..." : "Confirm Password Reset"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
