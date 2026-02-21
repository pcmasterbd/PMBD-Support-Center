import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Testing connection...')
        const result = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
        console.log('Tables in public schema:', result)

        console.log('Attempting to count ticket_feedback...')
        const count = await prisma.ticketFeedback.count()
        console.log('TicketFeedback count:', count)
    } catch (error) {
        console.error('Error during test:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
