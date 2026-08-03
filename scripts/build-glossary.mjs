#!/usr/bin/env node
/**
 * Builds a single printable English/French vocabulary card covering the whole
 * programme, for a child who meets these ideas in French at school and in
 * English at home.
 *
 * This is deliberately a separate card rather than French labels sprinkled
 * through the worksheets. Half-translated worksheets teach two partial
 * vocabularies; one complete reference card teaches the bridge.
 *
 * Usage: node scripts/build-glossary.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const worksheetDir = join(here, "..", "public", "worksheets");
const template = readFileSync(join(worksheetDir, "mathnest-unit-02-session-a.html"), "utf8");

const head = template
  .slice(0, template.indexOf("<body>") + "<body>".length)
  .replace(/<title>[^<]*<\/title>/, "<title>MathNest | Les mots des maths, English and French</title>");

const homeIcon =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M3 12L12 3l9 9"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg>';

const groups = [
  {
    title: "Numbers and operations",
    units: "Units 1 to 8",
    terms: [
      ["the whole", "le tout"],
      ["a part", "une partie"],
      ["to add", "additionner"],
      ["the sum, the total", "la somme, le total"],
      ["to subtract", "soustraire"],
      ["the difference", "la différence"],
      ["ones", "les unités"],
      ["tens", "les dizaines"],
      ["hundreds", "les centaines"],
      ["place value", "la valeur de position"],
      ["to regroup, to trade", "regrouper, échanger"],
      ["a double", "un double"],
      ["a half", "une moitié"],
      ["to make ten", "faire dix"],
      ["to count on", "compter à partir de"],
      ["to skip count", "compter par bonds"],
      ["even", "pair"],
      ["odd", "impair"],
      ["equal to", "égal à"],
      ["greater than", "plus grand que"],
      ["less than", "plus petit que"],
      ["to estimate", "estimer"],
    ],
  },
  {
    title: "Shape, space and measuring",
    units: "Units 9 to 12",
    terms: [
      ["a shape", "une figure"],
      ["a side", "un côté"],
      ["an angle", "un angle"],
      ["a vertex, a corner", "un sommet"],
      ["a triangle", "un triangle"],
      ["a square", "un carré"],
      ["a rectangle", "un rectangle"],
      ["a pentagon", "un pentagone"],
      ["a hexagon", "un hexagone"],
      ["an octagon", "un octogone"],
      ["symmetry", "la symétrie"],
      ["a line of symmetry", "un axe de symétrie"],
      ["congruent", "congruent, congruente"],
      ["to measure", "mesurer"],
      ["the length", "la longueur"],
      ["a centimetre", "un centimètre"],
      ["a metre", "un mètre"],
      ["a map", "une carte"],
      ["a quarter turn", "un quart de tour"],
      ["to the left, to the right", "à gauche, à droite"],
    ],
  },
  {
    title: "Money and time",
    units: "Units 13 to 16",
    terms: [
      ["money", "l'argent"],
      ["a coin", "une pièce de monnaie"],
      ["a bill", "un billet"],
      ["a cent", "un cent, un sou"],
      ["a dollar", "un dollar"],
      ["change", "la monnaie"],
      ["a second", "une seconde"],
      ["a minute", "une minute"],
      ["an hour", "une heure"],
      ["how long it lasts", "la durée"],
      ["half past", "et demie"],
      ["quarter past, quarter to", "et quart, moins le quart"],
    ],
  },
  {
    title: "Patterns, equality and code",
    units: "Units 17 to 20",
    terms: [
      ["a pattern", "une régularité"],
      ["a repeating pattern", "une régularité répétée"],
      ["a growing pattern", "une régularité croissante"],
      ["the pattern rule", "la règle de la régularité"],
      ["the equals sign", "le signe égal"],
      ["an equation", "une équation"],
      ["equivalent", "équivalent, équivalente"],
      ["a variable", "une variable"],
      ["to balance", "équilibrer"],
      ["code", "le code"],
      ["a sequence of steps", "une séquence d'étapes"],
      ["at the same time", "en même temps"],
    ],
  },
  {
    title: "Groups, fractions and data",
    units: "Units 21 to 24",
    terms: [
      ["equal groups", "des groupes égaux"],
      ["a row", "une rangée"],
      ["a column", "une colonne"],
      ["to multiply", "multiplier"],
      ["to divide", "diviser"],
      ["to share equally", "partager également"],
      ["a fraction", "une fraction"],
      ["one half", "un demi"],
      ["one third", "un tiers"],
      ["one fourth", "un quart"],
      ["one sixth", "un sixième"],
      ["data", "les données"],
      ["a survey", "un sondage"],
      ["tally marks", "des marques de pointage"],
      ["a table", "un tableau"],
      ["a bar graph", "un diagramme à bandes"],
      ["a pictograph", "un pictogramme"],
      ["the mode", "le mode"],
      ["impossible, possible, certain", "impossible, possible, certain"],
    ],
  },
];

const rows = (terms) =>
  terms
    .map(
      ([en, fr]) =>
        `<div class="q"><b>${en}</b><br><span style="color:var(--green)">${fr}</span></div>`,
    )
    .join("\n   ");

const body = `<div class="worksheet-shell">
 <header class="worksheet-tools">
  <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../">${homeIcon} Home</a><span class="sep" aria-hidden="true">›</span><span class="current">Les mots des maths</span></nav>
  <div class="worksheet-actions">
   <button id="print-sheet">Print or save as PDF</button>
  </div>
 </header>
 <div class="ws active" id="ws-glossary">
 <div class="ws-head"><div class="code">REFERENCE CARD // KEEP IT ON THE TABLE</div><h4>Les mots des maths</h4>
  <p class="ex-h">She meets these ideas in French at school and in English here. Same idea, two names. Point at the word, say both, carry on with the lesson.</p></div>
${groups
  .map(
    (group) => ` <div class="ex"><p class="ex-t">${group.title} <span style="color:var(--muted);font-weight:400">· ${group.units}</span></p>
  <div class="qg c3">
   ${rows(group.terms)}
  </div></div>`,
  )
  .join("\n")}
 <div class="pnote"><b>How to use it</b>Do not turn this into a vocabulary test. Keep it beside the worksheet. When a word comes up, say it in both languages once and move on. Over a term that is a few hundred painless repetitions, and it stops her freezing on a French word for something she already understands.</div>
 <div class="pnote"><b>Please check these against her classroom</b>These are the standard Ontario French terms as far as I can establish, but classroom usage varies and a teacher's wording wins. Worth confirming a handful early: régularité for pattern, un sommet for corner, and le mode. If her teacher uses something else, cross it out and write theirs.</div>
 </div>
</div>
<script>document.getElementById('print-sheet').addEventListener('click',function(){window.print();});</script>
</body>
</html>`;

writeFileSync(join(worksheetDir, "mathnest-glossary-card.html"), `${head}\n${body}`, "utf8");

const count = groups.reduce((total, group) => total + group.terms.length, 0);
console.log(`wrote mathnest-glossary-card.html (${count} term pairs)`);
