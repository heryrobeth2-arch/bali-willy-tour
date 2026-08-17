#!/usr/bin/env node
/**
 * Apply schema SQL to Turso database via @libsql/client
 * and import existing data from local SQLite.
 */
const { createClient } = require("@libsql/client");
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const TURSO_URL = "libsql://bali-willy-tour-purnomo.aws-ap-northeast-1.turso.io";
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3RjRFT0pvREVmR25xR1l5ZXRWX0tnIiwib3JnX2lkIjoxMDAwMjIzMDMwfQ.YWtDRB2JeorruW0EnKwIT8oTHrqzlnOng4bR132msO9nuRIzkhn3N26NCfbh4pDdLKikOka8mgsLTZTxIh91CA";
const LOCAL_DB = path.resolve(__dirname, "../db/custom.db");
const SCHEMA_SQL = "/tmp/schema.sql";

async function main() {
  const turso = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

  console.log("=== Step 1: Apply schema to Turso ===");
  const sql = fs.readFileSync(SCHEMA_SQL, "utf8");
  // Split by semicolons, but skip empty statements
  const statements = sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("--"));
  for (const stmt of statements) {
    try {
      await turso.execute(stmt);
      console.log("  ✓", stmt.substring(0, 60).replace(/\n/g, " ") + "...");
    } catch (e) {
      console.error("  ✗", e.message);
    }
  }

  console.log("\n=== Step 2: Verify tables created ===");
  const tables = await turso.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );
  for (const row of tables.rows) {
    console.log("  -", row.name);
  }

  console.log("\n=== Step 3: Import data from local SQLite ===");
  if (!fs.existsSync(LOCAL_DB)) {
    console.log("  Local DB not found, skipping import");
    return;
  }
  const local = new Database(LOCAL_DB, { readonly: true });

  const tableConfigs = [
    { name: "Member", columns: ["member_id", "nama", "email", "no_whatsapp", "password", "total_poin", "created_at", "updated_at"] },
    { name: "TourPackage", columns: ["package_id", "nama_tour", "deskripsi", "gambar_url", "custom_link", "created_at"] },
    { name: "Reward", columns: ["reward_id", "nama_reward", "poin_needed", "deskripsi", "created_at"] },
    { name: "PointTransaction", columns: ["transaction_id", "member_id", "type", "amount", "description", "status", "created_at"] },
    { name: "Admin", columns: ["admin_id", "username", "password", "created_at"] },
  ];

  for (const { name, columns } of tableConfigs) {
    try {
      const placeholders = columns.map(() => "?").join(", ");
      const cols = columns.join(", ");
      const rows = local.prepare(`SELECT ${cols} FROM ${name}`).all();
      if (rows.length === 0) {
        console.log(`  ${name}: 0 rows (skip)`);
        continue;
      }
      let imported = 0;
      for (const row of rows) {
        try {
          await turso.execute({
            sql: `INSERT OR REPLACE INTO ${name} (${cols}) VALUES (${placeholders})`,
            args: columns.map((c) => row[c]),
          });
          imported++;
        } catch (e) {
          console.error(`    ✗ row insert error:`, e.message);
        }
      }
      console.log(`  ✓ ${name}: ${imported}/${rows.length} rows imported`);
    } catch (e) {
      console.log(`  ✗ ${name}: ${e.message}`);
    }
  }

  local.close();

  console.log("\n=== Step 4: Final verification ===");
  for (const { name } of tableConfigs) {
    try {
      const count = await turso.execute(`SELECT COUNT(*) as cnt FROM ${name}`);
      console.log(`  ${name}: ${count.rows[0].cnt} rows`);
    } catch (e) {
      console.log(`  ${name}: error - ${e.message}`);
    }
  }

  console.log("\n✅ Migration to Turso complete!");
  turso.close();
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
