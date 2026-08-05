import React, { useState } from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { Mic, Sparkles, Check, Cpu, Zap, Layers } from 'lucide-react';

export const VoiceAICommandHero: React.FC = () => {
  const { assignWorkerToMultiDeptTask } = useEventOpsStore();
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    parsedDepartment: string;
    priority: string;
    rootCause: string;
    recommendedActions: { team: string; workerName: string; eta: string }[];
  } | null>(null);

  const handleMicClick = () => {
    setIsListening(true);
    setAiAnalysis(null);

    setTimeout(() => {
      setIsListening(false);
      const text = "Stage LED stopped working and backup generator fuel is low!";
      setTranscript(text);

      setAiAnalysis({
        parsedDepartment: 'Lighting & Generators',
        priority: 'HIGH',
        rootCause: 'Power Voltage Drop triggered Stage LED Tripping + Generator #3 Low Fuel (18%).',
        recommendedActions: [
          { team: 'Lighting', workerName: 'Raj Kumar (Electrician)', eta: '2 mins' },
          { team: 'Generators', workerName: 'Prakash Diesel Tech', eta: '3 mins' }
        ]
      });
    }, 1200);
  };

  const handleExecuteDispatch = (action: { team: string; workerName: string; eta: string }) => {
    assignWorkerToMultiDeptTask('task-102', action.workerName, action.team);
    setAiAnalysis(null);
    setTranscript('');
  };

  return (
    <div className="attio-card p-5 rounded-2xl bg-[#121215] border border-white/10 shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Title & Input Bar */}
        <div className="flex-1 w-full">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-zinc-100 tracking-tight">
              20-Department Conversational AI Dispatch Hero
            </h2>
            <span className="text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
              CROSS-DEPARTMENT INTENT ENGINE
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Tap Mic or Type: 'Generator 3 fuel low', 'Stage LED stopped working', 'Parking Gate C traffic'..."
              className="attio-input w-full pl-4 pr-12 py-3 rounded-xl text-xs sm:text-sm placeholder:text-zinc-500"
            />
            <button
              onClick={handleMicClick}
              className={`absolute right-2 p-2 rounded-xl transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isListening && (
        <div className="flex items-center space-x-2 text-xs text-indigo-400 bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
          <Cpu className="w-4 h-4 animate-spin" />
          <span>Parsing cross-department intent & calculating root cause across all 20 teams...</span>
        </div>
      )}

      {aiAnalysis && (
        <div className="p-4 rounded-xl bg-[#0d0d10] border border-white/10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-zinc-300 font-bold">Cross-Department Analysis:</span>
              <span className="bg-indigo-500/10 text-indigo-400 font-mono text-[11px] px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                {aiAnalysis.parsedDepartment}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">100% Precision Match</span>
          </div>

          <p className="text-xs text-cyan-300 bg-cyan-950/40 p-2 rounded border border-cyan-800/40 font-mono">
            💡 {aiAnalysis.rootCause}
          </p>

          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold text-zinc-400 block">Recommended Multi-Team Dispatch Actions:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {aiAnalysis.recommendedActions.map((action, i) => (
                <div key={action.workerName} className="bg-[#121215] p-3 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-100 block">{action.team}: {action.workerName}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">ETA: {action.eta}</span>
                  </div>
                  <button
                    onClick={() => handleExecuteDispatch(action)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Assign</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
