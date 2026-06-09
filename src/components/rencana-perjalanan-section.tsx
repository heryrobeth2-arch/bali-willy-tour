"use client";

import { Clock, Sun, Sunset, Utensils, Mountain, TreePalm, Coffee, Droplets, Plane } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";

interface ItineraryItem {
  time: string;
  activityKey: string;
  icon: React.ReactNode;
}

function DayTimeline({
  dayNumber,
  title,
  items,
  dayLabel,
}: {
  dayNumber: number;
  title: string;
  items: ItineraryItem[];
  dayLabel: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="relative">
      {/* Day Label */}
      <div className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-full mb-6 font-bold text-lg shadow-md">
        <Sun className="size-5" />
        {dayLabel} {dayNumber}
      </div>
      <p className="text-gray-600 mb-6 text-base">{title}</p>

      {/* Timeline */}
      <div className="relative ml-4 sm:ml-6">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-teal-200" />

        <div className="space-y-6">
          {items.map((item, idx) => (
            <div key={idx} className="relative flex items-start gap-4 pl-6">
              {/* Dot */}
              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-teal-500 border-4 border-teal-100 z-10 shadow-sm" />

              <div className="flex-1 bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="size-3.5 text-teal-500" />
                  <span className="text-sm font-bold text-teal-600">
                    {item.time}
                  </span>
                </div>
                <p className="text-gray-700 font-medium">
                  {t.itinerary[item.activityKey as keyof typeof t.itinerary]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RencanaPerjalananSection() {
  const { t } = useLanguage();

  const day1: ItineraryItem[] = [
    {
      time: "15:00",
      activityKey: "day1Act1",
      icon: <Sun className="size-4" />,
    },
    {
      time: "17:00",
      activityKey: "day1Act2",
      icon: <Sunset className="size-4" />,
    },
    {
      time: "17:45",
      activityKey: "day1Act3",
      icon: <Sunset className="size-4" />,
    },
    {
      time: "20:00",
      activityKey: "day1Act4",
      icon: <Utensils className="size-4" />,
    },
    {
      time: "22:00",
      activityKey: "day1Act5",
      icon: <Sun className="size-4" />,
    },
  ];

  const day2: ItineraryItem[] = [
    {
      time: "08:30",
      activityKey: "day2Act1",
      icon: <Sun className="size-4" />,
    },
    {
      time: "11:00",
      activityKey: "day2Act2",
      icon: <TreePalm className="size-4" />,
    },
    {
      time: "12:00",
      activityKey: "day2Act3",
      icon: <Utensils className="size-4" />,
    },
    {
      time: "13:15",
      activityKey: "day2Act4",
      icon: <Mountain className="size-4" />,
    },
    {
      time: "15:30",
      activityKey: "day2Act5",
      icon: <Coffee className="size-4" />,
    },
    {
      time: "17:30",
      activityKey: "day2Act6",
      icon: <Droplets className="size-4" />,
    },
    {
      time: "18:30",
      activityKey: "day2Act7",
      icon: <Plane className="size-4" />,
    },
  ];

  return (
    <section
      id="rencana-perjalanan"
      className="py-16 sm:py-20 bg-gradient-to-b from-amber-50/50 to-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1 rounded-full mb-4 text-sm font-semibold">
            <Clock className="size-4" />
            {t.itinerary.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.itinerary.title.split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="text-teal-600"> {word}</span>
              ) : (
                i === 0 ? word : ` ${word}`
              )
            )}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            {t.itinerary.description}
          </p>
        </div>

        {/* Kecak Dance Banner Image */}
        <div className="relative rounded-2xl overflow-hidden mb-12 sm:mb-16 h-48 sm:h-64">
          <Image
            src="/images/itinerary.jpg"
            alt="Kecak Dance Performance"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
            <p className="text-white text-lg sm:text-xl font-bold">
              {t.itinerary.kecakTitle}
            </p>
            <p className="text-gray-200 text-sm">
              {t.itinerary.kecakDescription}
            </p>
          </div>
        </div>

        {/* Itinerary Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14">
          <DayTimeline
            dayNumber={1}
            title={t.itinerary.day1Title}
            items={day1}
            dayLabel={t.itinerary.day}
          />
          <DayTimeline
            dayNumber={2}
            title={t.itinerary.day2Title}
            items={day2}
            dayLabel={t.itinerary.day}
          />
        </div>
      </div>
    </section>
  );
}
