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
    const useDb = await isDatabaseAvailable();

    if (useDb) {
      const existing = await db.reward.findUnique({ where: { rewardId: id } });
      if (!existing) return NextResponse.json({ error: "Reward not found" }, { status: 404 });

      const updateData: Record<string, unknown> = {};
      if (body.namaReward !== undefined) updateData.namaReward = body.namaReward;
      if (body.poinNeeded !== undefined) updateData.poinNeeded = body.poinNeeded;
      if (body.deskripsi !== undefined) updateData.deskripsi = body.deskripsi;

      const reward = await db.reward.update({ where: { rewardId: id }, data: updateData });
      return NextResponse.json(reward);
    } else {
      const result = demoStore.updateReward(id, body);
      if (!result) return NextResponse.json({ error: "Reward not found" }, { status: 404 });
      return NextResponse.json(result);
    }
  } catch {
    return NextResponse.json({ error: "Failed to update reward" }, { status: 500 });
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
      const existing = await db.reward.findUnique({ where: { rewardId: id } });
      if (!existing) return NextResponse.json({ error: "Reward not found" }, { status: 404 });
      await db.reward.delete({ where: { rewardId: id } });
      return NextResponse.json({ message: "Reward deleted successfully" });
    } else {
      demoStore.deleteReward(id);
      return NextResponse.json({ message: "Reward deleted successfully" });
    }
  } catch {
    return NextResponse.json({ error: "Failed to delete reward" }, { status: 500 });
  }
}
