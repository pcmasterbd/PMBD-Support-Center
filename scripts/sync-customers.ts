
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function syncCustomers() {
    console.log('Starting customer sync...')
    const passwordHash = await bcrypt.hash('pcmasterbd', 10)

    try {
        const customers = await prisma.customer.findMany({
            where: {
                pendriveSN: { not: null }
            }
        })

        console.log(`Found ${customers.length} customers with Pendrive SN.`)

        for (const customer of customers) {
            if (!customer.pendriveSN) continue

            console.log(`Syncing customer: ${customer.name} (${customer.pendriveSN})`)

            await prisma.$transaction(async (tx) => {
                // 1. Handle Serial Number
                let serial = await tx.serialNumber.findUnique({
                    where: { code: customer.pendriveSN! }
                })

                if (!serial) {
                    serial = await tx.serialNumber.create({
                        data: {
                            code: customer.pendriveSN!,
                            status: 'ASSIGNED',
                            assignedAt: new Date(),
                            packageType: customer.package,
                        }
                    })
                } else {
                    await tx.serialNumber.update({
                        where: { id: serial.id },
                        data: {
                            status: 'ASSIGNED',
                            assignedAt: new Date(),
                            packageType: customer.package,
                        }
                    })
                }

                // 2. Handle User
                const placeholderEmail = `${customer.phone.replace(/\s+/g, '')}@pcmasterbd.com`

                const existingUser = await tx.user.findFirst({
                    where: {
                        OR: [
                            { phone: customer.phone },
                            { serialId: serial.id },
                            { email: placeholderEmail }
                        ]
                    }
                })

                if (!existingUser) {
                    await tx.user.create({
                        data: {
                            name: customer.name,
                            phone: customer.phone,
                            email: placeholderEmail,
                            passwordHash: passwordHash,
                            serialId: serial.id,
                            role: 'USER',
                            isActive: true,
                        }
                    })
                    console.log(`  - Created new user for ${customer.name}`)
                } else {
                    await tx.user.update({
                        where: { id: existingUser.id },
                        data: {
                            serialId: serial.id,
                        }
                    })
                    console.log(`  - Updated existing user for ${customer.name}`)
                }
            })
        }

        console.log('Sync completed successfully.')
    } catch (error) {
        console.error('Error during sync:', error)
    } finally {
        await prisma.$disconnect()
    }
}

syncCustomers()
