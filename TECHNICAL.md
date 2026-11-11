# Technical notes

Serve the repository over HTTP: `python3 -m http.server 8000`. The page loads Leaflet 1.9.4 from a CDN and reads the seed GeoJSON directly. Markers are colored by type, with dashed outlines for non-high confidence; source links and warnings appear in popups. External tiles and Overpass need a network connection.

`python3 tools/gtfs_to_geojson.py` downloads the rail and bus GTFS zips, associates shapes with routes via trips, simplifies display lines, and writes compact route and stop GeoJSON with source, retrieval date and feed version metadata. The page loads generated datasets if both files in a pair exist; bus stops are zoom-gated at 15. No generated feeds were committed because the agency hosts were unreachable on 2026-11-11. Converter and route colors need real-feed and browser validation.

Places are opt-in, selected by category, fetched only at zoom 15 or higher for the current bounds, debounced by one second and cached for up to 20 view/category combinations in memory. Errors do not fabricate results. Settings use a versioned localStorage record and JSON import/export; the safety acknowledgement cannot be imported.

Run `node --test tests/*.test.js`. The tests check structure, not external truth. See [AGENTS.md](AGENTS.md) for source rules and limitations.
