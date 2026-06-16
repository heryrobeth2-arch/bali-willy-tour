// Demo data store for Vercel deployment (no SQLite persistence)
// This data is used when the database is unavailable

export interface DemoMember {
  memberId: string;
  nama: string;
  email: string;
  noWhatsapp: string;
  password: string;
  totalPoin: number;
  createdAt: string;
  updatedAt: string;
}

export interface DemoTourPackage {
  packageId: string;
  namaTour: string;
  deskripsi: string;
  gambarUrl: string;
  customLink: string;
  createdAt: string;
}

export interface DemoReward {
  rewardId: string;
  namaReward: string;
  poinNeeded: number;
  deskripsi: string;
  createdAt: string;
}

export interface DemoTransaction {
  transactionId: string;
  memberId: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

export interface DemoAdmin {
  adminId: string;
  username: string;
  password: string;
  createdAt: string;
}

// In-memory store - initialized fresh on each serverless cold start
let members: DemoMember[] = [
  { memberId: "BWT001", nama: "Made Surya", email: "made.surya@email.com", noWhatsapp: "6281234567890", password: "member123", totalPoin: 2500, createdAt: "2026-01-15T10:00:00Z", updatedAt: "2026-06-01T10:00:00Z" },
  { memberId: "BWT002", nama: "Wayan Adi", email: "wayan.adi@email.com", noWhatsapp: "6282345678901", password: "member123", totalPoin: 1800, createdAt: "2026-02-20T10:00:00Z", updatedAt: "2026-05-15T10:00:00Z" },
  { memberId: "BWT003", nama: "Ketut Rama", email: "ketut.rama@email.com", noWhatsapp: "6283456789012", password: "member123", totalPoin: 3200, createdAt: "2026-03-10T10:00:00Z", updatedAt: "2026-06-10T10:00:00Z" },
  { memberId: "BWT004", nama: "Nyoman Dewi", email: "nyoman.dewi@email.com", noWhatsapp: "6284567890123", password: "member123", totalPoin: 950, createdAt: "2026-04-05T10:00:00Z", updatedAt: "2026-05-20T10:00:00Z" },
];

let tourPackages: DemoTourPackage[] = [
  { packageId: "pkg001", namaTour: "North Bali Tour", deskripsi: "Explore the beauty of North Bali including Gitgit Waterfall and Lovina Beach", gambarUrl: "/images/package-a.jpg", customLink: "https://wa.me/6285222329128?text=North%20Bali%20Tour", createdAt: "2026-01-01T10:00:00Z" },
  { packageId: "pkg002", namaTour: "Ubud Tour", deskripsi: "Visit Tegalalang Rice Terrace, Monkey Forest, and Ubud Art Village", gambarUrl: "/images/package-b.jpg", customLink: "https://wa.me/6285222329128?text=Ubud%20Tour", createdAt: "2026-01-01T10:00:00Z" },
  { packageId: "pkg003", namaTour: "South Bali & Uluwatu Tour", deskripsi: "Enjoy Uluwatu Temple, Padang Padang Beach, and Kecak Dance", gambarUrl: "/images/package-c.jpg", customLink: "https://wa.me/6285222329128?text=South%20Bali%20Tour", createdAt: "2026-01-01T10:00:00Z" },
  { packageId: "pkg004", namaTour: "East Bali Tour", deskripsi: "Discover Lempuyang Temple, Tirta Gangga, and Virgin Beach", gambarUrl: "/images/package-d.jpg", customLink: "https://wa.me/6285222329128?text=East%20Bali%20Tour", createdAt: "2026-01-01T10:00:00Z" },
  { packageId: "pkg005", namaTour: "Nusa Penida Tour", deskripsi: "Day trip to Nusa Penida Island - Kelingking Beach, Angel's Billabong, Crystal Bay", gambarUrl: "/images/nusa-penida.jpg", customLink: "https://wa.me/6285222329128?text=Nusa%20Penida%20Tour", createdAt: "2026-01-01T10:00:00Z" },
];

let rewards: DemoReward[] = [
  { rewardId: "rwd001", namaReward: "Diskon 10% Tour Berikutnya", poinNeeded: 500, deskripsi: "Dapatkan diskon 10% untuk paket tour berikutnya", createdAt: "2026-01-01T10:00:00Z" },
  { rewardId: "rwd002", namaReward: "Free Pickup Service", poinNeeded: 300, deskripsi: "Gratis layanan pickup dari hotel ke meeting point tour", createdAt: "2026-01-01T10:00:00Z" },
  { rewardId: "rwd003", namaReward: "Welcome Drink Voucher", poinNeeded: 100, deskripsi: "Voucher minuman selamat datang di restoran mitra", createdAt: "2026-01-01T10:00:00Z" },
  { rewardId: "rwd004", namaReward: "Diskon 20% Nusa Penida Tour", poinNeeded: 1000, deskripsi: "Diskon khusus 20% untuk paket Nusa Penida Tour", createdAt: "2026-01-01T10:00:00Z" },
  { rewardId: "rwd005", namaReward: "Souvenir Package", poinNeeded: 800, deskripsi: "Paket oleh-oleh khas Bali eksklusif untuk member", createdAt: "2026-01-01T10:00:00Z" },
  { rewardId: "rwd006", namaReward: "Free Full Day Tour", poinNeeded: 3000, deskripsi: "Satu paket Full Day Tour gratis untuk satu orang", createdAt: "2026-01-01T10:00:00Z" },
];

let transactions: DemoTransaction[] = [
  { transactionId: "txn001", memberId: "BWT001", type: "earn", amount: 500, description: "Poin dari North Bali Tour", status: "used", createdAt: "2026-02-15T10:00:00Z" },
  { transactionId: "txn002", memberId: "BWT001", type: "earn", amount: 500, description: "Poin dari Ubud Tour", status: "used", createdAt: "2026-03-20T10:00:00Z" },
  { transactionId: "txn003", memberId: "BWT001", type: "earn", amount: 500, description: "Poin dari Nusa Penida Tour", status: "used", createdAt: "2026-04-10T10:00:00Z" },
  { transactionId: "txn004", memberId: "BWT001", type: "earn", amount: 1000, description: "Bonus poin referral", status: "used", createdAt: "2026-05-01T10:00:00Z" },
  { transactionId: "txn005", memberId: "BWT002", type: "earn", amount: 600, description: "Poin dari South Bali Tour", status: "used", createdAt: "2026-03-15T10:00:00Z" },
  { transactionId: "txn006", memberId: "BWT002", type: "earn", amount: 400, description: "Poin dari East Bali Tour", status: "used", createdAt: "2026-04-20T10:00:00Z" },
  { transactionId: "txn007", memberId: "BWT002", type: "earn", amount: 800, description: "Poin dari Nusa Penida Tour", status: "used", createdAt: "2026-05-10T10:00:00Z" },
  { transactionId: "txn008", memberId: "BWT003", type: "earn", amount: 1200, description: "Poin dari 2x Tour", status: "used", createdAt: "2026-04-15T10:00:00Z" },
];

const admins: DemoAdmin[] = [
  { adminId: "adm001", username: "admin", password: "bwt2024", createdAt: "2026-01-01T10:00:00Z" },
];

// Helper to generate unique IDs
let idCounter = 100;
function genId(prefix: string): string {
  idCounter++;
  return `${prefix}${Date.now()}${idCounter}`;
}

// ---- Demo Store API ----
export const demoStore = {
  // Members
  getMembers: () => members.map(({ password: _pw, ...m }) => m),
  getMember: (id: string) => {
    const m = members.find(m => m.memberId === id);
    if (!m) return null;
    const { password: _pw, ...data } = m;
    return data;
  },
  getMemberWithPassword: (id: string) => members.find(m => m.memberId === id) || null,
  createMember: (data: Omit<DemoMember, "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const member: DemoMember = { ...data, createdAt: now, updatedAt: now };
    members.push(member);
    const { password: _pw, ...result } = member;
    return result;
  },
  updateMember: (id: string, data: Partial<DemoMember>) => {
    const idx = members.findIndex(m => m.memberId === id);
    if (idx === -1) return null;
    members[idx] = { ...members[idx], ...data, updatedAt: new Date().toISOString() };
    const { password: _pw, ...result } = members[idx];
    return result;
  },
  deleteMember: (id: string) => {
    members = members.filter(m => m.memberId !== id);
    transactions = transactions.filter(t => t.memberId !== id);
  },

  // Tour Packages
  getTourPackages: () => tourPackages,
  getTourPackage: (id: string) => tourPackages.find(p => p.packageId === id) || null,
  createTourPackage: (data: Omit<DemoTourPackage, "packageId" | "createdAt">) => {
    const pkg: DemoTourPackage = { ...data, packageId: genId("pkg"), createdAt: new Date().toISOString() };
    tourPackages.push(pkg);
    return pkg;
  },
  updateTourPackage: (id: string, data: Partial<DemoTourPackage>) => {
    const idx = tourPackages.findIndex(p => p.packageId === id);
    if (idx === -1) return null;
    tourPackages[idx] = { ...tourPackages[idx], ...data };
    return tourPackages[idx];
  },
  deleteTourPackage: (id: string) => {
    tourPackages = tourPackages.filter(p => p.packageId !== id);
  },

  // Rewards
  getRewards: () => rewards,
  getReward: (id: string) => rewards.find(r => r.rewardId === id) || null,
  createReward: (data: Omit<DemoReward, "rewardId" | "createdAt">) => {
    const reward: DemoReward = { ...data, rewardId: genId("rwd"), createdAt: new Date().toISOString() };
    rewards.push(reward);
    return reward;
  },
  updateReward: (id: string, data: Partial<DemoReward>) => {
    const idx = rewards.findIndex(r => r.rewardId === id);
    if (idx === -1) return null;
    rewards[idx] = { ...rewards[idx], ...data };
    return rewards[idx];
  },
  deleteReward: (id: string) => {
    rewards = rewards.filter(r => r.rewardId !== id);
  },

  // Transactions
  getTransactions: (memberId: string) => transactions.filter(t => t.memberId === memberId),
  addTransaction: (data: Omit<DemoTransaction, "transactionId" | "createdAt">) => {
    const txn: DemoTransaction = { ...data, transactionId: genId("txn"), createdAt: new Date().toISOString() };
    transactions.push(txn);
    return txn;
  },
  getPendingTransactions: () => transactions.filter(t => t.status === "pending"),
  verifyTransaction: (id: string) => {
    const idx = transactions.findIndex(t => t.transactionId === id);
    if (idx === -1) return null;
    transactions[idx].status = "used";
    return transactions[idx];
  },

  // Admin
  getAdmin: (username: string, password: string) => admins.find(a => a.username === username && a.password === password) || null,
};
