import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-data";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["used", "expired"].includes(status)) {
      return NextResponse.json({ error: "Invalid status. Must be 'used' or 'expired'" }, { status: 400 });
    }

    const useDb = await isDatabaseAvailable();

    if (useDb) {
      const existing = await db.pointTransaction.findUnique({ where: { transactionId: id } });
      if (!existing) return NextResponse.json({ error: "Voucher/transaction not found" }, { status: 404 });
      if (existing.type !== "redeem") return NextResponse.json({ error: "Only redeem transactions can be verified" }, { status: 400 });
      if (existing.status !== "pending") return NextResponse.json({ error: `Transaction already has status: ${existing.status}` }, { status: 400 });

      if (status === "expired") {
        const member = await db.member.findUnique({ where: { memberId: existing.memberId } });
        if (member) {
          await db.member.update({ where: { memberId: existing.memberId }, data: { totalPoin: member.totalPoin + existing.amount } });
        }
      }

      const transaction = await db.pointTransaction.update({ where: { transactionId: id }, data: { status } });
      return NextResponse.json(transaction);
    } else {
      const result = demoStore.verifyTransaction(id);
      if (!result) return NextResponse.json({ error: "Voucher/transaction not found" }, { status: 404 });
      return NextResponse.json(result);
    }
  } catch {
    return NextResponse.json({ error: "Failed to verify voucher" }, { status: 500 });
  }
}
