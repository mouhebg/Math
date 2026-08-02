import { access, cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const clientDirectory = join(projectRoot, "dist", "client");
const workerPath = join(projectRoot, "dist", "server", "index.js");
const outputDirectory = join(projectRoot, "pages-dist");
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "Math";
// The site is published on its own domain, so assets stay at the root. Set SITE_DOMAIN to an
// empty string to build for the repository sub-path (https://<user>.github.io/<repository>/).
const customDomain = process.env.SITE_DOMAIN ?? "mathnest.ca";
const basePath = customDomain ? "" : `/${repositoryName}`;

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(clientDirectory, outputDirectory, { recursive: true });

const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("github-pages", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const response = await worker.fetch(
  new Request("https://static-render.local/"),
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

if (!response.ok) {
  throw new Error(`Homepage render failed with status ${response.status}`);
}

let html = await response.text();
if (basePath) {
  for (const publicPath of [
    "assets/",
    "favicon.svg",
  ]) {
    html = html.replaceAll(`/${publicPath}`, `${basePath}/${publicPath}`);
  }
}

if (!html.includes(`${basePath}/assets/`)) {
  throw new Error("The rendered homepage does not reference the Pages asset path");
}
if (!html.includes('href="worksheets/mathnest-math-exercises.zip"')) {
  throw new Error("The rendered homepage does not reference the exercise bundle");
}
if (html.includes('href="/worksheets/')) {
  throw new Error("The rendered homepage contains a root-level worksheet link");
}
if (!html.includes('href="worksheets/mathnest-unit-01-warm-up-card.html"')) {
  throw new Error("The rendered homepage does not reference the Unit 1 warm-up card");
}

for (let unit = 1; unit <= 16; unit += 1) {
  for (const session of ["a", "b"]) {
    const filename = `mathnest-unit-${String(unit).padStart(2, "0")}-session-${session}.html`;
    await access(join(outputDirectory, "worksheets", filename));
  }
}

await access(join(outputDirectory, "worksheets", "mathnest-unit-01-warm-up-card.html"));

await writeFile(join(outputDirectory, "index.html"), html);
await writeFile(join(outputDirectory, "404.html"), html);
await writeFile(join(outputDirectory, ".nojekyll"), "");

// GitHub Pages reads CNAME on every deployment, so the custom domain survives each publish.
if (customDomain) {
  await writeFile(join(outputDirectory, "CNAME"), `${customDomain}\n`);
}

console.log(`Prepared GitHub Pages output in ${outputDirectory}`);
