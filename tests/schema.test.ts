import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const schemaPath = join(process.cwd(), "supabase", "schema.sql");
const requiredTables = [
  "profiles",
  "products",
  "home_sections",
  "cart_items",
  "mock_orders",
  "ai_jobs",
  "agent_proposals"
];

function readSchema() {
  expect(existsSync(schemaPath), "supabase/schema.sql should exist").toBe(true);
  return readFileSync(schemaPath, "utf8");
}

describe("Supabase schema artifact", () => {
  it("defines the required application tables", () => {
    const sql = readSchema();

    for (const table of requiredTables) {
      expect(sql).toMatch(
        new RegExp(`create\\s+table\\s+if\\s+not\\s+exists\\s+public\\.${table}\\b`, "i")
      );
    }
  });

  it("enables RLS on every required table", () => {
    const sql = readSchema();

    for (const table of requiredTables) {
      expect(sql).toMatch(
        new RegExp(`alter\\s+table\\s+public\\.${table}\\s+enable\\s+row\\s+level\\s+security`, "i")
      );
    }
  });

  it("documents admin and customer policy boundaries", () => {
    const sql = readSchema();

    expect(sql).toMatch(/create\s+policy\s+"admin_/i);
    expect(sql).toMatch(/create\s+policy\s+"customer_/i);
    expect(sql).toMatch(/storage\s+buckets/i);
  });
});
