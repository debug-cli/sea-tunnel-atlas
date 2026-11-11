# Data sources

| Path | Origin and date | Contents and trust | License and reading |
|---|---|---|---|
| [`data/egress.geojson`](data/egress.geojson) | Supplied seed, committed 2026-11-10 | 13 verified seed points; verification was not independently repeated here; individual sources are in properties | Source-specific reuse terms UNVERIFIED; `jq '.features | length' data/egress.geojson` |
| `data/seattle-transit-tunnel-infrastructure.pdf` | Supplied Gemini research report, committed 2026-11-10 | 13 pages; leads only, not a point source | No reuse license provided by author; `pdftotext data/seattle-transit-tunnel-infrastructure.pdf -` |

The seed's `dstt-n00` URL is Wikipedia, a lead under the current source ladder, so its primary-source corroboration remains open. The report's NE 60th claim was rejected in the brief and must not be added without a fetched primary source.

See [AGENTS.md §6](AGENTS.md#6-data-sources-and-licenses) for map services, feed URLs, attribution, and limitations. As of 2026-11-11 the GTFS feeds have not been fetched in this environment and generated files are absent.
