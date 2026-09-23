# SolvEDU — Plataforma de recompensas por hallazgos técnicos

A "Liquid Glass" interface for a fictional bounty platform that connects invented
companies (Stark Industries, Wayne Enterprises, Umbrella Corp, Aperture Science,
Oscorp) with students from invented universities (Monsters University, Hogwarts,
Xavier Institute, Miskatonic University, Gotham University).

Everything in it — companies, universities, programmes, people, awards, payouts —
is invented for demonstration. Nothing here talks to a server; all data lives in
`src/data/` as typed constants.

> **Note on language.** This README and the source comments are in English; the
> interface copy and every seeded data string are in Spanish. See
> [Language, currency and award bands](#language-currency-and-award-bands).

## Running it

```bash
npm install
npm run dev        # dev server, http://localhost:5173
npm run build      # tsc -b && vite build -> dist/
npm run preview    # serve the production build
npm run typecheck  # tsc -b, no emit
npm run verify     # check the hand-authored ledger against its own invariants
```

Requires Node 20+ (developed on Node 24).

## Stack

| Piece | Choice | Why |
|---|---|---|
| Build | Vite 8 | Fast, no config ceremony |
| UI | React 19 + TypeScript 5.9 (strict) | Component structure as specified |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` | Utility-first, configured in CSS |
| Routing | Custom `useRoute` hook over `location.hash` | Deep-linkable views, zero dependencies |
| Charts | Hand-built SVG + divs | No chart library; every mark is auditable |

There is **no `tailwind.config.js`**. Tailwind v4 is configured entirely in
`src/index.css` through `@theme`, `@custom-variant` and `@utility`.

## Layout

```
src/
├─ App.tsx                  route switch; owns the search term
├─ index.css                design tokens, glass recipe, keyframes
├─ lib/
│  ├─ routes.ts             route ids, nav groups, page titles
│  ├─ router.ts             useRoute() (hash), useTheme()
│  ├─ format.ts             USD, number, date & relative-time formatting
│  └─ presentation.ts       severity, pipeline-state & payout-state metadata,
│                           difficulty bands, rank tiers
├─ data/                    fictional dataset — companies, universities,
│                           programs, submissions, leaderboard, earnings,
│                           hacktivity, badges, resources, trends
├─ components/
│  ├─ layout/               AppShell, Sidebar, Topbar, GlassBackground
│  ├─ ui/                   Panel, Button, Badge/Chip, Monogram, Icon,
│  │                        Meter, Sparkline, StatTile, Segmented, headings
│  ├─ charts/               PipelineBar, EarningsChart, SeverityBars, tooltip
│  └─ program/              ProgramCard
└─ views/                   the nine screens
```

The nine navigation categories map one-to-one onto `src/views/`. The nav labels,
page titles and route ids are three separate strings:

| Route id (English, = URL hash) | Nav label / page title (Spanish) | `src/views/` |
|---|---|---|
| `dashboard` | Panel | `DashboardView` |
| `programs` | Programas y retos | `ProgramsView` |
| `submissions` | Mis reportes | `SubmissionsView` |
| `submit` | Enviar reporte | `SubmitReportView` |
| `leaderboard` | Clasificación | `LeaderboardView` |
| `profile` | Perfil | `ProfileView` |
| `wallet` | Ganancias y cartera | `WalletView` |
| `hacktivity` | Hacktividad | `HacktivityView` |
| `resources` | Recursos y directrices | `ResourcesView` |

**Route ids stay English on purpose.** They are the `location.hash` fragments, so
translating them would silently break every existing deep link. Only the labels
are user-visible; `src/lib/routes.ts` carries a comment saying so.

## The Liquid Glass recipe

Glass is one utility, defined once so every panel matches and the theme swap
stays in the tokens:

```css
@utility glass {
  background-color: var(--solv-glass);
  border: 1px solid var(--solv-hairline);
  backdrop-filter: blur(28px) saturate(170%);
  box-shadow: var(--solv-shadow), inset 0 1px 0 0 var(--solv-glow);
}
```

`--solv-shadow` is a wide, low-opacity drop shadow; the inset highlight is the
gloss that reads as a lit top edge. `Panel` renders a separate `sheen` hairline
inside the panel for the specular streak. A `GlassBackground` layer sits behind
everything: five drifting blurred colour blobs, a masked grid, an SVG turbulence
noise overlay and a vignette. Both `backdrop-filter` and
`-webkit-backdrop-filter` are set, and all drift animation is disabled under
`prefers-reduced-motion`.

## Theming

Components are written against **semantic roles**, not `dark:` variants:

- `bg-glass`, `bg-glass-soft`, `bg-glass-strong`
- `border-hairline`, `border-hairline-soft`
- `text-ink`, `text-ink-muted`, `text-ink-faint`
- `bg-brand-wash`, `text-brand-ink`, `text-on-brand`, `text-delta-up/down`

Each role resolves to a `--solv-*` custom property, redefined once under `.dark`.
A theme toggle therefore changes one block of CSS rather than every component,
and each component keeps a single class string. `@custom-variant dark` makes
`dark:` class-based so the toggle wins over the OS setting; a pre-paint script in
`index.html` applies the stored preference before first paint, so there is no
flash of the wrong theme.

Because the panels are translucent, dark mode is a **separate set of steps**, not
an inverted light mode — the dark surfaces are darker and the series hues are
re-stepped to hold their contrast against a near-black ground.

## The ledger is checked, not trusted

The money in this app is hand-authored constants that quote each other across five
files, so `npm run verify` asserts the invariants rather than leaving them to grow
apart. It walks 25 of them, including:

- `sum(MONTHLY_EARNINGS.amount) === LIFETIME_EARNINGS === sum(WALLET_ACCOUNTS.lifetime)`,
  and `sum(MONTHLY_EARNINGS.payouts) === LIFETIME_PAYOUTS`
- **per company**, `available` equals that company's settled ("Pagado") awards and
  `pending` equals its accepted ("Aceptado") ones — so the wallet and the
  submissions table cannot tell different stories, and a matching total cannot
  hide two mismatched companies
- settled awards ≤ valid reports (a solver cannot be paid more times than they
  filed successfully)
- every programme's `bountyMin`/`bountyMax` equals its `DIFFICULTY_BANDS` entry
  exactly, the directory floor is $100 and its ceiling $3,000
- every award on a report and on the public hacktivity feed sits inside the band of
  the programme it was filed against
- every payout row names a real report and quotes the same amount
- the leaderboard's `isCurrentUser` row mirrors `CURRENT_USER` on rank, reputation
  and valid reports, and its `earned` equals `LIFETIME_EARNINGS`

## Colour: two systems that must not be confused

**Status** — reserved, fixed, never themed, never reused as a data series:
`--status-good`, `--status-warning`, `--status-serious`, `--status-critical`.
Severity uses this palette and **always ships as icon + label**, so the level is
never carried by colour alone. The hue lives in the fill and the icon; the label
stays in ink, which is what keeps `--status-warning` (#fab219, 1.79:1 on light)
legible — it is never used as text.

**Categorical** — five fixed slots, assigned in order, for report pipeline state
(Pendiente → Triaje → Aceptado → Duplicado → Pagado). These are five workflow
stages with no good/bad ordering, so a status colour would be wrong here.

### Palette validation

Both modes were checked with the dataviz skill's validator against the **actual
glass surface colours** — `#f7f8fc` light, `#141524` dark — not against default
chart surfaces, since these marks sit on translucent panels.

**Light** (`#2a78d6, #eb6834, #1baf7a, #eda100, #e87ba4`) — adjacent pairs:

```
[PASS] Lightness band       all 5 inside L 0.43–0.77
[PASS] Chroma floor         all 5 >= 0.1
[PASS] CVD separation       worst adjacent #eda100↔#1baf7a ΔE 9.1 (protan)
[PASS] Normal-vision floor  worst adjacent #e87ba4↔#eda100 ΔE 19.6
[WARN] Contrast vs surface  below 3:1: #1baf7a 2.65, #eda100 2.04, #e87ba4 2.54
```

**Dark** (`#3987e5, #d95926, #199e70, #c98500, #d55181`) — adjacent pairs:

```
[PASS] Lightness band       all 5 inside L 0.48–0.67
[PASS] Chroma floor         all 5 >= 0.1
[PASS] CVD separation       worst adjacent #c98500↔#199e70 ΔE 8.4 (protan)
[PASS] Normal-vision floor  worst adjacent #d55181↔#c98500 ΔE 19.3
[PASS] Contrast vs surface  all 5 >= 3:1
```

Three consequences are designed in, not glossed over:

1. **The light-mode contrast WARN is discharged, not dismissed.** The pipeline bar
   always carries a legend naming every state with its count, and every submission
   state also appears as a labelled badge in the submissions table. Identity never
   rests on the mark's colour alone.
2. **Adjacent pairs is the correct check here, and it is the one that passes.**
   The five slots only ever appear together as segments of a stacked bar, where
   only neighbouring segments touch. Under `--pairs all` the set does *not* pass —
   #e87ba4 vs #1baf7a is ΔE 12.9 for normal vision, below the hard floor of 15.
   That is a real constraint on this palette, and the code respects it: **there is
   no view where all five slots appear as an unlabelled key that must be
   distinguished by hue alone.** Every appearance is either stacked (adjacent) or
   carries an icon and a written label.
3. **Four single-series sparklines are not a categorical scale.** The dashboard
   stat tiles were briefly drawn in three different series hues, which implied a
   grouping that does not exist. They now all use slot 1.

Charts follow the rest of the mark discipline: ≤24px bars with a 4px rounded
data-end square at the baseline, a 2px surface gap between stacked segments and
adjacent bars, a 2px surface ring on end markers, one axis per chart (never two),
recessive gridlines, a legend whenever there are two or more series and none for
a single series, direct labels only on the peak and the current period, values in
ink rather than the series colour, and tabular figures only inside table columns
— display figures stay proportional.

## Accessibility notes

- One `<h1>` per view, from `ViewHeader`, and the page `<html lang>` is `es`.
- Every view was rendered headlessly at 390, 768 and 1440px and checked for
  horizontal overflow: **none**, at any width. Wide tables scroll inside their own
  `overflow-x-auto` container rather than scrolling the page.
- Severity and payout state are icon + label; the upvote and filter controls are
  real `aria-pressed` buttons; icon-only controls carry an accessible name.
- Tooltips are hover affordances only — every chart also states its data in text
  (legend counts, `sr-only` rows, or a table), so nothing is hover-only.
- The palette validator's checks are colour-math checks, not a substitute for
  reading the rendered page; treat the numbers above as necessary, not sufficient.

## Language, currency and award bands

**Language.** Interface copy — menus, titles, buttons, table headers, empty states,
`aria-label`s, `sr-only` text and every seeded data string — is Spanish. Two things
are deliberately left in English: **source comments** (they sit next to English
identifiers and type names) and **route ids** (they are URL fragments). TypeScript
union members that double as `Record` keys and literal comparands are Spanish too
(`Severity`, `SubmissionState`, `PayoutState`, `Difficulty`, `Scope`, `Category`,
`ResourceDoc['category']`, `Badge['tier']`), because those values are rendered
directly.

**Currency.** The platform settles in **US dollars only**; the earlier fictional
multi-currency layer is gone, along with the `Currency` interface and every
`currency`/`currencyCode` field. `src/lib/format.ts` owns the two formats:

```ts
formatUsd(3000)       // "$3,000 USD"  — inline mentions and table cells
formatUsdShort(3000)  // "$3,000"      — display figures whose unit is stated beside them
formatNumber(8420)    // "8,420"       — reputation and counts, grouped the same way
```

The hero and stat figures use `formatUsdShort` plus a separate smaller `USD` span,
because the full string reads too long at 48–56px. Reputation is a *score*, not
money, so it keeps `formatNumber` and never gains a `$`.

**Award bands.** `DIFFICULTY_BANDS` in `src/lib/presentation.ts` is the single
source of truth; every programme in `src/data/programs.ts` takes its
`bountyMin`/`bountyMax` from it, so the directory spans exactly the published range:

| Difficulty | Band |
|---|---|
| Inicial (low) | $100 – $400 |
| Intermedia | $400 – $1,000 |
| Avanzada | $1,000 – $2,000 |
| Élite (critical/high) | $2,000 – $3,000 |

The programmes-directory slider steps in $100 increments (`BOUNTY_STEP`), one notch
per band the directory can actually hit. Both the report ledger and the public
hacktivity feed are checked against these bands, so no award can be recorded
outside the band of the programme it was filed against.

## Scope

Presentation only. There is no backend, no authentication, no persistence beyond
the theme preference in `localStorage`, and the "submit report" flow ends in local
component state. Because every award is denominated in USD, balances across the
five client companies sum without conversion — that is a property of the invented
setting, not a claim about real currency handling.
