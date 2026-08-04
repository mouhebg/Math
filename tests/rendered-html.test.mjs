import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

// These guards look for declarations, not for the comments that explain why the
// declarations are absent. Those comments have to be free to name the thing.
function declarations(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, developmentPreviewMeta);
  assert.match(html, /Sync progress/);
  assert.match(html, /Today’s lesson/);
});

test("uses a publishable Supabase browser key", async () => {
  const source = await readFile(new URL("../lib/supabase.ts", import.meta.url), "utf8");
  assert.match(source, /sb_publishable_/);
  assert.doesNotMatch(source, /service[_-]?role/i);
});

test("keeps homepage scrolling interruptible on mobile browsers", async () => {
  const [css, page] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(css, /scroll-behavior:\s*smooth/);
  assert.doesNotMatch(page, /scrollIntoView\(\{\s*behavior:\s*["']smooth["']/);
  // The parts row is a two-by-two grid on small screens, so no horizontal snap
  // container remains to freeze. Mandatory snapping must not come back.
  assert.doesNotMatch(css, /scroll-snap-type:[^;]*mandatory/);
  assert.doesNotMatch(css, /\.mobile-nav[^}]*backdrop-filter/s);

  // Chrome can swallow the next wheel gesture after a hero part link changes
  // the URL fragment. The hero must select without navigating to #programme.
  assert.doesNotMatch(page, /className="part-ribbon"[\s\S]*?href="#programme"[\s\S]*?<\/div>/);
  assert.match(page, /className="part-ribbon" role="group"/);
  assert.match(page, /className=\{`part-\$\{index \+ 1\}`\}[\s\S]*?onClick=\{\(\) => choosePart\(index\)\}/);
  assert.match(page, /aria-pressed=\{activePart === index\}/);
  assert.doesNotMatch(css, /\.part-ribbon\s+a\b/);
  assert.match(page, /className="part-tabs" role="tablist"/);
  assert.match(page, /role="tab"[\s\S]*onClick=\{\(\) => choosePart\(index\)\}/);
  assert.match(page, /startTransition\(\(\) => \{/);
});

test("keeps the homepage scrolling at frame rate", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  // A scroll-linked animation on .part-panel composites and re-rasters the whole
  // programme, every unit and every session card, on each frame. Measured on a
  // throttled CPU it held the page at half frame rate all the way down, with
  // spikes to 200ms. Reported as the page freezing while scrolling.
  assert.doesNotMatch(css, /animation-timeline/);

  // filter: blur() on the hero washes bought nothing over the radial gradient
  // already in them, and cost a composited layer on two 600px elements.
  assert.doesNotMatch(css, /\.today-shell[^}]*filter:\s*blur/s);

  // will-change on properties the compositor cannot animate, such as colour,
  // border-colour or box-shadow, promotes a layer that buys nothing and makes
  // every later repaint of it more expensive.
  assert.doesNotMatch(declarations(css), /will-change/);
});

test("keeps the page free of transitions and animations", async () => {
  // Nothing on this page moves. A transition or a keyframe that is live during
  // an interaction repaints its element every frame for its whole duration, and
  // one click here changes state on many elements at once: a part tab restyles
  // four tabs and rebuilds the unit grid, and marking a session restyles the
  // card, its header, the unit counter, the part score and the progress meter.
  // On a 20x-throttled CPU one status click cost 1105ms of main thread with the
  // motion present and 410ms without it. Reported as the page freezing on click.
  const css = declarations(await readFile(new URL("../app/globals.css", import.meta.url), "utf8"));

  assert.doesNotMatch(css, /\btransition\s*:/);
  assert.doesNotMatch(css, /\btransition-(duration|property|delay|timing-function)\s*:/);
  assert.doesNotMatch(css, /\banimation\s*:/);
  assert.doesNotMatch(css, /\banimation-(name|duration|delay|iteration-count)\s*:/);
  assert.doesNotMatch(css, /@keyframes/);

  // With no durations anywhere, prefers-reduced-motion is satisfied by
  // construction and needs no media query of its own.
  assert.doesNotMatch(css, /prefers-reduced-motion/);
});

test("keeps no bar pinned over the content", async () => {
  // The menu bar is gone. What it taught still applies to anything that stays on
  // screen while content moves under it: an element the compositor has to
  // maintain against the whole scrolling page is expensive, and an animated,
  // layer-promoted child of one is much worse. Sweeping the pointer across the
  // old bar cost 414ms of blocked main thread and 36 late frames out of 49 on a
  // 20x-throttled CPU.
  //
  // The bottom navigation is the one element left that is fixed over content, so
  // it is the one to keep honest.
  const [css, page] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);
  const rules = declarations(css);

  assert.doesNotMatch(rules, /\.site-header/, "the menu bar is gone; its styles should be too");
  assert.doesNotMatch(page, /SiteHeader/, "the menu bar component is gone");

  assert.doesNotMatch(rules, /\.mobile-nav[^}]*(backdrop-filter|will-change|translateZ)/s);

  // Cloud sign-in has no other route into the app, so it has to stay reachable.
  assert.match(page, /SyncMenu/);
});

test("uses the Thmanyah type system across the homepage", async () => {
  const [css, layout] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(css, /font-family:\s*"Thmanyah Sans"/);
  assert.match(css, /font-family:\s*"Thmanyah Serif Display"/);
  assert.match(css, /font-family:\s*"Thmanyah Serif Text"/);
  assert.match(css, /--font-sans:\s*"Thmanyah Sans"/);
  assert.match(css, /--font-serif:\s*"Thmanyah Serif Display"/);
  assert.match(css, /--font-text:\s*"Thmanyah Serif Text"/);
  assert.doesNotMatch(layout, /next\/font\/google/);
});

test("uses Thmanyah typography on the worksheets as well as the site", async () => {
  const directory = new URL("../public/worksheets/", import.meta.url);
  const sheets = (await readdir(directory)).filter((name) => name.endsWith(".html"));

  assert.ok(sheets.length >= 34, `expected the full worksheet set, found ${sheets.length}`);

  for (const name of sheets) {
    const html = await readFile(new URL(name, directory), "utf8");
    assert.doesNotMatch(html, /fonts\.(googleapis|gstatic)\.com/, `${name} still loads Google Fonts`);
    assert.doesNotMatch(html, /Poppins|Lora|IBM Plex Mono|DM Mono|Newsreader|Archivo/, `${name} still names a replaced family`);
    assert.match(html, /font-family:"Thmanyah Sans"/, `${name} is missing the Thmanyah faces`);
    assert.match(html, /--font-sans:"Thmanyah Sans"/, `${name} is missing the Thmanyah variables`);
  }
});

