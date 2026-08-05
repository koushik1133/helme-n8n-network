import React from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { Users } from 'lucide-react';

export const TeamHealthOverloadMatrix: React.FC = () => {
  const { supervisors, setSelectedWorkerDetail } = useEventOpsStore();

  return (
    <div className="attio-card p-5 rounded-2xl border border-white/10 bg-[#121215] space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          Supervisor Teams Health & Overload Matrix
        </h3>
        <span className="text-xs text-zinc-500 font-mono">D4H / Veoci Operational Matrix</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {supervisors.map((s) => {
          const loadPercent = Math.round((s.activeTasks / s.workerCount) * 100);
          const isOverloaded = loadPercent > 40;

          return (
            <div 
              key={s.team}
              className={`p-4 rounded-xl border transition-all ${
                isOverloaded 
                  ? 'bg-red-500/5 border-red-500/30' 
                  : 'bg-[#0d0d10] border-white/5'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-100">{s.team}</h4>
                  <span className="text-xs text-zinc-500">Sup: {s.name}</span>
                </div>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  isOverloaded ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {isOverloaded ? 'HIGH LOAD' : 'OPTIMAL'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs my-3">
                <div className="bg-[#121215] p-2 rounded-lg border border-white/5 text-center">
                  <span className="text-[10px] text-zinc-500 block">Workers</span>
                  <span className="font-semibold text-zinc-100">{s.workerCount} Active</span>
                </div>

                <div className="bg-[#121215] p-2 rounded-lg border border-white/5 text-center">
                  <span className="text-[10px] text-zinc-500 block">Tasks Busy</span>
                  <span className={`font-semibold ${s.activeTasks > 5 ? 'text-amber-400' : 'text-zinc-300'}`}>
                    {s.activeTasks} Busy
                  </span>
                </div>

                <div className="bg-[#121215] p-2 rounded-lg border border-white/5 text-center">
                  <span className="text-[10px] text-zinc-500 block">Escalations</span>
                  <span className="font-semibold text-red-400">{s.escalations}</span>
                </div>

                <div className="bg-[#121215] p-2 rounded-lg border border-white/5 text-center">
                  <span className="text-[10px] text-zinc-500 block">Avg Response</span>
                  <span className="font-semibold text-indigo-400">{s.avgResponseSec}s</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedWorkerDetail({
                  id: 'w-201',
                  name: `${s.team} Representative`,
                  team: s.team,
                  supervisor: s.name,
                  currentTask: 'Active Operations Monitoring',
                  eta: '1 min',
                  battery: 88,
                  network: '5G',
                  shift: '8:00 AM - 8:00 PM',
                  completedToday: 17,
                  avgResponseSec: s.avgResponseSec,
                  location: 'Zone A Control Hub',
                  status: 'AVAILABLE'
                })}
                className="w-full attio-btn-secondary text-xs py-1.5 rounded-lg text-center"
              >
                View Worker Details Drawer
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
