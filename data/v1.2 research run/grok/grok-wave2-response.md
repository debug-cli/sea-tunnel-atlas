# Grok research response — verbatim

Chat: sea-tunnel-atlas research wave #2 (pinned)
URL: https://grok.com/c/72ca752... (see links.md) — https://grok.com/c/72ca75af3-37d7-4296-89d0-f28a1f779d00
Response id: rid=bd940302-9899-46d7-9e54-993532e7cc1b
Model shown: Fast (strongest free model; Expert/Heavy/Auto require SuperGrok)
Response header on page: "Worked for 35s" — no other preamble; response begins at "Part A."

## User message sent (exact)

Follow every instruction in the attached grok-research-prompt.txt. The attached egress.json is the 13-point baseline. Deliver the complete report in one response.

## Part A. GeoJSON FeatureCollection of new or corrected features

```json
{ "type": "FeatureCollection", "name": "sea-tunnel-atlas new or corrected surface structures", "metadata": { "generated": "2026-11-11", "crs": "EPSG:4326", "coordinate_precision": "4 decimals or coarser", "scope": "Public record only. Surface structures only." }, "features": [ { "type": "Feature", "id": "elink-south-portal", "geometry": { "type": "Point", "coordinates": [-122.1912, 47.6080] }, "properties": { "id": "elink-south-portal", "name": "Downtown Bellevue Tunnel south portal", "type": "portal", "tunnel": "Downtown Bellevue Tunnel", "owner": "Sound Transit", "public_location": "112th Avenue NE and Main Street, Bellevue (north of East Main Station)", "visible_from_street": "yes", "precision": "intersection", "confidence": "high", "source_title": "Downtown Bellevue tunneling update", "source_url": "https://www.soundtransit.org/get-to-know-us/news-events/project-updates/downtown-bellevue-tunneling-update", "verified": "2026-11-11", "notes": "ST 2017 project update: south portal located at 112th Avenue NE and Main Street. ST 2020 completion release confirms entry north of East Main Station at 112th Avenue SE and Main Street. Baseline station points reused for portals; this separates the actual portal." } }, { "type": "Feature", "id": "elink-north-portal", "geometry": { "type": "Point", "coordinates": [-122.1920, 47.6152] }, "properties": { "id": "elink-north-portal", "name": "Downtown Bellevue Tunnel north portal", "type": "portal", "tunnel": "Downtown Bellevue Tunnel", "owner": "Sound Transit", "public_location": "110th Avenue NE and NE 6th Street, adjacent to Bellevue City Hall (at Bellevue Downtown Station)", "visible_from_street": "yes", "precision": "intersection", "confidence": "high", "source_title": "Downtown Bellevue tunneling update", "source_url": "https://www.soundtransit.org/get-to-know-us/news-events/project-updates/downtown-bellevue-tunneling-update", "verified": "2026-11-11", "notes": "ST 2017: north portal adjacent to City Hall at 110 Avenue NE and NE 6th Street. ST 2020: emerges at Bellevue Downtown Station. Baseline reused station centroid; this marks the portal." } }, { "type": "Feature", "id": "bh-west-portal", "geometry": { "type": "Point", "coordinates": [-122.3200, 47.5770] }, "properties": { "id": "bh-west-portal", "name": "Beacon Hill Tunnel west portal", "type": "portal", "tunnel": "Beacon Hill Tunnel", "owner": "Sound Transit", "public_location": "Under I-5, east of Airport Way (SoDo side)", "visible_from_street": "limited", "precision": "approximate", "confidence": "high", "source_title": "Beacon Hill Tunnel & Station (archived ST factsheet)", "source_url": "https://web.archive.org/web/20150909225511if_/http:/www.soundtransit.org/sites/default/files/documents/pdf/archived_projects/20121130_beaconhilltunnelandstation.pdf", "verified": "2026-11-11", "notes": "ST archived factsheet: west portal under I-5, east of Airport Way. TBM launch site. No separate surface building identified beyond the portal structure itself." } }, { "type": "Feature", "id": "bh-east-portal", "geometry": { "type": "Point", "coordinates": [-122.3000, 47.5765] }, "properties": { "id": "bh-east-portal", "name": "Beacon Hill Tunnel east portal", "type": "portal", "tunnel": "Beacon Hill Tunnel", "owner": "Sound Transit", "public_location": "East of 25th Avenue South and south of South McClellan Street (approaches Mount Baker Station elevated guideway)", "visible_from_street": "yes", "precision": "block", "confidence": "high", "source_title": "Beacon Hill Tunnel & Station (archived ST factsheet)", "source_url": "https://web.archive.org/web/20150909225511if_/http:/www.soundtransit.org/sites/default/files/documents/pdf/archived_projects/20121130_beaconhilltunnelandstation.pdf", "verified": "2026-11-11", "notes": "ST archived factsheet: east portal east of 25th Ave S and south of S McClellan St, where line emerges to elevated trackway toward Mount Baker. TBM recovery site." } }, { "type": "Feature", "id": "dstt-pine-stub-vent", "geometry": { "type": "Point", "coordinates": [-122.3314, 47.6132] }, "properties": { "id": "dstt-pine-stub-vent", "name": "Pine Street Stub Tunnel ventilation structure (N00 related)", "type": "vent_facility", "tunnel": "DSTT / University Link", "owner": "Sound Transit", "public_location": "East of Ninth Avenue on Pine Street (near Paramount Theatre / former Convention Place area)", "visible_from_street": "yes", "precision": "block-level", "confidence": "medium", "source_title": "What's new in the tunnel? (archived seattletunnel.org); Sound Transit Motion M2004-78", "source_url": "https://web.archive.org/web/20071217032946/http:/www.seattletunnel.org/whatsnew.asp", "verified": "2026-11-11", "notes": "Archived project page: permanent vent shaft structure east of Ninth Avenue houses two 10-ft diameter fans for emergency ventilation of the stub tunnel, Westlake Station, and University Link tunnels. M2004-78 confirms emergency ventilation equipment in the Pine Street Stub Tunnel (~730 ft under Pine St). Exact parcel still UNVERIFIED from primary permit or U230/SDCI record. Baseline N00 point retained at same approximate location." } }, { "type": "Feature", "id": "i90-mtbaker-context", "geometry": { "type": "Point", "coordinates": [-122.2950, 47.5800] }, "properties": { "id": "i90-mtbaker-context", "name": "I-90 Mount Baker Tunnel (center roadway used by 2 Line)", "type": "highway_context", "tunnel": "I-90 Mount Baker / Mercer Island tunnels (2 Line)", "owner": "WSDOT", "public_location": "Mount Baker Ridge, Seattle (I-90 between Rainier Ave S and Mercer Island)", "visible_from_street": "yes (portals)", "precision": "approximate", "confidence": "high", "source_title": "Retrofitting Seattle's Mount Baker Ridge and Mercer Island Tunnels; WSDOT/ST ventilation upgrade descriptions", "source_url": "https://tunnelingonline.com/case-study-retrofitting/", "verified": "2026-11-11", "notes": "2 Line uses the former reversible center roadway. WSDOT and Sound Transit upgraded ventilation to longitudinal system (jet fans, Saccardo nozzles) for light rail operations. Structures remain WSDOT highway facilities. Catalogued as context only per scope. No separate ST-owned surface vent or egress structures identified beyond the tunnel itself." } } ] }
```

