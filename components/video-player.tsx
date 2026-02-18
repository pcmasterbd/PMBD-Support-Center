'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Play, X, Clock, Eye, Sparkles, MonitorPlay, ChevronRight, Lock } from 'lucide-react'
import { cn } from "@/lib/utils"

interface Video {
    id: string
    categoryId: string
    title: string
    description: string | null
    thumbnailUrl: string | null
    youtubeId: string
    viewCount: number
    duration: number | null
    isPremium: boolean
    displayOrder: number
}

interface VideoPlayerProps {
    video: Video | null
    isOpen: boolean
    onClose: () => void
    relatedVideos?: Video[]
    onSelectVideo?: (video: Video) => void
}

export function VideoPlayer({ video, isOpen, onClose, relatedVideos = [], onSelectVideo }: VideoPlayerProps) {
    if (!video) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[100vw] sm:max-w-[95vw] lg:max-w-[1400px] p-0 gap-0 bg-zinc-950 border-zinc-800 shadow-2xl overflow-hidden block outline-none">
                <DialogHeader className="sr-only">
                    <DialogTitle>{video.title}</DialogTitle>
                    <DialogDescription>{video.description}</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col lg:flex-row h-[95vh] sm:h-[90vh] lg:h-[85vh]">
                    {/* Main Content (Video + Details) */}
                    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-track]:bg-transparent">

                        {/* Video Wrapper - Sticky on desktop mostly, but let's keep it simple */}
                        <div className="w-full bg-black shrink-0">
                            <div className="relative aspect-video w-full">
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>

                        {/* Video Details */}
                        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                            <div className="space-y-4">
                                <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-zinc-100 leading-tight">
                                    {video.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-400 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="w-4 h-4 text-zinc-500" />
                                        <span>{video.viewCount.toLocaleString()} views</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-zinc-500" />
                                        <span>{video.duration ? Math.floor(video.duration / 60) + ' min' : 'N/A'}</span>
                                    </div>
                                    {video.isPremium && (
                                        <>
                                            <div className="w-1 h-1 rounded-full bg-zinc-700" />
                                            <span className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full text-xs border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                                                <Lock className="w-3 h-3" /> Premium
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Description</h3>
                                <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {video.description || "No description provided for this video."}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Related Videos) */}
                    <div className="w-full lg:w-[350px] xl:w-[400px] bg-zinc-900/50 border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col lg:h-full">
                        {/* Sidebar Header */}
                        <div className="p-4 lg:p-5 border-b border-white/5 flex items-center justify-between bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10">
                            <h2 className="font-bold text-zinc-100 flex items-center gap-2 text-sm uppercase tracking-wide">
                                <MonitorPlay className="w-4 h-4 text-primary" />
                                Up Next
                            </h2>
                            <button onClick={onClose} className="lg:hidden p-2 -mr-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-track]:bg-transparent">
                            {relatedVideos.map((vid) => (
                                <div
                                    key={vid.id}
                                    onClick={() => onSelectVideo?.(vid)}
                                    className="group flex gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all duration-300 border border-transparent hover:border-white/5"
                                >
                                    <div className="relative w-28 sm:w-36 aspect-video bg-black rounded-lg overflow-hidden shrink-0 shadow-lg">
                                        <img
                                            src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                                            alt={vid.title}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                            <div className="w-8 h-8 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg backdrop-blur-sm">
                                                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                            </div>
                                        </div>
                                        {vid.duration && (
                                            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                                                {Math.floor(vid.duration / 60)}:00
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 min-w-0 py-1">
                                        <h3 className="text-xs sm:text-sm font-bold text-zinc-300 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                            {vid.title}
                                        </h3>
                                        <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {vid.viewCount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {relatedVideos.length === 0 && (
                                <div className="py-20 text-center text-zinc-500 text-xs font-medium uppercase tracking-widest flex flex-col items-center gap-3 opacity-50">
                                    <Sparkles className="w-6 h-6" />
                                    No more videos
                                </div>
                            )}
                        </div>

                        {/* Close Button Footer (Mobile mostly, or decorative) */}
                        <div className="p-4 border-t border-white/5 text-center lg:hidden">
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">PMBD Support Center</p>
                        </div>
                    </div>
                </div>

                {/* Close Button (Desktop Absolute) */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2.5 rounded-full bg-black/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all hidden lg:flex items-center justify-center z-50 ring-1 ring-white/10 hover:ring-white/20 hover:scale-105 duration-200"
                >
                    <X className="w-5 h-5" />
                </button>
            </DialogContent>
        </Dialog>
    )
}
