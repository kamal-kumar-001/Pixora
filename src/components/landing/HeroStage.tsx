import React, { useEffect, useRef, useState } from 'react';
import { Check, Type, Image as ImageIcon, LayoutGrid } from 'lucide-react';
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
        el.style.setProperty('--ry', `${(-14 + x * 10).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(5 - y * 8).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      el.style.setProperty('--ry', '-14deg');
      el.style.setProperty('--rx', '5deg');
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const handles = ['-left-1.5 -top-1.5', '-right-1.5 -top-1.5', '-left-1.5 -bottom-1.5', '-right-1.5 -bottom-1.5'];
  const Chip: React.FC<{ icon: React.ReactNode; label: string; className: string; z: number; delay?: string }> = ({ icon, label, className, z, delay }) => (
    <div
      className={`hero-float absolute z-20 inline-flex items-center gap-1.5 rounded-xl bg-plum-900 px-3 py-1.5 text-[11px] font-bold text-cream-100 shadow-lg ${className}`}
      style={{ transform: `translateZ(${z}px)`, animationDelay: delay }}
    >
      {icon}
      {label}
    </div>
  );

  return (
    <div className="hero-perspective relative w-full max-w-[560px] mx-auto lg:mx-0 lg:ml-auto pb-6">
      <div className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-tr from-peach-300/60 via-cream-200 to-transparent blur-3xl" />

      {/* Original thumbnail with arrow into the stage */}
      <div className="hidden xl:block absolute -left-20 top-[58%] z-30 w-[120px]">
        <div className="rounded-xl overflow-hidden ring-2 ring-white shadow-xl bg-white">
          <img src="/landing/plate-a.webp" alt="" width={240} height={300} className="w-full h-auto block" loading="lazy" />
        </div>
        <p className="mt-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-plum-600">Original</p>
        <svg className="absolute -top-14 left-10 w-24 h-16 text-plum-900/70" viewBox="0 0 96 64" fill="none" aria-hidden="true">
          <path d="M6 58C10 30 40 10 86 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 7" />
          <path d="M76 2l11 8-11 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div ref={stageRef} className="hero-stage preserve-3d relative">
        {/* Tilted image plane */}
        <div className="relative aspect-[4/5] rounded-[26px] overflow-hidden shadow-[0_50px_90px_-30px_rgba(59,18,48,0.5)] ring-1 ring-plum-900/10 bg-cream-200">
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
        </div>

        {/* Selection boxes sit above the plane */}
        <div
          className="absolute rounded-md border-2 border-plum-900/85 z-10 transition-opacity duration-500"
          style={{ left: '33%', top: '17%', width: '45%', height: '28%', transform: 'translateZ(40px)' }}
        >
          {handles.map((h) => (
            <span key={h} className={`absolute ${h} w-3 h-3 rounded-full bg-white border-2 border-plum-900`} />
          ))}
        </div>
        <div
          className="absolute rounded-md border-2 border-dashed border-peach-500 z-10"
          style={{ left: '37%', top: '58%', width: '36%', height: '24%', transform: 'translateZ(40px)' }}
        >
          {handles.map((h) => (
            <span key={h} className={`absolute ${h} w-2.5 h-2.5 rounded-full bg-white border-2 border-peach-500`} />
          ))}
        </div>

        <Chip icon={<Type className="w-3.5 h-3.5" />} label="Text" className="left-[28%] top-[11%]" z={70} />
        <Chip icon={<ImageIcon className="w-3.5 h-3.5" />} label="Image" className="right-[6%] top-[52%]" z={80} delay="-2s" />
        <Chip icon={<LayoutGrid className="w-3.5 h-3.5" />} label="Layout" className="left-[22%] bottom-[2%]" z={60} delay="-3.4s" />

        {/* Extracted text layer */}
        <div
          className="hero-float absolute -right-2 sm:-right-12 top-[-4%] z-20 w-[190px] sm:w-[230px] rounded-2xl bg-white/95 backdrop-blur p-4 shadow-[0_24px_50px_-18px_rgba(59,18,48,0.5)] ring-1 ring-plum-900/10"
          style={{ transform: 'translateZ(110px)' }}
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-plum-600">
            <span className="inline-flex items-center gap-1.5"><Type className="w-3.5 h-3.5" /> Text layer</span>
            <span className="inline-flex items-center gap-1 normal-case tracking-normal text-[10px] text-plum-800">
              <span className={`w-1.5 h-1.5 rounded-full ${edited ? 'bg-emerald-500' : 'bg-peach-500 animate-pulse'}`} />
              {edited ? 'Updated' : 'Editing'}
            </span>
          </div>
          <div className="mt-2 rounded-lg bg-cream-100 px-3 py-2 font-display text-2xl font-bold text-plum-900 h-11 flex items-center">
            <span>{edited || typed > 0 ? 'Great'.slice(0, Math.max(typed, edited ? 5 : 0)) : 'Good'}</span>
            {!edited && typed > 0 && <span className="ml-0.5 w-0.5 h-6 bg-plum-900 animate-pulse" />}
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-1.5 text-center">
            {[['Font', 'Serif'], ['Size', '96'], ['Weight', '700']].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-cream-50 ring-1 ring-plum-900/5 py-1">
                <dt className="text-[8px] uppercase tracking-wider text-plum-400">{k}</dt>
                <dd className="text-xs font-bold text-plum-900">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex items-center gap-1.5">
            {SWATCHES.map((c, i) => (
              <span key={c} className={`w-4 h-4 rounded-full ring-2 ${i === 0 ? 'ring-plum-900' : 'ring-white'}`} style={{ background: c }} />
            ))}
          </div>
        </div>

        {/* Extracted image layer: a crop of the cup artwork */}
        <div
          className="hero-float absolute -right-3 sm:-right-14 bottom-[16%] z-20 w-[130px] sm:w-[160px] rounded-2xl bg-white p-2 shadow-[0_24px_50px_-18px_rgba(59,18,48,0.5)] ring-1 ring-plum-900/10"
          style={{ transform: 'translateZ(130px)', animationDelay: '-1.6s' }}
        >
          <div
            className="aspect-square rounded-xl"
            style={{ backgroundImage: 'url(/landing/plate-b.webp)', backgroundSize: '320%', backgroundPosition: '62% 76%' }}
            role="img"
            aria-label="Cropped coffee cup illustration from the poster"
          />
          <p className="mt-1.5 px-1 text-[10px] font-bold uppercase tracking-wider text-plum-600">Image layer</p>
        </div>

        {/* Export chip */}
        <div
          className="hero-float absolute -left-1 sm:-left-8 bottom-[-4%] z-20 inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-plum-900 shadow-lg ring-1 ring-plum-900/10"
          style={{ transform: 'translateZ(90px)', animationDelay: '-0.8s' }}
        >
          <Check className="w-3.5 h-3.5 text-emerald-600" /> Export as PNG
        </div>
      </div>
    </div>
  );
};
