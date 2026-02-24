import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    const client = new PrismaClient({
        log: ['query', 'error', 'warn'],
    })

    // Test connection on creation
    client.$connect()
        .then(() => console.log('[Prisma] Successfully connected to database'))
        .catch((err) => console.error('[Prisma] FAILED to connect to database:', err.message))

    return client
}

declare global {
    var prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
