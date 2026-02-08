'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AdminModal } from './admin-modal'
import { PremiumResourceForm } from './premium-resource-form'

export function PremiumResourceAddButton() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="gap-2 font-bold">
                <Plus className="w-4 h-4" />
                Add Resource
            </Button>

            <AdminModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add New Premium Resource"
            >
                <PremiumResourceForm onSuccess={() => setIsOpen(false)} />
            </AdminModal>
        </>
    )
}
