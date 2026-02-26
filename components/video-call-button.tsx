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

    const handleJoinCall = () => {
        if (roomName) {
            setIsModalOpen(true)
        }
    }

    return (
        <>
            <Button
                variant={isAdmin ? "default" : "outline"}
                size="sm"
                className={`relative overflow-hidden gap-2 font-black uppercase tracking-wider transition-all duration-300 group ${isAdmin
                        ? 'bg-gradient-to-r from-primary to-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] border-none text-white'
                        : 'border-2 border-primary text-primary hover:bg-primary/10 shadow-lg hover:shadow-primary/20'
                    }`}
                onClick={isAdmin ? handleStartCall : handleJoinCall}
                disabled={loading || (!isAdmin && !roomName)}
            >
                {isAdmin && (
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[20deg]" />
                )}
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : isAdmin ? (
                    <div className="relative">
                        <Video className="w-4 h-4 relative z-10" />
                        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20" />
                    </div>
                ) : (
                    <PhoneCall className="w-4 h-4 animate-bounce" />
                )}
                <span className="relative z-10">
                    {isAdmin ? t('videoCall.start') : t('videoCall.join')}
                </span>
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
