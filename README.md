# Donia's Math Home

A calm, practical Grade 2 mathematics programme designed for homeschooling.

The programme contains 16 units, with two teaching sessions per unit. Every session includes a printable exercise, parent instructions, a learning goal, and a clear readiness check.

## Live Website

[Open Donia's Math Home](https://mouhebg.github.io/Math/)

## Programme Structure

The 16 units are organised into four parts:

1. **Number foundations**, Units 1 to 4
2. **Taking numbers apart**, Units 5 to 8
3. **Math in daily life**, Units 9 to 12
4. **Groups and wider thinking**, Units 13 to 16

Each unit contains:

- Session A
- Session B
- Parent teaching instructions
- A downloadable exercise
- A "move on when" check
- A mastery tracker stored on the device

## Worksheet Features

- 32 printable exercise pages
- Individual exercise downloads
- One ZIP file containing all exercises
- Print or save as PDF
- Green answers displayed inside available boxes and answer lines
- A Hide answers button that removes the solutions
- Exercise-specific guidance for the parent

## Suggested Weekly Rhythm

Teach Session A first, leave at least one day for practice, then complete Session B. Repeat a session when the idea is still developing.

A typical lesson can take 20 to 25 minutes:

- 3 minutes for an oral warm-up
- 6 minutes for modelling with objects
- 8 minutes for the exercise
- 5 minutes for a game or real-life example
- 2 minutes for Donia to explain her thinking

## Run Locally

Requirements:

- Node.js 22 or newer
- npm

Install and start the project:

```bash
npm ci
npm run dev
```

Run the validation checks:

```bash
npm test
```

Create the static GitHub Pages version:

```bash
npm run build:pages
```

## Main Project Files

- `app/page.tsx` contains the homepage and programme interface.
- `app/globals.css` contains the website design and responsive layout.
- `public/worksheets/` contains the 32 exercise pages and downloadable ZIP file.
- `scripts/build-pages.mjs` creates the static GitHub Pages version.
- `.github/workflows/deploy-pages.yml` publishes updates automatically.

## Deployment

Every update pushed to the `main` branch is built and published automatically through GitHub Pages.
