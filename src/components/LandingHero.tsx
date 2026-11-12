import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Type, 
  Wand2, 
  ShieldCheck, 
  ChevronRight
} from 'lucide-react';
import { PixoraLogo } from './PixoraLogo';
import { TaglineReveal } from './landing/TaglineReveal';
import { BenefitsSection } from './landing/BenefitsSection';
import { HowItWorksSection } from './landing/HowItWorksSection';
import { ShowcaseSection } from './landing/ShowcaseSection';
import { ComparisonSection } from './landing/ComparisonSection';
import { FaqSection } from './landing/FaqSection';
import { FinalCtaSection } from './landing/FinalCtaSection';
import { LandingFooter } from './landing/LandingFooter';

interface LandingHeroProps {
  onNavigateToEditor: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigateToEditor }) => {
  const [activeTab, setActiveTab] = useState<'edited' | 'original'>('edited');
  const [headlineText, setHeadlineText] = useState('HORIZON');
  const [subtitleText, setSubtitleText] = useState('Breathtaking architecture. A quieter state of mind.');

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* 1. Floating Top Navigation Bar (per landing-page-design B7 Navigation rules) */}
      <header className="sticky top-4 z-40 max-w-6xl w-full mx-auto px-4">
        <nav className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl px-5 py-2.5 flex items-center justify-between shadow-sm transition-all duration-300">
          <PixoraLogo size="md" variant="light" showBadge={true} />

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Capabilities</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
            <a href="#showcase" className="hover:text-slate-900 transition-colors">Showcase</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToEditor}
              className="group flex items-center gap-2 py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-300 shadow-sm"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-landing group-hover:translate-x-0.5" />
            </button>
          </div>
        </nav>
      </header>

      {/* 2. Hero Section (A2 Page Structure & B5 Hero Section rules) */}
      <main className="flex-1 flex flex-col items-center pt-12 pb-24 px-4 max-w-6xl mx-auto w-full">
        
        {/* Outcome & Category Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 mb-6 shadow-xs animate-in fade-in duration-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-800">
            Next Generation Vision AI • In-Place Text Editing
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-medium text-indigo-600">
            Zero Quality Loss
          </span>
        </div>

        {/* Heading 1 (B5: left to right text gradient #000000 -> #666666, max-w 680px, no periods, meaningful break) */}
        <h1 
          className="text-5xl md:text-6xl font-semibold tracking-tight text-center max-w-[680px] leading-[1.08] mb-6 text-balance"
          style={{ letterSpacing: '-0.04em' }}
        >
          <span className="bg-gradient-to-r from-black via-slate-800 to-slate-500 bg-clip-text text-transparent">
            Rewrite text inside any image
          </span>
          <br />
          <span className="text-slate-900 font-bold">
            Keep every pixel pristine
          </span>
        </h1>

        {/* Subheadline (B5: max-w 680px, no hyphens, text-wrap pretty) */}
        <p className="text-lg text-slate-600 text-center max-w-[620px] font-normal leading-relaxed mb-8 text-pretty">
          Upload photos, receipts, social posters, or mockups. Pixora detects typography and replaces text directly in place without blurring backgrounds or destroying logos.
        </p>

        {/* Primary and Secondary Action CTAs (B2: Spacing-100 & 8px/12px padding rules) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-10 w-full sm:w-auto">
          <button
            onClick={onNavigateToEditor}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-base font-semibold shadow-md shadow-indigo-600/20 transition-all duration-300 ease-landing"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Pixora Studio</span>
          </button>

          <a
            href="#interactive-demo"
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:scale-[0.98] text-slate-800 text-base font-medium border border-slate-200 transition-all duration-300"
          >
            <span>Explore Interactive Preview</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </a>
        </div>

        {/* Proof Signal (A2: One proof signal above fold) */}
        <div className="flex items-center gap-6 text-xs text-slate-500 font-medium mb-14">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>No account required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Non-destructive patching</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-600" />
            <span>High-res export</span>
          </div>
        </div>

        {/* 3. Hero Visual: 3D Perspective Interactive Canvas Mockup */}
        <section id="interactive-demo" className="w-full relative perspective-1000 flex flex-col items-center">
          
          {/* Subtle Ambient Radial Backlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-200/40 via-purple-100/30 to-sky-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Interactive Mode Switcher on top of 3D frame */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 mb-6 shadow-xs z-20">
            <button
              onClick={() => setActiveTab('edited')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === 'edited' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>In-Place Edited (Pixora)</span>
            </button>
            <button
              onClick={() => setActiveTab('original')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === 'original' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Original Image</span>
            </button>
          </div>

          {/* 3D Tilted Card Container */}
          <div className="w-full max-w-4xl preserve-3d transition-transform duration-700 ease-landing hover:rotate-x-0 hover:rotate-y-0">
            <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-4 sm:p-6 animate-floating-mockup">
              
              {/* Studio Window Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">pixora-studio // landscape-creative.png</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    AI Vision Active
                  </span>
                </div>
              </div>

              {/* Main Canvas Display with Creative Visual */}
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 shadow-inner group">
                
                {/* Background Editorial Visual */}
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
                  alt="High quality landscape editorial canvas"
                  className="w-full h-full object-cover transition-transform duration-700 ease-landing group-hover:scale-102"
                />

                {/* Dark Editorial Gradient Scrim for readable typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 pointer-events-none" />

                {/* Top Corner Brand Tag in Canvas */}
                <div className="absolute top-6 left-6 flex items-center gap-2 text-white/90 font-semibold tracking-wider text-xs uppercase z-10">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>VISTA JOURNAL • ISSUE 04</span>
                </div>

                {/* Interactive Headline Layer */}
                <div className="absolute top-1/4 left-6 sm:left-12 max-w-xl z-20">
                  
                  {activeTab === 'edited' ? (
                    <div className="relative group/box inline-block">
                      {/* Bounding Box Selection Handles (like the reference, clean violet styling) */}
                      <div className="absolute -inset-2.5 rounded-lg border-2 border-indigo-400 bg-indigo-500/10 pointer-events-none shadow-lg shadow-indigo-500/20">
                        {/* 4 Corner Knobs */}
                        <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 shadow-sm" />
                        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 shadow-sm" />
                        <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 shadow-sm" />
                        <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 shadow-sm" />
                        
                        {/* Floating Text Inspector Pill */}
                        <div className="absolute -top-8 left-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600 text-white font-medium text-[11px] shadow-md tracking-tight">
                          <Type className="w-3 h-3" />
                          <span>Text • Playfair Display 64px • Bold</span>
                        </div>
                      </div>

                      {/* Live In-Place Editable Title */}
                      <input
                        type="text"
                        value={headlineText}
                        onChange={(e) => setHeadlineText(e.target.value)}
                        className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight bg-transparent focus:outline-none drop-shadow-md w-full"
                        style={{ fontFamily: 'Manrope, serif' }}
                      />
                    </div>
                  ) : (
                    /* Original unedited state */
                    <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white/70 tracking-tight drop-shadow-md">
                      ORIGIN
                    </h2>
                  )}

                  {/* Subtitle Box */}
                  <div className="mt-4">
                    {activeTab === 'edited' ? (
                      <div className="relative inline-block">
                        <input
                          type="text"
                          value={subtitleText}
                          onChange={(e) => setSubtitleText(e.target.value)}
                          className="text-sm sm:text-base font-medium text-slate-200 bg-black/40 backdrop-blur-xs border border-white/20 rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-400 w-full sm:w-[420px]"
                        />
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base font-medium text-slate-300">
                        The untamed wild. Preserved in memory.
                      </p>
                    )}
                  </div>

                  {/* Call to action pill inside image */}
                  <div className="mt-6">
                    <button 
                      onClick={onNavigateToEditor}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold shadow-lg transition active:scale-95"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Floating Glassmorphism Property Inspector Badge (Right Side) */}
                <div className="hidden sm:flex absolute right-6 bottom-6 flex-col gap-2 p-3.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/15 text-white shadow-xl z-20 max-w-[220px]">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/10 pb-1.5">
                    <span className="font-semibold text-slate-200">Typography Node</span>
                    <span className="text-indigo-400 font-mono">1:1 Fit</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Font</span>
                    <span className="font-medium text-slate-100">Manrope Bold</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Background</span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Clean Patched
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Kerning</span>
                    <span className="font-mono text-slate-300">-0.03em</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Tagline Reveal Section (Mandatory B11) */}
      <TaglineReveal />

      {/* Core Benefits */}
      <BenefitsSection />

      {/* How It Works */}
      <HowItWorksSection onNavigateToEditor={onNavigateToEditor} />

      {/* Interactive Showcase */}
      <ShowcaseSection onNavigateToEditor={onNavigateToEditor} />

      {/* Comparison Matrix */}
      <ComparisonSection />

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* Final Risk-Reversal CTA */}
      <FinalCtaSection onNavigateToEditor={onNavigateToEditor} />

      {/* Comprehensive Footer */}
      <LandingFooter onNavigateToEditor={onNavigateToEditor} />

    </div>
  );
};
