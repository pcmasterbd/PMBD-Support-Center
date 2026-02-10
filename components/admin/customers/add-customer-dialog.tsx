'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { createCustomer } from '@/lib/actions/customer-actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function AddCustomerDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            address: formData.get('address') as string,
            package: formData.get('package') as string,
            price: formData.get('price') ? Number(formData.get('price')) : undefined,
            totalBill: formData.get('totalBill') ? Number(formData.get('totalBill')) : undefined,
            pendriveSN: formData.get('pendriveSN') as string,
            pendrivePurchaseDate: formData.get('pendrivePurchaseDate') ? new Date(formData.get('pendrivePurchaseDate') as string) : undefined,
        }

        // Validate date before sending
        if (data.pendrivePurchaseDate && isNaN(data.pendrivePurchaseDate.getTime())) {
            toast.error('Invalid date selected')
            setIsLoading(false)
            return
        }

        const result = await createCustomer(data)

        if (result.success) {
            toast.success('Customer added successfully')
            setOpen(false)
            router.refresh()
        } else {
            toast.error('Failed to add customer')
        }
        setIsLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Customer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Customer</DialogTitle>
                        <DialogDescription>
                            Add a new customer to the database manually.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" name="name" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Number
                            </Label>
                            <Input id="phone" name="phone" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Address
                            </Label>
                            <Input id="address" name="address" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="package" className="text-right">
                                Package
                            </Label>
                            <Select name="package">
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a package" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Standard - 64 GB">Standard - 64 GB</SelectItem>
                                    <SelectItem value="Premium - 128 GB">Premium - 128 GB</SelectItem>
                                    <SelectItem value="Student - 32 GB">Student - 32 GB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                                Price
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                className="col-span-3"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="totalBill" className="text-right font-bold">
                                Total TK
                            </Label>
                            <Input
                                id="totalBill"
                                name="totalBill"
                                type="number"
                                className="col-span-3 font-bold"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="pendriveSN" className="text-right">
                                Pendrive SN
                            </Label>
                            <Input
                                id="pendriveSN"
                                name="pendriveSN"
                                className="col-span-3"
                                placeholder="Serial Number"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="pendrivePurchaseDate" className="text-right">
                                Purchase Date
                            </Label>
                            <Input
                                id="pendrivePurchaseDate"
                                name="pendrivePurchaseDate"
                                type="date"
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Customer'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
