import React from 'react';
import { Map, Grid, Cpu, FileCode, Camera } from 'lucide-react';

export type OperationalTab = 'MAP' | 'DEPARTMENTS' | 'KANBAN' | 'COPILOT' | 'CAD_EXPORTS';

interface Props {
  activeTab: OperationalTab;
  setActiveTab: (tab: OperationalTab) => void;
  onOpenCCTV: () => void;
}

export const OperationalTabNavigation: React.FC<Props> = ({ activeTab, setActiveTab, onOpenCCTV }) => {
  const tabs = [
    { id: 'MAP' as const, label: '🎯 Spatial GIS Map View', icon: Map },
    { id: 'DEPARTMENTS' as const, label: '🏢 20-Department Matrix', icon: Grid },
    { id: 'KANBAN' as const, label: '📋 Incident Dispatch Kanban', icon: Grid },
    { id: 'COPILOT' as const, label: '🤖 AI Decision Copilot & Voice', icon: Cpu },
    { id: 'CAD_EXPORTS' as const, label: '📁 CAD Importer & Audit Export', icon: FileCode }
  ];

  return (
    <div className="attio-card p-2 rounded-2xl border border-white/10 bg-[#111115] flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm">
      
      {/* Primary Tab Mode Buttons */}
      <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 text-xs">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2.5 rounded-xl border transition-all shrink-0 font-semibold flex items-center gap-2 ${
                isActive 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                  : 'bg-[#0a0a0d] border-white/5 text-zinc-400 hover:text-white hover:border-white/15'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* CCTV Camera Launcher Quick Button */}
      <button
        onClick={onOpenCCTV}
        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
      >
        <Camera className="w-4 h-4" />
        <span>Live CCTV Feed</span>
      </button>

    </div>
  );
};
