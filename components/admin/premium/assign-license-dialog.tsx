'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { assignLicenseKey, unassignLicenseKey } from "@/lib/actions/premium-actions"
import { searchUsers } from "@/lib/actions/user-actions"
import { Loader2, Search, User, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface AssignLicenseDialogProps {
    licenseId: string
    softwareName: string
    currentAssigneeId?: string | null
    isAssigned: boolean
    trigger?: React.ReactNode
}

export function AssignLicenseDialog({
    licenseId,
    softwareName,
    currentAssigneeId,
    isAssigned,
    trigger
}: AssignLicenseDialogProps) {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setQuery(value)
        if (value.length < 2) {
            setResults([])
            return
        }

        setIsSearching(true)
        try {
            const users = await searchUsers(value)
            setResults(users)
        } catch (error) {
            console.error("Search error", error)
        } finally {
            setIsSearching(false)
        }
    }

    const handleAssign = () => {
        if (!selectedUser) return

        startTransition(async () => {
            try {
                await assignLicenseKey(licenseId, selectedUser.id)
                toast.success(`License assigned to ${selectedUser.name}`)
                setOpen(false)
            } catch (error) {
                toast.error("Failed to assign license")
            }
        })
    }

    const handleUnassign = () => {
        startTransition(async () => {
            try {
                await unassignLicenseKey(licenseId)
                toast.success("License unassigned")
                setOpen(false)
            } catch (error) {
                toast.error("Failed to unassign license")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline" size="sm">Assign</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isAssigned ? 'Manage Assignment' : 'Assign License Key'}</DialogTitle>
                    <DialogDescription>
                        {isAssigned
                            ? 'This license is currently assigned. You can unassign it or re-assign to another user.'
                            : `Assign "${softwareName}" license to a specific user.`}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {isAssigned && !selectedUser && (
                        <div className="flex flex-col gap-2">
                            <Label>Current Status</Label>
                            <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm font-medium flex items-center justify-between">
                                <span>Assigned to User</span>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={handleUnassign}
                                    disabled={isPending}
                                >
                                    {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Unassign'}
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or Re-assign</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label>Select User</Label>
                        {!selectedUser ? (
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email or phone..."
                                    className="pl-8"
                                    value={query}
                                    onChange={handleSearch}
                                />
                                {isSearching && (
                                    <div className="absolute right-2 top-2.5">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                )}
                                {results.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md z-50 max-h-[200px] overflow-y-auto">
                                        {results.map(user => (
                                            <div
                                                key={user.id}
                                                className="p-2 hover:bg-muted cursor-pointer flex items-center gap-3"
                                                onClick={() => {
                                                    setSelectedUser(user)
                                                    setQuery("")
                                                    setResults([])
                                                }}
                                            >
                                                <div className="bg-primary/10 p-1.5 rounded-full">
                                                    <User className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-medium truncate">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <User className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{selectedUser.name}</p>
                                    <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleAssign}
                        disabled={!selectedUser || isPending}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isAssigned ? 'Re-assign' : 'Assign License'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
