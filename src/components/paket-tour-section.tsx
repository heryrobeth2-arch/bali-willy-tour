"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import {
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  BadgeDollarSign,
  AlertCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/lib/i18n";
import {
  MultiDayPackageCard,
  type MultiDayPackage,
} from "@/components/multi-day-package-card";

interface TourPackage {
  id: string;
  nameKey: string;
  image: string;
  pickupTime: string;
  destinationKeys: string[];
  price?: string;
  category: "full-day" | "nusa-penida" | "custom";
  badgeKey?: string;
}

const regularPackages: TourPackage[] = [
  {
    id: "package-a",
    nameKey: "packageA",
    image: "/images/package-a.jpg",
    pickupTime: "08:00 AM",
    destinationKeys: [
      "destTanahLot",
      "destTamanAyun",
      "destUlundanu",
      "destHandaraGate",
      "destWanagiriHill",
    ],
    price: "900K per car",
    category: "full-day",
  },
  {
    id: "package-b",
    nameKey: "packageB",
    image: "/images/package-b.jpg",
    pickupTime: "08:00 AM",
    destinationKeys: [
      "destTirtaEmpul",
      "destBaliSwings",
      "destSatriaCoffee",
      "destMujiArt",
      "destTegenungan",
      "destATV",
      "destUbudPalace",
    ],
    price: "850K per car",
    category: "full-day",
  },
  {
    id: "package-c",
    nameKey: "packageC",
    image: "/images/package-c.jpg",
    pickupTime: "08:00 AM",
    destinationKeys: [
      "destTanjungBenoa",
      "destMelasti",
      "destUluwatu",
      "destTheEdge",
      "destJimbaran",
    ],
    price: "850K per car",
    category: "full-day",
  },
  {
    id: "package-d",
    nameKey: "packageD",
    image: "/images/package-d.jpg",
    pickupTime: "04:00 AM",
    destinationKeys: [
      "destLempuyang",
      "destTirtagangga",
      "destTamanUjung",
      "destBlueLagoon",
    ],
    price: "900K per car",
    category: "full-day",
    badgeKey: "badgeEarlyStart",
  },
  {
    id: "package-e",
    nameKey: "packageE",
    image: "/images/package-e.jpg",
    pickupTime: "06:30 AM",
    destinationKeys: [
      "destBrokenBeach",
      "destAngelBillabong",
      "destKelingking",
      "destCrystalBay",
    ],
    category: "nusa-penida",
    badgeKey: "badgeNusaPenida",
    price: "Start from 800K / person",
  },
  {
    id: "package-f",
    nameKey: "packageF",
    image: "/images/package-f.jpg",
    pickupTime: "08:00 AM",
    destinationKeys: [
      "destPenglipuran",
      "destKantoLampo",
      "destKintamani",
      "destTirtaEmpul",
      "destElephantCave",
    ],
    price: "850K per car",
    category: "full-day",
  },
];

interface NusaPenidaPackage {
  id: string;
  nameKey: string;
  destinationKeys: string[];
  prices: Record<string, string>;
}

const nusaPenidaPackages: NusaPenidaPackage[] = [
  {
    id: "np-a",
    nameKey: "npPackageA",
    destinationKeys: [
      "npDestKelingking",
      "npDestBrokenBeach",
      "npDestAngelBillabong",
      "npDestCrystalBeach",
    ],
    prices: {
      "2 pax": "1.000K",
      "3 pax": "950K",
      "4 pax": "900K",
      "5 pax": "850K",
      "6 pax": "800K",
    },
  },
  {
    id: "np-b",
    nameKey: "npPackageB",
    destinationKeys: [
      "npDestAtuh",
      "npDestDiamond",
      "npDestTreeHouse",
      "npDestThousandIslands",
    ],
    prices: {
      "2 pax": "1.000K",
      "3 pax": "950K",
      "4 pax": "900K",
      "5 pax": "850K",
      "6 pax": "800K",
    },
  },
  {
    id: "np-c",
    nameKey: "npPackageC",
    destinationKeys: [
      "npDestAtuh",
      "npDestDiamond",
      "npDestKelingking",
      "npDestBrokenBeach",
      "npDestAngelBillabong",
    ],
    prices: {
      "2 pax": "1.050K",
      "3 pax": "1.000K",
      "4 pax": "950K",
      "5 pax": "900K",
      "6 pax": "850K",
    },
  },
  {
    id: "np-d",
    nameKey: "npPackageD",
    destinationKeys: [
      "npDestSnorkeling",
      "npDestWestSide",
    ],
    prices: {
      "2 pax": "1.100K",
      "3 pax": "1.050K",
      "4 pax": "1.000K",
      "5 pax": "1.050K",
      "6 pax": "1.000K",
    },
  },
];

