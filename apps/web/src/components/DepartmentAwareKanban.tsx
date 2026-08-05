import React from 'react';
import { useEventOpsStore, MultiDeptTask } from '../store/useEventOpsStore';
import { ArrowRight, Check, AlertCircle, Cpu } from 'lucide-react';

const KANBAN_STAGES: { key: MultiDeptTask['stage']; label: string }[] = [
  { key: 'WAITING', label: 'Waiting Dispatch' },
  { key: 'ASSIGNED', label: 'Assigned' },
  { key: 'TRAVELLING', label: 'In-Transit' },
  { key: 'WORKING', label: 'Working On-Site' },
  { key: 'VERIFICATION', label: 'Verification' },
  { key: 'COMPLETED', label: 'Completed' },
];

export const DepartmentAwareKanban: React.FC = () => {
  const { 
    tasks, departments, selectedDepartmentFilter, setSelectedDepartmentFilter,
    advanceTaskStage, assignWorkerToMultiDeptTask 
  } = useEventOpsStore();

  const filteredTasks = tasks.filter(t => {
    if (selectedDepartmentFilter === 'ALL') return true;
    return t.department.toLowerCase().includes(selectedDepartmentFilter.toLowerCase());
  });

  return (
    <div className="attio-card p-5 rounded-2xl border border-white/10 bg-[#121215] space-y-4 shadow-sm">
      
      {/* Header & Department Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
          Department-Aware Operations Workflow Kanban
        </h3>

        {/* Quick Department Filter Selector */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1">
          <button
            onClick={() => setSelectedDepartmentFilter('ALL')}
            className={`px-3 py-1 rounded-lg border transition-all text-xs shrink-0 font-mono ${
              selectedDepartmentFilter === 'ALL' ? 'bg-indigo-600 border-indigo-500 text-white font-bold' : 'bg-[#0d0d10] border-white/5 text-zinc-400'
            }`}
          >
            All Departments
          </button>
          
          {['Lighting', 'Audio', 'Security', 'Generators', 'Parking', 'Medical'].map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDepartmentFilter(dept)}
              className={`px-2.5 py-1 rounded-lg border transition-all text-xs shrink-0 font-mono ${
                selectedDepartmentFilter === dept ? 'bg-indigo-600 border-indigo-500 text-white font-bold' : 'bg-[#0d0d10] border-white/5 text-zinc-400'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Lanes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto">
        {KANBAN_STAGES.map((s) => {
          const laneTasks = filteredTasks.filter(t => t.stage === s.key);

          return (
            <div key={s.key} className="rounded-xl border border-white/10 bg-[#0d0d10] p-3 flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                  <span className="text-xs font-semibold text-zinc-300">{s.label}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#121215] text-zinc-400 font-bold border border-white/10">
                    {laneTasks.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {laneTasks.map((t) => (
                    <div 
                      key={t.id}
                      className="bg-[#121215] p-3 rounded-xl border border-white/10 space-y-1.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold bg-white/5 text-indigo-400 px-1.5 py-0.2 rounded">
                          {t.department}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          t.priority === 'EMERGENCY' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {t.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-zinc-100">{t.title}</h4>

                      {/* Multi-Team AI Root Cause Analysis */}
                      {t.rootCauseAnalysis && (
                        <p className="text-[10px] text-cyan-300 bg-cyan-950/40 p-1.5 rounded border border-cyan-800/40">
                          💡 {t.rootCauseAnalysis}
                        </p>
                      )}

                      {/* Assigned Workers */}
                      {t.assignedWorkers.length > 0 && (
                        <div className="pt-1 border-t border-white/5">
                          {t.assignedWorkers.map(w => (
                            <span key={w.name} className="text-[10px] text-emerald-400 block font-mono">
                              👤 {w.name} ({w.dept} • {w.eta})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Advance Button */}
                      {s.key !== 'COMPLETED' && (
                        <button
                          onClick={() => advanceTaskStage(t.id)}
                          className="w-full mt-2 py-1 bg-white/5 hover:bg-indigo-600 text-zinc-300 hover:text-white text-[10px] font-bold rounded flex items-center justify-center gap-1 border border-white/10 transition-colors"
                        >
                          <span>Advance Stage</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}

                  {laneTasks.length === 0 && (
                    <div className="h-20 flex items-center justify-center border border-dashed border-white/5 rounded-lg">
                      <span className="text-[10px] text-zinc-600 italic">No tasks</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
