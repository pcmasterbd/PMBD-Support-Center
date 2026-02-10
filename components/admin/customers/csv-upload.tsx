'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'
import Papa from 'papaparse'
import { bulkCreateCustomers, CustomerFormData } from '@/lib/actions/customer-actions'
import { useRouter } from 'next/navigation'

export function CsvUpload() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter()

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    // Verify headers
                    const headers = results.meta.fields || []
                    // Check for essential columns (relaxed matching)
                    // Mappings: 
                    // Name -> name
                    // Namber / Number / Phone -> phone
                    // Address -> address
                    // Package -> package
                    // Price -> price
                    // Total TK / Total -> totalBill

                    const customers: CustomerFormData[] = results.data.map((row: any) => ({
                        name: row['Name'] || row['name'] || '',
                        phone: row['Namber'] || row['Number'] || row['number'] || row['Phone'] || '',
                        address: row['Address'] || row['address'] || '',
                        package: row['Package/ Price'] || row['Package'] || row['package'] || '',
                        price: parseFloat(row['Package/ Price']?.match(/\d+/)?.[0] || row['Price'] || '0') || 0,
                        totalBill: parseFloat(row['Total TK'] || row['Total'] || '0') || 0,
                    })).filter((c: any) => c.name && c.phone) // Filter out invalid rows

                    if (customers.length === 0) {
                        toast.error('No valid customer data found in CSV.')
                        setIsUploading(false)
                        return
                    }

                    const result = await bulkCreateCustomers(customers)

                    if (result.success) {
                        toast.success(`Successfully uploaded ${result.count} customers`)
                        router.refresh()
                    } else {
                        toast.error('Failed to upload customers')
                    }
                } catch (error) {
                    console.error('CSV Processing Error:', error)
                    toast.error('Error processing CSV file')
                } finally {
                    setIsUploading(false)
                    // Reset file input
                    if (fileInputRef.current) fileInputRef.current.value = ''
                }
            },
            error: (error) => {
                console.error('Papa Parse Error:', error)
                toast.error('Failed to parse CSV file')
                setIsUploading(false)
            }
        })
    }

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls" // Accept excel extensions too though Papa only parses CSV, user might need reminding
                className="hidden"
            />
            <Button
                variant="outline"
                onClick={handleButtonClick}
                disabled={isUploading}
            >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Import CSV'}
            </Button>
        </>
    )
}
