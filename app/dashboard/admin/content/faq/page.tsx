import { Metadata } from "next"
import { getAllFAQs } from "@/lib/actions/faq-actions"
import { AdminFAQClient } from "./admin-faq-client"

export const metadata: Metadata = {
    title: "Manage FAQs | Admin",
    description: "Create and manage FAQs",
}

export default async function AdminFAQPage() {
    const result = await getAllFAQs()
    const faqs = result.success && result.data ? result.data : []

    return (
        <div className="space-y-6">
            <AdminFAQClient initialFaqs={faqs as any} />
        </div>
    )
}
