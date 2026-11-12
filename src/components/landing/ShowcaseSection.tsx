import React, { useState } from 'react';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface ShowcaseSectionProps {
  onNavigateToEditor: () => void;
}

type TabKey = 'receipt' | 'banner' | 'mockup';

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({ onNavigateToEditor }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('receipt');
  const [viewState, setViewState] = useState<'after' | 'before'>('after');

  const tabs: Record<TabKey, {
    label: string;
    category: string;
    headline: string;
    beforeText: string;
    afterText: string;
    fontName: string;
    patchColor: string;
    description: string;
    contextPill: string;
  }> = {
    receipt: {
      label: "Payment Receipt",
      category: "Financial Documents",
      headline: "Change figures and names on receipts with zero background distortion",
      beforeText: "₹8,594.00 Paid to Zomato Online",
      afterText: "₹15,000.00 Paid to Alex Morgan",
      fontName: "Manrope Bold 36px",
      patchColor: "#12141c (Dark Card Surface)",
      description: "Mobile payment receipts feature subtle gradients and dark cards. Pixora covers previous text using matched background color masks without disturbing surrounding transaction stamps.",
      contextPill: "Google Pay / UPI Receipt"
    },
    banner: {
      label: "Marketing Poster",
      category: "Social Creatives",
      headline: "Update promotional banners without re-exporting Figma files",
      beforeText: "SUMMER CLEARANCE • 30% OFF EVERYTHING",
      afterText: "AUTUMN ARCHIVE • 50% OFF THIS WEEKEND",
      fontName: "Oswald Bold 54px",
      patchColor: "#0f172a (Editorial Navy)",
      description: "When copy updates arrive late, swap headlines and discount percentages directly in the finalized raster banner without asking designers for source files.",
      contextPill: "Instagram Editorial Banner"
    },
    mockup: {
      label: "Product Mockup",
      category: "UI/UX Prototyping",
      headline: "Replace placeholder copy with localized strings",
      beforeText: "Welcome back, John Doe (Basic Plan)",
      afterText: "Welcome back, Sarah Connor (Enterprise Tier)",
      fontName: "Inter SemiBold 24px",
      patchColor: "#ffffff (Clean White Canvas)",
      description: "Portfolio screenshots and pitch decks often contain outdated names or generic dummy copy. Update text in seconds for customized client presentations.",
      contextPill: "SaaS Dashboard Preview"
    }
  };

  const current = tabs[activeTab];

  return (
    <section id="showcase" className="py-24 px-4 max-w-6xl mx-auto w-full">
      {/* Section Header */}
      <div className="text-center max-w-[680px] mx-auto mb-12">
        <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-4 inline-block">
          Interactive Proof
        </span>
        <h2 
          className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.12] mb-4 text-balance"
          style={{ letterSpacing: '-0.03em' }}
        >
          See real before and after transformations
        </h2>
        <p className="text-base text-slate-600 font-normal leading-relaxed text-pretty">
          Compare original images against Pixora in-place edits. Notice how bank logos, card corners, and backgrounds remain completely intact.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {(Object.keys(tabs) as TabKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
              activeTab === key
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            {tabs[key].label}
          </button>
        ))}
      </div>

      {/* Showcase Card Frame */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        
        {/* Top Control Bar with Before/After Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {current.category}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-mono">
                {current.contextPill}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mt-1">
              {current.headline}
            </h3>
          </div>

          {/* Interactive Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 flex-shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setViewState('after')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewState === 'after'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Pixora Edit</span>
              </span>
            </button>
            <button
              onClick={() => setViewState('before')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewState === 'before'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Original Source</span>
            </button>
          </div>
        </div>

        {/* Visual Comparison Stage */}
        <div className="mt-8 rounded-xl bg-slate-950 p-6 sm:p-10 border border-slate-800 text-white relative overflow-hidden flex flex-col justify-between min-h-[280px]">
          {/* Subtle Ambient Backlight */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status */}
          <div className="flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${viewState === 'after' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
              <span className="font-mono text-slate-300">
                {viewState === 'after' ? 'PROCESSED IN-PLACE LAYER' : 'ORIGINAL UNTOUCHED ASSET'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Font: {current.fontName}
            </span>
          </div>

          {/* Main Visual Text Subject */}
          <div className="my-8 z-10 max-w-xl">
            {viewState === 'after' ? (
              <div className="space-y-3">
                <div className="inline-block relative">
                  <div className="absolute -inset-2 rounded-lg border-2 border-indigo-400 bg-indigo-500/10 pointer-events-none">
                    <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600" />
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600" />
                    <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600" />
                    <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600" />
                  </div>
                  <h4 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    {current.afterText}
                  </h4>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> Patched seamlessly
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Mask: {current.patchColor}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-400 leading-tight">
                  {current.beforeText}
                </h4>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs text-slate-400 font-mono">
                    Raw detected source string
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Card Context */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800 z-10">
            <span>Pixel Resolution: 100% Retained</span>
            <button
              onClick={onNavigateToEditor}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
            >
              <span>Edit this sample in studio</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Narrative Footer */}
        <p className="mt-6 text-sm text-slate-600 text-pretty leading-relaxed">
          {current.description}
        </p>
      </div>
    </section>
  );
};
