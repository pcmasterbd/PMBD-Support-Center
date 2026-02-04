import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">PM</span>
                    </div>
                    <span className="font-bold text-xl">PC MASTER BD</span>
                </Link>

                <div className="hidden md:flex items-center space-x-6">
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                        Features
                    </Link>
                    <Link href="#tutorials" className="text-sm font-medium hover:text-primary transition-colors">
                        Tutorials
                    </Link>
                    <Link href="#software" className="text-sm font-medium hover:text-primary transition-colors">
                        Software
                    </Link>
                    <Link href="#support" className="text-sm font-medium hover:text-primary transition-colors">
                        Support
                    </Link>
                </div>

                <div className="flex items-center space-x-3">
                    <ThemeToggle />
                    <Button variant="ghost" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="hidden sm:flex">
                        <Link href="/register">Get Started</Link>
                    </Button>
                </div>
            </div>
        </nav>
    )
}
