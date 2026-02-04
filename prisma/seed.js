const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const passwordHash = await bcrypt.hash('admin123', 10)

    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@pcmasterbd.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@pcmasterbd.com',
            phone: '01700000000',
            passwordHash: passwordHash,
            role: 'ADMIN',
        },
    })

    // Create Categories
    const catVideo = await prisma.category.create({
        data: {
            name: 'Windows Tutorials',
            type: 'VIDEO',
            icon: '🪟',
            displayOrder: 1,
        }
    })

    const catSoftware = await prisma.category.create({
        data: {
            name: 'Essential Software',
            type: 'SOFTWARE',
            icon: '💿',
            displayOrder: 1,
        }
    })

    // Create Serial Numbers
    await prisma.serialNumber.createMany({
        data: [
            { code: 'PCMBD-2024-0001-XXXX', status: 'AVAILABLE' },
            { code: 'PCMBD-2024-0002-XXXX', status: 'AVAILABLE' },
            { code: 'PCMBD-2024-0003-XXXX', status: 'AVAILABLE' },
        ]
    })

    // Create Sample Video
    await prisma.videoTutorial.create({
        data: {
            title: 'How to make a Bootable Pendrive',
            description: 'Step by step guide to creating a master bootable pendrive.',
            youtubeId: 'dQw4w9WgXcQ',
            categoryId: catVideo.id,
            isPremium: false,
        }
    })

    // Create Sample Software
    await prisma.software.create({
        data: {
            name: 'Rufus',
            version: '4.4',
            description: 'The reliable way to create bootable USB drives.',
            categoryId: catSoftware.id,
            fileUrl: 'https://rufus.ie/',
            isPremium: false,
        }
    })

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
