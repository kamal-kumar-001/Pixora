import React from 'react';
import { Loader2, Sparkles, ScanText } from 'lucide-react';
import { ProcessingProgress } from '../types/editor';

interface ProcessingOverlayProps {
  progress: ProcessingProgress;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ progress }) => {
  if (progress.status === 'idle' || progress.status === 'ready') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-100/80 backdrop-blur-md">
      <div className="w-full max-w-md p-7 mx-4 rounded-3xl bg-cream-50 border border-cream-200 shadow-[0_30px_80px_-30px_rgba(84,34,74,0.45)] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="relative mb-5 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-peach-300/40 border border-peach-400/60 flex items-center justify-center">
            <Sparkles className="w-8 h-8 animate-pulse text-plum-800" />
          </div>
          <Loader2 className="w-20 h-20 text-peach-500 animate-spin absolute -inset-2 opacity-70" />
        </div>

        <h3 className="font-display text-2xl font-semibold text-plum-900 tracking-tight mb-2">
          Pixora is reading your image
        </h3>

        <p className="text-sm text-plum-600 min-h-[40px] mb-4">
          {progress.message}
        </p>

        <div className="w-full bg-cream-200 rounded-full h-2 mb-2 overflow-hidden border border-cream-200">
          <div
            className="bg-gradient-to-r from-peach-400 to-plum-800 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, progress.progress)}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-xs text-plum-600 px-1">
          <span>Detecting text and styles</span>
          <span className="font-mono">{progress.progress}%</span>
        </div>

        <div className="mt-4 pt-4 border-t border-cream-200 w-full flex items-center justify-center gap-2 text-xs text-plum-600">
          <ScanText className="w-4 h-4 text-peach-500 shrink-0" />
          <span>Text boxes become editable layers once detection finishes</span>
        </div>
      </div>
    </div>
  );
};
