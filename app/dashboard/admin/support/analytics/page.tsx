
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { BarChart3, TrendingUp, Users, Clock, CheckCircle2, messageSquare } from "lucide-react";

export default async function SupportAnalyticsPage() {
    const session = await auth();

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')) {
        redirect('/dashboard');
    }

    // specific date ranges for trend analysis
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
        totalTickets,
        openTickets,
        resolvedTickets,
        newTicketsLast7Days,
        newTicketsLast30Days,
        topUsers
    ] = await Promise.all([
        prisma.supportTicket.count(),
        prisma.supportTicket.count({ where: { status: 'OPEN' } }),
        prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),
        prisma.supportTicket.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        prisma.supportTicket.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        // Get top 5 users with most tickets (this might need raw query if prisma groupBy not easy on relation count, but let's try simple findMany and processing)
        prisma.supportTicket.groupBy({
            by: ['userId'],
            _count: { userId: true },
            orderBy: { _count: { userId: 'desc' } },
            take: 5
        }).then(async (groups) => {
            // enrich with user details
            return await Promise.all(groups.map(async (g) => {
                const user = await prisma.user.findUnique({ where: { id: g.userId }, select: { name: true, email: true } });
                return { ...g, user };
            }));
        })
    ]);

    // Calculate resolution rate
    const resolutionRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0;

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <BarChart3 className="w-8 h-8 text-primary" />
                    Support Analytics
                </h2>
                <p className="text-muted-foreground">Detailed insights into support ticket performance and trends.</p>
            </div>

            <Separator />

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTickets}</div>
                        <p className="text-xs text-muted-foreground">
                            +{newTicketsLast7Days} in last 7 days
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{resolutionRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            {resolvedTickets} resolved out of {totalTickets}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{openTickets}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently awaiting response
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ticket Velocity</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round(newTicketsLast30Days / 30 * 10) / 10}</div>
                        <p className="text-xs text-muted-foreground">
                            Avg tickets per day (last 30 days)
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Visual Representation of Ticket Distribution */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Ticket Volume Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {/* Simple CSS Bar Chart for distribution */}
                        <div className="space-y-4 p-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Resolved</span>
                                    <span className="font-bold">{resolvedTickets}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: `${(resolvedTickets / (totalTickets || 1)) * 100}%` }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Open</span>
                                    <span className="font-bold">{openTickets}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500" style={{ width: `${(openTickets / (totalTickets || 1)) * 100}%` }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Others (Closed/In Progress)</span>
                                    <span className="font-bold">{totalTickets - openTickets - resolvedTickets}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${((totalTickets - openTickets - resolvedTickets) / (totalTickets || 1)) * 100}%` }} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Active Users */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Top Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {topUsers.map((userStats, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{userStats.user?.name || 'Unknown User'}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {userStats.user?.email}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">+{userStats._count.userId}</div>
                                </div>
                            ))}
                            {topUsers.length === 0 && <p className="text-muted-foreground text-sm">No user data available.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
