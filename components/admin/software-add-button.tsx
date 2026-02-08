'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AdminModal } from './admin-modal'
import { SoftwareForm } from './software-form'

export function SoftwareAddButton({ categories }: { categories: any[] }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add New Software
            </Button>

            <AdminModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add New Software"
            >
                <SoftwareForm categories={categories} onSuccess={() => setIsOpen(false)} />
            </AdminModal>
        </>
    )
}
