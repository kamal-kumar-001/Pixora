import React, { useRef } from 'react';
import { 
  Upload, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Plus, 
  Image as ImageIcon,
  ScanText,
  Undo2,
  Redo2,
  ArrowLeft
} from 'lucide-react';
import { SAMPLE_IMAGES, SampleImage } from '../engine/sampleImages';
import { PixoraLogo } from './PixoraLogo';

interface HeaderProps {
  onImageSelected: (file: File) => void;
  onSampleSelected: (sample: SampleImage) => void;
  onExport: () => void;
  onAddText: () => void;
  onNavigateToLanding: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
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
  onNavigateToLanding,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
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
    <header className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between z-30 select-none shadow-xs">
      {/* Brand logo & back button */}
      <div className="flex items-center gap-3">
        <PixoraLogo size="sm" variant="light" showBadge={true} />
        <button
          onClick={onNavigateToLanding}
          className="text-xs text-slate-500 hover:text-slate-900 transition ml-2 border-l border-slate-200 pl-3 flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Landing</span>
        </button>
      </div>

      {/* Center Controls: Add Text, Undo/Redo, Detected Count, Zoom */}
      <div className="flex items-center gap-2">
        {hasImage && (
          <>
            {/* Add text block */}
            <button
              onClick={onAddText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100/80 text-xs font-semibold text-indigo-700 border border-indigo-200/70 transition active:scale-95 shadow-2xs"
              title="Add a new text block"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Add Text</span>
            </button>

            {/* Undo / Redo Controls */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-slate-700">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="p-1.5 hover:text-slate-900 hover:bg-white rounded disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-slate-700 transition active:scale-90"
                title="Undo (Cmd+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="p-1.5 hover:text-slate-900 hover:bg-white rounded disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-slate-700 transition active:scale-90"
                title="Redo (Cmd+Shift+Z)"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Detected badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
              <ScanText className="w-3.5 h-3.5 text-indigo-600" />
              <span>{blockCount} layers</span>
            </div>

            {/* AI Vision Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Vision AI</span>
            </div>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-slate-700">
              <button
                onClick={() => onZoomChange(Math.max(0.2, zoom - 0.1))}
                className="p-1 hover:text-slate-900 hover:bg-white rounded active:scale-90 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onZoomChange(1)}
                className="px-2 text-xs font-mono font-semibold hover:text-slate-900"
                title="Reset Zoom to 100%"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
                className="p-1 hover:text-slate-900 hover:bg-white rounded active:scale-90 transition"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-xs font-medium text-slate-700 border border-slate-200 transition active:scale-95"
          >
            <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Samples</span>
          </button>

          {showSamples && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Instant Presets
              </div>
              <div className="space-y-1 mt-1">
                {SAMPLE_IMAGES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      onSampleSelected(sample);
                      setShowSamples(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition flex flex-col gap-0.5 group"
                  >
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600">
                      {sample.name}
                    </span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-xs font-medium text-slate-700 border border-slate-200 transition active:scale-95"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span>Upload</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onExport}
          disabled={!hasImage}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
