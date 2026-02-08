'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AdminModal } from './admin-modal'
import { SerialForm } from './serial-form'

export function SerialAddButton() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="gap-2 h-9 text-xs font-bold uppercase">
                <Plus className="w-4 h-4" />
                Add Serial
            </Button>

            <AdminModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add New Serial Number"
            >
                <SerialForm onSuccess={() => setIsOpen(false)} />
            </AdminModal>
        </>
    )
}
