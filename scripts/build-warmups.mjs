#!/usr/bin/env node
/**
 * Generates the per-unit warm-up cards for Units 02 to 24.
 *
 * The lesson structure already reserves two minutes of oral warm-up before
 * every session, but only Unit 01 had a card, so 23 of those slots went unused.
 * That mattered because 27 of the 39 expectations are taught by a single
 * session: without something that brings a topic back, one exposure is all a
 * child ever gets.
 *
 * Each card is built from the expectations taught in EARLIER units, never the
 * current one, so it is always review rather than preview. Unit 01 keeps its
 * hand-written fluency card: nothing has been taught yet, so it has nothing to
 * review, and it is a different kind of card on purpose.
 *
 * Selection is deterministic. Rerunning the script produces identical files,
 * and reordering the units reorders the questions to match.
 *
 * Usage: node scripts/build-warmups.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { warmUpBank } from "../content/warmups.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const worksheetDir = join(root, "public", "worksheets");

// data/sessions.ts is TypeScript, so strip the types rather than compile.
// Same approach as scripts/check-coverage.mjs.
const raw = readFileSync(join(root, "data", "sessions.ts"), "utf8");
const stripped = raw
  .replace(/^export type[\s\S]*?};$/gm, "")
  .replace(/:\s*Session\[\]/g, "")
  .replace(/:\s*\{\s*code:[\s\S]*?\}\[\]/g, "")
  .replace(/\(code:\s*string\)/g, "(code)")
  .replace(/^export /gm, "");

const { sessions, unitNames, ontarioGrade2Expectations } = await import(
  `data:text/javascript,${encodeURIComponent(
    `${stripped}\nexport { sessions, unitNames, ontarioGrade2Expectations };`,
  )}`
);

const pad = (n) => String(n).padStart(2, "0");

// The unit in which each expectation is first taught. A card for unit N may
// only draw on codes whose first teaching unit is strictly before N.
const firstTaught = new Map();
for (const session of sessions) {
  for (const code of session.expectations) {
    if (!warmUpBank[code]) continue;
    const current = firstTaught.get(code);
    if (current === undefined || session.unit < current) firstTaught.set(code, session.unit);
  }
}

// How many sessions teach each code. Codes taught once are the ones most at
// risk of being met and then never seen again, so they come round more often.
const teachCount = new Map();
for (const session of sessions) {
  for (const code of session.expectations) {
    teachCount.set(code, (teachCount.get(code) ?? 0) + 1);
  }
}

/**
 * Six recall items per card, chosen by always asking whatever is most overdue.
 *
 * A rotating offset seemed reasonable and was not: it left eleven expectations
 * never revisited at all, because a code first taught in Unit 19 competes with
 * thirty others and the rotation simply never landed on it. Counting how often
 * each code has been asked and always taking the least-asked eligible ones
 * turns "probably comes round" into "cannot be skipped".
 *
 * Ties prefer the more recently taught code, since it has the fewest cards left
 * in which to reappear, then single-exposure codes, then the code itself so the
 * result never depends on object insertion order.
 */
function scheduleAllCards() {
  const asked = new Map();
  const cards = new Map();

  for (let unit = 2; unit <= unitNames.length; unit += 1) {
    const eligible = [...firstTaught.entries()]
      .filter(([, taughtAt]) => taughtAt < unit)
      .map(([code, taughtAt]) => ({
        code,
        taughtAt,
        single: (teachCount.get(code) ?? 0) === 1,
        count: asked.get(code) ?? 0,
      }));

    if (!eligible.length) continue;

    eligible.sort(
      (a, b) =>
        a.count - b.count ||
        b.taughtAt - a.taughtAt ||
        Number(b.single) - Number(a.single) ||
        a.code.localeCompare(b.code),
    );

    const picked = eligible.slice(0, Math.min(6, eligible.length));
    cards.set(
      unit,
      picked.map((entry, index) => {
        asked.set(entry.code, entry.count + 1);
        const variants = warmUpBank[entry.code];
        const [question, answer] = variants[(entry.count + index) % variants.length];
        return { ...entry, question, answer };
      }),
    );
  }

  return { cards, asked };
}

