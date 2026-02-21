'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function getSystemSettings() {
    try {
        const settings = await prisma.systemSetting.findMany()
        // Transform array to object for easier consumption { key: value }
        const settingsMap: Record<string, string> = {}
        settings.forEach(s => {
            settingsMap[s.key] = s.value
        })
        return { success: true, data: settingsMap }
    } catch (error) {
        console.error("Failed to fetch settings:", error)
        return { success: false, error: "Failed to fetch settings" }
    }
}

export async function updateSystemSettings(data: Record<string, string>) {
    try {
        const session = await auth()
        if (session?.user?.role !== 'SUPERADMIN') {
            return { success: false, error: "Unauthorized" }
        }

        // Update each setting
        // Using transaction to ensure all or nothing
        await prisma.$transaction(
            Object.entries(data).map(([key, value]) =>
                prisma.systemSetting.upsert({
                    where: { key },
                    update: { value },
                    create: {
                        key,
                        value,
                        category: determineCategory(key)
                    }
                })
            )
        )

        revalidatePath('/dashboard/superadmin/settings')
        return { success: true, message: "Settings updated successfully" }
    } catch (error) {
        console.error("Update settings failed:", error)
        return { success: false, error: "Failed to update settings" }
    }
}

function determineCategory(key: string): string {
    if (key.startsWith('site_') || key.startsWith('contact_')) return 'GENERAL'
    if (key.startsWith('notify_')) return 'NOTIFICATIONS'
    if (key.startsWith('security_') || key === 'maintenance_mode') return 'SECURITY'
    if (key.startsWith('session_')) return 'SESSION'
    return 'GENERAL'
}
