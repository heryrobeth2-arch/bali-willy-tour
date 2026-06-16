// Database availability check and fallback helper
// On Vercel (serverless), SQLite may not persist, so we fall back to demo data

import { db } from "./db";

let dbAvailable: boolean | null = null;

export async function isDatabaseAvailable(): Promise<boolean> {
  if (dbAvailable !== null) return dbAvailable;

  try {
    await db.member.findFirst();
    dbAvailable = true;
    return true;
  } catch {
    dbAvailable = false;
    return false;
  }
}

export { db };
