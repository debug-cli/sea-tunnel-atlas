# Technical notes

Serve the repository over HTTP: `python3 -m http.server 8000`. The page loads Leaflet 1.9.4 from a CDN, the Astryx neutral theme from `assets/astryx/`, and reads the seed GeoJSON directly. Markers are shaped by type, with dashed outlines for non-high confidence; source links and verification dates appear in popups. Marker, control and popup colors are read from the Astryx tokens in `style.css` at runtime. External tiles and Overpass need a network connection.

An optional WebGL 3D view (MapLibre GL JS 5.7.3, BSD-3-Clause) is loaded from vendored local files (`assets/maplibre/`) only when the user taps the "3D view" button. Leaflet remains the default and opens first on every load. The 3D view works on any browser with WebGL — no WebGPU, no build step, no bundler, no unpkg CDN dependency for the 3D library. The Leaflet view stays no-build and is unaffected by the 3D view.

`python3 tools/gtfs_to_geojson.py` downloads the rail and bus GTFS zips, associates shapes with routes via trips, simplifies display lines, and writes compact route and stop GeoJSON with source, retrieval date and feed version metadata. The page loads generated datasets if both files in a pair exist; bus stops are zoom-gated at 15. No generated feeds were committed because the agency hosts were unreachable on 2026-11-11. Converter and route colors need real-feed and browser validation.

Places are opt-in, selected by category, fetched only at zoom 15 or higher for the current bounds, debounced by one second and cached for up to 20 view/category combinations in memory. Errors do not fabricate results. Settings use a versioned localStorage record and JSON import/export; the safety acknowledgement cannot be imported.

Run `node --test tests/*.test.js`. The tests check structure, not external truth. See [AGENTS.md](AGENTS.md) for source rules and limitations.
