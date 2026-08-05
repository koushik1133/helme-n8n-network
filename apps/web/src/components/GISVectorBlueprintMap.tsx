import React, { useState } from 'react';
import { useEventOpsStore, WorkerCard, MultiDeptTask } from '../store/useEventOpsStore';
import { 
  Layers, User, Battery, Signal, Navigation, Phone, 
  MessageSquare, RefreshCw, AlertCircle, Zap, Shield, Flame, Camera, Radio
} from 'lucide-react';

export const GISVectorBlueprintMap: React.FC = () => {
  const { 
    workers, tasks, gisLayers, toggleGISLayer, 
    selectedDepartmentFilter, setSelectedWorkerCard, selectedWorkerCard
  } = useEventOpsStore();

  const [hoveredEntity, setHoveredEntity] = useState<any | null>(null);

  // Filter workers based on 20-department selector
  const filteredWorkers = workers.filter(w => {
    if (selectedDepartmentFilter === 'ALL') return true;
    return w.department.toLowerCase().includes(selectedDepartmentFilter.toLowerCase());
  });

  return (
    <div className="attio-card w-full rounded-2xl border border-white/10 bg-[#070a12] p-4 sm:p-5 shadow-2xl space-y-4">
      
      {/* 1. MAP HEADER & 20-LAYER GIS TOGGLES CONTROLLER */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 bg-[#121215] p-3.5 rounded-xl border border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <h2 className="text-sm font-bold text-zinc-100 tracking-tight flex items-center gap-2">
              <span>PostGIS Vector Blueprint Map Canvas</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                MAPBOX / POSTGIS ENGINE
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">Live 20-Department GPS Tracking & GeoJSON Polygon Layers</p>
          </div>
        </div>

        {/* GIS Layer Toggles */}
        <div className="flex items-center space-x-1.5 flex-wrap text-[11px] font-mono">
          <button
            onClick={() => toggleGISLayer('workers')}
            className={`px-2.5 py-1 rounded-lg border transition-all ${gisLayers.workers ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold' : 'bg-[#09090b] border-white/5 text-zinc-500'}`}
          >
            👷 Workers ({gisLayers.workers ? 'ON' : 'OFF'})
          </button>

          <button
            onClick={() => toggleGISLayer('crowdDensity')}
            className={`px-2.5 py-1 rounded-lg border transition-all ${gisLayers.crowdDensity ? 'bg-red-500/10 border-red-500/30 text-red-400 font-bold' : 'bg-[#09090b] border-white/5 text-zinc-500'}`}
          >
            📈 Heatmap ({gisLayers.crowdDensity ? 'ON' : 'OFF'})
          </button>

          <button
            onClick={() => toggleGISLayer('powerLines')}
            className={`px-2.5 py-1 rounded-lg border transition-all ${gisLayers.powerLines ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold' : 'bg-[#09090b] border-white/5 text-zinc-500'}`}
          >
            ⚡ Power Grid ({gisLayers.powerLines ? 'ON' : 'OFF'})
          </button>

          <button
            onClick={() => toggleGISLayer('generators')}
            className={`px-2.5 py-1 rounded-lg border transition-all ${gisLayers.generators ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold' : 'bg-[#09090b] border-white/5 text-zinc-500'}`}
          >
            ⚙️ Generators ({gisLayers.generators ? 'ON' : 'OFF'})
          </button>

          <button
            onClick={() => toggleGISLayer('cameras')}
            className={`px-2.5 py-1 rounded-lg border transition-all ${gisLayers.cameras ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold' : 'bg-[#09090b] border-white/5 text-zinc-500'}`}
          >
            📹 CCTV ({gisLayers.cameras ? 'ON' : 'OFF'})
          </button>
        </div>
      </div>

      {/* 2. MAIN REAL STRUCTURAL VENUE BLUEPRINT MAP CANVAS */}
      <div className="relative w-full h-[520px] sm:h-[580px] rounded-xl border border-white/10 bg-[#05070e] overflow-hidden">
        
        {/* Vector CAD Grid Lines */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, #05070e 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Crowd Heatmap Density Simulation */}
        {gisLayers.crowdDensity && (
          <div className="absolute top-[18%] left-[22%] w-[200px] h-[200px] rounded-full bg-red-500/15 blur-3xl pointer-events-none animate-pulse" />
        )}

        {/* ACTUAL STRUCTURAL VENUE BLUEPRINT POLYGONS */}
        
        {/* MAIN STAGE & LED WALL */}
        <div className="absolute top-[5%] left-[30%] w-[40%] h-[18%] border-2 border-indigo-500/40 bg-indigo-950/20 rounded-xl p-3 flex flex-col justify-between pointer-events-none shadow-lg shadow-indigo-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-indigo-300 tracking-wider">🎪 MAIN STAGE & LED WALL GRID [██████████]</span>
            <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded">ZONE B1</span>
          </div>
          <div className="flex items-center space-x-3 text-[10px] text-zinc-400 font-mono">
            <span>Audio Console</span>
            <span>Spotlight Grid #1-#8</span>
            <span>VIP Front Corridor</span>
          </div>
        </div>

        {/* POWER & GENERATOR SUBSTATION */}
        {gisLayers.generators && (
          <div className="absolute top-[5%] right-[5%] w-[20%] h-[20%] border-2 border-amber-500/40 bg-amber-950/20 rounded-xl p-2.5 pointer-events-none">
            <span className="text-xs font-bold text-amber-400 block">⚙️ POWER & GENERATOR HUB</span>
            <span className="text-[10px] text-zinc-400 block mt-1">Generator #1-#4 • Grid 440V</span>
          </div>
        )}

        {/* VIP LOUNGE & ENTRY GATE 1 */}
        <div className="absolute top-[28%] left-[5%] w-[22%] h-[30%] border-2 border-emerald-500/30 bg-emerald-950/15 rounded-xl p-2.5 pointer-events-none">
          <span className="text-xs font-bold text-emerald-400 block">⭐ VIP LOUNGE & GATE 1</span>
          <span className="text-[10px] text-zinc-400 block mt-1">VVIP Entry • Escort Patrol</span>
        </div>

        {/* MAIN ATTENDEE CROWD ARENA */}
        <div className="absolute top-[28%] left-[30%] w-[40%] h-[40%] border-2 border-dashed border-cyan-500/20 bg-cyan-950/10 rounded-2xl p-3 pointer-events-none flex flex-col justify-between">
          <span className="text-xs font-bold text-cyan-400">🏟️ MAIN CROWD ARENA (52,140 ATTENDEES)</span>
          <span className="text-[10px] text-zinc-500 font-mono">PA Sound Towers #1-#16 • Wifi Access Point Grid</span>
        </div>

        {/* MEDICAL & AMBULANCE CORRIDOR */}
        {gisLayers.medical && (
          <div className="absolute top-[30%] right-[5%] w-[20%] h-[35%] border-2 border-red-500/40 bg-red-950/20 rounded-xl p-2.5 pointer-events-none">
            <span className="text-xs font-bold text-red-400 block">🚑 MEDICAL TRAUMA CENTER</span>
            <span className="text-[10px] text-zinc-400 block mt-1">Ambulance Emergency Exit 4</span>
          </div>
        )}

        {/* PARKING GATE C & OUTER ROAD */}
        {gisLayers.parking && (
          <div className="absolute bottom-[5%] right-[5%] w-[40%] h-[20%] border-2 border-blue-500/30 bg-blue-950/15 rounded-xl p-2.5 pointer-events-none">
            <span className="text-xs font-bold text-blue-400 block">🚗 PARKING LOT C & TRAFFIC CORRIDOR</span>
            <span className="text-[10px] text-zinc-400 block mt-1">Vehicle Ingress • Shuttle Bus Hub</span>
          </div>
        )}

        {/* CONTROL ROOM & VOLUNTEER HUB */}
        <div className="absolute bottom-[5%] left-[5%] w-[38%] h-[20%] border-2 border-slate-700 bg-slate-900/40 rounded-xl p-2.5 pointer-events-none">
          <span className="text-xs font-bold text-zinc-300 block">🏢 COMMAND CONTROL ROOM & VOLUNTEER HUB</span>
          <span className="text-[10px] text-zinc-400 block mt-1">Housekeeping & Water Supply Depot</span>
        </div>

        {/* LIVE ROUTE LINES LAYER (WORKER -> ASSIGNED TASK TARGET) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
          {workers.map(w => {
            if (w.routeCoordinates.length < 2) return null;
            const p1 = w.routeCoordinates[0];
            const p2 = w.routeCoordinates[1];
            return (
              <g key={`route-${w.id}`}>
                <line
                  x1={`${p1.x}%`}
                  y1={`${p1.y}%`}
                  x2={`${p2.x}%`}
                  y2={`${p2.y}%`}
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  opacity="0.8"
                />
                <circle cx={`${p2.x}%`} cy={`${p2.y}%`} r="6" fill="#38bdf8" opacity="0.4" />
              </g>
            );
          })}
        </svg>

        {/* DEPARTMENT-SPECIFIC WORKER PINS WITH LIVE HEADING VECTORS */}
        {gisLayers.workers && filteredWorkers.map(w => {
          const isGoingToTask = w.status === 'GOING_TO_TASK';

          return (
            <div
              key={w.id}
              onClick={() => setSelectedWorkerCard(w)}
              onMouseEnter={() => setHoveredEntity(w)}
              onMouseLeave={() => setHoveredEntity(null)}
              style={{ top: `${w.y}%`, left: `${w.x}%` }}
              className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            >
              {/* Marker Pin Icon */}
              <div className="relative flex items-center justify-center">
                {isGoingToTask && (
                  <div className="absolute w-7 h-7 rounded-full bg-amber-500/30 animate-ping" />
                )}
                
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shadow-xl border transition-transform group-hover:scale-125 ${
                  isGoingToTask 
                    ? 'bg-amber-500/30 border-amber-400 text-amber-300' 
                    : 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                }`}>
                  <span>{w.icon}</span>
                </div>
              </div>

              {/* Hover Name Chip */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-slate-950/90 text-white font-mono text-[9px] px-1.5 py-0.5 rounded border border-white/10 whitespace-nowrap">
                {w.name}
              </div>
            </div>
          );
        })}

        {/* INCIDENT PINS WITH RADAR PULSE */}
        {tasks.map(t => (
          <div
            key={t.id}
            style={{ top: `${t.y}%`, left: `${t.x}%` }}
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center">
              {t.priority === 'EMERGENCY' && (
                <div className="absolute w-9 h-9 rounded-full bg-red-500/40 animate-ping" />
              )}

              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold shadow-2xl border ${
                t.priority === 'EMERGENCY' ? 'bg-red-600 border-red-400 pulse-glow' : 'bg-amber-600 border-amber-400'
              }`}>
                <AlertCircle className="w-4 h-4 animate-bounce text-white" />
              </div>
            </div>

            <div className="hidden group-hover:block absolute bottom-9 left-1/2 -translate-x-1/2 w-52 attio-card p-2.5 rounded-xl border border-white/10 bg-[#121215] z-40">
              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.2 rounded border border-red-500/20">
                {t.priority}
              </span>
              <span className="text-xs font-semibold text-zinc-100 block mt-1">{t.title}</span>
            </div>
          </div>
        ))}

        {/* SELECTED WORKER DETAILED OPERATIONAL CARD (CLICKED WORKER) */}
        {selectedWorkerCard && (
          <div className="absolute bottom-4 left-4 z-40 attio-card p-4 rounded-xl border border-white/10 max-w-sm bg-[#121215] shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <span className="text-base">{selectedWorkerCard.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">{selectedWorkerCard.name}</h4>
                  <span className="text-[10px] text-zinc-400">{selectedWorkerCard.department} Team • Sup: {selectedWorkerCard.supervisor}</span>
                </div>
              </div>
              <button onClick={() => setSelectedWorkerCard(null)} className="text-zinc-500 hover:text-zinc-200 text-xs font-bold px-1.5 py-0.5 rounded bg-white/5">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#0d0d10] p-2 rounded-lg border border-white/5">
                <span className="text-[9px] text-zinc-500 block">Battery & Speed</span>
                <span className="text-emerald-400 font-bold">{selectedWorkerCard.battery}% • {selectedWorkerCard.speed}</span>
              </div>
              <div className="bg-[#0d0d10] p-2 rounded-lg border border-white/5">
                <span className="text-[9px] text-zinc-500 block">ETA & Distance</span>
                <span className="text-indigo-400 font-bold">{selectedWorkerCard.eta} ({selectedWorkerCard.distance})</span>
              </div>
            </div>

            <div className="bg-[#0d0d10] p-2.5 rounded-lg border border-white/5 text-xs">
              <span className="text-[10px] text-zinc-500 block">Current Assigned Task</span>
              <span className="text-zinc-200 font-semibold">{selectedWorkerCard.currentTask}</span>
            </div>

            {/* Actions: Call, Message, Reassign, Route */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg flex items-center justify-center text-[10px] font-bold gap-1">
                <Navigation className="w-3 h-3" /> Route
              </button>
              <button className="bg-white/5 hover:bg-white/10 text-zinc-200 p-2 rounded-lg flex items-center justify-center text-[10px] font-semibold gap-1 border border-white/5">
                <Phone className="w-3 h-3 text-emerald-400" /> Call
              </button>
              <button className="bg-white/5 hover:bg-white/10 text-zinc-200 p-2 rounded-lg flex items-center justify-center text-[10px] font-semibold gap-1 border border-white/5">
                <MessageSquare className="w-3 h-3 text-cyan-400" /> Msg
              </button>
              <button className="bg-white/5 hover:bg-white/10 text-zinc-200 p-2 rounded-lg flex items-center justify-center text-[10px] font-semibold gap-1 border border-white/5">
                <RefreshCw className="w-3 h-3 text-amber-400" /> Reassign
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
