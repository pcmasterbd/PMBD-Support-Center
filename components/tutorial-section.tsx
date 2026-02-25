'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Video, Play, Eye, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { getTutorials, incrementVideoViewCount } from '@/lib/actions/content-actions'
import { VideoPlayer } from './video-player'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function TutorialSection() {
    const { t } = useLanguage()
    const [videos, setVideos] = useState<any[]>([])
    const [selectedVideo, setSelectedVideo] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const data = await getTutorials(4)
                setVideos(data)
            } catch (error) {
                console.error("Failed to fetch tutorials:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchVideos()
    }, [])

    const handleVideoSelect = (video: any) => {
        setSelectedVideo(video)
        if (video?.id) {
            incrementVideoViewCount(video.id)
        }
    }

    if (!loading && videos.length === 0) return null

    return (
        <section id="tutorials" className="py-20 md:py-32 px-4 relative overflow-hidden bg-zinc-950">
            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
                    <div className="space-y-4 max-w-2xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase text-[10px] font-black tracking-widest">
                            <Sparkles className="w-3.5 h-3.5" /> {t('landing.feature2Title')}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            {t('tutorialsPage.title')}
                        </h2>
                        <p className="text-zinc-400 text-sm md:text-lg font-medium leading-relaxed">
                            {t('tutorialsPage.subtitle')}
                        </p>
                    </div>

                    <Button variant="outline" className="h-12 md:h-14 px-8 rounded-xl border-white/10 text-white hover:bg-white/5 font-bold group hidden md:flex" asChild>
                        <Link href="/dashboard/tutorials">
                            {t('userDashboard.viewAll')}
                            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-video rounded-2xl bg-zinc-900 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {videos.map((video, idx) => (
                            <motion.div
                                key={video.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card
                                    className="overflow-hidden group border-white/5 bg-zinc-900/50 hover:bg-zinc-900 hover:border-primary/30 transition-all duration-300 cursor-pointer rounded-2xl shadow-2xl"
                                    onClick={() => handleVideoSelect(video)}
                                >
                                    <div className="relative aspect-video">
                                        <img
                                            src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                            alt={video.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                                                <Play className="w-5 h-5 fill-current ml-0.5" />
                                            </div>
                                        </div>
                                        {video.duration && (
                                            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold backdrop-blur-sm">
                                                {Math.floor(video.duration / 60)}:00
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[9px] font-black text-primary/80 uppercase tracking-tighter">
                                                {video.category?.name || "Tutorial"}
                                            </span>
                                            <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-bold uppercase">
                                                <Eye className="w-3 h-3" />
                                                {video.viewCount}
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-sm text-zinc-100 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                            {video.title}
                                        </h4>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-12 flex justify-center md:hidden">
                    <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 text-white hover:bg-white/5 font-bold" asChild>
                        <Link href="/dashboard/tutorials">
                            {t('userDashboard.viewAll')}
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            <VideoPlayer
                video={selectedVideo}
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                relatedVideos={videos.filter(v => v.id !== selectedVideo?.id)}
                onSelectVideo={handleVideoSelect}
            />
        </section>
    )
}
