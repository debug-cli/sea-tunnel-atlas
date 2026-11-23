# sea-tunnel-atlas — engineering handbook

> Rule zero: Any public document may be stored in this repo verbatim, AI research reports included, with its source noted. The map (data/egress.geojson and its popups) may carry any detail a public primary source states, if publishing it is legal. Never publish Sensitive Security Information (49 CFR 1520) or records exempt under RCW 42.56.420. Never map security systems, access methods, or cross-passage locations. No coordinates finer than the source publishes.

For maintainers, contributors, researchers, and AI agents working on this static map. This is an engineering report on the current tree, not a promise of completeness.

Current release: **v2.0.0** (2026-11-19), a UI overhaul on the Astryx neutral theme. Presentation only: no data, source, confidence or precision change. Details, mapping tables and verification results are in §13.

Nothing here is aspirational. Every claim was checked against the files at the commit that added it. External-source assertions are explicitly marked where they have not been independently checked in this environment.

## §0 How to use this document

| If you are… | Read |
|---|---|
| Adding a point | §3–§5, §11 |
| Editing the map | §1, §7–§9 |
| Refreshing a feed | §6, §10 |
| Reviewing safety or a takedown | §5, §10–§12 |
| Restyling the UI, changing a token or a font | §13, §7 |

1. Rule zero overrides everything else.
2. Never treat the research PDF, AI reports, Wikipedia, or Reddit as final evidence for the map. Storing them as documents is fine.
3. Fetch and quote a primary source before adding a point; never infer a precise coordinate from a vague location.
4. Do not claim a feature, feed, source verification, test, license, or deployment that does not exist.
5. Preserve the seed files unless a reviewed change meets §4.

## §1 Mental model

```text
public sources -> tools/gtfs_to_geojson.py -> data/*.geojson
                                               |
                                         static page -> browser
```

`data/egress.geojson` is read directly. Generated GTFS layers (`link-lines`, `link-stations`, `bus-routes`, `bus-stops`) are checked in under `data/`; the app disables any layer whose file is missing. The live site is https://seatunnelatlas.vercel.app and deploys from `main`. Places use viewport-bounded Overpass requests only after opt-in and at zoom 15 or higher.

## §2 Repository map

Counts below are as checked on 2026-11-11; use the commands at the end to refresh them.

| Path | Size | Lines/pages | Role |
|---|---:|---:|---|
| `data/egress.geojson` | 17,303 bytes | 468 lines | 18 records: 15 points, 3 with null geometry |
| `data/v1.2 research run/` | varies | see its README | raw AI research output and Hark verification notes; leads only |
| `data/seattle-transit-tunnel-infrastructure.pdf` | 275,534 bytes | 13 pages | AI-generated research lead |
| `index.html`, `style.css`, `app.js` | varies | run `wc -l` | static site |
| `tools/gtfs_to_geojson.py` | varies | run `wc -l` | GTFS conversion |
| `tests/` | varies | run `wc -l tests/*` | Node tests |
| `assets/astryx/` | 360,545 bytes (v2.0.0, 2026-11-19) | 4 CSS files, 1 guide | Astryx neutral theme, reset, component CSS, Figtree faces, local guide (§13) |

## §3 How data is found

In order: (1) Sound Transit EIS/FEIS, Records of Decision, board motions and news releases; (2) Sound Transit GTFS; (3) engineering firm project pages and papers; (4) city permits and SDCI records; (5) major news outlets. Wikipedia, Reddit and the Gemini PDF are leads only. Confirm every lead against the source ladder before it becomes a point; new points require a fetched primary source.

Maple Leaf Portal is confirmed at 1st Ave NE & NE 95th St by a Sound Transit news release (2016-09-02). The PDF claims an NE 60th portal, but the brief explicitly rejected that location; no independently fetched primary source supports adding it. Do not add it based on the PDF.

`dstt-n00` (Pine Street ventilation facility) is named in Sound Transit records and cited to an archived 2007 page placing it east of 9th Ave; its point is a block-level placement, not a parcel. Verification notes for the 2026-11-11 pass are in `data/v1.2 research run/hark/`.

| Path | Format | What it holds | Trust level | How to read it |
|---|---|---|---|---|
| `data/egress.geojson` | GeoJSON | 18 records | primary-source checked, see per-feature `source_url` | `jq '.features | length' data/egress.geojson` |
| `data/v1.2 research run/` | mixed | Grok and Qwen output, prompts, Arena output, verification notes | AI output is lead only | see its README |
| `data/seattle-transit-tunnel-infrastructure.pdf` | PDF | Gemini research report | lead only | `pdftotext data/seattle-transit-tunnel-infrastructure.pdf -` |

## §4 How to add a point

GeoJSON Point feature properties, exactly: `id`, `name`, `type`, `tunnel`, `owner`, `public_location`, `visible_from_street`, `precision`, `confidence`, `source_title`, `source_url`, `verified`, `notes`. Feature `id` must equal property `id`. Current types: `vent_facility`, `station_egress`, `portal`, `station_shaft` (`station_portal` is retired; the test still accepts it). A record with a primary source but no published location gets `"geometry": null` and shows in the "Not mapped" list; never invent coordinates for it. Mark intersection or address-range geocodes as such in `precision` and `notes`. Confidence: high only when the source directly supports both feature and location; medium for a clearly identified approximate area; low when evidence is weaker. Omit unsubstantiated locations rather than giving them a confidence label. No coordinate may be more precise than its source or exceed four decimal places; rounding is a maximum, not permission to derive a location.

