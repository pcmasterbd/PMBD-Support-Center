'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, Loader2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function BulkImportSerials() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'manual' | 'file'>('manual')
    const [manualInput, setManualInput] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const processSerials = async (serials: string[]) => {
        if (serials.length === 0) {
            alert('No valid serial numbers found')
            return
        }

        setLoading(true)
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
            setOpen(false)
            setManualInput('')
            router.refresh()
        } catch (err: any) {
            alert('Import error: ' + err.message)
        } finally {
            setLoading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleManualSubmit = () => {
        const lines = manualInput.split(/[\n,]/) // Split by newline or comma
        const serials = lines
            .map(line => line.trim())
            .filter(line => line.length > 0)

        processSerials(serials)
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
            alert('Please upload a CSV or Text file')
            return
        }

        const reader = new FileReader()
        reader.onload = async (event) => {
            const text = event.target?.result as string
            const lines = text.split('\n')
            const serials = lines
                .map(line => line.trim())
                .filter(line => line.length > 0)
                // Basic validation: skip header if it looks like "code" or "serial"
                .filter(line => !['code', 'serial', 'serial_number', 'serials'].includes(line.toLowerCase()))

            processSerials(serials)
        }
        reader.readAsText(file)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Import Serials
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Import Serial Numbers</DialogTitle>
                    <DialogDescription>
                        Import serial numbers manually or via CSV/Text file.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-4 border-b mb-4">
                    <button
                        className={`pb-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === 'manual'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        onClick={() => setActiveTab('manual')}
                    >
                        Manual Entry
                    </button>
                    <button
                        className={`pb-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === 'file'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        onClick={() => setActiveTab('file')}
                    >
                        CSV / Text File
                    </button>
                </div>

                {activeTab === 'manual' ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Enter Serial Numbers (One per line)
                            </label>
                            <Textarea
                                placeholder="T5415&#10;T5246&#10;A7878"
                                className="min-h-[200px] font-mono"
                                value={manualInput}
                                onChange={(e) => setManualInput(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Paste your serial numbers here. Each line will be treated as a separate serial.
                            </p>
                        </div>
                        <Button
                            onClick={handleManualSubmit}
                            disabled={loading || !manualInput.trim()}
                            className="w-full"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Import Serials
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 py-8">
                        <div
                            className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-8 h-8 text-muted-foreground mb-4" />
                            <p className="text-sm font-medium">Click to upload text or CSV file</p>
                            <p className="text-xs text-muted-foreground mt-1">Files should contain one serial number per line</p>
                            <input
                                type="file"
                                accept=".csv,.txt"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                disabled={loading}
                            />
                        </div>
                        {loading && (
                            <div className="flex items-center justify-center text-sm text-muted-foreground">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing file...
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
