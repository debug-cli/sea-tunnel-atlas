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

  // Shared state for the single layer tile (same 5 checkboxes in 2D and 3D).
  const layerTileState = {
    labels: false,
    surfaceInfrastructure: true,
    places: false,
    metroBus: false,
    linkLightRail: true
  };

  // Build the layer tile HTML with exactly 5 checkboxes, in this order:
  // Labels, Surface Infrastructure, Places (OpenStreetMap), Metro bus,
  // Link light rail. Each checkbox toggles its layer in the active map.
  function buildLayerTile() {
    const container = document.createElement('div');
    container.className = 'layer-tile leaflet-bar leaflet-control';
    container.style.background = 'var(--map-ui-bg)';
    container.style.color = 'var(--map-ui-ink)';
    container.style.border = '1px solid var(--map-ui-rule)';
    container.style.borderRadius = 'var(--radius-control)';
    container.style.padding = 'var(--space-2)';
    container.style.fontFamily = 'var(--font-ui)';
    container.style.fontSize = 'var(--text-small)';
    container.style.lineHeight = '1.4';
    container.style.boxShadow = 'var(--shadow-chip)';

    const addCheckbox = (checked, label, onChange) => {
      const row = document.createElement('div');
      row.style.marginBottom = 'var(--space-1)';
      row.style.display = 'flex';
      row.style.alignItems = 'center';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = checked;
      cb.style.marginRight = 'var(--space-1)';

      const span = document.createElement('span');
      span.textContent = label;

      cb.addEventListener('change', () => {
        onChange(cb.checked);
      });

      row.appendChild(cb);
      row.appendChild(span);
      container.appendChild(row);
    };

    addCheckbox(layerTileState.labels, 'Labels', (checked) => {
      layerTileState.labels = checked;
      if (maplibreActive && maplibre) {
        const lyr = maplibre.getLayer('osm-labels');
        if (lyr) maplibre.setLayoutProperty('osm-labels', 'visibility', checked ? 'visible' : 'none');
      } else {
        if (checked) { if (!map.hasLayer(labels)) labels.addTo(map); }
        else { if (map.hasLayer(labels)) map.removeLayer(labels); }
      }
    });

    addCheckbox(layerTileState.surfaceInfrastructure, 'Surface Infrastructure', (checked) => {
      layerTileState.surfaceInfrastructure = checked;
      if (maplibreActive && maplibre) {
        ['egress-points-solid', 'egress-points-dashed'].forEach(id => {
          if (maplibre.getLayer(id)) maplibre.setLayoutProperty(id, 'visibility', checked ? 'visible' : 'none');
        });
      } else {
        if (checked) { if (!map.hasLayer(points)) points.addTo(map); }
        else { if (map.hasLayer(points)) map.removeLayer(points); }
      }
    });

    addCheckbox(layerTileState.places, 'Places (OpenStreetMap)', (checked) => {
      layerTileState.places = checked;
      if (maplibreActive && maplibre) {
        // Places in 3D view are not implemented; checkbox preserved for UI parity.
      } else {
        if (checked) { if (!map.hasLayer(places)) places.addTo(map); }
        else { if (map.hasLayer(places)) map.removeLayer(places); }
      }
    });

    addCheckbox(layerTileState.metroBus, 'Metro bus (stops at zoom 15+)', (checked) => {
      layerTileState.metroBus = checked;
      if (maplibreActive && maplibre) {
        ['bus-routes', 'bus-stops'].forEach(id => {
          if (maplibre.getLayer(id)) maplibre.setLayoutProperty(id, 'visibility', checked ? 'visible' : 'none');
        });
      } else {
        if (checked) { if (!map.hasLayer(bus)) bus.addTo(map); }
        else { if (map.hasLayer(bus)) map.removeLayer(bus); }
      }
    });

    addCheckbox(layerTileState.linkLightRail, 'Link light rail', (checked) => {
      layerTileState.linkLightRail = checked;
      if (maplibreActive && maplibre) {
        ['link-lines', 'link-stations'].forEach(id => {
          if (maplibre.getLayer(id)) maplibre.setLayoutProperty(id, 'visibility', checked ? 'visible' : 'none');
        });
      } else {
        if (checked) { if (!map.hasLayer(rail)) rail.addTo(map); }
        else { if (map.hasLayer(rail)) map.removeLayer(rail); }
      }
    });

    return container;
  }

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

  // Single layer tile: same 5 checkboxes in 2D and 3D, no base-layer radios.
  const layerTile = L.control({position: 'topright'});
  layerTile.onAdd = () => buildLayerTile();
  layerTile.addTo(map);

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
    const controlsWidth = 0;
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
  }
  placeToggle.addEventListener('click', () => setPlacesOpen(placeOptions.hidden));
  setPlacesOpen(!compact.matches);
  L.DomEvent.disableClickPropagation(placeBox);
  L.DomEvent.disableScrollPropagation(placeBox);

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
        if (maplibreActive && maplibre) {
          // In 3D view, open a MapLibre popup at the marker location.
          open3DPopup(p.id, marker.getLatLng());
        } else {
          map.setView(marker.getLatLng(), Math.max(map.getZoom(), 15), {animate: false});
          marker.openPopup();
        }
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

  /* ---------- Optional 3D view (MapLibre GL JS, WebGL) ---------- */

  let maplibre = null;
  let maplibreActive = false;
  let selectedRecordId = null;

  // Select a record in both views: highlight its list entry and centre the
  // map on it. Called from record buttons and from 3D taps.
  function selectRecord(featureId, latlng) {
    selectedRecordId = featureId;
    document.querySelectorAll('.record-button').forEach(b => b.removeAttribute('aria-current'));
    const btn = document.querySelector(`.record-button[data-id="${featureId}"]`);
    if (btn) btn.setAttribute('aria-current', 'true');
  }

  // Type colours for 3D view — MapLibre circle layers are discs, so type
  // is shown by colour instead of shape. Colours match the Astryx neutral
  // theme.
  const TYPE_COLOR_3D = {
    portal: '#08a3a3',       // teal
    station_egress: '#0171e3', // blue
    station_shaft: '#a13f04',   // orange
    vent_facility: '#fcec85' // yellow
  };

