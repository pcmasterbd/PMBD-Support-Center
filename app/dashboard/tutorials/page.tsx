import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Video, Clock, Eye } from 'lucide-react'

export default async function TutorialsPage() {
    const categories = await prisma.category.findMany({
        where: { type: 'VIDEO' },
        include: {
            videos: {
                orderBy: { displayOrder: 'asc' },
            },
        },
        orderBy: { displayOrder: 'asc' },
    })

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold mb-2">ভিডিও টিউটোরিয়াল</h2>
                <p className="text-muted-foreground">
                    বাংলায় সম্পূর্ণ গাইড - Windows, Linux এবং আরও অনেক কিছু
                </p>
            </div>

            {categories.map((category) => (
                <div key={category.id}>
                    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        {category.icon && <span>{category.icon}</span>}
                        {category.name}
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.videos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>

                    {category.videos.length === 0 && (
                        <Card className="p-8 text-center text-muted-foreground">
                            এই ক্যাটাগরিতে এখনও কোনো ভিডিও নেই
                        </Card>
                    )}
                </div>
            ))}

            {categories.length === 0 && (
                <Card className="p-12 text-center">
                    <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">এখনও কোনো ভিডিও টিউটোরিয়াল নেই</p>
                </Card>
            )}
        </div>
    )
}

function VideoCard({ video }: { video: any }) {
    const thumbnailUrl = video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
            <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                <div className="relative aspect-video bg-muted">
                    <img
                        src={thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                            <Video className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    {video.isPremium && (
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                            প্রিমিয়াম
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h4 className="font-semibold mb-2 line-clamp-2">{video.title}</h4>
                    {video.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {video.description}
                        </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {video.duration && (
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{Math.floor(video.duration / 60)} মিনিট</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{video.viewCount} বার দেখা হয়েছে</span>
                        </div>
                    </div>
                </div>
            </a>
        </Card>
    )
}
