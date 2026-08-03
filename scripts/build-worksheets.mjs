#!/usr/bin/env node
/**
 * Generates worksheet HTML files from a content spec, reusing the styles,
 * shell, and answer-toggle script of an existing worksheet so every sheet in
 * the programme looks and behaves the same.
 *
 * Usage:  node scripts/build-worksheets.mjs [--force]
 *
 * By default the generator refuses to overwrite a worksheet that already
 * exists, so hand-authored sheets are never clobbered. Pass --force to rebuild
 * everything listed in the spec.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { worksheetContent } from "../content/worksheets.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const worksheetDir = join(here, "..", "public", "worksheets");
const templateFile = join(worksheetDir, "mathnest-unit-02-session-a.html");

const force = process.argv.includes("--force");

const template = readFileSync(templateFile, "utf8");

const headEnd = template.indexOf("<body>");
if (headEnd === -1) throw new Error("Template has no <body>. Check the template file.");
const head = template.slice(0, headEnd + "<body>".length);

const scriptStart = template.lastIndexOf("<script>");
const scriptEnd = template.lastIndexOf("</script>") + "</script>".length;
if (scriptStart === -1) throw new Error("Template has no trailing <script>. Check the template file.");
const script = template.slice(scriptStart, scriptEnd);

const pad = (n) => String(n).padStart(2, "0");

const homeIcon =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M3 12L12 3l9 9"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg>';

function renderExercise(exercise, index) {
  const hint = exercise.hint ? `\n  <p class="ex-h">${exercise.hint}</p>` : "";
  return [
    '<div class="ex">',
    `<p class="ex-t"><span class="n">${index + 1}</span>${exercise.prompt}</p>${hint}`,
    `  ${exercise.body}`,
    "</div>",
  ].join("\n ");
}

function renderWorksheet(sheet) {
  const unit = pad(sheet.unit);
  const letter = sheet.letter.toUpperCase();
  const title = `MathNest | Unit ${unit}, Session ${letter}: ${sheet.title}`;
  const codes = sheet.expectations?.length
    ? `<p class="ex-h" style="margin:10px 0 0"><b>Ontario Grade 2:</b> ${sheet.expectations.join(", ")}</p>`
    : "";

  const body = [
    '<div class="worksheet-shell">',
    ' <header class="worksheet-tools">',
    `  <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../">${homeIcon} Home</a>` +
      '<span class="sep" aria-hidden="true">›</span>' +
      `<span>Unit ${unit}</span><span class="sep" aria-hidden="true">›</span>` +
      `<span class="current">Session ${letter}</span></nav>`,
    '  <div class="worksheet-actions">',
    '   <button id="print-sheet">Print or save as PDF</button>',
    '   <button class="alt" id="answers-toggle">Show answers</button>',
    "  </div>",
    " </header>",
    ` <div class="ws active" id="ws-${sheet.unit}${letter}">`,
    ` <div class="ws-head"><div class="code">UNIT ${unit} // SESSION ${letter} // MASTER WHEN READY</div><h4>${sheet.title}</h4>`,
    `  <p class="ex-h">${sheet.intro}</p>${codes}`,
    '  <div class="nm"><span>Name:</span><span>Date:</span></div></div>',
    ...sheet.exercises.map((exercise, index) => ` ${renderExercise(exercise, index)}`),
    ` <div class="pnote"><b>${sheet.parentNoteTitle}</b>${sheet.parentNote}</div>`,
    ` <div class="moveon"><b>Move on when</b> ${sheet.moveOn}</div>`,
    sheet.answers ? ` <div class="answers">${sheet.answers}</div>` : "",
    " </div>",
    "</div>",
  ]
    .filter(Boolean)
    .join("\n");

  return `${head.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)}\n${body}\n${script}\n</body>\n</html>`;
}

let written = 0;
let skipped = 0;

for (const sheet of worksheetContent) {
  const name = `mathnest-unit-${pad(sheet.unit)}-session-${sheet.letter.toLowerCase()}.html`;
  const target = join(worksheetDir, name);
  if (existsSync(target) && !force) {
    skipped += 1;
    continue;
  }
  writeFileSync(target, renderWorksheet(sheet), "utf8");
  written += 1;
  console.log(`wrote ${name}`);
}

console.log(`\n${written} worksheet(s) written, ${skipped} left untouched.`);
