'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createSoftware, updateSoftware } from "@/lib/actions/content-actions"
import { useState } from "react"
import { useFormStatus } from "react-dom"

interface SoftwareFormProps {
    software?: any
    categories: any[]
    onSuccess: () => void
}

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus()
    return (
        <Button disabled={pending} className="w-full font-bold">
            {pending ? 'Saving...' : label}
        </Button>
    )
}

export function SoftwareForm({ software, categories, onSuccess }: SoftwareFormProps) {
    const [error, setError] = useState<string | null>(null)

    async function action(formData: FormData) {
        try {
            if (software) {
                await updateSoftware(software.id, formData)
            } else {
                await createSoftware(formData)
            }
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
                <Label htmlFor="name">Software Name</Label>
                <Input id="name" name="name" defaultValue={software?.name} required placeholder="e.g. Rufus" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input id="version" name="version" defaultValue={software?.version} placeholder="e.g. 4.4" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        defaultValue={software?.categoryId || categories[0]?.id}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={software?.description} placeholder="Software details..." />
            </div>

            <div className="space-y-2">
                <Label htmlFor="fileUrl">Download URL</Label>
                <Input id="fileUrl" name="fileUrl" defaultValue={software?.fileUrl} required placeholder="Direct link to file" />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isPremium"
                    name="isPremium"
                    value="true"
                    defaultChecked={software?.isPremium}
                    className="w-4 h-4"
                />
                <Label htmlFor="isPremium">Premium Only</Label>
            </div>

            <div className="pt-4">
                <SubmitButton label={software ? 'Update Software' : 'Add Software'} />
            </div>
        </form>
    )
}
