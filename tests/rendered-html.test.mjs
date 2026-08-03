import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

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
  assert.match(html, /Today(?:&apos;|’|')s lesson/);
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
});

test("keeps the homepage scrolling at frame rate", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  // A scroll-linked animation on .part-panel composites and re-rasters the whole
  // programme, every unit and every session card, on each frame. Measured on a
  // throttled CPU it held the page at half frame rate all the way down, with
  // spikes to 200ms. Reported as the page freezing while scrolling.
  assert.doesNotMatch(css, /animation-timeline/);

  // No backdrop-filter on either bar that stays on screen while content moves
  // under it. Each one re-reads and re-blurs the page behind it every frame.
  assert.doesNotMatch(css, /\.site-header[^}]*backdrop-filter/s);

  // filter: blur() on the hero washes bought nothing over the radial gradient
  // already in them, and cost a composited layer on two 600px elements.
  assert.doesNotMatch(css, /\.today-shell[^}]*filter:\s*blur/s);
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
