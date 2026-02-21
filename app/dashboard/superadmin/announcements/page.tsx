import { Metadata } from "next"
import { getAllAnnouncements } from "@/lib/actions/announcement-actions"
import { AnnouncementClient } from "./announcement-client"

export const metadata: Metadata = {
    title: "Announcements | Super Admin",
    description: "Manage system-wide announcements",
}

export default async function AnnouncementsPage() {
    const result = await getAllAnnouncements()
    const announcements = result.success && result.data ? result.data : []

    return (
        <div className="space-y-6">
            <AnnouncementClient initialAnnouncements={announcements as any} />
        </div>
    )
}
