"use client";

import Link from "next/link";
import { Crown, Star, Gift, MapPin, Utensils, ShoppingBag, ArrowRight, Sparkles, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";

export default function MembershipPage() {
  const { language, setLanguage, t } = useLanguage();

  const partnerBenefits = [
    {
      icon: Utensils,
      name: "Jimbaran Seafood Restaurant",
      discount: "15% Off",
      description: t.membership.partners.restaurant,
    },
    {
      icon: ShoppingBag,
      name: "Bali Souvenir Center",
      discount: "30% Off",
      description: t.membership.partners.shop,
    },
    {
      icon: Utensils,
      name: "Seminyak Beach Club",
      discount: "10% Off",
      description: t.membership.partners.restaurant,
    },
    {
      icon: ShoppingBag,
      name: "Ubud Art Market Partner",
      discount: "20% Off",
      description: t.membership.partners.shop,
    },
  ];

  const membershipFeatures = [
    {
      icon: Star,
      title: t.membership.features.feature1Title,
      description: t.membership.features.feature1Desc,
    },
    {
      icon: Gift,
      title: t.membership.features.feature2Title,
      description: t.membership.features.feature2Desc,
    },
    {
      icon: Shield,
      title: t.membership.features.feature3Title,
      description: t.membership.features.feature3Desc,
    },
    {
      icon: Users,
      title: t.membership.features.feature4Title,
      description: t.membership.features.feature4Desc,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1a1a2e" }}>
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-1">
        {(["id", "en", "zh"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
              language === lang
                ? "bg-teal-600 text-white shadow-lg"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {lang === "id" ? "ID" : lang === "en" ? "EN" : "中文"}
          </button>
        ))}
      </div>

      {/* Header Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ background: "rgba(26,26,46,0.9)", borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-white">
              <Crown className="size-6" style={{ color: "#14b8a6" }} />
              <span className="text-lg font-bold">BWT Membership</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/membership/login">
                <Button
                  variant="outline"
                  className="rounded-full text-sm sm:text-base"
                  style={{ borderColor: "rgba(255,255,255,0.2)", color: "#e2e8f0" }}
                >
                  Login
                </Button>
              </Link>
              <Link href="/membership/admin">
                <Button
                  className="rounded-full text-sm sm:text-base"
                  style={{ background: "#0d9488" }}
                >
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0a3d62 100%)" }} />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl" style={{ background: "#14b8a6" }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl" style={{ background: "#0ea5e9" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ background: "rgba(13,148,136,0.2)", color: "#14b8a6", border: "1px solid rgba(13,148,136,0.3)" }}>
            <Sparkles className="size-4" />
            {t.membership.hero.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            {t.membership.hero.title} <span style={{ color: "#14b8a6" }}>{t.membership.hero.titleHighlight}</span> <br className="hidden sm:block" />
            {t.membership.hero.subtitle}
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: "#94a3b8" }}>
            {t.membership.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/membership/login">
              <Button
                size="lg"
                className="rounded-full text-lg px-8 py-6 shadow-lg"
                style={{ background: "linear-gradient(135deg, #0d9488, #14b8a6)" }}
              >
                <Crown className="size-5 mr-2" />
                {t.membership.hero.ctaLogin}
              </Button>
            </Link>
            <Link href="/membership/admin">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full text-lg px-8 py-6"
                style={{ borderColor: "rgba(255,255,255,0.3)", color: "#e2e8f0" }}
              >
                {t.membership.hero.ctaLearnMore}
                <ArrowRight className="size-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24" style={{ background: "#1a1a2e" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ background: "rgba(13,148,136,0.2)", color: "#14b8a6", border: "1px solid rgba(13,148,136,0.3)" }}>
              <Sparkles className="size-4" />
              {t.membership.features.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t.membership.features.title}
            </h2>
            <p style={{ color: "#94a3b8" }} className="text-lg max-w-2xl mx-auto">
              {t.membership.features.description}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipFeatures.map((feature) => (
              <Card
                key={feature.title}
                className="border-0 rounded-2xl transition-transform hover:scale-105"
                style={{ background: "#252540", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(13,148,136,0.2)" }}
                  >
                    <feature.icon className="size-7" style={{ color: "#14b8a6" }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p style={{ color: "#94a3b8" }} className="text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24" style={{ background: "#16213e" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ background: "rgba(14,165,233,0.2)", color: "#0ea5e9", border: "1px solid rgba(14,165,233,0.3)" }}>
              <MapPin className="size-4" />
              {t.membership.howItWorks.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t.membership.howItWorks.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: t.membership.howItWorks.step1Title, desc: t.membership.howItWorks.step1Desc, icon: MapPin },
              { step: "2", title: t.membership.howItWorks.step2Title, desc: t.membership.howItWorks.step2Desc, icon: Star },
              { step: "3", title: t.membership.howItWorks.step3Title, desc: t.membership.howItWorks.step3Desc, icon: Gift },
              { step: "4", title: t.membership.howItWorks.step4Title, desc: t.membership.howItWorks.step4Desc, icon: Crown },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold"
                  style={{ background: "linear-gradient(135deg, #0d9488, #0ea5e9)", color: "white" }}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p style={{ color: "#94a3b8" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="py-16 sm:py-24" style={{ background: "#1a1a2e" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ background: "rgba(13,148,136,0.2)", color: "#14b8a6", border: "1px solid rgba(13,148,136,0.3)" }}>
              <Sparkles className="size-4" />
              {t.membership.partners.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t.membership.partners.title}
            </h2>
            <p style={{ color: "#94a3b8" }} className="text-lg max-w-2xl mx-auto">
              {t.membership.partners.description}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerBenefits.map((partner) => (
              <Card
                key={partner.name}
                className="border-0 rounded-2xl transition-transform hover:scale-105"
                style={{ background: "#252540", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(14,165,233,0.2)" }}
                  >
                    <partner.icon className="size-7" style={{ color: "#0ea5e9" }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{partner.name}</h3>
                  <div
                    className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-2"
                    style={{ background: "rgba(13,148,136,0.2)", color: "#14b8a6" }}
                  >
                    {partner.discount}
                  </div>
                  <p style={{ color: "#94a3b8" }} className="text-sm">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24" style={{ background: "linear-gradient(135deg, #0d9488, #0ea5e9)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="size-16 text-white mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t.membership.hero.ctaLogin}
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {t.membership.hero.description}
          </p>
          <Link href="/membership/login">
            <Button
              size="lg"
              className="rounded-full text-xl px-10 py-7 shadow-xl"
              style={{ background: "white", color: "#0d9488" }}
            >
              <Crown className="size-5 mr-2" />
              {t.membership.hero.ctaLogin}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center" style={{ background: "#0f0f23" }}>
        <p style={{ color: "#64748b" }} className="text-sm">
          © 2024 Bali Willy Tour. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
