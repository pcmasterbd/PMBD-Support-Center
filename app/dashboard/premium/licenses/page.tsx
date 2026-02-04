import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Key, Copy } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'

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
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold mb-2">লাইসেন্স কী</h2>
                <p className="text-muted-foreground">
                    বিভিন্ন সফটওয়্যারের লাইসেন্স কী এবং এক্টিভেশন কোড
                </p>
            </div>

            {Object.keys(groupedLicenses).length > 0 ? (
                <div className="space-y-6">
                    {Object.entries(groupedLicenses).map(([softwareName, licenses]) => (
                        <div key={softwareName}>
                            <h3 className="text-xl font-semibold mb-3">{softwareName}</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {licenses.map((license) => (
                                    <LicenseCard key={license.id} license={license} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Card className="p-12 text-center">
                    <Key className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">এখনও কোনো লাইসেন্স কী নেই</p>
                </Card>
            )}
        </div>
    )
}

function LicenseCard({ license }: { license: any }) {
    return (
        <Card className="p-6">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Key className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                            উপলব্ধ
                        </span>
                        <CopyButton text={license.key} />
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">লাইসেন্স কী</p>
                        <p className="font-mono text-sm font-medium break-all">{license.key}</p>
                    </div>

                    <p className="text-xs text-muted-foreground mt-3">
                        যোগ করা হয়েছে: {new Date(license.createdAt).toLocaleDateString('bn-BD')}
                    </p>
                </div>
            </div>
        </Card>
    )
}
