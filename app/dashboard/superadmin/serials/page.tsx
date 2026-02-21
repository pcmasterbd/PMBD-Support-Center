import { Metadata } from "next"
import { getSerials } from "@/lib/actions/superadmin/serial-actions"
import { SerialClient } from "./serial-client"

export const metadata: Metadata = {
    title: "Serial Number Management | Super Admin",
    description: "Manage serial numbers and packages",
}

export default async function SerialManagementPage() {
    const result = await getSerials()
    const serials = result.success ? result.data : []

    // Ensure serials matches the interface expected by Client
    const formattedSerials = (serials || []).map(s => ({
        ...s,
        // Ensure dates are passed as Date objects or strings as needed by client
        // Prisma returns Date objects which are fine for Server Components -> Client Components if not complex objects
        // But sometimes it warns. Safe to pass as is for now.
    }))

    return (
        <div className="space-y-6">
            <SerialClient initialSerials={formattedSerials as any} />
        </div>
    )
}
