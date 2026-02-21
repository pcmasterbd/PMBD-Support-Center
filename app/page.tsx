'use client'

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
import { useLanguage } from "@/lib/language-context"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 md:pt-36 pb-12 md:pb-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,transparent_70%)] opacity-[0.05]" />
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-5 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 md:px-5 md:py-2.5 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 md:w-5 h-5 animate-pulse" />
              <span className="text-[10px] md:text-sm font-black uppercase tracking-widest">{t('landing.heroSubtitle')}</span>
            </div>

            <h1 className="leading-[1.1] tracking-tighters sm:px-4 md:px-0">
              {t('landing.heroTitle').split(' ').map((word, i) =>
                word === 'BD' ? <span key={i} className="text-primary italic"> BD</span> : (i > 0 ? ' ' + word : word)
              )}
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-10 font-medium text-sm sm:text-base md:text-xl leading-relaxed sm:px-6">
              {t('landing.heroDescription')}
            </p>

            <div className="flex flex-col xs:flex-row gap-3.5 md:gap-5 justify-center pt-2 md:pt-4 px-2 sm:px-0">
              <Button size="lg" className="text-base md:text-xl h-12 md:h-16 px-6 md:px-12 rounded-xl md:rounded-2xl font-black shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95 w-full xs:w-auto" asChild>
                <Link href="/login">
                  {t('landing.getStarted')}
                  <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base md:text-xl h-12 md:h-16 px-6 md:px-12 rounded-xl md:rounded-2xl font-bold border-2 hover:bg-muted/50 active:scale-95 w-full xs:w-auto" asChild>
                <Link href="#tutorials">{t('landing.watchTutorials')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 md:py-28 px-4 bg-muted/30 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="mb-4 md:mb-6 tracking-tight">
              {t('landing.featuresTitle')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-medium text-sm md:text-lg leading-relaxed px-4">
              {t('landing.featuresSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10">
            <FeatureCard icon={<Shield className="w-8 h-8" />} title={t('landing.feature1Title')} description={t('landing.feature1Desc')} />
            <FeatureCard icon={<Video className="w-8 h-8" />} title={t('landing.feature2Title')} description={t('landing.feature2Desc')} />
            <FeatureCard icon={<Download className="w-8 h-8" />} title={t('landing.feature3Title')} description={t('landing.feature3Desc')} />
            <FeatureCard icon={<Key className="w-8 h-8" />} title={t('landing.feature4Title')} description={t('landing.feature4Desc')} />
            <FeatureCard icon={<Zap className="w-8 h-8" />} title={t('landing.feature3Title')} description={t('landing.feature3Desc')} />
            <FeatureCard icon={<Users className="w-8 h-8" />} title={t('landing.feature4Title')} description={t('landing.feature4Desc')} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 px-4 overflow-hidden bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="mb-4 md:mb-6 tracking-tight">
              {t('landing.howItWorksTitle')}
            </h2>
          </div>

          <div className="space-y-6 md:space-y-10 px-2 sm:px-0">
            <StepCard number="1" title={t('landing.step1Title')} description={t('landing.step1Desc')} />
            <StepCard number="2" title={t('landing.step2Title')} description={t('landing.step2Desc')} />
            <StepCard number="3" title={t('landing.step3Title')} description={t('landing.step3Desc')} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-40 px-4 bg-gradient-to-br from-primary/15 via-blue-500/5 to-purple-500/15 relative overflow-hidden border-y border-primary/5">
        <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/10 rounded-full blur-[100px] md:blur-[150px] -mr-48 md:-mr-80 -mt-48 md:-mt-80 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-500/10 rounded-full blur-[100px] md:blur-[150px] -ml-48 md:-ml-80 -mb-48 md:-mb-80" />

        <div className="container mx-auto max-w-4xl text-center relative z-10 px-4">
          <h2 className="mb-6 md:mb-8 tracking-tighter leading-tight">{t('landing.ctaTitle')}</h2>
          <p className="text-muted-foreground mb-10 md:mb-16 max-w-2xl mx-auto font-medium text-sm md:text-xl leading-relaxed sm:px-10">
            {t('landing.ctaDesc')}
          </p>
          <Button size="lg" className="text-lg md:text-2xl h-14 md:h-20 px-10 md:px-20 rounded-2xl md:rounded-3xl font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1 active:scale-95 w-full sm:w-auto" asChild>
            <Link href="/login">
              {t('landing.ctaButton')}
              <ArrowRight className="ml-3 w-6 h-6 md:w-8 md:h-8" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-20 px-4 border-t bg-slate-50/50 dark:bg-zinc-950/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">PM</div>
                <h3 className="font-black text-xl m-0 tracking-tight">PC MASTER BD</h3>
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
                <li><Link href="#features" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary/40" /> {t('landing.featuresTitle')}
                </Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 md:mb-6 text-base md:text-lg text-foreground">{t('landing.footerFollowUs')}</h4>
              <ul className="space-y-3.5 text-sm md:text-base">
                <li><Link href="#tutorials" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary/40" /> {t('navbar.tutorials')}
                </Link></li>
                <li><Link href="#support" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
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
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-5 md:p-8 hover:shadow-2xl transition-all hover:-translate-y-2 border-2 hover:border-primary/50 group bg-card/50 backdrop-blur-sm shadow-xl shadow-black/5">
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 md:mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        <div className="w-6 h-6 md:w-8 md:h-8">{icon}</div>
      </div>
      <h3 className="font-bold text-lg md:text-2xl mb-2.5 md:mb-4 tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{description}</p>
    </Card>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-4 md:gap-8 items-start group">
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-black text-xl md:text-3xl flex-shrink-0 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
        {number}
      </div>
      <div className="flex-1 min-w-0 pt-1 md:pt-2">
        <h3 className="font-bold text-lg md:text-3xl mb-2 md:mb-4 flex items-center gap-3 tracking-tight">
          {title}
          <CheckCircle2 className="w-5 h-5 md:w-8 md:h-8 text-primary flex-shrink-0" />
        </h3>
        <p className="text-muted-foreground text-sm md:text-lg leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
