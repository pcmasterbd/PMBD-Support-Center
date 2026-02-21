import { Metadata } from "next"
import { auth } from "@/auth"
import { getAdmins } from "@/lib/actions/superadmin/admin-actions"
import { AdminClient } from "./admin-client"

export const metadata: Metadata = {
    title: "Admin Management | Super Admin",
    description: "Manage system administrators",
}

export default async function AdminManagementPage() {
    const session = await auth()
    const result = await getAdmins()
    const admins = result.success ? result.data : []

    return (
        <div className="space-y-6">
            <AdminClient
                initialAdmins={admins as any}
                currentUserId={session?.user?.id || ''}
            />
        </div>
    )
}
