'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { AdminModal } from './admin-modal'
import { SoftwareForm } from './software-form'
import { deleteSoftware } from '@/lib/actions/content-actions'

export function SoftwareActionButtons({ software, categories }: { software: any, categories: any[] }) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this software?')) return
        setLoading(true)
        try {
            await deleteSoftware(software.id)
        } catch (err) {
            alert('Failed to delete software')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-end gap-1">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => setIsEditOpen(true)}
            >
                <Edit className="w-4 h-4" />
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
                title="Edit Software"
            >
                <SoftwareForm
                    software={software}
                    categories={categories}
                    onSuccess={() => setIsEditOpen(false)}
                />
            </AdminModal>
        </div>
    )
}
