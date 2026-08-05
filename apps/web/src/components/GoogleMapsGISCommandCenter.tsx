'use client';

import React, { useState, useEffect } from 'react';
import { useEventOpsStore, WorkerCard } from '../store/useEventOpsStore';
import { 
  Layers, Play, Pause, RotateCcw, User, Battery, Signal, Navigation, 
  Phone, MessageSquare, RefreshCw, AlertCircle, Zap, Shield, Flame, 
  Camera, Wifi, Radio, MapPin
} from 'lucide-react';

// Google Maps Tile Server URLs
const GOOGLE_MAPS_TILES = {
  HYBRID: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', // Google Satellite + Roads + Labels
  SATELLITE: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', // Pure Satellite
  ROADMAP: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', // Google Maps Standard
  TERRAIN: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'  // Google Maps Terrain
};

export function GoogleMapsGISCommandCenter() {
  const { 
    workers, tasks, gisLayers, toggleGISLayer, 
    selectedDepartmentFilter, setSelectedWorkerCard, selectedWorkerCard,
    setDispatchModalIncidentId
  } = useEventOpsStore();

  const [mapType, setMapType] = useState<'HYBRID' | 'SATELLITE' | 'ROADMAP' | 'TERRAIN'>('HYBRID');
  const [isPlayingPlayback, setIsPlayingPlayback] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);
  const [playbackMinute, setPlaybackMinute] = useState(12);

  // Dynamically import Leaflet components on client side only (SSR Safety)
  const [LeafletMap, setLeafletMap] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      import('react-leaflet'),
      import('leaflet')
    ]).then(([ReactLeaflet, L]) => {
      if (isMounted) {
        setLeafletMap({
          MapContainer: ReactLeaflet.MapContainer,
          TileLayer: ReactLeaflet.TileLayer,
          Marker: ReactLeaflet.Marker,
          Popup: ReactLeaflet.Popup,
          Polyline: ReactLeaflet.Polyline,
          Polygon: ReactLeaflet.Polygon,
          Circle: ReactLeaflet.Circle,
          L: L
        });
      }
    }).catch(err => {
      console.error("Leaflet load error:", err);
    });

    return () => { isMounted = false; };
  }, []);

  // Filter workers based on department selector
  const filteredWorkers = workers.filter(w => {
    if (selectedDepartmentFilter === 'ALL') return true;
    return w.department.toLowerCase().includes(selectedDepartmentFilter.toLowerCase());
  });

  // Center Coordinates for Major Event Venue (e.g. Hyderabad / NYC / LA Stadium Grounds)
  const venueCenter: [number, number] = [17.3850, 78.4867];

  // REAL VENUE BLUEPRINT STRUCTURAL POLYGONS ON GOOGLE MAPS
  const venuePolygons = [
    {
      name: '🎪 MAIN STAGE & LED WALL GRID',
      color: '#6366f1',
      coords: [
        [17.3858, 78.4860],
        [17.3865, 78.4875],
        [17.3858, 78.4878],
        [17.3852, 78.4863]
      ] as [number, number][]
    },
    {
      name: '⚙️ POWER & GENERATOR SUBSTATION',
      color: '#f59e0b',
      coords: [
        [17.3862, 78.4878],
        [17.3868, 78.4888],
        [17.3860, 78.4890],
        [17.3855, 78.4880]
      ] as [number, number][]
    },
    {
      name: '⭐ VIP LOUNGE & GATE 1',
      color: '#10b981',
      coords: [
        [17.3848, 78.4845],
        [17.3855, 78.4856],
        [17.3845, 78.4858],
        [17.3840, 78.4848]
      ] as [number, number][]
    },
    {
      name: '🚑 MEDICAL TRAUMA CENTER',
      color: '#ef4444',
      coords: [
        [17.3845, 78.4878],
        [17.3852, 78.4888],
        [17.3842, 78.4890],
        [17.3838, 78.4880]
      ] as [number, number][]
    },
    {
      name: '🚗 PARKING LOT C & SHUTTLE HUB',
      color: '#3b82f6',
      coords: [
        [17.3835, 78.4865],
        [17.3842, 78.4888],
        [17.3832, 78.4890],
        [17.3828, 78.4868]
      ] as [number, number][]
    }
  ];

  if (!LeafletMap) {
    return (
      <div className="attio-card w-full h-[580px] rounded-2xl bg-[#09090c] border border-white/10 flex items-center justify-center space-x-3 text-indigo-400">
        <MapPin className="w-6 h-6 animate-bounce" />
        <span className="text-sm font-semibold">Loading High-Definition Google Maps Engine...</span>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Circle, L } = LeafletMap;

  // Custom Leaflet DivIcon for Department Workers
  const createWorkerIcon = (w: WorkerCard) => {
    return L.divIcon({
      className: 'custom-leaflet-worker',
      html: `
        <div style="
          width: 36px; height: 36px; 
          border-radius: 12px; 
          background: #111115; 
          border: 2px solid ${w.status === 'GOING_TO_TASK' ? '#f59e0b' : '#10b981'}; 
          display: flex; align-items: center; justify-content: center; 
          font-size: 16px; 
          box-shadow: 0 6px 16px rgba(0,0,0,0.8);
          position: relative;
        ">
          <span>${w.icon}</span>
          <div style="
            position: absolute; top: -4px; right: -4px;
            width: 10px; height: 10px; border-radius: 50%;
            background: ${w.status === 'GOING_TO_TASK' ? '#f59e0b' : '#10b981'};
            box-shadow: 0 0 8px ${w.status === 'GOING_TO_TASK' ? '#f59e0b' : '#10b981'};
          "></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
  };

  // Custom Leaflet DivIcon for Emergency Incidents
  const createIncidentIcon = (t: any) => {
    return L.divIcon({
      className: 'custom-leaflet-incident',
      html: `
        <div style="
          width: 34px; height: 34px; 
          border-radius: 50%; 
          background: ${t.priority === 'EMERGENCY' ? '#dc2626' : '#d97706'}; 
          border: 2px solid #ffffff; 
          display: flex; align-items: center; justify-center; 
          color: white; font-weight: bold; font-size: 16px;
          box-shadow: 0 0 20px ${t.priority === 'EMERGENCY' ? 'rgba(220,38,38,0.9)' : 'rgba(217,119,6,0.8)'};
        ">
          🚨
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
  };

  return (
    <div className="attio-card w-full rounded-2xl border border-white/10 bg-[#09090c] p-4 sm:p-5 shadow-2xl space-y-4">
      
      {/* 1. TOP TITLE & GOOGLE MAPS TYPE SWITCHER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-[#111115] p-3.5 rounded-xl border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <h2 className="text-sm font-bold text-zinc-100 tracking-tight flex items-center gap-2">
              <span>Google Maps Platform Operational GIS</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                GOOGLE SATELLITE + HYBRID ENGINE
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">Real High-Definition Satellite Imagery, CAD Polygons & Live GPS Responders</p>
          </div>
        </div>

        {/* Google Maps Base Layer Controls */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[10px] text-zinc-500 font-mono uppercase">Google Layer:</span>
          {(['HYBRID', 'SATELLITE', 'ROADMAP', 'TERRAIN'] as const).map(t => (
            <button
              key={t}
              onClick={() => setMapType(t)}
              className={`px-3 py-1 rounded-lg border transition-all text-xs font-mono font-semibold ${
                mapType === t ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#0a0a0d] border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. REPLAY & PLAYBACK CONTROLLER */}
      <div className="bg-[#111115] p-3 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Historical Playback
          </span>
          <span className="font-mono font-bold text-indigo-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
            10:{playbackMinute < 10 ? '0' + playbackMinute : playbackMinute}:00 AM
          </span>
        </div>

        <div className="flex-1 w-full sm:mx-4 flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="29"
            value={playbackMinute}
            onChange={(e) => setPlaybackMinute(Number(e.target.value))}
            className="w-full h-1.5 bg-[#0a0a0d] rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlayingPlayback(!isPlayingPlayback)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 text-xs ${
              isPlayingPlayback ? 'bg-amber-500 text-zinc-950' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isPlayingPlayback ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlayingPlayback ? 'Pause' : 'Replay'}</span>
          </button>

          <div className="flex items-center space-x-1 bg-[#0a0a0d] p-0.5 rounded-lg border border-white/5 font-mono text-[10px]">
            {([1, 2, 4] as const).map(s => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-2 py-0.5 rounded ${playbackSpeed === s ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-500'}`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. REAL GOOGLE MAPS CANVAS CONTAINER WITH RIGHT-SIDE OPERATIONAL WORKER DRAWER */}
      <div className="relative w-full h-[580px] sm:h-[640px] rounded-xl border border-white/10 overflow-hidden bg-[#05070c]">
        
        <MapContainer
          center={venueCenter}
          zoom={17}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          {/* REAL HIGH-DEFINITION GOOGLE MAPS TILE LAYER */}
          <TileLayer
            url={GOOGLE_MAPS_TILES[mapType]}
            attribution="&copy; Google Maps Platform"
            maxZoom={20}
          />

          {/* REAL STRUCTURAL VENUE BLUEPRINT POLYGONS */}
          {venuePolygons.map((poly, i) => (
            <Polygon
              key={i}
              positions={poly.coords}
              pathOptions={{
                color: poly.color,
                fillColor: poly.color,
                fillOpacity: 0.25,
                weight: 2,
                dashArray: '4, 4'
              }}
            >
              <Popup>
                <div className="text-xs font-bold text-zinc-100 font-mono">{poly.name}</div>
              </Popup>
            </Polygon>
          ))}

          {/* WORKER MARKERS ON GOOGLE MAPS */}
          {gisLayers.workers && filteredWorkers.map(w => {
            const lat = venueCenter[0] + (w.y - 50) * 0.00008;
            const lng = venueCenter[1] + (w.x - 50) * 0.00008;

            return (
              <React.Fragment key={w.id}>
                {/* ETA Reach Ring */}
                <Circle
                  center={[lat, lng]}
                  radius={50}
                  pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.1, weight: 1 }}
                />

                {/* Worker Marker */}
                <Marker
                  position={[lat, lng]}
                  icon={createWorkerIcon(w)}
                  eventHandlers={{
                    click: () => setSelectedWorkerCard(w)
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1 text-zinc-200">
                      <span className="font-bold text-zinc-100 block">{w.name} ({w.department})</span>
                      <span className="text-[10px] text-emerald-400 block font-mono">Battery: {w.battery}% • {w.speed}</span>
                      <span className="text-[10px] text-indigo-400 block font-mono">ETA: {w.eta} ({w.distance})</span>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

          {/* EMERGENCY INCIDENT MARKERS ON GOOGLE MAPS */}
          {tasks.map(t => {
            const lat = venueCenter[0] + (t.y - 50) * 0.00008;
            const lng = venueCenter[1] + (t.x - 50) * 0.00008;

            return (
              <Marker
                key={t.id}
                position={[lat, lng]}
                icon={createIncidentIcon(t)}
                eventHandlers={{
                  click: () => setDispatchModalIncidentId(t.id)
                }}
              >
                <Popup>
                  <div className="text-xs space-y-1 text-zinc-200">
                    <span className="font-bold text-red-400 block">{t.priority}: {t.title}</span>
                    <span className="text-[10px] text-zinc-400 block font-mono">Location: {t.location}</span>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* RIGHT-SIDE OPERATIONAL WORKER DRAWER (UBER DISPATCH SPEC) */}
        {selectedWorkerCard && (
          <div className="absolute top-4 right-4 bottom-4 z-[1000] w-full max-w-sm attio-card p-5 rounded-2xl border border-white/10 bg-[#111115] shadow-2xl overflow-y-auto space-y-4 animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                  {selectedWorkerCard.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">{selectedWorkerCard.name}</h3>
                  <span className="text-xs text-zinc-400">{selectedWorkerCard.department} Team • ID: {selectedWorkerCard.id}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedWorkerCard(null)} 
                className="text-zinc-500 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="bg-[#0a0a0d] p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Status</span>
                <span className={`text-xs font-bold ${selectedWorkerCard.status === 'GOING_TO_TASK' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {selectedWorkerCard.status}
                </span>
              </div>

              <div className="bg-[#0a0a0d] p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Supervisor</span>
                <span className="text-xs font-bold text-zinc-200">{selectedWorkerCard.supervisor}</span>
              </div>

              <div className="bg-[#0a0a0d] p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Battery & Signal</span>
                <span className="text-xs font-bold text-emerald-400">{selectedWorkerCard.battery}% • {selectedWorkerCard.network}</span>
              </div>

              <div className="bg-[#0a0a0d] p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Speed & GPS</span>
                <span className="text-xs font-bold text-indigo-400">{selectedWorkerCard.speed} ({selectedWorkerCard.gpsAccuracy})</span>
              </div>
            </div>

            {/* Current Active Task Card */}
            <div className="bg-[#0a0a0d] p-3.5 rounded-xl border border-amber-500/30 space-y-1">
              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">Current Assigned Task</span>
              <h4 className="text-xs font-bold text-zinc-100">{selectedWorkerCard.currentTask}</h4>
              <div className="flex items-center justify-between text-xs text-zinc-400 mt-1 font-mono">
                <span>ETA: <strong className="text-emerald-400">{selectedWorkerCard.eta}</strong></span>
                <span>Dist: <strong className="text-indigo-400">{selectedWorkerCard.distance}</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm">
                <Navigation className="w-3.5 h-3.5" /> Navigate
              </button>
              <button className="bg-white/5 hover:bg-white/10 text-zinc-200 py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Call
              </button>
              <button className="bg-white/5 hover:bg-white/10 text-zinc-200 py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Message
              </button>
              <button className="bg-white/5 hover:bg-white/10 text-zinc-200 py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10">
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Reassign
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default GoogleMapsGISCommandCenter;
