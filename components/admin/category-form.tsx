'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCategory, updateCategory } from "@/lib/actions/content-actions"
import { useState } from "react"
import { useFormStatus } from "react-dom"

interface CategoryFormProps {
    category?: any
    type: string // 'SOFTWARE' or 'VIDEO'
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

export function CategoryForm({ category, type, onSuccess }: CategoryFormProps) {
    const [error, setError] = useState<string | null>(null)

    async function action(formData: FormData) {
        try {
            if (category) {
                await updateCategory(category.id, formData)
            } else {
                await createCategory(formData)
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

            <input type="hidden" name="type" value={type} />

            <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" name="name" defaultValue={category?.name} required placeholder="e.g. Operating Systems" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="icon">Icon (Emoji or text)</Label>
                <Input id="icon" name="icon" defaultValue={category?.icon} placeholder="e.g. 💿" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input id="displayOrder" name="displayOrder" type="number" defaultValue={category?.displayOrder || 0} />
            </div>

            <div className="pt-4">
                <SubmitButton label={category ? 'Update Category' : 'Create Category'} />
            </div>
        </form>
    )
}
