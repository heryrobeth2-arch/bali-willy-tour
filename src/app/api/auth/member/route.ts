import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-data";

export async function POST(request: NextRequest) {
  try {
    const { memberId, password } = await request.json();

    if (!memberId || !password) {
      return NextResponse.json(
        { error: "Member ID and password are required" },
        { status: 400 }
      );
    }

    const useDb = await isDatabaseAvailable();

    if (useDb) {
      const member = await db.member.findUnique({
        where: { memberId },
      });

      if (!member || member.password !== password) {
        return NextResponse.json(
          { error: "Invalid Member ID or password" },
          { status: 401 }
        );
      }

      const { password: _password, ...memberData } = member;
      return NextResponse.json({ message: "Login successful", member: memberData });
    } else {
      // Fallback to demo store
      const member = demoStore.getMemberWithPassword(memberId);
      if (!member || member.password !== password) {
        return NextResponse.json(
          { error: "Invalid Member ID or password" },
          { status: 401 }
        );
      }
      const { password: _password, ...memberData } = member;
      return NextResponse.json({ message: "Login successful", member: memberData });
    }
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
