import React from 'react';
import { 
  Type, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Trash2, 
  Copy, 
  RotateCcw,
  Layers,
  Sparkles
} from 'lucide-react';
import { TextBlock } from '../types/editor';
import { POPULAR_FONTS, ensureFontLoaded } from '../engine/fonts';

interface StylePanelProps {
  selectedBlock: TextBlock | null;
  blocks: TextBlock[];
  onUpdateBlock: (updated: TextBlock) => void;
  onSelectBlock: (id: string | null) => void;
  onDeleteBlock: (id: string) => void;
  onDuplicateBlock: (id: string) => void;
}

export const StylePanel: React.FC<StylePanelProps> = ({
  selectedBlock,
  blocks,
  onUpdateBlock,
  onSelectBlock,
  onDeleteBlock,
  onDuplicateBlock,
}) => {
  // Common quick palette + detected colors
  const palette = ['#ffffff', '#000000', '#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#38bdf8'];

  const handleFontChange = (fontFamily: string) => {
    if (!selectedBlock) return;
    ensureFontLoaded(fontFamily);
    onUpdateBlock({ ...selectedBlock, fontFamily, isModified: true });
  };

  const activeBlocks = blocks.filter(b => !b.isDeleted);

  if (!selectedBlock) {
    return (
      <aside className="w-80 h-full bg-studio-900 border-l border-studio-800 flex flex-col p-4 select-none overflow-y-auto">
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Recognized Text Layers ({activeBlocks.length})</span>
        </div>

        {activeBlocks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 border border-dashed border-studio-800 rounded-xl">
            <Sparkles className="w-8 h-8 mb-2 opacity-40 text-indigo-400" />
            <p className="text-sm font-medium text-slate-400">No text recognized yet</p>
            <p className="text-xs text-slate-500 mt-1">Upload an image or select a sample to begin editing text in place.</p>
          </div>
        ) : (
          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            <p className="text-xs text-slate-400 mb-2">
              Click any text layer below or directly on the image to edit:
            </p>
            {activeBlocks.map((block, idx) => (
              <button
                key={block.id}
                onClick={() => onSelectBlock(block.id)}
                className="w-full text-left p-3 rounded-xl bg-studio-850 hover:bg-studio-800 border border-studio-700/60 hover:border-indigo-500/50 transition flex flex-col gap-1.5 group"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                    Layer #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-3 h-3 rounded-full border border-slate-600 shadow-sm"
                      style={{ backgroundColor: block.color }}
                    />
                    <span className="text-[10px]">{block.fontSize}px</span>
                  </div>
                </div>
                <div 
                  className="text-sm font-medium text-slate-100 group-hover:text-indigo-300 line-clamp-2"
                  style={{ fontFamily: block.fontFamily }}
                >
                  {block.text || <span className="italic text-slate-500">Empty text</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside className="w-80 h-full bg-studio-900 border-l border-studio-800 flex flex-col p-4 select-none overflow-y-auto">
      {/* Header with Title and Close/Deselect */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-studio-800">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Typography Inspector
          </h2>
        </div>
        <button
          onClick={() => onSelectBlock(null)}
          className="text-xs text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded hover:bg-studio-800"
        >
          Done
        </button>
      </div>

      <div className="space-y-4">
        {/* Text Content Area */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Text Content
          </label>
          <textarea
            value={selectedBlock.text}
            onChange={(e) => onUpdateBlock({ ...selectedBlock, text: e.target.value })}
            rows={3}
            className="w-full bg-studio-800 border border-studio-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-sans"
            placeholder="Enter replacement text..."
          />
        </div>

        {/* Font Family Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Font Family
          </label>
          <select
            value={selectedBlock.fontFamily}
            onChange={(e) => handleFontChange(e.target.value)}
            className="w-full bg-studio-800 border border-studio-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
          >
            {POPULAR_FONTS.map((font) => (
              <option key={font.family} value={font.family}>
                {font.family} ({font.category})
              </option>
            ))}
          </select>
        </div>

        {/* Font Size & Weight */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Size (px)
            </label>
            <input
              type="number"
              min={8}
              max={200}
              value={selectedBlock.fontSize}
              onChange={(e) => onUpdateBlock({ ...selectedBlock, fontSize: Math.max(8, Number(e.target.value) || 12) })}
              className="w-full bg-studio-800 border border-studio-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Weight
            </label>
            <select
              value={selectedBlock.fontWeight}
              onChange={(e) => onUpdateBlock({ ...selectedBlock, fontWeight: e.target.value as any })}
              className="w-full bg-studio-800 border border-studio-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">SemiBold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">ExtraBold (800)</option>
            </select>
          </div>
        </div>

        {/* Alignment & Styles */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Style & Alignment
          </label>
          <div className="flex items-center gap-2">
            {/* Italic toggle */}
            <button
              onClick={() => onUpdateBlock({ 
                ...selectedBlock, 
                fontStyle: selectedBlock.fontStyle === 'italic' ? 'normal' : 'italic' 
              })}
              className={`p-2 rounded-lg border text-xs flex items-center justify-center transition ${
                selectedBlock.fontStyle === 'italic' 
                  ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50' 
                  : 'bg-studio-800 text-slate-400 border-studio-700 hover:text-slate-200'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-studio-800 mx-1" />

            {/* Alignments */}
            <div className="flex bg-studio-800 border border-studio-700 rounded-lg p-0.5">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => onUpdateBlock({ ...selectedBlock, textAlign: align })}
                  className={`p-1.5 rounded text-xs transition ${
                    selectedBlock.textAlign === align 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Align ${align}`}
                >
                  {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                  {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                  {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Text Color Picker & Palette */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Color</span>
            <span className="font-mono text-[11px] text-slate-400">{selectedBlock.color}</span>
          </label>
          
          <div className="flex items-center gap-2 mb-2">
            <input
              type="color"
              value={selectedBlock.color}
              onChange={(e) => onUpdateBlock({ ...selectedBlock, color: e.target.value })}
              className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
            />
            <input
              type="text"
              value={selectedBlock.color}
              onChange={(e) => onUpdateBlock({ ...selectedBlock, color: e.target.value })}
              className="flex-1 bg-studio-800 border border-studio-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono uppercase"
            />
          </div>

          {/* Quick Swatches */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {palette.map((hex) => (
              <button
                key={hex}
                onClick={() => onUpdateBlock({ ...selectedBlock, color: hex })}
                className={`w-6 h-6 rounded-md border transition active:scale-90 ${
                  selectedBlock.color.toLowerCase() === hex.toLowerCase() 
                    ? 'border-indigo-400 ring-2 ring-indigo-500/40' 
                    : 'border-studio-700 hover:border-slate-500'
                }`}
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        </div>

        {/* Spacing & Opacity */}
        <div className="space-y-3 pt-2 border-t border-studio-800">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Letter Spacing</span>
              <span className="font-mono">{selectedBlock.letterSpacing}px</span>
            </div>
            <input
              type="range"
              min="-2"
              max="16"
              value={selectedBlock.letterSpacing}
              onChange={(e) => onUpdateBlock({ ...selectedBlock, letterSpacing: Number(e.target.value) })}
              className="w-full accent-indigo-500 h-1.5 bg-studio-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Opacity</span>
              <span className="font-mono">{Math.round(selectedBlock.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={selectedBlock.opacity}
              onChange={(e) => onUpdateBlock({ ...selectedBlock, opacity: Number(e.target.value) })}
              className="w-full accent-indigo-500 h-1.5 bg-studio-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons: Duplicate, Reset, Delete */}
        <div className="pt-4 border-t border-studio-800 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onDuplicateBlock(selectedBlock.id)}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-studio-800 hover:bg-studio-750 border border-studio-700 text-xs font-medium text-slate-200 transition active:scale-95"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Duplicate</span>
            </button>

            <button
              onClick={() => onUpdateBlock({ ...selectedBlock, text: selectedBlock.originalText, isModified: false })}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-studio-800 hover:bg-studio-750 border border-studio-700 text-xs font-medium text-slate-200 transition active:scale-95"
              title="Reset to original detected text"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset</span>
            </button>
          </div>

          <button
            onClick={() => onDeleteBlock(selectedBlock.id)}
            className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-medium text-rose-300 transition active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Text</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