const escape = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Reuse the head, styles and print script of the hand-written Unit 01 card so
// every card in the set looks identical and stays self-contained when saved.
const template = readFileSync(join(worksheetDir, "mathnest-unit-01-warm-up-card.html"), "utf8");
const head = template.slice(0, template.indexOf("<body>") + "<body>".length);
const script = template.slice(template.lastIndexOf("<script>"), template.lastIndexOf("</script>") + 9);
const homeIcon = template.slice(template.indexOf("<svg"), template.indexOf("</svg>") + 6);

function renderCard(unit, questions) {
  const rows = questions
    .map(
      (item) =>
        `        <tr><td class="wq">${escape(item.question)}</td>` +
        `<td class="wa">${escape(item.answer)}</td>` +
        `<td class="wc">${item.code}</td></tr>`,
    )
    .join("\n");

  const covered = [...new Set(questions.map((item) => item.code))].sort();

  return `${head}
<div class="wrap">
  <div class="toolbar no-print">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../">${homeIcon} Home</a><span class="sep" aria-hidden="true">&rsaquo;</span><span>Unit ${pad(unit)}</span><span class="sep" aria-hidden="true">&rsaquo;</span><span class="current">Warm-up card</span></nav>
    <button class="btn" id="printBtn" type="button">Print or save as PDF</button>
  </div>
  <div class="sheet">
    <p class="eyebrow">Unit ${pad(unit)} // For the parent // Two minutes</p>
    <h1>Before the sheet</h1>
    <p class="lede">Everything here was taught in an earlier unit. That is the point: recall fades unless it is asked for again. Run this before the session, out loud, with no pencil. If an answer has gone, say it yourself and move on, then look at that unit again this week.</p>
    <hr class="thick">
    <div class="round">
      <div class="roundhead"><span class="clock">00:00</span><h2>Say the rules once, then start</h2></div>
      <p>&ldquo;A few quick questions from before. If you do not know one, say pass. Pass costs nothing.&rdquo; Keep it moving. Speed is not the goal, but hesitation tells you where to go back to.</p>
    </div>
    <div class="round">
      <div class="roundhead"><span class="clock">0:00 to 1:30</span><h2>Round 1, look back</h2></div>
      <p>Read the question. The answer is beside it, for you, not for the student.</p>
      <table class="listen">
        <tr><th>Ask</th><th>Answer</th><th>From</th></tr>
${rows}
      </table>
    </div>
    <div class="round">
      <div class="roundhead"><span class="clock">1:30 to 2:00</span><h2>Round 2, how did you know?</h2></div>
      <p>Pick one the student answered quickly and ask how they knew. This is the whole diagnostic. &ldquo;I just knew it&rdquo; and &ldquo;I counted&rdquo; are the same answer with very different futures.</p>
    </div>
    <p class="ex-h" style="margin:18px 0 0"><b>Ontario Grade 2 revisited:</b> ${covered.join(", ")}</p>
  </div>
</div>
${script}
</body>
</html>
`;
}

const { cards, asked } = scheduleAllCards();

let written = 0;
for (const [unit, questions] of cards) {
  writeFileSync(
    join(worksheetDir, `mathnest-unit-${pad(unit)}-warm-up-card.html`),
    renderCard(unit, questions),
    "utf8",
  );
  written += 1;
}

// A code first taught in the final unit has no later card to appear on. That is
// a fact about the running order, not a fault in the schedule, so report it
// rather than pretending the coverage is even.
const unreachable = [...firstTaught.entries()]
  .filter(([code]) => !asked.get(code))
  .map(([code, taughtAt]) => `${code} (first taught in Unit ${pad(taughtAt)})`);
if (unreachable.length) {
  console.log(`Never revisited, taught too late for any later card: ${unreachable.join(", ")}`);
}

const uncovered = Object.keys(warmUpBank).filter((code) => !firstTaught.has(code));
if (uncovered.length) {
  console.error(`Warning: bank holds codes no session teaches: ${uncovered.join(", ")}`);
}
const noBank = ontarioGrade2Expectations
  .map((expectation) => expectation.code)
  .filter((code) => !warmUpBank[code]);
if (noBank.length) {
  console.error(`Warning: no warm-up questions written for: ${noBank.join(", ")}`);
}

console.log(`Wrote ${written} warm-up cards, Units 02 to ${pad(unitNames.length)}.`);
console.log(`Unit 01 keeps its hand-written fluency card. ${Object.keys(warmUpBank).length} codes in the bank.`);
