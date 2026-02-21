'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Search, BookOpen, Layers } from "lucide-react"
import { motion } from "framer-motion"

interface FAQ {
    id: string
    question: string
    answer: string
    category: string
    tags: string | null
}

interface FAQClientProps {
    initialFaqs: FAQ[]
}

export function FAQClient({ initialFaqs }: FAQClientProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("ALL")

    const categories = ["ALL", ...Array.from(new Set(initialFaqs.map(f => f.category)))]

    // Filter logic
    const filteredFaqs = initialFaqs.filter(faq => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory = selectedCategory === "ALL" || faq.category === selectedCategory

        return matchesSearch && matchesCategory
    })

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-primary">
                    Knowledge Base
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Find answers to common questions about accounts, licenses, and troubleshooting.
                </p>

                {/* Search Bar */}
                <div className="relative max-w-xl mx-auto mt-6">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="pl-10 h-12 text-lg shadow-sm"
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(cat => (
                    <Button
                        key={cat}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        onClick={() => setSelectedCategory(cat)}
                        className="rounded-full"
                        size="sm"
                    >
                        {cat === "ALL" ? <Layers className="mr-2 h-3 w-3" /> : null}
                        {cat}
                    </Button>
                ))}
            </div>

            {/* FAQ List */}
            <div className="grid gap-6">
                {filteredFaqs.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {filteredFaqs.map((faq, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={faq.id}
                            >
                                <AccordionItem value={faq.id} className="border rounded-lg px-4 bg-card shadow-sm">
                                    <AccordionTrigger className="hover:no-underline py-4 text-left">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full pr-4">
                                            <span className="font-medium text-lg">{faq.question}</span>
                                            <div className="sm:ml-auto flex gap-2">
                                                <Badge variant="secondary" className="text-[10px] w-fit">
                                                    {faq.category}
                                                </Badge>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground prose dark:prose-invert max-w-none pb-4">
                                        <div className="whitespace-pre-wrap">{faq.answer}</div>
                                        {faq.tags && (
                                            <div className="mt-4 flex gap-2">
                                                {faq.tags.split(',').map(tag => (
                                                    <span key={tag} className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                                                        #{tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No results found for "{searchQuery}"</p>
                        <Button variant="link" onClick={() => { setSearchQuery(""); setSelectedCategory("ALL") }} >
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
