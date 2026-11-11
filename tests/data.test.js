const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const data = JSON.parse(fs.readFileSync('data/egress.geojson'));
test('seed is a feature collection of points or unmapped records', () => {assert.equal(data.type,'FeatureCollection'); assert.ok(data.features.length>=13); assert.ok(data.features.every(f=>f.geometry===null||f.geometry.type==='Point'));});
test('points have unique ids and required properties', () => {const ids=new Set(); for(const f of data.features){for(const k of ['id','name','type','tunnel','owner','public_location','visible_from_street','precision','confidence','source_title','source_url','verified','notes']) assert.ok(k in f.properties,k); assert.equal(f.id,f.properties.id); assert.ok(!ids.has(f.id)); ids.add(f.id);}});
test('coordinates and dates are bounded', () => {for(const f of data.features){assert.match(f.properties.verified,/^\d{4}-\d{2}-\d{2}$/); if(!f.geometry) continue; const [x,y]=f.geometry.coordinates; assert.ok(x>=-180&&x<=180&&y>=-90&&y<=90); assert.ok(Math.abs(x*10000-Math.round(x*10000))<1e-7); assert.ok(Math.abs(y*10000-Math.round(y*10000))<1e-7); assert.match(f.properties.verified,/^\d{4}-\d{2}-\d{2}$/);}});
test('types and confidence are known', () => {for(const {properties:p} of data.features){assert.ok(['portal','vent_facility','station_egress','station_shaft','station_portal'].includes(p.type));assert.ok(['high','medium','low'].includes(p.confidence));}});
