'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Activity, Loader2, User } from 'lucide-react'

interface SoftwareStatsButtonProps {
    softwareId: string
    softwareName: string
}

export function SoftwareStatsButton({ softwareId, softwareName }: SoftwareStatsButtonProps) {
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState<any[] | null>(null)
    const [show, setShow] = useState(false)

    const fetchStats = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/admin/content/software/${softwareId}/stats`)
            if (!response.ok) throw new Error('Failed to fetch')
            const data = await response.json()
            setStats(data)
            setShow(true)
        } catch (error) {
            alert('Failed to fetch statistics')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={fetchStats}
                disabled={loading}
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            </Button>

            {show && stats && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background border rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold">{softwareName} - Download History</h3>
                                <p className="text-sm text-muted-foreground">Total Downloads: {stats.length}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setShow(false)}>Close</Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {stats.length === 0 ? (
                                <p className="text-center py-10 text-muted-foreground">No downloads yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {stats.map((stat, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{stat.user.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{stat.user.email} • {stat.user.serialNumber?.code}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold uppercase text-muted-foreground">Downloaded At</p>
                                                <p className="text-xs">{new Date(stat.downloadedAt).toLocaleString('bn-BD')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
