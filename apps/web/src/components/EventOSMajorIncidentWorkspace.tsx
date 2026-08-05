import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { ActionRequiredModal } from './ActionRequiredModal';
import { VoiceAICommandHero } from './VoiceAICommandHero';
import { DeploymentPresetsBar } from './DeploymentPresetsBar';
import { EnvironmentalHazardBanner } from './EnvironmentalHazardBanner';
import { OperationalTabNavigation, OperationalTab } from './OperationalTabNavigation';
import { QuickMapActionDock } from './QuickMapActionDock';
import { DepartmentOperationsMatrix } from './DepartmentOperationsMatrix';
import { DepartmentAwareKanban } from './DepartmentAwareKanban';
import { AICopilotChat } from './AICopilotChat';
import { IncidentTimelineAudit } from './IncidentTimelineAudit';
import { CustomVenueCADUploader } from './CustomVenueCADUploader';
import { AuditReportExporter } from './AuditReportExporter';
import { LiveCCTVFeedModal } from './LiveCCTVFeedModal';
import { AlgorithmicDispatchPanel } from './AlgorithmicDispatchPanel';
import { WorkerDetailsDrawer } from './WorkerDetailsDrawer';
import { MapPin } from 'lucide-react';

const GoogleMapsGISCommandCenter = dynamic(
  () => import('./GoogleMapsGISCommandCenter'),
  { 
    ssr: false,
    loading: () => (
      <div className="attio-card w-full h-[580px] rounded-2xl bg-[#09090c] border border-white/10 flex items-center justify-center space-x-3 text-indigo-400">
        <MapPin className="w-6 h-6 animate-bounce" />
        <span className="text-sm font-semibold">Loading High-Definition Google Maps GIS Engine...</span>
      </div>
    )
  }
);

export const EventOSMajorIncidentWorkspace: React.FC = () => {
  const { 
    eventName, crowdCount, criticalIncidentsCount, highIncidentsCount, 
    mediumIncidentsCount, totalWorkersOnline, healthyDeptsCount, totalDeptsCount, 
    weatherText 
  } = useEventOpsStore();

  const [activeTab, setActiveTab] = useState<OperationalTab>('MAP');
  const [isCCTVOpen, setIsCCTVOpen] = useState(false);

  return (
    <div className="space-y-5 text-zinc-100 font-sans">
      
      {/* 1. TOP EVENT STATUS HEADER BAR */}
      <div className="attio-card p-5 rounded-2xl border border-white/10 bg-[#111115] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-100">{eventName}</h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              ENTERPRISE EVENTOS PLATFORM
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Venue Capacity: 60,000 • Total Operational Departments: 20</p>
        </div>

        {/* Executive Incident Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 w-full xl:w-auto text-center font-mono">
          
          <div className="bg-[#0a0a0d] p-2.5 rounded-xl border border-white/5">
            <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Attendees</span>
            <span className="text-sm font-extrabold text-cyan-400">{crowdCount.toLocaleString()}</span>
          </div>

          <div className="bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
            <span className="text-[9px] text-red-400 uppercase font-semibold block">Critical</span>
            <span className="text-sm font-extrabold text-red-400">{criticalIncidentsCount}</span>
          </div>

          <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[9px] text-amber-400 uppercase font-semibold block">High</span>
            <span className="text-sm font-extrabold text-amber-400">{highIncidentsCount}</span>
          </div>

          <div className="bg-[#0a0a0d] p-2.5 rounded-xl border border-white/5">
            <span className="text-[9px] text-zinc-400 uppercase font-semibold block">Medium</span>
            <span className="text-sm font-extrabold text-zinc-300">{mediumIncidentsCount}</span>
          </div>

          <div className="bg-[#0a0a0d] p-2.5 rounded-xl border border-white/5">
            <span className="text-[9px] text-emerald-400 uppercase font-semibold block">Workers</span>
            <span className="text-sm font-extrabold text-emerald-400">{totalWorkersOnline}</span>
          </div>

          <div className="bg-[#0a0a0d] p-2.5 rounded-xl border border-white/5">
            <span className="text-[9px] text-zinc-400 uppercase font-semibold block">Depts Healthy</span>
            <span className="text-sm font-extrabold text-emerald-400">{healthyDeptsCount}/{totalDeptsCount}</span>
          </div>

          <div className="bg-[#0a0a0d] p-2.5 rounded-xl border border-white/5">
            <span className="text-[9px] text-zinc-400 uppercase font-semibold block">Weather</span>
            <span className="text-sm font-extrabold text-indigo-400">{weatherText}</span>
          </div>

        </div>
      </div>

      {/* 2. EVENT DEPLOYMENT PRESETS SWITCHER BAR */}
      <DeploymentPresetsBar />

      {/* 3. ENVIRONMENTAL SAFETY & WEATHER HAZARD BANNER */}
      <EnvironmentalHazardBanner />

      {/* 4. 🚨 FLOATING TOP ACTION REQUIRED MODAL */}
      <ActionRequiredModal />

      {/* 5. ⚡ TABBED OPERATIONAL NAVIGATION BAR */}
      <OperationalTabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenCCTV={() => setIsCCTVOpen(true)} 
      />

      {/* TAB CONTENT VIEWS */}
      {activeTab === 'MAP' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <QuickMapActionDock />
          <GoogleMapsGISCommandCenter />
        </div>
      )}

      {activeTab === 'DEPARTMENTS' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <DepartmentOperationsMatrix />
        </div>
      )}

      {activeTab === 'KANBAN' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <DepartmentAwareKanban />
          <IncidentTimelineAudit />
        </div>
      )}

      {activeTab === 'COPILOT' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <VoiceAICommandHero />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AICopilotChat />
            <IncidentTimelineAudit />
          </div>
        </div>
      )}

      {activeTab === 'CAD_EXPORTS' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <CustomVenueCADUploader />
          <AuditReportExporter />
        </div>
      )}

      {/* MODAL DRAWERS & OVERLAYS */}
      <LiveCCTVFeedModal isOpen={isCCTVOpen} onClose={() => setIsCCTVOpen(false)} />
      <AlgorithmicDispatchPanel />
      <WorkerDetailsDrawer />

    </div>
  );
};
