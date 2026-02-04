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
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Official Support Center</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              PC MASTER BD
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Master Bootable Pendrive এর জন্য সম্পূর্ণ সাপোর্ট সেন্টার।
              <br className="hidden md:block" />
              ভেরিফিকেশন, টিউটোরিয়াল, সফটওয়্যার এবং প্রিমিয়াম রিসোর্স - সব এক জায়গায়।
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="text-lg h-12 px-8" asChild>
                <Link href="/register">
                  Verify Your Pendrive
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-12 px-8" asChild>
                <Link href="/login">Login to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              কেন PC MASTER BD বেছে নেবেন?
            </h2>
            <p className="text-muted-foreground text-lg">
              আমরা প্রদান করি সম্পূর্ণ সাপোর্ট এবং প্রিমিয়াম রিসোর্স
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              কিভাবে শুরু করবেন?
            </h2>
            <p className="text-muted-foreground text-lg">
              মাত্র ৩টি সহজ ধাপে আপনার Pendrive ভেরিফাই করুন
            </p>
          </div>

          <div className="space-y-6">
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
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-blue-500/10 to-purple-500/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            এখনই শুরু করুন
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            আপনার Master Bootable Pendrive এর সম্পূর্ণ সুবিধা নিন।
            সিরিয়াল নম্বর দিয়ে রেজিস্টার করুন এবং এক্সক্লুসিভ রিসোর্স পান।
          </p>
          <Button size="lg" className="text-lg h-14 px-10" asChild>
            <Link href="/register">
              Verify Your Pendrive Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">PC MASTER BD</h3>
              <p className="text-sm text-muted-foreground">
                Master Bootable Pendrive এর অফিসিয়াল সাপোর্ট সেন্টার
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register" className="text-muted-foreground hover:text-primary">Register</Link></li>
                <li><Link href="/login" className="text-muted-foreground hover:text-primary">Login</Link></li>
                <li><Link href="#features" className="text-muted-foreground hover:text-primary">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#tutorials" className="text-muted-foreground hover:text-primary">Tutorials</Link></li>
                <li><Link href="#software" className="text-muted-foreground hover:text-primary">Software</Link></li>
                <li><Link href="#support" className="text-muted-foreground hover:text-primary">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@pcmasterbd.com</li>
                <li>Phone: +880 1XXX-XXXXXX</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 PC MASTER BD. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary/50">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </Card>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-xl mb-2 flex items-center gap-2">
          {title}
          <CheckCircle2 className="w-5 h-5 text-primary" />
        </h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
