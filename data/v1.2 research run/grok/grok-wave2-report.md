# Seattle-area light rail tunnel surface structures inventory
## Report limited to new structures, new primary sources, or contradictions
Generated: 2026-11-11

### Part A. GeoJSON FeatureCollection (new features only)

```json
{
  "type": "FeatureCollection",
  "name": "sea-tunnel-atlas new surface structures only",
  "metadata": {
    "generated": "2026-11-11",
    "crs": "EPSG:4326",
    "coordinate_precision": "4 decimals or coarser",
    "scope": "New structures or corrected portal locations only. Baseline stations and already-verified items omitted."
  },
  "features": [
    {
      "type": "Feature",
      "id": "elink-south-portal",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.1912, 47.6080]
      },
      "properties": {
        "id": "elink-south-portal",
        "name": "Downtown Bellevue Tunnel south portal",
        "type": "portal",
        "tunnel": "Downtown Bellevue Tunnel",
        "owner": "Sound Transit",
        "public_location": "112th Avenue NE and Main Street, Bellevue (north of East Main Station)",
        "visible_from_street": "yes",
        "precision": "intersection",
        "confidence": "high",
        "source_title": "Downtown Bellevue tunneling update",
        "source_url": "https://www.soundtransit.org/get-to-know-us/news-events/project-updates/downtown-bellevue-tunneling-update",
        "verified": "2026-11-11",
        "notes": "Primary ST source separates the portal from the East Main station centroid used in baseline. Quote: 'The south portal of the tunnel is located at 112th Avenue NE and Main Street.'"
      }
    },
    {
      "type": "Feature",
      "id": "elink-north-portal",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.1920, 47.6152]
      },
      "properties": {
        "id": "elink-north-portal",
        "name": "Downtown Bellevue Tunnel north portal",
        "type": "portal",
        "tunnel": "Downtown Bellevue Tunnel",
        "owner": "Sound Transit",
        "public_location": "110th Avenue NE and NE 6th Street, adjacent to Bellevue City Hall",
        "visible_from_street": "yes",
        "precision": "intersection",
        "confidence": "high",
        "source_title": "Downtown Bellevue tunneling update",
        "source_url": "https://www.soundtransit.org/get-to-know-us/news-events/project-updates/downtown-bellevue-tunneling-update",
        "verified": "2026-11-11",
        "notes": "Primary ST source: 'the north portal will be adjacent to City Hall at 110 Avenue NE and NE 6th Street.' Baseline used station centroid."
      }
    },
    {
      "type": "Feature",
      "id": "bh-west-portal",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.3200, 47.5770]
      },
      "properties": {
        "id": "bh-west-portal",
        "name": "Beacon Hill Tunnel west portal",
        "type": "portal",
        "tunnel": "Beacon Hill Tunnel",
        "owner": "Sound Transit",
        "public_location": "Under I-5, east of Airport Way",
        "visible_from_street": "limited",
        "precision": "approximate",
        "confidence": "high",
        "source_title": "Beacon Hill Tunnel & Station (archived ST factsheet)",
        "source_url": "https://web.archive.org/web/20150909225511if_/http:/www.soundtransit.org/sites/default/files/documents/pdf/archived_projects/20121130_beaconhilltunnelandstation.pdf",
        "verified": "2026-11-11",
        "notes": "ST archived factsheet: 'The tunnel's west portal, or opening, is located under I-5, east of Airport Way.' TBM launch site. No separate surface building beyond the portal structure."
      }
    },
    {
      "type": "Feature",
      "id": "bh-east-portal",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.3000, 47.5765]
      },
      "properties": {
        "id": "bh-east-portal",
        "name": "Beacon Hill Tunnel east portal",
        "type": "portal",
        "tunnel": "Beacon Hill Tunnel",
        "owner": "Sound Transit",
        "public_location": "East of 25th Avenue South and south of South McClellan Street",
        "visible_from_street": "yes",
        "precision": "block",
        "confidence": "high",
        "source_title": "Beacon Hill Tunnel & Station (archived ST factsheet)",
        "source_url": "https://web.archive.org/web/20150909225511if_/http:/www.soundtransit.org/sites/default/files/documents/pdf/archived_projects/20121130_beaconhilltunnelandstation.pdf",
        "verified": "2026-11-11",
        "notes": "ST archived factsheet: 'The east portal is located to the east of 25th Avenue South and south of South McClellan Street, where the light rail line emerges to an elevated trackway.' TBM recovery site."
      }
    },
    {
      "type": "Feature",
      "id": "i90-mtbaker-context",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.2950, 47.5800]
      },
      "properties": {
        "id": "i90-mtbaker-context",
        "name": "I-90 Mount Baker Tunnel center roadway (2 Line)",
        "type": "highway_context",
        "tunnel": "I-90 Mount Baker / Mercer Island tunnels",
        "owner": "WSDOT",
        "public_location": "Mount Baker Ridge, Seattle (I-90)",
        "visible_from_street": "yes (portals)",
        "precision": "approximate",
        "confidence": "high",
        "source_title": "Retrofitting Seattle's Mount Baker Ridge and Mercer Island Tunnels",
        "source_url": "https://tunnelingonline.com/case-study-retrofitting/",
        "verified": "2026-11-11",
        "notes": "2 Line uses the former reversible center roadway. WSDOT/ST converted ventilation to longitudinal system (jet fans, Saccardo nozzles) for light rail. Structures remain WSDOT highway facilities. Included as context only."
      }
    }
  ]
}
```

