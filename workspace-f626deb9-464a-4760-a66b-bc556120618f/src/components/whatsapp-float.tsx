"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function WhatsAppFloat() {
  const { t } = useLanguage();

  return (
    <Link
      href="https://wa.me/6285222329128"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1da851] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 transition-all hover:scale-110 group"
      aria-label={t.waFloat.chatViaWhatsApp}
    >
      <MessageCircle className="size-6 text-white" />
      {/* Tooltip */}
      <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {t.waFloat.chatViaWhatsApp}
      </span>
    </Link>
  );
}
