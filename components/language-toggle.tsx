'use client'

import { useLanguage } from '@/lib/language-context'
import { Languages } from 'lucide-react'

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage()

    return (
        <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border/50 bg-muted/50 hover:bg-muted transition-all duration-200 text-xs font-bold active:scale-95"
            title={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
        >
            <Languages className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-foreground">
                {language === 'bn' ? 'EN' : 'বা'}
            </span>
        </button>
    )
}
