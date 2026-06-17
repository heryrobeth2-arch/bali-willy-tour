"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  BadgeDollarSign,
  AlertCircle,
  Phone,
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
    price: "1.050K per car",
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
    price: "1.000K per car",
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
    price: "1.000K per car",
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
    price: "1.050K per car",
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
    price: "Start from 950K / person",
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
    price: "1.000K per car",
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
      "2 pax": "1.150K",
      "3 pax": "1.100K",
      "4 pax": "1.050K",
      "5 pax": "1.000K",
      "6 pax": "950K",
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
      "2 pax": "1.150K",
      "3 pax": "1.100K",
      "4 pax": "1.050K",
      "5 pax": "1.000K",
      "6 pax": "950K",
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
      "2 pax": "1.200K",
      "3 pax": "1.150K",
      "4 pax": "1.100K",
      "5 pax": "1.050K",
      "6 pax": "1.000K",
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
      "2 pax": "1.250K",
      "3 pax": "1.200K",
      "4 pax": "1.150K",
      "5 pax": "1.200K",
      "6 pax": "1.150K",
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

export function PaketTourSection() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("semua");

  const filteredPackages = regularPackages.filter((pkg) => {
    if (activeTab === "semua") return true;
    if (activeTab === "full-day") return pkg.category === "full-day";
    if (activeTab === "nusa-penida") return pkg.category === "nusa-penida";
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
                    href="https://wa.me/6285222329128"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="size-4" />
                    {t.paketTour.customWhatsApp}
                  </Link>
                </Button>
              </div>
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
                {t.paketTour.max7Orang}
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

        {/* Nusa Penida Section */}
        <div className="mt-16 sm:mt-20">
          {/* Nusa Penida Banner */}
          <div className="relative rounded-2xl overflow-hidden mb-10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/nusa-penida.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-900/85 to-teal-800/60" />
            <div className="relative z-10 py-12 sm:py-16 px-6 sm:px-10 text-center">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                {t.paketTour.npTitle}
              </h3>
              <p className="text-teal-100 text-base sm:text-lg max-w-xl mx-auto">
                {t.paketTour.npDescription}
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-teal-200 text-sm">
                <Users className="size-4" />
                <span>{t.paketTour.npMax6Orang}</span>
              </div>
            </div>
          </div>

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
