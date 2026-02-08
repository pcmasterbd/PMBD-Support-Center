const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const categories = [
    {
        id: 'video-1',
        name: 'Windows Installation',
        type: 'VIDEO',
        icon: '💻',
        displayOrder: 1
    },
    {
        id: 'video-2',
        name: 'Software Tutorial',
        type: 'VIDEO',
        icon: '🎯',
        displayOrder: 2
    },
    {
        id: 'soft-1',
        name: 'Operating System',
        type: 'SOFTWARE',
        icon: '🖥️',
        displayOrder: 1
    },
    {
        id: 'soft-2',
        name: 'Productivity Tools',
        type: 'SOFTWARE',
        icon: '📊',
        displayOrder: 2
    }
]

// Quick Reply Templates
const quickReplies = [
    { category: "BIOS/Boot", message: "বায়োস সেটিংসে গিয়ে বুট মোড 'UEFI' এ পরিবর্তন করে দেখুন।" },
    { category: "BIOS/Boot", message: "আপনার পিসির 'Secure Boot' অপশনটি ডিজেবল করে চেষ্টা করুন।" },
    { category: "BIOS/Boot", message: "পেনড্রাইভটি অন্য একটি ইউএসবি ৩.০ (Blue Color) পোর্টে লাগিয়ে চেষ্টা করুন।" },
    { category: "Serial/Key", message: "আপনার সিরিয়াল নম্বরটি সঠিক কিনা পুনরায় চেক করুন। ড্যাশ (-) সহ টাইপ করুন।" },
    { category: "Serial/Key", message: "এই সিরিয়ালটি অলরেডি অন্য একটি ডিভাইসে এক্টিভেটেড আছে।" },
    { category: "Serial/Key", message: "নতুন সিরিয়াল কেনার জন্য দয়া করে আমাদের ওয়েবসাইটটি ভিজিট করুন।" },
    { category: "Downloads", message: "ডাউনলোড স্পিড কম হলে আমাদের আল্টারনেট মিরর লিঙ্কটি ট্রাই করুন।" },
    { category: "Downloads", message: "ফাইলটি এক্সট্রাক্ট করার জন্য WinRAR এর লেটেস্ট ভার্সন ব্যবহার করুন (Password: pcmasterbd)।" },
    { category: "Downloads", message: "অ্যান্টিভাইরাস সাময়িকভাবে ডিজেবল করে ফাইলটি ডাউনলোড এবং রান করুন।" },
    { category: "Closing", message: "আপনার সমস্যাটি সমাধান হয়েছে ভেবে আমরা টিকেটটি ক্লোজ করছি। ধন্যবাদ।" },
    { category: "Closing", message: "আরও কোনো সাহায্যের প্রয়োজন হলে নতুন টিকেট ওপেন করুন।" },
    { category: "Closing", message: "পিসি মাস্টার বিডির সাথেই থাকুন।" }
]

async function main() {
    // Create categories
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { id: cat.id },
            update: {},
            create: cat
        })
    }

    // Create Superadmin
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await prisma.user.upsert({
        where: { email: '[email protected]' },
        update: {},
        create: {
            name: 'Super Admin',
            email: '[email protected]',
            phone: '+8801700000000',
            passwordHash: hashedPassword,
            role: 'SUPERADMIN',
            isActive: true
        }
    })

    console.log('✅ Superadmin created: [email protected] / admin123')

    // Seed Quick Replies
    const existingReplies = await prisma.quickReply.count()
    if (existingReplies === 0) {
        for (const reply of quickReplies) {
            await prisma.quickReply.create({ data: reply })
        }
        console.log(`✅ ${quickReplies.length} Quick Reply templates seeded`)
    } else {
        console.log('ℹ️ Quick Replies already exist, skipping...')
    }

    console.log('✅ Database seeded successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
