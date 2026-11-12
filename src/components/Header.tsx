import React, { useRef } from 'react';
import { 
  Upload, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Plus, 
  Image as ImageIcon,
  ScanText
} from 'lucide-react';
import { SAMPLE_IMAGES, SampleImage } from '../engine/sampleImages';

interface HeaderProps {
  onImageSelected: (file: File) => void;
  onSampleSelected: (sample: SampleImage) => void;
  onExport: () => void;
  onAddText: () => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  hasImage: boolean;
  blockCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onImageSelected,
  onSampleSelected,
  onExport,
  onAddText,
  zoom,
  onZoomChange,
  hasImage,
  blockCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSamples, setShowSamples] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  return (
    <header className="h-14 bg-studio-900 border-b border-studio-800 px-4 flex items-center justify-between z-30 select-none">
      {/* Brand logo & title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-sm shadow-md shadow-indigo-500/20">
          T
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              TypeShift <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI Studio</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Center Controls: Add Text, Detected Count, Zoom */}
      <div className="flex items-center gap-2">
        {hasImage && (
          <>
            {/* Add text block */}
            <button
              onClick={onAddText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-studio-800 hover:bg-studio-700 text-xs font-medium text-slate-200 border border-studio-700 transition active:scale-95"
              title="Add a new text block"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add Text</span>
            </button>

            {/* Detected badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-studio-850 border border-studio-700/60 text-xs text-slate-300">
              <ScanText className="w-3.5 h-3.5 text-indigo-400" />
              <span>{blockCount} text layers detected</span>
            </div>

            <div className="h-4 w-px bg-studio-800 mx-1" />

            {/* Zoom Controls */}
            <div className="flex items-center bg-studio-800 border border-studio-700 rounded-lg p-0.5 text-slate-300">
              <button
                onClick={() => onZoomChange(Math.max(0.2, zoom - 0.1))}
                className="p-1 hover:text-white rounded hover:bg-studio-700 active:scale-90 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onZoomChange(1)}
                className="px-2 text-xs font-mono font-medium hover:text-white"
                title="Reset Zoom to 100%"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
                className="p-1 hover:text-white rounded hover:bg-studio-700 active:scale-90 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right Actions: Upload, Samples, Export */}
      <div className="flex items-center gap-2">
        {/* Sample selector dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSamples(!showSamples)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-studio-800 hover:bg-studio-700 text-xs font-medium text-slate-300 border border-studio-700 transition active:scale-95"
          >
            <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Samples</span>
          </button>

          {showSamples && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-studio-900 border border-studio-700 shadow-2xl p-2 z-50">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                1-Click Preset Samples
              </div>
              <div className="space-y-1 mt-1">
                {SAMPLE_IMAGES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      onSampleSelected(sample);
                      setShowSamples(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-studio-800 transition flex flex-col gap-0.5 group"
                  >
                    <span className="text-xs font-medium text-slate-200 group-hover:text-indigo-400">
                      {sample.name}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1">
                      {sample.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-studio-800 hover:bg-studio-700 text-xs font-medium text-slate-200 border border-studio-700 transition active:scale-95"
        >
          <Upload className="w-3.5 h-3.5 text-slate-400" />
          <span>Upload Image</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onExport}
          disabled={!hasImage}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export High-Res</span>
        </button>
      </div>
    </header>
  );
};
