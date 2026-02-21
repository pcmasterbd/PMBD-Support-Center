'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center p-6">
            <div className="p-4 bg-destructive/10 rounded-full">
                <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">Something went wrong!</h2>
                <p className="text-muted-foreground max-w-[500px]">
                    We encountered an error while loading this page. This might be a temporary issue.
                </p>
            </div>
            <div className="flex gap-2">
                <Button onClick={() => reset()} variant="default">
                    Try again
                </Button>
                <Button onClick={() => window.location.href = '/dashboard'} variant="outline">
                    Go to Dashboard
                </Button>
            </div>
        </div>
    )
}
