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
  VolumeX,
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
  // `playbackKey` forces React to fully recreate the <video> element when it
  // changes. This is the key trick: some browsers "lock" a video element's
  // audio to whatever muted state it started with. The only reliable way to
  // unmute is to recreate the element from scratch with muted=false.
  const [playbackKey, setPlaybackKey] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Kick off a fresh play of the intro. Always forces muted=true because this
  // is also called from IntersectionObserver (no user gesture → browser would
  // reject autoplay-with-sound).
  const playIntro = useCallback(() => {
    setIsMuted(true);
    setVideoEnded(false);
    setVideoSkipped(false);
    setShowContent(false);
    setPlaybackKey((k) => k + 1);
  }, []);

  // When the <video> element is (re)created, configure muted and start
  // playback. The `play()` call here is treated as user-gesture-initiated
  // when triggered from a click handler that incremented `playbackKey`.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Set muted BEFORE play(). Order matters for some browsers.
    v.muted = isMuted;
    v.volume = 1;
    try {
      v.currentTime = 0;
    } catch {
      /* ignore */
    }
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        if (isMuted) {
          // Even muted autoplay failed — fall back to image.
          setVideoEnded(true);
          window.setTimeout(() => setShowContent(true), 80);
        } else {
          // Play-with-sound was blocked. Revert to muted and try again.
          v.muted = true;
          setIsMuted(true);
          try {
            v.play().catch(() => {
              setVideoEnded(true);
              window.setTimeout(() => setShowContent(true), 80);
            });
          } catch {
            setVideoEnded(true);
            window.setTimeout(() => setShowContent(true), 80);
          }
        }
      });
    }
  }, [playbackKey, isMuted]);

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

  // Toggle mute. The trick: by changing `isMuted` AND `playbackKey`, the
  // <video> element is fully recreated (key change) and the new element
  // starts with muted=false. Because this happens inside a click handler,
  // the subsequent play() in useEffect is treated as user-gesture-initiated
  // and is allowed to play with sound.
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    setVideoEnded(false);
    setShowContent(false);
    setPlaybackKey((k) => k + 1);
  }, []);

  // === IntersectionObserver: replay intro when scrolling back to Home. ===
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
            playIntro();
          }
          lastVisible = isVisible;
        }
      },
      { threshold: [0, 0.6, 1] }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [playIntro]);

  // Initial play on mount
  useEffect(() => {
    playIntro();
  }, [playIntro]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* === Intro Video Layer ===
          Always rendered; visibility toggled via CSS so the element stays
          alive for replay. The `key` prop forces a full DOM recreation when
          mute state changes — this is what makes unmute actually work. */}
      <div
        className={`absolute inset-0 z-30 transition-opacity duration-700 ${
          videoEnded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-hidden={videoEnded}
      >
        <video
          key={playbackKey}
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/videos/test2.mp4"
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          onError={handleVideoError}
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

        {/* Sound toggle */}
        <button
          type="button"
          onClick={toggleMute}
          className="absolute top-6 right-6 z-40 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-medium border border-white/20 transition-colors flex items-center gap-2"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="size-4" />
          ) : (
            <Volume2 className="size-4" />
          )}
          {isMuted ? "Unmute" : "Mute"}
        </button>

        {/* Skip button */}
        {!videoSkipped && (
          <button
            type="button"
            onClick={handleSkip}
            className="absolute bottom-6 right-6 z-40 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-medium border border-white/20 transition-colors flex items-center gap-2"
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
