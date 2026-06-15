"use client";

import Image from "next/image";
import {
  Users,
  Eye,
  Target,
  Car,
  Clock,
  Heart,
  CheckCircle,
  MessageCircle,
  Sun,
  Sunset,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";

export function TentangKamiSection() {
  const { t } = useLanguage();

  const misiItems = [
    t.tentangKami.misi1,
    t.tentangKami.misi2,
    t.tentangKami.misi3,
    t.tentangKami.misi4,
    t.tentangKami.misi5,
  ];

  const offerings = [
    {
      icon: <Sun className="size-6" />,
      title: t.tentangKami.offering1Title,
      description: t.tentangKami.offering1Desc,
    },
    {
      icon: <Sunset className="size-6" />,
      title: t.tentangKami.offering2Title,
      description: t.tentangKami.offering2Desc,
    },
    {
      icon: <MapPin className="size-6" />,
      title: t.tentangKami.offering3Title,
      description: t.tentangKami.offering3Desc,
    },
  ];

  const whyChooseUs = [
    {
      icon: <Car className="size-5" />,
      title: t.tentangKami.why1Title,
      description: t.tentangKami.why1Desc,
    },
    {
      icon: <Clock className="size-5" />,
      title: t.tentangKami.why2Title,
      description: t.tentangKami.why2Desc,
    },
    {
      icon: <Users className="size-5" />,
      title: t.tentangKami.why3Title,
      description: t.tentangKami.why3Desc,
    },
    {
      icon: <Heart className="size-5" />,
      title: t.tentangKami.why4Title,
      description: t.tentangKami.why4Desc,
    },
  ];

  const commitments = [
    {
      icon: <MessageCircle className="size-5" />,
      title: t.tentangKami.commit1Title,
      description: t.tentangKami.commit1Desc,
    },
    {
      icon: <Clock className="size-5" />,
      title: t.tentangKami.commit2Title,
      description: t.tentangKami.commit2Desc,
    },
    {
      icon: <CheckCircle className="size-5" />,
      title: t.tentangKami.commit3Title,
      description: t.tentangKami.commit3Desc,
    },
  ];

  return (
    <section id="tentang-kami" className="py-16 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-1 rounded-full mb-4 text-sm font-semibold">
            <Users className="size-4" />
            {t.tentangKami.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.tentangKami.title.split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="text-teal-600"> {word}</span>
              ) : (
                i === 0 ? word : ` ${word}`
              )
            )}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            {t.tentangKami.subtitle}
          </p>
        </div>

        {/* About + Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 mb-16">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 lg:h-auto">
            <Image
              src="/images/about-uluwatu.jpg"
              alt="Uluwatu Temple - Bali Willy Tour"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-900/30 to-transparent" />
          </div>

          {/* Text Content */}
          <div className="space-y-8">
            {/* Siapa Kami */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="size-6 text-teal-600" />
                {t.tentangKami.siapaKami}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t.tentangKami.siapaKamiDescription}
              </p>
            </div>

            {/* Visi & Misi */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Eye className="size-6 text-teal-600" />
                {t.tentangKami.visiMisi}
              </h3>
              <div className="mb-4">
                <h4 className="font-semibold text-teal-700 mb-1 flex items-center gap-2">
                  <Target className="size-4" />
                  {t.tentangKami.visi}
                </h4>
                <p className="text-gray-600">
                  {t.tentangKami.visiDescription}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-teal-700 mb-2 flex items-center gap-2">
                  <Target className="size-4" />
                  {t.tentangKami.misi}
                </h4>
                <ul className="space-y-2">
                  {misiItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="size-4 text-teal-500 mt-0.5 shrink-0" />
                      <span className="text-gray-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t.tentangKami.apaYangKamiTawarkan}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {offerings.map((offering, idx) => (
              <Card
                key={idx}
                className="text-center hover:shadow-lg transition-shadow border-teal-100 py-0 gap-0"
              >
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                    {offering.icon}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {offering.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{offering.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t.tentangKami.kenapaMemilih}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 bg-teal-50 rounded-xl p-5 border border-teal-100 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Commitments */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t.tentangKami.komitmenKami}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {commitments.map((item, idx) => (
              <div
                key={idx}
                className="text-center p-6 bg-amber-50 rounded-xl border border-amber-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
