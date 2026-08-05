import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useEventOpsStore, WorkerCard, MultiDeptTask } from '../store/useEventOpsStore';
import { 
  Layers, Play, Pause, RotateCcw, User, Battery, Signal, Navigation, 
  Phone, MessageSquare, RefreshCw, AlertCircle, Zap, Shield, Flame, 
  Camera, Wifi, Eye, EyeOff, Radio, Compass, MapPin, Activity, Cpu
} from 'lucide-react';

// Venue Center Point (e.g. Major Stadium / Event Grounds)
const VENUE_CENTER: [number, number] = [78.4867, 17.3850];

// MAP STYLES
const MAP_STYLES = {
  DARK: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  LIGHT: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  VOYAGER: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
};

export const MapboxGISCommandCenter: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: maplibregl.Marker }>({});

  const { 
    workers, tasks, gisLayers, toggleGISLayer, 
    selectedDepartmentFilter, setSelectedWorkerCard, selectedWorkerCard,
    setDispatchModalIncidentId
  } = useEventOpsStore();

  const [mapStyle, setMapStyle] = useState<'DARK' | 'LIGHT' | 'VOYAGER'>('DARK');
  const [isPlayingPlayback, setIsPlayingPlayback] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);
  const [playbackMinute, setPlaybackMinute] = useState(12);

  // Playback timer loop
  useEffect(() => {
    let timer: any = null;
    if (isPlayingPlayback) {
      timer = setInterval(() => {
        setPlaybackMinute(prev => (prev + 1) % 30);
      }, 1500 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlayingPlayback, playbackSpeed]);

  // Filter workers based on department selector
  const filteredWorkers = workers.filter(w => {
    if (selectedDepartmentFilter === 'ALL') return true;
    return w.department.toLowerCase().includes(selectedDepartmentFilter.toLowerCase());
  });

  // INITIALIZE MAPLIBRE WEBGL ENGINE
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[mapStyle],
      center: VENUE_CENTER,
      zoom: 16.2,
      pitch: 45, // 3D Perspective Pitch
      bearing: -15
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      // 1. ADD VENUE STRUCTURAL BLUEPRINT POLYGONS (GEOJSON LAYER)
      map.addSource('venue-polygons', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            // MAIN STAGE & LED GRID POLYGON
            {
              type: 'Feature',
              properties: { name: 'MAIN STAGE & LED GRID', color: '#6366f1' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [78.4860, 17.3862],
                  [78.4875, 17.3862],
                  [78.4875, 17.3855],
                  [78.4860, 17.3855],
                  [78.4860, 17.3862]
                ]]
              }
            },
            // POWER & GENERATOR HUB POLYGON
            {
              type: 'Feature',
              properties: { name: 'POWER & GENERATOR HUB', color: '#f59e0b' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [78.4878, 17.3862],
                  [78.4888, 17.3862],
                  [78.4888, 17.3855],
                  [78.4878, 17.3855],
                  [78.4878, 17.3862]
                ]]
              }
            },
            // VIP LOUNGE & GATE 1 POLYGON
            {
              type: 'Feature',
              properties: { name: 'VIP LOUNGE & GATE 1', color: '#10b981' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [78.4845, 17.3854],
                  [78.4856, 17.3854],
                  [78.4856, 17.3844],
                  [78.4845, 17.3844],
                  [78.4845, 17.3854]
                ]]
              }
            },
            // MEDICAL TRAUMA CENTER POLYGON
            {
              type: 'Feature',
              properties: { name: 'MEDICAL TRAUMA CENTER', color: '#ef4444' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [78.4878, 17.3852],
                  [78.4888, 17.3852],
                  [78.4888, 17.3842],
                  [78.4878, 17.3842],
                  [78.4878, 17.3852]
                ]]
              }
            },
            // PARKING LOT C & SHUTTLE HUB
            {
              type: 'Feature',
              properties: { name: 'PARKING LOT C & SHUTTLE HUB', color: '#3b82f6' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [78.4865, 17.3840],
                  [78.4888, 17.3840],
                  [78.4888, 17.3832],
                  [78.4865, 17.3832],
                  [78.4865, 17.3840]
                ]]
              }
            }
          ]
        }
      });

      // Add Polygon Fill Layer
      map.addLayer({
        id: 'venue-polygons-fill',
        type: 'fill',
        source: 'venue-polygons',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.18
        }
      });

      // Add Polygon Outline Layer
      map.addLayer({
        id: 'venue-polygons-line',
        type: 'line',
        source: 'venue-polygons',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
          'line-dasharray': [2, 2]
        }
      });

      // 2. CROWD DENSITY HEATMAP LAYER
      map.addSource('crowd-heatmap', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', properties: { weight: 0.9 }, geometry: { type: 'Point', coordinates: [78.4867, 17.3852] } },
            { type: 'Feature', properties: { weight: 0.8 }, geometry: { type: 'Point', coordinates: [78.4860, 17.3854] } },
            { type: 'Feature', properties: { weight: 1.0 }, geometry: { type: 'Point', coordinates: [78.4870, 17.3848] } }
          ]
        }
      });

      map.addLayer({
        id: 'crowd-heatmap-layer',
        type: 'heatmap',
        source: 'crowd-heatmap',
        paint: {
          'heatmap-weight': ['get', 'weight'],
          'heatmap-intensity': 1.5,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,255,0)',
            0.4, 'rgba(0,255,255,0.4)',
            0.7, 'rgba(255,255,0,0.6)',
            1, 'rgba(255,0,0,0.8)'
          ],
          'heatmap-radius': 35
        }
      });

      // 3. LIVE ROUTE LINES LAYER (ANIMATED WORKER -> TASK TARGET)
      map.addSource('worker-routes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { worker: 'Raj Kumar' },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [78.4862, 17.3855],
                  [78.4868, 17.3860]
                ]
              }
            },
            {
              type: 'Feature',
              properties: { worker: 'Dr. Ravi Kumar' },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [78.4850, 17.3848],
                  [78.4852, 17.3850]
                ]
              }
            }
          ]
        }
      });

      map.addLayer({
        id: 'worker-routes-layer',
        type: 'line',
        source: 'worker-routes',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 3,
          'line-dasharray': [3, 2]
        }
      });
    });

    return () => {
      map.remove();
    };
  }, [mapStyle]);

  // UPDATE CUSTOM DEPARTMENT SVG MARKERS ON MAP
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Clear previous markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    // ADD WORKER MARKERS
    if (gisLayers.workers) {
      filteredWorkers.forEach(w => {
        // Map x, y percentages to real lat/lng coordinates near venue center
        const lng = 78.4867 + (w.x - 50) * 0.00008;
        const lat = 17.3850 + (w.y - 50) * 0.00008;

        const el = document.createElement('div');
        el.className = 'custom-worker-marker group cursor-pointer';
        el.innerHTML = `
          <div style="
            width: 34px; height: 34px; 
            border-radius: 10px; 
            background: #111115; 
            border: 2px solid ${w.status === 'GOING_TO_TASK' ? '#f59e0b' : '#10b981'}; 
            display: flex; align-items: center; justify-center; 
            font-size: 15px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            position: relative;
            transform: rotate(${w.x * 3}deg);
          ">
            <span style="margin: auto;">${w.icon}</span>
            <div style="
              position: absolute; top: -4px; right: -4px;
              width: 8px; height: 8px; border-radius: 50%;
              background: ${w.status === 'GOING_TO_TASK' ? '#f59e0b' : '#10b981'};
              box-shadow: 0 0 6px ${w.status === 'GOING_TO_TASK' ? '#f59e0b' : '#10b981'};
            "></div>
          </div>
        `;

        el.addEventListener('click', () => {
          setSelectedWorkerCard(w);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current[w.id] = marker;
      });
    }

    // ADD INCIDENT MARKERS
    tasks.forEach(t => {
      const lng = 78.4867 + (t.x - 50) * 0.00008;
      const lat = 17.3850 + (t.y - 50) * 0.00008;

      const el = document.createElement('div');
      el.className = 'custom-incident-marker cursor-pointer';
      el.innerHTML = `
        <div style="
          width: 32px; height: 32px; 
          border-radius: 50%; 
          background: ${t.priority === 'EMERGENCY' ? '#dc2626' : '#d97706'}; 
          border: 2px solid #ffffff; 
          display: flex; align-items: center; justify-center; 
          color: white; font-weight: bold; font-size: 14px;
          box-shadow: 0 0 15px ${t.priority === 'EMERGENCY' ? 'rgba(220,38,38,0.8)' : 'rgba(217,119,6,0.6)'};
          animation: pulse 1.5s infinite;
        ">
          🚨
        </div>
      `;

      el.addEventListener('click', () => {
        setDispatchModalIncidentId(t.id);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current[t.id] = marker;
    });

  }, [filteredWorkers, tasks, gisLayers, setSelectedWorkerCard, setDispatchModalIncidentId]);

  return (
    <div className="attio-card w-full rounded-2xl border border-white/10 bg-[#09090c] p-4 sm:p-5 shadow-2xl space-y-4">
      
      {/* 1. TOP GIS TITLE & STYLE SWITCHER BAR */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-[#111115] p-3.5 rounded-xl border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <h2 className="text-sm font-bold text-zinc-100 tracking-tight flex items-center gap-2">
              <span>Mapbox GL JS WebGL Operational GIS</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                UBER DISPATCH + GOOGLE MAPS ENGINE
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">Live 60fps Worker Telemetry, Vector GeoJSON Polygons & WebGL Heatmaps</p>
          </div>
        </div>

        {/* Map Style Controls */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[10px] text-zinc-500 font-mono uppercase">Map Style:</span>
          {(['DARK', 'LIGHT', 'VOYAGER'] as const).map(s => (
            <button
              key={s}
              onClick={() => setMapStyle(s)}
              className={`px-3 py-1 rounded-lg border transition-all text-xs font-mono font-semibold ${
                mapStyle === s ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#0a0a0d] border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {s}
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

      {/* 3. MAPLIBRE WEBGL MAP CANVAS CONTAINER WITH RIGHT-SIDE OPERATIONAL WORKER DRAWER */}
      <div className="relative w-full h-[580px] sm:h-[640px] rounded-xl border border-white/10 overflow-hidden bg-[#05070c]">
        
        {/* Map Container Target */}
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

        {/* RIGHT-SIDE OPERATIONAL WORKER DRAWER (UBER DISPATCH / RAPIDSOS SPEC) */}
        {selectedWorkerCard && (
          <div className="absolute top-4 right-4 bottom-4 z-40 w-full max-w-sm attio-card p-5 rounded-2xl border border-white/10 bg-[#111115] shadow-2xl overflow-y-auto space-y-4 animate-in slide-in-from-right duration-200">
            
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

            {/* Operational Telemetry Grid */}
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

            {/* Performance Stats */}
            <div className="bg-[#0a0a0d] p-3.5 rounded-xl border border-white/5 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Today's Dispatch History</span>
              
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Completed Tasks Today</span>
                <span className="font-mono font-bold text-emerald-400">{selectedWorkerCard.completedToday} Tasks</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-400">Current Shift</span>
                <span className="font-mono text-zinc-300">8:00 AM - 8:00 PM</span>
              </div>
            </div>

            {/* Action Buttons */}
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
};
