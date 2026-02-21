'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUser, updateUser } from "@/lib/actions/user-actions"
import { useState } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"

interface UserFormProps {
    user?: any // If providing a user, it's an edit form
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

export function UserForm({ user, onSuccess }: UserFormProps) {
    const [error, setError] = useState<string | null>(null)

    async function action(formData: FormData) {
        try {
            if (user) {
                await updateUser(user.id, formData)
                toast.success('User updated successfully')
            } else {
                await createUser(formData)
                toast.success('User created successfully')
            }
            onSuccess()
        } catch (err: any) {
            const errorMessage = err.message || 'Something went wrong'
            setError(errorMessage)
            toast.error(errorMessage)
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
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user?.name} required placeholder="Enter name" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" defaultValue={user?.email} required placeholder="Email address" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" defaultValue={user?.phone} required placeholder="Phone number" />
            </div>

            {!user && (
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required placeholder="Initial password" />
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                    id="role"
                    name="role"
                    defaultValue={user?.role || 'USER'}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="USER">Standard User</option>
                    <option value="ADMIN">Administrator</option>
                    <option value="SUPERADMIN">Super Admin</option>
                </select>
            </div>

            <div className="pt-4">
                <SubmitButton label={user ? 'Update User' : 'Create User'} />
            </div>
        </form>
    )
}
