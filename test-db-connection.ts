
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Testing database connection...");
    try {
        const count = await prisma.user.count();
        console.log(`Successfully connected! Found ${count} users.`);
    } catch (e) {
        console.error("Connection failed:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
