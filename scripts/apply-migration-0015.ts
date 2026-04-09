import "dotenv/config";
import { config } from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";
import { sql } from "drizzle-orm";
import { db } from "../lib/db";

config({ path: ".env.local" });
config();

function statementsFromMigration(content: string): string[] {
  const out: string[] = [];
  for (const block of content.split("--> statement-breakpoint")) {
    const trimmed = block.trim();
    if (!trimmed || trimmed.startsWith("--")) continue;
    const pieces = trimmed.split(/;\s*\n/).map((s) => s.trim()).filter(Boolean);
    for (const p of pieces) {
      out.push(p.endsWith(";") ? p : `${p};`);
    }
  }
  return out;
}

async function main() {
  const path = resolve(process.cwd(), "lib/db/migrations/0015_product_plant_fields.sql");
  const raw = readFileSync(path, "utf8");
  const statements = statementsFromMigration(raw);

  for (const statement of statements) {
    await db.execute(sql.raw(statement));
  }
  console.log("Applied 0015_product_plant_fields.sql (%d statements)", statements.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
