import React from 'react';
import { useEventOpsStore, IncidentItem } from '../store/useEventOpsStore';
import { ArrowRight } from 'lucide-react';

const STAGES: { key: IncidentItem['stage']; label: string; color: string }[] = [
  { key: 'WAITING', label: 'Waiting Dispatch', color: 'border-red-500/30 bg-red-500/5 text-red-400' },
  { key: 'ASSIGNED', label: 'Assigned', color: 'border-indigo-500/30 bg-indigo-500/5 text-indigo-400' },
  { key: 'TRAVELLING', label: 'In-Transit', color: 'border-amber-500/30 bg-amber-500/5 text-amber-400' },
  { key: 'WORKING', label: 'Working On-Site', color: 'border-blue-500/30 bg-blue-500/5 text-blue-400' },
  { key: 'VERIFICATION', label: 'Verification', color: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400' },
  { key: 'COMPLETED', label: 'Completed', color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' },
];

export const OperationsStageQueue: React.FC = () => {
  const { incidents, advanceIncidentStage, setDispatchModalIncidentId } = useEventOpsStore();

  return (
    <div className="attio-card p-5 rounded-2xl border border-white/10 bg-[#121215] space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
          Incident Operational Workflow Stages Queue
        </h3>
        <span className="text-xs text-zinc-500 font-mono">ServiceNow Major Incident Lifecycle</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto">
        {STAGES.map((s) => {
          const stageIncidents = incidents.filter(i => i.stage === s.key);

          return (
            <div key={s.key} className={`rounded-xl border ${s.color} p-3.5 flex flex-col justify-between min-h-[300px]`}>
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                  <span className="text-xs font-semibold">{s.label}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0d0d10] text-zinc-300 font-medium border border-white/10">
                    {stageIncidents.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {stageIncidents.map((inc) => (
                    <div 
                      key={inc.id}
                      onClick={() => setDispatchModalIncidentId(inc.id)}
                      className="bg-[#0d0d10] p-2.5 rounded-xl border border-white/5 hover:border-white/20 cursor-pointer transition-all shadow-sm group"
                    >
                      <span className="text-[9px] font-mono bg-white/5 text-zinc-400 px-1.5 py-0.2 rounded mb-1 inline-block">
                        {inc.category}
                      </span>
                      <h4 className="text-xs font-semibold text-zinc-100 group-hover:text-indigo-400 line-clamp-2">
                        {inc.title}
                      </h4>
                      {inc.assignedWorker && (
                        <span className="text-[10px] text-emerald-400 block mt-1 font-mono">
                          👤 {inc.assignedWorker.name} ({inc.assignedWorker.eta})
                        </span>
                      )}
                    </div>
                  ))}

                  {stageIncidents.length === 0 && (
                    <div className="h-20 flex items-center justify-center border border-dashed border-white/5 rounded-xl">
                      <span className="text-[10px] text-zinc-600 italic">No tasks</span>
                    </div>
                  )}
                </div>
              </div>

              {stageIncidents.length > 0 && s.key !== 'COMPLETED' && (
                <button
                  onClick={() => advanceIncidentStage(stageIncidents[0].id)}
                  className="mt-3 w-full py-1.5 bg-white/5 hover:bg-indigo-600 text-zinc-200 hover:text-white text-[10px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 border border-white/10"
                >
                  <span>Advance Stage</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
