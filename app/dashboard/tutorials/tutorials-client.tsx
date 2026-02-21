'use client'

import { useLanguage } from '@/lib/language-context'
import { TutorialList } from '@/components/tutorial-list'

interface TutorialsClientProps {
    categories: any[]
}

export function TutorialsClient({ categories }: TutorialsClientProps) {
    const { t } = useLanguage()

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-extrabold tracking-tight">{t('tutorialsPage.title')}</h2>
                <p className="text-muted-foreground">
                    {t('tutorialsPage.subtitle')}
                </p>
            </div>

            <TutorialList categories={categories} />
        </div>
    )
}
