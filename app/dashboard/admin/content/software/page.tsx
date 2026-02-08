import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Plus, HardDrive, ShieldCheck, ExternalLink, Settings, LayoutGrid, Package } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SoftwareSearch } from "@/components/admin/software-search";
import { SoftwareStatsButton } from "@/components/admin/software-stats-button";
import { SoftwareAddButton } from "@/components/admin/software-add-button";
import { SoftwareActionButtons } from "@/components/admin/software-action-buttons";
import { CategoryManager } from "@/components/admin/category-manager";

export default async function AdminSoftwarePage({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await searchParamsPromise;
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;

    const [software, categories] = await Promise.all([
        prisma.software.findMany({
            where: searchQuery ? {
                OR: [
                    { name: { contains: searchQuery } },
                    { description: { contains: searchQuery } },
                    { category: { name: { contains: searchQuery } } }
                ]
            } : {},
            include: {
                category: true,
                _count: {
                    select: { downloads: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.category.findMany({ where: { type: 'SOFTWARE' } })
    ]);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">সফটওয়্যার লাইব্রেরি ম্যানেজমেন্ট</h2>
                    <p className="text-muted-foreground">সিস্টেমের সকল সফটওয়্যার, মিরর লিঙ্ক এবং ভার্সন কন্ট্রোল করুন</p>
                </div>
                <div className="flex items-center gap-2">
                    <CategoryManager categories={categories} type="SOFTWARE" />
                    <SoftwareAddButton categories={categories} />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <SoftwareSearch />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2 h-9">
                            <LayoutGrid className="w-4 h-4" />
                            Grid View
                        </Button>
                    </div>
                </div>

                <Card className="overflow-hidden border-2 shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-4 py-3 font-bold">Software</th>
                                <th className="px-4 py-3 font-bold">Category</th>
                                <th className="px-4 py-3 font-bold">Version & Size</th>
                                <th className="px-4 py-3 font-bold">Security</th>
                                <th className="px-4 py-3 font-bold">Stats</th>
                                <th className="px-4 py-3 font-bold text-right pr-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-xs">
                            {software.map((item: any) => {
                                const fileSizeInMB = item.fileSize
                                    ? (Number(item.fileSize) / (1024 * 1024)).toFixed(2)
                                    : "N/A"
                                return (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{item.name}</span>
                                                    {item.isPremium && (
                                                        <span className="text-[9px] bg-yellow-500/10 text-yellow-600 px-1 rounded w-fit font-bold border border-yellow-200 uppercase">Premium</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold uppercase">{item.category.name}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold">v{item.version || '1.0'}</span>
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <HardDrive className="w-3 h-3" />
                                                    {fileSizeInMB} MB
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`flex items-center gap-1 font-bold ${item.checksum ? 'text-green-600' : 'text-amber-600'}`}>
                                                    <ShieldCheck className="w-3 h-3" />
                                                    {item.checksum ? 'Checksum Ready' : 'No Checksum'}
                                                </span>
                                                <span className="text-muted-foreground">{item.mirrors?.length || 0} Mirrors</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <Download className="w-3.5 h-3.5 text-blue-500" />
                                                {item.downloadCount} Total
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <SoftwareActionButtons software={item} categories={categories} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    );
}
