'use client'

import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash, Search } from 'lucide-react'
import { deleteCustomer } from '@/lib/actions/customer-actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner' // Assuming sonner is used for toasts

interface Customer {
    id: string
    name: string
    phone: string
    address: string | null
    package: string | null
    price: number | null
    totalBill: number | null
    pendrivePurchaseDate: Date | null
    pendriveSN: string | null
    createdAt: Date
}

interface CustomerTableProps {
    initialData: Customer[] // Use specific type instead of any
}

export function CustomerTable({ initialData }: CustomerTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const filteredCustomers = initialData.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    )

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this customer?')) return

        setIsDeleting(id)
        const result = await deleteCustomer(id)

        if (result.success) {
            toast.success('Customer deleted successfully')
            router.refresh()
        } else {
            toast.error('Failed to delete customer')
        }
        setIsDeleting(null)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">S.L</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Number</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Package / Price</TableHead>
                            <TableHead>Pendrive Info</TableHead>
                            <TableHead className="text-right">Total TK</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCustomers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCustomers.map((customer, index) => (
                                <TableRow key={customer.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{customer.name}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>{customer.address || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{customer.package || '-'}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {customer.price ? `৳${customer.price}` : '-'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            {customer.pendriveSN && (
                                                <span className="font-mono text-xs">SN: {customer.pendriveSN}</span>
                                            )}
                                            {customer.pendrivePurchaseDate && (
                                                <span className="text-xs text-muted-foreground">
                                                    Date: {new Date(customer.pendrivePurchaseDate).toLocaleDateString()}
                                                </span>
                                            )}
                                            {!customer.pendriveSN && !customer.pendrivePurchaseDate && '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-green-600">
                                        {customer.totalBill ? `৳${customer.totalBill}` : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    className="text-red-600 cursor-pointer"
                                                    onClick={() => handleDelete(customer.id)}
                                                    disabled={!!isDeleting}
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
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
