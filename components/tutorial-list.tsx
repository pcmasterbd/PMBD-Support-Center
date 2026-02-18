'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Video, Clock, Eye, Play, Sparkles, ChevronRight, Lock, LayoutGrid } from 'lucide-react'
import { VideoPlayer } from './video-player'
import { cn } from '@/lib/utils'

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

interface Category {
    id: string
    name: string
    icon: string | null
    videos: Video[]
}

interface TutorialListProps {
    categories: Category[]
}

export function TutorialList({ categories }: TutorialListProps) {
    const [selectedVideo, setSelectedVideo] = useState<any>(null)
    const [activeCategory, setActiveCategory] = useState<string>('all')

    // Find the first video to use as featured if available
    const featuredVideo = useMemo(() => {
        for (const cat of categories) {
            if (cat.videos && cat.videos.length > 0) {
                return cat.videos[0]
            }
        }
        return null
    }, [categories])

    const filteredCategories = useMemo(() => {
        if (activeCategory === 'all') return categories
        return categories.filter(cat => cat.id === activeCategory)
    }, [categories, activeCategory])

    return (
        <div className="space-y-10 pb-20">
            {/* Simple & Elegant Hero Section */}
            {featuredVideo && (
                <div
                    className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[21/7] rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer shadow-xl bg-zinc-950 border border-white/10"
                    onClick={() => setSelectedVideo(featuredVideo)}
                >
                    <img
                        src={featuredVideo.thumbnailUrl || `https://img.youtube.com/vi/${featuredVideo.youtubeId}/maxresdefault.jpg`}
                        alt={featuredVideo.title}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute inset-0 p-4 sm:p-6 md:p-12 flex flex-col justify-end max-w-4xl space-y-2 sm:space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider border border-primary/20 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" /> আজকেই বিশেষ
                            </div>
                            {featuredVideo.isPremium && (
                                <div className="bg-amber-500/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-amber-500 uppercase tracking-wider border border-amber-500/20 flex items-center gap-1.5">
                                    <Lock className="w-3 h-3" /> প্রিমিয়াম
                                </div>
                            )}
                        </div>

                        <h2 className="text-lg sm:text-2xl md:text-5xl font-bold text-white leading-tight tracking-tight line-clamp-2">
                            {featuredVideo.title}
                        </h2>

                        <p className="text-zinc-300 text-xs sm:text-sm md:text-lg line-clamp-2 max-w-2xl font-normal leading-relaxed hidden xs:block">
                            {featuredVideo.description}
                        </p>

                        <div className="flex items-center gap-4 pt-2">
                            <button className="flex items-center gap-1.5 sm:gap-2 bg-primary text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                <Play className="w-4 h-4 fill-current" /> এখনই দেখুন
                            </button>

                            <div className="hidden md:flex items-center gap-4 text-zinc-400 font-medium text-xs">
                                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {featuredVideo.viewCount.toLocaleString()} ভিউ</span>
                                {featuredVideo.duration && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {Math.floor(featuredVideo.duration / 60)} মিনিট</span>}
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                            <Play className="w-8 h-8 text-white fill-current" />
                        </div>
                    </div>
                </div>
            )}

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl sm:rounded-2xl w-fit max-w-full overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={cn(
                        "flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap",
                        activeCategory === 'all'
                            ? "bg-white dark:bg-zinc-800 text-primary shadow-sm ring-1 ring-black/5"
                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                    )}
                >
                    <LayoutGrid className="w-4 h-4" /> সব টিউটোরিয়াল
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                            "flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap",
                            activeCategory === cat.id
                                ? "bg-white dark:bg-zinc-800 text-primary shadow-sm ring-1 ring-black/5"
                                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                        )}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Tutorials Grid */}
            <div className="space-y-12">
                {filteredCategories.map((category) => (
                    <div key={category.id} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-6 bg-primary rounded-full" />
                                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    {category.name}
                                </h3>
                                <span className="text-xs text-zinc-500 font-medium px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                                    {category.videos.length} ভিডিও
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {category.videos.map((video: any) => (
                                <div
                                    key={video.id}
                                    className={cn(
                                        "group relative flex flex-col bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-all duration-300 hover:shadow-xl hover:border-primary/20 cursor-pointer",
                                        selectedVideo?.id === video.id ? "ring-2 ring-primary border-transparent" : ""
                                    )}
                                    onClick={() => setSelectedVideo(video)}
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                            alt={video.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                                            {video.isPremium && (
                                                <div className="px-2 py-1 rounded-md bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                                                    Premium
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium backdrop-blur-sm">
                                            {video.duration ? `${Math.floor(video.duration / 60)}:00` : 'HD'}
                                        </div>

                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                                            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                                <Play className="w-6 h-6 fill-current" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col space-y-2">
                                        <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                            {video.title}
                                        </h4>

                                        <div className="mt-auto flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {video.viewCount.toLocaleString()} ভিউ</span>
                                            <span className="flex items-center gap-1 uppercase tracking-tighter">HD • টিউটোরিয়াল</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="p-10 sm:p-20 text-center bg-zinc-900/50 rounded-2xl sm:rounded-[3rem] border border-white/5 space-y-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-primary/20">
                        <Video className="w-12 h-12 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-zinc-300 text-xl font-black">No Tutorials Found</p>
                        <p className="text-zinc-500 text-sm font-medium">Please check back later for new content.</p>
                    </div>
                </div>
            )}

            {/* Immersive Video Player (Popup) */}
            <VideoPlayer
                video={selectedVideo}
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                onSelectVideo={(video: any) => setSelectedVideo(video)}
                relatedVideos={selectedVideo ? categories.find(c => c.id === selectedVideo.categoryId)?.videos.filter((v: Video) => v.id !== selectedVideo.id) || [] : []}
            />
        </div>
    )
}
