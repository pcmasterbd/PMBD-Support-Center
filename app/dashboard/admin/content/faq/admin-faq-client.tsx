'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Search, FileText } from "lucide-react"
import { createFAQ, updateFAQ, deleteFAQ } from "@/lib/actions/faq-actions"
import { cn } from "@/lib/utils"

interface FAQ {
    id: string
    question: string
    answer: string
    category: string
    tags: string | null
    isPublished: boolean
    displayOrder: number
}

interface AdminFAQClientProps {
    initialFaqs: FAQ[]
}

export function AdminFAQClient({ initialFaqs }: AdminFAQClientProps) {
    const [faqs, setFaqs] = useState(initialFaqs) // Note: optimistic updates ideally, but relying on router.refresh via actions for simplicity
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("ALL")
    const [isPending, startTransition] = useTransition()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
    const router = useRouter()

    // Form State
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        category: "GENERAL",
        tags: "",
        isPublished: true,
        displayOrder: 0
    })

    const categories = ["GENERAL", "TECHNICAL", "BILLING", "ACCOUNT", "LICENSE"]

    const filteredFaqs = initialFaqs.filter(faq => {
        const matchesSearch =
            faq.question.toLowerCase().includes(search.toLowerCase()) ||
            faq.answer.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = selectedCategory === "ALL" || faq.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const resetForm = () => {
        setFormData({
            question: "",
            answer: "",
            category: "GENERAL",
            tags: "",
            isPublished: true,
            displayOrder: 0
        })
        setEditingFaq(null)
    }

    const handleOpenCreate = () => {
        resetForm()
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (faq: FAQ) => {
        setEditingFaq(faq)
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            tags: faq.tags || "",
            isPublished: faq.isPublished,
            displayOrder: faq.displayOrder
        })
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this FAQ?")) return

        startTransition(async () => {
            const result = await deleteFAQ(id)
            if (result.success) {
                toast.success(result.message)
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleSubmit = async () => {
        startTransition(async () => {
            let result
            if (editingFaq) {
                result = await updateFAQ(editingFaq.id, {
                    ...formData,
                    displayOrder: Number(formData.displayOrder)
                })
            } else {
                result = await createFAQ({
                    ...formData,
                    displayOrder: Number(formData.displayOrder)
                })
            }

            if (result.success) {
                toast.success(result.message)
                setIsDialogOpen(false)
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">FAQ Management</h1>
                    <p className="text-muted-foreground">Create and manage support articles.</p>
                </div>
                <Button onClick={handleOpenCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add FAQ
                </Button>
            </div>

            <div className="bg-card p-4 rounded-lg border shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search FAQs..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Categories</SelectItem>
                        {categories.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Order</TableHead>
                            <TableHead>Question</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFaqs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No FAQs found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredFaqs.map((faq) => (
                                <TableRow key={faq.id}>
                                    <TableCell>{faq.displayOrder}</TableCell>
                                    <TableCell className="font-medium">
                                        <div className="line-clamp-1">{faq.question}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{faq.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={faq.isPublished ? "default" : "secondary"}>
                                            {faq.isPublished ? "Published" : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(faq)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(faq.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingFaq ? "Edit FAQ" : "Create FAQ"}</DialogTitle>
                        <DialogDescription>
                            {editingFaq ? "Make changes to the FAQ article." : "Add a new FAQ article to the knowledge base."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="question">Question</Label>
                            <Input
                                id="question"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                placeholder="e.g., How do I reset my password?"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="answer">Answer (Rich Text capable)</Label>
                            <Textarea
                                id="answer"
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                placeholder="Type your answer here..."
                                className="min-h-[150px]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="order">Display Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="password, login, security"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="published"
                                checked={formData.isPublished}
                                onCheckedChange={(c) => setFormData({ ...formData, isPublished: c })}
                            />
                            <Label htmlFor="published">Published</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isPending}>
                            {editingFaq ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
