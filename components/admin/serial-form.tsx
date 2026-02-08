'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSerial } from "@/lib/actions/serial-actions"
import { useState } from "react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button disabled={pending} className="w-full font-bold">
            {pending ? 'Saving...' : 'Add Serial'}
        </Button>
    )
}

export function SerialForm({ onSuccess }: { onSuccess: () => void }) {
    const [error, setError] = useState<string | null>(null)

    async function action(formData: FormData) {
        try {
            await createSerial(formData)
            onSuccess()
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
        }
    }

    return (
        <form action={action} className="space-y-4">
            {error && (
                <div className="p-3 text-xs font-bold bg-red-50 text-red-600 border border-red-100 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="code">Serial Code</Label>
                <Input id="code" name="code" required placeholder="e.g. PMBD-ABC123XYZ" className="font-mono uppercase" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                    id="status"
                    name="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="ASSIGNED">ASSIGNED (Manually)</option>
                </select>
            </div>

            <div className="pt-4">
                <SubmitButton />
            </div>
        </form>
    )
}
