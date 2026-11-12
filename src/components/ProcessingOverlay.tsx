import React from 'react';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProcessingProgress } from '../types/editor';

interface ProcessingOverlayProps {
  progress: ProcessingProgress;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ progress }) => {
  if (progress.status === 'idle' || progress.status === 'ready') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-studio-950/80 backdrop-blur-md">
      <div className="w-full max-w-md p-6 mx-4 rounded-2xl bg-studio-900 border border-studio-700 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="relative mb-5 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500">
            <Sparkles className="w-8 h-8 animate-pulse text-indigo-400" />
          </div>
          <Loader2 className="w-20 h-20 text-brand-500 animate-spin absolute -inset-2 opacity-60" />
        </div>

        <h3 className="text-xl font-semibold text-white tracking-tight mb-2">
          TypeShift AI Processing
        </h3>
        
        <p className="text-sm text-slate-300 min-h-[40px] mb-4">
          {progress.message}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-studio-800 rounded-full h-2 mb-2 overflow-hidden border border-studio-700">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, progress.progress)}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-xs text-slate-400 px-1">
          <span>OCR & Style Extraction</span>
          <span className="font-mono">{progress.progress}%</span>
        </div>

        <div className="mt-4 pt-4 border-t border-studio-800 flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Local browser inference & zero data leaves your machine</span>
        </div>
      </div>
    </div>
  );
};
