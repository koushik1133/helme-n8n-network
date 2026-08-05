import React, { useState } from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { Camera, X, Eye, ShieldAlert, Cpu, Activity } from 'lucide-react';

export const LiveCCTVFeedModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [thermalMode, setThermalMode] = useState(false);
  const [activeCam, setActiveCam] = useState('CAM-04: Gate 4 Turnstiles');

  if (!isOpen) return null;

  const cameras = [
    'CAM-04: Gate 4 Turnstiles',
    'CAM-01: Main Stage VIP Corridor',
    'CAM-08: Power Substation Grid',
    'CAM-12: Parking Lot C Ingress Corridor'
  ];

  return (
    <div className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="attio-card w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111115] shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150 text-zinc-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <Camera className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-zinc-100">Live CCTV & Thermal Surveillance Feed</h3>
              <span className="text-xs text-zinc-400">AI Crowd Analytics & Optical Stream</span>
            </div>
          </div>

          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Selector Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs pb-1">
          {cameras.map((cam) => (
            <button
              key={cam}
              onClick={() => setActiveCam(cam)}
              className={`px-3 py-1.5 rounded-xl border transition-all shrink-0 font-mono text-[11px] ${
                activeCam === cam 
                  ? 'bg-cyan-600 border-cyan-500 text-white font-bold' 
                  : 'bg-[#0a0a0d] border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {cam}
            </button>
          ))}
        </div>

        {/* Video Canvas Container */}
        <div className={`relative w-full h-[320px] rounded-xl border border-white/10 overflow-hidden flex items-center justify-center ${
          thermalMode ? 'bg-gradient-to-tr from-purple-950 via-red-950 to-amber-950' : 'bg-[#05070c]'
        }`}>
          {/* Simulated HD Feed Text overlay */}
          <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-zinc-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>LIVE 60FPS • {activeCam}</span>
          </div>

          <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-cyan-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Crowd Density: 74% (Optimal)</span>
          </div>

          {/* Video Mock Graphics */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
              <Camera className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <p className="text-xs text-zinc-300 font-mono">
              {thermalMode ? '🔥 THERMAL INFRARED HEAT VISION ACTIVE' : '📹 HD OPTICAL SURVEILLANCE FEED ACTIVE'}
            </p>
            <p className="text-[10px] text-zinc-500 font-mono">Resolution: 3840x2160 @ 60fps • Latency: 14ms</p>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between bg-black/70 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setThermalMode(!thermalMode)}
              className={`px-3 py-1 rounded-lg border transition-all text-xs font-mono font-bold ${
                thermalMode ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 text-zinc-300 border-white/10'
              }`}
            >
              {thermalMode ? '🔥 Thermal Mode ON' : '📷 Optical Vision'}
            </button>

            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Facial Recognition Active
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
