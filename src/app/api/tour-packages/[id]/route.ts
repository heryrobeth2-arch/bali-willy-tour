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
      const existing = await db.tourPackage.findUnique({ where: { packageId: id } });
      if (!existing) return NextResponse.json({ error: "Tour package not found" }, { status: 404 });

      const updateData: Record<string, unknown> = {};
      if (body.namaTour !== undefined) updateData.namaTour = body.namaTour;
      if (body.deskripsi !== undefined) updateData.deskripsi = body.deskripsi;
      if (body.gambarUrl !== undefined) updateData.gambarUrl = body.gambarUrl;
      if (body.customLink !== undefined) updateData.customLink = body.customLink;

      const tourPackage = await db.tourPackage.update({ where: { packageId: id }, data: updateData });
      return NextResponse.json(tourPackage);
    } else {
      const result = demoStore.updateTourPackage(id, body);
      if (!result) return NextResponse.json({ error: "Tour package not found" }, { status: 404 });
      return NextResponse.json(result);
    }
  } catch {
    return NextResponse.json({ error: "Failed to update tour package" }, { status: 500 });
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
      const existing = await db.tourPackage.findUnique({ where: { packageId: id } });
      if (!existing) return NextResponse.json({ error: "Tour package not found" }, { status: 404 });
      await db.tourPackage.delete({ where: { packageId: id } });
      return NextResponse.json({ message: "Tour package deleted successfully" });
    } else {
      demoStore.deleteTourPackage(id);
      return NextResponse.json({ message: "Tour package deleted successfully" });
    }
  } catch {
    return NextResponse.json({ error: "Failed to delete tour package" }, { status: 500 });
  }
}
