"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin, ChevronDown, Shield, Car, Clock } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";

export function HeroSection() {
  const { t } = useLanguage();
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoSkipped, setVideoSkipped] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Persist "already played" within the same session so revisits don't replay
  // the intro every time the user scrolls back to the hero.
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const flag = window.sessionStorage.getItem("bwt_intro_played");
    if (flag === "1") {
      setHasPlayed(true);
      setVideoEnded(true);
    }
  }, []);

  const handleVideoEnded = () => {
    setVideoEnded(true);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("bwt_intro_played", "1");
    }
    // Stagger content reveal for a smoother transition
    window.setTimeout(() => setShowContent(true), 80);
  };

  const handleSkip = () => {
    setVideoSkipped(true);
    setVideoEnded(true);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("bwt_intro_played", "1");
    }
    window.setTimeout(() => setShowContent(true), 80);
  };

  // Fallback: if the video fails to load, show the hero immediately.
  const handleVideoError = () => {
    setVideoEnded(true);
    window.setTimeout(() => setShowContent(true), 80);
  };

  const introActive = !videoEnded && !hasPlayed;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* === Intro Video Layer (plays first) === */}
      {introActive && (
        <div
          className={`absolute inset-0 z-30 transition-opacity duration-700 ${
            videoSkipped ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden={videoEnded}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src="/videos/test2.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
            onError={handleVideoError}
          />
          {/* Subtle gradient overlay to keep brand cohesion during intro */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

          {/* Skip button */}
          <button
            type="button"
            onClick={handleSkip}
            className="absolute bottom-6 right-6 z-40 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-medium border border-white/20 transition-colors flex items-center gap-2"
            aria-label="Skip intro video"
          >
            <ChevronDown className="size-4" />
            {t.hero?.scroll ?? "Skip"}
          </button>
        </div>
      )}

      {/* === Background Image (revealed after video ends) === */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-opacity duration-1000 ${
          videoEnded ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: "url('/images/hero-bali.jpg')" }}
      />

      {/* Overlay Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70 transition-opacity duration-1000 ${
          videoEnded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Content */}
      <div
        className={`relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center transition-all duration-700 ${
          showContent
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
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

      {/* Scroll indicator (only after video ends) */}
      {videoEnded && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <Link
            href="#paket-tour"
            className="flex flex-col items-center gap-1 text-white/60 hover:text-white/80 transition-colors"
          >
            <span className="text-xs font-medium tracking-wider">{t.hero.scroll}</span>
            <ChevronDown className="size-5" />
          </Link>
        </div>
      )}

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
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
