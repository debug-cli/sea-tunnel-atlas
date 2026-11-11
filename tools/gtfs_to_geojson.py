#!/usr/bin/env python3
"""Convert public GTFS feeds to compact GeoJSON. Requires network access to the feed hosts."""
import csv
import datetime
import io
import json
import pathlib
import urllib.request
import zipfile
from collections import defaultdict

ROOT = pathlib.Path(__file__).resolve().parent.parent
FEEDS = {'link': 'https://www.soundtransit.org/GTFS-rail/40_gtfs.zip',
         'bus': 'https://metro.kingcounty.gov/GTFS/google_transit.zip'}

def rows(z, name, optional=False):
    try:
        return list(csv.DictReader(io.TextIOWrapper(z.open(name), encoding='utf-8-sig', newline='')))
    except KeyError:
        if optional:
            return []
        raise

def simplify(points, tolerance=0.00015):
    """Iterative Douglas-Peucker in degrees, adequate for display, not surveying."""
    if len(points) < 3:
        return points
    keep = {0, len(points)-1}
    stack = [(0, len(points)-1)]
    while stack:
        a, b = stack.pop()
        x1, y1 = points[a]; x2, y2 = points[b]
        dx, dy = x2-x1, y2-y1
        denom = dx*dx + dy*dy
        best, index = tolerance*tolerance, None
        for i in range(a+1, b):
            x, y = points[i]
            t = max(0, min(1, ((x-x1)*dx+(y-y1)*dy)/denom)) if denom else 0
            d = (x-x1-t*dx)**2 + (y-y1-t*dy)**2
            if d > best:
                best, index = d, i
        if index is not None:
            keep.add(index); stack.extend(((a,index),(index,b)))
    return [points[i] for i in sorted(keep)]

def convert(z, feed, url, date):
    routes = {r['route_id']: r for r in rows(z, 'routes.txt') if feed != 'link' or r.get('route_type') == '0'}
    trips = [t for t in rows(z, 'trips.txt') if t['route_id'] in routes]
    # A shape may be used by more than one route.
    shape_routes = defaultdict(set)
    trip_ids = set()
    for t in trips:
        trip_ids.add(t['trip_id'])
        if t.get('shape_id'): shape_routes[t['shape_id']].add(t['route_id'])
    shapes = defaultdict(list)
    for s in rows(z, 'shapes.txt'):
        if s['shape_id'] in shape_routes:
            shapes[s['shape_id']].append((int(s['shape_pt_sequence']), [round(float(s['shape_pt_lon']), 5),round(float(s['shape_pt_lat']),5)]))
    lines = []
    for sid, seq in shapes.items():
        coords = simplify([p for _, p in sorted(seq)])
        if len(coords) < 2: continue
        for rid in sorted(shape_routes[sid]):
            r = routes[rid]
            lines.append({'type':'Feature','geometry':{'type':'LineString','coordinates':coords},'properties':{'route_id':rid,'name':r.get('route_short_name') or r.get('route_long_name',''),'color':r.get('route_color',''),'shape_id':sid}})
    used_stops = {s['stop_id'] for s in rows(z, 'stop_times.txt') if s['trip_id'] in trip_ids}
    stops = []
    for s in rows(z, 'stops.txt'):
        if s['stop_id'] not in used_stops or not s.get('stop_lat') or not s.get('stop_lon'): continue
        stops.append({'type':'Feature','geometry':{'type':'Point','coordinates':[round(float(s['stop_lon']),5),round(float(s['stop_lat']),5)]},'properties':{'id':s['stop_id'],'name':s.get('stop_name','')}})
    info = rows(z, 'feed_info.txt', optional=True)
    metadata = {'source':url,'downloaded':date,'feed_version':info[0].get('feed_version','unknown') if info else 'unknown'}
    return tuple({'type':'FeatureCollection','metadata':metadata,'features':features} for features in (lines,stops))

def main():
    date = datetime.date.today().isoformat()
    for feed, url in FEEDS.items():
        print('Downloading', url, flush=True)
        with urllib.request.urlopen(url, timeout=120) as response:
            raw = response.read()
        with zipfile.ZipFile(io.BytesIO(raw)) as z:
            lines, stops = convert(z, feed, url, date)
        for suffix, data in zip(('lines','stations') if feed == 'link' else ('routes','stops'),(lines,stops)):
            path = ROOT/'data'/f'{feed}-{suffix}.geojson'
            path.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
            print(path, len(data['features']))
if __name__ == '__main__': main()
