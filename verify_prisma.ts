
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log("Verifying Customer model fields...");

        // Attempt to select the new fields. If this fails at runtime, the fields don't exist in the generated client.
        await prisma.customer.findFirst({
            select: {
                id: true,
                pendriveSN: true,
                pendrivePurchaseDate: true
            }
        });

        console.log("Successfully queried new fields. Verification passed.");

    } catch (e) {
        console.error("Verification failed:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
