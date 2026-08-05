import React, { useState } from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { X, Mic, Upload, Sparkles, Check, Cpu } from 'lucide-react';

export const AITaskCreateModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, addTask } = useEventOpsStore();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiPreview, setAiPreview] = useState<{
    category: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'EMERGENCY';
    skills: string[];
  } | null>(null);

  if (!isCreateModalOpen) return null;

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const voiceSample = "Emergency! Medical team needed at Gate 4, attendee collapsed and bleeding!";
      setInputText(voiceSample);
      runAiExtraction(voiceSample);
    }, 1200);
  };

  const runAiExtraction = (text: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const textLower = text.toLowerCase();
      if (textLower.includes('medical') || textLower.includes('bleed') || textLower.includes('emergency')) {
        setAiPreview({
          category: 'MEDICAL',
          priority: 'EMERGENCY',
          skills: ['FIRST_AID_CERTIFIED']
        });
      } else if (textLower.includes('light') || textLower.includes('bulb') || textLower.includes('stage')) {
        setAiPreview({
          category: 'LIGHTING',
          priority: 'HIGH',
          skills: ['ELECTRICIAN']
        });
      } else {
        setAiPreview({
          category: 'SECURITY',
          priority: 'MEDIUM',
          skills: ['SECURITY_GUARD']
        });
      }
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText) return;

    addTask({
      id: `task-${Date.now()}`,
      title: inputText,
      category: aiPreview?.category || 'CUSTOM',
      priority: aiPreview?.priority || 'MEDIUM',
      status: 'DISPATCHED',
      latitude: 12.9716,
      longitude: 77.5946,
      required_skills: aiPreview?.skills || [],
      created_at: new Date().toISOString()
    });

    setIsCreateModalOpen(false);
    setInputText('');
    setAiPreview(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">AI Multi-Modal Task Creation</h2>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Voice Transcript or Task Description
            </label>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (e.target.value.length > 5) runAiExtraction(e.target.value);
                }}
                placeholder="Type task details or tap microphone to speak..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={handleSimulateVoice}
                className={`absolute bottom-3 right-3 p-2 rounded-xl border transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white border-red-400 animate-pulse' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-blue-600 hover:text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Upload Dropzone Simulation */}
          <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-3.5 text-center cursor-pointer transition-colors bg-slate-900/30">
            <Upload className="w-5 h-5 text-slate-500 mx-auto mb-1" />
            <span className="text-xs text-slate-400 block">Click or drag photo for Vision OCR Task Extraction</span>
          </div>

          {/* AI Live Parameter Extraction Preview Card */}
          {isAnalyzing && (
            <div className="flex items-center space-x-2 text-xs text-cyan-400 bg-cyan-950/30 p-3 rounded-xl border border-cyan-800/40">
              <Cpu className="w-4 h-4 animate-spin" />
              <span>AI Engine analyzing category & requirements...</span>
            </div>
          )}

          {aiPreview && !isAnalyzing && (
            <div className="bg-slate-900/80 border border-slate-700 p-3 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5" /> AI Extracted Parameters:
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">98% Confidence</span>
              </div>
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">
                  Category: {aiPreview.category}
                </span>
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono">
                  Priority: {aiPreview.priority}
                </span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  Skills: {aiPreview.skills.join(', ')}
                </span>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-600/30 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Create & Dispatch Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
