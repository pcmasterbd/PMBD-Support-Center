'use client'

import { useState } from "react"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Menu, X, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    const navLinks = [
        { href: "#features", label: "Features" },
        { href: "#tutorials", label: "Tutorials" },
        { href: "#software", label: "Software" },
        { href: "#support", label: "Support" },
    ]

    return (
        <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                        PM
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden xs:block">PC MASTER BD</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors py-2"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center space-x-3">
                    <div className="hidden sm-std:block">
                        <ThemeToggle />
                    </div>
                    <Button variant="ghost" size="sm" asChild className="hidden sm-std:flex h-9 px-4 font-semibold hover:bg-muted">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild size="sm" className="hidden sm-lg:flex h-9 px-5 shadow-md shadow-primary/10 font-semibold transition-all hover:shadow-primary/20 active:scale-95">
                        <Link href="/register">Get Started</Link>
                    </Button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-3 -mr-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors active:scale-95 flex items-center justify-center"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-slate-600" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay - Premium Slide Logic */}
            <div className={cn(
                "md:hidden fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur-xl transition-all duration-300 ease-in-out",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            )}>
                <div className="flex flex-col p-6 space-y-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-xl font-bold text-slate-800 dark:text-slate-100 hover:text-primary transition-colors py-4 px-2 border-b border-muted/50 flex items-center justify-between group"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                            <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                    ))}
                    <div className="flex items-center justify-between pt-6 sm-std:hidden">
                        <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Appearance</span>
                        <ThemeToggle />
                    </div>
                    <div className="pt-8 space-y-4">
                        <Button asChild className="w-full h-12 text-lg font-bold shadow-xl shadow-primary/20">
                            <Link href="/register" onClick={() => setIsOpen(false)}>Create Account</Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full h-12 text-lg font-bold">
                            <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
