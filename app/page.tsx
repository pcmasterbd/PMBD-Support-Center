import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import {
  Shield,
  Video,
  Download,
  Key,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 md:pt-36 pb-10 md:pb-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,transparent_70%)] opacity-[0.03]" />
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 md:w-4 h-4" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider">Official Support Center</span>
            </div>

            <h1 className="leading-[1.1] tracking-tighter">
              PC MASTER <span className="text-primary italic">BD</span>
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 font-medium text-sm md:text-lg leading-relaxed">
              Master Bootable Pendrive এর জন্য সম্পূর্ণ সাপোর্ট সেন্টার।
              ভেরিফিকেশন, টিউটোরিয়াল, সফটওয়্যার এবং প্রিমিয়াম রিসোর্স - সব এক জায়গায়।
            </p>

            <div className="flex flex-col xs:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4">
              <Button size="lg" className="text-base md:text-lg h-12 md:h-14 px-6 md:px-10 rounded-xl md:rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95" asChild>
                <Link href="/register">
                  Verify Your Pendrive
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base md:text-lg h-12 md:h-14 px-6 md:px-10 rounded-xl md:rounded-2xl font-bold border-2 hover:bg-muted/50 active:scale-95" asChild>
                <Link href="/login">Login Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="mb-3 md:mb-4 tracking-tight">
              কেন PC MASTER BD বেছে নেবেন?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-medium text-sm md:text-base">
              আমরা প্রদান করি সম্পূর্ণ সাপোর্ট এবং প্রিমিয়াম রিসোর্স
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Verified Pendrive"
              description="প্রতিটি Pendrive সিরিয়াল নম্বর দিয়ে ভেরিফাইড এবং সুরক্ষিত"
            />
            <FeatureCard
              icon={<Video className="w-8 h-8" />}
              title="Video Tutorials"
              description="বাংলায় সম্পূর্ণ ভিডিও টিউটোরিয়াল - Windows, Linux সব কিছু"
            />
            <FeatureCard
              icon={<Download className="w-8 h-8" />}
              title="Software Downloads"
              description="প্রয়োজনীয় সকল সফটওয়্যার এবং টুলস ডাউনলোড করুন"
            />
            <FeatureCard
              icon={<Key className="w-8 h-8" />}
              title="Premium Accounts"
              description="Netflix, Spotify সহ প্রিমিয়াম একাউন্ট এবং লাইসেন্স কী"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Fast Support"
              description="দ্রুত সাপোর্ট এবং সমস্যা সমাধান"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Community"
              description="হাজারো ব্যবহারকারীর বিশ্বস্ত কমিউনিটি"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-28 px-4 overflow-hidden">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="mb-3 md:mb-4 tracking-tight">
              কিভাবে শুরু করবেন?
            </h2>
            <p className="text-muted-foreground text-sm md:text-base font-medium">
              মাত্র ৩টি সহজ ধাপে আপনার Pendrive ভেরিফাই করুন
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            <StepCard
              number="1"
              title="Register করুন"
              description="আপনার Pendrive এর সিরিয়াল নম্বর দিয়ে একাউন্ট তৈরি করুন"
            />
            <StepCard
              number="2"
              title="Verify করুন"
              description="সিরিয়াল নম্বর ভেরিফাই হলে আপনার একাউন্ট এক্টিভ হবে"
            />
            <StepCard
              number="3"
              title="Access করুন"
              description="সকল টিউটোরিয়াল, সফটওয়্যার এবং প্রিমিয়াম রিসোর্স ব্যবহার করুন"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-32 px-4 bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="mb-4 md:mb-6 tracking-tight">
            এখনই শুরু করুন
          </h2>
          <p className="text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto font-medium text-sm md:text-lg leading-relaxed">
            আপনার Master Bootable Pendrive এর সম্পূর্ণ সুবিধা নিন।
            সিরিয়াল নম্বর দিয়ে রেজিস্টার করুন এবং এক্সক্লুসিভ রিসোর্স পান।
          </p>
          <Button size="lg" className="text-base md:text-xl h-14 md:h-16 px-8 md:px-14 rounded-2xl font-black shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95" asChild>
            <Link href="/register">
              Verify Your Pendrive Now
              <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 md:py-16 px-4 border-t bg-slate-50/50 dark:bg-zinc-950/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">PM</div>
                <h3 className="font-bold text-lg m-0">PC MASTER BD</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Master Bootable Pendrive এর অফিসিয়াল সাপোর্ট সেন্টার। প্রিমিয়াম রিসোর্স এবং টিউটোরিয়ালের নির্ভরযোগ্য মাধ্যম।
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Quick Links</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><Link href="/register" className="text-muted-foreground hover:text-primary">Register</Link></li>
                <li><Link href="/login" className="text-muted-foreground hover:text-primary">Login</Link></li>
                <li><Link href="#features" className="text-muted-foreground hover:text-primary">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Resources</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><Link href="#tutorials" className="text-muted-foreground hover:text-primary">Tutorials</Link></li>
                <li><Link href="#software" className="text-muted-foreground hover:text-primary">Software</Link></li>
                <li><Link href="#support" className="text-muted-foreground hover:text-primary">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Contact</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li className="break-all">Email: support@pcmasterbd.com</li>
                <li>Phone: +880 1XXX-XXXXXX</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t text-center text-xs sm:text-sm text-muted-foreground">
            © 2024 PC MASTER BD. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 sm:mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-base sm:text-lg mb-1.5 sm:mb-2">{title}</h3>
      <p className="text-muted-foreground text-xs sm:text-sm">{description}</p>
    </Card>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-3 sm:gap-4 items-start">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base sm:text-xl mb-1.5 sm:mb-2 flex items-center gap-2">
          {title}
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base">{description}</p>
      </div>
    </div>
  )
}
