import React, { useEffect, useRef, useState } from 'react';
import { Check, Type } from 'lucide-react';
import { usePrefersReducedMotion } from './useReveal';

const SWATCHES = ['#3b1230', '#ea8a68', '#c0392b', '#e0a526', '#2f6f5e'];

/**
 * Hero visual. A layered 3D scene: the illustration plate, a selection box on the
 * detected word, and a floating text-editor panel. The word swaps on a loop.
 * Pointer movement tilts the whole stage. Reduced motion shows a still frame.
 */
export const HeroStage: React.FC = () => {
  const reduced = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [edited, setEdited] = useState(false);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (reduced) {
      setEdited(true);
      setTyped(5);
      return;
    }
    let cancelled = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(() => !cancelled && fn(), ms));
    const cycle = () => {
      setEdited(false);
      setTyped(0);
      'Great'.split('').forEach((_, i) => later(() => setTyped(i + 1), 1500 + i * 120));
      later(() => setEdited(true), 2400);
      later(cycle, 6800);
    };
    cycle();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduced]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduced) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--ry', `${(-8 + x * 10).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(4 - y * 8).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      el.style.setProperty('--ry', '-8deg');
      el.style.setProperty('--rx', '4deg');
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className="hero-perspective relative w-full max-w-[520px] mx-auto lg:mx-0 lg:ml-auto">
      <div className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-tr from-peach-300/60 via-cream-200 to-transparent blur-3xl" />
      <div ref={stageRef} className="hero-stage preserve-3d relative" aria-hidden="false">
        {/* Plate */}
        <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden shadow-[0_40px_80px_-30px_rgba(59,18,48,0.45)] ring-1 ring-plum-900/10 bg-cream-200">
          <img
            src="/landing/plate-a.webp"
            alt="A storefront poster that reads Good Coffee, Brighter Days"
            width={1000}
            height={1250}
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
          />
          <img
            src="/landing/plate-b.webp"
            alt=""
            width={1000}
            height={1250}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-landing ${edited ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Selection box on the detected word */}
          <div
            className={`absolute rounded-md border-2 border-dashed transition-all duration-500 ease-landing ${
              edited ? 'border-emerald-600/0 opacity-0' : 'border-plum-900/80 opacity-100'
            }`}
            style={{ left: '38%', top: '18.5%', width: '36%', height: '14.5%' }}
          >
            {['-left-1.5 -top-1.5', '-right-1.5 -top-1.5', '-left-1.5 -bottom-1.5', '-right-1.5 -bottom-1.5'].map((p) => (
              <span key={p} className={`absolute ${p} w-3 h-3 rounded-sm bg-white border-2 border-plum-900`} />
            ))}
          </div>
        </div>

        {/* Floating detection chip */}
        <div
          className="hero-float absolute -left-3 sm:-left-10 top-[14%] z-10 rounded-xl bg-white/90 backdrop-blur px-3 py-2 shadow-lg ring-1 ring-plum-900/10 text-xs font-semibold text-plum-900"
          style={{ transform: 'translateZ(60px)', animationDelay: '-1.2s' }}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${edited ? 'bg-emerald-500' : 'bg-peach-500 animate-pulse'}`} />
            {edited ? 'Text updated' : 'Text detected: "Good"'}
          </span>
        </div>

        {/* Floating editor panel */}
        <div
          className="hero-float absolute -right-2 sm:-right-10 bottom-[7%] z-10 w-[190px] sm:w-[250px] rounded-2xl bg-white/95 backdrop-blur p-4 shadow-[0_24px_50px_-18px_rgba(59,18,48,0.5)] ring-1 ring-plum-900/10"
          style={{ transform: 'translateZ(90px)' }}
        >
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-plum-600">
            <Type className="w-3.5 h-3.5" /> Text style
          </div>
          <div className="mt-2 rounded-lg bg-cream-100 px-3 py-2 font-display text-2xl font-bold text-plum-900 h-11 flex items-center">
            <span>{edited || typed > 0 ? 'Great'.slice(0, Math.max(typed, edited ? 5 : 0)) : 'Good'}</span>
            {!edited && typed > 0 && <span className="ml-0.5 w-0.5 h-6 bg-plum-900 animate-pulse" />}
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              ['Font', 'Serif'],
              ['Size', '96'],
              ['Weight', '700'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-cream-50 ring-1 ring-plum-900/5 py-1.5">
                <dt className="text-[9px] uppercase tracking-wider text-plum-400">{k}</dt>
                <dd className="text-xs font-bold text-plum-900">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex items-center gap-1.5">
            {SWATCHES.map((c, i) => (
              <span
                key={c}
                className={`w-5 h-5 rounded-full ring-2 ${i === 0 ? 'ring-plum-900' : 'ring-white'} shadow-sm`}
                style={{ background: c }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-plum-800">
            <Check className="w-3.5 h-3.5 text-emerald-600" /> Export as PNG
          </div>
        </div>
      </div>
    </div>
  );
};
