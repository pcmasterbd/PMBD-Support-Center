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
            const isAdmin = auth?.user?.role === 'ADMIN' || auth?.user?.role === 'SUPERADMIN'

            if (isOnDashboard) {
                if (isLoggedIn) {
                    const isSuperAdminRoute = nextUrl.pathname.startsWith('/dashboard/superadmin')
                    const isSuperAdmin = auth?.user?.role === 'SUPERADMIN'

                    if (isSuperAdminRoute && !isSuperAdmin) {
                        return Response.redirect(new URL('/dashboard', nextUrl.toString()))
                    }

                    // Force admin to landing on admin dashboard if they hit the base /dashboard
                    if (nextUrl.pathname === '/dashboard' && isAdmin) {
                        return Response.redirect(new URL('/dashboard/admin', nextUrl.toString()))
                    }
                    return true
                }
                return false
            } else if (isLoggedIn) {
                // Determine target dashboard based on role
                const target = isAdmin ? '/dashboard/admin' : '/dashboard'
                if (nextUrl.pathname === target) return true;
                return Response.redirect(new URL(target, nextUrl.toString()))
            }
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.avatarUrl = (user as any).avatarUrl
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.avatarUrl = token.avatarUrl as string | null
            }
            return session
        },
    },
    providers: [], // Empty array for middleware, providers added in auth.ts
} satisfies NextAuthConfig
