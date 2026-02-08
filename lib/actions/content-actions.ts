'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Category Actions
export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const icon = formData.get('icon') as string
    const displayOrder = parseInt(formData.get('displayOrder') as string || '0')

    await prisma.category.create({
        data: { name, type, icon, displayOrder }
    })
    revalidatePath('/dashboard/admin/content')
}

export async function updateCategory(id: string, formData: FormData) {
    const name = formData.get('name') as string
    const icon = formData.get('icon') as string
    const displayOrder = parseInt(formData.get('displayOrder') as string || '0')

    await prisma.category.update({
        where: { id },
        data: { name, icon, displayOrder }
    })
    revalidatePath('/dashboard/admin/content')
}

export async function deleteCategory(id: string) {
    await prisma.category.delete({ where: { id } })
    revalidatePath('/dashboard/admin/content')
}

// Software Actions
export async function createSoftware(formData: FormData) {
    const name = formData.get('name') as string
    const version = formData.get('version') as string
    const description = formData.get('description') as string
    const categoryId = formData.get('categoryId') as string
    const fileUrl = formData.get('fileUrl') as string
    const isPremium = formData.get('isPremium') === 'true'

    await prisma.software.create({
        data: { name, version, description, categoryId, fileUrl, isPremium }
    })
    revalidatePath('/dashboard/admin/content/software')
}

export async function updateSoftware(id: string, formData: FormData) {
    const name = formData.get('name') as string
    const version = formData.get('version') as string
    const description = formData.get('description') as string
    const categoryId = formData.get('categoryId') as string
    const fileUrl = formData.get('fileUrl') as string
    const isPremium = formData.get('isPremium') === 'true'

    await prisma.software.update({
        where: { id },
        data: { name, version, description, categoryId, fileUrl, isPremium }
    })
    revalidatePath('/dashboard/admin/content/software')
}

export async function deleteSoftware(id: string) {
    await prisma.software.delete({ where: { id } })
    revalidatePath('/dashboard/admin/content/software')
}

// Video Actions
export async function createVideo(formData: FormData) {
    const title = formData.get('title') as string
    const youtubeId = formData.get('youtubeId') as string
    const categoryId = formData.get('categoryId') as string
    const isPremium = formData.get('isPremium') === 'true'

    await prisma.videoTutorial.create({
        data: { title, youtubeId, categoryId, isPremium }
    })
    revalidatePath('/dashboard/admin/content/videos')
}

export async function updateVideo(id: string, formData: FormData) {
    const title = formData.get('title') as string
    const youtubeId = formData.get('youtubeId') as string
    const categoryId = formData.get('categoryId') as string
    const isPremium = formData.get('isPremium') === 'true'

    await prisma.videoTutorial.update({
        where: { id },
        data: { title, youtubeId, categoryId, isPremium }
    })
    revalidatePath('/dashboard/admin/content/videos')
}

export async function deleteVideo(id: string) {
    await prisma.videoTutorial.delete({ where: { id } })
    revalidatePath('/dashboard/admin/content/videos')
}
