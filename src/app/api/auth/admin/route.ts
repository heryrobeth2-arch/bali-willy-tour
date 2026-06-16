import { NextRequest, NextResponse } from "next/server";
import { isDatabaseAvailable } from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { demoStore } from "@/lib/demo-data";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const useDb = await isDatabaseAvailable();

    if (useDb) {
      const admin = await db.admin.findUnique({ where: { username } });
      if (!admin || admin.password !== password) {
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }
      const { password: _pw, ...adminData } = admin;
      return NextResponse.json({ message: "Login successful", admin: adminData });
    } else {
      const admin = demoStore.getAdmin(username, password);
      if (!admin) {
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }
      const { password: _pw, ...adminData } = admin;
      return NextResponse.json({ message: "Login successful", admin: adminData });
    }
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
