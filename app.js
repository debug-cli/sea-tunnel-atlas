'use strict';
(() => {
  const $ = selector => document.querySelector(selector);

  // Debug instrumentation for 3D view troubleshooting.
  // Logs every step of the button→3D flow so failures are visible in DevTools.
  window.addEventListener('error', (e) => {
    console.error('[sea-tunnel-atlas] Unhandled error:', e.message, 'at', e.filename + ':' + e.lineno);
  });
  window.addEventListener('unhandledrejection', (e) => {
    console.error('[sea-tunnel-atlas] Unhandled promise rejection:', String(e.reason));
  });

  /* ---------- Saved settings ---------- */

  const key = 'sea-tunnel-atlas:v1';
  const defaults = {version: 1, acknowledged: false, showLower: true, rememberView: false, view: null};
  let state;
  try { state = {...defaults, ...JSON.parse(localStorage.getItem(key) || '{}')}; } catch { state = {...defaults}; }
  if (state.version !== 1) state = {...defaults};
  const save = () => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} };

  /* ---------- Environment ---------- */

  // Below 760px the sidebar is a bottom sheet. "Compact" also covers touch
  // screens and short windows, where the map controls start collapsed.
  const mobile = window.matchMedia('(max-width: 759.98px)');
  const compact = window.matchMedia('(max-width: 759.98px), (pointer: coarse), (max-height: 719.98px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animate = () => !reducedMotion.matches;

  /* ---------- DOM helpers (text only, never innerHTML) ---------- */

  function text(tag, value) {
    const e = document.createElement(tag);
    e.textContent = value;
    return e;
  }

  function data(value) {
    const e = text('span', String(value));
    e.className = 'data';
    return e;
  }

  function sentence(value) {
    const s = String(value ?? '').replaceAll('_', ' ');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // The link only gets an href when the URL is plain http or https.
  function sourceLink(p) {
    const link = text('a', p.source_title || 'Source');
    try {
      const url = new URL(p.source_url);
      if (['http:', 'https:'].includes(url.protocol)) {
        link.href = url.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    } catch {}
    return link;
  }

  const status = $('#status');
  function setStatus(state, ...parts) {
    status.dataset.state = state;
    status.replaceChildren(...parts);
  }

  // Map colors come from the Astryx tokens in style.css, not from literals
  // in this file. The probe resolves var() chains and light-dark() against
  // the current theme; magenta is the sentinel for "token missing".
  const SENTINEL = 'rgb(255, 0, 255)';
  function tokenColor(name, fallback) {
    const probe = document.createElement('span');
    probe.style.color = `var(${name}, ${SENTINEL})`;
    document.body.append(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return !value || value === SENTINEL ? fallback : value;
  }
  const mapInk = () => tokenColor('--map-ui-ink', '#000000');
  const mapSurface = () => tokenColor('--map-ui-bg', '#ffffff');

  /* ---------- Map ---------- */

  const map = L.map('map', {
    zoomControl: false,
    zoomAnimation: animate(),
    fadeAnimation: animate(),
    markerZoomAnimation: animate(),
    inertia: animate()
  }).setView([47.625, -122.325], 11);
  if (state.rememberView && Array.isArray(state.view) && state.view.length === 3 && state.view.every(Number.isFinite)) {
    map.setView(state.view.slice(0, 2), state.view[2]);
  }
  // Compact screens keep every control along the top edge, clear of the
  // bottom bar; roomy screens keep zoom in the bottom right corner.
  const zoom = L.control.zoom({position: compact.matches ? 'topleft' : 'bottomright'}).addTo(map);
  map.getContainer().classList.toggle('is-compact', compact.matches);

  const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'});
  const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {maxZoom: 19, attribution: 'Tiles &copy; Esri &mdash; Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community'});
  const eox = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2023_3857/default/g/{z}/{y}/{x}.jpg', {maxZoom: 18, attribution: 'Sentinel-2 cloudless &copy; <a href="https://eox.at/">EOX IT Services GmbH</a>, contains modified Copernicus Sentinel data 2023, <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>'});
  const labels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'});
  street.addTo(map);
  const points = L.layerGroup().addTo(map);

  // The layer list is open on roomy screens and a 44px button on compact ones.
  // Leaflet only wires the open/close handlers when the control is created
  // collapsed, so create it that way and refuse to collapse on roomy screens.
  const layers = L.control.layers(
    {'OpenStreetMap': street, 'Esri imagery': esri, 'EOX Sentinel-2 cloudless': eox},
    {'Labels': labels, 'Surface infrastructure': points},
    {collapsed: true}
  );
  layers.collapse = function () {
    return compact.matches ? L.Control.Layers.prototype.collapse.call(this) : this;
  };
  layers.addTo(map);
  if (!compact.matches) layers.expand();

  // The bottom bar can change height when its text wraps; keep Leaflet in sync.
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => map.invalidateSize({pan: false})).observe($('#map'));
  }

  // Size every popup to the map so it never runs off a small screen, and
  // pan it clear of the controls: the top row on compact screens, the open
  // layer list on roomy ones. 34px is the popup's own margin and border;
  // 56px adds its tip.
  map.on('popupopen', e => {
    const size = map.getSize(), options = e.popup.options;
    const topPad = compact.matches && size.y >= 260 ? 64 : 16;
    const maxWidth = Math.max(160, Math.min(320, size.x - 32 - 34));
    const maxHeight = Math.max(96, size.y - topPad - 16 - 56);
    const controlsWidth = Math.max(layers.getContainer().offsetWidth, placeBox.offsetWidth) + 26;
    const rightPad = !compact.matches && size.x - controlsWidth - 16 >= maxWidth + 34 ? controlsWidth : 16;
    const pads = options.autoPanPaddingTopLeft, padsEnd = options.autoPanPaddingBottomRight;
    if (options.maxWidth === maxWidth && options.maxHeight === maxHeight && pads?.y === topPad && padsEnd?.x === rightPad) return;
    options.maxWidth = maxWidth;
    options.maxHeight = maxHeight;
    options.autoPanPaddingTopLeft = L.point(16, topPad);
    options.autoPanPaddingBottomRight = L.point(rightPad, 16);
    e.popup.update();
  });

  // Leaflet only closes popups on Esc while the map itself has focus, which
  // misses focus on a marker or inside the popup. Close them from anywhere.
  let openPopup = null;
  map.on('popupopen', e => { openPopup = e.popup; });
  map.on('popupclose', e => { if (openPopup === e.popup) openPopup = null; });

  /* ---------- Transit feeds ---------- */

  // 1 Line and 2 Line take the Astryx categorical data colors through the
  // --line-1 / --line-2 aliases; other routes keep their GTFS color.
  const lineColors = {'1 Line': tokenColor('--line-1', '#08a3a3'), '2 Line': tokenColor('--line-2', '#0171e3')};
  const lineClasses = {'1 Line': 'line-1', '2 Line': 'line-2'};
  const feedColor = p => lineColors[p.name] || (/^[0-9a-fA-F]{6}$/.test(p.color) ? '#' + p.color : tokenColor('--muted', '#6a6a6a'));

  function showLineLegend(lines) {
    const list = $('#line-list'), seen = new Set();
    list.replaceChildren();
    for (const f of lines.features || []) {
      const p = f.properties || {};
      if (!p.name || seen.has(p.name)) continue;
      seen.add(p.name);
      const item = document.createElement('li'), swatch = document.createElement('span');
      swatch.className = 'line-swatch ' + (lineClasses[p.name] || '');
      if (!lineClasses[p.name]) swatch.style.backgroundColor = feedColor(p);
      swatch.setAttribute('aria-hidden', 'true');
      item.append(swatch, document.createTextNode(p.name));
      list.append(item);
    }
    $('#lines').hidden = !seen.size;
  }

  const rail = L.layerGroup(), bus = L.layerGroup();
  function loadFeed(paths, group, isBus) {
    Promise.all(paths.map(path => fetch(path).then(r => { if (!r.ok) throw Error(path); return r.json(); }))).then(([lines, stops]) => {
      L.geoJSON(lines, {
        style: f => ({color: feedColor(f.properties), weight: isBus ? 2 : 4, opacity: isBus ? .75 : .9}),
        onEachFeature: (f, l) => {
          if (f.properties.name) l.bindTooltip(text('span', (isBus ? 'Bus route ' : '') + f.properties.name), {sticky: true});
        }
      }).addTo(group);
      const stopLayer = L.geoJSON(stops, {
        pointToLayer: (f, latlng) => L.circleMarker(latlng, {radius: isBus ? 3 : 5, color: mapInk(), weight: 1, fillColor: mapSurface(), fillOpacity: 1}),
        onEachFeature: (f, l) => l.bindTooltip(text('span', String(f.properties.name || 'Stop')))
      });
      function showStops() { if (!isBus || map.getZoom() >= 15) group.addLayer(stopLayer); else group.removeLayer(stopLayer); }
      map.on('zoomend', showStops);
      showStops();
      layers.addOverlay(group, isBus ? 'Metro bus (stops at zoom 15+)' : 'Link light rail');
      if (!isBus) { group.addTo(map); showLineLegend(lines); }
    }).catch(() => {
      // The feeds ship in data/. Only mention them when one fails to load.
      $('#feed-note').hidden = false;
    });
  }
  loadFeed(['data/link-lines.geojson', 'data/link-stations.geojson'], rail, false);
  loadFeed(['data/bus-routes.geojson', 'data/bus-stops.geojson'], bus, true);

  /* ---------- Places (OpenStreetMap, on request) ---------- */

  const places = L.layerGroup(), poiCache = new Map();
  let poiTimer, poiAbort;
  const categories = {food: '[\"amenity\"~\"^(restaurant|cafe|fast_food|food_court)$\"]', shops: '[\"shop\"]', transit: '[\"amenity\"~\"^(bicycle_parking|parking|bus_station)$\"]', restrooms: '[\"amenity\"=\"toilets\"]'};

  const placeBox = L.DomUtil.create('div', 'poi-control leaflet-bar');
  const placeToggle = text('button', 'Places');
  const placeOptions = document.createElement('div');
  placeToggle.type = 'button';
  placeToggle.className = 'poi-toggle';
  placeToggle.setAttribute('aria-controls', 'poi-options');
  placeOptions.id = 'poi-options';
  placeOptions.className = 'poi-options';
  placeOptions.append(text('p', 'Shown at zoom 15 and closer'));
  for (const name of Object.keys(categories)) {
    const label = document.createElement('label'), input = document.createElement('input');
    input.type = 'checkbox';
    input.value = name;
    input.addEventListener('change', schedulePlaces);
    label.append(input, document.createTextNode(sentence(name)));
    placeOptions.append(label);
  }
  placeBox.append(placeToggle, placeOptions);
  function setPlacesOpen(open) {
    placeOptions.hidden = !open;
    placeToggle.setAttribute('aria-expanded', String(open));
    if (open && compact.matches) layers.collapse();
  }
  placeToggle.addEventListener('click', () => setPlacesOpen(placeOptions.hidden));
  setPlacesOpen(!compact.matches);
  L.DomEvent.disableClickPropagation(placeBox);
  L.DomEvent.disableScrollPropagation(placeBox);
  const placeControl = L.control({position: 'topright'});
  placeControl.onAdd = () => placeBox;
  placeControl.addTo(map);

  function schedulePlaces() {
    clearTimeout(poiTimer);
    if (poiAbort) poiAbort.abort();
    places.clearLayers();
    if (!map.hasLayer(places)) return;
    const chosen = [...document.querySelectorAll('.poi-control input:checked')].map(e => e.value);
    if (map.getZoom() < 15 || !chosen.length) return;
    poiTimer = setTimeout(() => fetchPlaces(chosen), 1000);
  }

  async function fetchPlaces(chosen) {
    const b = map.getBounds(), bbox = [b.getSouth(), b.getWest(), b.getNorth(), b.getEast()].map(n => n.toFixed(4)).join(',');
    const cacheKey = chosen.join(',') + bbox;
    let features = poiCache.get(cacheKey);
    try {
      if (!features) {
        const query = '[out:json][timeout:15];(' + chosen.map(c => 'nwr' + categories[c] + '(' + bbox + ');').join('') + ');out center 250;';
        poiAbort = new AbortController();
        const response = await fetch('https://overpass-api.de/api/interpreter', {method: 'POST', body: new URLSearchParams({data: query}), signal: poiAbort.signal});
        if (!response.ok) throw Error(response.status);
        features = (await response.json()).elements;
        poiCache.set(cacheKey, features);
        if (poiCache.size > 20) poiCache.delete(poiCache.keys().next().value);
      }
      for (const p of features) {
        const lat = p.lat ?? p.center?.lat, lon = p.lon ?? p.center?.lon;
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
        const el = document.createElement('div');
        el.className = 'record-popup';
        el.append(text('h3', p.tags?.name || 'Unnamed place'));
        el.append(text('p', sentence(p.tags?.amenity || p.tags?.shop || 'Place')));
        L.circleMarker([lat, lon], {radius: 6, color: tokenColor('--place-stroke', '#a13f04'), weight: 1, fillColor: tokenColor('--place-fill', '#fcec85'), fillOpacity: .9}).bindPopup(el).addTo(places);
      }
    } catch (e) {
      if (e.name !== 'AbortError') setStatus('error', 'Places unavailable; try again later');
    }
  }
  layers.addOverlay(places, 'Places (OpenStreetMap)');
  map.on('moveend overlayadd overlayremove', schedulePlaces);

  /* ---------- Surface records ---------- */

  // Type is carried by shape and by the popup text, never by colour.
  const SVG = 'http://www.w3.org/2000/svg';
  const shapes = {
    portal: ['rect', {x: 4, y: 4, width: 12, height: 12}],
    vent_facility: ['path', {d: 'M10 3 17.5 16H2.5Z'}],
    station_egress: ['circle', {cx: 10, cy: 10, r: 6.5}],
    station_shaft: ['path', {d: 'M10 2.5 17.5 10 10 17.5 2.5 10Z'}]
  };

  // Leaflet's divIcon `html` option takes a string, not a DOM node. Return an
  // HTML string so the SVG is parsed by the browser. Inline style sets
  // fill/stroke from CSS variables so icons render correctly even if CSS
  // inheritance doesn't reach the child SVG elements (e.g. inside divIcon).
  function shapeIcon(type, dashed) {
    const [tag, attrs] = shapes[type] || shapes.station_egress;
    let attrStr = '';
    for (const [name, value] of Object.entries(attrs)) {
      attrStr += ` ${name}="${value}"`;
    }
    const cls = dashed ? 'shape is-dashed' : 'shape';
    const style = dashed
      ? 'fill: var(--marker-casing); stroke: var(--marker-fill); stroke-width: 2; stroke-linejoin: round; paint-order: normal;'
      : 'fill: var(--marker-fill); stroke: var(--marker-casing); stroke-width: 2; stroke-linejoin: round; paint-order: stroke;';
    return `<svg class="${cls}" style="${style}" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><${tag}${attrStr}></${tag}></svg>`;
  }

  function popupContent(p) {
    const el = document.createElement('div'), list = document.createElement('dl');
    el.className = 'record-popup';
    el.append(text('h3', p.name));
    for (const [label, value, isData] of [['Type', sentence(p.type)], ['Public location', p.public_location], ['Confidence', sentence(p.confidence)], ['Verified', p.verified, true]]) {
      const row = document.createElement('div'), dd = text('dd', String(value ?? 'Not recorded'));
      if (isData) dd.className = 'data';
      row.append(text('dt', label), dd);
      list.append(row);
    }
    const sourceRow = document.createElement('div'), source = document.createElement('dd');
    source.append(sourceLink(p));
    sourceRow.append(text('dt', 'Source'), source);
    list.append(sourceRow);
    // The safety warning lives in the top bar and the first-visit dialog, not in popups.
    el.append(list);
    return el;
  }

  let features = [];

  function render() {
    points.clearLayers();
    const mappedList = $('#mapped-list');
    mappedList.replaceChildren();
    features.filter(f => f.geometry && (state.showLower || f.properties.confidence === 'high')).forEach(f => {
      const p = f.properties, dashed = p.confidence !== 'high';
      const item = document.createElement('li'), button = document.createElement('button');
      const kind = text('span', sentence(p.type));
      button.type = 'button';
      button.className = 'record-button';
      button.dataset.id = p.id;
      kind.className = 'record-kind';
      button.append(text('span', p.name), kind);

      const marker = L.marker([f.geometry.coordinates[1], f.geometry.coordinates[0]], {
        icon: L.divIcon({className: 'record-marker', html: shapeIcon(p.type, dashed), iconSize: [44, 44], iconAnchor: [22, 22], popupAnchor: [0, -8]}),
        keyboard: true,
        riseOnHover: true
      });
      marker._featureId = p.id;
      marker.bindPopup(popupContent(p)).addTo(points);
      const icon = marker.getElement();
      if (icon) icon.setAttribute('aria-label', `${p.name}, ${sentence(p.type)}`);

      // The list entry shows which record is open on the map, and the map
      // clears the mark when the popup closes.
      marker.on('popupopen', () => button.setAttribute('aria-current', 'true'));
      marker.on('popupclose', () => button.removeAttribute('aria-current'));
      // Give focus back to the marker when its popup closes from the keyboard.
      marker.on('popupclose', e => {
        const active = document.activeElement, popupEl = e.popup.getElement();
        if (icon && icon.isConnected && (active === document.body || (popupEl && popupEl.contains(active)))) icon.focus({preventScroll: true});
      });

      button.addEventListener('click', () => {
        if (mobile.matches) setPanel(false);
        selectRecord(p.id, marker.getLatLng());
        map.setView(marker.getLatLng(), Math.max(map.getZoom(), 15), {animate: false});
        marker.openPopup();
      });
      item.append(button);
      mappedList.append(item);
    });
    $('#mapped').hidden = !mappedList.children.length;
  }

  // Records with geometry null have no point, so list them in the sidebar.
  function renderUnmapped() {
    const list = $('#unmapped-list');
    list.replaceChildren();
    for (const f of features.filter(f => !f.geometry)) {
      const p = f.properties || {}, item = document.createElement('li'), source = document.createElement('p');
      const name = text('p', p.name || 'Unnamed record');
      name.className = 'unmapped-name';
      source.append(sourceLink(p));
      item.append(name, text('p', p.public_location || 'No public location recorded'), source);
      list.append(item);
    }
    $('#unmapped').hidden = !list.children.length;
  }

  fetch('data/egress.geojson').then(r => { if (!r.ok) throw Error(r.status); return r.json(); }).then(json => {
    features = json.features;
    window.__atlasData = { features };
    render();
    renderUnmapped();
    const unmapped = features.filter(f => !f.geometry).length;
    const parts = [data(features.length), ' surface records loaded'];
    if (unmapped) parts.push(', ', data(unmapped), ' not mapped');
    setStatus('ready', ...parts);
  }).catch(() => {
    setStatus('error', 'Could not load records. Serve this site over HTTP and check the data file.');
  });

  /* ---------- Immersive map: top bar height and full screen ---------- */

  const topbar = $('#topbar');
  const setTopbar = () => document.documentElement.style.setProperty('--topbar-h', topbar.offsetHeight + 'px');
  setTopbar();
  if ('ResizeObserver' in window) new ResizeObserver(setTopbar).observe(topbar);

  const fsButton = $('#fullscreen-toggle');
  if (document.fullscreenEnabled && fsButton) {
    fsButton.hidden = false;
    fsButton.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen({navigationUI: 'hide'}).catch(() => {});
    });
    document.addEventListener('fullscreenchange', () => {
      const on = Boolean(document.fullscreenElement);
      fsButton.textContent = on ? 'Exit full screen' : 'Full screen';
      fsButton.setAttribute('aria-pressed', String(on));
      setTimeout(() => map.invalidateSize(), 150);
    });
  }

  /* ---------- Bottom sheet (below 760px) ---------- */

  const panel = $('#panel'), panelToggle = $('#panel-toggle'), panelLabel = $('#panel-toggle-label');
  function setPanel(open) {
    panel.classList.toggle('is-open', open);
    panelToggle.setAttribute('aria-expanded', String(open));
    panelLabel.textContent = open ? 'Close legend' : 'Legend and records';
  }
  panelToggle.addEventListener('click', () => {
    const open = !panel.classList.contains('is-open');
    setPanel(open);
    if (open) { map.closePopup(); panel.scrollTop = 0; panel.focus({preventScroll: true}); }
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || document.querySelector('dialog[open]')) return;
    if (mobile.matches && panel.classList.contains('is-open')) {
      setPanel(false);
      panelToggle.focus();
    } else if (openPopup) {
      map.closePopup(openPopup);
    }
  });

  function onLayoutChange() {
    setPanel(false);
    map.getContainer().classList.toggle('is-compact', compact.matches);
    zoom.setPosition(compact.matches ? 'topleft' : 'bottomright');
    if (compact.matches) layers.collapse(); else layers.expand();
    setPlacesOpen(!compact.matches);
  }
  mobile.addEventListener('change', onLayoutChange);
  compact.addEventListener('change', onLayoutChange);

  /* ---------- First-visit notice and settings ---------- */

  const notice = $('#notice');
  if (!state.acknowledged) notice.showModal();
  notice.addEventListener('close', () => {
    if (notice.returnValue === 'acknowledge') { state.acknowledged = true; save(); } else notice.showModal();
  });

  const settings = $('#settings');
  $('#settings-open').addEventListener('click', () => settings.showModal());
  const medium = $('#medium'), remember = $('#remember');
  medium.checked = state.showLower;
  remember.checked = state.rememberView;
  medium.addEventListener('change', () => { state.showLower = medium.checked; save(); render(); });
  remember.addEventListener('change', () => { state.rememberView = remember.checked; if (!remember.checked) state.view = null; save(); });

  $('#export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sea-tunnel-atlas-settings.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  $('#import').addEventListener('change', async e => {
    try {
      const file = e.target.files[0];
      if (!file || file.size > 10000) throw Error();
      const d = JSON.parse(await file.text());
      if (d.version !== 1 || typeof d.showLower !== 'boolean' || typeof d.rememberView !== 'boolean' || typeof d.acknowledged !== 'boolean' || !(d.view === null || (Array.isArray(d.view) && d.view.length === 3 && d.view.every(Number.isFinite) && Math.abs(d.view[0]) <= 90 && Math.abs(d.view[1]) <= 180 && d.view[2] >= 0 && d.view[2] <= 19))) throw Error();
      state = {version: 1, acknowledged: state.acknowledged, showLower: d.showLower, rememberView: d.rememberView, view: d.view};
      medium.checked = state.showLower;
      remember.checked = state.rememberView;
      save();
      render();
      if (state.rememberView && state.view) map.setView(state.view.slice(0, 2), state.view[2]);
      $('#settings-status').textContent = 'Settings imported';
    } catch {
      $('#settings-status').textContent = 'Invalid settings file';
    }
    e.target.value = '';
  });

  map.on('moveend', () => {
    if (state.rememberView) { const c = map.getCenter(); state.view = [c.lat, c.lng, map.getZoom()]; save(); }
  });

  /* ---------- Optional 3D view (Deck.gl, WebGL) ---------- */

  let deckgl = null;
  let deckActive = false;
  let selectedRecordId = null;

  // Select a record in both views: highlight its list entry and centre the
  // map on it. Called from record buttons and from 3D taps.
  function selectRecord(featureId, latlng) {
    selectedRecordId = featureId;
    document.querySelectorAll('.record-button').forEach(b => b.removeAttribute('aria-current'));
    const btn = document.querySelector(`.record-button[data-id="${featureId}"]`);
    if (btn) btn.setAttribute('aria-current', 'true');
  }

  // Type colours for 3D view — Deck.gl points are discs, so type is shown
  // by colour instead of shape. Colours match the Astryx neutral theme.
  const TYPE_COLOR_3D = {
    portal: [8, 163, 163],       // #08a3a3 teal
    station_egress: [1, 113, 227], // #0171e3 blue
    station_shaft: [161, 63, 4],   // #a13f04 orange
    vent_facility: [252, 236, 133] // #fcec85 yellow
  };

  // Build Deck.gl layers from the same GeoJSON data Leaflet uses.
  // Tile layer goes first so it renders underneath the data layers.
  function buildDeckLayers() {
    const layers = [];

    // Base map tiles — OpenStreetMap, same source Leaflet uses by default.
    layers.push(new deck.TileLayer({
      id: 'base-tiles',
      tileSize: 256,
      minZoom: 0,
      maxZoom: 19,
      getTileURL: ({ x, y, z }) => {
        const s = 'abc'[(x + y) % 3];
        return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
      },
      opacity: 1
    }));

    // Egress points from shared features (already parsed by app.js).
    const egressFeatures = (window.__atlasData && window.__atlasData.features) || [];
    const egressPoints = egressFeatures.filter(f => f.geometry && f.geometry.type === 'Point');
    if (egressPoints.length) {
      layers.push(new deck.ScatterplotLayer({
        id: 'egress-points',
        data: egressPoints,
        getPosition: d => [d.geometry.coordinates[0], d.geometry.coordinates[1]],
        getRadius: d => 2000,
        getFillColor: d => TYPE_COLOR_3D[d.properties?.type] || TYPE_COLOR_3D.station_egress,
        getLineColor: [255, 255, 255],
        getLineWidth: 2,
        pickable: true,
        autoHighlight: true
      }));
    }

    // Other layers loaded from data/ files (fetched on demand).
    const layerSpecs = [
      { id: 'link-lines', path: '/data/link-lines.geojson', kind: 'line', color: [8, 163, 163], width: 3 },
      { id: 'link-stations', path: '/data/link-stations.geojson', kind: 'point', color: [1, 113, 227], radius: 1500 },
      { id: 'bus-routes', path: '/data/bus-routes.geojson', kind: 'line', color: [120, 120, 120], width: 2 },
      { id: 'bus-stops', path: '/data/bus-stops.geojson', kind: 'point', color: [120, 120, 120], radius: 800 }
    ];

    layerSpecs.forEach(spec => {
      try {
        const data = window.__atlasData?.[spec.id];
        if (data && data.features) {
          if (spec.kind === 'line') {
            layers.push(new deck.LineLayer({
              id: spec.id,
              data: data.features,
              getSourcePosition: d => d.geometry.coordinates[0],
              getTargetPosition: d => d.geometry.coordinates[1],
              getColor: spec.color,
              getWidth: spec.width
            }));
          } else {
            layers.push(new deck.ScatterplotLayer({
              id: spec.id,
              data: data.features,
              getPosition: d => d.geometry.coordinates,
              getRadius: spec.radius,
              getFillColor: spec.color,
              getLineColor: [255, 255, 255],
              getLineWidth: 1,
              pickable: true,
              autoHighlight: true
            }));
          }
        }
      } catch (e) {
        console.warn(`3D: could not load ${spec.id}:`, e);
      }
    });

    return layers;
  }

  function switchTo3D() {
    if (deckActive) return;

    console.info('[sea-tunnel-atlas] switchTo3D: button clicked');

    const mapDiv = $('#map');
    const deckCanvas = $('#deck-canvas');
    if (!mapDiv || !deckCanvas) {
      console.error('[sea-tunnel-atlas] switchTo3D: #map or #deck-canvas not found');
      return;
    }
    console.info('[sea-tunnel-atlas] switchTo3D: #map and #deck-canvas found');

    // Check WebGL availability.
    const probe = document.createElement('canvas');
    const webgl = !!(
      window.WebGLRenderingContext &&
      (probe.getContext('webgl') || probe.getContext('experimental-webgl'))
    );
    console.info('[sea-tunnel-atlas] switchTo3D: WebGL available =', webgl);
    if (!webgl) {
      const msg = $('#view-3d-unavailable');
      if (msg) {
        msg.textContent = '3D view is not available in this browser — WebGL is required. Staying on the 2D map.';
        msg.hidden = false;
      }
      setTimeout(() => { if (msg) msg.hidden = true; }, 6000);
      return;
    }

    // Ensure the deck canvas has explicit dimensions before Deck.gl reads them.
    // CSS viewport units (vh/dvh) can be unreliable on mobile browsers.
    const rect = mapDiv.getBoundingClientRect();
    console.info('[sea-tunnel-atlas] switchTo3D: #map rect =', {
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    });
    if (rect.width > 0 && rect.height > 0) {
      deckCanvas.style.width = rect.width + 'px';
      deckCanvas.style.height = rect.height + 'px';
    }

    mapDiv.classList.add('view-3d');
    deckCanvas.hidden = false;
    const deckAttr = $('#deck-attribution');
    if (deckAttr) deckAttr.hidden = false;

    // Get current Leaflet view.
    const center = map.getCenter();
    const zoom = map.getZoom();
    console.info('[sea-tunnel-atlas] switchTo3D: Leaflet center =', center.lat, center.lng, 'zoom =', zoom);

    // Build layers from available data.
    const layers = buildDeckLayers();
    console.info('[sea-tunnel-atlas] switchTo3D: built', layers.length, 'layers');

    // Initialize Deck.gl.
    try {
      deckgl = new deck.Deck({
        canvas: deckCanvas,
        controller: true,
        initialViewState: {
          longitude: center.lng,
          latitude: center.lat,
          zoom: zoom,
          pitch: 45,
          bearing: 0
        },
        layers: layers,
        onClick: (info) => {
          if (info.object && info.object.id !== undefined) {
            const latlng = { lat: info.coordinate[1], lng: info.coordinate[0] };
            selectRecord(info.object.id, latlng);
            selectedRecordId = info.object.id;
          }
        },
        onViewStateChange: ({ viewState }) => {
          // Keep Leaflet's view in sync so returning to 2D is seamless.
          if (!deckActive) return;
          map.setView([viewState.latitude, viewState.longitude], viewState.zoom, { animate: false });
        }
      });
      console.info('[sea-tunnel-atlas] switchTo3D: Deck.gl initialized successfully');
    } catch (e) {
      console.error('[sea-tunnel-atlas] switchTo3D: Deck.gl initialization FAILED:', e);
      const msg = $('#view-3d-unavailable');
      if (msg) {
        msg.textContent = '3D view failed to start: ' + String(e.message);
        msg.hidden = false;
      }
      setTimeout(() => { if (msg) msg.hidden = true; }, 6000);
      // Clean up CSS state on failure.
      mapDiv.classList.remove('view-3d');
      deckCanvas.hidden = true;
      if (deckAttr) deckAttr.hidden = true;
      return;
    }

    deckActive = true;

    // Toggle buttons.
    const b3d = $('#view-3d-toggle');
    const b2d = $('#view-2d-toggle');
    if (b3d) b3d.hidden = true;
    if (b2d) b2d.hidden = false;

    console.info('[sea-tunnel-atlas] switchTo3D: Deck.gl 3D view activated');
  }

  // Switch from 3D back to Leaflet, keeping the same centre, zoom and
  // selected record.
  function switchTo2D() {
    if (!deckActive || !deckgl) return;

    const view = deckgl.getViewState();
    deckgl.finalize();
    deckgl = null;
    deckActive = false;

    $('#deck-canvas').hidden = true;
    $('#deck-attribution').hidden = true;
    $('#map').classList.remove('view-3d');

    const b3d = $('#view-3d-toggle');
    const b2d = $('#view-2d-toggle');
    if (b3d) b3d.hidden = false;
    if (b2d) b2d.hidden = true;

    if (view) {
      map.setView([view.latitude, view.longitude], view.zoom, { animate: false });
      if (selectedRecordId) {
        const f = features.find(f => f.id === selectedRecordId);
        if (f && f.geometry) {
          const marker = points.getLayers().find(l => l._featureId === String(selectedRecordId));
          if (marker) marker.openPopup();
        }
      }
    }
  }

  // Wire the 3D / 2D buttons once the DOM is up. Deck.gl works on all
  // platforms with WebGL, so the 3D button is shown for everyone.
  const b3d = $('#view-3d-toggle');
  const b2d = $('#view-2d-toggle');
  if (b3d) {
    console.info('[sea-tunnel-atlas] 3D toggle button found, wiring click handler');
    b3d.hidden = false;
    b3d.addEventListener('click', switchTo3D);
  } else {
    console.error('[sea-tunnel-atlas] 3D toggle button #view-3d-toggle NOT found in DOM');
  }
  if (b2d) {
    b2d.hidden = true;
    b2d.addEventListener('click', switchTo2D);
  }

  // Honor the confidence filter in the 3D view too.
  medium.addEventListener('change', () => {
    state.showLower = medium.checked;
    save();
    render();
    if (deckActive && deckgl) {
      deckgl.setProps({ layers: buildDeckLayers() });
    }
  });
})();
