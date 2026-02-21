'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Search, Calendar as CalendarIcon, FilterX } from "lucide-react"
import { getAuditLogs } from "@/lib/actions/superadmin/audit-actions"

interface AuditLog {
    id: string
    action: string
    target: string | null
    details: string | null
    ipAddress: string | null
    createdAt: Date
    admin: {
        name: string
        email: string
    }
}

interface AuditClientProps {
    initialLogs: AuditLog[]
    initialPagination: {
        total: number
        pages: number
        current: number
    }
    admins: { id: string, name: string }[]
    actions: string[]
}

export function AuditClient({ initialLogs, initialPagination, admins, actions }: AuditClientProps) {
    const [logs, setLogs] = useState(initialLogs)
    const [pagination, setPagination] = useState(initialPagination)
    const [isPending, startTransition] = useTransition()

    // Filters
    const [selectedAdmin, setSelectedAdmin] = useState("ALL")
    const [selectedAction, setSelectedAction] = useState("ALL")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const fetchLogs = (page = 1) => {
        startTransition(async () => {
            const result = await getAuditLogs({
                page,
                limit: 20,
                adminId: selectedAdmin === "ALL" ? undefined : selectedAdmin,
                action: selectedAction === "ALL" ? undefined : selectedAction,
                startDate: startDate || undefined,
                endDate: endDate || undefined
            })

            if (result.success && result.data) {
                setLogs(result.data as any)
                setPagination(result.pagination!)
            }
        })
    }

    const handleFilter = () => {
        fetchLogs(1)
    }

    const handleClearFilters = () => {
        setSelectedAdmin("ALL")
        setSelectedAction("ALL")
        setStartDate("")
        setEndDate("")
        // Trigger fetch after state updates? No, need to call with defaults
        startTransition(async () => {
            const result = await getAuditLogs({ page: 1, limit: 20 })
            if (result.success && result.data) {
                setLogs(result.data as any)
                setPagination(result.pagination!)
            }
        })
    }

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= pagination.pages) {
            fetchLogs(newPage)
        }
    }

    const handleExport = () => {
        const csvData = logs.map(log => ({
            'Timestamp': format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss'),
            'Admin Name': log.admin.name,
            'Admin Email': log.admin.email,
            'Action': log.action,
            'Target': log.target || '-',
            'Details': log.details || '-',
            'IP Address': log.ipAddress || '-'
        }))

        const csv = Papa.unparse(csvData)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `audit_logs_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                <Button variant="outline" onClick={handleExport} disabled={logs.length === 0}>
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
            </div>

            <div className="bg-card p-4 rounded-lg border shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <span className="text-sm font-medium">Admin</span>
                        <Select value={selectedAdmin} onValueChange={setSelectedAdmin}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Admins" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Admins</SelectItem>
                                {admins.map(admin => (
                                    <SelectItem key={admin.id} value={admin.id}>{admin.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm font-medium">Action</span>
                        <Select value={selectedAction} onValueChange={setSelectedAction}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Actions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Actions</SelectItem>
                                {actions.map(action => (
                                    <SelectItem key={action} value={action}>{action}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm font-medium">Start Date</span>
                        <div className="relative">
                            <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="date"
                                className="pl-9"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm font-medium">End Date</span>
                        <div className="relative">
                            <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="date"
                                className="pl-9"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={handleClearFilters}>
                        <FilterX className="mr-2 h-4 w-4" /> Clear
                    </Button>
                    <Button onClick={handleFilter} disabled={isPending}>
                        <Search className="mr-2 h-4 w-4" /> Apply Filters
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Admin</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>IP Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPending ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
                            </TableRow>
                        ) : logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">No logs found.</TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                                        {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{log.admin.name}</span>
                                            <span className="text-xs text-muted-foreground">{log.admin.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{log.action}</Badge>
                                    </TableCell>
                                    <TableCell className="max-w-[150px] truncate" title={log.target || ''}>
                                        {log.target || '-'}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={log.details || ''}>
                                        {log.details || '-'}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {log.ipAddress || '-'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination.pages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page {pagination.current} of {pagination.pages} (Total {pagination.total})
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.current - 1)}
                            disabled={pagination.current === 1 || isPending}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.current + 1)}
                            disabled={pagination.current === pagination.pages || isPending}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
