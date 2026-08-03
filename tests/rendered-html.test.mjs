import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
  assert.match(css, /scroll-snap-type:\s*x proximity/);
  assert.doesNotMatch(css, /\.mobile-nav[^}]*backdrop-filter/s);
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
