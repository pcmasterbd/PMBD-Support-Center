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
    const [container, setContainer] = useState<HTMLDivElement | null>(null)
    const [api, setApi] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const contentRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        if (!isOpen || !roomName || !container) return

        let currentApi: any = null
        let timeout: any = null

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
            const domain = "meet.ffmuc.net"
            const options = {
                roomName: roomName,
                width: "100%",
                height: "100%",
                parentNode: container,
                userInfo: {
                    displayName: userName || (roomName.includes('admin') ? 'Support Agent' : 'Customer')
                },
                interfaceConfigOverwrite: {
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    DEFAULT_REMOTE_DISPLAY_NAME: 'User',
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'chat', 'raisehand',
                        'videoquality', 'tileview', 'settings', 'help'
                    ],
                    MOBILE_APP_PROMO: false,
                    ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 5000,
                },
                configOverwrite: {
                    disableThirdPartyRequests: true,
                    prejoinPageEnabled: false,
                    enableWelcomePage: false,
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    enableNoAudioDetection: true,
                    enableNoVideoDetection: true,
                    // Additional configs for better experience on community instances
                    p2p: {
                        enabled: true
                    },
                    enableLayerSuspension: true,
                    chromeExtensionBannerGraph: false,
                    disableDeepLinking: true,
                }
            }

            try {
                currentApi = new window.JitsiMeetExternalAPI(domain, options)

                currentApi.addEventListeners({
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
                        setLoading(false)
                    }
                })

                timeout = setTimeout(() => {
                    setLoading(false)
                }, 10000)

                setApi(currentApi)
            } catch (err) {
                console.error("Jitsi Init Error:", err)
                setLoading(false)
            }
        }

        initJitsi()

        return () => {
            if (currentApi) {
                currentApi.dispose()
            }
            if (timeout) {
                clearTimeout(timeout)
            }
            setApi(null)
            setLoading(true)
        }
    }, [isOpen, roomName, container])

    useEffect(() => {
        if (!isOpen) {
            setIsFullscreen(false)
        }
    }, [isOpen])

    const toggleFullscreen = async () => {
        const nextState = !isFullscreen
        setIsFullscreen(nextState)

        if (nextState && contentRef.current) {
            try {
                if (contentRef.current.requestFullscreen) {
                    await contentRef.current.requestFullscreen()
                } else if ((contentRef.current as any).webkitRequestFullscreen) {
                    await (contentRef.current as any).webkitRequestFullscreen()
                } else if ((contentRef.current as any).mozRequestFullScreen) {
                    await (contentRef.current as any).mozRequestFullScreen()
                }
            } catch (err) {
                console.error("Fullscreen Request Failed:", err)
            }
        } else if (document.fullscreenElement) {
            document.exitFullscreen()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                ref={contentRef}
                showCloseButton={false}
                className={isFullscreen
                    ? "fixed inset-0 w-screen h-[100dvh] max-w-none p-0 border-none rounded-none z-[100] translate-x-0 translate-y-0 top-0 left-0 bg-[#0a0f1d]"
                    : "max-w-4xl w-[95vw] h-[80vh] md:h-[80vh] h-[90dvh] p-0 overflow-hidden border-2 shadow-2xl bg-[#0a0f1d]"
                }>
                <DialogHeader className={`absolute top-0 left-0 right-0 z-50 flex flex-row items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/10 pointer-events-none transition-all duration-300 ${isFullscreen ? 'p-2 md:p-4' : 'p-4'}`}>
                    <div className="flex flex-col gap-0.5 pointer-events-auto">
                        <DialogTitle className="text-white font-black tracking-tight flex items-center gap-2 text-sm md:text-base">
                            <div className="relative flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping absolute" />
                                <div className="w-2.5 h-2.5 bg-red-500 rounded-full relative" />
                            </div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                                {t('videoCall.join')}
                            </span>
                        </DialogTitle>
                        <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-emerald-400 font-bold tracking-widest uppercase">
                            <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                            {isFullscreen ? "Full Access Mode" : "Secure Call"}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 pointer-events-auto">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full w-8 h-8 md:w-9 md:h-9 transition-colors" onClick={toggleFullscreen}>
                            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Maximize2 className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-red-500/20 hover:text-red-400 rounded-full w-8 h-8 md:w-9 md:h-9 transition-colors" onClick={onClose}>
                            <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    {/* Animated background glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none animate-pulse" />

                    {loading && (
                        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#0a0f1d]/90 backdrop-blur-sm gap-4 md:gap-6 p-4">
                            <div className="relative">
                                <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
                                <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-primary animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <div className="flex flex-col items-center gap-1 md:gap-2 text-center">
                                <p className="text-white text-lg md:text-xl font-black tracking-tight animate-pulse">{t('videoCall.connecting')}</p>
                                <p className="text-white/40 text-[9px] md:text-xs font-medium uppercase tracking-[0.2em]">Cross-Device Optimization Active</p>
                            </div>
                        </div>
                    )}
                    <div ref={setContainer} className="w-full h-full relative z-10 transition-opacity duration-700" style={{ opacity: loading ? 0 : 1 }} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
