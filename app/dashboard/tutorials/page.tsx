import { prisma } from '@/lib/prisma'
import { TutorialList } from '@/components/tutorial-list'

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
        <div className="space-y-6 pb-10">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-extrabold tracking-tight">ভিডিও টিউটোরিয়াল</h2>
                <p className="text-muted-foreground">
                    বাংলায় সম্পূর্ণ গাইড - Windows, Linux এবং আরও অনেক কিছু
                </p>
            </div>

            <TutorialList categories={categories} />
        </div>
    )
}
