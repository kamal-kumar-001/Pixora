import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Does Pixora alter or compress my original image?",
      a: "No. Pixora preserves the original uploaded bitmap as a pristine base layer. Only the specific bounding boxes of modified or deleted text receive background patches, ensuring every surrounding pixel, logo, and texture stays exactly as sharp as the source."
    },
    {
      q: "What happens if replacement text is longer or shorter than the original?",
      a: "Pixora computes the union bounding box between the original text and your new replacement text. If the new text is shorter, the mask covers the full original span so old letters never peek out. If it is longer, the layer automatically expands without premature line breaks."
    },
    {
      q: "Can I sample the exact background color behind my text?",
      a: "Yes. Pixora includes an integrated EyeDropper tool. Simply click the eyedropper icon to pick the exact pixel color from cards, backgrounds, or gradients. You can also type custom hex values or choose from dark and light palette presets."
    },
    {
      q: "Is my uploaded image private and secure?",
      a: "All canvas compositing, text editing, and high resolution rendering occur entirely inside your browser. Multimodal vision requests only send image data to Google Gemini Vision AI to extract text coordinates and styles. Your images are never stored on external servers."
    },
    {
      q: "Which fonts and unicode characters are supported?",
      a: "Popular Google Fonts such as Manrope, Inter, Roboto, Montserrat, Poppins, Playfair Display, and others are preloaded. Pixora also includes a universal system font fallback stack, ensuring currency symbols like the Indian Rupee (₹), Dollar ($), and Euro (€) render accurately."
    },
    {
      q: "Can I drag text blocks to new positions?",
      a: "Yes. Click and drag any text block anywhere across the image. The coordinates automatically normalize against your current zoom level, so positioning remains pixel accurate when you export."
    },
    {
      q: "Do I need to create an account or pay a subscription?",
      a: "No. Pixora Studio is completely free to use with no account creation, no email gates, and no credit card requirements."
    },
    {
      q: "What format are exported images saved as?",
      a: "Exports are saved as full resolution, uncompressed PNG files matching the exact natural dimensions of your uploaded image."
    }
  ];

  return (
    <section id="faq" className="py-24 px-4 max-w-4xl mx-auto w-full">
      {/* Section Header */}
      <div className="text-center max-w-[680px] mx-auto mb-16">
        <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-4 inline-block">
          Frequently Answered
        </span>
        <h2 
          className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.12] mb-4 text-balance"
          style={{ letterSpacing: '-0.03em' }}
        >
          Frequently asked questions
        </h2>
        <p className="text-base text-slate-600 font-normal leading-relaxed text-pretty">
          Everything you need to know about in-place text replacement, typography detection, and image privacy.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.q}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-colors duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 select-none group"
              >
                <span className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {faq.q}
                </span>
                <span 
                  className={`w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? 'rotate-180 bg-indigo-50 text-indigo-600' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-2 pt-4">
                  <p className="text-pretty">{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
