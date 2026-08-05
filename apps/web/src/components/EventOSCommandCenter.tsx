import React, { useState } from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { 
  Users, AlertTriangle, ShieldAlert, Cpu, Clock, CheckCircle2, 
  Radio, Package, Activity, ArrowRight, UserCheck, Zap, BellRing, PhoneCall 
} from 'lucide-react';
import { LiveMapOverlay } from './LiveMapOverlay';
import { VoiceAICommandHero } from './VoiceAICommandHero';

export const EventOSCommandCenter: React.FC = () => {
  const { 
    eventName, crowdCount, workersOnline, workersBusy, workersOffline,
    tasks, skillGroups, aiSuggestions, resources, timeline,
    advanceTaskStatus, sendBroadcast
  } = useEventOpsStore();

  const [broadcastTarget, setBroadcastTarget] = useState('ALL_WORKERS');
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const criticalTasks = tasks.filter(t => t.priority === 'EMERGENCY');
  const highPriorityTasks = tasks.filter(t => t.priority === 'HIGH' || t.priority === 'URGENT');

  const handleBroadcastSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg) return;
    sendBroadcast(broadcastMsg, broadcastTarget);
    setBroadcastMsg('');
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      
      {/* 1. TOP EVENT STATUS HEADER BAR */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">{eventName}</h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
              LIVE COMMAND CENTER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time Operations • Venue Capacity: 60,000</p>
        </div>

        {/* Real-Time Metrics Group */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Live Crowd</span>
            <span className="text-lg font-black text-cyan-400">{crowdCount.toLocaleString()}</span>
          </div>

          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30 text-center">
            <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">Workers Free</span>
            <span className="text-lg font-black text-emerald-400">{workersOnline}</span>
          </div>

          <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-500/30 text-center">
            <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">Workers Busy</span>
            <span className="text-lg font-black text-amber-400">{workersBusy}</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Offline</span>
            <span className="text-lg font-black text-slate-400">{workersOffline}</span>
          </div>
        </div>
      </div>

      {/* 2. VOICE AI COMMAND HERO DISPATCH BAR */}
      <VoiceAICommandHero />

      {/* 3. 🔥 CRITICAL ACTION QUEUE (SLA Waiting Timers & Escalations) */}
      {criticalTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
            <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider">
              🔥 Critical Emergencies ({criticalTasks.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalTasks.map((t) => (
              <div 
                key={t.id}
                className="glass-card p-4 rounded-2xl border-2 border-red-500/60 bg-red-950/30 pulse-glow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black bg-red-600 text-white px-2.5 py-0.5 rounded-full">
                      EMERGENCY SOS
                    </span>
                    <span className="text-xs font-mono text-red-300 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-red-400" />
                      Waiting {t.waitingTimeSeconds}s
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white mb-2">{t.title}</h3>
                  <p className="text-xs text-slate-300 mb-3">Location: <strong>{t.location}</strong></p>
                </div>

                <div className="pt-3 border-t border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  {t.assignedWorker ? (
                    <div className="text-xs text-slate-300">
                      <span>Assigned: <strong className="text-emerald-400">{t.assignedWorker.name}</strong></span>
                      <span className="text-[10px] text-slate-400 block font-mono">ETA: {t.assignedWorker.eta} ({t.assignedWorker.dist})</span>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-400 font-bold">Auto-Matching Best Worker...</span>
                  )}

                  <button
                    onClick={() => advanceTaskStatus(t.id)}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Advance Status</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. 🤖 AI PROACTIVE RECOMMENDATIONS & HIGH PRIORITY QUEUE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: High Priority Queue & AI Suggestions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Suggestions Card */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-slate-950 to-cyan-950/30">
            <div className="flex items-center space-x-2 mb-3">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                AI Proactive Intelligence Suggestions
              </h3>
            </div>

            <div className="space-y-3">
              {aiSuggestions.map((sug) => (
                <div key={sug.id} className="bg-slate-900/90 p-3.5 rounded-xl border border-cyan-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-extrabold text-white block">{sug.title}</span>
                    <span className="text-xs text-slate-300 block">{sug.reason}</span>
                    <span className="text-xs text-cyan-400 font-semibold mt-1 block">💡 Action: {sug.recommendedAction}</span>
                  </div>
                  <button className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shrink-0">
                    Apply Suggestion
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* High Priority Tasks Queue */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                High Priority Queue ({highPriorityTasks.length})
              </h3>
            </div>

            <div className="space-y-3">
              {highPriorityTasks.map((t) => (
                <div key={t.id} className="glass-card p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                        {t.priority}
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono">{t.category}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white">{t.title}</h4>
                    <span className="text-xs text-slate-400">Location: {t.location}</span>
                  </div>

                  <button
                    onClick={() => advanceTaskStatus(t.id)}
                    className="bg-slate-800 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors shrink-0"
                  >
                    Advance
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Communication Center & Resource Inventory */}
        <div className="space-y-6">
          
          {/* Communication Center */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-2 mb-3">
              <Radio className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Broadcast Center</h3>
            </div>

            <form onSubmit={handleBroadcastSend} className="space-y-3">
              <select
                value={broadcastTarget}
                onChange={(e) => setBroadcastTarget(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="ALL_WORKERS">All 278 Online Workers</option>
                <option value="SUPERVISORS">Supervisors Only</option>
                <option value="SECURITY">Security Division</option>
                <option value="MEDICAL">Medical Division</option>
              </select>

              <textarea
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Type broadcast message or announcement..."
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <BellRing className="w-4 h-4" />
                <span>Send Broadcast Alert</span>
              </button>
            </form>
          </div>

          {/* Resource Inventory */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-2 mb-3">
              <Package className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Resource Inventory</h3>
            </div>

            <div className="space-y-2.5">
              {resources.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-300 font-medium">{r.name}</span>
                  <span className="font-mono font-bold text-cyan-400">{r.available} / {r.total} {r.unit}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 5. 👷 WORKERS BY SKILL / CATEGORY BREAKDOWN */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            Workers Operations Roster by Category
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skillGroups.map((group) => (
            <div key={group.category} className="glass-card p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h4 className="text-xs font-extrabold text-white">{group.category}</h4>
                  <span className="text-[10px] text-slate-400">Sup: {group.supervisor}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px]">
                  <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">{group.free} Free</span>
                  <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded">{group.busy} Busy</span>
                </div>
              </div>

              {/* Individual Worker Cards */}
              <div className="space-y-2">
                {group.workers.map((w) => (
                  <div key={w.id} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{w.name}</span>
                      <span className="text-[10px] text-slate-400">{w.dist} • Battery {w.battery}%</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${w.status.includes('Working') || w.status.includes('Assigned') ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      {w.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. ⏱️ COMMAND TIMELINE AUDIT STREAM */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          Real-Time Command Activity Timeline Audit
        </h3>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {timeline.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="font-mono text-slate-400 text-[10px]">{item.time}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-slate-200">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. 🗺️ TACTICAL MAP (AT THE BOTTOM - 20% OF SCREEN) */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            Tactical Spatial Map Overview (20% View)
          </h3>
        </div>
        <LiveMapOverlay />
      </div>

    </div>
  );
};
