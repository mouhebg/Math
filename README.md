# MathNest

A calm, practical Grade 2 mathematics programme for home use. It includes twenty-four units, sixty teaching sessions, printable exercises, parent guidance, and a readiness check that tells you when to move on. Every specific expectation in the Ontario 2020 Grade 2 mathematics curriculum has at least one session, and sessions that go beyond Grade 2 are labelled as extensions.

**Live site:** https://mathnest.ca

## What this is

This is a parent-run programme, not a worksheet dump. Each session focuses on one idea, one exercise, and one clear sign that the idea has landed. The worksheet shows what the child can already do. Short oral warm-ups build recall.

The sequence builds number relationships before asking the child to apply them. Bonds to ten come before larger facts, concrete models come before written procedures, and explanations matter more than speed.

## Programme structure

The twenty-four units sit in six parts:

1. **Number foundations**, Units 1 to 4
2. **Taking numbers apart**, Units 5 to 8
3. **Shape and space**, Units 9 to 12
4. **Math in daily life**, Units 13 to 16
5. **Patterns, equality and code**, Units 17 to 20
6. **Groups, data and review**, Units 21 to 24

Each unit contains two to four sessions, parent instructions, a downloadable exercise, a move-on check, and a three-state learning tracker stored in the browser.

## Curriculum coverage

Every session in `data/sessions.ts` carries an `expectations` array holding the Ontario specific expectation codes it covers. `COVERAGE.md` is generated from that data and lists each of the thirty-nine Grade 2 expectations against the sessions that teach it.

```bash
node scripts/check-coverage.mjs   # fails on a missing expectation, worksheet, or mislabelled sheet
node scripts/build-worksheets.mjs # generates any worksheet listed in content/worksheets.mjs
node scripts/build-glossary.mjs   # rebuilds the English and French vocabulary card
```

`check-coverage.mjs` also verifies that each worksheet's printed header, page title, and element id match its filename, so renumbering a unit cannot silently leave a sheet labelled with its old number.

## French immersion

`public/worksheets/mathnest-glossary-card.html` is a printable card holding every term in the programme in English and French, grouped by part. It exists as a separate card rather than as French labels inside the worksheets, because half-translated worksheets teach two partial vocabularies instead of one bridge. Edit the term list in `scripts/build-glossary.mjs`.

Sessions with an empty `expectations` array sit outside Grade 2 on purpose. Two-digit halving, making change, and clock reading are useful and worth teaching, but they are not what the child is assessed on, so they appear as extensions rather than core work.

Curriculum source: https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-mathematics/grades/g2-math

### Unit map

| Unit | Focus | Sessions | Ontario expectations |
| --- | --- | --- | --- |
| 01 | Bonds to ten and facts to 20 | 4 | B2.2, B2.1, B2.4, B2.3 |
| 02 | Place value to 200 | 3 | B1.1, B1.2, B1.3, B1.4 |
| 03 | Mental addition | 2 | B2.3 |
| 04 | Addition within 100 | 2 | B1.1, B2.4 |
| 05 | Subtraction within 100 | 2 | B1.1, B2.4, B2.1 |
| 06 | Choosing strategies | 2 | B2.3, B2.1, B2.4 |
| 07 | Fair sharing and halves | 2 | B1.6 |
| 08 | Two-digit halving | 2 | extension or review |
| 09 | Sorting two-dimensional shapes | 2 | E1.1 |
| 10 | Composing shapes and congruence | 2 | E1.2, E1.3 |
| 11 | Measuring length | 3 | E2.1, E2.2, E2.3 |
| 12 | Maps, position and movement | 2 | E1.4, E1.5 |
| 13 | Canadian money | 2 | F1.1 |
| 14 | Making change | 2 | extension or review |
| 15 | Duration and clocks | 4 | E2.4 |
| 16 | Apply and review | 2 | C4, E2.4, F1.1 |
| 17 | Patterns and rules | 3 | C1.1, C1.2, C1.3 |
| 18 | Number patterns and equality | 2 | C1.4, C2.3 |
| 19 | Balance and the missing number | 2 | C2.1, C2.2 |
| 20 | Coding | 3 | C3.1, C3.2 |
| 21 | Equal groups and arrays | 2 | B2.5 |
| 22 | Sharing, thirds, odd and even | 3 | B1.6, B2.6, B1.7, B1.4, B1.5 |
| 23 | Data | 4 | D1.1, D1.2, D1.3, D1.4, D1.5 |
| 24 | Chance and review | 3 | D2.1, D2.2 |

