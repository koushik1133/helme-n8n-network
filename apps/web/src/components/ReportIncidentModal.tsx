import React, { useState } from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { X, Plus, AlertCircle, Check, MapPin, Zap } from 'lucide-react';

export const ReportIncidentModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { assignWorkerToMultiDeptTask, departments } = useEventOpsStore();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Lighting');
  const [priority, setPriority] = useState<'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [location, setLocation] = useState('Zone A Main Gate 4');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newTaskId = `task-${Date.now()}`;
    assignWorkerToMultiDeptTask(newTaskId, 'Raj Kumar (Auto-Assigned)', department);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="attio-card w-full max-w-lg rounded-2xl border border-white/10 bg-[#111115] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 text-zinc-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">Report & Spawn New Incident</h3>
              <span className="text-xs text-zinc-400">Instant Dispatcher Emergency Launcher</span>
            </div>
          </div>

          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="text-zinc-300 font-semibold block mb-1">Incident Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Stage B Spotlight Cable Trip or Gate 2 Crowd Surge..."
              className="attio-input w-full px-3.5 py-2.5 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="attio-input w-full px-3.5 py-2.5 rounded-xl text-xs"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name} ({d.supervisor})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="attio-input w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold"
              >
                <option value="EMERGENCY">🔴 EMERGENCY (SOS)</option>
                <option value="HIGH">🟡 HIGH</option>
                <option value="MEDIUM">🔵 MEDIUM</option>
                <option value="LOW">⚪ LOW</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-zinc-300 font-semibold block mb-1">Location / Zone</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="attio-input w-full px-3.5 py-2.5 rounded-xl text-xs"
            >
              <option value="Zone A Main Gate 4">Zone A Main Gate 4</option>
              <option value="Zone B Main Stage & LED Grid">Zone B Main Stage & LED Grid</option>
              <option value="Zone C Power Substation">Zone C Power Substation</option>
              <option value="Parking Lot C Shuttle Hub">Parking Lot C Shuttle Hub</option>
              <option value="VIP Entrance Gate 1">VIP Entrance Gate 1</option>
            </select>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center space-x-2">
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Spawn Incident & Auto-Dispatch Nearest Candidate</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
