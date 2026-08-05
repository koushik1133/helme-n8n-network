import React from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { Shield, Sparkles, Building, Radio, Check } from 'lucide-react';

export const DEPLOYMENT_PRESETS = [
  { id: 'p-1', name: '🏟️ CM Public Rally (52,140 Attendees)', crowd: 52140, workers: 298, depts: 20, venue: 'Hyderabad Grounds' },
  { id: 'p-2', name: '🎸 World Music Stadium Concert (85,000 Fans)', crowd: 85000, workers: 450, depts: 20, venue: 'Olympic Stadium' },
  { id: 'p-3', name: '✈️ Int. Airport Security & Ops (120,000 Pax)', crowd: 120000, workers: 620, depts: 20, venue: 'Terminal 3 Hub' },
  { id: 'p-4', name: '🏎️ Formula 1 Grand Prix (110,000 Fans)', crowd: 110000, workers: 580, depts: 20, venue: 'Grand Prix Circuit' }
];

export const DeploymentPresetsBar: React.FC = () => {
  const { eventName, setEventPreset } = useEventOpsStore();

  return (
    <div className="attio-card p-4 rounded-2xl border border-white/10 bg-[#111115] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center space-x-2.5">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
          Event Profile Presets:
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 text-xs">
        {DEPLOYMENT_PRESETS.map((p) => {
          const isSelected = eventName.includes(p.name.split(' ')[1]);

          return (
            <button
              key={p.id}
              onClick={() => setEventPreset(p)}
              className={`px-3 py-1.5 rounded-xl border transition-all shrink-0 font-mono text-[11px] flex items-center gap-1.5 ${
                isSelected 
                  ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-sm' 
                  : 'bg-[#0a0a0d] border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <span>{p.name}</span>
              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
