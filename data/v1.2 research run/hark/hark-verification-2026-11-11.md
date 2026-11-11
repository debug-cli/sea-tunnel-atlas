# Verification of three leads: Seattle light rail tunnel surface structures
Date: 2026-11-11. Method: web_search + web_fetch (or curl + pdftotext for PDFs that the fetcher could not parse). Every source below was opened. Scope: public record only. No access, security, staffing, or cross-passage location detail is recorded here, on purpose. The ST numbering standard has a cross-passage numbering example. It was left out under the scope rule.

Source tiers: **P** = primary (agency record), **P-mirror** = primary document hosted on a third-party server, **L** = lead only (news, blog, Wikipedia, artist or contractor site).

---

## Lead 1: DSTT south portal (distinct from International District/Chinatown station)

**Verdict: CONFIRMED in part.** A primary source puts the south portal area between the DSTT and S Royal Brougham Way. It also says WSDOT owns that area. No primary source found gives a street address, parcel, or coordinates for the portal mouth itself.

1. **P**: King County Ordinance 19513 (passed 2022-10-04). Attachment A, Third Amendment to the ST/KC Link O&M Agreement, Exhibit A definitions:
   > "“DSTT South Portal,” formerly referred to as the “Merge Zone” means that portion of the limited access area owned by the Washington State Department of Transportation that extends from the DSTT south to Royal Brougham Way, where light rail vehicles enter the DSTT from the south."
   >
   > "“DSTT” means the Downtown Seattle Transit Tunnel consisting of the Tunnel, the Tunnel Control Center, the 26kV electrical system, the DSTT South Portal and Tunnel Annex."
   URL: https://aqua.kingcounty.gov/council/clerk/OldOrdsMotions/Ordinance%2019513.pdf
2. **L**: Wikipedia, "Downtown Seattle Transit Tunnel":
   > "The southern portal of the tunnel is located under the intersection of Airport Way and 5th Avenue South at the western terminus of the former Interstate 90 express lanes"
   URL: https://en.wikipedia.org/wiki/Downtown_Seattle_Transit_Tunnel
3. **L** (lead only, not opened): Wikipedia "SODO Busway" search excerpt says the busway "ends at S Royal Brougham Way at the southern portal". It agrees with item 1.

**Coordinates:** No source gives any. A Nominatim (OpenStreetMap) geocode returned only street segments, not an intersection. One segment of S Royal Brougham Way centres at 47.5924, -122.3298 (OSM way 55698510). That point is a street-segment geocode. It is **not** the portal location, so do not use it as the portal point. Overpass intersection queries timed out.

**Suggested GeoJSON change:**
- Split the current `dstt-idc` feature ("International District/Chinatown Station and south portal") into two features:
  - `dstt-idc`: station only, type `station_egress`.
  - New `dstt-south-portal`: type `portal`, owner "Sound Transit (tunnel); WSDOT (portal area land, per KC Ord. 19513)", public_location "DSTT South Portal area, from the DSTT south to S Royal Brougham Way (WSDOT limited-access area)", precision "corridor-level", confidence "medium". Cite KC Ordinance 19513.
