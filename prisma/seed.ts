import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbUrl = process.env.DATABASE_URL || "file:./db/custom.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;
const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken: dbUrl.startsWith("libsql://") ? authToken : undefined,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed Admin
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: "bwt2024",
    },
  });

  // Seed Members
  const members = [
    {
      memberId: "BWT001",
      nama: "Made Surya",
      email: "made.surya@email.com",
      noWhatsapp: "6281234567890",
      password: "member123",
      totalPoin: 2500,
    },
    {
      memberId: "BWT002",
      nama: "Ayu Kartika",
      email: "ayu.kartika@email.com",
      noWhatsapp: "6281234567891",
      password: "member123",
      totalPoin: 1800,
    },
    {
      memberId: "BWT003",
      nama: "Wayan Putra",
      email: "wayan.putra@email.com",
      noWhatsapp: "6281234567892",
      password: "member123",
      totalPoin: 3200,
    },
    {
      memberId: "BWT004",
      nama: "Ni Luh Sri",
      email: "ni.luh.sri@email.com",
      noWhatsapp: "6281234567893",
      password: "member123",
      totalPoin: 950,
    },
  ];

  for (const member of members) {
    await prisma.member.upsert({
      where: { memberId: member.memberId },
      update: {},
      create: member,
    });
  }

  // Seed Tour Packages
  const tourPackages = [
    {
      namaTour: "Package A - North Bali Tour",
      deskripsi: "Explore the beautiful northern Bali including Bedugul, Lovina Beach, and Gitgit Waterfall. A full day of natural wonders and cultural experiences.",
      gambarUrl: "/images/package-a.jpg",
      customLink: "https://wa.me/6285222329128?text=Hi%20Bali%20Willy%20Tour%2C%20I%20want%20to%20book%20Package%20A%20-%20North%20Bali%20Tour",
    },
    {
      namaTour: "Package B - Ubud Tour",
      deskripsi: "Discover the cultural heart of Bali with visits to Ubud Monkey Forest, Tegalalang Rice Terrace, and traditional art villages.",
      gambarUrl: "/images/package-b.jpg",
      customLink: "https://wa.me/6285222329128?text=Hi%20Bali%20Willy%20Tour%2C%20I%20want%20to%20book%20Package%20B%20-%20Ubud%20Tour",
    },
    {
      namaTour: "Package C - South Bali & The Edge Tour",
      deskripsi: "Experience the stunning southern coast of Bali including Uluwatu Temple, Padang Padang Beach, and the famous Kecak Dance.",
      gambarUrl: "/images/package-c.jpg",
      customLink: "https://wa.me/6285222329128?text=Hi%20Bali%20Willy%20Tour%2C%20I%20want%20to%20book%20Package%20C%20-%20South%20Bali%20Tour",
    },
    {
      namaTour: "Package D - East Bali Tour",
      deskripsi: "Journey to eastern Bali featuring Lempuyang Temple (Gate of Heaven), Tirta Gangga Water Palace, and Virgin Beach.",
      gambarUrl: "/images/package-d.jpg",
      customLink: "https://wa.me/6285222329128?text=Hi%20Bali%20Willy%20Tour%2C%20I%20want%20to%20book%20Package%20D%20-%20East%20Bali%20Tour",
    },
    {
      namaTour: "Nusa Penida Day Trip",
      deskripsi: "Full day trip to Nusa Penida Island visiting Kelingking Beach, Angel's Billabong, Broken Beach, and Crystal Bay for snorkeling.",
      gambarUrl: "/images/nusa-penida.jpg",
      customLink: "https://wa.me/6285222329128?text=Hi%20Bali%20Willy%20Tour%2C%20I%20want%20to%20book%20Nusa%20Penida%20Day%20Trip",
    },
  ];

  for (const pkg of tourPackages) {
    await prisma.tourPackage.create({ data: pkg });
  }

  // Seed Rewards
  const rewards = [
    {
      namaReward: "Free Full Day Tour",
      poinNeeded: 3000,
      deskripsi: "Redeem a free full day tour package of your choice. Valid for any standard tour package.",
    },
    {
      namaReward: "50% Off Nusa Penida Trip",
      poinNeeded: 1500,
      deskripsi: "Get 50% discount on Nusa Penida Day Trip for one person. Includes snorkeling gear.",
    },
    {
      namaReward: "Free Airport Transfer",
      poinNeeded: 800,
      deskripsi: "Complimentary airport pick-up or drop-off transfer. Available for Ngurah Rai International Airport.",
    },
    {
      namaReward: "Romantic Dinner Voucher",
      poinNeeded: 2000,
      deskripsi: "Enjoy a romantic dinner for two at a selected partner restaurant in Seminyak or Jimbaran.",
    },
    {
      namaReward: "Souvenir Shop Discount 30%",
      poinNeeded: 500,
      deskripsi: "Get 30% off at selected souvenir shops in Bali. Valid for purchases above IDR 200,000.",
    },
    {
      namaReward: "Spa & Wellness Package",
      poinNeeded: 1200,
      deskripsi: "Relax with a 90-minute Balinese massage and spa treatment at our partner spa in Ubud.",
    },
  ];

  for (const reward of rewards) {
    await prisma.reward.create({ data: reward });
  }

  // Seed Point Transactions
  const transactions = [
    {
      memberId: "BWT001",
      type: "earn",
      amount: 1000,
      description: "Points from North Bali Tour booking",
      status: "used",
    },
    {
      memberId: "BWT001",
      type: "earn",
      amount: 1500,
      description: "Points from Ubud Tour booking",
      status: "used",
    },
    {
      memberId: "BWT001",
      type: "redeem",
      amount: 500,
      description: "Redeemed for Souvenir Shop Discount",
      status: "used",
    },
    {
      memberId: "BWT002",
      type: "earn",
      amount: 1800,
      description: "Points from Nusa Penida Trip booking",
      status: "used",
    },
    {
      memberId: "BWT003",
      type: "earn",
      amount: 2000,
      description: "Points from South Bali Tour booking",
      status: "used",
    },
    {
      memberId: "BWT003",
      type: "earn",
      amount: 1200,
      description: "Points from East Bali Tour booking",
      status: "used",
    },
    {
      memberId: "BWT004",
      type: "earn",
      amount: 950,
      description: "Points from Airport Transfer booking",
      status: "used",
    },
    {
      memberId: "BWT002",
      type: "redeem",
      amount: 800,
      description: "Redeemed for Free Airport Transfer - Pending verification",
      status: "pending",
    },
  ];

  for (const tx of transactions) {
    await prisma.pointTransaction.create({ data: tx });
  }

  console.log("Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
