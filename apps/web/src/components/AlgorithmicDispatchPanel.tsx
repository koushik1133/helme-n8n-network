import React from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { X, Check, Battery, Signal, Cpu } from 'lucide-react';

export const AlgorithmicDispatchPanel: React.FC = () => {
  const { 
    dispatchModalIncidentId, setDispatchModalIncidentId, 
    incidents, assignCandidateToIncident 
  } = useEventOpsStore();

  if (!dispatchModalIncidentId) return null;

  const incident = incidents.find(i => i.id === dispatchModalIncidentId);
  if (!incident) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="attio-card w-full max-w-xl rounded-2xl border border-white/10 bg-[#121215] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0d10]">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-zinc-100">Algorithmic Dispatch Panel</h2>
          </div>
          <button
            onClick={() => setDispatchModalIncidentId(null)}
            className="text-zinc-500 hover:text-zinc-200 p-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Incident Summary Card */}
        <div className="p-6 space-y-4">
          <div className="bg-[#0d0d10] p-4 rounded-xl border border-white/5 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono">
                {incident.priority}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">{incident.category}</span>
            </div>
            <h3 className="text-base font-semibold text-zinc-100">{incident.title}</h3>
            <p className="text-xs text-zinc-400">Location: <strong className="text-zinc-200">{incident.location}</strong></p>
          </div>

          {/* Candidates Ranking List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Ranked Candidate Matches
              </h4>
              <span className="text-[10px] text-zinc-500 font-mono">PostGIS Spatial Weighted Score</span>
            </div>

            <div className="space-y-2">
              {incident.candidates.map((c, index) => (
                <div 
                  key={c.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    index === 0 
                      ? 'bg-[#16161a] border-emerald-500/40' 
                      : 'bg-[#0d0d10] border-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      index === 0 ? 'bg-emerald-500 text-zinc-950' : 'bg-white/5 text-zinc-400'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-zinc-100">{c.name}</span>
                        {index === 0 && (
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-semibold">
                            TOP MATCH
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-[10px] text-zinc-400 mt-0.5 font-mono">
                        <span>Dist: {c.dist}</span>
                        <span className="flex items-center gap-0.5"><Battery className="w-3 h-3 text-emerald-400" /> {c.battery}%</span>
                        <span>Score: <strong className="text-indigo-400">{c.score}</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => assignCandidateToIncident(incident.id, c.name)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-sm ${
                      index === 0 
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950' 
                        : 'attio-btn-secondary'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Assign</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
