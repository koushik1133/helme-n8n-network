import React from 'react';
import { Radio, AlertTriangle, Sparkles, Activity, ShieldCheck, Users } from 'lucide-react';
import { useEventOpsStore } from '../store/useEventOpsStore';

export const Header: React.FC = () => {
  const { eventName, crowdCount, workersOnline, workersBusy, tasks } = useEventOpsStore();
  const emergencyCount = tasks.filter(t => t.priority === 'EMERGENCY').length;

  return (
    <header className="glass-panel sticky top-0 z-40 px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 flex-shrink-0">
          <Radio className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">{eventName}</h1>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
              EventOS v2.0
            </span>
          </div>
          <p className="text-xs text-slate-400">Live Crowd: {crowdCount.toLocaleString()} Attendees</p>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2 sm:gap-4 w-full md:w-auto">
        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <Users className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Free Workers:</span>
          <span className="font-bold text-emerald-400">{workersOnline}</span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <Activity className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400">Busy Workers:</span>
          <span className="font-bold text-amber-400">{workersBusy}</span>
        </div>

        {emergencyCount > 0 ? (
          <div className="flex items-center space-x-2 bg-red-950/60 border border-red-500/60 px-3 py-1.5 rounded-xl pulse-glow text-xs">
            <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
            <span className="font-bold text-red-400">{emergencyCount} SOS EMERGENCY</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-400">Safe</span>
          </div>
        )}
      </div>
    </header>
  );
};
