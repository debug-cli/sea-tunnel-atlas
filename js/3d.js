// Sea Tunnel Atlas — optional WebGPU 3D map view (ImmersiveMap 0.1.1)
// Built by Vite into dist/3d/3d.mjs. Leaflet stays the default, no-build path.
//
// This module is imported only when the user taps the 3D view button.
// It wraps ImmersiveMap and mirrors the Leaflet state: center, zoom,
// selected record, confidence filter, and the same GeoJSON layers.
//
// GeoJSON data is shared with app.js through window.__atlasData — app.js
// parses data/egress.geojson once and this module reads it, so GeoJSON
// parsing is not duplicated. Other layers (link lines, stations, bus
// routes, bus stops) are registered from the same data/ files here.

import {
  ImmersiveMap,
  ImmersiveMapPointStyle,
  ImmersiveMapPolylineStyle,
  geoCoordinate,
} from '@artembobkin/immersive-map';

// One disc colour per record type. ImmersiveMap points are discs only —
// Leaflet's shape-by-type (square, triangle, circle, arrow) has no
// equivalent here. Type is carried in the detail panel and legend instead.
// Colours come from the Astryx neutral theme's data tokens as published:
// teal, blue, orange, yellow — no purple, no gradients, no glassmorphism.
const TYPE_COLOR = {
  portal: { r: 0.031, g: 0.639, b: 0.639, a: 1 },       // #08a3a3 teal
  station_egress: { r: 0.004, g: 0.443, b: 0.89, a: 1 }, // #0171e3 blue
  station_shaft: { r: 0.631, g: 0.247, b: 0.016, a: 1 }, // #a13f04 orange
  vent_facility: { r: 0.992, g: 0.925, b: 0.522, a: 0.9 }, // #fcec85 yellow
};

const TYPE_RADIUS = {
  portal: 5,
  station_egress: 5,
  station_shaft: 6,
  vent_facility: 4,
};

const TYPE_STROKE = {
  portal: { r: 1, g: 1, b: 1, a: 1 },
  station_egress: { r: 1, g: 1, b: 1, a: 1 },
  station_shaft: { r: 1, g: 1, b: 1, a: 1 },
  vent_facility: { r: 0, g: 0, b: 0, a: 1 },
};

const TYPE_STROKE_WIDTH = {
  portal: 1,
  station_egress: 1,
  station_shaft: 1,
  vent_facility: 1,
};

// WebGPU probe. ImmersiveMap has no WebGL fallback: when false, the 3D
// button must not be offered, and tapping it shows a plain message.
export function isWebGPUAvailable() {
  const available = !!(navigator.gpu && navigator.gpu.requestAdapter);
  console.info('[sea-tunnel-atlas] 3D: isWebGPUAvailable =', available, '(navigator.gpu=', !!navigator.gpu, ')');
  return available;
}

// Parsed features shared with app.js through window.__atlasData. app.js sets
// this after fetching data/egress.geojson; this module reads it.
export function sharedFeatures() {
  return window.__atlasData?.features || [];
}

export class ImmersiveMap3D {
  constructor({ container, onTap, onViewChange }) {
    this.container = container;
    this.map = null;
    this.onTap = onTap;
    this.onViewChange = onViewChange;
    this.selectedFeatureId = null;
    this.showLower = true; // confidence filter: true = show medium + low
    this.destroyed = false;
    this._layerTapUnsubscribe = null;
    this._layerConfigs = null; // layer configs, reapplied when filter changes
  }

