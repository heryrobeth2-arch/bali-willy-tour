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
      const member = await db.member.findUnique({
        where: { memberId: id },
        include: { transactions: { orderBy: { createdAt: "desc" } } },
      });
      if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
      const { password: _pw, ...memberData } = member;
      return NextResponse.json(memberData);
    } else {
      const member = demoStore.getMember(id);
      if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
      const transactions = demoStore.getTransactions(id);
      return NextResponse.json({ ...member, transactions });
    }
  } catch {
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const useDb = await isDatabaseAvailable();

    if (useDb) {
      const existing = await db.member.findUnique({ where: { memberId: id } });
      if (!existing) return NextResponse.json({ error: "Member not found" }, { status: 404 });

      const updateData: Record<string, unknown> = {};
      if (body.nama !== undefined) updateData.nama = body.nama;
      if (body.email !== undefined) updateData.email = body.email;
      if (body.noWhatsapp !== undefined) updateData.noWhatsapp = body.noWhatsapp;
      if (body.totalPoin !== undefined) updateData.totalPoin = body.totalPoin;
      if (body.password !== undefined) updateData.password = body.password;

      const member = await db.member.update({ where: { memberId: id }, data: updateData });
      const { password: _pw, ...memberData } = member;
      return NextResponse.json(memberData);
    } else {
      const result = demoStore.updateMember(id, body);
      if (!result) return NextResponse.json({ error: "Member not found" }, { status: 404 });
      return NextResponse.json(result);
    }
  } catch {
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const useDb = await isDatabaseAvailable();

    if (useDb) {
      const existing = await db.member.findUnique({ where: { memberId: id } });
      if (!existing) return NextResponse.json({ error: "Member not found" }, { status: 404 });
      await db.pointTransaction.deleteMany({ where: { memberId: id } });
      await db.member.delete({ where: { memberId: id } });
      return NextResponse.json({ message: "Member deleted successfully" });
    } else {
      demoStore.deleteMember(id);
      return NextResponse.json({ message: "Member deleted successfully" });
    }
  } catch {
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
