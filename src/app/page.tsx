import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { PaketTourSection } from "@/components/paket-tour-section";
import { RencanaPerjalananSection } from "@/components/rencana-perjalanan-section";
import { TentangKamiSection } from "@/components/tentang-kami-section";
import { KontakBookingSection } from "@/components/kontak-booking-section";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PaketTourSection />
        <RencanaPerjalananSection />
        <TentangKamiSection />
        <KontakBookingSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
