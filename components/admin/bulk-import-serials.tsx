'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Loader2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function BulkImportSerials() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.name.endsWith('.csv')) {
            alert('Please upload a CSV file')
            return
        }

        setLoading(true)
        setError(null)

        const reader = new FileReader()
        reader.onload = async (event) => {
            const text = event.target?.result as string
            const lines = text.split('\n')
            const serials = lines
                .map(line => line.trim())
                .filter(line => line.length > 0)
                // Basic validation: skip header if it looks like "code" or "serial"
                .filter(line => !['code', 'serial', 'serial_number'].includes(line.toLowerCase()))

            if (serials.length === 0) {
                alert('No valid serial numbers found in the file')
                setLoading(false)
                return
            }

            try {
                const response = await fetch('/api/admin/serials/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ serials }),
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to import')
                }

                alert(`${data.count} serial numbers imported successfully!`)
                router.refresh()
            } catch (err: any) {
                setError(err.message)
                alert('Import error: ' + err.message)
            } finally {
                setLoading(false)
                if (fileInputRef.current) fileInputRef.current.value = ''
            }
        }

        reader.readAsText(file)
    }

    return (
        <div className="flex flex-col gap-2">
            <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={loading}
            />
            <Button
                variant="outline"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Upload className="w-4 h-4" />
                )}
                Import (CSV)
            </Button>
        </div>
    )
}
