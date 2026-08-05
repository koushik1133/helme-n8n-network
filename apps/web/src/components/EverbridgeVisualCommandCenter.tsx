import React, { useState, useEffect } from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { 
  Layers, Play, Pause, FastForward, RotateCcw, User, Battery, Signal, 
  MapPin, Shield, Activity, Radio, AlertCircle, Phone, MessageSquare, 
  Navigation, RefreshCw, Eye, EyeOff, Zap, Flame, Camera, Wifi
} from 'lucide-react';

export const EverbridgeVisualCommandCenter: React.FC = () => {
  const { setSelectedWorkerDetail, setDispatchModalIncidentId } = useEventOpsStore();

  // 24 Layer Toggles State (Everbridge / RapidSOS style)
  const [layers, setLayers] = useState({
    workers: true,
    security: true,
    medical: true,
    electrical: true,
    audio: true,
    incidents: true,
    crowdHeatmap: true,
    breadcrumbs: true,
    etaRings: true,
    cctv: false,
    wifi: false,
    fireExtinguishers: false,
    barricades: false,
    entryGates: true,
    vehicles: false
  });

  // Replay Time Slider State
  const [isReplaying, setIsReplaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState<1 | 2 | 4>(1);
  const [replayMinute, setReplayMinute] = useState(10); // 10:00 to 10:30

  // Active Map Selection (Worker or Incident)
  const [selectedMapEntity, setSelectedMapEntity] = useState<any | null>(null);

  // Playback timer ticker
  useEffect(() => {
    let timer: any = null;
    if (isReplaying) {
      timer = setInterval(() => {
        setReplayMinute(prev => (prev + 1) % 30);
      }, 1500 / replaySpeed);
    }
    return () => clearInterval(timer);
  }, [isReplaying, replaySpeed]);

  const toggleLayer = (layerName: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  // Mock Workers with GPS Breadcrumbs & Telemetry (RapidSOS / Tablet Command)
  const workersData = [
    { 
      id: 'w-101', name: 'Raj Kumar', team: 'Lighting', supervisor: 'Ramesh', 
      battery: 82, speed: '4 km/h', eta: '1m 20s', task: 'Task #21 Spotlight Repair', 
      dist: '84m', network: '5G (Excellent)', gpsAcc: '3m', color: 'green',
      x: 35, y: 40, breadcrumbs: [{ x: 28, y: 48 }, { x: 30, y: 44 }, { x: 35, y: 40 }]
    },
    { 
      id: 'w-102', name: 'Dr. Ravi Kumar', team: 'Medical', supervisor: 'Dr. Priya', 
      battery: 88, speed: '6 km/h', eta: '38s', task: 'Gate 4 Emergency Response', 
      dist: '42m', network: '5G (Excellent)', gpsAcc: '2m', color: 'yellow',
      x: 25, y: 32, breadcrumbs: [{ x: 18, y: 25 }, { x: 21, y: 28 }, { x: 25, y: 32 }]
    },
    { 
      id: 'w-103', name: 'Vikram Security', team: 'Security', supervisor: 'Vikram Singh', 
      battery: 94, speed: '2 km/h', eta: 'Free', task: 'Zone B Stage Patrol', 
      dist: '120m', network: '4G', gpsAcc: '4m', color: 'green',
      x: 70, y: 28, breadcrumbs: [{ x: 65, y: 35 }, { x: 68, y: 31 }, { x: 70, y: 28 }]
    }
  ];

  // Mock Incidents (RapidSOS / Everbridge)
  const incidentData = [
    { id: 'inc-901', title: 'Gate 4 Medical Emergency', priority: 'EMERGENCY', category: 'MEDICAL', x: 23, y: 30, color: 'red' },
    { id: 'inc-902', title: 'Stage A Lighting Transformer Trip', priority: 'HIGH', category: 'LIGHTING', x: 72, y: 24, color: 'yellow' }
  ];

  const formatPlaybackTime = (min: number) => {
    const m = min < 10 ? `0${min}` : min;
    return `10:${m}:00 AM`;
  };

  return (
    <div className="attio-card w-full rounded-2xl border border-white/10 bg-[#0d0d10] p-4 sm:p-5 shadow-2xl space-y-4">
      
      {/* 1. TOP TITLE & LAYER TOGGLE CONTROLLER BAR */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-[#121215] p-3.5 rounded-xl border border-white/10">
        <div className="flex items-center space-x-2.5">
          <Layers className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-semibold text-zinc-100 tracking-tight flex items-center gap-2">
              <span>Everbridge Visual Command Center</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                RAPIDSOS UNITE + TABLET COMMAND GIS
              </span>
            </h2>
            <p className="text-[11px] text-zinc-500">Live Multi-Layer GIS Situational Awareness & Resource Dispatch</p>
          </div>
        </div>

        {/* Layer Filter Chips (24-Layer GIS Controller) */}
        <div className="flex items-center space-x-1.5 flex-wrap text-xs">
          <button
            onClick={() => toggleLayer('workers')}
            className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] font-mono ${layers.workers ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold' : 'bg-[#09090b] border-white/5 text-zinc-500'}`}
          >
            👷 Workers ({layers.workers ? 'ON' : 'OFF'})
          </button>

          <button
            onClick={() => toggleLayer('breadcrumbs')}
            className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] font-mono ${layers.breadcrumbs ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-semibold' : 'bg-[#09090b] border-white/5 text-zinc-500'}`}
          >
            📈 Breadcrumbs ({layers.breadcrumbs ? 'ON' : 'OFF'})
          </button>

          <button
            onClick={() => toggleLayer('etaRings')}
            className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] font-mono ${layers.etaRings ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-semibold' : 'bg-[#09090b] border-white/5 text-zinc-500'}`}
          >
            ⭕ ETA Rings ({layers.etaRings ? 'ON' : 'OFF'})
          </button>

          <button
            onClick={() => toggleLayer('crowdHeatmap')}
            className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] font-mono ${layers.crowdHeatmap ? 'bg-red-500/10 border-red-500/30 text-red-400 font-semibold' : 'bg-[#09090b] border-white/5 text-zinc-500'}`}
          >
            🔥 Heatmap ({layers.crowdHeatmap ? 'ON' : 'OFF'})
          </button>

          <button
            onClick={() => toggleLayer('cctv')}
            className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] font-mono ${layers.cctv ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-semibold' : 'bg-[#09090b] border-white/5 text-zinc-500'}`}
          >
            📷 CCTV ({layers.cctv ? 'ON' : 'OFF'})
          </button>
        </div>
      </div>

      {/* 2. REPLAY & PLAYBACK TIMELINE CONTROLLER */}
      <div className="bg-[#121215] p-3 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Historical Playback
          </span>
          <span className="font-mono font-bold text-indigo-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
            {formatPlaybackTime(replayMinute)}
          </span>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1 w-full sm:mx-4 flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="29"
            value={replayMinute}
            onChange={(e) => setReplayMinute(Number(e.target.value))}
            className="w-full h-1.5 bg-[#09090b] rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Playback Controls & Speed Toggles */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsReplaying(!isReplaying)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 text-xs ${
              isReplaying ? 'bg-amber-500 text-zinc-950' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isReplaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isReplaying ? 'Pause' : 'Replay'}</span>
          </button>

          <div className="flex items-center space-x-1 bg-[#09090b] p-0.5 rounded-lg border border-white/5 font-mono text-[10px]">
            {([1, 2, 4] as const).map(s => (
              <button
                key={s}
                onClick={() => setReplaySpeed(s)}
                className={`px-2 py-0.5 rounded ${replaySpeed === s ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-500'}`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. GIS MAP CANVAS WITH BREADCRUMBS, ETA RINGS & INCIDENTS */}
      <div className="relative w-full h-[480px] sm:h-[520px] rounded-xl border border-white/5 bg-[#09090b] overflow-hidden">
        
        {/* Background Radar Grid Texture */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#a1a1aa 1px, transparent 1px), radial-gradient(#27272a 1px, #09090b 1px)`,
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 15px 15px'
          }}
        />

        {/* Heatmap Layer Simulation */}
        {layers.crowdHeatmap && (
          <div className="absolute top-[18%] left-[20%] w-[180px] h-[180px] rounded-full bg-red-500/10 blur-2xl pointer-events-none animate-pulse" />
        )}

        {/* Geofence Outlines */}
        <div className="absolute top-[10%] left-[8%] w-[38%] h-[42%] border border-dashed border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-3 pointer-events-none">
          <span className="text-[10px] font-semibold text-emerald-400">ZONE A: MAIN GATE 4</span>
        </div>

        <div className="absolute top-[8%] right-[8%] w-[38%] h-[48%] border border-dashed border-amber-500/20 bg-amber-500/5 rounded-2xl p-3 pointer-events-none">
          <span className="text-[10px] font-semibold text-amber-400">ZONE B: VIP STAGE</span>
        </div>

        {/* BREADCRUMB TRAILS LAYER */}
        {layers.breadcrumbs && workersData.map(w => (
          <svg key={`bc-${w.id}`} className="absolute inset-0 w-full h-full pointer-events-none">
            <polyline
              points={w.breadcrumbs.map(b => `${(b.x / 100) * 800},${(b.y / 100) * 500}`).join(' ')}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.6"
            />
          </svg>
        ))}

        {/* WORKER PINS WITH ETA RINGS */}
        {layers.workers && workersData.map(w => (
          <div
            key={w.id}
            onClick={() => setSelectedMapEntity({ type: 'WORKER', data: w })}
            style={{ top: `${w.y}%`, left: `${w.x}%` }}
            className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          >
            {/* ETA Rings Layer */}
            {layers.etaRings && (
              <div className="absolute w-24 h-24 rounded-full border border-indigo-500/20 pointer-events-none -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 animate-pulse" />
            )}

            <div className="relative flex items-center justify-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-transform group-hover:scale-125 shadow-md ${
                w.color === 'green' ? 'bg-emerald-500/20 border-emerald-400' : 'bg-amber-500/20 border-amber-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${w.color === 'green' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </div>
            </div>

            {/* Hover Card */}
            <div className="hidden group-hover:block absolute bottom-7 left-1/2 -translate-x-1/2 w-48 attio-card p-2.5 rounded-xl border border-white/10 bg-[#121215] shadow-2xl z-40">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-zinc-100">{w.name}</span>
                <span className="text-emerald-400 font-mono text-[9px]">{w.speed}</span>
              </div>
              <span className="text-[10px] text-zinc-400 block mt-0.5">{w.task}</span>
              <span className="text-[9px] text-indigo-400 font-mono block mt-1">ETA: {w.eta} ({w.dist})</span>
            </div>
          </div>
        ))}

        {/* INCIDENT PINS */}
        {layers.incidents && incidentData.map(inc => (
          <div
            key={inc.id}
            onClick={() => setDispatchModalIncidentId(inc.id)}
            style={{ top: `${inc.y}%`, left: `${inc.x}%` }}
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-8 h-8 rounded-full bg-red-500/30 animate-ping" />
              <div className="w-6 h-6 rounded-full bg-red-600 border border-red-400 text-white flex items-center justify-center shadow-lg">
                <AlertCircle className="w-3.5 h-3.5 animate-bounce" />
              </div>
            </div>

            <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 w-52 attio-card p-2.5 rounded-xl border border-white/10 bg-[#121215] z-40">
              <span className="text-[10px] font-bold text-red-400 uppercase bg-red-500/10 px-1.5 py-0.2 rounded border border-red-500/20">
                {inc.priority}
              </span>
              <span className="text-xs font-semibold text-zinc-100 block mt-1">{inc.title}</span>
            </div>
          </div>
        ))}

        {/* SELECTED WORKER OPERATIONAL SIDE DRAWER (Tablets / Everbridge Spec) */}
        {selectedMapEntity && selectedMapEntity.type === 'WORKER' && (
          <div className="absolute bottom-4 left-4 z-40 attio-card p-4 rounded-xl border border-white/10 max-w-sm bg-[#121215] shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">{selectedMapEntity.data.name}</h4>
                <span className="text-[10px] text-zinc-500">{selectedMapEntity.data.team} • Sup: {selectedMapEntity.data.supervisor}</span>
              </div>
              <button onClick={() => setSelectedMapEntity(null)} className="text-zinc-500 hover:text-zinc-200 text-xs font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#0d0d10] p-2 rounded-lg border border-white/5">
                <span className="text-[9px] text-zinc-500 block">Battery & Speed</span>
                <span className="text-emerald-400 font-bold">{selectedMapEntity.data.battery}% • {selectedMapEntity.data.speed}</span>
              </div>
              <div className="bg-[#0d0d10] p-2 rounded-lg border border-white/5">
                <span className="text-[9px] text-zinc-500 block">ETA & Distance</span>
                <span className="text-indigo-400 font-bold">{selectedMapEntity.data.eta} ({selectedMapEntity.data.dist})</span>
              </div>
            </div>

            <div className="bg-[#0d0d10] p-2.5 rounded-lg border border-white/5 text-xs">
              <span className="text-[10px] text-zinc-500 block">Current Task</span>
              <span className="text-zinc-200 font-semibold">{selectedMapEntity.data.task}</span>
            </div>

            {/* Quick Actions (Navigate, Call, Message, Reassign) */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg flex items-center justify-center text-[10px] font-semibold gap-1">
                <Navigation className="w-3 h-3" /> Nav
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-zinc-200 p-2 rounded-lg flex items-center justify-center text-[10px] font-semibold gap-1">
                <Phone className="w-3 h-3 text-emerald-400" /> Call
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-zinc-200 p-2 rounded-lg flex items-center justify-center text-[10px] font-semibold gap-1">
                <MessageSquare className="w-3 h-3 text-cyan-400" /> Msg
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-zinc-200 p-2 rounded-lg flex items-center justify-center text-[10px] font-semibold gap-1">
                <RefreshCw className="w-3 h-3 text-amber-400" /> Reassign
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
