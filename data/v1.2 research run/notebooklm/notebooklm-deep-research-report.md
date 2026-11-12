> **AI-generated report. Unverified lead, not a source.** Produced by Gemini Notebook (NotebookLM) Deep Research on 2026-11-12 in the notebook "sea-tunnel-atlas research wave #2" (share link in notebook-share-link.txt). Nothing here enters data/egress.geojson without a fetched primary source.
>
> Known problems: it places Maple Leaf Portal near NE 92nd St (Sound Transit's 2016-09-02 release says NE 95th). Several incident claims cite a Reddit thread and a housing-finance board packet, so treat them as likely fabricated.
>
> Redactions: passages on security systems, SCADA, intrusion detection, egress access routes, fan control detail, and cross-passage numbering are replaced with "[removed: out of scope]", per the repo's rule zero (AGENTS.md). The unredacted text exists only in the shared notebook.

# Engineering Analysis of Seattle Light Rail Surface Portals, Vent Structures, and Subterranean Interfaces

## Downtown Seattle Transit Tunnel North Portal, Convention Place Decommissioning, and Pine Street Structures

The transition of the Downtown Seattle Transit Tunnel (DSTT) from a dual-mode bus-and-rail corridor into a dedicated high-capacity light rail trunk represents a foundational phase in Central Puget Sound's regional transit development [cite: 1, 2]. Originally engineered to accommodate electric trolleybuses and dual-mode diesel buses, the 1.3-mile DSTT required extensive structural, civil, and systems retrofits to integrate low-floor light rail vehicles (LRVs) while establishing seamless track connections for northern extensions [cite: 1, 2].

Crucial to this transition was Sound Transit Motion No. M2004-78, which authorized Contract C510 to Balfour Beatty, Inc. for $82.7 million, yielding a total authorized allocation of $90.97 million inclusive of third-party betterment reimbursements [cite: 2]. This contract encompassed two major civil undertakings: the full retrofit of the existing DSTT infrastructure and the cut-and-cover construction of the 730-foot Pine Street Stub Tunnel (PSST) [cite: 2]. Executing this work necessitated a complete 24-month shutdown of the DSTT to bus operations beginning in September 2005 [cite: 2]. During this closure, crews lowered sub-grade profiles, installed direct-fixation tracks suited for low-floor LRVs, upgraded fire protection systems, and installed high-capacity station exhaust fans to satisfy modern underground transit fire and life safety mandates [cite: 2].

Prior to the construction of University Link, the DSTT terminated at its north portal within Convention Place Station, an open-cut facility designed primarily for bus staging and access to the Interstate 5 express lanes [cite: 3, 4]. As Sound Transit advanced the Central Link Final Environmental Impact Statement (FEIS) and subsequent engineering studies, multiple north portal configurations were evaluated [cite: 4]. The preferred alignment selected an entirely underground connection that bypassed surface bus operations, routing twin-bored tunnels directly out of the Pine Street corridor toward Capitol Hill [cite: 4, 5, 6].

To facilitate the expansion of the Washington State Convention Center (WSCC, now the Summit building), King County and Sound Transit authorized the formal closure and decommissioning of Convention Place Station [cite: 3, 7]. Under interlocal real estate agreements, King County conveyed permanent subterranean easements to Sound Transit for rail operations while surrendering the surface and upper station envelope for commercial development [cite: 3, 7]. In 2019, the open pit and bus access ramps of Convention Place Station were backfilled, and structural foundation piles for the convention center expansion were driven directly around and above the active light rail subterranean right-of-way [cite: 3]. The short "S-shaped" bus access tunnel running beneath 9th Avenue and Pine Street was structurally plugged, leaving the PSST as the exclusive operational connection extending east under Pine Street to tie into the University Link alignment [cite: 3, 5, 8].

## Ventilation Infrastructure and Engineering Datums: Pine Street Ventilation Facility (N00)

The Pine Street Ventilation Facility, designated in Sound Transit's system-wide asset schema as N00, serves a dual purpose as both a primary emergency ventilation shaft and the foundational geographical datum for facility numbering across the northern rail line [cite: 9]. Situated directly within the subterranean cut-and-cover footprint of the PSST beneath Pine Street east of Westlake Station, the N00 structure houses multi-stage emergency ventilation fans, traction power distribution equipment, track crossover mechanics, and dedicated communications control rooms [cite: 2, 10].

In the system equipment hierarchy, facility N00 is established as the zero point ( 0+ 00 ) for all linear spatial references extending northward [cite: 9]. [removed: out of scope] Overhead Catenary System (OCS) structures and auxiliary electrical drop points similarly derive their instance numbers based on their relative distance and track alignment measured from N00 [cite: 9].

From an environmental engineering perspective, the N00 facility operates as a pressurized air-handling node designed to control smoke movement during thermal emergencies within the Westlake Station platform zone or the PSST turnback tracks [cite: 2, 11]. Under the Second Downtown Tunnel Feasibility Assessment, structural and mechanical evaluations revealed that integrating future high-density operational junctions—such as a split line connection between the 1 Line, 2 Line, and prospective Ballard Link Extension—will place heightened air-volume demands on the original infrastructure [cite: 11]. Consequently, operational models indicate that any major capacity expansion involving multi-train occupancy per ventilation zone will require mechanical fan upgrades at both N00 and Westlake Station, alongside structural separation of concourse and platform air volumes to maintain positive-pressure egress corridors [cite: 11].

| Facility Identifier | Primary Subsurface Location | Structural Construction Method | Primary Systems Housed | Grid / Asset Baseline Function |
|---|---|---|---|---|
| N00 Pine Street Vent Facility | Subsurface Pine Street Right-of-Way (East of Westlake) | Cut-and-Cover Concrete Vault | Emergency Vent Fans, Crossover Tracks, EE & Comm Rooms [cite: 2] | Zero-datum ( 0+ 00 ) for all northern Link spatial assets [cite: 9] |
| Westlake Vent Upgrade Zone | 4th Avenue & Pine Street Intersection | Integrated Station Vault | [removed: out of scope] | Platform air isolation & transfer node [cite: 11] |
| Convention Place Subterranean Easement | 9th Avenue & Pine Street Quadrant | Backfilled Trench / Deep Foundation Piles | Active Twin-Bore Rail Right-of-Way [cite: 3, 7] | Sub-grade transit easement under WSCC foundation [cite: 3, 7] |

## Subterranean Extensions and Portal Geometry: University Link and Northgate Link

The extension of light rail north from downtown Seattle required continuous soft-ground tunneling beneath dense urban topographies, major arterial highways, and navigable waterways [cite: 5, 12]. The 3.15-mile University Link (U-Link) project extends from the PSST to University of Washington (UW) Station near Husky Stadium via twin-bored tunnels [cite: 5, 6, 13]. Because the U-Link alignment is completely subterranean, surface footprint structures between station boxes were minimized through environmental mitigation strategies detailed in the Final Environmental Impact Statement (FEIS) [cite: 5, 6, 14].

During early preliminary engineering for U-Link, environmental assessments evaluated a dedicated surface ventilation and traction power substation (TPSS) facility south of State Route 520 between 10th Avenue East and Federal Avenue East within the Roanoke and Montlake neighborhood corridor, originally evaluated as Option C [cite: 14]. However, refinement of the final design led to a reduction in the surface footprint: the TPSS and associated system control rooms were consolidated directly into the underground structure of UW Station, thereby eliminating the need for an expansive standalone mid-alignment surface building along the SR 520 corridor [cite: 14].

Further north, the 4.3-mile Northgate Link Extension continues the subterranean route from UW Station through U-District and Roosevelt stations before emerging to the surface [cite: 6, 12, 15]. The critical structural interface between the underground bored tunnels and the northern elevated guideway is the Maple Leaf Portal [cite: 12, 16, 17]. Executed under Contract N160, which included civil and architectural finishes for the portal, elevated structures, and Northgate Station garage, the Maple Leaf Portal is situated north of NE 65th Street near 1st Avenue NE and NE 92nd Street [cite: 12, 16, 18].

At the Maple Leaf Portal, the twin Earth Pressure Balance (EPB) bored tunnels transition through a heavy reinforced concrete headwall into an open, retained-cut u-wall structure before launching onto the aerial guideway [cite: 16, 17]. The surface footprint of the Maple Leaf Portal site includes high-voltage electrical conduit banks connecting the portal headwall to an adjacent Traction Power Substation, [removed: out of scope], and drainage retention sumps designed to capture stormwater runoff before it enters the portal descent [cite: 12, 17].

## Deep Tunnel Engineering and Surface Shaft Architecture: Beacon Hill Alignment

The Beacon Hill Tunnel and Station segment, constructed under Contract C710 by Obayashi Corporation for a base bid of $279.9 million and a total authorized allocation of $299.9 million, represents a notable soft-ground engineering achievement in the Sound Transit network [cite: 19, 20]. The project comprises approximately one mile of twin-bore light rail tunnels mined through glacial till using a custom 21-foot-diameter Mitsubishi EPB Tunnel Boring Machine [cite: 19, 20, 21].

The defining surface feature of the Beacon Hill alignment is the station headhouse and civic plaza located at 2702 Beacon Avenue South, at the southeast corner of Beacon Avenue South and South Lander Street [cite: 19]. Because the platform is situated 160 feet underground—making it the deepest station box in the Sound Transit system—conventional mezzanine escalators were engineeringly impractical [cite: 19, 22]. Instead, surface access is provided entirely through a prominent surface headhouse structure housing four high-speed, high-capacity passenger elevators capable of traversing the vertical depth in approximately 20 seconds [cite: 19, 22].

Vertical connectivity and life safety are maintained through a dual-shaft layout excavated during construction [cite: 19, 21, 22]:

- Main Access Shaft: A 180-foot-deep, tieback-reinforced structural shaft housing the primary passenger elevator hoistways, emergency egress stairwells, and main distribution conduits for mechanical and electrical systems [cite: 21, 22].
- Ancillary Egress and Ventilation Shafts: A secondary structural shaft system situated adjacent to the main headhouse that houses heavy-duty emergency ventilation fans, airflow plenum ducts, and isolated pressurization shafts designed to extract smoke from the deep binocular station adits during an emergency [cite: 19, 21, 22].

At either end of the one-mile bore, the light rail alignment transitions between underground tunnels and surface aerial structures via dedicated portal configurations [cite: 20]:

- West Portal: Located east of Airport Way South, where the tunnels emerge from the western flank of Beacon Hill beneath Interstate 5, launching directly onto an aerial guideway traversing the E-3 Busway toward SODO Station [cite: 19, 20].
- East Portal: Located near McClellan Street and Martin Luther King Jr. Way South, where the eastern portal headwall transitions the tracks onto a half-mile aerial guideway serving Mount Baker Station [cite: 20].

| Tunnel / Portal Segment | Surface Address or Boundary | Structural Type / Depth | Associated Surface Infrastructure | Prime Construction Contract |
|---|---|---|---|---|
| Beacon Hill Station Box | 2702 Beacon Ave S (at S Lander St) [cite: 19] | Deep Mined Binocular / 160 ft Deep [cite: 19, 22] | Headhouse, Civic Plaza, High-Speed Elevators [cite: 19, 22] | Contract C710 (Obayashi Corp) [cite: 20] |
| Beacon Hill Vent Shafts | Adjacent to Headhouse (2702 Beacon Ave S) [cite: 19] | Vertical Mined Shafts / 180 ft Depth [cite: 21, 22] | Surface Louvers, Smoke Extraction Plenums [cite: 22] | Contract C710 (Obayashi Corp) [cite: 20] |
| Beacon West Portal | East of Airport Way S (Under I-5) [cite: 20] | Retained-Cut Cut-and-Cover Portal | Transition to E-3 Busway Aerial Guideway [cite: 20] | Contract C710 (Obayashi Corp) [cite: 20] |
| Beacon East Portal | McClellan St & MLK Jr. Way S [cite: 20] | Reinforced Headwall Portal Ramp | Transition to MLK Jr. Way Aerial Guideway [cite: 20] | Contract C710 (Obayashi Corp) [cite: 20] |
| Maple Leaf Portal | 1st Ave NE & NE 92nd St (North of NE 65th) [cite: 12, 16] | Retained U-Wall Cut Portal | Transition to Northgate Aerial Guideway, TPSS Drop [cite: 16, 17] | Contract N160 [cite: 12, 16] |

## 2 Line Cross-Lake Integration: Mount Baker Ridge Tunnel and I-90 Lid Ventilation Systems

Integrating the 2 Line (East Link Extension) across Lake Washington into downtown Seattle required converting existing highway infrastructure along the Interstate 90 corridor into a dual-track light rail alignment [cite: 12, 23, 24]. The centerpiece of this segment is the historic Mount Baker Ridge Tunnel (MBRT), a 3,400-foot-long soft-earth bore complex originally designed and operated by the Washington State Department of Transportation (WSDOT) [cite: 24, 25, 26].

Under East Link Contract E130, Sound Transit repurposed the central express roadway of the MBRT—previously dedicated to reversible HOV bus operations—to house fixed-guideway light rail tracks [cite: 23, 24, 27, 28]. This conversion necessitated a complete redesign and overhaul of the tunnel's Fire and Life Safety (FLS) mechanical and electrical systems, authorized by Sound Transit Board Motion No. M2014-34 [cite: 24]. The FLS modification plan was executed in close coordination with WSDOT, the Seattle Fire Department (SFD), the Mercer Island Fire Department (MIFD), and the Federal Highway Administration (FHWA) [cite: 24].

Key surface structures, ventilation buildings, and mechanical retrofits across the MBRT and I-90 lid complex include:

- Mount Baker Ridge Ventilation Building: The portal ventilation building situated atop the western crest of Mount Baker Ridge houses heavy-duty transverse supply and exhaust fans [cite: 25, 26]. [removed: out of scope]
- [removed: out of scope]
- [removed: out of scope]
- Portal Alignment Interfaces: The tracks exit the western portal of the MBRT onto the D2 elevated guideway, bridging over I-5 to connect with the south portal of the DSTT near International District/Chinatown Station [cite: 23, 27, 33, 34]. To the east, the portal exits into a retained cut connecting directly to Judkins Park Station at Rainier Avenue South, before advancing onto the I-90 floating bridge approach [cite: 23, 29, 33].

## Safety Planning Mandates and Tunnel Ventilation Operational Events (August–September 2025)

The physical operation of deep-bore transit tunnels and subsurface ventilation plants is subject to regulatory oversight under federal rules (49 CFR Part 673), which require transit agencies to update and execute an Agency Safety Plan (ASP) anchored in Safety Management System (SMS) principles [cite: 10, 35]. In September 2025, Sound Transit formally issued Version 6.0 of its annual ASP (superseding the 2024 plan), following formal review by the Employee Safety Committee in August 2025 and adoption by the Sound Transit Board of Directors in September 2025 under executive authorization by Chief Executive Officer Dow Constantine [cite: 10, 35].

The necessity of maintaining fully redundant ventilation systems was underscored during operational disruptions in August and September 2025 [cite: 19, 36]. [removed: out of scope]

On August 6, 2025, a ventilation fan system anomaly occurred within the subterranean tunnel infrastructure, forcing a multi-hour closure of key underground operations to maintain fire code compliance [cite: 19, 36]. Operational parameters and mitigation actions executed during the August–September 2025 events included:

- Station Closures and Non-Stop Train Bypass: Initial mechanical failures led to temporary service suspensions across deep underground stations, including Beacon Hill, UW, Capitol Hill, and core DSTT stations [cite: 19, 36]. Once preliminary risk assessments were established under the agency's SMS protocols, operations resumed in a restricted mode—allowing trains to travel through the tunnel segments non-stop while bypassing closed underground platforms until full fan redundancy was verified by technician teams [cite: 19, 36].
- [removed: out of scope]
- Safety Management Action Plan: The operational disruptions directly informed safety risk evaluations incorporated into the 2025 ASP adopted in September 2025 [cite: 10, 35]. The updated ASP mandated enhanced preventive maintenance schedules for all surface vent facilities (including N00, MBRT, and Beacon Hill), [removed: out of scope] [cite: 10, 35].

| Incident Period | Primary Facility / Tunnel Zone | Mechanical / Safety Root Cause | Immediate Operational Response | Regulatory & Governance Outcome |
|---|---|---|---|---|
| August 6, 2025 | Beacon Hill Tunnel / Station Box | Ventilation fan mechanical/control fault [cite: 19, 36] | One-day station closure; non-stop train bypass restored in afternoon [cite: 19, 36] | Restored system compliance under Seattle Fire Code [cite: 19, 37] |
| Late August 2025 | [removed: out of scope] | | | |
| September 2025 | System-Wide Subsurface Assets | Safety Plan annual regulatory revision (SMS V6.0) [cite: 10, 35] | Formal adoption of updated risk mitigation strategies [cite: 10, 35] | Sound Transit Board Adoption of 2025 ASP [cite: 10, 35] |

## Infrastructure Integration Metrics

The following structured matrix synthesizes the primary civil, structural, and mechanical engineering metrics across all evaluated operational segments of Seattle's subterranean light rail network:

| Subsurface Network Segment | Primary Surface Portals & Access Points | Surface Address / Spatial Coordinates | Vertical & Horizontal Civil Dimensions | Fire/Life Safety Ventilation Infrastructure | Key Contracting & Legal Authority |
|---|---|---|---|---|---|
| Downtown Transit Tunnel (DSTT) & Pine Street Stub | Historic North Portal at Convention Place (Closed/Filled 2019) [cite: 3]; Active PSST under Pine St [cite: 2] | 9th Ave & Pine St (Former Station Envelope) [cite: 3]; Subsurface Pine St [cite: 2] | 730 ft cut-and-cover stub tunnel [cite: 2]; retrofitted 1.3-mile DSTT trunk [cite: 1, 2] | N00 Pine Street Ventilation Facility (System Zero-Datum) [cite: 2, 9]; Westlake fan plant upgrades [cite: 2, 11] | Contract C510 / Motion M2004-78 (Balfour Beatty) [cite: 2]; King County Subterranean Easement [cite: 7] |
| University Link & Northgate Link Extensions | Maple Leaf Portal (MLP) [cite: 16, 17]; Consolidation of U-Link vent footprint into station boxes [cite: 14] | 1st Ave NE north of NE 65th St (MLP site) [cite: 12, 16]; UW & Capitol Hill Station Boxes [cite: 5, 14] | 3.15-mile twin-bore (U-Link) [cite: 5, 13]; 4.3-mile twin-bore (Northgate Link) [cite: 12, 15] | Subsurface station vent plenums [cite: 14]; Maple Leaf Portal emergency stairwells & TPSS interface [cite: 17] | Contract N160 (Maple Leaf Portal & Guideway finishes) [cite: 12, 16]; FEIS Approval Records [cite: 4, 14] |
| Beacon Hill Tunnel & Deep Station | Station Headhouse Plaza [cite: 19]; West Portal (I-5) [cite: 20]; East Portal (McClellan St) [cite: 20] | 2702 Beacon Ave S (Headhouse/Plaza) [cite: 19]; Airport Way S / MLK Jr. Way S (Portals) [cite: 20] | 1-mile twin-bore tunnel [cite: 19, 20]; 160 ft deep station platform [cite: 19, 22]; 180 ft vertical shafts [cite: 21, 22] | Dual main/ancillary vertical shafts housing high-velocity vent fans and pressurization ducts [cite: 19, 21, 22] | Contract C710 / Motion M2004-59 (Obayashi Corp) [cite: 20] |
| Mount Baker Ridge Tunnel (2 Line Integration) | West Portal (D2 Structure) [cite: 23, 27]; MBRT Main Vent Building [cite: 25, 26]; East Portal (Judkins Park) [cite: 23, 29] | Mount Baker Ridge Crest (Vent Building) [cite: 25, 26]; Rainier Ave S & I-90 (East Portal) [cite: 23, 29] | 3,400 ft soft-earth tunnel bore complex [cite: 25, 26]; converted 2-track light rail alignment [cite: 23, 24] | Transverse supply/exhaust fans; [removed: out of scope] [cite: 6, 24, 29, 30] | Contract E130 [cite: 23, 28]; Motion M2014-34 FLS Redesign Plan [cite: 24]; WSDOT Interlocal Agreement [cite: 24, 25] |

## Pages from the result
- Annual Report on Funding Recommendations Fiscal Year 2008 - Federal Transit Administration (url): https://www.transit.dot.gov/sites/fta.dot.gov/files/docs/FY2008_Entire_NS_Report.pdf
- Motion No. M2004-78 Contract Award for Construction of the Pine Street Stub Tunnel and Retrofit Work for the Downtown Seattle Transit Tunnel (url): https://www.soundtransit.org/st_sharepoint/download/sites/PRDA/FinalRecords/2004/Motion%20M2004-78.pdf
- Ballard Link Community Forum - Seattle Transit Blog (url): https://seattletransitblog.com/2026-10-21/ballard-link-community-forum/
- Central-Link-FEIS-November-1999-03052025.pdf - Sound Transit (url): https://www.soundtransit.org/sites/default/files/documents/Central-Link-FEIS-November-1999-03052025.pdf
- Progress Report Link Light Rail Program - Sound Transit (url): https://www.soundtransit.org/sites/default/files/2017-q3-link-light-rail.pdf
- Progress Report Link Light Rail Program - Sound Transit (url): https://www.soundtransit.org/sites/default/files/2017-q4-link-light-rail.pdf
- Online Information Resources - CityClerk | seattle.gov (url): https://clerk.seattle.gov/search/results?s4=&l=200&Sect1=IMAGE&Sect2=THESON&Sect3=PLURON&Sect4=AND&Sect5=CBORY&Sect6=HITOFF&d=ORDF&p=1&u=%2Fsearch%2Fordinances&r=159&f=G&s7=%22kING-COUNTY%22%5BINDX%5D
- Progress Report Link Light Rail Program - Sound Transit (url): https://www.soundtransit.org/sites/default/files/documents/may-2019-link-progress-report.pdf
- Equipment and Facilities Numbering Standard - Sound Transit (url): https://www.soundtransit.org/sites/default/files/documents/st-equipment-and-facilities-numbering-standard-rev-4-august-2021.pdf
- AGENCY SAFETY PLAN - Sound Transit (url): https://www.soundtransit.org/st_sharepoint/download/sites/PRDA/FinalRecords/2026/Report%20-%202026%20Agency%20Safety%20Plan%20-%2009-03-26.pdf
- Second Downtown Tunnel Feasibility Assessment - Sound Transit (url): https://www.soundtransit.org/st_sharepoint/download/sites/PRDA/FinalRecords/2025/Report%20-%20Second%20Downtown%20Tunnel%20Feasibility%20Assessment%20-%2012-11-25.pdf?ref=theurbanist.org
- Progress Report Link Light Rail Program - Sound Transit (url): https://www.soundtransit.org/sites/default/files/2016-Q3-Link-Light-Rail.pdf
- University Link Light Rail Extension-Seattle-WA (url): https://www.transit.dot.gov/sites/fta.dot.gov/files/2021-11/University-Link-bna-study-2021.pdf
- Seattle North Link Light Rail Record of Decision from Federal Transit Administration (url): https://bettertransport.info/pitf/NorthLinkROD.htm
- Progress Report Link Light Rail Program - Sound Transit (url): https://www.soundtransit.org/sites/default/files/2015-Q4_Link%20Light%20Rail.pdf
- Progress Report Link Light Rail Program - Sound Transit (url): https://www.soundtransit.org/sites/default/files/may-2017-link-progress-report.pdf
- Progress Report Link Light Rail Program - Sound Transit (url): https://www.soundtransit.org/sites/default/files/documents/november-2019-link-progress-report.pdf
- Progress Report Link Light Rail Program - Sound Transit (url): https://www.soundtransit.org/sites/default/files/april-2017-link-progress-report.pdf
- Beacon Hill station (Sound Transit) - Wikipedia (url): https://en.wikipedia.org/wiki/Beacon_Hill_station_(Sound_Transit)
- Sound Transit - Motion No. M2004-59 Contract Award for Link Construction of the Beacon Hill Tunnel Contract (C710) (url): https://www.soundtransit.org/st_sharepoint/download/sites/PRDA/FinalRecords/2004/Motion%20M2004-59.pdf
- 2006 02 01 - Letto | PDF | Tunnel | Civil Engineering - Scribd (url): https://www.scribd.com/document/120098294/2006-02-01-letto
- Twin tunnels and a new station help get Seattle to the airport | Mott MacDonald (url): https://www.mottmac.com/en-us/projects/beacon-hill-station-and-tunnels/
- System Expansion Monthly Status Report: December 2024 - Sound Transit (url): https://www.soundtransit.org/sites/default/files/documents/system-expansion-monthly-status-report-dec2024.pdf
- MOTION NO. M2014-34 Amendment to the Task Order Agreement for Final Design Services for the I-90 Two-Way Transit and HOV Operations, Stage 3 Project (url): https://www.soundtransit.org/st_sharepoint/download/sites/PRDA/FinalRecords/2014/Motion%20M2014-34.pdf
- Best Practices For Roadway Tunnel Design, Construction, Maintenance, Inspection, And Operations - Transportation Research Board (TRB) (url): https://onlinepubs.trb.org/onlinepubs/nchrp/docs/nchrp20-68a_09-05.pdf
- Design for Tunnel Safety: 1-90 Tunnels, Seattle - Civil Engineering Practice Journal (url): https://www.bscesjournal.org/wp-content/uploads/CEP-Vol-8-No-2-05.pdf
- System Expansion Monthly Status Report July 2025 - Sound Transit (url): https://www.soundtransit.org/sites/default/files/documents/System-Expansion-Monthly%20Status-Report-July-2025.pdf
- System Expansion Monthly Status Report: June 2025 - Sound Transit (url): https://www.soundtransit.org/sites/default/files/documents/System-Expansion-Monthly-Status-Report-June-2025.pdf
- Progress Report Link Light Rail Program - Sound Transit (url): https://www.soundtransit.org/sites/default/files/october-2016-link-progress-report.pdf
- Progress Report Link Light Rail Program - Sound Transit (url): https://www.soundtransit.org/sites/default/files/2017-q1-link-light-rail.pdf
- Progress Report Link Light Rail Program - Sound Transit (url): https://www.soundtransit.org/sites/default/files/October_2017_Link_Progress_Report-FINAL.pdf
- Progress Report Link Light Rail Program - Sound Transit (url): https://www.soundtransit.org/sites/default/files/documents/january-2019-link-progress-report.pdf
- Agency Progress Report, Capital Program - August 2023 - Sound Transit (url): https://www.soundtransit.org/sites/default/files/documents/agency-progress-report-capital-program-august-2023.pdf
- System Expansion Monthly Status Report April 2025 - Sound Transit (url): https://www.soundtransit.org/sites/default/files/documents/System-Expansion-Monthly-Status-Report-April2025.pdf
- Agency Safety Plan - Sound Transit (url): https://www.soundtransit.org/st_sharepoint/download/sites/PRDA/FinalRecords/2025/Report%20-%202025%20Agency%20Safety%20Plan%20-%2009-04-25.pdf
- Light rail service down from Stadium - U District : r/Seattle - Reddit (url): https://www.reddit.com/r/Seattle/comments/1nmbtpu/light_rail_service_down_from_stadium_u_district/
- WSHFC Board Meeting Packet - Revised -10/23/2025 - Washington State Housing Finance Commission (url): https://wshfc.org/sites/default/files/2026-05/20251023Packet.pdf