PR checklist:
- [ ] Fetch a primary source URL and quote the exact line supporting the point and location.
- [ ] Explain precision and confidence; ensure coordinates are no finer than source.
- [ ] Include only surface-level public information; no sensitive details.
- [ ] Include date verified in YYYY-MM-DD; check unique ID, type, and all properties.
- [ ] Run tests and request human review.

## §5 Legal limitations

**Summary, not legal advice.** [RCW 42.56.420](https://app.leg.wa.gov/RCW/default.aspx?cite=42.56.420) contains public-record security exemptions; [49 CFR Part 1520](https://www.ecfr.gov/current/title-49/subtitle-B/chapter-XII/subchapter-C/part-1520) governs Sensitive Security Information. Requests for cross-passage details may be denied under applicable exemptions; denial is case-specific, not automatic. [RCW 9A.52](https://app.leg.wa.gov/RCW/default.aspx?cite=9A.52) and the [Sound Transit code of conduct](https://www.soundtransit.org/ride-with-us/safety-security/code-conduct) address trespass and prohibited behavior. Link overhead power is a 1,500 V hazard; do not approach it. Never accept nonpublic cross-passage locations, SSI, security systems, access methods, or private information. UNVERIFIED 2026-11-11: these external texts and the voltage were not fetched in this environment; recheck the authoritative texts and applicable facts before relying on them.

## §6 Data sources and licenses

- `data/egress.geojson`: supplied verified seed, committed 2026-11-10. Point sources are recorded per feature. Dataset reuse terms are UNVERIFIED; do not assume upstream source licenses transfer.
- `data/seattle-transit-tunnel-infrastructure.pdf`: supplied Gemini-generated lead, committed 2026-11-10. Its author supplied no reuse license. Do not treat as a source for points.
- Sound Transit rail GTFS and King County Metro GTFS: agency URLs in `tools/gtfs_to_geojson.py`; neither feed was fetched or licensed independently in this environment. Check each agency's current terms before redistribution.
- OSM data and street tiles: OpenStreetMap contributors, [ODbL and attribution](https://www.openstreetmap.org/copyright); [tile usage policy](https://operations.osmfoundation.org/policies/tiles/). Places: Overpass API, [usage guidance](https://dev.overpass-api.de/overpass-doc/en/preface/commons.html); bounded requests, debounce and a small in-memory cache, no bulk download.
- Esri World Imagery: Esri and contributors, attribution in map. UNVERIFIED 2026-11-11: the brief describes terms favoring attributed non-commercial use below one million tiles per month; check current Esri terms before deployment.
- EOX Sentinel-2 cloudless: EOX, modified Copernicus Sentinel data, CC BY-NC-SA 4.0; non-commercial use only. CARTO labels: CARTO and OSM contributors; check provider terms.
- Leaflet 1.9.4 is loaded from unpkg, with its own BSD-2-Clause license; no library is vendored.

## §7 Settings schema

`localStorage` key `sea-tunnel-atlas:v1`: `{version: 1, acknowledged: boolean, showLower: boolean, rememberView: boolean, view: null | [latitude, longitude, zoom]}`. The confidence filter helps readers distinguish approximate seed points; remembered view is opt-in to reduce persistence. Acknowledgement avoids repeating the safety notice. Settings import validates types and coordinates; export is JSON. Acknowledgement is not imported. Map base and overlay choices are session-only. Settings schema version `1` is the state schema, not the release version (release: v2.0.0, §13).

Type and color follow the Astryx neutral theme (§13), dated 2026-11-19. The rule in force: achromatic UI chrome from neutral tokens; hue only where it carries meaning — warning yellow for the safety banner, categorical teal and blue for the 1 and 2 Line, orange and yellow for opt-in OSM places, semantic red for an error status. No gradients, no glassmorphism, no decorative purple. `--font-family-code` is for data values only. `style.css` is the authority, including light and dark handling and the mobile layout (section 13 of that file).

> Dated note, 2026-11-19: this replaces the v1 rule "Trebuchet MS and Verdana are readable signage-like sans faces; DejaVu Sans Mono and Consolas identify technical labels … Palette: `#176d4e`, `#007CAD`, `#72c99e`, `#5cb8e0`; no purple, gradients or glassmorphism." Those faces and hex values are retired from the UI. The no-purple, no-gradient, no-glassmorphism prohibitions survive as written, and §13 traces where each old value went. The safety warning stays visible at every width. Reduced-motion CSS suppresses animation.

## §8 Testing

`node --test tests/*.test.js`: 5 passing on 2026-11-11; 5 passing again on 2026-11-19 for v2.0.0. Tests validate a synthetic converter fixture plus seed count, schema, coordinate precision, dates, types and confidence; they do not establish truth of sources, browser behavior or feed correctness. `python3 -m py_compile tools/gtfs_to_geojson.py` checks converter syntax.

## §8a Workflow

- Data edits verified against a primary source go straight to `main`; report what changed.
- UI and code changes go on a branch with a draft PR. Merge only after the maintainer checks the Vercel preview.
- New AI research downloads go in `data/v1.2 research run/`. They never enter `egress.geojson` without a fetched primary source.

## §9 Traps

Serve over HTTP, not `file:`. External tiles, Leaflet and Overpass require network access. A GTFS stop is not necessarily an actual tunnel exit. Route shapes are display geometry, not engineering plans. Never silently map an unsupported source location. Provider policies and feed formats change. Bus stops appear only at zoom 15 or above. Missing feed files disable their layers rather than presenting fabricated data.

## §10 Playbooks

- New station opens: fetch primary documentation, establish surface location and scope, then follow §4.
- Source moves: find an authoritative replacement, verify its content, document the change; never silently substitute a lead.
- GTFS updates: check terms, run `python3 tools/gtfs_to_geojson.py` on a networked machine, review diffs, feed version, size, colors and visual output before publishing.
- Takedown: preserve the request privately, disable disputed public material promptly where appropriate, document a minimal non-sensitive rationale and seek legal review. Do not republish details in an issue.

## §11 Review checklist

Check sources and quotations, privacy and SSI, coordinate precision, attribution and license, keyboard controls, mobile display, tests, `git diff --check`, and claims against the actual tree. Do not infer source verification from a green test.

## §12 Open questions and unverified items

As of 2026-11-11:
- UNVERIFIED: agency feed conversion, route colors, tile endpoints and Overpass behavior in a browser. Network access to those hosts was unavailable here.
- UNVERIFIED: the title SVG could not be rendered here; route title colors are provisional, not claimed as GTFS colors.
- UNVERIFIED: legal/provider terms, external links and the alleged Esri usage threshold.
- Deployed at https://seatunnelatlas.vercel.app from `main`.

## §13 v2.0.0 UI overhaul — Astryx neutral theme (2026-11-19)

This is the first assigned release: **v2.0.0**, dated 2026-11-19. The scope is presentation only. No data record, source, confidence, precision or verification date changed. The release version `2.0.0` is not the settings schema version: that stays `1` under the `sea-tunnel-atlas:v1` key (§7).

### §13.1 Theme picked, and why

- Theme: **neutral**, from `@astryxdesign/theme-neutral` 0.7.17 (CLI 0.7.17, Core 0.7.17), MIT, Beta. The files were supplied with the task and are committed under `assets/astryx/`. Nothing is fetched at build time or run time, and `npm install` was not run.
- Why neutral: on this page color has to belong to the data — four marker shapes, two Link line colors, one warning banner. A chromatic chrome competes with those, and the safety banner must stay the loudest surface on the page. Neutral also ships paired light and dark values for every token through `light-dark()`, so the warning banner, dialogs, controls and borders keep their contrast in both schemes without a second hand-tuned palette.
- Rejected: `stone` tints every rule, border and popup on top of already-warm OpenStreetMap tiles; `butter`, `chocolate`, `matcha`, `gothic` and `y2k` each carry a strong accent or surface tint that competes with the warning banner and the line colors, and none of them improves legibility over map imagery.
- The header is the one inverted surface: `--color-accent` fill with `--color-on-accent` ink. In the neutral theme that is near-black in light mode and near-white in dark mode, so the bar inverts with the scheme and needs no separate dark rule.
- Palette rule now in force, and stated in §7: achromatic UI chrome from neutral tokens; hue only where it carries meaning (warning yellow for the safety banner, categorical teal and blue for the 1 and 2 Line, orange and yellow for opt-in OSM places, semantic red for an error status); no gradients, no glassmorphism, no decorative purple.
- Not migrated to React. Astryx React components require React 19; this repo has no bundler, no `package.json` and no build step. A migration option with cost, test impact and Vercel impact has not been prepared, and nothing here assumes approval.

### §13.2 Link order and scope

`<html lang="en" data-astryx-theme="neutral">`, then — in this order, all before `style.css`:

| Order | File | Layer | Role |
|---:|---|---|---|
| 1 | `assets/astryx/reset.css` | `reset` | Astryx reset |
| 2 | `assets/astryx/astryx.css` | `astryx-base` | Pre-compiled StyleX CSS, tokens and components |
| 3 | `assets/astryx/theme-neutral.css` | `astryx-theme` | Neutral token values, `@scope ([data-astryx-theme="neutral"])` |
| 4 | `assets/astryx/fonts.css` | — | Figtree `@font-face`, `font-display: fallback` |
| 5 | Leaflet 1.9.4 CSS (unpkg) | — | Map chrome |
| 6 | `style.css` | unlayered | The atlas: aliases Astryx tokens and adds only static-page rules |

`style.css` is unlayered, so it beats every Astryx layer without `!important`. The page keeps `color-scheme: light dark` on `:root`; `light-dark()` does the rest. The `@media (prefers-color-scheme: dark)` token block that v1 needed is gone.

### §13.3 Token mapping

Old value is what v1 `style.css` used. Token names were read from `theme-neutral.css` and `astryx.css`; no token was invented. Line numbers are in `style.css` at v2.0.0.

| Old value (v1) | Astryx token | CSS custom property | `style.css` |
|---|---|---|---|
| `#ffffff` panel, dialog, body background | `--color-background-surface` | `--bg` | L84 |
| _(new)_ page background | `--color-background-body` | `--bg-page` | L85 |
| `#edefe9` hover fill | `--color-overlay-hover` | `--surface-hover` | L86 |
| _(new)_ pressed fill | `--color-overlay-pressed` | `--surface-pressed` | L87 |
| `#1c2a25` body ink | `--color-text-primary` | `--ink` | L88 |
| `#4f5e56` secondary text | `--color-text-secondary` | `--muted` | L89 |
| _(new)_ disabled text | `--color-text-disabled` | `--disabled-ink` | L90 |
| `#c9cfc2` hairline rules | `--color-border` | `--rule` | L91 |
| `#6b7a72` control borders | `--color-border-emphasized` | `--rule-strong`, `--control-border` | L92 |
| `#203b30` header fill | `--color-accent` | `--header-bg` | L96 |
| `#f5f5e8` header ink | `--color-on-accent` | `--header-ink` | L97 |
| `#ffe9a8` safety fill | `--color-background-yellow` | `--warn-bg` | L100 |
| `#352300` safety ink | `--color-text-yellow` | `--warn-ink` | L101 |
| _(new)_ safety edge | `--color-border-yellow` | `--warn-rule` | L102 |
| `#176d4e` 1 Line | `--color-data-categorical-teal` | `--line-1` | L105 |
| `#007CAD` 2 Line | `--color-data-categorical-blue` | `--line-2` | L106 |
| `#10201a` focus ring | `--color-accent` | `--focus-ring` | L109 |
| `#ffffff` focus halo | `--color-background-surface` | `--focus-halo` | L110 |
| `#1c2a25` primary button fill | `--color-accent` | `--primary-bg` | L111 |
| `#ffffff` primary button ink | `--color-on-accent` | `--primary-ink` | L112 |
| `rgb(16 24 20 / 0.75)` scrim | `--color-overlay` | `--scrim` | L113 |
| _(new)_ error status ink | `--color-text-error` | `--error-ink` | L114 |

Dark mode: the v1 `@media (prefers-color-scheme: dark)` block (`#1a1d1b`, `#2a302c`, `#e8ebe6`, `#b4bdb6`, `#3b423d`, `#8d978f`, `#26302b`, `#4a3a0c`, `#ffe9a8`, `#72c99e`, `#5cb8e0`, `#ffffff`, `#1a1d1b`) is removed. Every pair above now resolves through the theme's `light-dark()` value for the active scheme.

Type:

| Old value (v1) | Astryx token | CSS custom property | `style.css` |
|---|---|---|---|
| `"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", sans-serif` | `--font-family-body` | `--font-ui` | L47 |
| _(headings shared the UI stack)_ | `--font-family-heading` | `--font-heading` | L48 |
| `"DejaVu Sans Mono", ui-monospace, monospace` | `--font-family-code` | `--font-data` | L49 |
| `0.875rem` (14px) small text | `--text-supporting-size` (12px) | `--text-small` | L50 |
| `1rem` (16px) body text | `--text-body-size` (14px) | `--text-body` | L51 |
| `1.125rem` (18px) h3 | `--text-heading-3-size` (17px) | `--text-h3` | L52 |
| `1.375rem` (22px) h2 | `--text-heading-2-size` (20px) | `--text-h2` | L53 |
| `line-height: 1.5` | `--text-body-leading` (1.4286) | `--leading-body` | L54 |
| `font-weight: 700` | `--font-weight-semibold`, `--font-weight-bold` | `--weight-semibold`, `--weight-bold` | L55 |

The page adopts the Astryx type scale as published, so body text is 14px and supporting text 12px (v1 used 16px and 14px). The safety banner stays at body size with full contrast at every width. Mono is still used only for data values: counts, dates, IDs, versions.

Spacing, shape and motion:

| Old value (v1) | Astryx token | CSS custom property | `style.css` |
|---|---|---|---|
| `0.25/0.5/1/1.5/2/3rem` | `--spacing-1/2/4/6/8/12` | `--space-1` … `--space-6` | L60 |
| `4px` control radius | `--radius-inner` (6px) | `--radius-control` | L69 |
| `8px` panel radius | `--radius-container` (12px) | `--radius-panel` | L70 |
| `0 2px 12px rgb(0 0 0 / .3)` | `--shadow-med`, `--shadow-high`, `--shadow-low` | `--shadow-float`, `--shadow-dialog`, `--shadow-chip` | L71 |
| `120ms` / `200ms` transitions | `--duration-fast` / `--duration-medium` | `--duration` / `--duration-in` | L74 |
| `ease-in` / `ease-out` | `--ease-standard` | `--ease` | L76 |
| `44px` touch target | _(kept as a local constant)_ | `--target` | L68 |

Map palette. The basemap is light in both color schemes, so map chrome keeps the light neutral values as literals. Each literal is the published light value of the token named beside it; `app.js` reads these properties at runtime, so the tokens stay the single source.

| Literal | Neutral token it comes from | CSS custom property | `style.css` |
|---|---|---|---|
| `#f1f1f1` | `--color-background-body` (light) | `--map-bg` | L127 |
| `#ffffff` | `--color-background-surface` (light) | `--map-ui-bg` | L128 |
| `#000000` | `--color-icon-primary` (light) | `--map-ui-ink`, `--marker-fill` | L129 |
| `#6a6a6a` | `--color-icon-secondary` (light) | `--map-ui-border` | L130 |
| `#f1f1f1` | `--color-background-body` (light) | `--map-ui-hover` | L131 |
| `#d4d4d4` | `--color-border-emphasized` (light) | `--map-ui-rule` | L132 |
| `#474747` | `--color-text-secondary` (light) | `--map-ui-muted` | L133 |
| `#ffffff` | `--color-background-surface` (light) | `--marker-casing` | L135 |
| `#a13f04` / `#fcec85` | `--color-data-orange-5` / `--color-data-yellow-2` | `--place-stroke` / `--place-fill` | L136 |

### §13.4 Font mapping

| Old stack | Used for (v1) | Astryx token | Custom property |
|---|---|---|---|
| `Trebuchet MS`, `Lucida Grande`, `Lucida Sans Unicode`, sans-serif | All UI text | `--font-family-body` / `--font-family-heading` | `--font-ui` / `--font-heading` |
| `DejaVu Sans Mono`, `ui-monospace`, monospace | Data values only | `--font-family-code` | `--font-data` |

`fonts.css` declares Figtree 400/500/600/700 from `./fonts/*.woff2`. Those woff2 files are not in this repository and cannot be supplied through this upload path, so the requests 404 and `font-display: fallback` keeps text in the theme's system fallback stack (`-apple-system`, `Segoe UI`, `Roboto`, `Helvetica`, `Arial`). Nothing is blocked and no text is invisible; the page simply does not render Figtree unless the face is installed locally. Recorded in §13.11.

### §13.5 Component mapping

| v1 piece | Astryx equivalent | How it is done here |
|---|---|---|
| Top bar / header | Theme surface + heading/type tokens; Astryx `Button` | Plain CSS on `--color-accent` / `--color-on-accent` |
| Title, subtitle | `--text-heading-*`, `--text-supporting-size` | `h1`, `.brand-sub` |
| Version badge | Astryx `Badge` (shape and type only) | `.badge`, `.badge-quiet`, mono text |
| Settings / Full screen | Astryx `Button` secondary; pressed via `aria-pressed` | `.button`, `.button[aria-pressed="true"]` |
| Safety banner | Astryx `Banner` warning colors | `.safety` on `--color-background-yellow` / `--color-text-yellow`, `role="note"` |
| Legend shapes | No Astryx icon equivalent for map shapes | Existing SVG shapes kept; fill and stroke from map tokens |
| Line swatches | Astryx data categorical colors | `.line-swatch` plus `--line-1`, `--line-2` |
| Record list entry | Astryx `Card` / list row with hover, pressed, selected | `.record-button`; selected via `aria-current="true"` |
| Not-mapped list | Astryx text tokens, no card | `.unmapped-list` |
| Buttons in dialogs | Astryx `Button` primary / secondary | `.button-primary`, `.button` |
| Checkboxes | Astryx `Checkbox` | Native input with `accent-color: var(--ink)`, 44px label row |
| File import | Astryx `Button` + native file input | `::file-selector-button` styled as a button |
| Dialogs | Astryx `Dialog` | `dialog`, `::backdrop` on `--color-overlay`, radius 12px, `--shadow-high` |
| Status line | Astryx supporting text | `#status` with `data-state="loading|ready|error"` |
| Panel bar toggle | Astryx `Button` tertiary + chevron | `.panel-toggle`, rotates on `aria-expanded` |
| Skip link, focus | Astryx focus ring | 3px ring in `--color-accent` plus 2px `--color-background-surface` halo |
| Map markers, controls, popups | Astryx surface, border, radius and shadow tokens | Fixed light map palette in §13.3, read by `app.js` |

Small behavioral additions in this release, all presentation-level:

- A mapped record's list entry shows `aria-current="true"` while that record's popup is open, and clears on `popupclose`.
- `#status` reports `loading`, `ready` or `error`; the error state uses `--color-text-error`.
- `app.js` no longer carries hex colors for markers, stops, places or line fallbacks. `tokenColor()` resolves the CSS custom property through a probe element and falls back to the published literal if a token is missing.

### §13.6 Version surfaces

`v2.0.0` appears in the page `<title>`, as a badge in the header, in the sidebar footer with the date `2026-11-19`, and in the Settings dialog with the same date. `README.md`, `CHANGELOG.md` and this section record the same version and date. There is no `package.json` and no git tag; the version is display text only.

### §13.7 Files changed

| File | Lines before | Lines after | Change |
|---|---:|---:|---|
| `index.html` | 108 | 122 | Astryx links, theme scope, header badge, footer, dialog meta, status state |
| `style.css` | 1157 | 1395 | Rewritten on Astryx tokens; v1 hex literals and the dark token block removed |
| `app.js` | 466 | 492 | `tokenColor()`, selected list state, status states |
| `AGENTS.md` | 138 | 346 | §7 rule replaced with a dated note; this section added |
| `README.md` | 62 | 68 | Design section, v2.0.0 changelog line |
| `CHANGELOG.md` | 3 | 39 | v2.0.0 entry |
| `TECHNICAL.md` | 9 | 9 | Corrected marker description; Astryx theme mentioned |
| `assets/astryx/ASTRYX.md` | — | new, 61 lines, 6,509 bytes | Local guide, copied unedited |
| `assets/astryx/reset.css` | — | new, 11,928 bytes | Copied unedited |
| `assets/astryx/astryx.css` | — | new, 314,582 bytes | Copied unedited; generated, never hand-edited |
| `assets/astryx/theme-neutral.css` | — | new, 30,284 bytes | Copied unedited; generated, never hand-edited |
| `assets/astryx/fonts.css` | — | new, 3,751 bytes | Copied unedited |

No `package.json`, lockfile, bundler, framework or vendored JavaScript library was added. Leaflet still loads from unpkg.

### §13.8 What did not change

- `data/*.geojson`: byte-for-byte identical. 18 records, 15 points, 3 with null geometry.
- GeoJSON property set, feature `id` = property `id`, confidence, precision, `verified` dates, source titles and URLs, and the Not mapped list.
- Rule zero, the source ladder, §4 (adding a point), §5 (legal limits) and the test suite: 5 tests, still passing.
- Settings: key `sea-tunnel-atlas:v1`, schema version `1`, import validation, export, and the rule that acknowledgement is not imported.
- Leaflet 1.9.4, vanilla JS, no build step, `python3 -m http.server 8000`, bus-stop zoom gate at 15, opt-in Overpass places.
- The safety warning: same wording, visible at every width, in both color schemes, in the notice dialog and in the page banner.

### §13.9 Verification (run 2026-11-19)

| Command | Result |
|---|---|
| `node --test tests/*.test.js` | 5 tests, 5 pass, 0 fail |
| `python3 -m py_compile tools/gtfs_to_geojson.py` | exit 0 |
| `git diff --check` | clean, no whitespace errors |
| `wc -l index.html style.css app.js` | 122, 1395, 492 |
| `jq '.features \| length' data/egress.geojson` | 18 |
| `jq '[.features[] \| select(.geometry == null)] \| length' data/egress.geojson` | 3 |
| `node --check app.js` | exit 0 |
| grep for `176d4e`, `007CAD`, `72c99e`, `5cb8e0`, `Trebuchet`, `Verdana`, `DejaVu` in `index.html`, `style.css`, `app.js` | no matches |
| Every `var(--token)` in `style.css` resolves to a declaration in `style.css` or `assets/astryx/*.css` | 106 properties used, 0 undefined |
| `python3 -m http.server`, then HTTP GET for the page, `style.css`, `app.js`, all four Astryx CSS files and `data/egress.geojson` | 200 for each |
| HTTP GET `assets/astryx/fonts/figtree-latin-400-normal.woff2` | 404, expected: face not shipped (§13.11) |

Not run here, because this environment has no browser: visual layout, dark-mode rendering, mobile sheet, reduced-motion behavior, keyboard focus order, popup auto-panning, and the `@scope`/`light-dark()` rendering path. Those are the manual checks left for the maintainer on the Vercel preview.

### §13.11 Open questions and unverified items (v2.0.0)

- Figtree is not shipped. `fonts.css` requests 8 woff2 files that are not in the repo, so text renders in the theme's system fallback stack. Fixing this needs a binary asset path that accepts `.woff2`.
- The Astryx upload contained five files: `ASTRYX.md`, `reset.css`, `astryx.css`, `theme-neutral.css`, `fonts.css`. The earlier brief named `assets/astryx/AGENTS.md`, `CLAUDE.md`, `README.md`, `tokens.json`, `palette.config.json` and `tailwind-theme.css`; none were in the upload, so none were added, copied or invented. This section is the token reference until those files arrive.
- `theme-neutral.css` scopes its tokens with `@scope`, which needs Chrome 118+, Safari 17.4+ or Firefox 128+. On an older engine the values fall back to the default Astryx theme declared in `astryx.css` (same component language, blue accent). Not verified in a browser here.
- The Astryx type scale lowers body text from 16px to 14px and small text from 14px to 12px. Legible in the stylesheet's own terms, but the maintainer should eyeball dense sidebar text at 320px width on the preview.
- `style.css` is 1,395 lines against v1's 1,157. Astryx tokens carry much of the difference, but the file is still one stylesheet; splitting it was out of scope.
- Pre-existing, not changed here: `DATA_SOURCES.md` says "13 verified seed points" while `data/egress.geojson` holds 18 records (15 points, 3 unmapped). The tree is right.
- Pre-existing, corrected here: `TECHNICAL.md` said markers are colored by type. Markers are shaped by type with no per-type color, which is what the code does and what the legend shows.
- Carried forward from §12: the GTFS conversion, route colors, tile endpoints and Overpass behavior in a browser remain unverified in this environment, and `dstt-n00` still cites a Wikipedia URL.


## §14 v2.0.0 map change — optional WebGPU 3D view (2026-11-23)

This is the second change in release v2.0.0: an optional 3D map view built on
ImmersiveMap, presented alongside Leaflet. No data record, source, confidence,
precision or verification date changed. Leaflet remains the default and opens
first on every load.

### §14.1 Library and risk

- Library: `@artembobkin/immersive-map` 0.1.1, MIT, single maintainer Artem Bobkin.
- Repo: https://github.com/artembobkin/ImmersiveMapWeb (created 2026-11-22, 2 stars, last push 2026-11-23).
- Risk: new library, tested only in Chrome on macOS; other browsers and platforms are not tested. WebGPU required (Chrome/Edge 113+, Chrome for Android 121+, Safari 26+, Firefox 141+ on Windows). No WebGL fallback. Recorded here so the risk is visible, not hidden.
- `@webgpu/types` >= 0.1.60 is a peer dependency (types only; not a runtime dependency in this plain-JS integration).

### §14.2 Build step decision

- Default path: Vite 6 builds only the 3D module. `js/3d.js` is the entry point; `vite.config.js` builds it to `dist/3d/3d.mjs` (ES module) plus worker chunks in `dist/3d/assets/`.
- Leaflet path stays no-build: `python3 -m http.server 8000` serves `index.html`, `style.css`, `app.js` and the Astryx assets unchanged. No `npm install` needed for the Leaflet view.
- `package.json` and `vite.config.js` are committed for the 3D module only. `node_modules` is not committed.
- Vercel serves static files; the 3D build output is committed and served as-is. No runtime server.
- The 3D module is imported dynamically (`import('/dist/3d/3d.mjs')`) only when the user taps the 3D view button. The 11 MB bundle is never downloaded unless 3D is requested.
- Test impact: none. Tests run on Node, not in a browser. `node --test tests/*.test.js` still passes 5/5.
- If the build step breaks the Leaflet no-build path, stop and report it. Verified: `python3 -m http.server 8000` returns 200 for all Leaflet-path files.

### §14.3 Tile source and attribution

- Default: ImmersiveMap streams OpenStreetMap vector tiles from the author's hosted Cloudflare R2 PMTiles archive (public source for the library). Tiles load over HTTP with range requests, only tiles in view.
- Config switch: a self-hosted archive can be used by pointing `tileArchiveURL` at any origin serving HTTP range requests (R2, S3, CDN, own server). See `docs/guide/TileSource.md` in the library.
- Offline path: serve a `.pmtiles` file from your own origin and point the map at it. No planet PMTiles file is committed to this repo.
- Attribution (required while 3D is on screen; shown by the map's own badge):
  1. OpenStreetMap (ODbL) — "© OpenStreetMap"
  2. RESOLVE Ecoregions 2017 (CC BY 4.0) — "Biomes © RESOLVE"
  3. Mapterhorn (open elevation) — "© Mapterhorn"
- "Powered by ImmersiveMap" credit is optional, not required.

### §14.4 Layer mapping

| GeoJSON file | Records | ImmersiveMap layer | Zoom rule | Null geometry |
|---|---|---|---|---|
| `data/egress.geojson` | 18 records, 15 points | Points layer, colour by type | All zooms | 3 records stay in Not mapped list, never on the 3D map |
| `data/link-lines.geojson` | 11 features | Line layer | All zooms | N/A |
| `data/link-stations.geojson` | 100 features | Points layer | All zooms | N/A |
| `data/bus-routes.geojson` | 422 routes | Line layer | Zoom 15+ (3D camera) | N/A |
| `data/bus-stops.geojson` | 6,271 stops | Points layer | Zoom 15+ (3D camera) | N/A |

- Egress points are registered as a shapes source so each point carries its own type colour.
- Other sources are registered by URL from the same `data/` files app.js reads. No GeoJSON parsing is duplicated: `window.__atlasData` holds the parsed egress features shared between app.js and the 3D module.
- Detail panel on tap: name, type, tunnel, owner, public location, visible from street, precision, confidence, source title, source link, verified date, notes, warnings — same in both views.

### §14.5 Marker shape limit

- ImmersiveMap points are discs only. Leaflet's shape-by-type (square, triangle, circle, arrow) has no equivalent in 3D.
- Colour by type in 3D: portal (teal), station_egress (blue), station_shaft (orange), vent_facility (yellow). Type is carried in the detail panel and legend instead of shape.
- Confidence filter: medium/low egress records are white discs with a dark stroke when `showLower` is true; hidden when false — matching Leaflet's behaviour.

### §14.6 Features rebuilt for 3D vs Leaflet-only

Rebuilt for 3D: GeoJSON layers (egress, link lines, stations, bus routes, bus stops), tap-to-select, confidence filter, camera sync between views, attribution badge.

Leaflet-only: raster tile layers (OpenStreetMap, Esri imagery, EOX Sentinel-2, CARTO labels), Overpass Places, full-screen control, Leaflet zoom controls. No control visible in 3D view does nothing there.

Dropped in 3D (with reason): marker shape-by-type (ImmersiveMap points are discs only — replaced by colour by type). No features are silently dropped.

### §14.7 Files changed

| File | Lines before | Lines after | Change |
|---|---:|---:|---|
| `index.html` | 122 | 127 | 3D view button, 2D map button, unavailable message |
| `style.css` | 1395 | 1442 | Section 14: 3D view styles, canvas fill, hidden Leaflet container |
| `app.js` | 490 | 618 | 3D view state, switchTo3D/switchTo2D, selectRecord, camera sync, confidence filter |
| `js/3d.js` | — | 273 | New: ImmersiveMap3D class, WebGPU check, layer registration, tap handler |
| `package.json` | — | new | Vite dev deps, ImmersiveMap dependency, build scripts |
| `vite.config.js` | — | new | Vite config: lib build of js/3d.js to dist/3d/ |
| `dist/3d/3d.mjs` | — | new | Vite build output: 3D module bundle (~11 MB) |
| `dist/3d/assets/*.js` | — | new | Vite build output: worker chunks |
| `AGENTS.md` | 346 | ~460 | This section added |
| `README.md` | 68 | ~72 | 3D view in quick start, design, credits, badges |
| `CHANGELOG.md` | 39 | ~65 | v2.0.0 map change entry |
| `TECHNICAL.md` | 9 | ~12 | 3D view note added |
| `data/*.geojson` | — | — | Unchanged: 18 records, 15 points, 3 null geometry |

### §14.8 What did not change

- `data/*.geojson`: byte-for-byte identical. 18 records, 15 points, 3 with null geometry.
- GeoJSON property set, feature `id` = property `id`, confidence, precision, `verified` dates, source titles and URLs.
- Rule zero, the source ladder, §4 (adding a point), §5 (legal limits).
- Astryx neutral theme: same tokens, fonts, and `style.css` mappings. The 3D view buttons use Astryx token colours.
- Settings: key `sea-tunnel-atlas:v1`, schema version 1, acknowledgement not imported.
- Leaflet 1.9.4, vanilla JS, no build step for the Leaflet path.
- Safety warning: same wording, visible at every width, in both views and both color schemes.
- Tests: 5 passing.

### §14.9 Verification (run 2026-11-23)

| Command | Result |
|---|---|
| `npm install` | 15 packages added, 0 vulnerabilities |
| `npx vite build` | dist/3d/3d.mjs + 3 worker chunks, exit 0 |
| `node --test tests/*.test.js` | 5 tests, 5 pass, 0 fail |
| `python3 -m py_compile tools/gtfs_to_geojson.py` | exit 0 |
| `git diff --check` | clean |
| `wc -l index.html style.css app.js js/3d.js` | 127, 1442, 618, 273 |
| `jq '.features | length' data/egress.geojson` | 18 |
| `jq '[.features[] | select(.geometry == null)] | length' data/egress.geojson` | 3 |
| `node --check app.js` | exit 0 |
| `python3 -m http.server 8000` → 200 for page, style.css, app.js, 3d.mjs, egress.geojson | all 200 |

Not run here: this VM has no WebGPU-capable browser. Manual checks required on the maintainer's PC (Chrome or Edge with WebGPU):
- Tap 3D view: confirm tiles load, tap an egress point, confirm detail panel shows the right record
- Tap 2D map: confirm Leaflet returns with the same centre, zoom and selected record
- Tap 3D view with WebGPU missing: confirm Leaflet stays and a plain message shows
- Confirm safety warning visible in both views, at mobile width, in light and dark mode
- Confirm attribution badge visible in 3D view
- Check the Vercel preview from the draft PR

### §14.10 Open questions and unverified items

- 3D view was not verified live in this environment: no WebGPU browser in the VM. The maintainer PC check is required before merge.
- WebGPU availability varies by browser/OS. Safari 26+ and Firefox 141+ on Windows are upcoming; current support is Chrome/Edge 113+.
- The hosted Cloudflare R2 archive is a third-party dependency. If it goes offline, the 3D view shows no tiles. The self-hosted switch mitigates this but requires the maintainer to host a PMTiles archive.
- `dist/3d/` build output (~24 MB total) is committed to the repo. This is necessary for Vercel to serve it without a runtime build, but it makes the repo larger. Alternative: let Vercel run `npm run build` at deploy time.
- `node_modules` is not committed (per constraint). A fresh clone needs `npm install` before `npm run build` can regenerate `dist/3d/`.
- Figtree woff2 still not shipped (pre-existing, §13.11).

## Verifying this document

```sh
wc -lc data/egress.geojson data/seattle-transit-tunnel-infrastructure.pdf
# 468 17303 data/egress.geojson
# 4662 275534 data/seattle-transit-tunnel-infrastructure.pdf
jq '.features | length' data/egress.geojson  # 18
pdfinfo data/seattle-transit-tunnel-infrastructure.pdf | grep Pages  # 13
node --test tests/*.test.js  # 5 passing
python3 -m py_compile tools/gtfs_to_geojson.py
git diff --check
```

The PDF page count was checked using pypdf; `jq` and `pdfinfo` are optional local tools and were not available in this environment.

If a number here disagrees with the tree, the tree is right.
