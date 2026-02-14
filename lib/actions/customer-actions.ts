'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

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
    try {
        const validated = customerSchema.parse(data)

        const rawDate = data.pendrivePurchaseDate
        // Ensure date is valid if provided
        if (rawDate && isNaN(rawDate.getTime())) {
            return { success: false, error: 'Invalid purchase date' }
        }

        await prisma.customer.create({
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

        revalidatePath('/dashboard/admin/customers')
        return { success: true }
    } catch (error) {
        console.error('Error creating customer:', error)
        // Check for Prisma error codes if needed, or Zod errors
        if (error instanceof z.ZodError) {
            const zodError = error as any;
            return { success: false, error: zodError.errors[0]?.message || 'Validation error' }
        }
        return { success: false, error: 'Failed to create customer: ' + (error instanceof Error ? error.message : 'Unknown error') }
    }
}

export async function bulkCreateCustomers(customers: CustomerFormData[]) {
    try {
        // Validate all records first
        const validatedData = customers.map(c => customerSchema.parse(c))

        await prisma.customer.createMany({
            data: validatedData,
            skipDuplicates: true, // Optional: logic to handle duplicates
        })

        revalidatePath('/dashboard/admin/customers')
        return { success: true, count: validatedData.length }
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
