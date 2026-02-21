'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface UserStatusToggleProps {
    userId: string
    initialStatus: boolean
}

export function UserStatusToggle({ userId, initialStatus }: UserStatusToggleProps) {
    const [isActive, setIsActive] = useState(initialStatus)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleToggle = async (checked: boolean) => {
        setLoading(true)
        try {
            const response = await fetch(`/api/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: checked }),
            })

            if (!response.ok) {
                throw new Error('Failed to update status')
            }

            setIsActive(checked)
            toast.success('User status updated successfully')
            router.refresh()
        } catch (error) {
            toast.error('Failed to update user status')
            setIsActive(!checked) // Revert state on error
        } finally {
            setLoading(false)
        }
    }

    return (
        <Switch
            checked={isActive}
            onCheckedChange={handleToggle}
            disabled={loading}
        />
    )
}