- Geometry: keep it null, or use a LineString or approximate point flagged `precision: approximate`, until a primary geometry source turns up. A good next step is the King County GIS `tunnel_area` layer (https://www5.kingcounty.gov/sdc/?Layer=tunnel_area). It was not opened in this pass.

---

## Lead 2: N00 Pine Street Ventilation Facility, and the Pine Street Stub Tunnel near 9th Ave and Pine St

**Verdict: CONFIRMED** for the facility's name and N00 code. The same standard also uses N00 as the reference point for the University Link numbering. **UNVERIFIED** for a street address or parcel. **Correction:** the King County record calls N00 the "Pine St. Substation N00". So the code covers a traction power substation as well as ventilation.

1. **P**: Sound Transit Equipment and Facilities Numbering Standard, Rev 4 (Aug 2021):
   > "Non-station or provisional station (e.g. Boeing Access Road Facility) facilities along the alignment must follow the convention for stations using odd numbers with the exception of the Pine Street Ventilation Facility (N00)."
   >
   > "...referenced from N00 Pine Street Ventilation Facility, will be assigned the lower number."
   URL: https://www.soundtransit.org/sites/default/files/documents/st-equipment-and-facilities-numbering-standard-rev-4-august-2021.pdf
2. **P**: Sound Transit Quarterly Look Ahead (last updated October 2026), FA-FLSS-26318:
   > "Replacing the Capitol Hill Station to Pine Street Ventilation Facility 26kV Feeders cable will ensure that we have redundant power feeds to tunnel ventilation at this location."
   URL: https://www.soundtransit.org/sites/default/files/documents/quarterly-look-ahead.pdf
3. **P**: King County Ordinance 19513, Att. A, §8.4.3:
   > "From IDS #40, the 26kV is distributed to the Pine St. Substation N00 ... At N00 the 26kV is then distributed to the Central Link Pine St. rectifier transformer ..."
   URL: https://aqua.kingcounty.gov/council/clerk/OldOrdsMotions/Ordinance%2019513.pdf
   (Only the facility naming is recorded here. Breaker and feeder detail is left out on purpose.)
4. **P**: Sound Transit Motion M2006-78 names the project "University Link – Pine Street Stub Tunnel to University of Washington Station". This ties University Link's south limit to the stub tunnel. URL: https://www.soundtransit.org/st_sharepoint/download/sites/PRDA/FinalRecords/2006/Motion%20M2006-78.pdf
5. **P-archived**: King County seattletunnel.org (Wayback, 2007-12-17):
   > "Sound Transit constructed a short extension of the Downtown Seattle Transit Tunnel under Pine Street between Seventh and Boren avenues to allow trains to stop and reverse direction. The extension, called the “stub tunnel,” ..."
   URL: https://web.archive.org/web/20071217032946/http:/www.seattletunnel.org/whatsnew.asp (search excerpt only; page not fully re-fetched)
6. **L**: Wikipedia, "University Link tunnel":
   > "There is one vent for the tunnel, located at a lot adjacent to the Paramount Theatre in Downtown Seattle"
   URL: https://en.wikipedia.org/wiki/University_Link_tunnel
7. **L**: Artist Ries Niemi, "Eat, Drink, and Be Merry" (2007, commissioned by Sound Transit STart):
   > "Located next to the historic Paramount Theater on Pine Street ... The site is a small urban park whose reason for existence is the Vent Shaft for the Sound Transit tunnel under Capitol Hill."
   URL: https://www.riesniemi.com/eat-drink
8. **L** (search excerpts, not relied on): CHS 2011 reports the "TBM retrieval shaft ... at Pine St downtown next to the Paramount Theater". Contractor papers (Malcolm Drilling, Schnabel) describe a "TBM retrieval shaft at the existing Pine Street Station and Stub Tunnel (PSST)".

**Not found:** a U230 contract document, the 2006 FEIS text, a SEPA record, or an SDCI permit that gives the vent facility's address or parcel. The Paramount's own address is 911 Pine St (STG). That is the theatre, not the vent site. Do not use it as the facility address.

**Suggested GeoJSON change** (feature `dstt-n00`):
- Add the Quarterly Look Ahead and KC Ord. 19513 as corroborating sources.
- Add an alias: "Pine St. Substation N00 (KC Ord. 19513)".
- Keep precision "block-level". Keep public_location as "Pine St near 9th Ave, lot beside the Paramount Theatre", and note that this placement rests on lead-tier sources (Wikipedia, artist).
- Set `address: null` and `parcel: null` until an SDCI or King County Assessor record is found.

---

## Lead 3: Montlake mid-tunnel ventilation shaft (University Link)

**Verdict: CONFIRMED dropped** (eliminated, not relocated). The emergency ventilation function went to the Capitol Hill and UW stations. The timing fits 2007: the Board was still evaluating it on 2006-11-09, and the dropped status is in the archive by 2007-07-07. The SR 520 Expert Review Panel quote is real, but it is dated July 2008 and reflects older plans. It does not show that a shaft was built.

1. **P**: Sound Transit Resolution R2005-20 (2005-07-28), original siting:
   > "The tunnel route would include a vent facility in the vicinity of East Roanoke Street and 22nd Avenue East (Hop-In Market site) in the Montlake neighborhood to meet operational and system requirements."
   URL: https://www.soundtransit.org/st_sharepoint/download/sites/PRDA/FinalRecords/2005/Resolution%20R2005-20.pdf
2. **P**: Sound Transit Motion M2006-78 (Board 2006-11-09):
   > "An important task in the early work phase is to determine whether the Montlake vent facility can be eliminated from the University Link project."
   URL: https://www.soundtransit.org/st_sharepoint/download/sites/PRDA/FinalRecords/2006/Motion%20M2006-78.pdf
3. **P-archived**: Sound Transit page "Link Light Rail Montlake Vent Facility". The dropped wording is present in Wayback captures from 2007-07-07 through 2008-10-10. The 2006-09-24 capture still said "A vent facility is required south of the Ship Canal".
   > "With the Seattle Fire Department’s concurrence, Sound Transit has determined that the emergency ventilation facility originally proposed to be sited in the Montlake neighborhood near SR-520 will not be required. After much study, the agency has shown conclusively that the light rail emergency ventilation functions can be fully met at the Capitol Hill and Univeristy of Washington stations; therefore, a remote vent will not be needed."
   URL: https://web.archive.org/web/20080516213820/http://www.soundtransit.org/x1757.xml (also https://web.archive.org/web/20070707091948/http://www.soundtransit.org/x1757.xml)
4. **P**: FTA, University Link Before-and-After Study (2021):
   > "(2) a ventilation shaft was assumed to be needed south of the UW station, which was later determined to be not needed"
   URL: https://www.transit.dot.gov/sites/fta.dot.gov/files/2021-11/University-Link-bna-study-2021.pdf
5. **P-mirror**: SR 520 Montlake Cut Tunnel Expert Review Panel Report (submitted to WSDOT 2008-07-17), p. 15:
   > "Sound Transit (ST) will be constructing bored light-rail tunnels under the Montlake Cut connecting to a cross-over structure with a vent shaft then into a station on University of Washington property in front of Husky Stadium. ... Construction of a tunnel for the SR 520 Project would need to avoid the Sound Transit tunnel, cross-over, ventilation shaft and station."
   URL: http://www.ce.memphis.edu/7137/PDFs/Seismic%20Manual/Washington%20State/2008MontlakeCutTunnelERPReport4.pdf
   Note: this panel places the "vent shaft" with the crossover near Husky Stadium, north of the Cut. That is not the Hop-In site south of SR 520. It postdates the ST elimination notice. So it is either describing UW Station/crossover vent structures or relying on outdated drawings. It does not show that a Montlake (south of the Cut) shaft exists.
6. **L**: Wikipedia, "University Link tunnel":
   > "a proposed vent in the Montlake neighborhood was removed in 2007 after opposition from nearby residents and a determination that the two stations could handle emergency ventilation on their own."

**Suggested GeoJSON change:**
- Do **not** add a built Montlake vent feature.
- Optionally add a `status: "cancelled"` historical feature: "Proposed Montlake Vent Facility (Hop-In Market site, E Roanoke St & 22nd Ave E), eliminated 2006-11 to 2007-07". Use null geometry or flag `historical_proposal: true`, and cite sources 1 to 4.
- Any existing feature or note implying a mid-tunnel Montlake shaft should be removed or marked cancelled.

---

## Files used
- /workspace/projects/0575eefc-d434-479b-8071-5a5adfca2a50/work/sea-tunnel-atlas-egress.geojson (read only; current `dstt-n00` and `dstt-idc` features compared)
- Scratch downloads in /workspace/projects/0575eefc-d434-479b-8071-5a5adfca2a50/work/: erp.pdf/txt, qla.pdf/txt, ens.pdf/txt, q.txt
