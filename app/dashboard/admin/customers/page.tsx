import { Suspense } from 'react'
import { getCustomers } from '@/lib/actions/customer-actions'
import { CustomerTable } from '@/components/admin/customers/customer-table'
import { AddCustomerDialog } from '@/components/admin/customers/add-customer-dialog'
import { CsvUpload } from '@/components/admin/customers/csv-upload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function CustomersPage() {
    const { data: customers = [] } = await getCustomers()

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
                    <p className="text-muted-foreground">
                        Manage your customer database, add new entries, or upload via CSV.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <CsvUpload />
                    <AddCustomerDialog />
                </div>
            </div>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>All Customers ({customers?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Loading customers...</div>}>
                        <CustomerTable initialData={customers || []} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}
