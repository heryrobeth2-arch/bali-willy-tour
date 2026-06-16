"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Crown, LogIn, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";

export default function MemberLoginPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.membership.login.errorInvalid);
        return;
      }

      localStorage.setItem("bwt-member", JSON.stringify(data.member));
      router.push("/membership/dashboard");
    } catch {
      setError(t.membership.login.errorInvalid);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1a1a2e" }}>
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-1">
        {(["id", "en", "zh"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
              language === lang
                ? "bg-teal-600 text-white shadow-lg"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {lang === "id" ? "ID" : lang === "en" ? "EN" : "中文"}
          </button>
        ))}
      </div>

      {/* Header */}
      <header className="py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/membership" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <ArrowLeft className="size-5" />
            <span className="text-sm">{t.membership.login.backToMembership}</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-white">
            <Crown className="size-5" style={{ color: "#14b8a6" }} />
            <span className="font-bold">BWT</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(13,148,136,0.2)", border: "2px solid rgba(13,148,136,0.3)" }}
            >
              <Crown className="size-10" style={{ color: "#14b8a6" }} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{t.membership.login.title}</h1>
            <p style={{ color: "#94a3b8" }}>{t.membership.login.subtitle}</p>
          </div>

          <Card
            className="border-0 rounded-2xl"
            style={{ background: "#252540", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
          >
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="memberId" className="text-white text-base">
                    {t.membership.login.memberId}
                  </Label>
                  <Input
                    id="memberId"
                    type="text"
                    placeholder={t.membership.login.memberIdPlaceholder}
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    required
                    className="rounded-xl h-12 text-base"
                    style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white text-base">
                    {t.membership.login.password}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t.membership.login.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-xl h-12 text-base"
                    style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  />
                </div>

                {error && (
                  <div
                    className="text-sm px-4 py-3 rounded-xl"
                    style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
                  >
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl h-12 text-base font-semibold"
                  style={{ background: "linear-gradient(135deg, #0d9488, #14b8a6)" }}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t.membership.login.loading}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="size-5" />
                      {t.membership.login.submit}
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p style={{ color: "#94a3b8" }} className="text-sm mb-2">
              {t.membership.login.noAccount}
            </p>
            <Link
              href="/membership/admin"
              className="text-sm hover:underline"
              style={{ color: "#0ea5e9" }}
            >
              {t.membership.login.register}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
