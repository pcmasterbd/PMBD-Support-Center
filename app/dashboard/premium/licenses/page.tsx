import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Key, Copy, ShieldCheck } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { LicenseKey } from '@prisma/client'

export default async function LicenseKeysPage() {
    const licenses = await prisma.licenseKey.findMany({
        where: { status: 'AVAILABLE' },
        orderBy: { softwareName: 'asc' },
    })

    // Group licenses by software name
    const groupedLicenses = licenses.reduce((acc, license) => {
        if (!acc[license.softwareName]) {
            acc[license.softwareName] = []
        }
        acc[license.softwareName].push(license)
        return acc
    }, {} as Record<string, typeof licenses>)

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-extrabold tracking-tight">লাইসেন্স কী</h2>
                <p className="text-muted-foreground">
                    বিভিন্ন সফটওয়্যারের লাইসেন্স কী এবং এক্টিভেশন কোড
                </p>
            </div>

            {Object.keys(groupedLicenses).length > 0 ? (
                <div className="space-y-10">
                    {Object.entries(groupedLicenses).map(([softwareName, licenses]) => (
                        <div key={softwareName} className="space-y-4">
                            <h3 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                {softwareName}
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {licenses.map((license) => (
                                    <LicenseCard key={license.id} license={license} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Card className="p-16 text-center border-2 border-dashed bg-muted/20 rounded-3xl">
                    <Key className="w-16 h-16 mx-auto mb-4 text-muted/30" />
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">এখনও কোনো লাইসেন্স কী নেই</p>
                </Card>
            )}
        </div>
    )
}

function LicenseCard({ license }: { license: LicenseKey }) {
    return (
        <Card className="p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-primary/20 group relative overflow-hidden">
            <div className="flex items-start gap-4 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Key className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between mb-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-green-500 text-white shadow-lg shadow-green-500/20">
                            Available
                        </span>
                        <CopyButton text={license.key} />
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border-2 border-dashed group-hover:border-primary/30 transition-colors">
                        <p className="text-[10px] text-muted-foreground mb-2 font-black uppercase tracking-widest opacity-70">License Key</p>
                        <p className="font-mono text-xs font-bold break-all leading-relaxed bg-white/50 p-2 rounded border">{license.key}</p>
                    </div>

                    <p className="text-[9px] text-muted-foreground mt-4 font-bold uppercase opacity-50">
                        Added: {new Date(license.createdAt).toLocaleDateString('bn-BD')}
                    </p>
                </div>
            </div>

            {/* Background pattern */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
        </Card>
    )
}
