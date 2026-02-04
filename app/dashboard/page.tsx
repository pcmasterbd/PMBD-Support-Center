import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import {
    Shield,
    Video,
    Download,
    Key,
    Activity,
    CheckCircle2,
    Clock,
    User,
    ChevronRight,
    Search,
    LifeBuoy,
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.id) {
        return null
    }

    // Fetch user data with serial number and activities
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            serialNumber: true,
            activities: {
                take: 5,
                orderBy: { createdAt: 'desc' },
            },
            tickets: {
                where: { status: 'OPEN' },
                take: 1,
            },
            _count: {
                select: {
                    downloads: true,
                    activities: {
                        where: { action: 'WATCH' }
                    },
                    tickets: true,
                }
            }
        },
    })

    // Fetch site-wide totals for inspiration
    const [videoCount, softwareCount] = await Promise.all([
        prisma.videoTutorial.count(),
        prisma.software.count(),
    ])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'শুভ সকাল'
        if (hour < 18) return 'শুভ অপরাহ্ন'
        return 'শুভ সন্ধ্যা'
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header / Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">
                        {getGreeting()}, <span className="text-primary">{user?.name}</span>!
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        আপনার আজকের সাপোর্ট প্যানেলে স্বাগতম। আপনার প্রিমিয়াম সুবিধাগুলো উপভোগ করুন।
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/profile">
                        <Button variant="outline" size="sm" className="gap-2">
                            <User className="w-4 h-4" />
                            প্রোফাইল
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left Column: Product & Stats */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Highlight Card: Product Information */}
                    <Card className="relative overflow-hidden border-none bg-primary text-primary-foreground p-8 shadow-2xl">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <span className="font-semibold tracking-wide uppercase text-xs opacity-90">আপনার নিবন্ধিত পণ্য</span>
                            </div>

                            <div className="space-y-1 mb-8">
                                <h3 className="text-sm opacity-80">পেনড্রাইভ সিরিয়াল নম্বর</h3>
                                <div className="flex items-center gap-4">
                                    <p className="text-3xl md:text-4xl font-mono font-black tracking-tighter">
                                        {user?.serialNumber?.code || "N/A"}
                                    </p>
                                    <div className="px-2 py-1 bg-green-500 text-[10px] font-bold rounded uppercase">Verified</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                <div>
                                    <p className="text-xs opacity-70">নিবন্ধনের তারিখ</p>
                                    <p className="font-medium">{user?.serialNumber?.assignedAt ? new Date(user.serialNumber.assignedAt).toLocaleDateString('bn-BD') : 'অজানা'}</p>
                                </div>
                                <div>
                                    <p className="text-xs opacity-70">পণ্য ক্যাটাগরি</p>
                                    <p className="font-medium">Premium Support Pack</p>
                                </div>
                            </div>
                        </div>

                        {/* Abstract Background patterns */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-2xl" />
                    </Card>

                    {/* Stats Row */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <InsightCard
                            title="মোট টিউটোরিয়াল"
                            value={user?._count.activities || 0}
                            total={videoCount}
                            icon={<Video className="w-5 h-5 text-blue-500" />}
                            label="সম্পন্ন হয়েছে"
                        />
                        <InsightCard
                            title="সফটওয়্যার ডাউনলোড"
                            value={user?._count.downloads || 0}
                            icon={<Download className="w-5 h-5 text-green-500" />}
                            label="ফাইল সংরক্ষিত"
                        />
                        <InsightCard
                            title="সহায়তা টিকেট"
                            value={user?._count.tickets || 0}
                            icon={<LifeBuoy className="w-5 h-5 text-purple-500" />}
                            label="মোট অনুরোধ"
                        />
                    </div>

                    {/* Quick Access Grid */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg">দ্রুত এক্সেস</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <NavigationTile
                                href="/dashboard/tutorials"
                                title="ভিডিও গাইড"
                                description="শিখুন কিভাবে কাজ করতে হয়"
                                color="bg-blue-500"
                                icon={<Video className="w-6 h-6" />}
                            />
                            <NavigationTile
                                href="/dashboard/software"
                                title="সফটওয়্যার রিপোজিটরি"
                                description="প্রয়োজনীয় সকল টুলস এখানে"
                                color="bg-green-500"
                                icon={<Download className="w-6 h-6" />}
                            />
                            <NavigationTile
                                href="/dashboard/premium/accounts"
                                title="প্রিমিয়াম রিসোর্স"
                                description="অ্যাকাউন্ট এবং লাইসেন্স কী"
                                color="bg-purple-500"
                                icon={<Key className="w-6 h-6" />}
                            />
                            <NavigationTile
                                href="/dashboard/support"
                                title="টেকনিক্যাল সাপোর্ট"
                                description="সরাসরি কথা বলুন আমাদের সাথে"
                                color="bg-red-500"
                                icon={<LifeBuoy className="w-6 h-6" />}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar / Timeline */}
                <div className="space-y-6">

                    {/* Support Status Card */}
                    <Card className="p-5 border-l-4 border-l-orange-500">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                            <LifeBuoy className="w-4 h-4 text-orange-500" />
                            সাপোর্ট স্ট্যাটাস
                        </h4>
                        {user?.tickets && user.tickets.length > 0 ? (
                            <div className="space-y-2">
                                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-md text-sm border border-orange-100 dark:border-orange-900/50">
                                    <p className="font-medium text-orange-800 dark:text-orange-400">একটি একটিভ টিকেট আছে</p>
                                    <p className="text-xs text-orange-700/80 dark:text-orange-500/80 mt-1 line-clamp-1">"{user.tickets[0].subject}"</p>
                                </div>
                                <Link href="/dashboard/support" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
                                    টিকেট দেখুন <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-muted-foreground mb-4">আপনার কোনো পেন্ডিং টিকিট নেই। সাপোর্ট প্রয়োজন হলে যোগাযোগ করুন।</p>
                                <Link href="/dashboard/support">
                                    <Button size="sm" className="w-full">টিকেট ওপেন করুন</Button>
                                </Link>
                            </div>
                        )}
                    </Card>

                    {/* Timeline Card */}
                    <Card className="overflow-hidden flex flex-col h-full max-h-[500px]">
                        <div className="p-5 border-b bg-muted/30 flex items-center justify-between">
                            <h4 className="font-bold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                সাম্প্রতিক লগ
                            </h4>
                            <Link href="/dashboard/activity" className="text-xs text-primary hover:underline font-medium">সব দেখুন</Link>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-6">
                            {user?.activities && user.activities.length > 0 ? (
                                user.activities.map((activity, idx) => (
                                    <div key={activity.id} className="relative pl-6 pb-6 last:pb-0">
                                        {/* Vertical connector line */}
                                        {idx !== user.activities.length - 1 && (
                                            <div className="absolute left-[3px] top-[14px] bottom-[-22px] w-[2px] bg-muted-foreground/20" />
                                        )}
                                        {/* Dot */}
                                        <div className="absolute left-0 top-[6px] w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10" />

                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold leading-none">{activity.action}</p>
                                            {activity.details && (
                                                <p className="text-xs text-muted-foreground leading-snug">{activity.details}</p>
                                            )}
                                            <p className="text-[10px] text-muted-foreground/80 pt-1">
                                                {new Date(activity.createdAt).toLocaleString('bn-BD', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    day: '2-digit',
                                                    month: 'short'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-40 flex flex-col items-center justify-center text-center">
                                    <Activity className="w-8 h-8 text-muted/30 mb-2" />
                                    <p className="text-sm text-muted-foreground">কোনো রেকর্ড নেই</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function InsightCard({ title, value, total, icon, label }: { title: string, value: number, total?: number, icon: React.ReactNode, label: string }) {
    return (
        <Card className="p-4 hover:border-primary/50 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-muted rounded-lg">{icon}</div>
                {total && (
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {Math.round((value / total) * 100)}% অগ্রতি
                    </span>
                )}
            </div>
            <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">{title}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{value}</span>
                    <span className="text-[10px] text-muted-foreground">{label}</span>
                </div>
            </div>
        </Card>
    )
}

function NavigationTile({ href, title, description, color, icon }: { href: string, title: string, description: string, color: string, icon: React.ReactNode }) {
    return (
        <Link href={href}>
            <div className="group relative p-4 rounded-xl border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer h-full">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${color} text-white transition-transform group-hover:scale-110`}>
                        {icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm tracking-tight">{title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
                    </div>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-primary" />
                </div>
            </div>
        </Link>
    )
}

function Button({ className, variant, size, children, ...props }: any) {
    const variants: any = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    }
    const sizes: any = {
        sm: "h-9 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8",
    }

    return (
        <button
            className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${variants[variant || 'primary']} ${sizes[size || 'md']} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
