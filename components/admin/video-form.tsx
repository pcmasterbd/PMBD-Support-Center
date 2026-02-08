'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createVideo, updateVideo } from "@/lib/actions/content-actions"
import { useState } from "react"
import { useFormStatus } from "react-dom"

interface VideoFormProps {
    video?: any
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

export function VideoForm({ video, categories, onSuccess }: VideoFormProps) {
    const [error, setError] = useState<string | null>(null)

    async function action(formData: FormData) {
        try {
            if (video) {
                await updateVideo(video.id, formData)
            } else {
                await createVideo(formData)
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
                <Label htmlFor="title">Video Title</Label>
                <Input id="title" name="title" defaultValue={video?.title} required placeholder="e.g. How to install Windows" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="youtubeId">YouTube Video ID</Label>
                <Input id="youtubeId" name="youtubeId" defaultValue={video?.youtubeId} required placeholder="e.g. dQw4w9WgXcQ" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <select
                    id="categoryId"
                    name="categoryId"
                    defaultValue={video?.categoryId || categories[0]?.id}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                >
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isPremium"
                    name="isPremium"
                    value="true"
                    defaultChecked={video?.isPremium}
                    className="w-4 h-4"
                />
                <Label htmlFor="isPremium">Premium Only</Label>
            </div>

            <div className="pt-4">
                <SubmitButton label={video ? 'Update Video' : 'Add Video'} />
            </div>
        </form>
    )
}
