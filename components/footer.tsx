'use client'

import Link from "next/link"
import { Shield, Zap, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
    const { t } = useLanguage()

    return (
        <footer className="py-12 md:py-20 px-4 border-t bg-slate-50/50 dark:bg-zinc-950/50">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">PM</div>
                            <h3 className="font-black text-xl m-0 tracking-tight text-foreground">PC MASTER BD</h3>
                        </div>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            {t('landing.footerDesc')}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 md:mb-6 text-base md:text-lg text-foreground">{t('landing.footerQuickLinks')}</h4>
                        <ul className="space-y-3.5 text-sm md:text-base">
                            <li><Link href="/login" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                                <ArrowRight className="w-3.5 h-3.5 text-primary/40" /> {t('navbar.login')}
                            </Link></li>
                            <li><Link href="/#features" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                                <ArrowRight className="w-3.5 h-3.5 text-primary/40" /> {t('landing.featuresTitle')}
                            </Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 md:mb-6 text-base md:text-lg text-foreground">{t('landing.footerFollowUs')}</h4>
                        <ul className="space-y-3.5 text-sm md:text-base">
                            <li><Link href="/#tutorials" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                                <ArrowRight className="w-3.5 h-3.5 text-primary/40" /> {t('navbar.tutorials')}
                            </Link></li>
                            <li><Link href="/#support" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                                <ArrowRight className="w-3.5 h-3.5 text-primary/40" /> {t('navbar.support')}
                            </Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 md:mb-6 text-base md:text-lg text-foreground">{t('landing.footerContact')}</h4>
                        <ul className="space-y-3.5 text-sm md:text-base text-muted-foreground">
                            <li className="flex items-start gap-2 break-all">
                                <Shield className="w-4 h-4 mt-1 text-primary/40 flex-shrink-0" />
                                <span>Email: support@pcmasterbd.com</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Zap className="w-4 h-4 mt-1 text-primary/40 flex-shrink-0" />
                                <span>Phone: +880 1XXX-XXXXXX</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t text-center text-xs sm:text-sm font-medium text-muted-foreground">
                    © {new Date().getFullYear()} PC MASTER BD. {t('landing.footerRights')}.
                </div>
            </div>
        </footer>
    )
}
