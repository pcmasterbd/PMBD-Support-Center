import { useState, useEffect } from "react"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { NotificationBell } from "./notification-bell"
import { Button } from "./ui/button"
import { Menu, X, ArrowRight, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useLanguage()

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const navLinks = [
        { href: "/", label: t('navbar.home'), description: "Go back to the homepage" },
        { href: "/#tutorials", label: t('navbar.tutorials'), description: "Learn how to use PMBD" },
        { href: "/support", label: t('navbar.support'), description: "Contact help & get support" },
        { href: "/login", label: t('navbar.login'), description: "Access your account" },
    ]

    return (
        <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between relative z-50">
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                        PM
                    </div>
                    <span className="font-bold text-lg sm:text-xl tracking-tight hidden sm-std:block">PC MASTER BD</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                    {navLinks.filter(link => link.href !== "/login").map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors py-2 relative group"
                        >
                            {link.label}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                <div className="flex items-center space-x-1 sm:space-x-2">
                    <NotificationBell />
                    <ThemeToggle />

                    <Button variant="ghost" size="sm" asChild className="h-9 px-2 sm:px-4 font-semibold hover:bg-muted whitespace-nowrap">
                        <Link href="/login">{t('navbar.login')}</Link>
                    </Button>

                    <div className="hidden sm-tab:flex items-center">
                        <LanguageToggle />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition-all active:scale-90 flex items-center justify-center relative w-10 h-10"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Menu"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isOpen ? 'close' : 'open'}
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isOpen ? (
                                    <X className="w-6 h-6 text-primary" />
                                ) : (
                                    <Menu className="w-6 h-6 text-foreground" />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop to close menu on click outside */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-30 md:hidden"
                        />

                        <motion.div
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="md:hidden fixed right-0 top-0 h-screen w-[280px] sm:w-[320px] z-40 bg-background border-l shadow-2xl flex flex-col overflow-hidden"
                        >
                            <div className="h-16 flex items-center px-6 border-b shrink-0">
                                <span className="font-bold text-lg">Menu</span>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                <motion.div
                                    className="space-y-3"
                                    initial="closed"
                                    animate="open"
                                    variants={{
                                        open: {
                                            transition: { staggerChildren: 0.08, delayChildren: 0.1 }
                                        },
                                        closed: {
                                            transition: { staggerChildren: 0.05, staggerDirection: -1 }
                                        }
                                    }}
                                >
                                    <div className="mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 px-1">Navigation</span>
                                    </div>
                                    {navLinks.map((link) => (
                                        <motion.div
                                            key={link.href}
                                            variants={{
                                                open: { opacity: 1, x: 0 },
                                                closed: { opacity: 0, x: 20 }
                                            }}
                                        >
                                            <Link
                                                href={link.href}
                                                className="group flex flex-col p-4 rounded-xl bg-muted/50 hover:bg-primary/5 transition-all border border-transparent hover:border-primary/10"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                                                        {link.label}
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                                                </div>
                                                <span className="text-[11px] text-muted-foreground mt-0.5 group-hover:text-primary/70 transition-colors">
                                                    {link.description}
                                                </span>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-8 pt-6 border-t"
                                >
                                    <div className="flex items-center justify-between px-1 mb-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground">Preferences</span>
                                            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Language</span>
                                        </div>
                                        <LanguageToggle />
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] text-muted-foreground leading-relaxed px-1">
                                            {t('login.adminNote')}
                                        </p>
                                        <Button asChild className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 rounded-xl group relative overflow-hidden">
                                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {t('navbar.login')}
                                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                </span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transition-transform group-hover:scale-105" />
                                            </Link>
                                        </Button>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="p-6 border-t bg-muted/30 shrink-0">
                                <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground font-medium">
                                    <span>© 2026 PC MASTER BD</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    )
}
