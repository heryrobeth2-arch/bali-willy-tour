"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Crown, LogOut, Star, Gift, Clock, ArrowRight,
  CreditCard, Wallet, History, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "@/lib/i18n";

interface Transaction {
  transactionId: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

interface Reward {
  rewardId: string;
  namaReward: string;
  poinNeeded: number;
  deskripsi: string;
}

interface MemberData {
  memberId: string;
  nama: string;
  email: string;
  noWhatsapp: string;
  totalPoin: number;
  transactions: Transaction[];
}

export default function MemberDashboardPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [member, setMember] = useState<MemberData | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [redeemMessage, setRedeemMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = useCallback(async () => {
    const stored = localStorage.getItem("bwt-member");
    if (!stored) {
      router.push("/membership/login");
      return;
    }

    try {
      const memberData = JSON.parse(stored) as MemberData;

      // Fetch fresh member data
      const memberRes = await fetch(`/api/members/${memberData.memberId}`);
      if (!memberRes.ok) {
        router.push("/membership/login");
        return;
      }
      const freshMember = await memberRes.json();
      setMember(freshMember);
      localStorage.setItem("bwt-member", JSON.stringify(freshMember));

      // Fetch rewards
      const rewardsRes = await fetch("/api/rewards");
      const rewardsData = await rewardsRes.json();
      setRewards(rewardsData);
    } catch {
      router.push("/membership/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load
    loadData();
  }, []);

  const handleRedeem = async (reward: Reward) => {
    if (!member) return;
    if (member.totalPoin < reward.poinNeeded) return;

    setRedeemingId(reward.rewardId);
    setRedeemMessage(null);

    try {
      const res = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: member.memberId,
          rewardId: reward.rewardId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRedeemMessage({ type: "error", text: data.error || t.membership.dashboard.redeemError });
        return;
      }

      setRedeemMessage({
        type: "success",
        text: t.membership.dashboard.redeemSuccess,
      });

      // Refresh data
      await loadData();
    } catch {
      setRedeemMessage({ type: "error", text: t.membership.dashboard.redeemError });
    } finally {
      setRedeemingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bwt-member");
    router.push("/membership");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "used": return "#14b8a6";
      case "pending": return "#f59e0b";
      case "expired": return "#64748b";
      default: return "#94a3b8";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "used": return t.membership.dashboard.used;
      case "pending": return t.membership.dashboard.pending;
      case "expired": return t.membership.dashboard.expired;
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#1a1a2e" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: "#94a3b8" }}>{t.membership.dashboard.title}...</p>
        </div>
      </div>
    );
  }

  if (!member) return null;

  const visibleTransactions = showAllTransactions
    ? member.transactions
    : member.transactions.slice(0, 5);

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
      <header className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ background: "rgba(26,26,46,0.95)", borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/membership" className="flex items-center gap-2 text-white">
              <Crown className="size-6" style={{ color: "#14b8a6" }} />
              <span className="text-lg font-bold">BWT Member</span>
            </Link>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="rounded-full"
              style={{ color: "#94a3b8" }}
            >
              <LogOut className="size-4 mr-2" />
              {t.membership.dashboard.logout}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome & Stats */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {t.membership.dashboard.title}, <span style={{ color: "#14b8a6" }}>{member.nama}</span>!
          </h1>
          <p style={{ color: "#94a3b8" }}>{t.membership.login.memberId}: {member.memberId}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 rounded-2xl" style={{ background: "linear-gradient(135deg, #0d9488, #14b8a6)" }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                  <Star className="size-5 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">{t.membership.dashboard.totalPoints}</p>
                  <p className="text-2xl font-bold text-white">{member.totalPoin.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 rounded-2xl" style={{ background: "#252540" }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(14,165,233,0.2)" }}>
                  <Wallet className="size-5" style={{ color: "#0ea5e9" }} />
                </div>
                <div>
                  <p style={{ color: "#94a3b8" }} className="text-sm">{t.membership.dashboard.activePoints}</p>
                  <p className="text-xl font-bold text-white">31 Dec 2026</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 rounded-2xl" style={{ background: "#252540" }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(245,158,11,0.2)" }}>
                  <History className="size-5" style={{ color: "#f59e0b" }} />
                </div>
                <div>
                  <p style={{ color: "#94a3b8" }} className="text-sm">{t.membership.dashboard.transactions}</p>
                  <p className="text-xl font-bold text-white">{member.transactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Digital Membership Card */}
          <Card
            className="border-0 rounded-2xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #16213e, #0a3d62)" }}
          >
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Crown className="size-6" style={{ color: "#14b8a6" }} />
                  <span className="text-white font-bold text-lg">Bali Willy Tour</span>
                </div>
                <span
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: "rgba(13,148,136,0.3)", color: "#14b8a6" }}
                >
                  {t.membership.dashboard.member}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white/60 text-sm mb-1">{t.membership.admin.nama}</p>
                  <p className="text-xl font-bold text-white mb-4">{member.nama}</p>
                  <p className="text-white/60 text-sm mb-1">{t.membership.login.memberId}</p>
                  <p className="text-2xl font-bold tracking-wider" style={{ color: "#14b8a6" }}>
                    {member.memberId}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div
                    className="p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    <QRCodeSVG
                      value={`BWT-MEMBER:${member.memberId}`}
                      size={100}
                      fgColor="#ffffff"
                      bgColor="transparent"
                      level="M"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4" style={{ color: "#94a3b8" }} />
                    <span style={{ color: "#94a3b8" }} className="text-sm">
                      {member.totalPoin.toLocaleString()} {t.membership.dashboard.points}
                    </span>
                  </div>
                  <span style={{ color: "#94a3b8" }} className="text-sm">
                    {member.email}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="border-0 rounded-2xl" style={{ background: "#252540" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="size-5" style={{ color: "#0ea5e9" }} />
                  {t.membership.dashboard.pointHistory}
                </h2>
              </div>

              {member.transactions.length === 0 ? (
                <p style={{ color: "#94a3b8" }} className="text-center py-8">
                  {t.membership.dashboard.noTransactions}
                </p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#374151 transparent" }}>
                  {visibleTransactions.map((tx) => (
                    <div
                      key={tx.transactionId}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: "#1a1a2e" }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {tx.description}
                        </p>
                        <p style={{ color: "#64748b" }} className="text-xs">
                          {formatDate(tx.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <span
                          className="text-sm font-bold"
                          style={{ color: tx.type === "earn" ? "#14b8a6" : "#f59e0b" }}
                        >
                          {tx.type === "earn" ? "+" : "-"}{tx.amount}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: `${getStatusColor(tx.status)}20`,
                            color: getStatusColor(tx.status),
                          }}
                        >
                          {getStatusText(tx.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {member.transactions.length > 5 && (
                <Button
                  variant="ghost"
                  className="w-full mt-3 rounded-xl"
                  style={{ color: "#0ea5e9" }}
                  onClick={() => setShowAllTransactions(!showAllTransactions)}
                >
                  {showAllTransactions ? (
                    <ChevronUp className="size-4 mr-1" />
                  ) : (
                    <ChevronDown className="size-4 mr-1" />
                  )}
                  {showAllTransactions ? t.membership.dashboard.showLess : t.membership.dashboard.showAll}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Redeem Message */}
        {redeemMessage && (
          <div
            className="mt-6 px-4 py-3 rounded-xl text-sm"
            style={{
              background: redeemMessage.type === "success" ? "rgba(13,148,136,0.15)" : "rgba(239,68,68,0.15)",
              color: redeemMessage.type === "success" ? "#14b8a6" : "#f87171",
              border: `1px solid ${redeemMessage.type === "success" ? "rgba(13,148,136,0.3)" : "rgba(239,68,68,0.3)"}`,
            }}
          >
            {redeemMessage.text}
          </div>
        )}

        {/* Rewards Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Gift className="size-5" style={{ color: "#f59e0b" }} />
              {t.membership.dashboard.availableRewards}
            </h2>
          </div>

          {rewards.length === 0 ? (
            <p style={{ color: "#94a3b8" }} className="text-center py-8">
              {t.membership.dashboard.noRewards}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => {
                const canRedeem = member.totalPoin >= reward.poinNeeded;
                return (
                  <Card
                    key={reward.rewardId}
                    className="border-0 rounded-2xl transition-transform hover:scale-[1.02]"
                    style={{ background: "#252540" }}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-white flex-1">{reward.namaReward}</h3>
                        <span
                          className="text-sm font-bold px-2.5 py-1 rounded-full flex-shrink-0 ml-2"
                          style={{
                            background: canRedeem ? "rgba(13,148,136,0.2)" : "rgba(100,116,139,0.2)",
                            color: canRedeem ? "#14b8a6" : "#64748b",
                          }}
                        >
                          {reward.poinNeeded.toLocaleString()} {t.membership.dashboard.points}
                        </span>
                      </div>
                      <p style={{ color: "#94a3b8" }} className="text-sm mb-4">
                        {reward.deskripsi}
                      </p>
                      <Button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canRedeem || redeemingId === reward.rewardId}
                        className="w-full rounded-xl h-10"
                        style={{
                          background: canRedeem
                            ? "linear-gradient(135deg, #0d9488, #14b8a6)"
                            : "#374151",
                          color: canRedeem ? "white" : "#64748b",
                        }}
                      >
                        {redeemingId === reward.rewardId ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t.membership.dashboard.redeeming}
                          </div>
                        ) : canRedeem ? (
                          <div className="flex items-center gap-2">
                            <Gift className="size-4" />
                            {t.membership.dashboard.redeemBtn}
                          </div>
                        ) : (
                          t.membership.dashboard.insufficientPoints
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Partner Benefits Quick Access */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="size-5" style={{ color: "#0ea5e9" }} />
            {t.membership.partners.title}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Jimbaran Seafood", discount: "15% Off" },
              { name: "Bali Souvenir Center", discount: "30% Off" },
              { name: "Seminyak Beach Club", discount: "10% Off" },
              { name: "Ubud Art Market", discount: "20% Off" },
            ].map((partner) => (
              <Card
                key={partner.name}
                className="border-0 rounded-xl text-center"
                style={{ background: "#252540" }}
              >
                <CardContent className="p-4">
                  <p className="text-white text-sm font-medium mb-1">{partner.name}</p>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(13,148,136,0.2)", color: "#14b8a6" }}
                  >
                    {partner.discount}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button
              variant="outline"
              className="rounded-full"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "#94a3b8" }}
            >
              <ArrowRight className="size-4 mr-2 rotate-180" />
              Bali Willy Tour
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
