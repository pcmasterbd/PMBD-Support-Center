import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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
                    // Force admin to landing on admin dashboard if they hit the base /dashboard
                    if (nextUrl.pathname === '/dashboard' && isAdmin) {
                        return Response.redirect(new URL('/dashboard/admin', nextUrl))
                    }
                    return true
                }
                return false
            } else if (isLoggedIn) {
                // Determine target dashboard based on role
                const target = isAdmin ? '/dashboard/admin' : '/dashboard'
                return Response.redirect(new URL(target, nextUrl))
            }
            return true
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
            }
            return session
        },
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const { identifier, password } = credentials as {
                    identifier: string
                    password: string
                }

                if (!identifier || !password) {
                    return null
                }

                // Try to find user by Email, Phone, or Serial Number
                let user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: identifier },
                            { phone: identifier },
                            { serialNumber: { code: identifier } }
                        ]
                    }
                })

                if (!user) {
                    return null
                }

                if (!user.passwordHash) {
                    return null
                }

                const passwordsMatch = await bcrypt.compare(password, user.passwordHash)

                if (!passwordsMatch) {
                    return null
                }

                // PRD Requirement: Check for active status
                if (!user.isActive) {
                    throw new Error("আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে।")
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
        }),
    ],
} satisfies NextAuthConfig
