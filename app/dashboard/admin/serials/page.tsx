import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Hash,
    CheckCircle2,
    XCircle,
    Calendar,
    User,
    Search,
    Download,
    Upload,
    MoreVertical,
    History
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BulkGenerateButton } from "@/components/admin/bulk-generate-button";
import { SerialSearch } from "@/components/admin/serials-search";
import { BulkImportSerials } from "@/components/admin/bulk-import-serials";
import { SerialAddButton } from "@/components/admin/serial-add-button";
import { SerialActionButtons } from "@/components/admin/serial-action-buttons";

export default async function AdminSerialsPage({
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

    const serials = await prisma.serialNumber.findMany({
        where: searchQuery ? {
            code: {
                contains: searchQuery,
            }
        } : {},
        include: {
            user: {
                select: { name: true, email: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    const totalSerials = await prisma.serialNumber.count();
    const activatedSerials = await prisma.serialNumber.count({ where: { status: 'ASSIGNED' } });
    const unusedSerials = totalSerials - activatedSerials;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">সিরিয়াল নম্বর ম্যানেজমেন্ট</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">পেনড্রাইভের সিরিয়াল নম্বর যোগ এবং অ্যাক্টিভেশন ট্রাক করুন</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <BulkImportSerials />
                    <BulkGenerateButton />
                    <SerialAddButton />
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 border-2 rounded-2xl">
                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Total Generated</p>
                    <p className="text-2xl font-black">{totalSerials}</p>
                </Card>
                <Card className="p-4 border-2 border-green-100 dark:border-green-500/20 bg-green-50/10 rounded-2xl">
                    <p className="text-[10px] text-green-600 uppercase font-black mb-1">Activated</p>
                    <p className="text-2xl font-black text-green-700 dark:text-green-400">{activatedSerials}</p>
                </Card>
                <Card className="p-4 border-2 border-blue-100 dark:border-blue-500/20 bg-blue-50/10 rounded-2xl">
                    <p className="text-[10px] text-blue-600 uppercase font-black mb-1">Available</p>
                    <p className="text-2xl font-black text-blue-700 dark:text-blue-400">{unusedSerials}</p>
                </Card>
                <Card className="p-4 border-2 rounded-2xl">
                    <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Activation Rate</p>
                    <p className="text-2xl font-black">{totalSerials > 0 ? ((activatedSerials / totalSerials) * 100).toFixed(1) : 0}%</p>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <SerialSearch />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2 h-9">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                    </div>
                </div>

                <div className="md:hidden space-y-4">
                    {serials.map((serial) => (
                        <Card key={serial.id} className="p-4 border-2 rounded-2xl hover:border-primary/20 transition-all duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-muted rounded">
                                        <Hash className="w-3 h-3 text-muted-foreground" />
                                    </div>
                                    <span className="font-mono font-bold text-sm tracking-widest">{serial.code}</span>
                                </div>
                                <SerialActionButtons serial={serial} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pb-4 mb-4 border-b border-muted/50">
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Status</span>
                                    {serial.status === 'ASSIGNED' ? (
                                        <span className="flex items-center gap-1.5 text-green-600 font-bold text-[10px] uppercase">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Activated
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-blue-500 font-bold text-[10px] uppercase">
                                            <XCircle className="w-3.5 h-3.5" />
                                            {serial.status}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Date</span>
                                    {serial.assignedAt && serial.status === 'ASSIGNED' ? (
                                        <div className="flex items-center gap-1.5 text-xs font-medium">
                                            <Calendar className="w-3 h-3 text-muted-foreground" />
                                            {new Date(serial.assignedAt).toLocaleDateString('bn-BD')}
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground">—</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Activated By</span>
                                {serial.user ? (
                                    <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-[10px] uppercase">
                                            {serial.user.name?.slice(0, 2)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs">{serial.user.name}</span>
                                            <span className="text-[9px] text-muted-foreground truncate max-w-[150px]">{serial.user.email}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-[10px] text-muted-foreground italic bg-muted/30 px-3 py-2 rounded-xl block w-full">Not yet activated</span>
                                )}
                            </div>
                        </Card>
                    ))}
                    {serials.length === 0 && (
                        <Card className="p-8 text-center border-2 border-dashed rounded-2xl">
                            <Hash className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">কোনো সিরিয়াল পাওয়া যায়নি।</p>
                        </Card>
                    )}
                </div>

                <Card className="hidden md:block overflow-hidden border-2 shadow-sm rounded-2xl">
                    <div className="overflow-x-auto customize-scrollbar">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-4 py-3 font-bold">Serial Code</th>
                                    <th className="px-4 py-3 font-bold">Status</th>
                                    <th className="px-4 py-3 font-bold">Activated By</th>
                                    <th className="px-4 py-3 font-bold">Activation Date</th>
                                    <th className="px-4 py-3 font-bold text-right pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {serials.map((serial) => (
                                    <tr key={serial.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-muted rounded">
                                                    <Hash className="w-3 h-3 text-muted-foreground" />
                                                </div>
                                                <span className="font-mono font-bold text-sm tracking-widest">{serial.code}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {serial.status === 'ASSIGNED' ? (
                                                <span className="flex items-center gap-1.5 text-green-600 font-bold text-[10px] uppercase">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Activated
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-blue-500 font-bold text-[10px] uppercase">
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    {serial.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {serial.user ? (
                                                <div className="flex flex-col">
                                                    <span className="font-bold flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {serial.user.name}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground ml-4">{serial.user.email}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">Not yet activated</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {serial.assignedAt && serial.status === 'ASSIGNED' ? (
                                                <div className="flex items-center gap-2 text-xs font-medium">
                                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                                    {new Date(serial.assignedAt).toLocaleDateString('bn-BD')}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <SerialActionButtons serial={serial} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
