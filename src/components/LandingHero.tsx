import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HeroStage } from './landing/HeroStage';
import { Features, HowItWorks, Compare, Faq, FinalCta } from './landing/Sections';

interface LandingHeroProps {
  onNavigateToEditor: () => void;
}

const Logo: React.FC = () => (
  <a href="/" className="flex items-center gap-2.5 select-none" aria-label="Pixora home">
    <span className="w-9 h-9 rounded-xl bg-plum-900 text-cream-100 flex items-center justify-center font-display text-xl font-extrabold">P</span>
    <span className="font-display text-xl font-bold text-plum-900 tracking-tight">Pixora</span>
  </a>
);

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigateToEditor }) => (
  <div className="min-h-screen bg-cream-50 text-plum-900 font-sans overflow-x-clip">
    <header className="sticky top-3 z-40 px-3">
      <nav className="mx-auto max-w-6xl flex items-center justify-between rounded-full bg-cream-50/80 backdrop-blur-md ring-1 ring-plum-900/10 px-5 py-2.5 shadow-sm">
        <Logo />
        <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-plum-800">
          <a href="#features" className="nav-link">What it does</a>
          <a href="#how-it-works" className="nav-link">How it works</a>
          <a href="#example" className="nav-link">Example</a>
          <a href="#faq" className="nav-link">FAQ</a>
        </div>
        <button onClick={onNavigateToEditor} className="btn-plum rounded-full bg-plum-900 px-5 py-2 text-sm font-bold text-cream-100">
          Open studio
        </button>
      </nav>
    </header>

    <main>
      <section className="relative px-5 pt-14 pb-24 md:pt-20 md:pb-32">
        <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-gradient-to-b from-cream-100 via-cream-50 to-transparent" />
        <div className="mx-auto max-w-6xl grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="hero-rise inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-plum-600 ring-1 ring-plum-900/10" style={{ animationDelay: '40ms' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-peach-500" /> AI image text editor
            </p>
            <h1 className="mt-6 font-display text-6xl sm:text-7xl lg:text-[5.4rem] font-extrabold leading-[0.98] tracking-[-0.03em] text-plum-900">
              <span className="hero-rise block" style={{ animationDelay: '120ms' }}>Edit the text.</span>
              <span className="hero-rise block" style={{ animationDelay: '240ms' }}>Keep the image.</span>
            </h1>
            <p className="hero-rise mt-7 max-w-md text-xl leading-relaxed text-plum-800/85" style={{ animationDelay: '380ms' }}>
              Detect text in your image and edit it in place.
            </p>
            <div className="hero-rise mt-9 flex flex-wrap items-center gap-4" style={{ animationDelay: '500ms' }}>
              <button
                onClick={onNavigateToEditor}
                className="btn-plum group inline-flex items-center gap-2 rounded-full bg-plum-900 px-7 py-3.5 text-base font-bold text-cream-100"
              >
                Open Pixora studio
                <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-landing group-hover:translate-x-1" />
              </button>
              <a href="#how-it-works" className="rounded-full px-5 py-3.5 text-base font-bold text-plum-900 ring-1 ring-plum-900/20 hover:bg-white transition-colors">
                See how it works
              </a>
            </div>
            <ul className="hero-rise mt-12 grid max-w-lg grid-cols-3 gap-4 text-sm" style={{ animationDelay: '640ms' }}>
              {[
                ['Detects text', 'Finds words and their style'],
                ['Live type controls', 'Font, size, weight, color'],
                ['High-res export', 'Download as PNG'],
              ].map(([t, d]) => (
                <li key={t}>
                  <p className="font-bold text-plum-900">{t}</p>
                  <p className="mt-0.5 text-plum-800/70">{d}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="hero-rise" style={{ animationDelay: '300ms' }}>
            <HeroStage />
          </div>
        </div>
      </section>

      <Features />
      <HowItWorks />
      <Compare />
      <Faq />
      <FinalCta onOpen={onNavigateToEditor} />
    </main>

    <footer className="border-t border-plum-900/10 px-5 py-10">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-plum-800/80">
        <Logo />
        <p>Example images on this page are illustrations made for the site.</p>
        <a href="https://github.com/kamal-kumar-001/Pixora" className="font-semibold text-plum-900 hover:underline">GitHub</a>
      </div>
    </footer>
  </div>
);
