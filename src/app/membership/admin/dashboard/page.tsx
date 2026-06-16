"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield, LogOut, Users, MapPin, Gift, CheckCircle,
  Plus, Pencil, Trash2, X, Save, Search, Clock, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface Member {
  memberId: string;
  nama: string;
  email: string;
  noWhatsapp: string;
  totalPoin: number;
  createdAt: string;
  _count?: { transactions: number };
}

interface TourPackage {
  packageId: string;
  namaTour: string;
  deskripsi: string;
  gambarUrl: string;
  customLink: string;
  createdAt: string;
}

interface Reward {
  rewardId: string;
  namaReward: string;
  poinNeeded: number;
  deskripsi: string;
}

interface VoucherTransaction {
  transactionId: string;
  memberId: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("members");

  // Data states
  const [members, setMembers] = useState<Member[]>([]);
  const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [vouchers, setVouchers] = useState<VoucherTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [memberDialog, setMemberDialog] = useState<{ open: boolean; mode: "add" | "edit"; data: Member | null }>({
    open: false, mode: "add", data: null,
  });
  const [tourDialog, setTourDialog] = useState<{ open: boolean; mode: "add" | "edit"; data: TourPackage | null }>({
    open: false, mode: "add", data: null,
  });
  const [rewardDialog, setRewardDialog] = useState<{ open: boolean; mode: "add" | "edit"; data: Reward | null }>({
    open: false, mode: "add", data: null,
  });

  // Search
  const [memberSearch, setMemberSearch] = useState("");

  // Form states
  const [memberForm, setMemberForm] = useState({ memberId: "", nama: "", email: "", noWhatsapp: "", password: "", totalPoin: 0 });
  const [tourForm, setTourForm] = useState({ namaTour: "", deskripsi: "", gambarUrl: "", customLink: "" });
  const [rewardForm, setRewardForm] = useState({ namaReward: "", poinNeeded: 0, deskripsi: "" });

  // Notification
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const [membersRes, toursRes, rewardsRes] = await Promise.all([
        fetch("/api/members"),
        fetch("/api/tour-packages"),
        fetch("/api/rewards"),
      ]);

      if (membersRes.ok) setMembers(await membersRes.json());
      if (toursRes.ok) setTourPackages(await toursRes.json());
      if (rewardsRes.ok) setRewards(await rewardsRes.json());

