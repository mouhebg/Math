import { access, cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const clientDirectory = join(projectRoot, "dist", "client");
const workerPath = join(projectRoot, "dist", "server", "index.js");
const outputDirectory = join(projectRoot, "pages-dist");
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "Math";
const basePath = `/${repositoryName}`;

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
for (const publicPath of [
  "assets/",
  "favicon.svg",
  "file.svg",
  "globe.svg",
  "window.svg",
]) {
  html = html.replaceAll(`/${publicPath}`, `${basePath}/${publicPath}`);
}

if (!html.includes(`${basePath}/assets/`)) {
  throw new Error("The rendered homepage does not reference the Pages asset path");
}
if (!html.includes('href="worksheets/donia-math-exercises.zip"')) {
  throw new Error("The rendered homepage does not reference the exercise bundle");
}
if (html.includes('href="/worksheets/')) {
  throw new Error("The rendered homepage contains a root-level worksheet link");
}
if (!html.includes('href="worksheets/donia-unit-01-warm-up-card.html"')) {
  throw new Error("The rendered homepage does not reference the Unit 1 warm-up card");
}

for (let unit = 1; unit <= 16; unit += 1) {
  for (const session of ["a", "b"]) {
    const filename = `donia-unit-${String(unit).padStart(2, "0")}-session-${session}.html`;
    await access(join(outputDirectory, "worksheets", filename));
  }
}

await access(join(outputDirectory, "worksheets", "donia-unit-01-warm-up-card.html"));

await writeFile(join(outputDirectory, "index.html"), html);
await writeFile(join(outputDirectory, "404.html"), html);
await writeFile(join(outputDirectory, ".nojekyll"), "");

console.log(`Prepared GitHub Pages output in ${outputDirectory}`);
