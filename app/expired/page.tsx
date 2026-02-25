'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Key, ShieldAlert, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function ExpiredPage() {
    return (
        <div className="min-h-screen flex flex-col pt-16">
            <Navbar />
            <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-destructive/5 via-background to-primary/5">
                <Card className="w-full max-w-md p-6 sm:p-10 border-2 border-destructive/10 shadow-2xl bg-card/50 backdrop-blur-xl rounded-3xl text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 mb-8 border-4 border-destructive/5">
                        <ShieldAlert className="w-12 h-12 text-destructive" />
                    </div>

                    <h1 className="text-3xl font-black mb-4 tracking-tight text-destructive">মেয়াদ শেষ হয়েছে!</h1>
                    <p className="text-muted-foreground text-lg font-medium mb-8">
                        দুঃখিত, আপনার অ্যাকাউন্টের মেয়াদ শেষ হয়ে গেছে। পুনরায় অ্যাক্সেস পেতে নতুন সিরিয়াল নম্বর ব্যবহার করুন।
                    </p>

                    <div className="space-y-4">
                        <Button className="w-full h-14 text-lg font-black rounded-2xl gap-2" variant="default">
                            <Key className="w-6 h-6" />
                            নতুন কোড দিন
                        </Button>
                        <Button
                            className="w-full h-14 text-lg font-bold rounded-2xl gap-2 border-2"
                            variant="outline"
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            <LogOut className="w-6 h-6" />
                            লগআউট করুন
                        </Button>
                    </div>

                    <div className="mt-10 p-5 bg-muted rounded-2xl border border-border/50">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">রিনিউয়াল হেল্পলাইন</span>
                        </div>
                        <p className="text-lg font-black text-primary">01XXXXXXXXX</p>
                    </div>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
