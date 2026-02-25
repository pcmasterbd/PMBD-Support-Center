// This file is edge-compatible (no Prisma, no bcrypt)
import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            const isActivatePage = nextUrl.pathname === '/activate'
            const isExpiredPage = nextUrl.pathname === '/expired'
            const isAdmin = auth?.user?.role === 'ADMIN' || auth?.user?.role === 'SUPERADMIN'

            if (isOnDashboard || isActivatePage || isExpiredPage) {
                if (isLoggedIn) {
                    const hasSerial = !!(auth.user as any).serialId
                    const expiresAt = (auth.user as any).expiresAt ? new Date((auth.user as any).expiresAt) : null
                    const isExpired = expiresAt && expiresAt < new Date()

                    // Admin has full access
                    if (isAdmin) {
                        if (nextUrl.pathname === '/dashboard' || isActivatePage || isExpiredPage) {
                            return Response.redirect(new URL('/dashboard/admin', nextUrl.toString()))
                        }
                        return true
                    }

                    // Expired account handling
                    if (isExpired && !isExpiredPage) {
                        return Response.redirect(new URL('/expired', nextUrl.toString()))
                    }

                    // Activation handling
                    if (!hasSerial && !isActivatePage) {
                        return Response.redirect(new URL('/activate', nextUrl.toString()))
                    }

                    // Prevent accessing activate/expired if already active and not expired
                    if (hasSerial && !isExpired && (isActivatePage || isExpiredPage)) {
                        return Response.redirect(new URL('/dashboard', nextUrl.toString()))
                    }

                    const isSuperAdminRoute = nextUrl.pathname.startsWith('/dashboard/superadmin')
                    const isSuperAdmin = auth?.user?.role === 'SUPERADMIN'

                    if (isSuperAdminRoute && !isSuperAdmin) {
                        return Response.redirect(new URL('/dashboard', nextUrl.toString()))
                    }

                    return true
                }
                return false // Not logged in, redirect to login
            } else if (isLoggedIn) {
                // Already logged in, redirect away from landing/login/register to appropriate dashboard
                const target = isAdmin ? '/dashboard/admin' : '/dashboard'
                if (nextUrl.pathname === '/login' || nextUrl.pathname === '/register' || nextUrl.pathname === '/') {
                    return Response.redirect(new URL(target, nextUrl.toString()))
                }
                return true
            }
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.avatarUrl = (user as any).avatarUrl
                token.serialId = (user as any).serialId
                token.expiresAt = (user as any).expiresAt
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.avatarUrl = token.avatarUrl as string | null
                (session.user as any).serialId = (token as any).serialId;
                (session.user as any).expiresAt = (token as any).expiresAt;
            }
            return session
        },
    },
    providers: [], // Empty array for middleware, providers added in auth.ts
} satisfies NextAuthConfig
