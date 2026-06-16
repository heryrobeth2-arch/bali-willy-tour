import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-data";

export async function GET() {
  try {
    const useDb = await isDatabaseAvailable();

    if (useDb) {
      const members = await db.member.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { transactions: true } } },
      });
      return NextResponse.json(members);
    } else {
      const members = demoStore.getMembers();
      return NextResponse.json(members.map(m => ({ ...m, _count: { transactions: demoStore.getTransactions(m.memberId).length } })));
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, nama, email, noWhatsapp, password, totalPoin } = body;

    if (!memberId || !nama || !email || !noWhatsapp || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const useDb = await isDatabaseAvailable();

    if (useDb) {
      const existing = await db.member.findUnique({ where: { memberId } });
      if (existing) {
        return NextResponse.json({ error: "Member ID already exists" }, { status: 409 });
      }
      const existingEmail = await db.member.findUnique({ where: { email } });
      if (existingEmail) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }
      const member = await db.member.create({
        data: { memberId, nama, email, noWhatsapp, password, totalPoin: totalPoin || 0 },
      });
      const { password: _pw, ...memberData } = member;
      return NextResponse.json(memberData, { status: 201 });
    } else {
      const existing = demoStore.getMember(memberId);
      if (existing) {
        return NextResponse.json({ error: "Member ID already exists" }, { status: 409 });
      }
      const member = demoStore.createMember({ memberId, nama, email, noWhatsapp, password, totalPoin: totalPoin || 0 });
      return NextResponse.json(member, { status: 201 });
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    );
  }
}