  async init() {
    console.info('[sea-tunnel-atlas] 3D: init() called');
    if (this.destroyed) {
      console.warn('[sea-tunnel-atlas] 3D: init() aborted — already destroyed');
      return;
    }
    if (!isWebGPUAvailable()) {
      throw new Error('WebGPU is not available in this browser.');
    }

    // Log container dimensions for diagnosis. WebGPU adapter and device
    // creation both succeed on Windows, but ImmersiveMap.create() hangs
    // inside buildRenderer — a known limitation of ImmersiveMap 0.1.1
    // (tested only on Chrome/macOS, not Windows).
    const rect = this.container.getBoundingClientRect();
    console.info('[sea-tunnel-atlas] 3D: container rect =', {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    });

    // Ensure the container has explicit dimensions so ImmersiveMap has a
    // non-zero canvas to configure.
    if (rect.width === 0 || rect.height === 0) {
      console.warn('[sea-tunnel-atlas] 3D: container has 0 width or height — setting explicit size');
      this.container.style.position = 'relative';
      this.container.style.width = '100vw';
      this.container.style.height = 'calc(100vh - 64px)';
    }

    const CREATE_TIMEOUT_MS = 15000;
    console.info('[sea-tunnel-atlas] 3D: calling ImmersiveMap.create({container}) with', CREATE_TIMEOUT_MS / 1000, 's timeout');
    const createPromise = ImmersiveMap.create({
      container: this.container,
    });
    const timeoutPromise = new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`3D view unavailable: ImmersiveMap.create() did not complete on this browser (WebGPU works but renderer initialization hangs). ImmersiveMap 0.1.1 is tested on Chrome/macOS only.`));
      }, CREATE_TIMEOUT_MS);
    });
    this.map = await Promise.race([createPromise, timeoutPromise]);
    console.info('[sea-tunnel-atlas] 3D: ImmersiveMap.create() resolved');

    // Forward camera moves so the 2D view can return to the same place.
    this.map.onFrame(() => {
      if (this.destroyed || !this.onViewChange) return;
      const v = this.map.view;
      // center is [longitude, latitude]; flip to [latitude, longitude].
      this.onViewChange({ lat: v.center[1], lng: v.center[0], zoom: v.zoom });
    });

    // Tap on a shape: look up the record and tell the shell.
    this._layerTapUnsubscribe = this.map.onLayerTap((event) => {
      if (this.destroyed) return;
      const { layer, shapeID, coordinate } = event;
      const feature = sharedFeatures().find((f) => String(f.id) === String(shapeID));
      if (feature && this.onTap) {
        this.onTap(feature.properties, { lat: coordinate.latitude, lng: coordinate.longitude });
      }
    });

    console.info('[sea-tunnel-atlas] 3D: onFrame and onLayerTap listeners registered');
    this._layerConfigs = this._defaultLayerConfigs();
    console.info('[sea-tunnel-atlas] 3D: calling _applyLayers()');
    await this._applyLayers();
    console.info('[sea-tunnel-atlas] 3D: init() complete');
  }

  // Layer configurations, reapplied whenever the confidence filter changes.
  _defaultLayerConfigs() {
    return [
      {
        id: 'egress-points',
        source: 'egress',
        kind: 'points',
        isVisible: true,
      },
      {
        id: 'link-lines',
        source: 'link-lines',
        kind: 'polylines',
        polylineStyle: ImmersiveMapPolylineStyle.make({
          color: { r: 0.031, g: 0.639, b: 0.639, a: 0.9 },
          widthPoints: 3,
        }),
        isVisible: true,
      },
      {
        id: 'link-stations',
        source: 'link-stations',
        kind: 'points',
        pointStyle: ImmersiveMapPointStyle.make({
          color: { r: 0.004, g: 0.443, b: 0.89, a: 1 },
          radiusPoints: 5,
          strokeColor: { r: 1, g: 1, b: 1, a: 1 },
          strokeWidthPoints: 1,
        }),
        isVisible: true,
      },
      {
        id: 'bus-routes',
        source: 'bus-routes',
        kind: 'polylines',
        polylineStyle: ImmersiveMapPolylineStyle.make({
          color: { r: 0.429, g: 0.429, b: 0.429, a: 0.7 },
          widthPoints: 2,
        }),
        isVisible: true,
        zoomRange: { lowerBound: 15, upperBound: 30 },
      },
      {
        id: 'bus-stops',
        source: 'bus-stops',
        kind: 'points',
        pointStyle: ImmersiveMapPointStyle.make({
          color: { r: 0.429, g: 0.429, b: 0.429, a: 0.8 },
          radiusPoints: 3,
          strokeColor: { r: 1, g: 1, b: 1, a: 1 },
          strokeWidthPoints: 0.5,
        }),
        isVisible: true,
        zoomRange: { lowerBound: 15, upperBound: 30 },
      },
    ];
  }

  // Register sources and set layers. Egress uses a shapes source so each
  // point can carry its own type colour; other sources are registered by
  // URL from the same data/ files app.js reads.
  async _applyLayers() {
    console.info('[sea-tunnel-atlas] 3D: _applyLayers() called, showLower=', this.showLower);
    if (this.destroyed || !this.map) {
      console.warn('[sea-tunnel-atlas] 3D: _applyLayers() aborted — destroyed=', this.destroyed, 'map=', !!this.map);
      return;
    }

    // Egress: build points from shared features, honouring the confidence
    // filter. Medium/low records are white discs with a dark stroke.
    const features = sharedFeatures();
    console.info('[sea-tunnel-atlas] 3D: _applyLayers: shared features count=', features.length);
    const mapped = features.filter((f) => f.geometry && (this.showLower || f.properties.confidence === 'high'));
    const egressPoints = mapped.map((f) => {
      const p = f.properties;
      const dashed = p.confidence !== 'high';
      const color = TYPE_COLOR[p.type] || TYPE_COLOR.station_egress;
      const stroke = dashed ? { r: 0, g: 0, b: 0, a: 1 } : TYPE_STROKE[p.type];
      return {
        id: Number(f.id),
        coordinate: geoCoordinate(f.geometry.coordinates[1], f.geometry.coordinates[0]),
        style: {
          color,
          radiusPoints: TYPE_RADIUS[p.type] || 5,
          strokeColor: stroke,
          strokeWidthPoints: TYPE_STROKE_WIDTH[p.type] || 1,
        },
      };
    });

    this.map.layers.register('egress', {
      identity: `egress-${this.showLower ? 'all' : 'high'}`,
      points: egressPoints,
    });

    // Other sources: register by URL. Identity is the path so re-register is a no-op.
    for (const [name, path] of [
      ['link-lines', '/data/link-lines.geojson'],
      ['link-stations', '/data/link-stations.geojson'],
      ['bus-routes', '/data/bus-routes.geojson'],
      ['bus-stops', '/data/bus-stops.geojson'],
    ]) {
      try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`${path}: ${response.status}`);
        const data = await response.json();
        this.map.layers.register(name, { geoJSON: data, identity: path });
      } catch (e) {
        // Missing feed files disable their layer rather than fabricating data.
        console.warn(`3D: could not register ${name}:`, e);
      }
    }

    this.map.layers.set(this._layerConfigs.map((c) => ({
      id: c.id,
      source: c.source,
      ...(c.pointStyle ? { pointStyle: c.pointStyle } : c.polylineStyle ? { polylineStyle: c.polylineStyle } : {}),
      isVisible: c.isVisible,
      zoomRange: c.zoomRange,
    })));
    console.info('[sea-tunnel-atlas] 3D: _applyLayers: layers.set complete, layer count=', this._layerConfigs.length);
  }

  // Move the camera to a record. Used when the user selects a record in the
  // left panel from either view.
  selectFeature(featureId, { lat, lng }) {
    if (this.destroyed || !this.map) return;
    this.selectedFeatureId = featureId;
    this.map.view = {
      center: [lng, lat],
      zoom: Math.max(this.map.view.zoom, 14),
    };
  }

  clearSelection() {
    this.selectedFeatureId = null;
  }

  // Set camera view from the 2D view when switching to 3D.
  setView({ lat, lng, zoom }) {
    if (this.destroyed || !this.map) return;
    this.map.view = { center: [lng, lat], zoom };
  }

  getView() {
    if (this.destroyed || !this.map) return null;
    const v = this.map.view;
    return { lat: v.center[1], lng: v.center[0], zoom: v.zoom };
  }

  // Toggle the confidence filter for egress points. Rebuilds the egress
  // layer so medium/low records appear or disappear.
  setConfidenceFilter(showLower) {
    this.showLower = showLower;
    this._applyLayers();
  }

  destroy() {
    this.destroyed = true;
    if (this._layerTapUnsubscribe) {
      this._layerTapUnsubscribe();
      this._layerTapUnsubscribe = null;
    }
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
    this.container.innerHTML = '';
  }
}
