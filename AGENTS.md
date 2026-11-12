# sea-tunnel-atlas — engineering handbook

> Rule zero: Only public, cited, surface-level information goes in this repo. No cross-passage locations, no security systems, no access methods, no coordinates finer than the source publishes.

For maintainers, contributors, researchers, and AI agents working on this static map. This is an engineering report on the current tree, not a promise of completeness.

Nothing here is aspirational. Every claim was checked against the files at the commit that added it. External-source assertions are explicitly marked where they have not been independently checked in this environment.

## §0 How to use this document

| If you are… | Read |
|---|---|
| Adding a point | §3–§5, §11 |
| Editing the map | §1, §7–§9 |
| Refreshing a feed | §6, §10 |
| Reviewing safety or a takedown | §5, §10–§12 |

1. Rule zero overrides everything else.
2. Never treat the research PDF, Wikipedia, or Reddit as final evidence.
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

`localStorage` key `sea-tunnel-atlas:v1`: `{version: 1, acknowledged: boolean, showLower: boolean, rememberView: boolean, view: null | [latitude, longitude, zoom]}`. The confidence filter helps readers distinguish approximate seed points; remembered view is opt-in to reduce persistence. Acknowledgement avoids repeating the safety notice. Settings import validates types and coordinates; export is JSON. Acknowledgement is not imported. Map base and overlay choices are session-only. Trebuchet MS and Verdana are readable signage-like sans faces; DejaVu Sans Mono and Consolas identify technical labels. Palette: `#176d4e`, `#007CAD`, `#72c99e`, `#5cb8e0`; no purple, gradients or glassmorphism. DejaVu Sans Mono is for data values only. `style.css` is the authority, including dark mode and the mobile layout (section 13). The safety warning stays visible at every width. Reduced-motion CSS suppresses animation.

## §8 Testing

`node --test tests/*.test.js`: 5 passing on 2026-11-11. Tests validate a synthetic converter fixture plus seed count, schema, coordinate precision, dates, types and confidence; they do not establish truth of sources, browser behavior or feed correctness. `python3 -m py_compile tools/gtfs_to_geojson.py` checks converter syntax.

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