(Correction: the chat URL is exactly https://grok.com/c/72ca7af3-37d7-4296-89d0-f28a1f779d00 — ignore the malformed line above.)

## Part B. Verification table for baseline points (only changes from new sources)

| id | verdict | source title | URL | tier | exact quote supporting the verdict |
|---|---|---|---|---|---|
| elink-eastmain | corrected | Downtown Bellevue tunneling update | https://www.soundtransit.org/get-to-know-us/news-events/project-updates/downtown-bellevue-tunneling-update | 1 | "The south portal of the tunnel is located at 112th Avenue NE and Main Street" |
| elink-bvdt | corrected | Downtown Bellevue tunneling update | https://www.soundtransit.org/get-to-know-us/news-events/project-updates/downtown-bellevue-tunneling-update | 1 | "the north portal will be adjacent to City Hall at 110 Avenue NE and NE 6th Street" |
| bh-station | confirmed (shafts at station; portals separate) | Beacon Hill Tunnel & Station (archived ST) | https://web.archive.org/web/20150909225511if_/http:/www.soundtransit.org/sites/default/files/documents/pdf/archived_projects/20121130_beaconhilltunnelandstation.pdf | 1 | "The main shaft of the tunnel station ... and the secondary shaft ... were excavated to 165 feet deep." Portals described separately. |
| dstt-n00 | unconfirmed (parcel still missing) | Motion M2004-78; archived seattletunnel.org | https://www.soundtransit.org/st_sharepoint/download/sites/PRDA/FinalRecords/2004/Motion%20M2004-78.pdf ; https://web.archive.org/web/20071217032946/http:/www.seattletunnel.org/whatsnew.asp | 1 / 3 | "This tunnel will contain ... emergency ventilation equipment." / "The stub tunnel includes a permanent vent shaft structure east of Ninth Avenue." Exact address/parcel UNVERIFIED. |
| dstt-idc | unconfirmed (exact south portal coords still missing) | (no new Tier 1 coordinate source found) | — | — | KC Ord 19513 already notes WSDOT limited access from DSTT south to Royal Brougham Way. No finer public address or parcel located. |

All other baseline points remain confirmed per prior verification; no contradictory primary sources found.

### History table (dropped / renamed structures)

| name | project | date | status | new name | quote | URL |
|---|---|---|---|---|---|---|
| Montlake mid-tunnel vent shaft | University Link | 2007 | dropped | none | (already settled; no further research) | prior sources |
| Convention Place Station / DSTT north portal | DSTT | 2018-07-21 | closed / demolished for Convention Center | Pine Street Stub Tunnel connection remains | "Convention Place station was closed permanently on July 21, 2018" | Wikipedia DSTT (Tier 4 lead only); ST records confirm closure |

No other dropped surface structures found in primary records for the scoped tunnels.

### Incident table

No new operational incidents meeting the criteria (agency notice or established outlet, tied to named structure, post-opening, excluding security/trespass) beyond the already-verified dates. Searches for 2025-08-15 / 09-20 / 09-22 and additional fan events returned no new primary agency notices tied to specific named surface structures beyond prior baseline notes.

## Part C. Source list

| title | publisher | date | URL | tier | license or terms | claims supported |
|---|---|---|---|---|---|---|
| Downtown Bellevue tunneling update | Sound Transit | 2017-05-05 | https://www.soundtransit.org/get-to-know-us/news-events/project-updates/downtown-bellevue-tunneling-update | 1 | ST public project page | Bellevue south portal at 112th Ave NE & Main St; north portal at 110th Ave NE & NE 6th St |
| Sound Transit completes construction of East Link Bellevue tunnel | Sound Transit | 2020-08-19 | https://www.soundtransit.org/get-to-know-us/news-events/news-releases/sound-transit-completes-construction-east-link-bellevue | 1 | ST news release | Tunnel connects East Main and Bellevue Downtown; entry north of East Main |
| Beacon Hill Tunnel & Station (archived factsheet) | Sound Transit | ~2012 | https://web.archive.org/web/20150909225511if_/http:/www.soundtransit.org/sites/default/files/documents/pdf/archived_projects/20121130_beaconhilltunnelandstation.pdf | 1 | Archived public ST document | West portal under I-5 east of Airport Way; east portal east of 25th Ave S / south of S McClellan St; shafts at station |
| Motion M2004-78 | Sound Transit | 2004 | https://www.soundtransit.org/st_sharepoint/download/sites/PRDA/FinalRecords/2004/Motion%20M2004-78.pdf | 1 | ST Board motion (public) | Pine Street Stub Tunnel construction includes emergency ventilation equipment |
| What's new in the tunnel? | seattletunnel.org (archived) | ~2007 | https://web.archive.org/web/20071217032946/http:/www.seattletunnel.org/whatsnew.asp | 3 | Archived project site | Permanent vent shaft east of 9th Ave for stub tunnel; two 10-ft fans |
| Retrofitting Seattle's Mount Baker Ridge and Mercer Island Tunnels | Tunneling Online / authors | 2017-03 | https://tunnelingonline.com/case-study-retrofitting/ | 2 | Journal article | I-90 tunnels ventilation converted to longitudinal for light rail (2 Line center roadway) |
| Sound Transit completes first light rail tunnel from Northgate to Roosevelt | Sound Transit | 2015-03-16 | https://www.soundtransit.org/get-to-know-us/news-events/news-releases/sound-transit-completes-first-light-rail-tunnel-northgate | 1 | ST news release | Maple Leaf Portal launch site; tunnels to Roosevelt then UW |
| University Link Light Rail Extension Before-and-After Study | FTA | 2021 | https://www.transit.dot.gov/sites/fta.dot.gov/files/2021-11/University-Link-bna-study-2021.pdf | 1 | FTA public report | U-Link tunnels from Pine Street stub to UW Station; stations handle ventilation |

### Searched and found nothing (by tunnel)

- DSTT: no primary address/parcel for N00 beyond block-level near 9th/Pine; no active light-rail surface north portal after Convention Place closure (stub connection only).
- University Link: no standalone mid-tunnel surface shafts or portals beyond stations and the Pine Street Stub vent.
- Northgate Link: no mid-tunnel surface shafts; only Maple Leaf Portal (already verified) and stations.
- Beacon Hill: no separate surface structures for the main/ancillary shafts beyond the station headhouse.
- Downtown Bellevue: no additional vents or mid-tunnel surface structures beyond the two portals.
- I-90 Mount Baker / Mercer Island: no ST-owned standalone vent or egress buildings; ventilation is WSDOT highway infrastructure upgraded for dual use.

All claims rest on the listed URLs and quotes. Exact N00 parcel and DSTT south portal coordinates remain UNVERIFIED.

(End of Grok response. Page shows "85 sources" control and Copy response / Copy JSON code / Copy table + Save table buttons; three table CSVs were downloaded.)

## Follow-up message sent (per user, after response finished)

Skip anything that matches the attached egress.json baseline or the ALREADY VERIFIED section. Report only new structures, new primary sources, or contradictions.

### Grok reply (verbatim, "Worked for 35s")

File saved.

The report contains only new structures (Bellevue portals, Beacon Hill portals, I-90 context), the primary sources that support them, and the remaining gaps. Baseline points and already-verified items are omitted.

Grok created and saved a file in the chat: `sea-tunnel-surface-structures-report.md` (Document, 9.62 KB), with "Open" and "Download" controls. Downloaded via the Download button to:
`/workspace/web/downloads/sea-tunnel-surface-structures-report-87cb1454.md` (9.4 KB)

## Exports used

- "Save table" x3 on the first research response -> `/workspace/web/downloads/table-ea2a8708.csv` (1.7 KB), `/workspace/web/downloads/table (1)-40510458.csv` (440 B), `/workspace/web/downloads/table (2)-2c0d510f.csv` (2.3 KB)
- "Download sea-tunnel-surface-structures-report.md" on the follow-up response -> `/workspace/web/downloads/sea-tunnel-surface-structures-report-87cb1454.md`
- Note: the first response's "Save to a file for download" control, when clicked, was placed into the composer and sent as a message; the resulting Grok turn was stopped ("Interrupted") after 5s and contains no report content.

## Research-mode / model gating (exact wording seen)

- Model selector (`#model-select-trigger`, "Model: Fast") lists: Fast (selected), Build, and Auto / Expert / Heavy each marked "Requires SuperGrok", plus "Get 50% off Premium", "Unlock extended capabilities", "Claim offer".
- Slash-command palette "Modes" lists only: Fast, Build; also "Skills".
- Plugins dialog offers only Connectors and Skills.
- No DeepSearch, DeeperSearch, Research, or Expert research mode is available to this free account; no separate research-mode toggle exists in the composer. Fast (the most capable model available without SuperGrok) was kept selected. No paywall message was triggered by sending the prompt; the paywall wording appears only as "Requires SuperGrok" on the Auto/Expert/Heavy model options.

## Chat management

- Renamed to exactly `sea-tunnel-atlas research wave #2` (sidebar row and page title both show it).
- Pinned via the chat's header/sidebar "More" menu; the menu item changed from "Pin" to "Unpin" and the sidebar row shows a pin icon.
- Chat URL: https://grok.com/c/72ca7af3-37d7-4296-89d0-f28a1f779d00
