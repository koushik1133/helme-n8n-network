import React, { useState } from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { ReportIncidentModal } from './ReportIncidentModal';
import { BroadcastAlertModal } from './BroadcastAlertModal';
import { Plus, Radio, Zap, Shield, Search, RefreshCw, Compass } from 'lucide-react';

export const QuickMapActionDock: React.FC = () => {
  const { setSelectedDepartmentFilter, selectedDepartmentFilter } = useEventOpsStore();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-3">
      {/* 1. TOP QUICK DEPARTMENT FILTER CHIPS BAR */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 font-mono">
          Quick Filters:
        </span>

        <button
          onClick={() => setSelectedDepartmentFilter('ALL')}
          className={`px-3 py-1 rounded-lg border transition-all shrink-0 font-mono text-[11px] ${
            selectedDepartmentFilter === 'ALL' 
              ? 'bg-indigo-600 border-indigo-500 text-white font-bold' 
              : 'bg-[#111115] border-white/10 text-zinc-400 hover:text-white'
          }`}
        >
          All Departments (20)
        </button>

        {[
          { name: 'Lighting', icon: '⚡' },
          { name: 'Audio', icon: '🎤' },
          { name: 'Security & Patrol', icon: '🛡️' },
          { name: 'Medical & Doctors', icon: '🚑' },
          { name: 'Generators', icon: '⚙️' },
          { name: 'Parking & Traffic', icon: '🚗' }
        ].map(dept => (
          <button
            key={dept.name}
            onClick={() => setSelectedDepartmentFilter(dept.name)}
            className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 font-mono text-[11px] flex items-center gap-1 ${
              selectedDepartmentFilter === dept.name 
                ? 'bg-indigo-600 border-indigo-500 text-white font-bold' 
                : 'bg-[#111115] border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <span>{dept.icon}</span>
            <span>{dept.name}</span>
          </button>
        ))}
      </div>

      {/* 2. FLOATING DISPATCHER HANDY ACTION DOCK */}
      <div className="bg-[#111115] p-3 rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        
        {/* Quick Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search worker by name (e.g. Raj Kumar, Dr. Ravi) or ID..."
            className="attio-input w-full pl-9 pr-4 py-2 rounded-xl text-xs placeholder:text-zinc-500"
          />
        </div>

        {/* Handy Action Buttons */}
        <div className="flex items-center space-x-2 w-full md:w-auto shrink-0 justify-end">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Report Incident</span>
          </button>

          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            <Radio className="w-4 h-4" />
            <span>Broadcast Push Alert</span>
          </button>
        </div>

      </div>

      {/* Modals */}
      <ReportIncidentModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
      <BroadcastAlertModal isOpen={isBroadcastModalOpen} onClose={() => setIsBroadcastModalOpen(false)} />
    </div>
  );
};
