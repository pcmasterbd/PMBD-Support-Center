'use client'

import { useState, useEffect } from "react"
import { Video, Loader2, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoCallModal } from "./video-call-modal"
import { createMeetingLink } from "@/lib/actions/video-call-actions"
import { toast } from "sonner"
import { useLanguage } from "@/lib/language-context"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

interface VideoCallButtonProps {
    ticketId: string
    isAdmin: boolean
    userName: string
}

export function VideoCallButton({ ticketId, isAdmin, userName }: VideoCallButtonProps) {
    const { t } = useLanguage()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(false)
    const [roomName, setRoomName] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Check for roomId in URL (for user joining via notification)
    useEffect(() => {
        const roomId = searchParams.get('roomId')
        if (roomId) {
            setRoomName(roomId)
            setIsModalOpen(true)

            // Clean up URL without refreshing
            const newParams = new URLSearchParams(searchParams.toString())
            newParams.delete('roomId')
            const newUrl = pathname + (newParams.toString() ? `?${newParams.toString()}` : '')
            router.replace(newUrl)
        }
    }, [searchParams, pathname, router])

    const handleStartCall = async () => {
        setLoading(true)
        const result = await createMeetingLink(ticketId)
        if (result.success && result.roomName) {
            setRoomName(result.roomName)
            setIsModalOpen(true)
            toast.success("Call invitation sent to user")
        } else {
            toast.error(result.error || "Failed to start call")
        }
        setLoading(false)
    }

    return (
        <>
            <Button
                variant={isAdmin ? "default" : "outline"}
                size="sm"
                className={`gap-2 font-bold ${isAdmin ? 'bg-primary' : 'border-primary text-primary hover:bg-primary/5'}`}
                onClick={isAdmin ? handleStartCall : undefined}
                disabled={loading || (!isAdmin && !roomName)}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : isAdmin ? (
                    <Video className="w-4 h-4" />
                ) : (
                    <PhoneCall className="w-4 h-4" />
                )}
                {isAdmin ? t('videoCall.start') : t('videoCall.join')}
            </Button>

            <VideoCallModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                roomName={roomName}
                userName={userName}
            />
        </>
    )
}
