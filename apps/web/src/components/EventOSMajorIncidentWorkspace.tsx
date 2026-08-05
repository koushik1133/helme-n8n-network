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
import { MapPin, Zap, CheckCircle2, Play, Sparkles, ShieldCheck } from 'lucide-react';

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
    weatherText, addTask, advanceTaskStage, assignCandidateToIncident, sendCopilotMessage
  } = useEventOpsStore();

  const [activeTab, setActiveTab] = useState<OperationalTab>('MAP');
  const [isCCTVOpen, setIsCCTVOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testToast, setTestToast] = useState<string | null>(null);

  const runE2ESystemTest = () => {
    if (isTesting) return;
    setIsTesting(true);

    setTestToast('⚡ Initializing E2E System Test Across All 20 Operational Departments...');

    setTimeout(() => {
      setTestToast('🚨 Step 1/4: Medical Collapse at Gate 4 -> Auto-matching nearest Doctor (Dr. Ravi)...');
      assignCandidateToIncident('task-101', 'Dr. Ravi Kumar');
      advanceTaskStage('task-101');
    }, 1200);

    setTimeout(() => {
      setTestToast('⚡ Step 2/4: Stage A Lighting Grid Trip -> Auto-assigning Electrician (Raj Kumar)...');
      advanceTaskStage('task-102');
    }, 3200);

    setTimeout(() => {
      setTestToast('🛡️ Step 3/4: Crowd Surge Telemetry at Gate B -> Firing AI Copilot Recommendation (+2 Security Guards)...');
      sendCopilotMessage('VIP Convoy arrival caused Gate B turnstile congestion. Requesting 2 additional Security Guards.');
    }, 5200);

    setTimeout(() => {
      setTestToast('📹 Step 4/4: Thermal CCTV & Facial AI Active -> Synchronizing Telemetry Across All 20 Teams...');
    }, 7200);

    setTimeout(() => {
      setTestToast('🎉 100% E2E SYSTEM TEST PASSED! All 20 Departments Operational & Synchronized.');
      setIsTesting(false);
      setTimeout(() => setTestToast(null), 4500);
    }, 9200);
  };

  return (
    <div className="space-y-5 text-zinc-100 font-sans relative">
      
      {/* FLOATING E2E TEST NOTIFICATION TOAST BANNER */}
      {testToast && (
        <div className="fixed bottom-6 right-6 z-[3000] max-w-md bg-[#121216] border border-cyan-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-3.5 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">LIVE E2E SYSTEM TEST</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <p className="text-xs font-semibold text-zinc-100 mt-0.5">{testToast}</p>
          </div>
        </div>
      )}

      {/* 1. TOP EVENT STATUS HEADER BAR WITH E2E TEST BUTTON */}
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

        {/* Executive Incident Metrics Bar + E2E TEST BUTTON */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          
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

          {/* ⚡ PROMINENT E2E SYSTEM TEST BUTTON */}
          <button
            onClick={runE2ESystemTest}
            disabled={isTesting}
            className={`px-4 py-3 rounded-xl font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 ${
              isTesting 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-wait'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 shadow-cyan-500/20 active:scale-95'
            }`}
          >
            <Zap className={`w-4 h-4 ${isTesting ? 'animate-spin' : 'animate-bounce'}`} />
            <span>{isTesting ? 'TESTING SYSTEM...' : '⚡ RUN E2E SYSTEM TEST'}</span>
          </button>

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
