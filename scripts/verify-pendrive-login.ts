
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function verifyLogin() {
    const testSN = 'TEST-SN-VERIFY-123'
    const testPhone = '01800000000'
    const testPassword = 'pcmasterbd'

    console.log(`Verifying login logic for SN: ${testSN}`)

    try {
        // 1. Create a test customer using the new logic (or simulate it)
        const passwordHash = await bcrypt.hash(testPassword, 10)
        const placeholderEmail = `${testPhone}@pcmasterbd.com`

        await prisma.$transaction(async (tx) => {
            // Cleanup previous test data
            const oldUser = await tx.user.findFirst({ where: { phone: testPhone } })
            if (oldUser) {
                await tx.user.delete({ where: { id: oldUser.id } })
            }
            await tx.customer.deleteMany({ where: { phone: testPhone } })
            await tx.serialNumber.deleteMany({ where: { code: testSN } })

            // Create Customer
            await tx.customer.create({
                data: {
                    name: 'Verify Test User',
                    phone: testPhone,
                    pendriveSN: testSN
                }
            })

            // Create Serial
            const serial = await tx.serialNumber.create({
                data: {
                    code: testSN,
                    status: 'ASSIGNED',
                    assignedAt: new Date()
                }
            })

            // Create User
            await tx.user.create({
                data: {
                    name: 'Verify Test User',
                    phone: testPhone,
                    email: placeholderEmail,
                    passwordHash: passwordHash,
                    serialId: serial.id,
                    role: 'USER',
                    isActive: true
                }
            })
        })

        console.log('Test data setup successful.')

        // 2. Simulate auth.ts authorize logic
        const identifier = testSN
        const password = testPassword

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier },
                    { serialNumber: { code: identifier } }
                ]
            },
            include: {
                serialNumber: true
            }
        })

        if (!user) {
            console.error('FAILED: User not found by Serial Number')
            return
        }

        console.log(`User found: ${user.name} (Role: ${user.role})`)

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash)
        if (!passwordsMatch) {
            console.error('FAILED: Password mismatch')
            return
        }

        console.log('SUCCESS: Password matched successfully!')
        console.log('Login verification PASSED.')

    } catch (error) {
        console.error('Verification encountered an error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

verifyLogin()
