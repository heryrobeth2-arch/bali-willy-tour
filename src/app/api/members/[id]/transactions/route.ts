import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const useDb = await isDatabaseAvailable();

    if (useDb) {
      const transactions = await db.pointTransaction.findMany({
        where: { memberId: id },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(transactions);
    } else {
      return NextResponse.json(demoStore.getTransactions(id));
    }
  } catch {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, amount, description, status } = body;

    if (!type || !amount || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const useDb = await isDatabaseAvailable();

    if (useDb) {
      const member = await db.member.findUnique({ where: { memberId: id } });
      if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

      const transaction = await db.pointTransaction.create({
        data: { memberId: id, type, amount, description, status: status || "pending" },
      });

      if (type === "earn") {
        await db.member.update({ where: { memberId: id }, data: { totalPoin: member.totalPoin + amount } });
      } else if (type === "redeem") {
        await db.member.update({ where: { memberId: id }, data: { totalPoin: Math.max(0, member.totalPoin - amount) } });
      }

      return NextResponse.json(transaction, { status: 201 });
    } else {
      const member = demoStore.getMember(id);
      if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

      const transaction = demoStore.addTransaction({ memberId: id, type, amount, description, status: status || "pending" });

      if (type === "earn") {
        demoStore.updateMember(id, { totalPoin: (member.totalPoin || 0) + amount } as any);
      } else if (type === "redeem") {
        demoStore.updateMember(id, { totalPoin: Math.max(0, (member.totalPoin || 0) - amount) } as any);
      }

      return NextResponse.json(transaction, { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
