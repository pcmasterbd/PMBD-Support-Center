import { prisma } from './lib/prisma'
import bcrypt from 'bcryptjs'

async function fixLogin() {
    try {
        const passwordHash = await bcrypt.hash('Admin1122', 10)

        // Fix Admin
        const admin = await prisma.user.upsert({
            where: { phone: 'pcmasterbd1122' },
            update: {
                isActive: true,
                role: 'SUPERADMIN',
                passwordHash
            },
            create: {
                name: 'Admin User',
                email: 'admin@pcmasterbd.com',
                phone: 'pcmasterbd1122',
                role: 'SUPERADMIN',
                isActive: true,
                passwordHash
            }
        })
        console.log('Admin fixed:', admin.email, admin.phone, admin.role, admin.isActive)

        // Fix User
        const user = await prisma.user.upsert({
            where: { phone: 'user1122' },
            update: {
                isActive: true,
                role: 'USER',
                passwordHash
            },
            create: {
                name: 'Test User',
                email: 'user@pcmasterbd.com',
                phone: 'user1122',
                role: 'USER',
                isActive: true,
                passwordHash
            }
        })
        console.log('User fixed:', user.email, user.phone, user.role, user.isActive)

    } catch (error) {
        console.error('Error fixing login:', error)
    } finally {
        await prisma.$disconnect()
    }
}

fixLogin()
