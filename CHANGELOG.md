# Changelog

One entry per version. Dates are the day the change landed on the branch.

## v2.0.0 — 2026-11-19 through 2026-11-24

First assigned release. UI overhaul on the Astryx design system's neutral theme. No data, source, confidence, precision or verification-date change. v2 uses the Astryx design language (neutral theme, `@astryxdesign/theme-neutral` 0.7.17, local assets in `assets/astryx/`, no React migration, no build step).

## v1.0.0 — 2026-11-11

Initial release (retroactively labeled). Leaflet-only static map with 18 surface records (15 points, 3 with null geometry). No assigned version at the time; no build step. Opens Leaflet first on every load.

### v2.0.0 design system (2026-11-19)

- Adopted the Astryx neutral theme (`@astryxdesign/theme-neutral` 0.7.17, MIT, Beta) from local copies in `assets/astryx/`. No build step, no npm install, no React migration.
- Linked `assets/astryx/reset.css`, `astryx.css`, `theme-neutral.css` and `fonts.css` before `style.css`, in that order, and set `data-astryx-theme="neutral"` on `<html>`.
- Mapped every UI value to an Astryx token: neutral color ramp, 4px spacing grid, radius, shadow and duration tokens. Retired the old `#176d4e`, `#007CAD`, `#72c99e`, `#5cb8e0` palette and the Trebuchet MS / Verdana, DejaVu Sans Mono / Consolas stacks.
- Type now uses `--font-family-body`, `--font-family-heading` and `--font-family-code`, with the Astryx size scale. Mono is still reserved for data values.
- Dark mode now comes from Astryx `light-dark()` values instead of a hand-written dark token block. Reduced motion, keyboard controls and the runtime `--topbar-h` layout are unchanged.

### v2.0.0 interface (2026-11-19)

- Header: brand title, subtitle, `v2.0.0` badge, Settings and Full screen actions on the inverted accent surface.
- Safety banner: unchanged wording, now warning-yellow tokens, visible at every width and in both color schemes.
- Left panel: legend, Link line swatches, mapped records, Not mapped list, feed note and a version/date footer.
- Records: selected state on the list entry whose map popup is open; hover, pressed, focus and disabled states on every control.
- Settings dialog: version and release date surfaced, confidence filter, remembered view, JSON import and export.
- Map: marker shapes unchanged; marker, control, popup and places colors now come from CSS tokens read at runtime instead of literals in `app.js`.
- Status line reports loading, ready and error states explicitly.

### v2.0.0 docs (2026-11-19)

- `AGENTS.md` §7 palette and font rules replaced with a dated note, and new §13 records the theme choice, token and font mapping tables, component mapping, files changed, verification results and open items.
- `README.md` and `CHANGELOG.md` record v2.0.0 and the 2026-11-19 date.
- `TECHNICAL.md` corrected: markers are shaped by type, not colored by type.

### v2.0.0 3D view (added 2026-11-23)

- Added an optional WebGL 3D view using MapLibre GL JS 5.7.3 (BSD-3-Clause), vendored locally at `assets/maplibre/`. Leaflet remains the default and opens first on every load. The 3D view opens only after the user taps a "3D view" button.
- 3D view button checks WebGL via canvas getContext('webgl2'|'webgl'); when WebGL is missing, Leaflet stays and a plain message shows. A "2D map" button returns to Leaflet with the same centre, zoom and selected record.
- GeoJSON layers mapped to MapLibre: egress.geojson points (symbol layers with type-shaped markers — portal square, station_egress circle, station_shaft diamond, vent_facility triangle — in type colour, dashed outline for medium/low confidence), link-lines.geojson lines (data-driven colour from feature `color`), link-stations.geojson points, bus-routes.geojson lines (zoom 15+), bus-stops.geojson points (zoom 15+). Base map: OpenStreetMap raster tiles (tile.openstreetmap.org), same source as 2D Leaflet.
- MapLibre loads from vendored local files — no build step, no bundler, no package.json, no unpkg CDN dependency for the 3D library. Version 6.19.0 was dropped: it ships no `dist/maplibre-gl.js` (ESM only).
- Layer toggle panel in 3D: Labels, Surface Infrastructure, Metro bus (stops at zoom 15+), Link light rail. Each toggle shows/hides its MapLibre layers.
- In 3D, click a mapped record name in the left list to open the detail panel. Clicking a marker dot on the 3D map opens nothing (known limitation, maintainer decision 2026-11-24).
- Safety warning, left panel, legend, mapped list, unmapped list, settings, confidence filter, reduced motion, keyboard controls and dark mode all work in both views.
- Deck.gl was replaced by MapLibre after unresolved Deck.gl bugs (TileLayer in wrong package, div-as-canvas, missing data layers, LineLayer math, @latest CDN drift, per-frame view sync, confidence filter not filtering, no pixel floors, click id mismatch).

