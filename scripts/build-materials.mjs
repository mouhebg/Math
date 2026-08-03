#!/usr/bin/env node
/**
 * Writes the "What you need" line into every worksheet whose session declares
 * `materials` in data/sessions.ts.
 *
 * Fifteen-odd sessions ask the student to move counters, bundle sticks or fold
 * strips, and nothing anywhere told a parent what those were or what to use
 * instead. The word "counters" assumes a box of counters, which is exactly the
 * assumption a home programme should not make.
 *
 * The sheets come from two different templates, so this keys off the title
 * element that both share rather than either one's structure, and it carries
 * its own inline styles so neither stylesheet has to learn a new class. Running
 * it twice replaces the line rather than stacking a second one.
 *
 * Usage: node scripts/build-materials.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const worksheetDir = join(root, "public", "worksheets");

// data/sessions.ts is TypeScript, so strip the types rather than compile.
const raw = readFileSync(join(root, "data", "sessions.ts"), "utf8");
const stripped = raw
  .replace(/^export type[\s\S]*?};$/gm, "")
  .replace(/:\s*Session\[\]/g, "")
  .replace(/:\s*\{\s*code:[\s\S]*?\}\[\]/g, "")
  .replace(/\(code:\s*string\)/g, "(code)")
  .replace(/^export /gm, "");

const { sessions } = await import(
  `data:text/javascript,${encodeURIComponent(`${stripped}\nexport { sessions };`)}`
);

const pad = (n) => String(n).padStart(2, "0");
const escape = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const STYLE = [
  "margin:12px 0 16px",
  "padding:10px 13px",
  "border:1.5px solid #101A17",
  "border-radius:8px",
  "background:#fff",
  "font-size:13px",
  "line-height:1.55",
].join(";");

// Anything previously written by this script, so a rerun replaces rather than stacks.
const EXISTING = /\s*<p class="needs"[^>]*>[\s\S]*?<\/p>/g;

let written = 0;
let skipped = 0;

for (const session of sessions) {
  const file = `mathnest-unit-${pad(session.unit)}-session-${session.letter.toLowerCase()}.html`;
  const path = join(worksheetDir, file);
  if (!existsSync(path)) {
    console.error(`Missing worksheet for ${session.id}: ${file}`);
    continue;
  }

  let html = readFileSync(path, "utf8").replace(EXISTING, "");

  if (session.materials) {
    // Both templates open the sheet with a title: <h1> in the hand-written ones,
    // <h4> in the generated ones. Insert immediately after whichever comes first.
    const match = /<\/h1>|<\/h4>/.exec(html);
    if (!match) {
      console.error(`No title element to anchor to in ${file}, skipped`);
      skipped += 1;
      continue;
    }
    const at = match.index + match[0].length;
    const line = `\n<p class="needs" style="${STYLE}"><b>What you need:</b> ${escape(session.materials)}</p>`;
    html = html.slice(0, at) + line + html.slice(at);
    written += 1;
  }

  writeFileSync(path, html, "utf8");
}

console.log(`Wrote "What you need" onto ${written} worksheets.`);
if (skipped) console.log(`${skipped} skipped, see errors above.`);
