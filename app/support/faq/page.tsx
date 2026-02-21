import { Metadata } from "next"
import { getPublishedFAQs } from "@/lib/actions/faq-actions"
import { FAQClient } from "./faq-client"

export const metadata: Metadata = {
    title: "Knowledge Base | PC MASTER BD",
    description: "Frequently asked questions and support articles",
}

export default async function KnowledgeBasePage() {
    const result = await getPublishedFAQs()
    const faqs = result.success && result.data ? result.data : []

    return (
        <div className="container py-10">
            <FAQClient initialFaqs={faqs as any} />
        </div>
    )
}