// Custom OSM raster tile style for MapLibre — same tiles as the 2D Leaflet
// OSM layer. Public source, no API key, no token. Roads and labels visible
// at every zoom.
const OSM_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution: '© OpenStreetMap contributors'
    },
    labels: {
      type: 'raster',
      tiles: ['https://basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution: '© OpenStreetMap contributors © CARTO'
    }
  },
  layers: [{
    id: 'osm-raster',
    type: 'raster',
    source: 'osm'
  }, {
    id: 'osm-labels',
    type: 'raster',
    source: 'labels',
    layout: { visibility: 'visible' }
  }]
};

// Draw a marker shape on an offscreen canvas. type: portal | station_egress |
// station_shaft | vent_facility. solid=true: type color fill + white stroke
// (high confidence). solid=false: white fill + type color stroke with a real
// dashed outline (medium / low confidence). Returns ImageData for
// maplibre.addImage().
function drawMarkerShape(type, solid) {
  const canvas = document.createElement('canvas');
  canvas.width = 24;
  canvas.height = 24;
  const ctx = canvas.getContext('2d');
  const fill = solid ? TYPE_COLOR_3D[type] : '#ffffff';
  const stroke = solid ? '#ffffff' : TYPE_COLOR_3D[type];

  ctx.clearRect(0, 0, 24, 24);
  ctx.beginPath();
  if (type === 'portal') {
    ctx.rect(6, 6, 12, 12);
  } else if (type === 'vent_facility') {
    ctx.moveTo(12, 4);
    ctx.lineTo(20, 20);
    ctx.lineTo(4, 20);
    ctx.closePath();
  } else if (type === 'station_egress') {
    ctx.arc(12, 12, 8, 0, 2 * Math.PI);
  } else if (type === 'station_shaft') {
    ctx.moveTo(12, 4);
    ctx.lineTo(20, 12);
    ctx.lineTo(12, 20);
    ctx.lineTo(4, 12);
    ctx.closePath();
  }
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  if (!solid) {
    ctx.setLineDash([4, 3]);
  }
  ctx.stroke();
  if (!solid) {
    ctx.setLineDash([]);
  }
  return ctx.getImageData(0, 0, 24, 24);
}

