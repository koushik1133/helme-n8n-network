import React from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { Clock, Check } from 'lucide-react';

export const IncidentTimelineAudit: React.FC = () => {
  const { incidents, selectedTimelineIncidentId, setSelectedTimelineIncidentId } = useEventOpsStore();

  const selectedIncident = incidents.find(i => i.id === selectedTimelineIncidentId) || incidents[0];

  return (
    <div className="attio-card p-5 rounded-2xl border border-white/10 bg-[#121215] space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          Incident Lifecycle Audit Timeline
        </h3>

        {/* Incident Selector */}
        <select
          value={selectedTimelineIncidentId || ''}
          onChange={(e) => setSelectedTimelineIncidentId(e.target.value)}
          className="attio-input rounded-lg px-2.5 py-1 text-xs text-zinc-200"
        >
          {incidents.map((inc) => (
            <option key={inc.id} value={inc.id}>
              {inc.id}: {inc.title.substring(0, 35)}...
            </option>
          ))}
        </select>
      </div>

      {selectedIncident && (
        <div className="space-y-3">
          <div className="text-xs text-zinc-300">
            <span className="font-semibold text-zinc-100">{selectedIncident.title}</span> • Stage: <strong className="text-emerald-400">{selectedIncident.stage}</strong>
          </div>

          {/* Timeline Sequence */}
          <div className="relative pl-6 space-y-2.5 border-l border-white/10 my-3">
            {selectedIncident.timeline.map((step, idx) => (
              <div key={idx} className="relative flex items-center justify-between text-xs bg-[#0d0d10] p-2.5 rounded-xl border border-white/5">
                <span className="absolute -left-[29px] w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-[#121215]" />
                <span className="font-mono text-zinc-500 text-[10px]">{step.time}</span>
                <span className="text-zinc-200 font-medium">{step.event}</span>
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
