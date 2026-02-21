import { prisma } from './lib/prisma'

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isActive: true
            }
        })
        console.log('--- All Users in DB ---')
        users.forEach(u => {
            console.log(`[${u.role}] ${u.name} | Identifier: ${u.email} or ${u.phone} | Active: ${u.isActive}`)
        })
        console.log('-----------------------')
    } catch (error) {
        console.error('Error checking users:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkUsers()
