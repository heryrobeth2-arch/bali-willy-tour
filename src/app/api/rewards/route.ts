import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-data";

export async function GET() {
  try {
    const useDb = await isDatabaseAvailable();
    if (useDb) {
      const rewards = await db.reward.findMany({ orderBy: { createdAt: "desc" } });
      return NextResponse.json(rewards);
    } else {
      return NextResponse.json(demoStore.getRewards());
    }
  } catch {
    return NextResponse.json({ error: "Failed to fetch rewards" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { namaReward, poinNeeded, deskripsi } = body;
    if (!namaReward || !poinNeeded || !deskripsi) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const useDb = await isDatabaseAvailable();
    if (useDb) {
      const reward = await db.reward.create({ data: { namaReward, poinNeeded, deskripsi } });
      return NextResponse.json(reward, { status: 201 });
    } else {
      return NextResponse.json(demoStore.createReward({ namaReward, poinNeeded, deskripsi }), { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: "Failed to create reward" }, { status: 500 });
  }
}
