import React from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { AlertCircle, Clock, Check, UserCheck, X } from 'lucide-react';

export const ActionRequiredModal: React.FC = () => {
  const { 
    actionRequiredIncidentId, setActionRequiredIncidentId, 
    incidents, assignCandidateToIncident, setDispatchModalIncidentId 
  } = useEventOpsStore();

  if (!actionRequiredIncidentId) return null;

  const incident = incidents.find(i => i.id === actionRequiredIncidentId);
  if (!incident) return null;

  const topCandidate = incident.candidates && incident.candidates.length > 0 ? incident.candidates[0] : null;

  return (
    <div className="w-full attio-card p-5 rounded-2xl border-l-4 border-l-red-500 border-t border-r border-b border-white/10 bg-[#121215] shadow-2xl transition-all">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left Action Banner Header */}
        <div className="flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-[11px] font-bold text-red-400 tracking-wider uppercase bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                Action Required Immediately
              </span>
              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                Waiting {incident.waitingSeconds}s
              </span>
            </div>

            <h2 className="text-base font-semibold text-zinc-100 mt-1 tracking-tight">
              {incident.title}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Location: <strong className="text-zinc-200 font-medium">{incident.location}</strong> • Category: <strong className="text-indigo-400 font-medium">{incident.category}</strong>
            </p>
          </div>
        </div>

        {/* Middle AI Candidate Recommendation Preview */}
        {topCandidate && (
          <div className="bg-[#0d0d10] p-3 rounded-xl border border-white/5 text-xs space-y-1 w-full md:w-auto">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider block">AI Top Match Recommendation</span>
            <div className="flex items-center space-x-2">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-zinc-100">{topCandidate.name}</span>
              <span className="text-emerald-400 font-mono text-[11px]">({topCandidate.dist} | ETA 1m)</span>
            </div>
          </div>
        )}

        {/* Right Decision Action Buttons */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto justify-end">
          {topCandidate && (
            <button
              onClick={() => assignCandidateToIncident(incident.id, topCandidate.name)}
              className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Approve AI Assignment ({topCandidate.name})</span>
            </button>
          )}

          <button
            onClick={() => setDispatchModalIncidentId(incident.id)}
            className="flex-1 md:flex-none attio-btn-secondary text-xs px-3.5 py-2.5 rounded-xl shadow-sm"
          >
            Assign Someone Else
          </button>

          <button
            onClick={() => setActionRequiredIncidentId(null)}
            className="text-zinc-500 hover:text-zinc-300 p-2 rounded-xl border border-white/5 hover:border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
