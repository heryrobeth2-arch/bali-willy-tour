"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  BadgeDollarSign,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  Phone,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/lib/i18n";

export interface MultiDayItineraryDay {
  day: number;
  titleKey: string;
  descriptionKey: string;
  image: string;
  mealsKey?: string;
}

export interface MultiDayPackage {
  id: string;
  nameKey: string;
  descriptionKey: string;
  images: string[];
  durationDays: number;
  durationNights: number;
  startPrice: string;
  minPax: string;
  itinerary: MultiDayItineraryDay[];
  includeKeys: string[];
  excludeKeys: string[];
  termsKeys: string[];
}

interface MultiDayPackageCardProps {
  pkg: MultiDayPackage;
  t: any;
}

export function MultiDayPackageCard({ pkg, t }: MultiDayPackageCardProps) {
  const [open, setOpen] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const packageName = t.multiDay[pkg.nameKey] as string;
  const packageDesc = t.multiDay[pkg.descriptionKey] as string;

  return (
    <>
      <div className="group overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
        {/* Image Carousel */}
        <div className="relative h-56 sm:h-64 overflow-hidden bg-teal-50">
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {pkg.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative flex-[0_0_100%] min-w-0 h-full"
                >
                  <Image
                    src={img}
                    alt={`${packageName} - ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur rounded-full p-1.5 shadow-md transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-4 text-gray-800" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur rounded-full p-1.5 shadow-md transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="size-4 text-gray-800" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {pkg.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === selectedIndex
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>

          <Badge className="absolute top-3 left-3 bg-teal-600 text-white border-none shadow-md">
            <Calendar className="size-3 mr-1" />
            {pkg.durationDays} {t.multiDay.hari} {pkg.durationNights} {t.multiDay.malam}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
            {packageName}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {packageDesc}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="size-4 text-teal-500 shrink-0" />
              <span>{t.multiDay.minPaxLabel}: {pkg.minPax}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="size-4 text-teal-500 shrink-0" />
              <span>{pkg.itinerary.length} {t.multiDay.itinerary}</span>
            </div>
          </div>

          <div className="bg-teal-50 rounded-lg p-3 mb-4">
            <div className="text-xs text-teal-600 mb-1">
              {t.multiDay.hargaMulaiDari}
            </div>
            <div className="flex items-baseline gap-1">
              <BadgeDollarSign className="size-5 text-amber-500" />
              <span className="text-xl font-bold text-teal-700">
                {pkg.startPrice}
              </span>
              <span className="text-xs text-gray-500">/{t.multiDay.orang}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <Button
              type="button"
              onClick={() => setOpen(true)}
              variant="outline"
              className="flex-1 border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
            >
              {t.multiDay.lihatDetail}
            </Button>
            <Button
              asChild
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Link href="#kontak-booking">{t.multiDay.bookingSekarang}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {/* Hero image */}
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <Image
              src={pkg.images[0]}
              alt={packageName}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <DialogHeader className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <DialogTitle className="text-white text-xl sm:text-2xl font-bold">
                {packageName}
              </DialogTitle>
              <DialogDescription className="text-teal-100 text-sm mt-1">
                {pkg.durationDays} {t.multiDay.hari} {pkg.durationNights} {t.multiDay.malam} • {t.multiDay.hargaMulaiDari} {pkg.startPrice}/{t.multiDay.orang}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* Description */}
            <p className="text-sm text-gray-700 leading-relaxed">
              {packageDesc}
            </p>

            {/* Itinerary - Mobile-first clean layout */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="size-5 text-teal-600" />
                {t.multiDay.rincianPerjalanan}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {pkg.itinerary.map((day, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                  >
                    {/* === MOBILE LAYOUT (compact stacked) === */}
                    <div className="sm:hidden">
                      {/* Compact image with day badge overlay */}
                      <div className="relative w-full h-28">
                        <Image
                          src={day.image}
                          alt={t.multiDay[day.titleKey] as string}
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        {/* Day badge top-left */}
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-teal-600 text-white text-xs font-bold shadow-md">
                            Day {day.day}
                          </span>
                        </div>
                        {/* Meal badge top-right */}
                        {day.mealsKey && (
                          <div className="absolute top-2 right-2 max-w-[60%]">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100/95 backdrop-blur text-amber-800 text-[10px] font-medium shadow-sm truncate">
                              <Utensils className="size-2.5 shrink-0" />
                              <span className="truncate">{t.multiDay[day.mealsKey]}</span>
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Content */}
                      <div className="p-3">
                        <h4 className="font-bold text-gray-900 text-sm leading-snug mb-1.5">
                          {t.multiDay[day.titleKey]}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {t.multiDay[day.descriptionKey]}
                        </p>
                      </div>
                    </div>

                    {/* === DESKTOP LAYOUT (horizontal: thumbnail + content) === */}
                    <div className="hidden sm:flex gap-4 p-4">
                      {/* Thumbnail */}
                      <div className="relative w-40 h-28 shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={day.image}
                          alt={t.multiDay[day.titleKey] as string}
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                        <span className="absolute top-1.5 left-1.5 inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-teal-600 text-white text-xs font-bold shadow-md">
                          Day {day.day}
                        </span>
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="font-bold text-gray-900 text-base leading-snug flex-1">
                            {t.multiDay[day.titleKey]}
                          </h4>
                          {day.mealsKey && (
                            <Badge
                              variant="outline"
                              className="text-[11px] bg-amber-50 border-amber-200 text-amber-700 whitespace-nowrap shrink-0 mt-0.5"
                            >
                              <Utensils className="size-3 mr-1" />
                              {t.multiDay[day.mealsKey]}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {t.multiDay[day.descriptionKey]}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Note */}
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-teal-700 font-medium">
                  {t.multiDay.hargaMulaiDari}
                </span>
                <span className="text-2xl font-bold text-teal-700">
                  {pkg.startPrice}
                </span>
              </div>
              <p className="text-xs text-teal-600">
                {t.multiDay.hargaCatatan}
              </p>
            </div>

            {/* Include & Exclude */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h4 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                  <ShieldCheck className="size-4" />
                  {t.multiDay.include}
                </h4>
                <ul className="space-y-2">
                  {pkg.includeKeys.map((key, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-green-800"
                    >
                      <CheckCircle2 className="size-3.5 mt-0.5 shrink-0 text-green-600" />
                      <span>{t.multiDay[key]}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <h4 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                  <XCircle className="size-4" />
                  {t.multiDay.exclude}
                </h4>
                <ul className="space-y-2">
                  {pkg.excludeKeys.map((key, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-red-800"
                    >
                      <XCircle className="size-3.5 mt-0.5 shrink-0 text-red-500" />
                      <span>{t.multiDay[key]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                <ShieldCheck className="size-4" />
                {t.multiDay.syaratKetentuan}
              </h4>
              <ul className="space-y-2">
                {pkg.termsKeys.map((key, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-amber-800"
                  >
                    <span className="font-bold mt-0.5">•</span>
                    <span>{t.multiDay[key]}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                asChild
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Link href="#kontak-booking" onClick={() => setOpen(false)}>
                  {t.multiDay.bookingSekarang}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-[#25D366] text-[#1da851] hover:bg-[#25D366] hover:text-white"
              >
                <Link
                  href="https://wa.me/6285222329128"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="size-4" />
                  {t.multiDay.tanyaWhatsApp}
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