const nusaPenidaIncludeKeys = [
  "npInclude1",
  "npInclude2",
  "npInclude3",
  "npInclude4",
  "npInclude5",
  "npInclude6",
  "npInclude7",
  "npInclude8",
] as const;

const multiDayPackages: MultiDayPackage[] = [
  {
    id: "discover-penida-4d3n",
    nameKey: "pkgDiscoverPenidaName",
    descriptionKey: "pkgDiscoverPenidaDesc",
    images: [
      "/images/nusa-penida.jpg",
      "/images/package-a.jpg",
      "/images/package-f.jpg",
      "/images/package-b.jpg",
      "/images/package-e.jpg",
    ],
    durationDays: 4,
    durationNights: 3,
    startPrice: "IDR 2.550.000",
    minPax: "2",
    itinerary: [
      {
        day: 1,
        titleKey: "day1Title",
        descriptionKey: "day1Desc",
        mealsKey: "day1Meals",
        image: "/images/package-a.jpg",
      },
      {
        day: 2,
        titleKey: "day2Title",
        descriptionKey: "day2Desc",
        mealsKey: "day2Meals",
        image: "/images/package-f.jpg",
      },
      {
        day: 3,
        titleKey: "day3Title",
        descriptionKey: "day3Desc",
        mealsKey: "day3Meals",
        image: "/images/nusa-penida.jpg",
      },
      {
        day: 4,
        titleKey: "day4Title",
        descriptionKey: "day4Desc",
        mealsKey: "day4Meals",
        image: "/images/np4d-krisna.png",
      },
    ],
    includeKeys: [
      "inc1", "inc2", "inc3", "inc4", "inc5",
      "inc6", "inc7", "inc8", "inc9", "inc10", "inc11",
    ],
    excludeKeys: ["exc1", "exc2", "exc3", "exc4", "exc5"],
    termsKeys: [
      "term1", "term2", "term3", "term4", "term5",
      "term6", "term7", "term8", "term9", "term10",
    ],
  },
  {
    id: "nusa-penida-3d2n",
    nameKey: "pkgNusaPenida3d2nName",
    descriptionKey: "pkgNusaPenida3d2nDesc",
    images: [
      "/images/np3d-kelingking.jpg",
      "/images/np3d-angels-billabong.webp",
      "/images/np3d-broken-beach.jpg",
    ],
    durationDays: 3,
    durationNights: 2,
    startPrice: "IDR 3.200.000",
    minPax: "2",
    itinerary: [
      {
        day: 1,
        titleKey: "np3d_day1Title",
        descriptionKey: "np3d_day1Desc",
        mealsKey: "np3d_day1Meals",
        image: "/images/package-e.jpg",
      },
      {
        day: 2,
        titleKey: "np3d_day2Title",
        descriptionKey: "np3d_day2Desc",
        mealsKey: "np3d_day2Meals",
        image: "/images/nusa-penida.jpg",
      },
      {
        day: 3,
        titleKey: "np3d_day3Title",
        descriptionKey: "np3d_day3Desc",
        mealsKey: "np3d_day3Meals",
        image: "/images/package-f.jpg",
      },
    ],
    includeKeys: [
      "np3d_inc1", "np3d_inc2", "np3d_inc3", "np3d_inc4", "np3d_inc5",
      "np3d_inc6", "np3d_inc7", "np3d_inc8", "np3d_inc9", "np3d_inc10",
    ],
    excludeKeys: ["np3d_exc1", "np3d_exc2", "np3d_exc3", "np3d_exc4", "np3d_exc5"],
    termsKeys: [
      "np3d_term1", "np3d_term2", "np3d_term3", "np3d_term4", "np3d_term5",
      "np3d_term6", "np3d_term7", "np3d_term8", "np3d_term9", "np3d_term10",
    ],
  },
];

// === Nusa Penida Banner Carousel ===
const nusaPenidaBannerImages = [
  "/images/np-alec-favale.jpg",
  "/images/np-beach-club.jpg",
  "/images/np-angels-billabong.webp",
];