### Facts to 20, inside Unit 1

Bonds to ten make the partners of ten automatic, and Unit 3 applies bridging to
two-digit numbers. Two sessions sit between them, so a child is not asked to
bridge mentally before the teen numbers are secure:

- **Session C, Doubles and near doubles.** Learn the doubles to 10 + 10, then
  reach a neighbouring pair from a known double. `8 + 7` is one less than
  `8 + 8`. One fact held in the head instead of three.
- **Session D, Cross the ten.** Make the ten with counters that stay visible on
  the table, then read the answer as ten and some ones. The session opens with
  `10 + n` because a child who does not yet hear "fifteen" as "ten and five"
  cannot bridge at all.

A child who answers `8 + 7` with `5` has not forgotten the ten, but is answering
the last question asked. Session D ends every step on the total.

The programme uses Ontario Grade 2 topics as a reference, but follows its own mastery sequence. It is not an official curriculum or a line-by-line implementation of provincial expectations.

## Weekly rhythm

Teach Session A first, leave at least one day for practice, then complete Session B. Repeat a session when the idea is still developing. Repeating is part of the programme.

A lesson takes about 20 to 25 minutes:

- 2 minutes, oral warm-up with no pencil
- 6 minutes, modelling with objects
- 8 minutes, the exercise
- 5 minutes, a game or real-life example
- 2 minutes, the student explains the thinking behind an answer

The explanation at the end is an important diagnostic. "I counted" and "I knew 7 and 3 make 10" can produce the same answer, but they show different levels of understanding.

## Worksheets

- 34 printable session exercises
- A two-minute Unit 1 warm-up card
- Individual downloads and one ZIP bundle
- Print or save as PDF from each page
- Answers shown in green inside the available boxes and lines, hidden by default
- A Hide answers control that removes the solutions again
- Exercise-specific guidance for the parent

Pages are designed for North American Letter paper, 8.5 by 11 inches. When printing on A4, choose "fit to page" in the print dialog.

## Progress tracking

Each session can be marked Not started, Practising, or Mastered. The homepage automatically recommends the next lesson, the header carries a running percentage, and each part of the programme shows how far through it the student is. Progress is always stored locally first. A parent can optionally sign in through a passwordless Supabase email link to back up that progress and continue on another device. Existing mastery ticks from earlier versions are migrated automatically.

Cloud synchronization uses two row-level secured tables:

- `math_session_progress`, one row per user and session
- `math_preferences`, the last opened part and unit

The matching database migration is stored in `supabase/migrations/`. Only the publishable browser key is included in the application. No Supabase secret or service-role key is exposed.

### One-time authentication setting

In the Supabase project's **Authentication → URL Configuration** screen, set both the Site URL and an allowed Redirect URL to:

```text
https://mathnest.ca
```

This allows the passwordless email link to return safely to the published MathNest website. Email authentication and Magic Links must remain enabled.

## Design standard

The website and new learning resources share one visual system:

- Thmanyah Sans for interface text, labels, and figures
- Thmanyah Serif Display for lesson titles and learning hierarchy
- Thmanyah Serif Text for reading passages and exercise prose
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

The site is served from the custom domain **mathnest.ca**. `scripts/build-pages.mjs` writes a
`CNAME` file into every deployment, so the domain setting survives each publish, and it keeps
asset links at the root instead of the `/Math/` repository sub-path.

### DNS records at the registrar

Point `mathnest.ca` at GitHub Pages with these records:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `mouhebg.github.io.` |

The domain must use the registrar's own DNS zone. While it stays on the parking nameservers
(`parking1.whc.ca`, `parking2.whc.ca`) these records cannot be added.

After the records resolve, open **Settings → Pages** in the repository, confirm the custom
domain reads `mathnest.ca`, and turn on **Enforce HTTPS** once the certificate is issued.

To build for the repository sub-path again, set `SITE_DOMAIN=""` before `npm run build:pages`.

## Contributing

This is a personal family project. Issues and pull requests are not actively monitored.
