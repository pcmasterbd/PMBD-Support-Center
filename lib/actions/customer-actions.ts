'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const customerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone number is required'),
    address: z.string().optional(),
    package: z.string().optional(),
    price: z.number().optional(),
    totalBill: z.number().optional(),
    pendrivePurchaseDate: z.date().optional(),
    pendriveSN: z.string().optional(),
})

export type CustomerFormData = z.infer<typeof customerSchema>

export async function getCustomers() {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return {
            success: true,
            data: customers
        }
    } catch (error) {
        console.error('Error fetching customers:', error)
        return { success: false, error: 'Failed to fetch customers' }
    }
}

export async function createCustomer(data: CustomerFormData) {
    let retries = 3
    while (retries > 0) {
        try {
            const validated = customerSchema.parse(data)

            const rawDate = data.pendrivePurchaseDate
            if (rawDate && isNaN(rawDate.getTime())) {
                return { success: false, error: 'Invalid purchase date' }
            }

            const passwordHash = await bcrypt.hash('pcmasterbd', 10)

            await prisma.$transaction(async (tx) => {
                // Create the customer record
                await tx.customer.create({
                    data: {
                        name: validated.name,
                        phone: validated.phone,
                        address: validated.address,
                        package: validated.package,
                        price: validated.price,
                        totalBill: validated.totalBill,
                        pendrivePurchaseDate: validated.pendrivePurchaseDate,
                        pendriveSN: validated.pendriveSN,
                    },
                })

                // If Pendrive SN is provided, sync with User and SerialNumber
                if (validated.pendriveSN) {
                    const placeholderEmail = `${validated.phone.replace(/\s+/g, '')}@pcmasterbd.com`

                    // 1. Handle Serial Number
                    let serial = await tx.serialNumber.findUnique({
                        where: { code: validated.pendriveSN }
                    })

                    if (!serial) {
                        serial = await tx.serialNumber.create({
                            data: {
                                code: validated.pendriveSN,
                                status: 'ASSIGNED',
                                assignedAt: new Date(),
                                packageType: validated.package,
                            }
                        })
                    } else {
                        await tx.serialNumber.update({
                            where: { id: serial.id },
                            data: {
                                status: 'ASSIGNED',
                                assignedAt: new Date(),
                                packageType: validated.package,
                            }
                        })
                    }

                    // 2. Handle User
                    const existingUser = await tx.user.findFirst({
                        where: {
                            OR: [
                                { phone: validated.phone },
                                { serialId: serial.id },
                                { email: placeholderEmail }
                            ]
                        }
                    })

                    if (!existingUser) {
                        await tx.user.create({
                            data: {
                                name: validated.name,
                                phone: validated.phone,
                                email: placeholderEmail,
                                passwordHash: passwordHash,
                                serialId: serial.id,
                                role: 'USER',
                                isActive: true,
                            }
                        })
                    } else {
                        // Update existing user to link with serial if not link
                        await tx.user.update({
                            where: { id: existingUser.id },
                            data: {
                                serialId: serial.id,
                            }
                        })
                    }
                }
            })

            revalidatePath('/dashboard/admin/customers')
            return { success: true }
        } catch (error) {
            retries--
            console.error(`Error creating customer (Attempts left: ${retries}):`, error)

            if (retries === 0) {
                if (error instanceof z.ZodError) {
                    const zodError = error as any;
                    return { success: false, error: zodError.errors[0]?.message || 'Validation error' }
                }
                return { success: false, error: 'Failed to create customer: ' + (error instanceof Error ? error.message : 'Unknown error') }
            }
            // Small delay before retry
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }
    return { success: false, error: 'Failed to create customer after retries' }
}

export async function bulkCreateCustomers(customers: CustomerFormData[]) {
    try {
        const passwordHash = await bcrypt.hash('pcmasterbd', 10)
        let count = 0

        for (const data of customers) {
            try {
                const validated = customerSchema.parse(data)
                const placeholderEmail = `${validated.phone.replace(/\s+/g, '')}@pcmasterbd.com`

                await prisma.$transaction(async (tx) => {
                    // 1. Create Customer
                    await tx.customer.create({
                        data: {
                            name: validated.name,
                            phone: validated.phone,
                            address: validated.address,
                            package: validated.package,
                            price: validated.price,
                            totalBill: validated.totalBill,
                            pendrivePurchaseDate: validated.pendrivePurchaseDate,
                            pendriveSN: validated.pendriveSN,
                        },
                    })

                    // 2. Sync if SN provided
                    if (validated.pendriveSN) {
                        let serial = await tx.serialNumber.findUnique({
                            where: { code: validated.pendriveSN }
                        })

                        if (!serial) {
                            serial = await tx.serialNumber.create({
                                data: {
                                    code: validated.pendriveSN,
                                    status: 'ASSIGNED',
                                    assignedAt: new Date(),
                                    packageType: validated.package,
                                }
                            })
                        } else {
                            await tx.serialNumber.update({
                                where: { id: serial.id },
                                data: {
                                    status: 'ASSIGNED',
                                    assignedAt: new Date(),
                                    packageType: validated.package,
                                }
                            })
                        }

                        const existingUser = await tx.user.findFirst({
                            where: {
                                OR: [
                                    { phone: validated.phone },
                                    { serialId: serial.id },
                                    { email: placeholderEmail }
                                ]
                            }
                        })

                        if (!existingUser) {
                            await tx.user.create({
                                data: {
                                    name: validated.name,
                                    phone: validated.phone,
                                    email: placeholderEmail,
                                    passwordHash: passwordHash,
                                    serialId: serial.id,
                                    role: 'USER',
                                    isActive: true,
                                }
                            })
                        } else {
                            await tx.user.update({
                                where: { id: existingUser.id },
                                data: {
                                    serialId: serial.id,
                                }
                            })
                        }
                    }
                })
                count++
            } catch (itemError) {
                console.error('Error processing bulk customer item:', itemError)
                // Continue with next item
            }
        }

        revalidatePath('/dashboard/admin/customers')
        return { success: true, count }
    } catch (error) {
        console.error('Error bulk creating customers:', error)
        return { success: false, error: 'Failed to upload customers' }
    }
}

export async function deleteCustomer(id: string) {
    try {
        await prisma.customer.delete({
            where: { id },
        })

        revalidatePath('/dashboard/admin/customers')
        return { success: true }
    } catch (error) {
        console.error('Error deleting customer:', error)
        return { success: false, error: 'Failed to delete customer' }
    }
}
