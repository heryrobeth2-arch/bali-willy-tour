"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin, ChevronDown, Shield, Car, Clock } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/images/hero-bali.jpg')" }}
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <MapPin className="size-5 text-amber-400" />
          <span className="text-amber-400 text-sm sm:text-base font-semibold tracking-wider uppercase">
            {t.hero.location}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-5 sm:mb-6 leading-tight">
          Bali{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-teal-400">
            Willy
          </span>{" "}
          Tour
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
          {t.hero.subtitle}
        </p>

        <p className="text-sm sm:text-base text-gray-300 mb-8 sm:mb-10 max-w-xl mx-auto">
          {t.hero.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-base sm:text-lg shadow-lg shadow-teal-600/30 gap-2"
          >
            <Link href="#paket-tour">
              <MapPin className="size-5" />
              {t.hero.lihatPaketTour}
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            className="bg-[#25D366] hover:bg-[#1da851] text-white px-8 py-6 text-base sm:text-lg shadow-lg shadow-[#25D366]/30 gap-2"
          >
            <Link
              href="https://wa.me/6285222329128"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-5" />
              {t.hero.konsultasiViaWhatsApp}
            </Link>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-white/80">
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-teal-400" />
            <span className="text-sm font-medium">{t.hero.trustBadgePrivateTour}</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className="size-5 text-teal-400" />
            <span className="text-sm font-medium">{t.hero.trustBadgePrivateCar}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-teal-400" />
            <span className="text-sm font-medium">{t.hero.trustBadgeFleksibel}</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <Link
          href="#paket-tour"
          className="flex flex-col items-center gap-1 text-white/60 hover:text-white/80 transition-colors"
        >
          <span className="text-xs font-medium tracking-wider">{t.hero.scroll}</span>
          <ChevronDown className="size-5" />
        </Link>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0,80 C360,120 720,40 1080,80 C1260,100 1380,90 1440,80 L1440,120 L0,120 Z"
            fill="var(--color-background)"
          />
        </svg>
      </div>
    </section>
  );
}
