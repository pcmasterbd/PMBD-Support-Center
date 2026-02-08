'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AdminModal } from './admin-modal'
import { UserForm } from './user-form'

export function UserAddButton() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add New User
            </Button>

            <AdminModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Create New User"
            >
                <UserForm onSuccess={() => setIsOpen(false)} />
            </AdminModal>
        </>
    )
}
