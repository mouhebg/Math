# Donia's Math Home

A calm, practical Grade 2 mathematics programme for home use. It includes sixteen units, two teaching sessions per unit, printable exercises, parent guidance, and a readiness check that tells you when to move on.

**Live site:** https://mouhebg.github.io/Math/

## What this is

This is a parent-run programme, not a worksheet dump. Each session focuses on one idea, one exercise, and one clear sign that the idea has landed. The worksheet shows what the child can already do. Short oral warm-ups build recall.

The sequence builds number relationships before asking the child to apply them. Bonds to ten come before larger facts, concrete models come before written procedures, and explanations matter more than speed.

## Programme structure

The sixteen units sit in four parts:

1. **Number foundations**, Units 1 to 4
2. **Taking numbers apart**, Units 5 to 8
3. **Math in daily life**, Units 9 to 12
4. **Groups and wider thinking**, Units 13 to 16

Each unit contains Session A, Session B, parent instructions, a downloadable exercise, a move-on check, and a three-state learning tracker stored in the browser.

### Unit map

| Unit | Focus | Move on when |
| --- | --- | --- |
| 01 | Bonds to ten and part-whole thinking | She gives the partner of any number to 10 without counting up |
| 02 | Place value to 200 | She represents and compares a number in more than one way |
| 03 | Mental addition | She moves by tens and chooses an efficient strategy |
| 04 | Addition within 100 | Her answer matches her estimate and concrete model |
| 05 | Subtraction within 100 | She explains regrouping and checks by adding |
| 06 | Choosing strategies | She selects and justifies an addition or subtraction method |
| 07 | Fair sharing and halves | She connects equal sharing, doubles, and halves |
| 08 | Two-digit halving | She splits tens and ones and models any remaining half |
| 09 | Canadian money | She identifies coins and makes equivalent amounts |
| 10 | Making change | She counts up and checks the change independently |
| 11 | Reading clocks | She reads the hour correctly and explains quarter-hour times |
| 12 | Apply and review | She applies money and time, and identifies what to practise next |
| 13 | Equal groups and arrays | She finds totals without counting every object by ones |
| 14 | Sharing, odd, and even | She checks equal shares and predicts odd or even |
| 15 | Data, patterns, and chance | She interprets a graph and states a pattern rule |
| 16 | Review and next steps | She names her strengths and chooses the next practice target |

The programme uses Ontario Grade 2 topics as a reference, but follows its own mastery sequence. It is not an official curriculum or a line-by-line implementation of provincial expectations.

## Weekly rhythm

Teach Session A first, leave at least one day for practice, then complete Session B. Repeat a session when the idea is still developing. Repeating is part of the programme.

A lesson takes about 20 to 25 minutes:

- 2 minutes, oral warm-up with no pencil
- 6 minutes, modelling with objects
- 8 minutes, the exercise
- 5 minutes, a game or real-life example
- 2 minutes, Donia explains her thinking

The explanation at the end is an important diagnostic. "I counted" and "I knew 7 and 3 make 10" can produce the same answer, but they show different levels of understanding.

## Worksheets

- 32 printable session exercises
- A two-minute Unit 1 warm-up card
- Individual downloads and one ZIP bundle
- Print or save as PDF from each page
- Answers shown in green inside the available boxes and lines, hidden by default
- A Hide answers control that removes the solutions again
- Exercise-specific guidance for the parent

Pages are designed for North American Letter paper, 8.5 by 11 inches. When printing on A4, choose "fit to page" in the print dialog.

## Progress tracking

Each session can be marked Not started, Practising, or Mastered. The homepage automatically recommends the next lesson, while the sixteen-unit progress map makes it easy to revisit any topic. Progress is always stored locally first. A parent can optionally sign in through a passwordless Supabase email link to back up that progress and continue on another device. Existing mastery ticks from earlier versions are migrated automatically.

Cloud synchronization uses two row-level secured tables:

- `math_session_progress`, one row per user and session
- `math_preferences`, the last opened part and unit

The matching database migration is stored in `supabase/migrations/`. Only the publishable browser key is included in the application. No Supabase secret or service-role key is exposed.

### One-time authentication setting

In the Supabase project's **Authentication → URL Configuration** screen, set both the Site URL and an allowed Redirect URL to:

```text
https://mouhebg.github.io/Math/
```

This allows the passwordless email link to return safely to the published Math website. Email authentication and Magic Links must remain enabled.

## Design standard

The website and new learning resources share one visual system:

- Archivo for clear instructional and interface text
- Newsreader for lesson titles and learning hierarchy
- Warm ivory backgrounds, deep navy actions, green learning cues, and distinct part colours
- Rounded cards, visible rules, and restrained shadows
- Print-friendly worksheets with answers hidden by default
- Keyboard focus states, descriptive labels, and responsive layouts

Shared website tokens live in `app/globals.css`. Printable resources keep their essential styles inline so downloaded files remain self-contained.

## Run locally

Requirements: Node.js 22 or newer, and npm.

```bash
npm ci
npm run dev
```

Run the checks:

```bash
npm test
npm run lint
```

Build the static GitHub Pages version:

```bash
npm run build:pages
```

## Main project files

- `app/page.tsx`, the homepage and programme interface
- `app/globals.css`, the shared website design system and responsive layout
- `public/worksheets/`, the exercises, warm-up card, and downloadable ZIP
- `scripts/build-pages.mjs`, the static Pages build
- `.github/workflows/deploy-pages.yml`, automatic publishing

## Deployment

Every push to `main` is built and published to GitHub Pages automatically.

## Contributing

This is a personal family project. Issues and pull requests are not actively monitored.
