'use client'

import { useState, useEffect } from "react"
import { getActiveAnnouncements } from "@/lib/actions/announcement-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, Megaphone, AlertCircle, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Announcement {
    id: string
    title: string
    message: string
    type: string
    expiresAt: Date | null
}

export function AnnouncementBanner() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const result = await getActiveAnnouncements()
            if (result.success && result.data && result.data.length > 0) {
                // Filter out dismissed announcements
                const dismissed = JSON.parse(localStorage.getItem('dismissedAnnouncements') || '[]')
                const active = result.data.filter((a: any) => !dismissed.includes(a.id))
                setAnnouncements(active)
                if (active.length > 0) setIsVisible(true)
            }
        }
        fetchAnnouncements()
    }, [])

    const handleDismiss = (id: string) => {
        const dismissed = JSON.parse(localStorage.getItem('dismissedAnnouncements') || '[]')
        localStorage.setItem('dismissedAnnouncements', JSON.stringify([...dismissed, id]))

        setAnnouncements(prev => prev.filter(a => a.id !== id))
        if (announcements.length <= 1) setIsVisible(false)
    }

    if (!isVisible || announcements.length === 0) return null

    // Show only the latest/most important announcement or stack them?
    // Let's show the first one for now to avoid clutter, or carousel?
    // Stacking is okay if few, but let's just show top one.
    const current = announcements[0]

    const getStyles = (type: string) => {
        switch (type) {
            case 'WARNING':
                return {
                    bg: "bg-destructive/15",
                    border: "border-destructive/50",
                    text: "text-destructive",
                    icon: <AlertCircle className="h-5 w-5" />
                }
            case 'UPDATE':
                return {
                    bg: "bg-blue-500/15",
                    border: "border-blue-500/50",
                    text: "text-blue-600 dark:text-blue-400",
                    icon: <Megaphone className="h-5 w-5" />
                }
            default:
                return {
                    bg: "bg-primary/10",
                    border: "border-primary/20",
                    text: "text-primary",
                    icon: <Info className="h-5 w-5" />
                }
        }
    }

    const styles = getStyles(current.type)

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="w-full"
                >
                    <div className={`w-full px-4 py-3 flex items-start sm:items-center justify-between gap-4 border-b ${styles.bg} ${styles.border}`}>
                        <div className="flex items-start sm:items-center gap-3">
                            <div className={`${styles.text} mt-0.5 sm:mt-0`}>
                                {styles.icon}
                            </div>
                            <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
                                <span className={`font-bold ${styles.text}`}>{current.title}</span>
                                <span className="hidden sm:inline text-muted-foreground/50">•</span>
                                <span className="text-sm text-foreground/80">{current.message}</span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 -mr-1 hover:bg-black/5 dark:hover:bg-white/5"
                            onClick={() => handleDismiss(current.id)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
