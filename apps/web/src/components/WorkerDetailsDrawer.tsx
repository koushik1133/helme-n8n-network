import React from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { X, User, Battery, Signal, MapPin } from 'lucide-react';

export const WorkerDetailsDrawer: React.FC = () => {
  const { selectedWorkerDetail, setSelectedWorkerDetail } = useEventOpsStore();

  if (!selectedWorkerDetail) return null;

  const w = selectedWorkerDetail;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#121215] border-l border-white/10 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-200 text-zinc-100">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-200">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100">{w.name}</h2>
            <span className="text-xs text-zinc-500">{w.team} • ID: {w.id}</span>
          </div>
        </div>

        <button
          onClick={() => setSelectedWorkerDetail(null)}
          className="text-zinc-500 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Operational Stats Grid */}
      <div className="space-y-4 my-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0d0d10] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-zinc-500 uppercase font-medium tracking-wider block">Status</span>
            <span className={`text-xs font-semibold ${w.status === 'AVAILABLE' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {w.status}
            </span>
          </div>

          <div className="bg-[#0d0d10] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-zinc-500 uppercase font-medium tracking-wider block">Supervisor</span>
            <span className="text-xs font-semibold text-zinc-200">{w.supervisor}</span>
          </div>

          <div className="bg-[#0d0d10] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-zinc-500 uppercase font-medium tracking-wider block">Battery & Network</span>
            <div className="flex items-center space-x-2 text-xs text-zinc-300 mt-0.5 font-mono">
              <span className="flex items-center gap-1"><Battery className="w-3.5 h-3.5 text-emerald-400" /> {w.battery}%</span>
              <span className="flex items-center gap-1"><Signal className="w-3.5 h-3.5 text-indigo-400" /> {w.network}</span>
            </div>
          </div>

          <div className="bg-[#0d0d10] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-zinc-500 uppercase font-medium tracking-wider block">Shift Hours</span>
            <span className="text-xs font-semibold text-zinc-300 font-mono">{w.shift}</span>
          </div>
        </div>

        {/* Current Active Task Card */}
        {w.currentTask && (
          <div className="bg-[#0d0d10] p-4 rounded-xl border border-amber-500/30 space-y-1">
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">Current Task</span>
            <h4 className="text-xs font-semibold text-zinc-100">{w.currentTask}</h4>
            <span className="text-xs text-zinc-400 block">ETA to completion: <strong className="text-emerald-400">{w.eta}</strong></span>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="bg-[#0d0d10] p-4 rounded-xl border border-white/5 space-y-2">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Performance Today</span>
          
          <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
            <span className="text-zinc-400">Tasks Completed Today</span>
            <span className="font-mono font-semibold text-emerald-400">{w.completedToday} Tasks</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1.5">
            <span className="text-zinc-400">Average Response Time</span>
            <span className="font-mono font-semibold text-indigo-400">{w.avgResponseSec} seconds</span>
          </div>
        </div>

        {/* Live Location Marker info */}
        <div className="bg-[#0d0d10] p-3.5 rounded-xl border border-white/5 text-xs flex items-center space-x-2 text-zinc-300">
          <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>Live Location: <strong className="text-zinc-100">{w.location}</strong></span>
        </div>
      </div>
    </div>
  );
};
