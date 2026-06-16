import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-data";

export async function GET() {
  try {
    const useDb = await isDatabaseAvailable();
    if (useDb) {
      const packages = await db.tourPackage.findMany({ orderBy: { createdAt: "desc" } });
      return NextResponse.json(packages);
    } else {
      return NextResponse.json(demoStore.getTourPackages());
    }
  } catch {
    return NextResponse.json({ error: "Failed to fetch tour packages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { namaTour, deskripsi, gambarUrl, customLink } = body;
    if (!namaTour || !deskripsi || !gambarUrl || !customLink) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const useDb = await isDatabaseAvailable();
    if (useDb) {
      const tourPackage = await db.tourPackage.create({ data: { namaTour, deskripsi, gambarUrl, customLink } });
      return NextResponse.json(tourPackage, { status: 201 });
    } else {
      return NextResponse.json(demoStore.createTourPackage({ namaTour, deskripsi, gambarUrl, customLink }), { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: "Failed to create tour package" }, { status: 500 });
  }
}
