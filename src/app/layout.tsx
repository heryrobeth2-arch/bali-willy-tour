import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/components/app-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bali Willy Tour - Private Tour Bali yang Nyaman dan Fleksibel",
  description:
    "Nikmati keindahan Bali dengan private tour yang nyaman dan fleksibel. Bali Willy Tour menyediakan paket tour lengkap ke seluruh destinasi wisata Bali termasuk Nusa Penida.",
  keywords: [
    "Bali Tour",
    "Private Tour Bali",
    "Nusa Penida Tour",
    "Paket Wisata Bali",
    "Bali Willy Tour",
    "Tour Guide Bali",
    "Transport Bali",
  ],
  authors: [{ name: "Bali Willy Tour" }],
  icons: {
    icon: "/images/logo-bwt-v2.png",
  },
  openGraph: {
    title: "Bali Willy Tour - Private Tour Bali",
    description:
      "Nikmati keindahan Bali dengan private tour yang nyaman dan fleksibel",
    type: "website",
    siteName: "Bali Willy Tour",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AppProvider>
          {children}
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
