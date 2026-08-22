"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { href: "#home", label: t.nav.home },
    { href: "#paket-tour", label: t.nav.paketTour },
    { href: "#tentang-kami", label: t.nav.tentangKami },
    { href: "#kontak-booking", label: t.nav.kontakBooking },
  ];

  const tourLinks = [
    { href: "#paket-tour", label: t.footer.northBali },
    { href: "#paket-tour", label: t.footer.ubudTour },
    { href: "#paket-tour", label: t.footer.southBali },
    { href: "#paket-tour", label: t.footer.eastBali },
    { href: "#paket-tour", label: t.footer.nusaPenida },
    { href: "#paket-tour", label: t.footer.kintamani },
  ];

  return (
    <footer className="bg-teal-900 text-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="#home" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo-bwt-v2.png"
                alt="Bali Willy Tour Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-white">
                Bali Willy Tour
              </span>
            </Link>
            <p className="text-teal-300 text-sm leading-relaxed mb-4">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://instagram.com/baliwillytour"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-teal-800 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </Link>
              <Link
                href="https://facebook.com/baliwillytour"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-teal-800 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="size-4" />
              </Link>
              <Link
                href="https://wa.me/6281947747789"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#25D366] hover:bg-[#1da851] rounded-full flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="size-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">
              {t.footer.navigasi}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-teal-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tour Packages */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">
              {t.footer.paketTour}
            </h3>
            <ul className="space-y-2">
              {tourLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-teal-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">{t.footer.kontak}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="size-4 mt-0.5 shrink-0 text-teal-400" />
                <span className="text-sm text-teal-300">+62 852-223-29128</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="size-4 mt-0.5 shrink-0 text-teal-400" />
                <span className="text-sm text-teal-300">
                  info@baliwillytour.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="size-4 mt-0.5 shrink-0 text-teal-400" />
                <span className="text-sm text-teal-300">
                  Bali, Indonesia
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-teal-400 text-sm">
            &copy; {new Date().getFullYear()} Bali Willy Tour. {t.footer.allRightsReserved}
          </p>
          <p className="text-teal-500 text-xs">
            {t.footer.privateTour}
          </p>
        </div>
      </div>
    </footer>
  );
}
