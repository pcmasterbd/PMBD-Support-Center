import { Metadata } from "next"
import { getAuditLogs, getUniqueActions } from "@/lib/actions/superadmin/audit-actions"
import { getAdmins } from "@/lib/actions/superadmin/admin-actions"
import { AuditClient } from "./audit-client"

export const metadata: Metadata = {
    title: "Audit Logs | Super Admin",
    description: "View system activity logs",
}

export default async function AuditLogsPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1
    const adminId = typeof params.adminId === 'string' ? params.adminId : undefined

    const [logsResult, actions, adminsResult] = await Promise.all([
        getAuditLogs({ page, limit: 20, adminId }),
        getUniqueActions(),
        getAdmins()
    ])

    const initialLogs = logsResult?.success ? logsResult.data : []
    const initialPagination = logsResult?.success && logsResult?.pagination ? logsResult.pagination : { total: 0, pages: 1, current: 1 }
    const admins = adminsResult?.success && adminsResult?.data ? adminsResult.data : []

    return (
        <div className="space-y-6">
            <AuditClient
                initialLogs={initialLogs as any}
                initialPagination={initialPagination}
                admins={admins.map(a => ({ id: a.id, name: a.name }))}
                actions={actions}
            />
        </div>
    )
}
