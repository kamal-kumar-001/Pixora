import React from 'react';
import { PixoraLogo } from '../PixoraLogo';
import { ArrowUpRight } from 'lucide-react';

interface LandingFooterProps {
  onNavigateToEditor: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onNavigateToEditor }) => {
  return (
    <footer className="border-t border-slate-200 bg-white py-14 px-4 text-slate-600 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4 max-w-sm">
          <PixoraLogo size="sm" variant="light" showBadge={true} />
          <p className="text-slate-500 leading-relaxed text-pretty">
            Next-generation in-place image text editing. Replace text on photos, receipts, and mockups while keeping 100% of original pixels intact.
          </p>
          <div className="text-[11px] text-slate-400">
            Engineered with Gemini 3.1 Flash Vision AI and lossless canvas compositing.
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
          <div>
            <span className="font-semibold text-slate-900 block mb-3 uppercase tracking-wider text-[11px]">
              Studio
            </span>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={onNavigateToEditor}
                  className="hover:text-indigo-600 font-semibold flex items-center gap-1 transition"
                >
                  <span>Launch Studio</span>
                  <ArrowUpRight className="w-3 h-3 text-indigo-500" />
                </button>
              </li>
              <li><a href="#interactive-demo" className="hover:text-slate-900 transition">Interactive Mockup</a></li>
              <li><a href="#showcase" className="hover:text-slate-900 transition">Sample Use Cases</a></li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-slate-900 block mb-3 uppercase tracking-wider text-[11px]">
              Product
            </span>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-slate-900 transition">Capabilities</a></li>
              <li><a href="#how-it-works" className="hover:text-slate-900 transition">How It Works</a></li>
              <li><a href="#faq" className="hover:text-slate-900 transition">Questions and Answers</a></li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-slate-900 block mb-3 uppercase tracking-wider text-[11px]">
              Legal and Role
            </span>
            <ul className="space-y-2">
              <li><a href="#privacy" className="hover:text-slate-900 transition">Privacy Statement</a></li>
              <li><a href="#terms" className="hover:text-slate-900 transition">Terms of Service</a></li>
              <li><span className="text-indigo-600 font-medium">UI/UX Design Submission</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
        <div>
          © {new Date().getFullYear()} Pixora. Crafted for UI/UX Excellence.
        </div>
        <div className="flex items-center gap-4">
          <span>Light Theme Design</span>
          <span>•</span>
          <span>Manrope Typography</span>
          <span>•</span>
          <span>Zero Quality Loss</span>
        </div>
      </div>
    </footer>
  );
};
