import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { isValidSerialFormat } from '@/lib/utils'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, phone, password, serialNumber } = body

        if (!name || !email || !phone || !password || !serialNumber) {
            return NextResponse.json(
                { error: 'সকল ফিল্ড পূরণ করুন' },
                { status: 400 }
            )
        }

        if (!isValidSerialFormat(serialNumber)) {
            return NextResponse.json(
                { error: 'সিরিয়াল নম্বর ফরম্যাট সঠিক নয়' },
                { status: 400 }
            )
        }

        const serial = await prisma.serialNumber.findUnique({
            where: { code: serialNumber },
        })

        if (!serial) {
            return NextResponse.json(
                { error: 'সিরিয়াল নম্বর পাওয়া যায়নি' },
                { status: 404 }
            )
        }

        if (serial.status !== 'AVAILABLE') {
            return NextResponse.json(
                { error: 'এই সিরিয়াল নম্বর ইতিমধ্যে ব্যবহৃত হয়েছে' },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'এই ইমেইল ইতিমধ্যে নিবন্ধিত' },
                { status: 400 }
            )
        }

        const existingPhone = await prisma.user.findUnique({
            where: { phone },
        })

        if (existingPhone) {
            return NextResponse.json(
                { error: 'এই ফোন নম্বর ইতিমধ্যে নিবন্ধিত' },
                { status: 400 }
            )
        }

        const passwordHash = await bcrypt.hash(password, 10)

        // Count users to see if this is the first one
        const userCount = await prisma.user.count()
        const role = userCount === 0 ? 'SUPERADMIN' : 'USER'

        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    name,
                    email,
                    phone,
                    passwordHash,
                    serialId: serial.id,
                    role: role,
                },
            })

            await tx.serialNumber.update({
                where: { id: serial.id },
                data: {
                    status: 'ASSIGNED',
                    assignedAt: new Date(),
                },
            })

            return newUser
        })

        // Generate and send verification email
        const verificationToken = await generateVerificationToken(email)
        await sendVerificationEmail(verificationToken.email, verificationToken.token)

        return NextResponse.json(
            {
                message: 'রেজিস্ট্রেশন সফল হয়েছে। আপনার ইমেইল ভেরিফাই করুন।',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে' },
            { status: 500 }
        )
    }
}
