import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, HardDrive, Star } from 'lucide-react'

export default async function SoftwarePage() {
    const session = await auth()

    const categories = await prisma.category.findMany({
        where: { type: 'SOFTWARE' },
        include: {
            software: {
                orderBy: { createdAt: 'desc' },
            },
        },
        orderBy: { displayOrder: 'asc' },
    })

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold mb-2">সফটওয়্যার ডাউনলোড</h2>
                <p className="text-muted-foreground">
                    প্রয়োজনীয় সকল সফটওয়্যার এবং টুলস এক জায়গায়
                </p>
            </div>

            {categories.map((category) => (
                <div key={category.id}>
                    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        {category.icon && <span>{category.icon}</span>}
                        {category.name}
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.software.map((software) => (
                            <SoftwareCard
                                key={software.id}
                                software={software}
                                userId={session?.user?.id}
                            />
                        ))}
                    </div>

                    {category.software.length === 0 && (
                        <Card className="p-8 text-center text-muted-foreground">
                            এই ক্যাটাগরিতে এখনও কোনো সফটওয়্যার নেই
                        </Card>
                    )}
                </div>
            ))}

            {categories.length === 0 && (
                <Card className="p-12 text-center">
                    <Download className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">এখনও কোনো সফটওয়্যার নেই</p>
                </Card>
            )}
        </div>
    )
}

function SoftwareCard({ software, userId }: { software: any; userId?: string }) {
    const fileSizeInMB = software.fileSize
        ? (Number(software.fileSize) / (1024 * 1024)).toFixed(2)
        : null

    return (
        <Card className="p-6 hover:shadow-lg transition-all border-2 hover:border-primary/20 group relative overflow-hidden">
            <div className="flex items-start gap-4 relative z-10">
                {software.iconUrl ? (
                    <img
                        src={software.iconUrl}
                        alt={software.name}
                        className="w-12 h-12 rounded-lg object-contain bg-background border"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Download className="w-6 h-6 text-primary" />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{software.name}</h4>
                        <div className="flex items-center gap-1">
                            {software.isPremium && (
                                <span className="bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-yellow-200">Premium</span>
                            )}
                            <button className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-red-500">
                                <Star className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                        {software.version && (
                            <span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground border">V{software.version}</span>
                        )}
                        {fileSizeInMB && (
                            <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                <HardDrive className="w-3 h-3" />
                                {fileSizeInMB} MB
                            </span>
                        )}
                    </div>

                    {software.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                            {software.description}
                        </p>
                    )}

                    {software.checksum && (
                        <div className="mb-4 pb-4 border-b">
                            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">MD5 Checksum</p>
                            <code className="text-[10px] bg-muted block p-1.5 rounded font-mono truncate cursor-help" title={software.checksum}>
                                {software.checksum}
                            </code>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Button className="w-full gap-2" asChild>
                            <a href={software.fileUrl} download>
                                <Download className="w-4 h-4" />
                                ডাউনলোড (Direct)
                            </a>
                        </Button>

                        {software.mirrors && software.mirrors.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                                {software.mirrors.map((mirror: string, idx: number) => (
                                    <Button key={idx} variant="outline" size="sm" className="text-[10px] h-8" asChild>
                                        <a href={mirror} target="_blank" rel="noopener noreferrer">
                                            Mirror {idx + 1}
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{software.downloadCount} বার ডাউনলোড হয়েছে</span>
                        <div className="flex items-center gap-1 text-green-600 font-bold uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            নির্ভরযোগ্য
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle background wash for premium */}
            {software.isPremium && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 -mr-16 -mt-16 rounded-full blur-2xl" />
            )}
        </Card>
    )
}
