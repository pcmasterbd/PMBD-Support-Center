import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { authConfig } from './auth.config'
import { prisma } from '@/lib/prisma'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma) as any,
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
                            { phone: identifier }
                        ]
                    },
                    include: { serialNumber: true }
                })

                if (!user) {
                    // Try by serial code
                    user = await prisma.user.findFirst({
                        where: {
                            serialNumber: {
                                code: identifier
                            }
                        },
                        include: { serialNumber: true }
                    })
                }

                if (!user || !user.passwordHash) {
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
                    avatarUrl: user.avatarUrl,
                    serialId: user.serialId,
                    expiresAt: user.serialNumber?.expiresAt?.toISOString() || null,
                }
            },
        }),
    ],
    session: { strategy: 'jwt' },
})
