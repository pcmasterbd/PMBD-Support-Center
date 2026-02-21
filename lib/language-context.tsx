'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { bn } from '@/lib/translations/bn'
import { en } from '@/lib/translations/en'

export type Language = 'bn' | 'en'
export type TranslationKeys = keyof typeof bn

const translations = { bn, en }

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('bn')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('pmbd-language') as Language
        if (saved && (saved === 'bn' || saved === 'en')) {
            setLanguageState(saved)
        }
        setMounted(true)
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem('pmbd-language', lang)
    }

    const t = (key: string): string => {
        const keys = key.split('.')
        let value: any = translations[language]
        for (const k of keys) {
            value = value?.[k]
        }
        return (value as string) || key
    }

    // Prevent hydration mismatch
    if (!mounted) {
        const t = (key: string): string => {
            const keys = key.split('.')
            let value: any = translations['bn']
            for (const k of keys) {
                value = value?.[k]
            }
            return (value as string) || key
        }
        return (
            <LanguageContext.Provider value={{ language: 'bn', setLanguage, t }}>
                {children}
            </LanguageContext.Provider>
        )
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
