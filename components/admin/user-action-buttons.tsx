'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, MoreVertical } from 'lucide-react'
import { AdminModal } from './admin-modal'
import { UserForm } from './user-form'
import { deleteUser } from '@/lib/actions/user-actions'

export function UserActionButtons({ user }: { user: any }) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this user?')) return
        setLoading(true)
        try {
            await deleteUser(user.id)
            setIsDeleteOpen(false)
        } catch (err) {
            alert('Failed to delete user')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-end gap-2">
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
                title="Edit User Details"
            >
                <UserForm user={user} onSuccess={() => setIsEditOpen(false)} />
            </AdminModal>
        </div>
    )
}
