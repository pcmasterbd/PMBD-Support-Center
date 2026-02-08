'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { AdminModal } from './admin-modal'
import { VideoForm } from './video-form'
import { deleteVideo } from '@/lib/actions/content-actions'

export function VideoActionButtons({ video, categories }: { video: any, categories: any[] }) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this video?')) return
        setLoading(true)
        try {
            await deleteVideo(video.id)
        } catch (err) {
            alert('Failed to delete video')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                className="text-primary hover:bg-primary hover:text-primary-foreground h-8"
                onClick={() => setIsEditOpen(true)}
            >
                Edit Video
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleDelete}
                disabled={loading}
            >
                <Trash2 className="w-4 h-4" />
            </Button>

            <AdminModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit Video Tutorial"
            >
                <VideoForm
                    video={video}
                    categories={categories}
                    onSuccess={() => setIsEditOpen(false)}
                />
            </AdminModal>
        </div>
    )
}
