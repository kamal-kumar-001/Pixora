import React, { useRef, useState } from 'react';
import { ArrowRight, ScanText, SlidersHorizontal, Download, Upload, MousePointerClick, Plus } from 'lucide-react';
import { Reveal } from './useReveal';

const SectionHead: React.FC<{ kicker: string; title: string; body?: string }> = ({ kicker, title, body }) => (
  <Reveal className="max-w-2xl">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-peach-500">{kicker}</p>
    <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-plum-900 text-balance">{title}</h2>
    {body && <p className="mt-4 text-lg text-plum-800/80 text-pretty">{body}</p>}
  </Reveal>
);

const FEATURES = [
  {
    icon: ScanText,
    title: 'Finds the text for you',
    body: 'Vision AI reads the words in your image along with their position, size and color. A local OCR pass is the fallback.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Type it your way',
    body: 'Change the words, then adjust font family, size, weight, spacing, alignment and color. An eyedropper picks colors straight from the image.',
  },
  {
    icon: MousePointerClick,
    title: 'Patches only what you changed',
    body: 'Pixora covers just the area around the text you edited. Everything else in the original file stays as it was.',
  },
  {
    icon: Download,
    title: 'Export at full size',
    body: 'Download the edited image as a high-resolution PNG, at the resolution you uploaded.',
  },
];

export const Features: React.FC = () => (
  <section id="features" className="relative px-5 py-24 md:py-32">
    <div className="max-w-6xl mx-auto">
      <SectionHead
        kicker="What it does"
        title="One job, done in place"
        body="Pixora is a studio for changing the words inside a picture without rebuilding the picture around them."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 90} className="h-full">
            <article className="lift-card h-full rounded-3xl bg-white p-6 ring-1 ring-plum-900/10 shadow-[0_18px_40px_-28px_rgba(59,18,48,0.5)]">
              <div className="w-11 h-11 rounded-2xl bg-cream-100 text-plum-900 flex items-center justify-center ring-1 ring-peach-300/60">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-plum-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-plum-800/80">{f.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const STEPS = [
  { icon: Upload, title: 'Upload an image', body: 'Drop in a poster, sign, label or mockup you have the right to edit.' },
  { icon: MousePointerClick, title: 'Pick the text', body: 'Pixora marks the words it found. Select one and type the replacement.' },
  { icon: Download, title: 'Style and export', body: 'Match the font, size and color, check the result, then download the PNG.' },
];

export const HowItWorks: React.FC = () => (
  <section id="how-it-works" className="px-5 py-24 md:py-32 bg-plum-900 text-cream-100 rounded-[40px] mx-2 md:mx-4">
    <div className="max-w-6xl mx-auto">
      <Reveal className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-peach-400">How it works</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">Three steps from upload to export</h2>
      </Reveal>
      <ol className="mt-14 grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 120} className="list-none">
            <div className="lift-card-dark h-full rounded-3xl bg-plum-800/70 p-7 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <span className="font-display text-5xl font-extrabold text-peach-400/90">{i + 1}</span>
                <s.icon className="w-6 h-6 text-peach-300" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold">{s.title}</h3>
              <p className="mt-2 text-cream-200/80 leading-relaxed">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);

export const Compare: React.FC = () => {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement | null>(null);
  const drag = useRef(false);
  const setFrom = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <section id="example" className="px-5 py-24 md:py-32">
      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1fr_minmax(0,460px)] items-center">
        <SectionHead
          kicker="Before and after"
          title="Same poster, one word changed"
          body="Drag the handle to compare. This is an illustrative example made for this page, not a screenshot of an export."
        />
        <Reveal delay={120}>
          <div
            ref={box}
            className="relative aspect-[4/5] rounded-[28px] overflow-hidden ring-1 ring-plum-900/10 shadow-[0_40px_80px_-30px_rgba(59,18,48,0.45)] touch-none select-none cursor-ew-resize"
            onPointerDown={(e) => {
              drag.current = true;
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              setFrom(e.clientX);
            }}
            onPointerMove={(e) => drag.current && setFrom(e.clientX)}
            onPointerUp={() => (drag.current = false)}
          >
            <img src="/landing/plate-b.webp" alt="After: the poster reads Great Coffee" loading="lazy" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
            <img
              src="/landing/plate-a.webp"
              alt="Before: the poster reads Good Coffee"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              draggable={false}
            />
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-plum-900">Before</span>
            <span className="absolute right-3 top-3 rounded-full bg-plum-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cream-100">After</span>
            <div className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(59,18,48,0.25)]" style={{ left: `${pos}%` }}>
              <button
                type="button"
                role="slider"
                aria-label="Compare before and after"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(pos)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4));
                  if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4));
                }}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg ring-1 ring-plum-900/20 flex items-center justify-center text-plum-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-plum-900"
              >
                <span className="text-sm font-bold">&#8596;</span>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const FAQS = [
  {
    q: 'What kinds of images work?',
    a: 'Posters, signs, packaging, social graphics and mockups with clear text. Busy backgrounds and stylized lettering are harder, so check each result before you use it.',
  },
  {
    q: 'How does Pixora find the text?',
    a: 'It uses Google Gemini vision to read text, position and style, with a Tesseract OCR pass that runs in your browser as a fallback.',
  },
  {
    q: 'Does it change the rest of the image?',
    a: 'Pixora patches the area around the text you edit and leaves the rest of the picture alone. Zoom in on the export to confirm the edit looks right.',
  },
  {
    q: 'Can I pick the font and color?',
    a: 'Yes. Choose a font family, size, weight, letter spacing and alignment, and set the color with a picker or an eyedropper.',
  },
  {
    q: 'What should I not use it for?',
    a: 'Only edit images you own or have permission to change, and never to mislead people. Do not alter receipts, IDs or official documents.',
  },
];

export const Faq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="px-5 py-24 md:py-32">
      <div className="max-w-3xl mx-auto">
        <SectionHead kicker="FAQ" title="Questions, answered plainly" />
        <div className="mt-12 divide-y divide-plum-900/10 rounded-3xl bg-white ring-1 ring-plum-900/10 overflow-hidden">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-display text-lg font-bold text-plum-900 hover:bg-cream-50 transition-colors"
                >
                  {f.q}
                  <Plus className={`w-5 h-5 shrink-0 text-peach-500 transition-transform duration-300 ease-landing ${isOpen ? 'rotate-45' : ''}`} />
                </button>
                <div className={`faq-panel ${isOpen ? 'faq-open' : ''}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-plum-800/85 leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const FinalCta: React.FC<{ onOpen: () => void }> = ({ onOpen }) => (
  <section className="px-5 pb-24">
    <Reveal className="max-w-5xl mx-auto rounded-[36px] bg-gradient-to-br from-peach-300 via-peach-400 to-peach-500 p-10 md:p-16 text-center shadow-[0_40px_80px_-40px_rgba(234,138,104,0.9)]">
      <h2 className="font-display text-4xl md:text-5xl font-bold text-plum-950 text-balance">Ready to change a word?</h2>
      <p className="mt-4 text-lg text-plum-900/80">Open the studio, add an image and edit the text where it sits.</p>
      <button
        onClick={onOpen}
        className="btn-plum group mt-8 inline-flex items-center gap-2 rounded-full bg-plum-900 px-7 py-3.5 text-base font-bold text-cream-100"
      >
        Open Pixora studio
        <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-landing group-hover:translate-x-1" />
      </button>
    </Reveal>
  </section>
);
