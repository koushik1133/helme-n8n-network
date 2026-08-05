import React from 'react';
import { CloudRain, Zap, Wind, Thermometer, ShieldAlert } from 'lucide-react';

export const EnvironmentalHazardBanner: React.FC = () => {
  return (
    <div className="attio-card p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-amber-400 uppercase tracking-wider block font-mono">
            Environmental Safety & Weather Alert Engine
          </span>
          <span className="text-[11px] text-zinc-300">
            Clear 28°C • Wind Speed: 14 km/h • Humidity: 42% • No active severe weather hazards.
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center space-x-3 text-[11px] font-mono shrink-0">
        <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          <Wind className="w-3.5 h-3.5" /> Stage Rigging Safe
        </span>
        <span className="flex items-center gap-1 text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
          <Thermometer className="w-3.5 h-3.5" /> Heat Index Normal
        </span>
      </div>
    </div>
  );
};
