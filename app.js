'use strict';
(() => {
  const key = 'sea-tunnel-atlas:v1';
  const defaults = {version: 1, acknowledged: false, showLower: true, rememberView: false, view: null};
  let state;
  try { state = {...defaults, ...JSON.parse(localStorage.getItem(key) || '{}')}; } catch { state = {...defaults}; }
  if (state.version !== 1) state = {...defaults};
  const save = () => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} };
  const map = L.map('map', {zoomControl: false}).setView([47.625, -122.325], 11);
  if (state.rememberView && Array.isArray(state.view) && state.view.length === 3 && state.view.every(Number.isFinite)) map.setView(state.view.slice(0, 2), state.view[2]);
  L.control.zoom({position: 'bottomright'}).addTo(map);
  const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'});
  const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {maxZoom:19, attribution:'Tiles &copy; Esri &mdash; Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community'});
  const eox = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2023_3857/default/g/{z}/{y}/{x}.jpg', {maxZoom:18, attribution:'Sentinel-2 cloudless &copy; <a href="https://eox.at/">EOX IT Services GmbH</a>, contains modified Copernicus Sentinel data 2023, <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>'});
  const labels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'});
  street.addTo(map);
  const points = L.layerGroup().addTo(map);
  const layers = L.control.layers({'OpenStreetMap':street, 'Esri imagery':esri, 'EOX Sentinel-2 cloudless':eox}, {'Labels':labels, 'Surface infrastructure':points}, {collapsed:false}).addTo(map);
  // Feed outputs are optional until generated on a machine able to reach the agencies.
  const rail=L.layerGroup(), bus=L.layerGroup();
  function loadFeed(paths, group, isBus) {
    Promise.all(paths.map(path=>fetch(path).then(r=>{if(!r.ok) throw Error(path);return r.json();}))).then(([lines,stops])=>{
      L.geoJSON(lines,{style:f=>({color:/^[0-9a-fA-F]{6}$/.test(f.properties.color)?'#'+f.properties.color:'#526b60',weight:isBus?2:4,opacity:.75})}).addTo(group);
      const stopLayer=L.geoJSON(stops,{pointToLayer:(f,latlng)=>L.circleMarker(latlng,{radius:isBus?3:5,color:'#203b30',weight:1,fillColor:'#fff',fillOpacity:1}),onEachFeature:(f,l)=>l.bindTooltip(text('span',String(f.properties.name || 'Stop')))});
      function showStops(){if(!isBus || map.getZoom()>=15) group.addLayer(stopLayer); else group.removeLayer(stopLayer);}
      map.on('zoomend',showStops); showStops();
      layers.addOverlay(group,isBus?'Metro bus (stops at zoom 15+)':'Link light rail'); if(!isBus) group.addTo(map);
    }).catch(()=>{});
  }
  loadFeed(['data/link-lines.geojson','data/link-stations.geojson'],rail,false);
  loadFeed(['data/bus-routes.geojson','data/bus-stops.geojson'],bus,true);
  const places=L.layerGroup(), poiCache=new Map(); let poiTimer, poiAbort;
  const categories={food:'[\"amenity\"~\"^(restaurant|cafe|fast_food|food_court)$\"]',shops:'[\"shop\"]',transit:'[\"amenity\"~\"^(bicycle_parking|parking|bus_station)$\"]',restrooms:'[\"amenity\"=\"toilets\"]'};
  const placeControl=L.control({position:'topright'});
  placeControl.onAdd=()=>{const box=L.DomUtil.create('div','poi-control leaflet-bar');box.append(text('strong','Places at zoom 15+'));for(const name of Object.keys(categories)){const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.value=name;input.addEventListener('change',schedulePlaces);label.append(input,document.createTextNode(' '+name));box.append(label);}L.DomEvent.disableClickPropagation(box);L.DomEvent.disableScrollPropagation(box);return box;};
  placeControl.addTo(map);
  function schedulePlaces(){clearTimeout(poiTimer);if(poiAbort)poiAbort.abort();places.clearLayers();if(!map.hasLayer(places))return;const chosen=[...document.querySelectorAll('.poi-control input:checked')].map(e=>e.value);if(map.getZoom()<15 || !chosen.length)return;poiTimer=setTimeout(()=>fetchPlaces(chosen),1000);}
  async function fetchPlaces(chosen){const b=map.getBounds(), bbox=[b.getSouth(),b.getWest(),b.getNorth(),b.getEast()].map(n=>n.toFixed(4)).join(',');const key=chosen.join(',')+bbox;let features=poiCache.get(key);try{if(!features){const query='[out:json][timeout:15];('+chosen.map(c=>'nwr'+categories[c]+'('+bbox+');').join('')+');out center 250;';poiAbort=new AbortController();const response=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:new URLSearchParams({data:query}),signal:poiAbort.signal});if(!response.ok)throw Error(response.status);features=(await response.json()).elements;poiCache.set(key,features);if(poiCache.size>20)poiCache.delete(poiCache.keys().next().value);}for(const p of features){const lat=p.lat ?? p.center?.lat,lon=p.lon ?? p.center?.lon;if(!Number.isFinite(lat)||!Number.isFinite(lon))continue;const el=document.createElement('div');el.append(text('strong',p.tags?.name || 'Unnamed place'));el.append(text('p',p.tags?.amenity || p.tags?.shop || 'Place'));L.circleMarker([lat,lon],{radius:4,color:'#694c29',weight:1,fillColor:'#e5b758',fillOpacity:.9}).bindPopup(el).addTo(places);}}catch(e){if(e.name!=='AbortError')document.querySelector('#status').textContent='Places unavailable; try again later';}}
  layers.addOverlay(places,'Places (OpenStreetMap)'); map.on('moveend overlayadd overlayremove',schedulePlaces);
  const colors = {portal:'#176d4e',vent_facility:'#b17823',station_egress:'#637e73',station_shaft:'#775c42',station_portal:'#335e62'};
  let features = [];
  function text(tag, value) { const e = document.createElement(tag); e.textContent = value; return e; }
  function render() {
    points.clearLayers();
    features.filter(f => state.showLower || f.properties.confidence === 'high').forEach(f => {
      const p = f.properties, el = document.createElement('div');
      el.append(text('h3',p.name));
      for (const [label,value] of [['Type',p.type.replaceAll('_',' ')],['Public location',p.public_location],['Confidence',p.confidence],['Verified',p.verified]]) el.append(text('p',`${label}: ${value}`));
      const link = document.createElement('a'); link.textContent = p.source_title; try { const url = new URL(p.source_url); if (['http:','https:'].includes(url.protocol)) {link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer';} } catch {} el.append(link);
      const warning = text('p','Public sources only; no SSI. For education and civic interest. Entering tunnels, shafts or trackways is illegal and can kill you.'); warning.className='popup-warning'; el.append(warning);
      const marker=L.circleMarker([f.geometry.coordinates[1],f.geometry.coordinates[0]],{radius:7,color:'#f6f6ee',weight:2,fillColor:colors[p.type] || '#176d4e',fillOpacity:.95,dashArray:p.confidence === 'high' ? null : '3 3'}).bindPopup(el).addTo(points);
      const path=marker.getElement(); if(path){path.setAttribute('tabindex','0');path.setAttribute('role','button');path.setAttribute('aria-label',p.name);path.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();marker.openPopup();}});}
    });
  }
  fetch('data/egress.geojson').then(r => {if(!r.ok) throw Error(r.status); return r.json();}).then(data => {features=data.features; render(); document.querySelector('#status').textContent=`${features.length} surface records loaded`;}).catch(() => {document.querySelector('#status').textContent='Could not load records. Serve this site over HTTP and check the data file.';});
  const notice=document.querySelector('#notice'); if (!state.acknowledged) notice.showModal(); notice.addEventListener('close',()=>{if(notice.returnValue==='acknowledge'){state.acknowledged=true;save();} else notice.showModal();});
  const settings=document.querySelector('#settings'); document.querySelector('#settings-open').addEventListener('click',()=>settings.showModal());
  const medium=document.querySelector('#medium'), remember=document.querySelector('#remember'); medium.checked=state.showLower; remember.checked=state.rememberView;
  medium.addEventListener('change',()=>{state.showLower=medium.checked;save();render();}); remember.addEventListener('change',()=>{state.rememberView=remember.checked; if(!remember.checked) state.view=null; save();});
  document.querySelector('#export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sea-tunnel-atlas-settings.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
  document.querySelector('#import').addEventListener('change',async e=>{try {const file=e.target.files[0];if(!file || file.size>10000) throw Error();const data=JSON.parse(await file.text());if(data.version!==1 || typeof data.showLower!=='boolean' || typeof data.rememberView!=='boolean' || typeof data.acknowledged!=='boolean' || !(data.view===null || (Array.isArray(data.view)&&data.view.length===3&&data.view.every(Number.isFinite)&&Math.abs(data.view[0])<=90&&Math.abs(data.view[1])<=180&&data.view[2]>=0&&data.view[2]<=19))) throw Error();state={version:1,acknowledged:state.acknowledged,showLower:data.showLower,rememberView:data.rememberView,view:data.view};medium.checked=state.showLower;remember.checked=state.rememberView;save();render();if(state.rememberView&&state.view)map.setView(state.view.slice(0,2),state.view[2]);document.querySelector('#settings-status').textContent='Settings imported';} catch {document.querySelector('#settings-status').textContent='Invalid settings file';}e.target.value='';});
  map.on('moveend',()=>{if(state.rememberView){const c=map.getCenter();state.view=[c.lat,c.lng,map.getZoom()];save();}});
})();
