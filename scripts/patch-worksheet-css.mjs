#!/usr/bin/env node
/**
 * Adds the narrow-screen rules that the worksheet stylesheets were missing.
 *
 * Every sheet already collapsed .qg.c3 and .qg.c4 at 640px but left .qg.c2 at
 * two columns all the way down. On a phone that leaves each cell about 150px
 * wide, which is narrower than the questions inside it, so a prompt like
 * "Below 63: ____" wrapped between "Below" and "63:" and the label was split
 * from the number it belonged to. A seven-year-old cannot read that.
 *
 * The rule goes into the existing 640px block in each file. Sheets keep their
 * styles inline so a downloaded copy still works offline, which is why this
 * patches sixty-odd files rather than one stylesheet. It is idempotent, and it
 * includes the template that build-worksheets.mjs copies its head from, so
 * regenerating the sheets carries the fix forward instead of undoing it.
 *
 * Usage: node scripts/patch-worksheet-css.mjs
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const worksheetDir = join(here, "..", "public", "worksheets");

const ANCHOR = ".qg.c3,.qg.c4{grid-template-columns:repeat(2,1fr);}";
const ADDITION =
  "\n  /* One column, so a label is never split from its own blank. */" +
  "\n  .qg.c2{grid-template-columns:1fr;}";

let patched = 0;
let already = 0;
let missing = 0;

for (const name of readdirSync(worksheetDir).filter((f) => f.endsWith(".html"))) {
  const path = join(worksheetDir, name);
  const html = readFileSync(path, "utf8");

  if (html.includes(".qg.c2{grid-template-columns:1fr;}")) {
    already += 1;
    continue;
  }
  if (!html.includes(ANCHOR)) {
    missing += 1;
    continue;
  }

  writeFileSync(path, html.replace(ANCHOR, ANCHOR + ADDITION), "utf8");
  patched += 1;
}

console.log(`Patched ${patched} sheets. ${already} already had it, ${missing} have no 640px block.`);
