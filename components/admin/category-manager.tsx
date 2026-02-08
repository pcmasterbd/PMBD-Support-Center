'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit } from 'lucide-react'
import { AdminModal } from './admin-modal'
import { CategoryForm } from './category-form'
import { deleteCategory } from '@/lib/actions/content-actions'

export function CategoryManager({ categories, type }: { categories: any[], type: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [editCategory, setEditCategory] = useState<any>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this category? All items in this category will become un-categorized.')) return
        try {
            await deleteCategory(id)
        } catch (err) {
            alert('Failed to delete category')
        }
    }

    return (
        <>
            <Button variant="outline" onClick={() => setIsOpen(true)} className="gap-2 h-9 text-xs font-bold uppercase">
                Manage Categories
            </Button>

            <AdminModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={`Manage ${type.toLowerCase()} Categories`}
            >
                <div className="space-y-6">
                    <Button
                        size="sm"
                        className="w-full gap-2 font-bold"
                        onClick={() => {
                            setEditCategory(null)
                            setIsFormOpen(true)
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        Add New Category
                    </Button>

                    <div className="divide-y border rounded-lg">
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{cat.icon}</span>
                                    <span className="font-bold text-sm">{cat.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-blue-600"
                                        onClick={() => {
                                            setEditCategory(cat)
                                            setIsFormOpen(true)
                                        }}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-600"
                                        onClick={() => handleDelete(cat.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <AdminModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    title={editCategory ? 'Edit Category' : 'Add Category'}
                >
                    <CategoryForm
                        type={type}
                        category={editCategory}
                        onSuccess={() => setIsFormOpen(false)}
                    />
                </AdminModal>
            </AdminModal>
        </>
    )
}
