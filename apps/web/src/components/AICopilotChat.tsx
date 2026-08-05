import React, { useState } from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { Cpu, Send, Check } from 'lucide-react';

export const AICopilotChat: React.FC = () => {
  const { copilotMessages, sendCopilotMessage, approveAiRecommendation } = useEventOpsStore();
  const [inputQuery, setInputQuery] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery) return;
    sendCopilotMessage(inputQuery);
    setInputQuery('');
  };

  return (
    <div className="attio-card p-5 rounded-2xl border border-white/10 bg-[#121215] flex flex-col h-[480px] shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
            EventOS AI Copilot (Decision Engine)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded font-medium">
          PALANTIR + CHATGPT DISPATCH
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-2">
        {copilotMessages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'MANAGER' ? 'items-end' : 'items-start'}`}
          >
            <div className={`p-3 rounded-2xl max-w-[88%] text-xs space-y-2 ${
              msg.sender === 'MANAGER' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-[#0d0d10] border border-white/10 text-zinc-200 rounded-bl-none'
            }`}>
              <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1 mb-1 text-[10px]">
                <span className="font-medium">{msg.sender === 'MANAGER' ? 'Operations Manager' : 'AI Copilot'}</span>
                <span className="text-zinc-400 font-mono">{msg.timestamp}</span>
              </div>
              <p className="leading-relaxed">{msg.text}</p>

              {/* Structured AI Decision & Dispatch Recommendation Card */}
              {msg.structuredRecommendation && (
                <div className="mt-2 p-3 rounded-xl bg-[#121215] border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-indigo-400 font-semibold">
                    <span>💡 {msg.structuredRecommendation.title}</span>
                    <span className="text-emerald-400 font-mono">{msg.structuredRecommendation.crowdIncrease}</span>
                  </div>
                  
                  <div className="text-[11px] text-zinc-300 space-y-1">
                    <p>Reason: <strong className="text-zinc-100">{msg.structuredRecommendation.reason}</strong></p>
                    <p>Recommendation: <strong className="text-indigo-300">{msg.structuredRecommendation.recommendation}</strong></p>
                    <p>Estimated Resolution: <strong className="text-emerald-400">{msg.structuredRecommendation.estimatedResolution}</strong></p>
                  </div>

                  <button
                    onClick={() => approveAiRecommendation(msg.structuredRecommendation!.title)}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-1.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Dispatch ({msg.structuredRecommendation.actionTarget})</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="pt-2 border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask AI: 'Why is Gate B crowded?' or 'Recommend doctor dispatch'..."
          className="attio-input flex-1 px-3.5 py-2 rounded-xl text-xs placeholder:text-zinc-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition-colors shrink-0 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