// Add 3D buildings from demotiles vector tiles (openmaptiles schema).
// Reads tiles.json first to discover the building source, source-layer, and
// height property. Drawn as fill-extrusion below markers and lines.
async function addBuildings() {
  try {
    const tilesRes = await fetch('https://demotiles.maplibre.org/tiles/tiles.json');
    if (!tilesRes.ok) throw Error(`tiles.json: ${tilesRes.status}`);
    const tiles = await tilesRes.json();

    // Discover the building vector tile URL from tiles.json sources.
    let buildingTileUrl = null;
    if (tiles.sources) {
      for (const [name, src] of Object.entries(tiles.sources)) {
        if (src.type === 'vector' && Array.isArray(src.tiles) && src.tiles.length > 0) {
          buildingTileUrl = src.tiles[0];
          break;
        }
      }
    }
    if (!buildingTileUrl) {
      buildingTileUrl = 'https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.pbf';
    }

    maplibre.addSource('buildings', {
      type: 'vector',
      tiles: [buildingTileUrl],
      maxzoom: 16
    });

    // Use a fixed modest height if the source has no height values.
    maplibre.addLayer({
      id: 'buildings-fill-extrusion',
      type: 'fill-extrusion',
      source: 'buildings',
      'source-layer': 'building',
      filter: ['==', ['geometry'], 'polygon'],
      paint: {
        'fill-extrusion-color': '#d9d9d9',
        'fill-extrusion-height': ['coalesce', ['get', 'height'], 10],
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.7
      }
    });
  } catch (e) {
    console.warn('3D: could not load buildings:', e);
  }
}

// Open a MapLibre popup with the same detail content as Leaflet's popup,
// at the given location. Used by 3D taps and by record list buttons in 3D.
function open3DPopup(featureId, latlng) {
  const f = features.find(f => f.id === featureId);
  if (!f || !maplibre) return;
  const p = f.properties;
  const el = popupContent(p);
  const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true })
    .setLngLat([latlng.lng, latlng.lat])
    .setHTML(el.outerHTML)
    .addTo(maplibre);
  return popup;
}

// The 3D layer tile uses the shared buildLayerTile() so 2D and 3D show the
// same five checkboxes. Added in switchTo3D after the map loads.

