'use client'

import { useEffect, useRef, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, X, Maximize2, Minimize2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface VideoCallModalProps {
    roomName: string | null
    isOpen: boolean
    onClose: () => void
    userName: string
}

declare global {
    interface Window {
        JitsiMeetExternalAPI: any
    }
}

export function VideoCallModal({ roomName, isOpen, onClose, userName }: VideoCallModalProps) {
    const { t } = useLanguage()
    const jitsiContainerRef = useRef<HTMLDivElement>(null)
    const [api, setApi] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        if (!isOpen || !roomName || !jitsiContainerRef.current) return

        const loadJitsiScript = () => {
            return new Promise<void>((resolve) => {
                if (window.JitsiMeetExternalAPI) {
                    resolve()
                    return
                }
                const script = document.createElement("script")
                script.src = "https://meet.jit.si/external_api.js"
                script.async = true
                script.onload = () => resolve()
                document.body.appendChild(script)
            })
        }

        const initJitsi = async () => {
            await loadJitsiScript()

            setLoading(true)
            const domain = "meet.jit.si"
            const options = {
                roomName: roomName,
                width: "100%",
                height: "100%",
                parentNode: jitsiContainerRef.current,
                userInfo: {
                    displayName: userName
                },
                interfaceConfigOverwrite: {
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    DEFAULT_REMOTE_DISPLAY_NAME: 'User',
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                        'security'
                    ],
                },
                configOverwrite: {
                    disableThirdPartyRequests: true,
                    prejoinPageEnabled: false,
                    enableWelcomePage: false,
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    enableNoAudioDetection: true,
                    enableNoVideoDetection: true,
                }
            }

            try {
                const newApi = new window.JitsiMeetExternalAPI(domain, options)

                newApi.addEventListeners({
                    readyToClose: () => {
                        onClose()
                    },
                    videoConferenceJoined: () => {
                        setLoading(false)
                    },
                    videoConferenceLeft: () => {
                        onClose()
                    },
                    participantJoined: () => {
                        // Sometimes joined event doesn't fire as expected,
                        // so we catch participant join to hide loader too
                        setLoading(false)
                    }
                })

                // Safety timeout to hide loader if events fail
                const timeout = setTimeout(() => {
                    setLoading(false)
                }, 10000)

                setApi(newApi)
                return () => clearTimeout(timeout)
            } catch (err) {
                console.error("Jitsi Init Error:", err)
                setLoading(false)
            }
        }

        const cleanup = initJitsi()

        return () => {
            if (api) {
                api.dispose()
            }
            // If cleanup is a function (from initJitsi), call it
            if (typeof cleanup === 'function') {
                (cleanup as any)()
            }
        }
    }, [isOpen, roomName])

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={isFullscreen
                ? "fixed inset-0 w-screen h-screen max-w-none p-0 border-none rounded-none z-[100]"
                : "max-w-4xl w-[95vw] h-[80vh] p-0 overflow-hidden border-2 shadow-2xl"
            }>
                <DialogHeader className="absolute top-0 left-0 right-0 z-50 p-4 flex flex-row items-center justify-between bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
                    <DialogTitle className="text-white font-black tracking-tight flex items-center gap-2 pointer-events-auto">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        {t('videoCall.join')}
                    </DialogTitle>
                    <div className="flex items-center gap-2 pointer-events-auto">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleFullscreen}>
                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                    {loading && (
                        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-900 gap-4">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <p className="text-white font-bold animate-pulse">{t('videoCall.connecting')}</p>
                        </div>
                    )}
                    <div ref={jitsiContainerRef} className="w-full h-full" />
                </div>
            </DialogContent>
        </Dialog>
    )
}
