import React, { useState } from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { X, Radio, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

export const BroadcastAlertModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { sendCopilotMessage, departments } = useEventOpsStore();
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [targetDept, setTargetDept] = useState('ALL');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage) return;

    sendCopilotMessage(`📢 EMERGENCY BROADCAST ALERT TO [${targetDept}]: "${broadcastMessage}"`);
    setSentSuccess(true);

    setTimeout(() => {
      setSentSuccess(false);
      setBroadcastMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="attio-card w-full max-w-lg rounded-2xl border border-red-500/40 bg-[#111115] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 text-zinc-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">Ground Worker Emergency Push Broadcast</h3>
              <span className="text-xs text-zinc-400">Send Instant Walkie-Talkie Push Alert to 298 Responders</span>
            </div>
          </div>

          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="py-8 text-center space-y-2 text-emerald-400 animate-in zoom-in-95 duration-150">
            <CheckCircle2 className="w-10 h-10 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-zinc-100">Broadcast Alert Sent Successfully!</h4>
            <p className="text-xs text-zinc-400">Dispatched push notification & audio siren to all ground worker terminals.</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Target Department Audience</label>
              <select
                value={targetDept}
                onChange={(e) => setTargetDept(e.target.value)}
                className="attio-input w-full px-3.5 py-2.5 rounded-xl text-xs font-mono"
              >
                <option value="ALL">📢 ALL 20 DEPARTMENTS (298 GROUND WORKERS)</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name} Team ({d.totalWorkers} Workers)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Alert Announcement Text</label>
              <textarea
                rows={3}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="e.g. 'URGENT: All Security & Medical personnel immediately mobilize to Gate 4 turnstiles for attendee ingress control!'"
                className="attio-input w-full p-3 rounded-xl text-xs placeholder:text-zinc-500"
              />
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Issue Live Emergency Push Broadcast Alert</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
