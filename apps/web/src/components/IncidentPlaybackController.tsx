import React, { useEffect } from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

export const IncidentPlaybackController: React.FC = () => {
  const { 
    isPlayingPlayback, setIsPlayingPlayback, 
    playbackMinute, setPlaybackMinute 
  } = useEventOpsStore();

  useEffect(() => {
    let timer: any = null;
    if (isPlayingPlayback) {
      timer = setInterval(() => {
        setPlaybackMinute((playbackMinute + 1) % 16);
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlayingPlayback, playbackMinute, setPlaybackMinute]);

  const displayTime = `12:${playbackMinute < 10 ? '0' + playbackMinute : playbackMinute}:00 PM`;

  return (
    <div className="attio-card p-4 rounded-2xl border border-white/10 bg-[#121215] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
      
      {/* Title & Playback Time Display */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-200">
          <Clock className="w-4 h-4 text-indigo-400" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Incident Replay & Operational Playback</span>
          <span className="text-base font-bold text-zinc-100 font-mono">{displayTime}</span>
        </div>
      </div>

      {/* Scrubbing Slider Control */}
      <div className="flex-1 w-full sm:mx-6">
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono mb-1">
          <span>12:00 PM (Start)</span>
          <span>12:08 PM (Peak Emergency)</span>
          <span>12:15 PM (Current)</span>
        </div>
        <input
          type="range"
          min="0"
          max="15"
          value={playbackMinute}
          onChange={(e) => setPlaybackMinute(Number(e.target.value))}
          className="w-full h-1.5 bg-[#0d0d10] rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Play / Pause Action Buttons */}
      <div className="flex items-center space-x-2 shrink-0">
        <button
          onClick={() => setIsPlayingPlayback(!isPlayingPlayback)}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
            isPlayingPlayback ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isPlayingPlayback ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlayingPlayback ? 'Pause Replay' : 'Play Replay (Palantir)'}</span>
        </button>

        <button
          onClick={() => setPlaybackMinute(0)}
          className="p-2 rounded-xl bg-[#0d0d10] border border-white/5 text-zinc-400 hover:text-zinc-200"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