### Part B. Verification changes only (baseline points whose verdict shifts due to new primary sources)

| id | verdict | source title | URL | tier | exact quote |
|----|---------|--------------|-----|------|-------------|
| elink-eastmain | corrected (portal separated) | Downtown Bellevue tunneling update | https://www.soundtransit.org/get-to-know-us/news-events/project-updates/downtown-bellevue-tunneling-update | 1 | "The south portal of the tunnel is located at 112th Avenue NE and Main Street" |
| elink-bvdt | corrected (portal separated) | Downtown Bellevue tunneling update | https://www.soundtransit.org/get-to-know-us/news-events/project-updates/downtown-bellevue-tunneling-update | 1 | "the north portal will be adjacent to City Hall at 110 Avenue NE and NE 6th Street" |

No other baseline points changed. N00 parcel and exact DSTT south portal coordinates remain UNVERIFIED. No primary source contradicted the baseline station locations or Maple Leaf Portal.

### History (new only)

No additional dropped or renamed surface structures found beyond the already-settled Montlake vent.

DSTT north portal (former Convention Place) closed 2018 for Convention Center expansion. Light rail continues via the Pine Street Stub Tunnel. No active surface light-rail portal remains at the old north end.

### Incidents (new only)

No new operational incidents meeting the criteria (agency notice or established outlet, post-opening, tied to a named surface structure) were located beyond the already-verified dates.

### Part C. New primary sources only

| title | publisher | date | URL | tier | license/terms | claims supported |
|-------|-----------|------|-----|------|---------------|------------------|
| Downtown Bellevue tunneling update | Sound Transit | 2017-05-05 | https://www.soundtransit.org/get-to-know-us/news-events/project-updates/downtown-bellevue-tunneling-update | 1 | ST public project page | Bellevue south portal (112th Ave NE & Main St); north portal (110th Ave NE & NE 6th St) |
| Sound Transit completes construction of East Link Bellevue tunnel | Sound Transit | 2020-08-19 | https://www.soundtransit.org/get-to-know-us/news-events/news-releases/sound-transit-completes-construction-east-link-bellevue | 1 | ST news release | Confirms tunnel entry north of East Main Station |
| Beacon Hill Tunnel & Station (archived factsheet) | Sound Transit | ~2012 | https://web.archive.org/web/20150909225511if_/http:/www.soundtransit.org/sites/default/files/documents/pdf/archived_projects/20121130_beaconhilltunnelandstation.pdf | 1 | Archived public ST document | West portal under I-5 east of Airport Way; east portal east of 25th Ave S / south of S McClellan St |
| Retrofitting Seattle's Mount Baker Ridge and Mercer Island Tunnels | Tunneling Online | 2017-03 | https://tunnelingonline.com/case-study-retrofitting/ | 2 | Journal article | I-90 center roadway ventilation upgraded for 2 Line light rail operations |

### Searched and found nothing (gaps remaining)

- DSTT: no Tier 1 address or parcel for the Pine Street Ventilation Facility / N00 beyond the block-level description near 9th Ave & Pine St.
- DSTT south portal: no finer public coordinate or parcel beyond the already-noted WSDOT limited-access definition to Royal Brougham Way.
- University Link and Northgate Link: no mid-tunnel surface shafts or standalone portals located beyond the stations and the already-verified Maple Leaf Portal.
- Beacon Hill: main and ancillary shafts are at the station headhouse; no separate surface structures identified.
- Downtown Bellevue Tunnel: no additional mid-tunnel surface vents or egress structures beyond the two portals.
- I-90 Mount Baker / Mercer Island: no Sound Transit-owned standalone surface vent or egress buildings; ventilation remains WSDOT highway infrastructure.
