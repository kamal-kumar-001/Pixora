import React from 'react';
import { UploadCloud, Edit3, Download, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onNavigateToEditor: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({ onNavigateToEditor }) => {
  const steps = [
    {
      step: "01",
      icon: UploadCloud,
      title: "Drop any screenshot or graphic",
      description: "Upload payment receipts, mobile app mockups, banner ads, or editorial artwork. Pixora accepts PNG, JPG, and WebP formats instantly without file size throttling."
    },
    {
      step: "02",
      icon: Edit3,
      title: "Detect and rewrite in place",
      description: "Vision AI identifies text blocks, font families, and background card colors. Double click to type directly on the canvas or use the prompt bar for natural language updates."
    },
    {
      step: "03",
      icon: Download,
      title: "Export crisp high resolution files",
      description: "Download your modified asset in full resolution. Surrounding graphics, watermarks, and brand marks remain identical to the original image."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-4 inline-block">
            Simple Workflow
          </span>
          <h2 
            className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.12] mb-4 text-balance"
            style={{ letterSpacing: '-0.03em' }}
          >
            From raw upload to finished graphic in three steps
          </h2>
          <p className="text-base text-slate-600 font-normal leading-relaxed text-pretty">
            No design software subscriptions, complex layering panels, or font matching guess work. Everything happens right in your browser.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div 
                key={s.step} 
                className="rounded-2xl bg-white border border-slate-200 p-8 shadow-xs flex flex-col justify-between relative group hover:border-indigo-300 transition-colors duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                      Step {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3 text-balance leading-snug">
                    {s.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed text-pretty">
                    {s.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
                  <span>Fast processing</span>
                  <span className="mx-2 text-slate-300">•</span>
                  <span>Instant preview</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inline Next Step CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={onNavigateToEditor}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-300 shadow-sm"
          >
            <span>Try it right now with a sample</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
