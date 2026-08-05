import React from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { Grid, Check, AlertTriangle, Users } from 'lucide-react';

export const DepartmentOperationsMatrix: React.FC = () => {
  const { departments, selectedDepartmentFilter, setSelectedDepartmentFilter } = useEventOpsStore();

  return (
    <div className="attio-card p-5 rounded-2xl border border-white/10 bg-[#121215] space-y-4 shadow-sm">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2.5">
          <Grid className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
            20-Department Operational Command Matrix
          </h3>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setSelectedDepartmentFilter('ALL')}
            className={`px-3 py-1 rounded-lg border transition-all text-xs ${
              selectedDepartmentFilter === 'ALL' 
                ? 'bg-indigo-600 border-indigo-500 text-white font-bold' 
                : 'bg-[#0d0d10] border-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            All 20 Departments ({departments.length})
          </button>
        </div>
      </div>

      {/* 20 Department Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {departments.map((dept) => {
          const isSelected = selectedDepartmentFilter === dept.name;

          return (
            <div
              key={dept.id}
              onClick={() => setSelectedDepartmentFilter(dept.name)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-[#18181c] border-indigo-500 shadow-md shadow-indigo-500/10' 
                  : dept.status === 'WARNING'
                  ? 'bg-[#141010] border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-[#0d0d10] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-base">{dept.icon}</span>
                  <span className="text-xs font-bold text-zinc-100">{dept.name}</span>
                </div>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                  dept.status === 'WARNING' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {dept.status}
                </span>
              </div>

              {/* Metrics */}
              <div className="text-[11px] text-zinc-400 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Workers:</span>
                  <span className="text-zinc-200 font-bold">{dept.totalWorkers} ({dept.freeWorkers} Free, {dept.busyWorkers} Busy)</span>
                </div>
                <div className="flex justify-between">
                  <span>Sup:</span>
                  <span className="text-zinc-300">{dept.supervisor}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Response:</span>
                  <span className="text-indigo-400 font-bold">{dept.avgResponseSec}s</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
