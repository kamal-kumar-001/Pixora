import React from 'react';
import { ShieldCheck, Sparkles, SlidersHorizontal, Check } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      badge: "Pixel Preservation",
      title: "Preserve 100% of original graphics and textures",
      description: "Unlike blind inpainting that smears backgrounds and ruins fine detail, Pixora only alters the bounding box of text you choose to modify. Bank logos, watermarks, and patterns remain untouched.",
      featureList: [
        "Zero loss of resolution or contrast",
        "Preserves delicate gradients and textures",
        "Clean union patch masks with adjustable padding"
      ],
      previewContent: (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-white text-xs space-y-2.5">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
            <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              NON DESTRUCTIVE
            </span>
            <span className="text-[11px]">Lossless Layer</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400">Base Image</span>
            <span className="text-emerald-400 font-semibold font-mono">100% Original Pixels</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Patched Area</span>
            <span className="text-indigo-300 font-mono">Target Bounding Box Only</span>
          </div>
        </div>
      )
    },
    {
      icon: Sparkles,
      badge: "Automated Typography",
      title: "Match font weights and hex colors automatically",
      description: "Powered by Gemini Vision AI, Pixora detects font family, font weight, and foreground text color, while sampling the surface color right behind the text for immediate alignment.",
      featureList: [
        "Preloaded with popular Google Fonts",
        "Automatic font size and letter spacing detection",
        "Integrated EyeDropper for manual fine tuning"
      ],
      previewContent: (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-slate-900 text-xs space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-semibold text-slate-800 text-[11px]">Typography Node</span>
            <span className="text-indigo-600 font-mono text-[10px]">Autodetected</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-400 block text-[9px]">Font</span>
              <span className="font-bold text-slate-800">Manrope Bold</span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-400 block text-[9px]">Color</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                <span className="font-mono text-[10px]">#0F172A</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: SlidersHorizontal,
      badge: "Spatial Precision",
      title: "Nudge coordinates and customize background masks",
      description: "Move text blocks with mouse drag or type exact pixel coordinates. Control horizontal and vertical background padding so previous characters never peek through.",
      featureList: [
        "Drag and drop text positioning with zoom normalization",
        "Pixel by pixel X and Y coordinate precision",
        "Adjustable mask padding up to 40px"
      ],
      previewContent: (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-slate-900 text-xs space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-semibold text-slate-800 text-[11px]">Patch Controls</span>
            <span className="font-mono text-[10px] text-slate-500">Live Feedback</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Mask Padding X</span>
              <span className="font-mono font-semibold text-indigo-600">8px</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full w-2/5" />
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="features" className="py-24 px-4 max-w-6xl mx-auto w-full">
      {/* Section Header */}
      <div className="text-center max-w-[680px] mx-auto mb-16">
        <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-4 inline-block">
          Core Capabilities
        </span>
        <h2 
          className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.12] mb-4 text-balance"
          style={{ letterSpacing: '-0.03em' }}
        >
          Everything needed for clean text replacement
        </h2>
        <p className="text-base text-slate-600 font-normal leading-relaxed text-pretty">
          Pixora gives you precision control over every text block. Detect typography in seconds and export high resolution graphics with complete visual integrity.
        </p>
      </div>

      {/* 3 Outcome Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.badge}
              className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
                  <Icon className="w-5 h-5" />
                </div>

                <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase mb-2 block">
                  {benefit.badge}
                </span>

                <h3 className="text-xl font-semibold text-slate-900 leading-snug mb-3 text-balance">
                  {benefit.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-6 text-pretty">
                  {benefit.description}
                </p>

                <ul className="space-y-2.5 mb-6 text-xs text-slate-700">
                  {benefit.featureList.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nested Visual Micro Preview */}
              <div className="pt-4 border-t border-slate-100">
                {benefit.previewContent}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
