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
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODY5NDk1NDYsImlkIjoiMDFhMDBlNGEtODAwMS03Mjk3LTlkNzEtOTllY2I0Mjc5NDIwIiwia2lkIjoiSE9sX3VBUUhHV1o0NEJMQ2FsdUZqeEY4MGpPX2NzR004U2llUVpMTTdiQSIsInJpZCI6ImM0NDBjNzc4LTJlMDAtNDU2ZC04NmYyLWJiMGNkODhmYTU0NiJ9.iz6GZtr_i1_evr4_OW4WrrR8pMCE4xNTdS3z6LK_cLmVkX9HCPkAdJ2YtFzeoZTZgZVM7EXmdgmZ0h5xR0KHDA";
const LOCAL_DB = path.resolve(__dirname, "../db/custom.db");
const SCHEMA_SQL = "/tmp/schema.sql";

async function main() {
  const turso = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

  console.log("=== Step 1: Apply schema to Turso ===");
  const sql = fs.readFileSync(SCHEMA_SQL, "utf8");
  // Split by semicolons, then filter out empty/comment-only statements
  const allStmts = sql.split(";").map((s) => s.trim());
  const statements = allStmts.filter((s) => {
    if (!s) return false;
    // Remove SQL comments to check if there's actual SQL left
    const withoutComments = s
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .trim();
    return withoutComments.length > 0;
  });
  console.log(`  Found ${statements.length} statements to execute`);
  for (const [i, stmt] of statements.entries()) {
    try {
      // Strip leading comments for execution
      const sqlOnly = stmt
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim();
      await turso.execute(sqlOnly);
      console.log(`  ✓ [${i + 1}]`, sqlOnly.substring(0, 80).replace(/\n/g, " "));
    } catch (e) {
      console.error(`  ✗ [${i + 1}]`, e.message);
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
