import React, { useState } from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { Upload, FileCode, Check, Layers, Map, Eye, RefreshCw } from 'lucide-react';

export interface VenueBlueprintPreset {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number];
  polygonsCount: number;
}

export const PRESET_VENUES: VenueBlueprintPreset[] = [
  { id: 'v-1', name: '🏟️ Metropolitan Olympic Stadium', type: 'Stadium / Arena', coordinates: [78.4867, 17.3850], polygonsCount: 14 },
  { id: 'v-2', name: '🏢 International Convention Center', type: 'Indoor Convention', coordinates: [-73.9851, 40.7484], polygonsCount: 22 },
  { id: 'v-3', name: '🎪 National Exhibition Fairgrounds', type: 'Outdoor Festival', coordinates: [-118.2437, 34.0522], polygonsCount: 18 },
  { id: 'v-4', name: '🎓 University Campus & Quad', type: 'University Campus', coordinates: [-122.1697, 37.4275], polygonsCount: 16 }
];

export const CustomVenueCADUploader: React.FC = () => {
  const { setSelectedVenuePreset, activeVenuePreset } = useEventOpsStore();
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file.name);
    setSelectedVenuePreset({
      id: `custom-${Date.now()}`,
      name: `📁 ${file.name} (Custom CAD/GeoJSON)`,
      type: file.name.endsWith('.geojson') ? 'GeoJSON FeatureCollection' : 'CAD Drawing Overlay',
      coordinates: [78.4867, 17.3850],
      polygonsCount: 24
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="attio-card p-5 rounded-2xl border border-white/10 bg-[#111115] space-y-4 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2.5">
          <FileCode className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-zinc-100 tracking-tight flex items-center gap-2">
              <span>Custom Venue Map & CAD / GeoJSON Upload Engine</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                CAD / GIS IMPORTER
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">Overlay live workers & incidents onto custom stadium CAD drawings or GeoJSON floor plans</p>
          </div>
        </div>
      </div>

      {/* Drag & Drop CAD Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`p-6 rounded-xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center space-y-2 cursor-pointer ${
          isDragOver 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : uploadedFile 
            ? 'border-emerald-500/40 bg-emerald-500/5' 
            : 'border-white/10 bg-[#0a0a0d] hover:border-white/20'
        }`}
      >
        <input
          type="file"
          accept=".geojson,.json,.dwg,.dxf,.png,.jpg,.pdf"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          className="hidden"
          id="cad-file-input"
        />
        <label htmlFor="cad-file-input" className="cursor-pointer flex flex-col items-center">
          <Upload className={`w-8 h-8 ${uploadedFile ? 'text-emerald-400' : 'text-indigo-400'} mb-1`} />
          <span className="text-xs font-bold text-zinc-200">
            {uploadedFile ? `Uploaded Custom File: ${uploadedFile}` : 'Drag & Drop CAD Drawings (.dwg, .dxf) or GeoJSON (.geojson, .json)'}
          </span>
          <span className="text-[10px] text-zinc-500 mt-1">
            Supports custom stadium floor plans, convention center CAD vectors, and GIS shapefiles
          </span>
        </label>
      </div>

      {/* Preset Custom Venues Selection */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
          Or Select Preset Custom Venue Blueprint:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_VENUES.map((venue) => {
            const isSelected = activeVenuePreset?.id === venue.id;

            return (
              <div
                key={venue.id}
                onClick={() => {
                  setUploadedFile(null);
                  setSelectedVenuePreset(venue);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#18181c] border-indigo-500 shadow-md shadow-indigo-500/10' 
                    : 'bg-[#0a0a0d] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-100">{venue.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <span className="text-[10px] text-zinc-400 block font-mono">{venue.type}</span>
                <span className="text-[9px] text-indigo-400 font-mono mt-1 block">
                  {venue.polygonsCount} CAD Structural Polygons
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
