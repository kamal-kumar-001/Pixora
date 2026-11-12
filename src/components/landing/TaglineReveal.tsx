import React, { useEffect, useRef, useState } from 'react';

export const TaglineReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const words = [
    "Every", "image", "holds", "a", "story.",
    "Editing", "the", "words", "should", "never",
    "mean", "sacrificing", "the", "pixels."
  ];

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }

          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Fraction of element entering into viewport center
          const triggerStart = windowHeight * 0.85;
          const triggerEnd = windowHeight * 0.35;
          const progress = Math.min(
            1,
            Math.max(0, (triggerStart - rect.top) / (triggerStart - triggerEnd))
          );

          const targetIndex = Math.floor(progress * (words.length + 1));
          setActiveWordIndex(targetIndex);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion, words.length]);

  return (
    <section 
      ref={containerRef}
      className="py-24 px-4 bg-white border-y border-slate-200/80 flex flex-col items-center justify-center text-center select-none"
    >
      <div className="max-w-[680px] mx-auto">
        <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-6 inline-block">
          Core Philosophy
        </span>

        <h2 
          className="text-4xl sm:text-5xl font-semibold leading-[1.15] tracking-tight text-balance"
          style={{ letterSpacing: '-0.03em' }}
        >
          {words.map((word, idx) => {
            const isRevealed = prefersReducedMotion || idx < activeWordIndex;
            return (
              <span
                key={`${word}-${idx}`}
                className={`inline-block mr-2.5 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isRevealed
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-300 font-medium'
                }`}
              >
                {word}
              </span>
            );
          })}
        </h2>

        <p className="mt-6 text-sm sm:text-base text-slate-500 max-w-[520px] mx-auto font-normal text-pretty leading-relaxed">
          Traditional editors blur backgrounds, hallucinate artifacts, and destroy fine textures. 
          Pixora isolates only the text bounding box, guaranteeing 100% untouched graphics.
        </p>
      </div>
    </section>
  );
};
