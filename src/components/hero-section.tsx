"use client";

import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  MapPin,
  ChevronDown,
  Shield,
  Car,
  Clock,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { useCallback, useEffect, useRef, useState } from "react";

export function HeroSection() {
  const { t } = useLanguage();

  const [videoEnded, setVideoEnded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [videoSkipped, setVideoSkipped] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // On mount: force muted=true so browser allows autoplay.
  // React's `muted` JSX attribute is buggy — set it imperatively here.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.volume = 1;
    try {
      v.currentTime = 0;
    } catch {
      /* ignore */
    }
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        setVideoEnded(true);
        window.setTimeout(() => setShowContent(true), 80);
      });
    }
  }, []);

  // Replay intro muted (called from IntersectionObserver — no user gesture).
  const playIntroMuted = useCallback(() => {
    const v = videoRef.current;
    setIsMuted(true);
    setVideoEnded(false);
    setVideoSkipped(false);
    setShowContent(false);
    if (!v) return;
    v.muted = true;
    v.volume = 1;
    try {
      v.currentTime = 0;
    } catch {
      /* ignore */
    }
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        setVideoEnded(true);
        window.setTimeout(() => setShowContent(true), 80);
      });
    }
  }, []);

  // THE KEY: this runs SYNCHRONOUSLY inside the click handler (user gesture).
  // Browsers only allow autoplay-with-sound when play() is called from within
  // a user gesture handler. Calling play() in useEffect would be blocked.
  const handleUnmuteClick = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    // Step 1: unmute the element BEFORE calling play()
    v.muted = false;
    v.volume = 1;

    // Step 2: if video ended or paused, restart from beginning with sound
    if (v.ended || v.paused) {
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    }

    // Step 3: call play() synchronously inside the click handler
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.then(() => {
        // Success — sound is now playing
        setIsMuted(false);
        setVideoEnded(false);
        setShowContent(false);
      }).catch((err) => {
        console.warn("[HeroVideo] play-with-sound blocked:", err);
        // Fallback: keep playing muted, but mark as tried
        v.muted = true;
        setIsMuted(true);
      });
    } else {
      setIsMuted(false);
    }
  }, []);

  const handleVideoEnded = useCallback(() => {
    setVideoEnded(true);
    window.setTimeout(() => setShowContent(true), 80);
  }, []);

  const handleSkip = useCallback(() => {
    setVideoSkipped(true);
    setVideoEnded(true);
    window.setTimeout(() => setShowContent(true), 80);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoEnded(true);
    window.setTimeout(() => setShowContent(true), 80);
  }, []);

  // IntersectionObserver: replay intro when scrolling back to Home.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let lastVisible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const isVisible =
            entry.isIntersecting && entry.intersectionRatio >= 0.6;
          if (isVisible && !lastVisible) {
            playIntroMuted();
          }
          lastVisible = isVisible;
        }
      },
      { threshold: [0, 0.6, 1] }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [playIntroMuted]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* === Intro Video Layer === */}
      <div
        className={`absolute inset-0 z-30 transition-opacity duration-700 ${
          videoEnded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-hidden={videoEnded}
      >
        {/*
          CRITICAL: Do NOT pass `muted` or `autoPlay` as JSX attributes.
          React has a known bug where the `muted` attribute doesn't sync
          with the DOM `HTMLMediaElement.muted` property — it can re-mute
          the element on every re-render, undoing our imperative unmute.

          We set v.muted imperatively:
            - On mount (useEffect) → muted = true (for autoplay policy)
            - On click (handleUnmuteClick) → muted = false + play() with sound
        */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/videos/test2.mp4"
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          onError={handleVideoError}
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

        {/* === BIG UNMUTE BUTTON ===
            Positioned at center-bottom, large, pulsing — impossible to miss.
            z-index higher than header (z-50) so it's never covered. */}
        {isMuted && !videoEnded && (
          <button
            type="button"
            onClick={handleUnmuteClick}
            className="absolute left-1/2 bottom-24 -translate-x-1/2 z-[60] flex flex-col items-center gap-3 group"
            aria-label="Aktifkan suara video"
          >
            {/* Pulsing ring animation */}
            <span className="absolute inset-0 -m-4 rounded-full bg-white/20 animate-ping" />
            <span className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white text-black shadow-2xl group-hover:scale-110 transition-transform duration-200 border-4 border-white/50">
              <Volume2 className="size-9" />
            </span>
            <span className="relative px-5 py-2 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-semibold border border-white/30 whitespace-nowrap">
              🔊 Aktifkan Suara
            </span>
          </button>
        )}

        {/* Mute indicator (after unmute — small, top-center, below navbar) */}
        {!isMuted && !videoEnded && (
          <button
            type="button"
            onClick={() => {
              const v = videoRef.current;
              if (!v) return;
              v.muted = true;
              setIsMuted(true);
            }}
            className="absolute left-1/2 top-24 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium border border-white/20"
            aria-label="Mute video"
          >
            <Volume2 className="size-4 text-teal-400" />
            Suara Aktif
          </button>
        )}

        {/* Skip button — bottom right */}
        {!videoSkipped && (
          <button
            type="button"
            onClick={handleSkip}
            className="absolute bottom-6 right-6 z-[60] px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-medium border border-white/20 transition-colors flex items-center gap-2"
            aria-label="Skip intro video"
          >
            <ChevronDown className="size-4" />
            {t.hero?.scroll ?? "Skip"}
          </button>
        )}
      </div>

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
              href="https://wa.me/6281947747789"
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