### v2.0.0 post-2026-11-23 changes

- **CARTO labels URL fix (2026-11-24, commit d93d43d):** The MapLibre CARTO labels URL used Leaflet placeholders `{s}` and `{r}`, which MapLibre cannot expand, causing a DNS failure (`{s}.basemaps.cartocdn.com` is unresolvable) that blocked the 3D view entirely. Fixed to `https://basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png` — MapLibre-supported placeholders only (`{x}`, `{y}`, `{z}`). Leaflet's copy keeps `{s}` and `{r}` (Leaflet expands them).
- **CARTO API key obfuscation (2026-11-24, commit c6a1c92):** The CARTO basemap API key is base64-encoded as `CARTO_KEY_B64` in `app.js` and decoded at runtime with `atob()` before building tile URLs. This is obfuscation, not security — the decoded key is visible in the browser Network tab on every tile request. Real protection is key Referer restriction in the CARTO dashboard and a future Vercel serverless proxy. The raw key never appears in the repo.
- **addImage fix (2026-11-23, commit a0ef087):** `drawMarkerShape()` returns `ImageData` via `ctx.getImageData(0, 0, 24, 24)` — not a raw canvas element, which MapLibre cannot parse. Each `addImage()` call is wrapped in its own try/catch so one bad icon cannot kill the whole 3D view.
- **3D regressions fix (2026-11-24, commit 9716412):** The 3D layer tile is now a proper MapLibre control object (`onAdd`/`onRemove`), not a raw div. All egress points are in the source (no confidence filter at source level); solid and dashed layers split by confidence. Click handlers bound to the real layer ids (`egress-points-solid`, `egress-points-dashed`), not the source id `egress-points`. Single `current3DPopup` reference — closes any existing popup before opening a new one, eases the map to the feature. Scroll lock uses `html.atlas-3d-active` plus `body.atlas-3d-active`; scroll position saved on switch and restored on return to 2D.
- **3D note and collapsible sidebar (2026-11-24, commit c4a60fd):** Left panel note visible only in 3D: "In 3D view, click a mapped record name in this list to open its details. Clicking a marker dot on the map does not open details." Collapsible sidebar in 2D only: close button in panel header, reopen button at the left edge, 225 ms slide animation with ease. Sidebar state (`sidebarOpen`) saved in the same `sea-tunnel-atlas:v1` settings record (default opened). Entering 3D forces the sidebar open temporarily without overwriting the saved 2D state. Returning to 2D restores the saved state.
- **Black-void grid fix (2026-11-24, commit 4bee0c0d):** `#main` restructured as a two-column grid — panel column (`minmax(0, 300px)`) + map column (`1fr`). `#main.sidebar-closed` collapses the panel column to 0 so the map fills the full width with no black void. `.panel-bar` spans both columns.
- **Base-layer panel restore and Places checkbox removal (2026-11-24, commit 55f568c):** `L.control.layers` at top-right in 2D only, with OpenStreetMap (default), Esri World Imagery, EOX Sentinel-2 cloudless. Hidden in 3D by the Leaflet hide fix. The "Places (OpenStreetMap)" checkbox was removed from the layer tile in both modes — four checkboxes remain (Labels, Surface Infrastructure, Metro bus, Link light rail). Places still render on OSM raster tiles when zooming in; the checkbox was useless. Places POI layerGroup code stays in app.js, off by default.
- **Anti-slop rules (2026-11-24, commit a7d12f5):** `AGENTS.md` §0 now holds the anti-slop rules — no invented numbers, no unverified claims, no filler, no silently dropped features, docs updates in the same commit as behavior changes. §11 review checklist applies them. `CHANGELOG.md` records the same rules here.

### Unchanged

- `data/*.geojson` byte-for-byte; 18 records, 15 points, 3 with null geometry.
- GeoJSON property set, confidence, precision, verification dates, source ladder and rule zero.
- Leaflet 1.9.4 from unpkg, vanilla JS, no bundler, `python3 -m http.server`.
- Settings schema version 1 under `sea-tunnel-atlas:v1`.
- Tests: 5 passing.
