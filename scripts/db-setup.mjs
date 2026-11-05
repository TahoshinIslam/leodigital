// Creates the database (if missing), applies database/schema.sql and seeds
// the first super admin plus the starter services (English + Bangla).
//
//   npm run db:setup            # schema + seed (idempotent)
//   npm run db:setup -- --fresh # drop every table first (destroys data)
//
// Reads the same DB_* variables as the app from .env.local / .env.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
nextEnv.loadEnvConfig(root);

const env = (k, fallback) => {
  const v = process.env[k] ?? fallback;
  if (v === undefined) throw new Error(`Missing environment variable ${k} (see .env.example)`);
  return v;
};

const dbName = env("DB_NAME");
if (!/^[A-Za-z0-9_]+$/.test(dbName)) throw new Error("DB_NAME may only contain letters, digits and underscores");

const conn = await mysql.createConnection({
  host: env("DB_HOST", "127.0.0.1"),
  port: Number(env("DB_PORT", "3306")),
  user: env("DB_USER"),
  password: env("DB_PASSWORD", ""),
  multipleStatements: true, // only this trusted script runs multi-statement SQL
});

try {
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.query(`USE \`${dbName}\``);

  if (process.argv.includes("--fresh")) {
    console.log("! --fresh: dropping existing tables");
    await conn.query(`SET FOREIGN_KEY_CHECKS=0;
      DROP TABLE IF EXISTS audit_logs, media, service_translations, service_slug_history, services, sessions, users;
      SET FOREIGN_KEY_CHECKS=1;`);
  }

  await conn.query(await readFile(path.join(root, "database/schema.sql"), "utf8"));
  console.log(`✓ schema applied to ${dbName}`);

  // ── First super admin ────────────────────────────────────────────────
  const email = env("SEED_ADMIN_EMAIL").trim().toLowerCase();
  const password = env("SEED_ADMIN_PASSWORD");
  if (password.length < 12) throw new Error("SEED_ADMIN_PASSWORD must be at least 12 characters");
  const [existing] = await conn.execute("SELECT id FROM users WHERE email = ?", [email]);
  let adminId;
  if (existing.length) {
    adminId = existing[0].id;
    console.log(`· admin ${email} already exists (password unchanged)`);
  } else {
    const hash = await bcrypt.hash(password, 12);
    const [res] = await conn.execute(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'super_admin')",
      [env("SEED_ADMIN_NAME", "Super Admin"), email, hash],
    );
    adminId = res.insertId;
    console.log(`✓ created super admin ${email}`);
  }

  // ── Starter services ─────────────────────────────────────────────────
  const services = JSON.parse(await readFile(path.join(root, "database/seed/services.json"), "utf8"));
  let added = 0;
  for (const s of services) {
    const [res] = await conn.execute(
      `INSERT IGNORE INTO services
        (slug, title, eyebrow, summary, body, features, process_steps, faqs, cta_label,
         seo_title, seo_description, status, published_at, sort_order, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, IF(? = 'published', NOW(), NULL), ?, ?, ?)`,
      [
        s.slug, s.title, s.eyebrow, s.summary, s.body,
        JSON.stringify(s.features), JSON.stringify(s.process_steps), JSON.stringify(s.faqs),
        s.cta_label, s.seo_title, s.seo_description, s.status, s.status, s.sort_order, adminId, adminId,
      ],
    );
    added += res.affectedRows;
  }
  console.log(`✓ services seeded (${added} new, ${services.length - added} already present)`);

  // ── Bangla translations of the starter services ──────────────────────
  const bn = JSON.parse(await readFile(path.join(root, "database/seed/services.bn.json"), "utf8"));
  let translated = 0;
  for (const t of bn) {
    const [rows] = await conn.execute("SELECT id FROM services WHERE slug = ?", [t.slug]);
    if (!rows.length) continue;
    const [res] = await conn.execute(
      `INSERT IGNORE INTO service_translations
        (service_id, locale, title, eyebrow, summary, body, features, process_steps, faqs, cta_label, seo_title, seo_description, updated_by)
       VALUES (?, 'bn', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        rows[0].id, t.title, t.eyebrow, t.summary, t.body,
        JSON.stringify(t.features), JSON.stringify(t.process_steps), JSON.stringify(t.faqs),
        t.cta_label, t.seo_title, t.seo_description, adminId,
      ],
    );
    translated += res.affectedRows;
  }
  console.log(`✓ Bangla translations seeded (${translated} new)`);
} finally {
  await conn.end();
}
