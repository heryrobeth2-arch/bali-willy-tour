"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, MessageCircle, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Header() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navLinks = [
    { href: "#home", label: t.nav.home },
    { href: "#paket-tour", label: t.nav.paketTour },
    { href: "#tentang-kami", label: t.nav.tentangKami },
    { href: "#kontak-booking", label: t.nav.kontakBooking },
    { href: "/membership", label: t.nav.membership, icon: Crown },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Determine active section
      const sectionIds = ["home", "paket-tour", "tentang-kami", "kontak-booking"];
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-md"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-2.5 group">
            <Image
              src="/images/logo-bwt-v2.png"
              alt="Bali Willy Tour Logo"
              width={42}
              height={42}
              className="rounded-full shadow-sm"
            />
            <div className="flex flex-col">
              <span
                className={`text-lg sm:text-xl font-extrabold transition-colors ${
                  scrolled
                    ? "text-teal-700 group-hover:text-teal-600"
                    : "text-white group-hover:text-teal-200"
                }`}
              >
                Bali Willy Tour
              </span>
              <span
                className={`text-[10px] sm:text-xs font-medium tracking-wider uppercase transition-colors ${
                  scrolled ? "text-teal-500" : "text-teal-200"
                }`}
              >
                {t.header.subtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isMembershipPage = link.href.startsWith("/");
              const isActive = !isMembershipPage && activeSection === sectionId;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? scrolled
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-white/20 text-white backdrop-blur-sm"
                      : scrolled
                      ? "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                      : "text-white/85 hover:text-white hover:bg-white/10"
                  } ${isMembershipPage ? (scrolled ? "bg-gradient-to-r from-teal-600 to-sky-500 text-white shadow-sm" : "bg-white/20 text-white backdrop-blur-sm") : ""}`}
                >
                  {link.icon && <link.icon className="size-4" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop WhatsApp + Language + Mobile Menu */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher scrolled={scrolled} />

            <Button
              asChild
              className={`hidden sm:inline-flex gap-2 shadow-md transition-all ${
                scrolled
                  ? "bg-[#25D366] hover:bg-[#1da851] text-white"
                  : "bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm border border-white/20"
              }`}
            >
              <Link
                href="https://wa.me/6281947747789"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" />
                {t.header.whatsapp}
              </Link>
            </Button>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu
                className={`size-6 transition-colors ${
                  scrolled ? "text-teal-700" : "text-white"
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sheet Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[350px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Image
                src="/images/logo-bwt-v2.png"
                alt="Bali Willy Tour Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              Bali Willy Tour
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4 mt-4">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isMembershipPage = link.href.startsWith("/");
              const isActive = !isMembershipPage && activeSection === sectionId;
              return (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors gap-2 ${
                      isActive
                        ? "bg-teal-600 text-white"
                        : "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                    } ${isMembershipPage ? "bg-gradient-to-r from-teal-600 to-sky-500 text-white" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon && <link.icon className="size-5" />}
                    {link.label}
                  </Link>
                </SheetClose>
              );
            })}
            <div className="mt-4 px-4">
              <Button
                asChild
                className="w-full bg-[#25D366] hover:bg-[#1da851] text-white gap-2"
              >
                <Link
                  href="https://wa.me/6281947747789"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" />
                  {t.header.konsultasiViaWhatsApp}
                </Link>
              </Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