      // Fetch pending vouchers
      const membersData = membersRes.ok ? await membersRes.json() : [];
      const allVouchers: VoucherTransaction[] = [];
      for (const m of membersData) {
        try {
          const txRes = await fetch(`/api/members/${m.memberId}/transactions`);
          if (txRes.ok) {
            const txs = await txRes.json();
            const pending = txs.filter((tx: VoucherTransaction) => tx.type === "redeem" && tx.status === "pending");
            allVouchers.push(...pending.map((v: VoucherTransaction) => ({ ...v, memberId: m.memberId })));
          }
        } catch { /* skip */ }
      }
      setVouchers(allVouchers);
    } catch {
      showNotification("error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("bwt-admin");
    if (!stored) {
      router.push("/membership/admin");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load
    fetchData();
  }, []);

  // CRUD: Members
  const openAddMember = () => {
    setMemberForm({ memberId: "", nama: "", email: "", noWhatsapp: "", password: "", totalPoin: 0 });
    setMemberDialog({ open: true, mode: "add", data: null });
  };

  const openEditMember = (member: Member) => {
    setMemberForm({
      memberId: member.memberId,
      nama: member.nama,
      email: member.email,
      noWhatsapp: member.noWhatsapp,
      password: "",
      totalPoin: member.totalPoin,
    });
    setMemberDialog({ open: true, mode: "edit", data: member });
  };

  const saveMember = async () => {
    try {
      if (memberDialog.mode === "add") {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memberForm),
        });
        if (!res.ok) {
          const data = await res.json();
          showNotification("error", data.error || "Failed to add member");
          return;
        }
        showNotification("success", "Member added successfully!");
      } else {
        const updateData: Record<string, unknown> = {
          nama: memberForm.nama,
          email: memberForm.email,
          noWhatsapp: memberForm.noWhatsapp,
          totalPoin: memberForm.totalPoin,
        };
        if (memberForm.password) updateData.password = memberForm.password;
        const res = await fetch(`/api/members/${memberForm.memberId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
        if (!res.ok) {
          showNotification("error", "Failed to update member");
          return;
        }
        showNotification("success", "Member updated successfully!");
      }
      setMemberDialog({ open: false, mode: "add", data: null });
      fetchData();
    } catch {
      showNotification("error", "Network error");
    }
  };

  const deleteMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await fetch(`/api/members/${memberId}`, { method: "DELETE" });
      if (!res.ok) {
        showNotification("error", "Failed to delete member");
        return;
      }
      showNotification("success", "Member deleted successfully!");
      fetchData();
    } catch {
      showNotification("error", "Network error");
    }
  };

  // CRUD: Tour Packages
  const openAddTour = () => {
    setTourForm({ namaTour: "", deskripsi: "", gambarUrl: "", customLink: "" });
    setTourDialog({ open: true, mode: "add", data: null });
  };

  const openEditTour = (tour: TourPackage) => {
    setTourForm({
      namaTour: tour.namaTour,
      deskripsi: tour.deskripsi,
      gambarUrl: tour.gambarUrl,
      customLink: tour.customLink,
    });
    setTourDialog({ open: true, mode: "edit", data: tour });
  };

  const saveTour = async () => {
    try {
      if (tourDialog.mode === "add") {
        const res = await fetch("/api/tour-packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tourForm),
        });
        if (!res.ok) {
          showNotification("error", "Failed to add tour package");
          return;
        }
        showNotification("success", "Tour package added!");
      } else {
        const res = await fetch(`/api/tour-packages/${tourDialog.data!.packageId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tourForm),
        });
        if (!res.ok) {
          showNotification("error", "Failed to update tour package");
          return;
        }
        showNotification("success", "Tour package updated!");
      }
      setTourDialog({ open: false, mode: "add", data: null });
      fetchData();
    } catch {
      showNotification("error", "Network error");
    }
  };

  const deleteTour = async (id: string) => {
    if (!confirm("Delete this tour package?")) return;
    try {
      const res = await fetch(`/api/tour-packages/${id}`, { method: "DELETE" });
      if (!res.ok) {
        showNotification("error", "Failed to delete");
        return;
      }
      showNotification("success", "Tour package deleted!");
      fetchData();
    } catch {
      showNotification("error", "Network error");
    }
  };

  // CRUD: Rewards
  const openAddReward = () => {
    setRewardForm({ namaReward: "", poinNeeded: 0, deskripsi: "" });
    setRewardDialog({ open: true, mode: "add", data: null });
  };

  const openEditReward = (reward: Reward) => {
    setRewardForm({
      namaReward: reward.namaReward,
      poinNeeded: reward.poinNeeded,
      deskripsi: reward.deskripsi,
    });
    setRewardDialog({ open: true, mode: "edit", data: reward });
  };

  const saveReward = async () => {
    try {
      if (rewardDialog.mode === "add") {
        const res = await fetch("/api/rewards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rewardForm),
        });
        if (!res.ok) {
          showNotification("error", "Failed to add reward");
          return;
        }
        showNotification("success", "Reward added!");
      } else {
        const res = await fetch(`/api/rewards/${rewardDialog.data!.rewardId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rewardForm),
        });
        if (!res.ok) {
          showNotification("error", "Failed to update reward");
          return;
        }
        showNotification("success", "Reward updated!");
      }
      setRewardDialog({ open: false, mode: "add", data: null });
      fetchData();
    } catch {
      showNotification("error", "Network error");
    }
  };

  const deleteReward = async (id: string) => {
    if (!confirm("Delete this reward?")) return;
    try {
      const res = await fetch(`/api/rewards/${id}`, { method: "DELETE" });
      if (!res.ok) {
        showNotification("error", "Failed to delete");
        return;
      }
      showNotification("success", "Reward deleted!");
      fetchData();
    } catch {
      showNotification("error", "Network error");
    }
  };

  // Verify voucher
  const verifyVoucher = async (transactionId: string, status: "used" | "expired") => {
    try {
      const res = await fetch(`/api/vouchers/${transactionId}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        showNotification("error", "Failed to verify voucher");
        return;
      }
      showNotification("success", `Voucher marked as ${status}!`);
      fetchData();
    } catch {
      showNotification("error", "Network error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bwt-admin");
    router.push("/membership/admin");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const filteredMembers = members.filter((m) =>
    m.nama.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.memberId.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#1a1a2e" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: "#94a3b8" }}>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const inputStyle = { background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", color: "white" };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1a1a2e" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ background: "rgba(26,26,46,0.95)", borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="size-6" style={{ color: "#0ea5e9" }} />
              <span className="text-lg font-bold text-white">BWT Admin</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" className="rounded-full text-sm" style={{ color: "#94a3b8" }}>
                  View Site
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="ghost" className="rounded-full" style={{ color: "#94a3b8" }}>
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div
          className="fixed top-20 right-4 z-[100] px-4 py-3 rounded-xl text-sm shadow-lg animate-in fade-in slide-in-from-right"
          style={{
            background: notification.type === "success" ? "#0d9488" : "#dc2626",
            color: "white",
          }}
        >
          {notification.text}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full sm:w-auto rounded-xl p-1" style={{ background: "#252540" }}>
            <TabsTrigger value="members" className="rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white text-gray-400 gap-1.5">
              <Users className="size-4" />
              <span className="hidden sm:inline">Members</span>
            </TabsTrigger>
            <TabsTrigger value="tours" className="rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white text-gray-400 gap-1.5">
              <MapPin className="size-4" />
              <span className="hidden sm:inline">Tour Packages</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white text-gray-400 gap-1.5">
              <Gift className="size-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="vouchers" className="rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white text-gray-400 gap-1.5">
              <CheckCircle className="size-4" />
              <span className="hidden sm:inline">Vouchers</span>
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-white">Member Management</h2>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: "#64748b" }} />
                  <Input
                    placeholder="Search members..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="rounded-xl pl-9 h-10"
                    style={inputStyle}
                  />
                </div>
                <Button onClick={openAddMember} className="rounded-xl gap-1.5" style={{ background: "#0d9488" }}>
                  <Plus className="size-4" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </div>
            </div>

            <Card className="border-0 rounded-2xl overflow-hidden" style={{ background: "#252540" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#1a1a2e" }}>
                      <th className="text-left px-4 py-3 font-medium" style={{ color: "#94a3b8" }}>ID</th>
                      <th className="text-left px-4 py-3 font-medium" style={{ color: "#94a3b8" }}>Name</th>
                      <th className="text-left px-4 py-3 font-medium hidden sm:table-cell" style={{ color: "#94a3b8" }}>Email</th>
                      <th className="text-left px-4 py-3 font-medium" style={{ color: "#94a3b8" }}>Points</th>
                      <th className="text-right px-4 py-3 font-medium" style={{ color: "#94a3b8" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((m) => (
                      <tr key={m.memberId} className="border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        <td className="px-4 py-3 font-mono text-sm" style={{ color: "#14b8a6" }}>{m.memberId}</td>
                        <td className="px-4 py-3 text-white">{m.nama}</td>
                        <td className="px-4 py-3 hidden sm:table-cell" style={{ color: "#94a3b8" }}>{m.email}</td>
                        <td className="px-4 py-3 font-semibold text-white">{m.totalPoin.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button onClick={() => openEditMember(m)} variant="ghost" size="icon" className="rounded-lg" style={{ color: "#0ea5e9" }}>
                              <Pencil className="size-4" />
                            </Button>
                            <Button onClick={() => deleteMember(m.memberId)} variant="ghost" size="icon" className="rounded-lg" style={{ color: "#ef4444" }}>
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredMembers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8" style={{ color: "#64748b" }}>
                          No members found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Tour Packages Tab */}
          <TabsContent value="tours">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Tour Package Management</h2>
              <Button onClick={openAddTour} className="rounded-xl gap-1.5" style={{ background: "#0d9488" }}>
                <Plus className="size-4" />
                <span className="hidden sm:inline">Add Package</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tourPackages.map((tour) => (
                <Card key={tour.packageId} className="border-0 rounded-2xl" style={{ background: "#252540" }}>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2">{tour.namaTour}</h3>
                    <p style={{ color: "#94a3b8" }} className="text-sm mb-3 line-clamp-2">{tour.deskripsi}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(14,165,233,0.2)", color: "#0ea5e9" }}>
                        {tour.gambarUrl}
                      </span>
                    </div>
                    <p className="text-xs truncate mb-3" style={{ color: "#64748b" }}>
                      Link: {tour.customLink}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => openEditTour(tour)} variant="outline" size="sm" className="rounded-xl flex-1 gap-1.5" style={{ borderColor: "rgba(14,165,233,0.3)", color: "#0ea5e9" }}>
                        <Pencil className="size-3" />
                        Edit
                      </Button>
                      <Button onClick={() => deleteTour(tour.packageId)} variant="outline" size="sm" className="rounded-xl flex-1 gap-1.5" style={{ borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }}>
                        <Trash2 className="size-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {tourPackages.length === 0 && (
                <div className="col-span-full text-center py-12" style={{ color: "#64748b" }}>
                  No tour packages yet
                </div>
              )}
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Reward Management</h2>
              <Button onClick={openAddReward} className="rounded-xl gap-1.5" style={{ background: "#0d9488" }}>
                <Plus className="size-4" />
                <span className="hidden sm:inline">Add Reward</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => (
                <Card key={reward.rewardId} className="border-0 rounded-2xl" style={{ background: "#252540" }}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-white flex-1">{reward.namaReward}</h3>
                      <span
                        className="text-sm font-bold px-2.5 py-1 rounded-full flex-shrink-0 ml-2"
                        style={{ background: "rgba(13,148,136,0.2)", color: "#14b8a6" }}
                      >
                        {reward.poinNeeded.toLocaleString()} pts
                      </span>
                    </div>
                    <p style={{ color: "#94a3b8" }} className="text-sm mb-4">{reward.deskripsi}</p>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => openEditReward(reward)} variant="outline" size="sm" className="rounded-xl flex-1 gap-1.5" style={{ borderColor: "rgba(14,165,233,0.3)", color: "#0ea5e9" }}>
                        <Pencil className="size-3" />
                        Edit
                      </Button>
                      <Button onClick={() => deleteReward(reward.rewardId)} variant="outline" size="sm" className="rounded-xl flex-1 gap-1.5" style={{ borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }}>
                        <Trash2 className="size-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {rewards.length === 0 && (
                <div className="col-span-full text-center py-12" style={{ color: "#64748b" }}>
                  No rewards yet
                </div>
              )}
            </div>
          </TabsContent>

          {/* Vouchers Tab */}
          <TabsContent value="vouchers">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">Voucher Verification</h2>
              <p style={{ color: "#94a3b8" }} className="text-sm">Verify pending reward redemptions from members</p>
            </div>

            {vouchers.length === 0 ? (
              <Card className="border-0 rounded-2xl" style={{ background: "#252540" }}>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="size-12 mx-auto mb-3" style={{ color: "#14b8a6" }} />
                  <p className="text-white font-medium mb-1">All Clear!</p>
                  <p style={{ color: "#94a3b8" }} className="text-sm">No pending vouchers to verify</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {vouchers.map((v) => (
                  <Card key={v.transactionId} className="border-0 rounded-2xl" style={{ background: "#252540" }}>
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="size-4" style={{ color: "#f59e0b" }} />
                            <span className="text-white font-medium">{v.description}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm" style={{ color: "#94a3b8" }}>
                            <span>Member: <strong style={{ color: "#14b8a6" }}>{v.memberId}</strong></span>
                            <span>Points: <strong style={{ color: "#f59e0b" }}>{v.amount}</strong></span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {formatDate(v.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => verifyVoucher(v.transactionId, "used")}
                            size="sm"
                            className="rounded-xl gap-1.5"
                            style={{ background: "#0d9488" }}
                          >
                            <CheckCircle className="size-3.5" />
                            Verify Used
                          </Button>
                          <Button
                            onClick={() => verifyVoucher(v.transactionId, "expired")}
                            size="sm"
                            variant="outline"
                            className="rounded-xl gap-1.5"
                            style={{ borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }}
                          >
                            <X className="size-3.5" />
                            Mark Expired
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Member Dialog */}
      {memberDialog.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
          <Card className="border-0 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ background: "#252540" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {memberDialog.mode === "add" ? "Add New Member" : "Edit Member"}
                </h3>
                <Button onClick={() => setMemberDialog({ open: false, mode: "add", data: null })} variant="ghost" size="icon" style={{ color: "#94a3b8" }}>
                  <X className="size-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-white text-sm">Member ID</Label>
                  <Input
                    value={memberForm.memberId}
                    onChange={(e) => setMemberForm({ ...memberForm, memberId: e.target.value })}
                    disabled={memberDialog.mode === "edit"}
                    className="rounded-xl mt-1"
                    style={inputStyle}
                    placeholder="e.g. BWT005"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Name</Label>
                  <Input
                    value={memberForm.nama}
                    onChange={(e) => setMemberForm({ ...memberForm, nama: e.target.value })}
                    className="rounded-xl mt-1"
                    style={inputStyle}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Email</Label>
                  <Input
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    type="email"
                    className="rounded-xl mt-1"
                    style={inputStyle}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">WhatsApp Number</Label>
                  <Input
                    value={memberForm.noWhatsapp}
                    onChange={(e) => setMemberForm({ ...memberForm, noWhatsapp: e.target.value })}
                    className="rounded-xl mt-1"
                    style={inputStyle}
                    placeholder="6281234567890"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">
                    Password {memberDialog.mode === "edit" && "(leave blank to keep current)"}
                  </Label>
                  <Input
                    value={memberForm.password}
                    onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                    type="password"
                    className="rounded-xl mt-1"
                    style={inputStyle}
                    placeholder={memberDialog.mode === "edit" ? "New password (optional)" : "Password"}
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Total Points</Label>
                  <Input
                    value={memberForm.totalPoin}
                    onChange={(e) => setMemberForm({ ...memberForm, totalPoin: parseInt(e.target.value) || 0 })}
                    type="number"
                    className="rounded-xl mt-1"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Button onClick={saveMember} className="rounded-xl flex-1 gap-1.5" style={{ background: "#0d9488" }}>
                  <Save className="size-4" />
                  Save
                </Button>
                <Button onClick={() => setMemberDialog({ open: false, mode: "add", data: null })} variant="outline" className="rounded-xl" style={{ borderColor: "rgba(255,255,255,0.2)", color: "#94a3b8" }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tour Dialog */}
      {tourDialog.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
          <Card className="border-0 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ background: "#252540" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {tourDialog.mode === "add" ? "Add Tour Package" : "Edit Tour Package"}
                </h3>
                <Button onClick={() => setTourDialog({ open: false, mode: "add", data: null })} variant="ghost" size="icon" style={{ color: "#94a3b8" }}>
                  <X className="size-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-white text-sm">Tour Name</Label>
                  <Input
                    value={tourForm.namaTour}
                    onChange={(e) => setTourForm({ ...tourForm, namaTour: e.target.value })}
                    className="rounded-xl mt-1"
                    style={inputStyle}
                    placeholder="Package name"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Description</Label>
                  <Textarea
                    value={tourForm.deskripsi}
                    onChange={(e) => setTourForm({ ...tourForm, deskripsi: e.target.value })}
                    className="rounded-xl mt-1 min-h-[80px]"
                    style={inputStyle}
                    placeholder="Tour description"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Image URL</Label>
                  <Input
                    value={tourForm.gambarUrl}
                    onChange={(e) => setTourForm({ ...tourForm, gambarUrl: e.target.value })}
                    className="rounded-xl mt-1"
                    style={inputStyle}
                    placeholder="/images/package-a.jpg"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Custom Link</Label>
                  <Input
                    value={tourForm.customLink}
                    onChange={(e) => setTourForm({ ...tourForm, customLink: e.target.value })}
                    className="rounded-xl mt-1"
                    style={inputStyle}
                    placeholder="https://wa.me/..."
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Button onClick={saveTour} className="rounded-xl flex-1 gap-1.5" style={{ background: "#0d9488" }}>
                  <Save className="size-4" />
                  Save
                </Button>
                <Button onClick={() => setTourDialog({ open: false, mode: "add", data: null })} variant="outline" className="rounded-xl" style={{ borderColor: "rgba(255,255,255,0.2)", color: "#94a3b8" }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reward Dialog */}
      {rewardDialog.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
          <Card className="border-0 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ background: "#252540" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {rewardDialog.mode === "add" ? "Add Reward" : "Edit Reward"}
                </h3>
                <Button onClick={() => setRewardDialog({ open: false, mode: "add", data: null })} variant="ghost" size="icon" style={{ color: "#94a3b8" }}>
                  <X className="size-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-white text-sm">Reward Name</Label>
                  <Input
                    value={rewardForm.namaReward}
                    onChange={(e) => setRewardForm({ ...rewardForm, namaReward: e.target.value })}
                    className="rounded-xl mt-1"
                    style={inputStyle}
                    placeholder="Reward name"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Points Needed</Label>
                  <Input
                    value={rewardForm.poinNeeded}
                    onChange={(e) => setRewardForm({ ...rewardForm, poinNeeded: parseInt(e.target.value) || 0 })}
                    type="number"
                    className="rounded-xl mt-1"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Description</Label>
                  <Textarea
                    value={rewardForm.deskripsi}
                    onChange={(e) => setRewardForm({ ...rewardForm, deskripsi: e.target.value })}
                    className="rounded-xl mt-1 min-h-[80px]"
                    style={inputStyle}
                    placeholder="Reward description"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Button onClick={saveReward} className="rounded-xl flex-1 gap-1.5" style={{ background: "#0d9488" }}>
                  <Save className="size-4" />
                  Save
                </Button>
                <Button onClick={() => setRewardDialog({ open: false, mode: "add", data: null })} variant="outline" className="rounded-xl" style={{ borderColor: "rgba(255,255,255,0.2)", color: "#94a3b8" }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
