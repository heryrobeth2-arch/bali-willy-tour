import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, rewardId } = body;

    if (!memberId || !rewardId) {
      return NextResponse.json({ error: "Member ID and Reward ID are required" }, { status: 400 });
    }

    const useDb = await isDatabaseAvailable();

    if (useDb) {
      const member = await db.member.findUnique({ where: { memberId } });
      if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

      const reward = await db.reward.findUnique({ where: { rewardId } });
      if (!reward) return NextResponse.json({ error: "Reward not found" }, { status: 404 });

      if (member.totalPoin < reward.poinNeeded) {
        return NextResponse.json({ error: "Insufficient points" }, { status: 400 });
      }

      const transaction = await db.pointTransaction.create({
        data: { memberId, type: "redeem", amount: reward.poinNeeded, description: `Redeemed: ${reward.namaReward}`, status: "pending" },
      });

      await db.member.update({ where: { memberId }, data: { totalPoin: member.totalPoin - reward.poinNeeded } });

      return NextResponse.json({ message: "Reward redeemed successfully! Waiting for admin verification.", transaction });
    } else {
      const member = demoStore.getMember(memberId);
      if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

      const reward = demoStore.getReward(rewardId);
      if (!reward) return NextResponse.json({ error: "Reward not found" }, { status: 404 });

      if ((member.totalPoin || 0) < reward.poinNeeded) {
        return NextResponse.json({ error: "Insufficient points" }, { status: 400 });
      }

      const transaction = demoStore.addTransaction({ memberId, type: "redeem", amount: reward.poinNeeded, description: `Redeemed: ${reward.namaReward}`, status: "pending" });
      demoStore.updateMember(memberId, { totalPoin: (member.totalPoin || 0) - reward.poinNeeded } as any);

      return NextResponse.json({ message: "Reward redeemed successfully! Waiting for admin verification.", transaction });
    }
  } catch {
    return NextResponse.json({ error: "Failed to redeem reward" }, { status: 500 });
  }
}
