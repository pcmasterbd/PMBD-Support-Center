'use client'

import { useState, useEffect } from "react"
import { Bell, Check, Loader2, Info, AlertTriangle, Video, Download } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount
} from "@/lib/actions/notification-actions"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export function NotificationBell() {
    const { t } = useLanguage()
    const [notifications, setNotifications] = useState<any[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const fetchNotifications = async () => {
        const result = await getUserNotifications()
        if (result.success && result.data) {
            setNotifications(result.data)
        }
        const count = await getUnreadNotificationCount()
        setUnreadCount(count)
    }

    useEffect(() => {
        fetchNotifications()
        // Poll every 1 minute for new notifications
        const interval = setInterval(fetchNotifications, 60000)
        return () => clearInterval(interval)
    }, [])

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        await markNotificationAsRead(id)
        fetchNotifications()
    }

    const handleMarkAllAsRead = async () => {
        setLoading(true)
        await markAllNotificationsAsRead()
        await fetchNotifications()
        setLoading(false)
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'SOFTWARE': return <Download className="w-4 h-4 text-blue-500" />
            case 'VIDEO': return <Video className="w-4 h-4 text-purple-500" />
            case 'ANNOUNCEMENT': return <Info className="w-4 h-4 text-primary" />
            case 'EXPIRATION_WARNING': return <AlertTriangle className="w-4 h-4 text-orange-500" />
            default: return <Bell className="w-4 h-4 text-muted-foreground" />
        }
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                    <Bell className="w-5 h-5 transition-transform group-hover:scale-110" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px] animate-in zoom-in"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 border-2 select-none">
                <DropdownMenuLabel className="p-4 flex items-center justify-between bg-muted/30">
                    <span className="font-bold flex items-center gap-2">
                        <Bell className="w-4 h-4" /> {t('notifications.title')}
                    </span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[10px] font-bold uppercase tracking-wider hover:text-primary"
                            onClick={handleMarkAllAsRead}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Check className="w-3 h-3 mr-1" />}
                            {t('notifications.markAllAsRead')}
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="m-0" />
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Bell className="w-12 h-12 text-muted/20 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground font-medium">{t('notifications.noNotifications')}</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <Link
                                key={notification.id}
                                href={notification.link || '#'}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-start gap-4 p-4 transition-colors hover:bg-muted/50 border-b last:border-0",
                                    !notification.isRead && "bg-primary/[0.03]"
                                )}
                            >
                                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-background border flex items-center justify-center shadow-sm">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className={cn("text-sm font-bold", !notification.isRead ? "text-foreground" : "text-muted-foreground")}>
                                            {notification.title}
                                        </h4>
                                        {!notification.isRead && (
                                            <button
                                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                className="w-2 h-2 rounded-full bg-primary flex-shrink-0"
                                                title={t('notifications.markAsRead')}
                                            />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                        {notification.message}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground/60 font-medium pt-1">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
                <DropdownMenuSeparator className="m-0" />
                <div className="p-2 bg-muted/10 text-center">
                    <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-primary" asChild>
                        <Link href="/dashboard/settings/notifications" onClick={() => setOpen(false)}>
                            {t('common.viewAll')}
                        </Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
