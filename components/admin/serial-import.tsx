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
import { Upload, FileUp, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Papa from 'papaparse'
import { bulkImportSerialNumbers } from '@/lib/actions/serial-actions'
import { toast } from 'sonner'
import { useLanguage } from '@/lib/language-context'

export function SerialImport() {
    const { t } = useLanguage()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [parsedData, setParsedData] = useState<any[]>([])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            Papa.parse(selectedFile, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    setParsedData(results.data)
                },
                error: (error) => {
                    toast.error("CSV Parse Error: " + error.message)
                }
            })
        }
    }

    const handleImport = async () => {
        if (!parsedData.length) return

        setLoading(true)
        try {
            // Validate data structure (expecting 'code' column)
            const validData = parsedData.filter(item => item.code).map(item => ({
                code: item.code,
                packageType: item.packageType
            }))

            if (validData.length === 0) {
                toast.error("No valid serial codes found in CSV. Please ensure a 'code' column exists.")
                setLoading(false)
                return
            }

            const result = await bulkImportSerialNumbers(validData)

            if (result?.success) {
                toast.success(`Successfully imported ${result.count} serials`)
                setOpen(false)
                setFile(null)
                setParsedData([])
            } else {
                toast.error(result?.error || "Import failed")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-9 text-xs sm:text-sm rounded-xl">
                    <Upload className="w-4 h-4" />
                    {t('adminSerials.import') || "Import CSV"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import Serial Numbers</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file with a <code className="bg-muted px-1 rounded">code</code> column. Optional: <code className="bg-muted px-1 rounded">packageType</code>.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="csv-file">CSV File</Label>
                        <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
                    </div>

                    {parsedData.length > 0 && (
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Found {parsedData.length} records
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                    <Button onClick={handleImport} disabled={!file || parsedData.length === 0 || loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Import Serials
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
