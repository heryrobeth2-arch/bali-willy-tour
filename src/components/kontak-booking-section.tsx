"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export function KontakBookingSection() {
  const { t } = useLanguage();

  const packageOptions = [
    t.kontak.pkgA,
    t.kontak.pkgB,
    t.kontak.pkgC,
    t.kontak.pkgD,
    t.kontak.pkgE,
    t.kontak.pkgF,
    t.kontak.npPkgA,
    t.kontak.npPkgB,
    t.kontak.npPkgC,
    t.kontak.npPkgD,
    t.kontak.customTour,
  ];

  const contactInfo = [
    {
      icon: <Phone className="size-5" />,
      label: t.kontak.labelWhatsApp,
      value: "+62 819-477-47789",
      href: "https://wa.me/6281947747789",
    },
    {
      icon: <Mail className="size-5" />,
      label: "Email",
      value: "info@baliwillytour.com",
      href: "mailto:info@baliwillytour.com",
    },
    {
      icon: <MapPin className="size-5" />,
      label: t.kontak.labelLokasi,
      value: "Bali, Indonesia",
      href: "#",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    package: "",
    date: "",
    participants: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build WhatsApp message
    const waMessage = `${t.kontak.waGreeting}
${t.kontak.waNama} ${formData.name}
Email: ${formData.email}
WhatsApp: ${formData.whatsapp}
${t.kontak.waPaket} ${formData.package}
${t.kontak.waTanggal} ${formData.date}
${t.kontak.waJumlahPeserta} ${formData.participants}
${t.kontak.waPesan} ${formData.message}`;

    const encodedMessage = encodeURIComponent(waMessage);
    window.open(
      `https://wa.me/6281947747789?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <section
      id="kontak-booking"
      className="py-16 sm:py-20 bg-gradient-to-b from-background to-teal-50/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-1 rounded-full mb-4 text-sm font-semibold">
            <MessageCircle className="size-4" />
            {t.kontak.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.kontak.title.split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="text-teal-600"> {word}</span>
              ) : (
                i === 0 ? word : ` ${word}`
              )
            )}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            {t.kontak.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-teal-100">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  {t.kontak.infoKontak}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {contactInfo.map((info, idx) => (
                  <Link
                    key={idx}
                    href={info.href}
                    target={info.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      info.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{info.label}</p>
                      <p className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* WhatsApp CTA */}
            <Button
              asChild
              className="w-full bg-[#25D366] hover:bg-[#1da851] text-white h-12 text-base"
            >
              <Link
                href="https://wa.me/6281947747789"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="size-5" />
                {t.kontak.chatViaWhatsApp}
              </Link>
            </Button>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-3">
            <Card className="border-teal-100">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  {t.kontak.formBooking}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.kontak.namaLengkap}</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder={t.kontak.namaPlaceholder}
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.kontak.email}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">{t.kontak.nomorWhatsApp}</Label>
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        placeholder="+62 819 xxxx xxxx"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="participants">{t.kontak.jumlahPeserta}</Label>
                      <Input
                        id="participants"
                        name="participants"
                        type="number"
                        min="1"
                        max="7"
                        placeholder="1 - 7"
                        value={formData.participants}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="package-select">{t.kontak.pilihPaket}</Label>
                      <Select
                        value={formData.package}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, package: value }))
                        }
                      >
                        <SelectTrigger id="package-select">
                          <SelectValue placeholder={t.kontak.pilihPaketPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {packageOptions.map((pkg, idx) => (
                            <SelectItem key={idx} value={pkg}>
                              {pkg}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">{t.kontak.tanggalTour}</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t.kontak.pesanTambahan}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder={t.kontak.pesanPlaceholder}
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base"
                  >
                    <Send className="size-4" />
                    {t.kontak.kirimBooking}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
