'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Video, Download, Plus, Loader2 } from 'lucide-react'

export default function AdminContentPage() {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<any[]>([])
    const [type, setType] = useState<'VIDEO' | 'SOFTWARE' | 'CATEGORY'>('VIDEO')

    // Form States
    const [formData, setFormData] = useState({
        title: '',
        name: '',
        description: '',
        youtubeId: '',
        categoryId: '',
        fileUrl: '',
        version: '',
        isPremium: false,
        icon: '',
        categoryType: 'VIDEO'
    })

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        const res = await fetch('/api/admin/content?type=CATEGORY')
        if (res.ok) {
            const data = await res.json()
            setCategories(data)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    data: type === 'CATEGORY' ? {
                        name: formData.name,
                        type: formData.categoryType,
                        icon: formData.icon
                    } : type === 'VIDEO' ? {
                        title: formData.title,
                        description: formData.description,
                        youtubeId: formData.youtubeId,
                        categoryId: formData.categoryId,
                        isPremium: formData.isPremium
                    } : {
                        name: formData.name,
                        version: formData.version,
                        description: formData.description,
                        categoryId: formData.categoryId,
                        fileUrl: formData.fileUrl,
                        isPremium: formData.isPremium
                    }
                })
            })

            if (res.ok) {
                alert('সফলভাবে যোগ করা হয়েছে')
                setFormData({
                    title: '',
                    name: '',
                    description: '',
                    youtubeId: '',
                    categoryId: '',
                    fileUrl: '',
                    version: '',
                    isPremium: false,
                    icon: '',
                    categoryType: 'VIDEO'
                })
                if (type === 'CATEGORY') fetchCategories()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-2">কন্টেন্ট ম্যানেজমেন্ট</h2>
                    <p className="text-muted-foreground">ভিডিও এবং সফটওয়্যার কন্টেন্ট পরিচালনা করুন</p>
                </div>
                <div className="flex gap-2">
                    <Button variant={type === 'VIDEO' ? 'default' : 'outline'} onClick={() => setType('VIDEO')}>ভিডিও</Button>
                    <Button variant={type === 'SOFTWARE' ? 'default' : 'outline'} onClick={() => setType('SOFTWARE')}>সফটওয়্যার</Button>
                    <Button variant={type === 'CATEGORY' ? 'default' : 'outline'} onClick={() => setType('CATEGORY')}>ক্যাটাগরি</Button>
                </div>
            </div>

            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                    {type === 'CATEGORY' ? (
                        <>
                            <div className="space-y-2">
                                <Label>ক্যাটাগরি নাম</Label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>টাইপ</Label>
                                <Select value={formData.categoryType} onValueChange={v => setFormData({ ...formData, categoryType: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VIDEO">Video</SelectItem>
                                        <SelectItem value="SOFTWARE">Software</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>আইকন (Emoji)</Label>
                                <Input value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} placeholder="📁" />
                            </div>
                        </>
                    ) : type === 'VIDEO' ? (
                        <>
                            <div className="space-y-2">
                                <Label>ভিডিও শিরোনাম</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>YouTube Video ID</Label>
                                <Input value={formData.youtubeId} onChange={e => setFormData({ ...formData, youtubeId: e.target.value })} required placeholder="dQw4w9WgXcQ" />
                            </div>
                            <div className="space-y-2">
                                <Label>ক্যাটাগরি</Label>
                                <Select value={formData.categoryId} onValueChange={v => setFormData({ ...formData, categoryId: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="ক্যাটাগরি সিলেক্ট করুন" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.filter(c => c.type === 'VIDEO').map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label>সফটওয়্যার নাম</Label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>ভার্সন</Label>
                                <Input value={formData.version} onChange={e => setFormData({ ...formData, version: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>ডাউনলোড লিঙ্ক</Label>
                                <Input value={formData.fileUrl} onChange={e => setFormData({ ...formData, fileUrl: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>ক্যাটাগরি</Label>
                                <Select value={formData.categoryId} onValueChange={v => setFormData({ ...formData, categoryId: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="ক্যাটাগরি সিলেক্ট করুন" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.filter(c => c.type === 'SOFTWARE').map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {(type === 'VIDEO' || type === 'SOFTWARE') && (
                        <>
                            <div className="space-y-2">
                                <Label>বিবরণ</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch checked={formData.isPremium} onCheckedChange={v => setFormData({ ...formData, isPremium: v })} />
                                <Label>প্রিমিয়াম কন্টেন্ট</Label>
                            </div>
                        </>
                    )}

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />}
                        যোগ করুন
                    </Button>
                </form>
            </Card>
        </div>
    )
}
