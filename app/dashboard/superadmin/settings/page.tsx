import { Metadata } from "next"
import { getSystemSettings } from "@/lib/actions/superadmin/settings-actions"
import { SettingsClient } from "./settings-client"

export const metadata: Metadata = {
    title: "System Settings | Super Admin",
    description: "Configure system-wide settings",
}

export default async function SettingsPage() {
    const result = await getSystemSettings()
    const settings = result.success ? result.data : {}

    return (
        <div className="space-y-6">
            <SettingsClient initialSettings={settings as any} />
        </div>
    )
}
