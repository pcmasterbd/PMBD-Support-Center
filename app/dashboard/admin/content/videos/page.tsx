import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Video,
    Play,
    Plus,
    Search,
    MoreVertical,
    Eye,
    Clock,
    LayoutList,
    Layers,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";

export default async function AdminVideosPage() {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    const videos = await prisma.videoTutorial.findMany({
        include: {
            category: true,
            _count: {
                select: { favorites: true }
            }
        },
        orderBy: { createdAt: 'desc' },
    });

    const categories = await prisma.category.findMany({
        where: { type: 'VIDEO' }
    });

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">ভিডিও টিউটোরিয়াল ম্যানেজমেন্ট</h2>
                    <p className="text-muted-foreground">ইউজারদের জন্য নতুন টিউটোরিয়াল যোগ এবং এডিট করুন</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Layers className="w-4 h-4" />
                        Manage Categories
                    </Button>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Video
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
                <Card className="p-4 border-2">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Total Videos</p>
                    <p className="text-2xl font-extrabold">{videos.length}</p>
                </Card>
                <Card className="p-4 border-2">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Categories</p>
                    <p className="text-2xl font-extrabold">{categories.length}</p>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="ভিডিওর শিরোনাম দিয়ে সার্চ করুন..." className="pl-9" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2 h-9">
                            <LayoutList className="w-4 h-4" />
                            List View
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <Card key={video.id} className="overflow-hidden group border-2 hover:border-primary/20 transition-all">
                            <div className="relative aspect-video bg-muted">
                                <img
                                    src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="secondary" size="icon" className="rounded-full w-12 h-12">
                                        <Play className="w-6 h-6 fill-current" />
                                    </Button>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                    {Math.floor((video.duration || 0) / 60)}:{(video.duration || 0) % 60}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase">
                                        {video.category.name}
                                    </span>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
                                        <Eye className="w-3 h-3" />
                                        {video.viewCount} Views
                                    </div>
                                </div>
                                <h4 className="font-bold text-sm line-clamp-2 mb-4 group-hover:text-primary transition-colors">{video.title}</h4>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                                    <div className="flex items-center gap-3">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                                            <Link href={`/dashboard/admin/content/videos/${video.id}`}>
                                                <MoreVertical className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                                            <Link href={`https://youtube.com/watch?v=${video.youtubeId}`} target="_blank">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button size="sm" variant="ghost" className="text-xs h-8">Edit Video</Button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {/* Add New Placeholder */}
                    <Link href="/dashboard/admin/content/videos/new">
                        <Card className="h-full aspect-square md:aspect-auto flex flex-col items-center justify-center border-dashed border-2 hover:bg-muted/50 transition-all cursor-pointer group p-10">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <span className="font-bold text-muted-foreground group-hover:text-primary">নতুন ভিডিও যোগ করুন</span>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
