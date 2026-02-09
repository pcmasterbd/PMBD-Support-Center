import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const passwordHash = await bcrypt.hash('Admin1122', 10)

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { phone: 'pcmasterbd1122' },
        update: {
            passwordHash,
            role: 'ADMIN',
            isActive: true,
        },
        create: {
            name: 'Admin User',
            email: 'admin@pcmasterbd.com',
            phone: 'pcmasterbd1122',
            passwordHash,
            role: 'ADMIN',
            isActive: true,
        },
    })
    console.log({ admin })

    // Create User
    const user = await prisma.user.upsert({
        where: { phone: 'user1122' },
        update: {
            passwordHash,
            role: 'USER',
            isActive: true,
        },
        create: {
            name: 'Test User',
            email: 'user@pcmasterbd.com',
            phone: 'user1122',
            passwordHash,
            role: 'USER',
            isActive: true,
        },
    })
    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
