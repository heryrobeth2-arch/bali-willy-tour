import { NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-data";

export async function GET() {
  try {
    const useDb = await isDatabaseAvailable();

    if (useDb) {
      const pendingTransactions = await db.pointTransaction.findMany({
        where: { type: "redeem", status: "pending" },
        orderBy: { createdAt: "desc" },
        include: { member: { select: { memberId: true, nama: true, email: true } } },
      });
      return NextResponse.json(pendingTransactions);
    } else {
      const pending = demoStore.getPendingTransactions();
      const result = pending.map(t => {
        const member = demoStore.getMember(t.memberId);
        return { ...t, member: member ? { memberId: member.memberId, nama: member.nama, email: member.email } : null };
      });
      return NextResponse.json(result);
    }
  } catch {
    return NextResponse.json({ error: "Failed to fetch pending vouchers" }, { status: 500 });
  }
}
