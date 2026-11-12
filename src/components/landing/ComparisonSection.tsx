import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const rows = [
    {
      feature: "Preserves 100% of original image quality",
      pixora: true,
      inpainting: false,
      photoshop: true,
      note: "Pixora never recompresses or regenerates untouched areas."
    },
    {
      feature: "Leaves logos, icons, and badges intact",
      pixora: true,
      inpainting: false,
      photoshop: true,
      note: "Generative models hallucinate or blur intricate vector marks."
    },
    {
      feature: "Automatic font family and weight detection",
      pixora: true,
      inpainting: false,
      photoshop: false,
      note: "Gemini Vision AI identifies typography directly from pixels."
    },
    {
      feature: "Integrated surface color eyedropper and masks",
      pixora: true,
      inpainting: false,
      photoshop: true,
      note: "Sample exact background tones and adjust mask padding."
    },
    {
      feature: "Browser native with zero software installation",
      pixora: true,
      inpainting: true,
      photoshop: false,
      note: "Runs entirely in modern web browsers without heavy downloads."
    },
    {
      feature: "No account or credit card required",
      pixora: true,
      inpainting: false,
      photoshop: false,
      note: "Start editing immediately with no paywalls or sign up gates."
    }
  ];

  return (
    <section className="py-24 px-4 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-5xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-4 inline-block">
            Clear Comparison
          </span>
          <h2 
            className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.12] mb-4 text-balance"
            style={{ letterSpacing: '-0.03em' }}
          >
            Why in-place editing outperforms blind inpainting
          </h2>
          <p className="text-base text-slate-600 font-normal leading-relaxed text-pretty">
            See how Pixora compares to traditional generative AI inpainting and heavy desktop design software.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="p-4 sm:p-5 font-semibold text-slate-900 w-1/2">
                    Key Requirements
                  </th>
                  <th className="p-4 sm:p-5 font-bold text-indigo-600 bg-indigo-50/50 text-center w-1/6 border-x border-indigo-100">
                    <div className="flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Pixora Studio</span>
                    </div>
                  </th>
                  <th className="p-4 sm:p-5 font-medium text-slate-500 text-center w-1/6">
                    Blind Inpainting
                  </th>
                  <th className="p-4 sm:p-5 font-medium text-slate-500 text-center w-1/6">
                    Desktop Photoshop
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sm:p-5">
                      <div className="font-semibold text-slate-800">{row.feature}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{row.note}</div>
                    </td>
                    
                    {/* Pixora Column */}
                    <td className="p-4 sm:p-5 text-center bg-indigo-50/20 border-x border-indigo-100/60">
                      {row.pixora ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
                          <X className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      )}
                    </td>

                    {/* Generative Inpainting Column */}
                    <td className="p-4 sm:p-5 text-center">
                      {row.inpainting ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                          <X className="w-4 h-4 stroke-[2]" />
                        </div>
                      )}
                    </td>

                    {/* Photoshop Column */}
                    <td className="p-4 sm:p-5 text-center">
                      {row.photoshop ? (
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
                          <Check className="w-4 h-4 stroke-[2]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                          <X className="w-4 h-4 stroke-[2]" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
