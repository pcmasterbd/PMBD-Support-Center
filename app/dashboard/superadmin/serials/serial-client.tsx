'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Papa from "papaparse"
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
    DialogTrigger
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
import { Checkbox } from "@/components/ui/checkbox"
import {
    Plus,
    Upload,
    Download,
    Search,
    MoreHorizontal,
    Trash,
    Unlink,
    FileDown
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { addSerialNumber, bulkImportSerials, deleteSerial, unlinkCustomer } from "@/lib/actions/superadmin/serial-actions"

interface SerialNumber {
    id: string
    code: string
    status: string
    packageType: string | null
    createdAt: Date
    user: {
        name: string | null
        email: string
    } | null
}

interface SerialClientProps {
    initialSerials: SerialNumber[] // Using basic type for now, should match Prisma return
}

export function SerialClient({ initialSerials }: SerialClientProps) {
    const [serials, setSerials] = useState(initialSerials)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    // Filters
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [typeFilter, setTypeFilter] = useState("ALL")

    // Add Serial Dialog
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newSerialCode, setNewSerialCode] = useState("")
    const [newSerialType, setNewSerialType] = useState("PREMIUM_128GB")

    // Bulk Import
    const [isImportOpen, setIsImportOpen] = useState(false)
    const [importFile, setImportFile] = useState<File | null>(null)

    // Filtered Serials
    const filteredSerials = serials.filter(serial => {
        const matchesSearch = serial.code.toLowerCase().includes(search.toLowerCase()) ||
            serial.user?.email.toLowerCase().includes(search.toLowerCase()) ||
            serial.user?.name?.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === "ALL" || serial.status === statusFilter
        const matchesType = typeFilter === "ALL" || (serial.packageType || "STANDARD_64GB") === typeFilter
        return matchesSearch && matchesStatus && matchesType
    })

    // Handlers
    const handleAddSerial = async (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const formData = new FormData()
            formData.append('code', newSerialCode)
            formData.append('packageType', newSerialType)

            const result = await addSerialNumber(formData)
            if (result.success) {
                toast.success(result.message)
                setIsAddOpen(false)
                setNewSerialCode("")
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleImport = async () => {
        if (!importFile) return

        Papa.parse(importFile, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const data = results.data as { serialNumber: string, packageType: string }[]
                // Transform keys if needed
                const formattedData = data.map(row => ({
                    code: row.serialNumber,
                    packageType: row.packageType
                }))

                startTransition(async () => {
                    const result = await bulkImportSerials(formattedData)
                    if (result.success) {
                        toast.success(result.message)
                        setIsImportOpen(false)
                        setImportFile(null)
                        router.refresh()
                    } else {
                        toast.error(result.error)
                    }
                })
            },
            error: (error) => {
                toast.error(`CSV Parsing Error: ${error.message}`)
            }
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this serial number?")) return

        startTransition(async () => {
            const result = await deleteSerial(id)
            if (result.success) {
                toast.success(result.message)
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleUnlink = async (id: string) => {
        if (!confirm("Are you sure you want to unlink the customer from this serial?")) return

        startTransition(async () => {
            const result = await unlinkCustomer(id)
            if (result.success) {
                toast.success(result.message)
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleExport = () => {
        const csvData = filteredSerials.map(s => ({
            'Serial Number': s.code,
            'Package Type': s.packageType,
            'Status': s.status,
            'Registered By': s.user ? `${s.user.name} (${s.user.email})` : 'N/A',
            'Registration Date': s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'
        }))

        const csv = Papa.unparse(csvData)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `serials_export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Serial Numbers</h1>
                <div className="flex gap-2">
                    <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Upload className="mr-2 h-4 w-4" /> Import CSV
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Bulk Import Serial Numbers</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="csv">CSV File</Label>
                                    <Input
                                        id="csv"
                                        type="file"
                                        accept=".csv"
                                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Format: serialNumber, packageType (PREMIUM_128GB, STANDARD_64GB)
                                    </p>
                                </div>
                                <Button onClick={handleImport} disabled={!importFile || isPending}>
                                    {isPending ? "Importing..." : "Import Serials"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Serial
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Serial Number</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddSerial} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Serial Number</Label>
                                    <Input
                                        id="code"
                                        value={newSerialCode}
                                        onChange={(e) => setNewSerialCode(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Package Type</Label>
                                    <Select value={newSerialType} onValueChange={setNewSerialType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PREMIUM_128GB">Premium 128GB</SelectItem>
                                            <SelectItem value="STANDARD_64GB">Standard 64GB</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" disabled={isPending} className="w-full">
                                    {isPending ? "Adding..." : "Add Serial"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex w-full sm:max-w-sm items-center space-x-2">
                    <Input
                        placeholder="Search serials..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="AVAILABLE">Available</SelectItem>
                            <SelectItem value="ASSIGNED">Assigned</SelectItem>
                            <SelectItem value="BLOCKED">Blocked</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Package Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Types</SelectItem>
                            <SelectItem value="PREMIUM_128GB">Premium 128GB</SelectItem>
                            <SelectItem value="STANDARD_64GB">Standard 64GB</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Serial Number</TableHead>
                            <TableHead>Package Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Registered By</TableHead>
                            <TableHead>Registration Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSerials.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    No serial numbers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSerials.map((serial) => (
                                <TableRow key={serial.id}>
                                    <TableCell className="font-medium">{serial.code}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{serial.packageType || "Standard"}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={serial.status === 'AVAILABLE' ? 'secondary' : serial.status === 'ASSIGNED' ? 'default' : 'destructive'}>
                                            {serial.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {serial.user ? (
                                            <div className="flex flex-col">
                                                <span className="font-medium">{serial.user.name}</span>
                                                <span className="text-xs text-muted-foreground">{serial.user.email}</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {serial.user && serial.status === 'ASSIGNED' ? new Date(serial.createdAt).toLocaleDateString() : '-'}
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
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(serial.code)}>
                                                    Copy Serial
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {serial.status === 'ASSIGNED' && (
                                                    <DropdownMenuItem onClick={() => handleUnlink(serial.id)} className="text-amber-600">
                                                        <Unlink className="mr-2 h-4 w-4" /> Unlink User
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem onClick={() => handleDelete(serial.id)} className="text-red-600">
                                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
