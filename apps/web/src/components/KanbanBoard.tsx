import React from 'react';
import { useEventOpsStore, TaskItem } from '../store/useEventOpsStore';
import { CheckCircle2, User, Cpu } from 'lucide-react';

const COLUMNS: { key: TaskItem['status']; label: string; color: string }[] = [
  { key: 'CREATED', label: 'Created / Analyzing', color: 'border-slate-800 bg-slate-950/40' },
  { key: 'DISPATCHED', label: 'Dispatched', color: 'border-blue-900/40 bg-blue-950/20' },
  { key: 'IN_TRANSIT', label: 'Worker In-Transit', color: 'border-amber-900/40 bg-amber-950/20' },
  { key: 'ON_SITE', label: 'Worker On-Site', color: 'border-indigo-900/40 bg-indigo-950/20' },
  { key: 'COMPLETED', label: 'Completed', color: 'border-emerald-900/40 bg-emerald-950/20' },
];

export const KanbanBoard: React.FC = () => {
  const { tasks, updateTaskStatus } = useEventOpsStore();

  const getPriorityStyle = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'EMERGENCY': return 'bg-red-500/20 text-red-400 border-red-500/40 pulse-glow';
      case 'URGENT': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'HIGH': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto p-1">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);

        return (
          <div key={col.key} className={`rounded-xl border ${col.color} p-3.5 flex flex-col min-h-[420px]`}>
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{col.label}</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {colTasks.length}
              </span>
            </div>

            {/* Task Cards */}
            <div className="flex-1 space-y-3">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  className="glass-card p-3.5 rounded-xl border border-slate-800 hover:border-blue-500/40 transition-all shadow-md group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-cyan-400" />
                        {task.category}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-white mb-2 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                      {task.title}
                    </h4>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 mt-2">
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        <span className="truncate max-w-[120px]">
                          {task.assigned_worker_id ? `Assigned: ${task.assigned_worker_id}` : 'Auto-Matching...'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Button */}
                    {task.status !== 'COMPLETED' && (
                      <button
                        onClick={() => {
                          const nextStatus: Record<TaskItem['status'], TaskItem['status']> = {
                            CREATED: 'DISPATCHED',
                            ANALYZED_BY_AI: 'DISPATCHED',
                            DISPATCHED: 'IN_TRANSIT',
                            IN_TRANSIT: 'ON_SITE',
                            ON_SITE: 'COMPLETED',
                            COMPLETED: 'COMPLETED'
                          };
                          updateTaskStatus(task.id, nextStatus[task.status]);
                        }}
                        className="mt-3 w-full py-2 bg-slate-800 hover:bg-blue-600 text-white text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Advance Status</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {colTasks.length === 0 && (
                <div className="h-28 flex items-center justify-center border border-dashed border-slate-800/60 rounded-xl">
                  <span className="text-xs text-slate-600 italic">No tasks</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
