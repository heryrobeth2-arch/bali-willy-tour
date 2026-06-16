"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, LogIn, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";

export default function AdminLoginPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.membership.admin.errorInvalid);
        return;
      }

      localStorage.setItem("bwt-admin", JSON.stringify(data.admin));
      router.push("/membership/admin/dashboard");
    } catch {
      setError(t.membership.admin.errorInvalid);
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
                ? "bg-sky-600 text-white shadow-lg"
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
            <span className="text-sm">{t.membership.admin.backToMembership}</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-white">
            <Shield className="size-5" style={{ color: "#0ea5e9" }} />
            <span className="font-bold">BWT Admin</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(14,165,233,0.2)", border: "2px solid rgba(14,165,233,0.3)" }}
            >
              <Shield className="size-10" style={{ color: "#0ea5e9" }} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{t.membership.admin.loginTitle}</h1>
            <p style={{ color: "#94a3b8" }}>{t.membership.admin.loginSubtitle}</p>
          </div>

          <Card
            className="border-0 rounded-2xl"
            style={{ background: "#252540", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
          >
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white text-base">
                    {t.membership.admin.username}
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder={t.membership.admin.usernamePlaceholder}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="rounded-xl h-12 text-base"
                    style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white text-base">
                    {t.membership.admin.password}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t.membership.admin.passwordPlaceholder}
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
                  style={{ background: "linear-gradient(135deg, #0369a1, #0ea5e9)" }}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t.membership.admin.loading}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="size-5" />
                      {t.membership.admin.submit}
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link
              href="/membership/login"
              className="text-sm hover:underline"
              style={{ color: "#14b8a6" }}
            >
              ← {t.membership.login.title}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
