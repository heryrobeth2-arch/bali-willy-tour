"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

const languageOptions: { value: Language; label: string; flag: string }[] = [
  { value: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "zh", label: "中文", flag: "🇨🇳" },
];

interface LanguageSwitcherProps {
  scrolled?: boolean;
}

export function LanguageSwitcher({ scrolled = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const currentLang = languageOptions.find((l) => l.value === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1.5 h-9 px-2.5 text-sm font-medium transition-colors ${
            scrolled
              ? "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
              : "text-white/90 hover:text-white hover:bg-white/10"
          }`}
        >
          <Globe className="size-4" />
          <span className="hidden sm:inline">{currentLang?.flag} {currentLang?.value.toUpperCase()}</span>
          <span className="sm:hidden">{currentLang?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languageOptions.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => setLanguage(lang.value)}
            className={`cursor-pointer ${
              language === lang.value ? "bg-teal-50 text-teal-700 font-semibold" : ""
            }`}
          >
            <span className="text-base mr-2">{lang.flag}</span>
            <span>{lang.label}</span>
            {language === lang.value && (
              <span className="ml-auto text-teal-600 text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
