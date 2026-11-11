const {test} = require('node:test');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
test('converter joins rail routes, shapes, trips and served stops', () => {
  const code = `
import io, zipfile
from tools.gtfs_to_geojson import convert
files = {
'routes.txt': 'route_id,route_type,route_short_name,route_color\\nr,0,1 Line,112233\\nb,3,Bus,445566\\n',
 'trips.txt':'route_id,trip_id,shape_id\\nr,t,s\\nb,u,z\\n',
 'shapes.txt':'shape_id,shape_pt_sequence,shape_pt_lon,shape_pt_lat\\ns,2,-122.2,47.2\\ns,1,-122.1,47.1\\nz,1,-122,47\\n',
 'stop_times.txt':'trip_id,stop_id\\nt,a\\nu,b\\n',
 'stops.txt':'stop_id,stop_name,stop_lon,stop_lat\\na,Alpha,-122.1,47.1\\nb,Beta,-122.2,47.2\\n',
 'feed_info.txt':'feed_version\\nv1\\n'}
buf=io.BytesIO()
with zipfile.ZipFile(buf,'w') as z:
 for name,contents in files.items(): z.writestr(name,contents)
buf.seek(0)
with zipfile.ZipFile(buf) as z: lines,stops=convert(z,'link','https://example.org/feed.zip','2026-11-11')
assert len(lines['features'])==1 and lines['features'][0]['properties']['color']=='112233'
assert lines['features'][0]['geometry']['coordinates'][0]==[-122.1,47.1]
assert len(stops['features'])==1 and stops['features'][0]['properties']['name']=='Alpha'
assert lines['metadata']['feed_version']=='v1'
`;
  const result = spawnSync('python3', ['-c', code], {encoding:'utf8'});
  assert.equal(result.status, 0, result.stderr);
});
