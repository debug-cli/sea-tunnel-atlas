# Changelog

One entry per version. Dates are the day the change landed on the branch.

## v2.0.0 — 2026-11-19

First assigned release. UI overhaul on the Astryx design system's neutral theme. No data, source, confidence, precision or verification-date change.

### Design system

- Adopted the Astryx neutral theme (`@astryxdesign/theme-neutral` 0.7.17, MIT, Beta) from local copies in `assets/astryx/`. No build step, no npm install, no React migration.
- Linked `assets/astryx/reset.css`, `astryx.css`, `theme-neutral.css` and `fonts.css` before `style.css`, in that order, and set `data-astryx-theme="neutral"` on `<html>`.
- Mapped every UI value to an Astryx token: neutral color ramp, 4px spacing grid, radius, shadow and duration tokens. Retired the old `#176d4e`, `#007CAD`, `#72c99e`, `#5cb8e0` palette and the Trebuchet MS / Verdana, DejaVu Sans Mono / Consolas stacks.
- Type now uses `--font-family-body`, `--font-family-heading` and `--font-family-code`, with the Astryx size scale. Mono is still reserved for data values.
- Dark mode now comes from Astryx `light-dark()` values instead of a hand-written dark token block. Reduced motion, keyboard controls and the runtime `--topbar-h` layout are unchanged.

### Interface

- Header: brand title, subtitle, `v2.0.0` badge, Settings and Full screen actions on the inverted accent surface.
- Safety banner: unchanged wording, now warning-yellow tokens, visible at every width and in both color schemes.
- Left panel: legend, Link line swatches, mapped records, Not mapped list, feed note and a version/date footer.
- Records: selected state on the list entry whose map popup is open; hover, pressed, focus and disabled states on every control.
- Settings dialog: version and release date surfaced, confidence filter, remembered view, JSON import and export.
- Map: marker shapes unchanged; marker, control, popup and places colors now come from CSS tokens read at runtime instead of literals in `app.js`.
- Status line reports loading, ready and error states explicitly.

### Docs

- `AGENTS.md` §7 palette and font rules replaced with a dated note, and new §13 records the theme choice, token and font mapping tables, component mapping, files changed, verification results and open items.
- `README.md` and `CHANGELOG.md` record v2.0.0 and the 2026-11-19 date.
- `TECHNICAL.md` corrected: markers are shaped by type, not colored by type.

### Interface — 3D view (added 2026-11-23)

- Added an optional WebGL 3D view using MapLibre GL JS 5.7.3 (BSD-3-Clause), vendored locally at `assets/maplibre/`. Leaflet remains the default and opens first on every load. The 3D view opens only after the user taps a "3D view" button.
- 3D view button checks WebGL via canvas getContext('webgl2'|'webgl'); when WebGL is missing, Leaflet stays and a plain message shows. A "2D map" button returns to Leaflet with the same centre, zoom and selected record.
- GeoJSON layers mapped to MapLibre: egress.geojson points (symbol layers with type-shaped markers — portal square, station_egress circle, station_shaft diamond, vent_facility triangle — in type colour, dashed outline for medium/low confidence), link-lines.geojson lines (data-driven colour from feature `color`), link-stations.geojson points, bus-routes.geojson lines (zoom 15+), bus-stops.geojson points (zoom 15+). Base map: OpenStreetMap raster tiles (tile.openstreetmap.org), same source as 2D Leaflet.
- MapLibre loads from vendored local files — no build step, no bundler, no package.json, no unpkg CDN dependency for the 3D library. Version 6.19.0 was dropped: it ships no `dist/maplibre-gl.js` (ESM only).
- Layer toggle panel in 3D: Surface infrastructure, Link light rail, Metro bus. Each toggle shows/hides its MapLibre layers.
- Click any egress point, link station, link line, or bus stop in 3D to open the detail panel. Click a record name in the left list to open the panel in 3D too.
- Safety warning, left panel, legend, mapped list, unmapped list, settings, confidence filter, reduced motion, keyboard controls and dark mode all work in both views.
- Deck.gl was replaced by MapLibre after unresolved Deck.gl bugs (TileLayer in wrong package, div-as-canvas, missing data layers, LineLayer math, @latest CDN drift, per-frame view sync, confidence filter not filtering, no pixel floors, click id mismatch).

### Unchanged

- `data/*.geojson` byte-for-byte; 18 records, 15 points, 3 with null geometry.
- GeoJSON property set, confidence, precision, verification dates, source ladder and rule zero.
- Leaflet 1.9.4 from unpkg, vanilla JS, no bundler, `python3 -m http.server`.

### Unchanged

- `data/*.geojson` byte-for-byte; 18 records, 15 points, 3 with null geometry.
- GeoJSON property set, confidence, precision, verification dates, source ladder and rule zero.
- Leaflet 1.9.4 from unpkg, vanilla JS, no bundler, `python3 -m http.server`.
- Settings schema version 1 under `sea-tunnel-atlas:v1`.
- Tests: 5 passing.