// Load a GeoJSON file and add it as a MapLibre source + layer.
// paint values can be MapLibre expressions (arrays).
async function addGeoJsonLayer(id, path, layerType, paint, minzoom) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw Error(`${path}: ${response.status}`);
      const data = await response.json();
      maplibre.addSource(id, { type: 'geojson', data });
      const layer = {
        id,
        source: id,
        type: layerType,
        paint
      };
      if (minzoom !== undefined) layer.minzoom = minzoom;
      maplibre.addLayer(layer);
    } catch (e) {
      console.warn(`3D: could not load ${id}:`, e);
    }
  }

  // Build all MapLibre layers from the data files. Egress points come from
  // window.__atlasData (already parsed by app.js); the rest are fetched.
  async function buildMapLibreLayers() {
    // Register marker shape images for symbol layers (one per type, solid +
    // dashed). MapLibre circle layers can only draw discs, so we use symbol
    // layers with canvas-drawn images to show the four shapes in type color.
    const types = ['portal', 'station_egress', 'station_shaft', 'vent_facility'];
    types.forEach(type => {
      try {
        maplibre.addImage(`${type}-solid`, drawMarkerShape(type, true));
      } catch (e) {
        console.error('[sea-tunnel-atlas] addImage failed:', `${type}-solid`, e);
      }
      try {
        maplibre.addImage(`${type}-dashed`, drawMarkerShape(type, false));
      } catch (e) {
        console.error('[sea-tunnel-atlas] addImage failed:', `${type}-dashed`, e);
      }
    });

    // Egress points from shared features, honoring the confidence filter.
    // Two symbol layers: solid for high confidence, dashed for medium/low.
    const egressFeatures = (window.__atlasData && window.__atlasData.features) || [];
    const egressPoints = egressFeatures.filter(
      f => f.geometry && f.geometry.type === 'Point' &&
        (state.showLower || f.properties.confidence === 'high')
    );
    if (egressPoints.length) {
      maplibre.addSource('egress-points', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: egressPoints }
      });

      const iconImageExpr = (suffix) => [
        'match',
        ['get', 'type'],
        'portal', `portal-${suffix}`,
        'station_egress', `station_egress-${suffix}`,
        'station_shaft', `station_shaft-${suffix}`,
        'vent_facility', `vent_facility-${suffix}`,
        `station_egress-${suffix}`
      ];

      maplibre.addLayer({
        id: 'egress-points-solid',
        source: 'egress-points',
        type: 'symbol',
        filter: ['==', ['get', 'confidence'], 'high'],
        layout: {
          'icon-image': iconImageExpr('solid'),
          'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.6, 14, 1.0, 18, 1.4],
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      });

      maplibre.addLayer({
        id: 'egress-points-dashed',
        source: 'egress-points',
        type: 'symbol',
        filter: ['!=', ['get', 'confidence'], 'high'],
        layout: {
          'icon-image': iconImageExpr('dashed'),
          'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.6, 14, 1.0, 18, 1.4],
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      });
    }

    // Other GeoJSON layers from data/ files.
    await addGeoJsonLayer(
      'link-lines', '/data/link-lines.geojson', 'line',
      { 'line-color': ['concat', '#', ['get', 'color']], 'line-width': 3 }
    );
    await addGeoJsonLayer(
      'link-stations', '/data/link-stations.geojson', 'circle',
      { 'circle-radius': 6, 'circle-color': TYPE_COLOR_3D.station_egress, 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 1 }
    );
    await addGeoJsonLayer(
      'bus-routes', '/data/bus-routes.geojson', 'line',
      { 'line-color': '#787878', 'line-width': 2 },
      15
    );
    await addGeoJsonLayer(
      'bus-stops', '/data/bus-stops.geojson', 'circle',
      { 'circle-radius': 4, 'circle-color': '#787878', 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 0.5 },
      15
    );
  }

  // Switch from Leaflet to the 3D view. Uses MapLibre GL JS with WebGL —
  // works on all platforms (Windows, macOS, Linux, Chrome, Edge, Firefox).
  async function switchTo3D() {
    if (maplibreActive) return;

    console.info('[sea-tunnel-atlas] switchTo3D: button clicked');

    // Remember scroll position so switching to 3D doesn't scroll the page
    // and hide the top bar.
    const scrollY = window.scrollY;

    const mapDiv = $('#map');
    const maplibreContainer = $('#maplibre-map');
    if (!mapDiv || !maplibreContainer) {
      console.error('[sea-tunnel-atlas] switchTo3D: #map or #maplibre-map not found');
      return;
    }
    console.info('[sea-tunnel-atlas] switchTo3D: #map and #maplibre-map found');

    // Guard: MapLibre library did not load (CDN failure, blocked, etc.).
    if (typeof maplibregl === 'undefined') {
      console.error('[sea-tunnel-atlas] switchTo3D: maplibregl is not defined — MapLibre library did not load. Check assets/maplibre/maplibre-gl.js.');
      const msg = $('#view-3d-unavailable');
      if (msg) {
        msg.textContent = '3D map library did not load — staying on the 2D map.';
        msg.hidden = false;
      }
      setTimeout(() => { if (msg) msg.hidden = true; }, 15000);
      return;
    }

    mapDiv.classList.add('view-3d');
    maplibreContainer.hidden = false;

    // Flush layout so MapLibre can measure the now-visible container
    // correctly. Without this, MapLibre sees a 0x0 container (it was
    // display: none until just now) and lays out its controls off-screen.
    await new Promise(r => requestAnimationFrame(r));

    // Disable Leaflet interaction so no Leaflet input can fire in 3D view.
    // Leaflet's panes and controls are hidden by CSS (selector now matches
    // #map itself, which carries the leaflet-container class).
    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.touchZoom.disable();
    map.keyboard.disable();

    // Get current Leaflet view.
    const center = map.getCenter();
    const zoom = map.getZoom();
    console.info('[sea-tunnel-atlas] switchTo3D: Leaflet center =', center.lat, center.lng, 'zoom =', zoom);

    // Keep the page from scrolling while the 3D view is active so the
    // top bar and safety warning stay visible.
    document.body.classList.add('atlas-3d-active');

    // Initialize MapLibre.
    try {
      // WebGL check: a canvas must be able to create a WebGL context.
      // maplibregl.supported() does not exist in MapLibre 5.7.3; check directly.
      let webglOk = false;
      try {
        const probe = document.createElement('canvas');
        webglOk = !!(probe.getContext('webgl2') || probe.getContext('webgl'));
      } catch {}
      if (!webglOk) {
        throw new Error('3D view is not available in this browser — WebGL is required. Staying on the 2D map.');
      }

      maplibre = new maplibregl.Map({
        container: maplibreContainer,
        style: OSM_STYLE,
        center: [center.lng, center.lat],
        zoom: zoom,
        pitch: 45,
        bearing: 0
      });

      // Wait for the style to load before adding sources/layers. Adding
      // sources or layers before the style loads throws "Style is not done
      // loading".
      await new Promise((resolve, reject) => {
        let settled = false;
        const timer = setTimeout(() => {
          if (!settled) {
            settled = true;
            reject(new Error('MapLibre style did not load within 15 seconds.'));
          }
        }, 15000);
        maplibre.once('load', () => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve();
          }
        });
        maplibre.once('error', (e) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            reject(new Error('MapLibre style load error: ' + String(e.error && e.error.message || e)));
          }
        });
      });

      // Add 3D buildings below markers and lines.
      await addBuildings();

      await buildMapLibreLayers();

      // MapLibre laid out its controls against the container size when the
      // map was created. Now that the style has loaded and layers are added,
      // resize so controls sit against the final container size.
      maplibre.resize();

      // Add MapLibre's own zoom + compass control. Position is the second
      // argument to addControl, not a constructor option.
      maplibre.addControl(new maplibregl.NavigationControl(), 'bottom-right');

      // Add the shared layer tile (top-left, visible only in 3D).
      maplibre.addControl(buildLayerTile(), 'top-left');

      // Restore scroll position so the top bar stays visible.
      window.scrollTo(0, scrollY);

      // Click on a feature: open the same detail panel as Leaflet.
      maplibre.on('click', 'egress-points', (e) => {
        const feature = e.features[0];
        const latlng = { lat: e.lngLat.lat, lng: e.lngLat.lng };
        selectRecord(feature.id, latlng);
        selectedRecordId = feature.id;
        open3DPopup(feature.id, latlng);
      });
      maplibre.on('click', 'link-stations', (e) => {
        const feature = e.features[0];
        const latlng = { lat: e.lngLat.lat, lng: e.lngLat.lng };
        selectRecord(feature.id, latlng);
        selectedRecordId = feature.id;
        open3DPopup(feature.id, latlng);
      });
      maplibre.on('click', 'bus-stops', (e) => {
        const feature = e.features[0];
        const latlng = { lat: e.lngLat.lat, lng: e.lngLat.lng };
        selectRecord(feature.id, latlng);
        selectedRecordId = feature.id;
        open3DPopup(feature.id, latlng);
      });
      maplibre.on('click', 'link-lines', (e) => {
        const feature = e.features[0];
        const latlng = { lat: e.lngLat.lat, lng: e.lngLat.lng };
        selectRecord(feature.id, latlng);
        selectedRecordId = feature.id;
        open3DPopup(feature.id, latlng);
      });

      // Sync view once when MapLibre moves — sync on switch is enough for
      // returning to 2D seamlessly (not every frame).
      maplibre.on('moveend', () => {
        if (!maplibreActive) return;
        const c = maplibre.getCenter();
        const z = maplibre.getZoom();
        map.setView([c.lat, c.lng], z, { animate: false });
      });

      maplibreActive = true;
      console.info('[sea-tunnel-atlas] switchTo3D: MapLibre 3D view activated');
    } catch (e) {
      console.error('[sea-tunnel-atlas] switchTo3D: MapLibre initialization FAILED:', e);
      const msg = $('#view-3d-unavailable');
      if (msg) {
        msg.textContent = '3D view failed to start: ' + String(e.message);
        msg.hidden = false;
      }
      setTimeout(() => { if (msg) msg.hidden = true; }, 15000);
      mapDiv.classList.remove('view-3d');
      maplibreContainer.hidden = true;
      document.body.classList.remove('atlas-3d-active');
      // Re-enable Leaflet interaction since we are staying on Leaflet.
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
      map.keyboard.enable();
      map.invalidateSize();
      window.scrollTo(0, scrollY);
      return;
    }

    // Toggle buttons.
    const b3d = $('#view-3d-toggle');
    const b2d = $('#view-2d-toggle');
    if (b3d) b3d.hidden = true;
    if (b2d) b2d.hidden = false;

    console.info('[sea-tunnel-atlas] switchTo3D: MapLibre 3D view activated');
  }

  // Switch from 3D back to Leaflet, keeping the same centre, zoom and
  // selected record.
  function switchTo2D() {
    if (!maplibreActive || !maplibre) return;

    const view = maplibre.getCenter();
    const zoom = maplibre.getZoom();
    maplibre.remove();
    maplibre = null;
    maplibreActive = false;

    $('#maplibre-map').hidden = true;
    $('#map').classList.remove('view-3d');
    document.body.classList.remove('atlas-3d-active');

    // Re-enable Leaflet interaction now that 3D is off, so Leaflet works
    // exactly as before in 2D view.
    map.dragging.enable();
    map.scrollWheelZoom.enable();
    map.doubleClickZoom.enable();
    map.touchZoom.enable();
    map.keyboard.enable();
    map.invalidateSize();

    const b3d = $('#view-3d-toggle');
    const b2d = $('#view-2d-toggle');
    if (b3d) b3d.hidden = false;
    if (b2d) b2d.hidden = true;

    if (view) {
      map.setView([view.lat, view.lng], zoom, { animate: false });
      if (selectedRecordId) {
        const f = features.find(f => f.id === selectedRecordId);
        if (f && f.geometry) {
          const marker = points.getLayers().find(l => l._featureId === String(selectedRecordId));
          if (marker) marker.openPopup();
        }
      }
    }
  }

  // Wire the 3D / 2D buttons once the DOM is up. MapLibre works on all
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

    // Honor the confidence filter in the 3D view too — rebuild egress layer
    // when the checkbox changes. Both egress-points-solid and
    // egress-points-dashed share the egress-points source, so setData updates
    // both layers; each layer's filter (confidence == high vs != high)
    // selects which features render.
    medium.addEventListener('change', async () => {
      state.showLower = medium.checked;
      save();
      render();
      if (maplibreActive && maplibre && maplibre.getSource('egress-points')) {
        const egressFeatures = (window.__atlasData && window.__atlasData.features) || [];
        const egressPoints = egressFeatures.filter(
          f => f.geometry && f.geometry.type === 'Point' &&
            (state.showLower || f.properties.confidence === 'high')
        );
        maplibre.getSource('egress-points').setData({ type: 'FeatureCollection', features: egressPoints });
      }
    });
})();
