export const dynamic = "force-dynamic";

import { Metadata } from "next"
import { getAnalyticsData } from "@/lib/actions/superadmin/analytics-actions"
import { AnalyticsClient } from "./analytics-client"

export const metadata: Metadata = {
    title: "Analytics | Super Admin",
    description: "Platform analytics and statistics",
}

export default async function AnalyticsPage() {
    const result = await getAnalyticsData()
    const data = result.success && result.data ? result.data : {
        summary: { totalUsers: 0, totalTickets: 0, avgResolutionTime: 0, customerSatisfaction: 0 },
        newCustomers: [],
        ticketVolume: [],
        ticketCategories: []
    }

    return (
        <div className="space-y-6">
            <AnalyticsClient data={data} />
        </div>
    )
}
