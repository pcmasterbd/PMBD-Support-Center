import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Play, Plus, Search, MoreVertical, Eye, Clock, LayoutList, Layers, ExternalLink } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { VideoAddButton } from "@/components/admin/video-add-button";
import { VideoActionButtons } from "@/components/admin/video-action-buttons";
import { CategoryManager } from "@/components/admin/category-manager";

export default async function AdminVideosPage() {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    const [videos, categories] = await Promise.all([
        prisma.videoTutorial.findMany({
            include: {
                category: true,
                _count: {
                    select: { favorites: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.category.findMany({
            where: { type: 'VIDEO' }
        })
    ]);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">ভিডিও টিউটোরিয়াল ম্যানেজমেন্ট</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">ইউজারদের জন্য নতুন টিউটোরিয়াল যোগ এবং এডিট করুন</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <CategoryManager categories={categories} type="VIDEO" />
                    <VideoAddButton categories={categories} />
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 border-2 rounded-2xl">
                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Total Videos</p>
                    <p className="text-2xl font-black">{videos.length}</p>
                </Card>
                <Card className="p-4 border-2 rounded-2xl">
                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Categories</p>
                    <p className="text-2xl font-black">{categories.length}</p>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="ভিডিওর শিরোনাম দিয়ে সার্চ করুন..."
                            className="pl-10 h-10 rounded-xl bg-muted/50 border-transparent focus:bg-background transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2 h-9 rounded-xl font-bold uppercase text-[10px]">
                            <LayoutList className="w-4 h-4" />
                            List View
                        </Button>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {videos.map((video) => (
                        <Card key={video.id} className="overflow-hidden group border-2 rounded-2xl hover:border-primary/20 hover:shadow-lg transition-all">
                            <div className="relative aspect-video bg-muted overflow-hidden">
                                <img
                                    src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                    <Button variant="secondary" size="icon" className="rounded-full w-12 h-12 shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                                        <Play className="w-6 h-6 fill-current" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-lg font-black uppercase border border-primary/20">
                                        {video.category.name}
                                    </span>
                                    <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-black uppercase">
                                        <Eye className="w-3 h-3" />
                                        {video.viewCount} Views
                                    </div>
                                </div>
                                <h4 className="font-bold text-sm line-clamp-2 mb-4 group-hover:text-primary transition-colors leading-snug">{video.title}</h4>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed">
                                    <div className="flex items-center gap-3">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl" asChild>
                                            <Link href={`https://youtube.com/watch?v=${video.youtubeId}`} target="_blank">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                    <VideoActionButtons video={video} categories={categories} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