function NusaPenidaBanner({
  title,
  description,
  maxPaxNote,
}: {
  title: string;
  description: string;
  maxPaxNote: string;
}) {
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

  // Auto-play every 4 seconds
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative rounded-2xl overflow-hidden mb-10 group/banner">
      {/* Carousel - gambar tampil dengan warna asli, TANPA overlay */}
      <div className="overflow-hidden h-[280px] sm:h-[340px] md:h-[380px]" ref={emblaRef}>
        <div className="flex h-full">
          {nusaPenidaBannerImages.map((img, idx) => (
            <div
              key={idx}
              className="relative flex-[0_0_100%] min-w-0 h-full"
            >
              <Image
                src={img}
                alt={`Nusa Penida ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Subtle bottom-only gradient (only for text legibility at bottom, NOT covering whole image) */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

      {/* Navigation arrows - show on hover (desktop) */}
      <button
        type="button"
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur rounded-full p-2 shadow-md transition-all hover:scale-110 opacity-0 group-hover/banner:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-5 text-white drop-shadow-lg" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur rounded-full p-2 shadow-md transition-all hover:scale-110 opacity-0 group-hover/banner:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="size-5 text-white drop-shadow-lg" />
      </button>

      {/* Text content - posisi di bawah, dengan drop shadow agresif supaya tetap readable tanpa overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end text-center px-6 sm:px-10 pb-10 sm:pb-12 pt-16">
        <h3
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 24px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.8)" }}
        >
          {title}
        </h3>
        <p
          className="text-white text-base sm:text-lg max-w-xl mx-auto"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.7)" }}
        >
          {description}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-white text-sm bg-black/55 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
          <Users className="size-4" />
          <span>{maxPaxNote}</span>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="absolute top-4 right-1/2 translate-x-1/2 flex gap-2 z-20">
        {nusaPenidaBannerImages.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => emblaApi?.scrollTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === selectedIndex
                ? "w-8 bg-white shadow-lg"
                : "w-2 bg-white/60 hover:bg-white/90"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function PaketTourSection() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("semua");

  const filteredPackages = regularPackages.filter((pkg) => {
    if (activeTab === "semua") return true;
    if (activeTab === "full-day") return pkg.category === "full-day";
    // Sembunyikan semua paket reguler di tab Nusa Penida —
    // yang tampil hanya paket multi-hari + paket day-tour Nusa Penida di bawah
    if (activeTab === "nusa-penida") return false;
    if (activeTab === "custom") return pkg.category === "custom";
    return true;
  });

  return (
    <section id="paket-tour" className="py-16 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <Badge
            variant="secondary"
            className="bg-teal-100 text-teal-700 mb-4 px-4 py-1"
          >
            {t.paketTour.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.paketTour.title.split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="text-teal-600"> {word}</span>
              ) : (
                i === 0 ? word : ` ${word}`
              )
            )}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            {t.paketTour.description}
          </p>
        </div>

        {/* Filter Tabs */}
        <Tabs
          defaultValue="semua"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-10"
        >
          <TabsList className="mx-auto flex w-fit flex-wrap justify-center gap-1 bg-teal-50 p-1">
            <TabsTrigger
              value="semua"
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              {t.paketTour.tabSemua}
            </TabsTrigger>
            <TabsTrigger
              value="full-day"
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              {t.paketTour.tabFullDayTour}
            </TabsTrigger>
            <TabsTrigger
              value="nusa-penida"
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              {t.paketTour.tabNusaPenidaTour}
            </TabsTrigger>
            <TabsTrigger
              value="custom"
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              {t.paketTour.tabCustomTour}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {/* Regular packages section — sembunyikan saat tab nusa-penida (hanya tampilkan multi-day di tab itu) */}
            {activeTab !== "nusa-penida" && (
              <>
                {/* Mobile swipe hint */}
                <p className="md:hidden text-center text-xs text-gray-400 mb-3 flex items-center justify-center gap-1.5">
                  <span>&larr;</span>
                  {t.paketTour.swipeHint || "Geser untuk melihat lebih banyak paket"}
                  <span>&rarr;</span>
                </p>
                {/* Regular Packages - Horizontal scroll on mobile, grid on desktop */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8 md:overflow-visible md:snap-none">
                  {filteredPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-teal-100 hover:border-teal-300 py-0 gap-0 snap-start shrink-0 w-[78%] sm:w-[300px] md:w-auto md:shrink"
                >
                  {/* Image */}
                  <div className="relative h-52 sm:h-56 overflow-hidden">
                    <Image
                      src={pkg.image}
                      alt={t.paketTour[pkg.nameKey as keyof typeof t.paketTour] as string}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {pkg.badgeKey && (
                      <Badge className="absolute top-3 left-3 bg-amber-500 text-white border-none">
                        {t.paketTour[pkg.badgeKey as keyof typeof t.paketTour] as string}
                      </Badge>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-sm">
                      <Clock className="size-4" />
                      <span>{t.paketTour.pickup} {pkg.pickupTime}</span>
                    </div>
                  </div>

                  <CardHeader className="pb-2 pt-5">
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                      {t.paketTour[pkg.nameKey as keyof typeof t.paketTour] as string}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <ul className="space-y-1.5">
                      {pkg.destinationKeys.map((destKey, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <MapPin className="size-3.5 text-teal-500 mt-0.5 shrink-0" />
                          <span>{t.paketTour[destKey as keyof typeof t.paketTour] as string}</span>
                        </li>
                      ))}
                    </ul>
                    {pkg.price && (
                      <div className="mt-4 pt-3 border-t border-teal-50">
                        <div className="flex items-center gap-2">
                          <BadgeDollarSign className="size-5 text-amber-500" />
                          <span className="text-base font-bold text-teal-700">
                            {pkg.price}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pb-5 pt-0">
                    <Button
                      asChild
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      <Link href="#kontak-booking">{t.paketTour.bookingSekarang}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Empty state for Custom Tour */}
            {activeTab === "custom" && (
              <div className="text-center py-12">
                <MapPin className="size-12 text-teal-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {t.paketTour.customTitle}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {t.paketTour.customDescription}
                </p>
                <Button
                  asChild
                  className="bg-[#25D366] hover:bg-[#1da851] text-white"
                >
                  <Link
                    href="https://wa.me/6281947747789
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="size-4" />
                    {t.paketTour.customWhatsApp}
                  </Link>
                </Button>
              </div>
            )}
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Important Notes Box */}
        <div className="mt-10 sm:mt-14 bg-amber-50 border border-amber-200 rounded-xl p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="size-6 text-amber-500 shrink-0 mt-0.5" />
            <h3 className="text-lg font-bold text-amber-800">
              {t.paketTour.infoPenting}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-amber-600 shrink-0" />
              <span className="text-amber-800 font-medium">
                {t.paketTour.privateTourNote}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="size-5 text-amber-600 shrink-0" />
              <span className="text-amber-800 font-medium">
                {t.paketTour.max6Orang}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <BadgeDollarSign className="size-5 text-amber-600 shrink-0" />
              <span className="text-amber-800 font-medium">
                {t.paketTour.noHiddenCharge}
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Day Packages Section - Show in "semua" and "nusa-penida" tabs */}
        {(activeTab === "semua" || activeTab === "nusa-penida") && (
          <div className="mt-16 sm:mt-20">
            {/* Section Header */}
            <div className="text-center mb-10 sm:mb-12">
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-700 mb-4 px-4 py-1"
              >
                {t.multiDay.sectionBadge}
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {t.multiDay.sectionTitle}
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                {t.multiDay.sectionDescription}
              </p>
            </div>

            {/* Multi-Day Package Cards */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar lg:grid lg:grid-cols-2 lg:gap-8 lg:overflow-visible lg:snap-none">
              {multiDayPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="snap-start shrink-0 w-[85%] sm:w-[420px] lg:w-auto lg:shrink"
                >
                  <MultiDayPackageCard pkg={pkg} t={t} />
                </div>
              ))}
            </div>

            {/* Mobile swipe hint */}
            <p className="lg:hidden text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
              <span>&larr;</span>
              {t.paketTour.swipeHint}
              <span>&rarr;</span>
            </p>
          </div>
        )}

        {/* Nusa Penida Section */}
        <div className="mt-16 sm:mt-20">
          {/* Nusa Penida Banner - Carousel */}
          <NusaPenidaBanner
            title={t.paketTour.npTitle}
            description={t.paketTour.npDescription}
            maxPaxNote={t.paketTour.npMax6Orang}
          />

          {/* Nusa Penida Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
            {nusaPenidaPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className="hover:shadow-lg transition-all duration-300 border-teal-100"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {t.paketTour[pkg.nameKey as keyof typeof t.paketTour] as string}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">
                      {t.paketTour.destinasi}
                    </h4>
                    <ul className="space-y-1.5">
                      {pkg.destinationKeys.map((destKey, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <MapPin className="size-3.5 text-teal-500 mt-0.5 shrink-0" />
                          <span>{t.paketTour[destKey as keyof typeof t.paketTour] as string}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price Table */}
                  <div className="bg-teal-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-teal-700 mb-3">
                      {t.paketTour.hargaPerOrang}
                    </h4>
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-1 -mx-1 px-1 no-scrollbar sm:grid sm:grid-cols-5 sm:gap-2 sm:overflow-visible sm:snap-none sm:pb-0">
                      {Object.entries(pkg.prices).map(([pax, price]) => (
                        <div
                          key={pax}
                          className="text-center bg-white rounded-md px-2 py-2 border border-teal-100 snap-start shrink-0 min-w-[64px] sm:min-w-0 sm:shrink"
                        >
                          <div className="text-[11px] text-gray-500 font-medium whitespace-nowrap">
                            {pax}
                          </div>
                          <div className="text-xs sm:text-sm font-bold text-teal-700 whitespace-nowrap leading-tight mt-0.5">
                            {price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <Link href="#kontak-booking">{t.paketTour.bookingSekarang}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* What's Included */}
          <div className="bg-teal-50 rounded-xl p-6 sm:p-8 border border-teal-100">
            <h4 className="text-lg font-bold text-teal-800 mb-4">
              {t.paketTour.hargaSudahTermasuk}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nusaPenidaIncludeKeys.map((key) => (
                <div key={key} className="flex items-start gap-2">
                  <ShieldCheck className="size-4 text-teal-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-teal-800">{t.paketTour[key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
