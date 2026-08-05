import React, { useState } from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { User, AlertCircle, Battery, Signal, Zap } from 'lucide-react';

export const LiveMapOverlay: React.FC = () => {
  const { workers } = useEventOpsStore();
  const [filter, setFilter] = useState<'ALL' | 'AVAILABLE' | 'ASSIGNED' | 'EMERGENCY'>('ALL');
  const [selectedDot, setSelectedDot] = useState<any | null>(null);

  // All Green, Yellow, and Red dots rendered together inside ONE UNIFIED SPATIAL MAP
  const mapDots = [
    // 🟢 GREEN DOTS: Available Workers
    { id: 'w-503', type: 'WORKER', status: 'AVAILABLE', label: 'Security Guard', color: 'green', x: 22, y: 30, battery: 92, network: '5G', skills: ['SECURITY_GUARD'] },
    { id: 'w-504', type: 'WORKER', status: 'AVAILABLE', label: 'Medical Doctor', color: 'green', x: 42, y: 68, battery: 98, network: '5G', skills: ['FIRST_AID_CERTIFIED'] },
    { id: 'w-505', type: 'WORKER', status: 'AVAILABLE', label: 'Gate Patrol', color: 'green', x: 80, y: 40, battery: 76, network: '4G', skills: ['CROWD_CONTROL'] },
    { id: 'w-506', type: 'WORKER', status: 'AVAILABLE', label: 'Clean-up Crew', color: 'green', x: 60, y: 75, battery: 85, network: '5G', skills: ['CLEANING'] },

    // 🟡 YELLOW DOTS: Assigned Workers / Going to Work
    { id: 'w-501', type: 'WORKER', status: 'IN_TRANSIT', label: 'In-Transit to Gate 4', color: 'yellow', x: 30, y: 45, battery: 88, network: '5G', skills: ['FIRST_AID_CERTIFIED'] },
    { id: 'w-502', type: 'WORKER', status: 'ON_SITE', label: 'Electrician at Stage B', color: 'yellow', x: 72, y: 32, battery: 95, network: '4G', skills: ['ELECTRICIAN'] },
    { id: 'task-102', type: 'TASK', status: 'ACCEPTED', title: 'VIP Stage Spotlight Replacement', color: 'yellow', x: 76, y: 28, category: 'LIGHTING', priority: 'HIGH' },
    { id: 'task-103', type: 'TASK', status: 'DISPATCHED', title: 'Parking Lot Generator Check', color: 'yellow', x: 84, y: 65, category: 'GENERATOR', priority: 'MEDIUM' },

    // 🔴 RED DOTS: Emergency SOS & Critical Tasks
    { id: 'task-101', type: 'TASK', status: 'EMERGENCY_SOS', title: 'Gate 4 Attendee Medical Collapse', color: 'red', x: 26, y: 38, category: 'MEDICAL', priority: 'EMERGENCY' },
    { id: 'task-104', type: 'TASK', status: 'EMERGENCY_SOS', title: 'Stage Boundary Fence Pressure', color: 'red', x: 65, y: 22, category: 'SECURITY', priority: 'EMERGENCY' }
  ];

  const visibleDots = mapDots.filter(dot => {
    if (filter === 'AVAILABLE') return dot.color === 'green';
    if (filter === 'ASSIGNED') return dot.color === 'yellow';
    if (filter === 'EMERGENCY') return dot.color === 'red';
    return true;
  });

  return (
    <div className="attio-card relative w-full rounded-2xl border border-white/10 bg-[#0d0d10] overflow-hidden shadow-sm flex flex-col justify-between p-4 sm:p-5 min-h-[560px]">
      
      {/* Top Single Map Control Bar & Dot Legend Filters */}
      <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#121215] p-3.5 rounded-xl border border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <h3 className="text-xs sm:text-sm font-semibold text-zinc-100 tracking-tight flex items-center gap-2">
            <span>Unified Tactical Radar Map</span>
            <span className="text-[10px] text-zinc-400 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
              ATTIO SPATIAL VIEW
            </span>
          </h3>
        </div>

        {/* Color Dot Filter Legend Buttons */}
        <div className="flex items-center space-x-2 text-xs flex-wrap">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-lg border transition-all ${filter === 'ALL' ? 'bg-white/10 border-white/20 text-zinc-100 font-semibold' : 'text-zinc-400 border-white/5 hover:text-zinc-200'}`}
          >
            Show All ({mapDots.length})
          </button>
          
          {/* GREEN DOT FILTER */}
          <button
            onClick={() => setFilter('AVAILABLE')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg border transition-all ${filter === 'AVAILABLE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold' : 'bg-[#0d0d10] border-white/5 text-emerald-400 hover:border-emerald-500/30'}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
            <span>Green: Available ({mapDots.filter(d => d.color === 'green').length})</span>
          </button>

          {/* YELLOW DOT FILTER */}
          <button
            onClick={() => setFilter('ASSIGNED')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg border transition-all ${filter === 'ASSIGNED' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-semibold' : 'bg-[#0d0d10] border-white/5 text-amber-400 hover:border-amber-500/30'}`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
            <span>Yellow: Assigned ({mapDots.filter(d => d.color === 'yellow').length})</span>
          </button>

          {/* RED DOT FILTER */}
          <button
            onClick={() => setFilter('EMERGENCY')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg border transition-all ${filter === 'EMERGENCY' ? 'bg-red-500/10 border-red-500/30 text-red-400 font-semibold' : 'bg-[#0d0d10] border-white/5 text-red-400 hover:border-red-500/30'}`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm animate-ping" />
            <span>Red: Emergency SOS ({mapDots.filter(d => d.color === 'red').length})</span>
          </button>
        </div>
      </div>

      {/* ONE UNIFIED SINGLE TACTICAL VENUE MAP CANVAS */}
      <div className="relative w-full h-[440px] sm:h-[480px] my-3 rounded-xl border border-white/5 bg-[#09090b] overflow-hidden">
        
        {/* Background Radar Grid Texture */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#a1a1aa 1px, transparent 1px), radial-gradient(#27272a 1px, #09090b 1px)`,
            backgroundSize: '28px 28px',
            backgroundPosition: '0 0, 14px 14px'
          }}
        />

        {/* Venue Layout Geofence Regions Integrated into the Single Map */}
        <div className="absolute top-[12%] left-[8%] w-[38%] h-[42%] border border-dashed border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-3 flex flex-col justify-between pointer-events-none">
          <span className="text-xs font-semibold text-emerald-400/90 tracking-wider">ZONE A: MAIN GATE 4</span>
          <span className="text-[10px] text-zinc-500">4,500 Capacity • Entry Control</span>
        </div>

        <div className="absolute top-[8%] right-[8%] w-[38%] h-[48%] border border-dashed border-amber-500/20 bg-amber-500/5 rounded-2xl p-3 flex flex-col justify-between pointer-events-none">
          <span className="text-xs font-semibold text-amber-400/90 tracking-wider">ZONE B: VIP STAGE COMPLEX</span>
          <span className="text-[10px] text-zinc-500">Main Stage • Audio Control</span>
        </div>

        <div className="absolute bottom-[8%] left-[20%] w-[55%] h-[38%] border border-dashed border-blue-500/20 bg-blue-500/5 rounded-2xl p-3 flex flex-col justify-between pointer-events-none">
          <span className="text-xs font-semibold text-indigo-400/90 tracking-wider">ZONE C: MEDICAL & PARKING HUB</span>
          <span className="text-[10px] text-zinc-500">Emergency Ambulance Corridor</span>
        </div>

        {/* ALL GREEN, YELLOW & RED DOTS RENDERED SIMULTANEOUSLY ON THIS SINGLE MAP */}
        {visibleDots.map((dot) => {
          const isGreen = dot.color === 'green';
          const isYellow = dot.color === 'yellow';
          const isRed = dot.color === 'red';

          return (
            <div
              key={dot.id}
              onClick={() => setSelectedDot(dot)}
              style={{ top: `${dot.y}%`, left: `${dot.x}%` }}
              className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            >
              {/* Dot Graphic with Rings */}
              <div className="relative flex items-center justify-center">
                {isRed && (
                  <div className="absolute w-8 h-8 rounded-full bg-red-500/30 animate-ping" />
                )}

                <div 
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-transform group-hover:scale-125 shadow-md ${
                    isGreen 
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                      : isYellow 
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                      : 'bg-red-600 border-red-400 text-white'
                  }`}
                >
                  {isRed ? (
                    <AlertCircle className="w-3.5 h-3.5 text-white animate-bounce" />
                  ) : isYellow ? (
                    <Zap className="w-3 h-3 text-amber-300" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </div>
              </div>

              {/* Hover Tooltip Card */}
              <div className="hidden group-hover:block absolute bottom-7 left-1/2 -translate-x-1/2 w-48 attio-card p-2.5 rounded-xl border border-white/10 shadow-2xl z-40 pointer-events-none bg-[#121215]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-zinc-100">{dot.id}</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                    isGreen ? 'bg-emerald-500/10 text-emerald-400' : isYellow ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {dot.status}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-300 font-medium block leading-tight mb-1">
                  {dot.label || dot.title}
                </span>
                {dot.battery && (
                  <div className="flex items-center space-x-3 text-[9px] text-zinc-500 font-mono">
                    <span className="flex items-center gap-1"><Battery className="w-3 h-3 text-emerald-400" /> {dot.battery}%</span>
                    <span className="flex items-center gap-1"><Signal className="w-3 h-3 text-indigo-400" /> {dot.network}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Selected Dot Inspector Card */}
        {selectedDot && (
          <div className="absolute bottom-4 left-4 z-40 attio-card p-3.5 rounded-xl border border-white/10 max-w-xs shadow-2xl bg-[#121215] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-indigo-400">
                {selectedDot.type === 'WORKER' ? `Worker: ${selectedDot.id}` : `Task: ${selectedDot.id}`}
              </span>
              <button 
                onClick={() => setSelectedDot(null)} 
                className="text-zinc-500 hover:text-zinc-200 text-xs font-bold px-1.5 py-0.5 rounded bg-white/5"
              >
                ✕
              </button>
            </div>
            <div className="text-xs space-y-1 text-zinc-300">
              <p className="font-medium text-zinc-100">{selectedDot.label || selectedDot.title}</p>
              <p>Status: <strong className={
                selectedDot.color === 'green' ? 'text-emerald-400' : selectedDot.color === 'yellow' ? 'text-amber-400' : 'text-red-400'
              }>{selectedDot.status}</strong></p>
              {selectedDot.skills && <p>Skills: {selectedDot.skills.join(', ')}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Single Map Footer Legend */}
      <div className="relative z-20 bg-[#121215] px-4 py-2.5 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
        <div className="flex items-center space-x-5 flex-wrap">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm" /> 🟢 Green = Available Worker
          </span>
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-sm" /> 🟡 Yellow = Assigned / Going to Work
          </span>
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-ping shadow-sm" /> 🔴 Red = Emergency SOS
          </span>
        </div>
        <span className="font-mono text-zinc-500 text-[11px]">PostGIS Live Spatial Engine</span>
      </div>
    </div>
  );
};
