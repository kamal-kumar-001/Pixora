import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface FinalCtaSectionProps {
  onNavigateToEditor: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onNavigateToEditor }) => {
  return (
    <section className="py-24 px-4 max-w-6xl mx-auto w-full">
      <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 sm:p-14 text-white text-center flex flex-col items-center relative overflow-hidden shadow-xl">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 mb-6 z-10">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-300">
            Start Editing Immediately
          </span>
        </div>

        <h2 
          className="text-4xl sm:text-5xl font-semibold tracking-tight text-white max-w-[640px] leading-[1.12] mb-6 text-balance z-10"
          style={{ letterSpacing: '-0.03em' }}
        >
          Rewrite text inside any image without sacrificing a single pixel
        </h2>

        <p className="text-base text-slate-300 max-w-[540px] font-normal leading-relaxed mb-8 text-pretty z-10">
          Join thousands of designers, marketers, and creators using Pixora for clean, non-destructive text editing in the browser.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-10 w-full sm:w-auto z-10">
          <button
            onClick={onNavigateToEditor}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-base font-semibold shadow-lg shadow-indigo-600/30 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          >
            <span>Launch Pixora Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Risk Reversal Signals */}
        <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-medium z-10 flex-wrap">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No account required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Free to use</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>High-res PNG export</span>
          </div>
        </div>

      </div>
    </section>
  );
};
