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
  Sparkles, 
  Bot,
  Pipette,
  Sliders,
  Square
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
  onAiPrompt: (instruction: string) => void;
  isAiProcessing: boolean;
}

export const StylePanel: React.FC<StylePanelProps> = ({
  selectedBlock,
  blocks,
  onUpdateBlock,
  onSelectBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onAiPrompt,
  isAiProcessing,
}) => {
  const [aiInput, setAiInput] = React.useState('');
  const palette = ['#2A0E22', '#54224A', '#F1DCCB', '#FFFFFF', '#54224A', '#EA8A68', '#059669', '#DC2626', '#D97706'];
  const bgPalette = ['#2A0E22', '#54224A', '#7D4472', '#FFF8F1', '#FFFFFF', '#FBEADB', '#F1DCCB', '#000000'];

  const handlePickColor = async (target: 'text' | 'bg') => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          if (target === 'text') {
            updateBlock({ color: result.sRGBHex });
          } else {
            updateBlock({ backgroundColor: result.sRGBHex });
          }
        }
      } catch (e) {
        console.warn('EyeDropper cancelled or unsupported', e);
      }
    } else {
      alert('EyeDropper is supported in Chrome, Edge, and Opera. You can also pick a color using the color picker.');
    }
  };

  // Helper to ensure any change sets isModified: true
  const updateBlock = (updates: Partial<TextBlock>) => {
    if (!selectedBlock) return;
    onUpdateBlock({
      ...selectedBlock,
      ...updates,
      isModified: true,
    });
  };

  const handleFontChange = (fontFamily: string) => {
    if (!selectedBlock) return;
    ensureFontLoaded(fontFamily);
    updateBlock({ fontFamily });
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiProcessing) return;
    onAiPrompt(aiInput.trim());
    setAiInput('');
  };

  const activeBlocks = blocks.filter(b => !b.isDeleted);

  return (
    <aside className="w-80 h-full bg-white border-l border-slate-200 flex flex-col p-4 select-none overflow-y-auto shadow-xs">
      {/* AI Assistant Quick Prompt */}
      <div className="mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
          <Bot className="w-4 h-4" />
          <span>AI Smart Edit</span>
        </div>
        
        <form onSubmit={handleAiSubmit} className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="e.g. 'Change amount to ₹15,000'..."
              disabled={isAiProcessing}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 shadow-2xs transition"
            />
            <button
              type="submit"
              disabled={!aiInput.trim() || isAiProcessing}
              className="absolute right-1.5 top-1.5 p-1 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition active:scale-95"
              title="Apply AI change"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Preset Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => onAiPrompt('Change the payment amount to ₹15,000')}
              disabled={isAiProcessing}
              className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-[10px] font-medium text-slate-700 transition active:scale-95"
            >
              ✨ Set ₹15,000
            </button>
            <button
              type="button"
              onClick={() => onAiPrompt('Change the payment amount to ₹25,000')}
              disabled={isAiProcessing}
              className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-[10px] font-medium text-slate-700 transition active:scale-95"
            >
              ✨ Set ₹25,000
            </button>
            <button
              type="button"
              onClick={() => onAiPrompt('Change the recipient name to Alex Morgan')}
              disabled={isAiProcessing}
              className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-[10px] font-medium text-slate-700 transition active:scale-95"
            >
              ✨ Edit Name
            </button>
          </div>
        </form>
      </div>

      {!selectedBlock ? (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Layers ({activeBlocks.length})</span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">Click to select</span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            {activeBlocks.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                No text layers detected yet.
              </div>
            ) : (
              activeBlocks.map((block, idx) => (
                <button
                  key={block.id}
                  onClick={() => onSelectBlock(block.id)}
                  className={`w-full text-left p-3 rounded-xl transition flex flex-col gap-1 group border shadow-2xs ${
                    block.isModified
                      ? 'bg-indigo-50/70 border-indigo-200 hover:bg-indigo-100/60'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded font-bold">
                        #{idx + 1}
                      </span>
                      {block.isModified && (
                        <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                          Edited
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span 
                        className="w-3 h-3 rounded-full border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: block.color }}
                      />
                      <span className="text-[10px] font-mono text-slate-600">{block.fontSize}px</span>
                    </div>
                  </div>
                  <div 
                    className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 line-clamp-2"
                    style={{ fontFamily: block.fontFamily }}
                  >
                    {block.text || <span className="italic text-slate-400">Empty text</span>}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 flex-1">
          {/* Header with Title and Close/Deselect */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Layer Inspector
              </h2>
            </div>
            <button
              onClick={() => onSelectBlock(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-0.5 rounded hover:bg-slate-100 transition"
            >
              Done
            </button>
          </div>

          {/* Text Content Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Text Content
            </label>
            <textarea
              value={selectedBlock.text}
              onChange={(e) => {
                const newText = e.target.value;
                const approxWidth = Math.max(
                  selectedBlock.originalWidth || 24,
                  Math.round(newText.length * (selectedBlock.fontSize * 0.65))
                );
                updateBlock({ 
                  text: newText,
                  width: approxWidth,
                });
              }}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-850 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 resize-none font-sans shadow-2xs"
              placeholder="Enter replacement text..."
            />
          </div>

          {/* Font Family Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Font Family
            </label>
            <select
              value={selectedBlock.fontFamily}
              onChange={(e) => handleFontChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white shadow-2xs"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Size (px)
              </label>
              <input
                type="number"
                min={8}
                max={200}
                value={selectedBlock.fontSize}
                onChange={(e) => updateBlock({ fontSize: Math.max(8, Number(e.target.value) || 12) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-indigo-500 focus:bg-white shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Weight
              </label>
              <select
                value={selectedBlock.fontWeight}
                onChange={(e) => updateBlock({ fontWeight: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white shadow-2xs"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Style & Alignment
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateBlock({ 
                  fontStyle: selectedBlock.fontStyle === 'italic' ? 'normal' : 'italic' 
                })}
                className={`p-2 rounded-lg border text-xs flex items-center justify-center transition ${
                  selectedBlock.fontStyle === 'italic' 
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>

              <div className="h-5 w-px bg-slate-200 mx-1" />

              <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-0.5">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => updateBlock({ textAlign: align })}
                    className={`p-1.5 rounded text-xs transition ${
                      selectedBlock.textAlign === align 
                        ? 'bg-white text-indigo-700 shadow-xs font-bold' 
                        : 'text-slate-600 hover:text-slate-900'
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Text Color</span>
              <span className="font-mono text-[11px] text-slate-500">{selectedBlock.color}</span>
            </label>
            
            <div className="flex items-center gap-2 mb-2">
              <input
                type="color"
                value={selectedBlock.color}
                onChange={(e) => updateBlock({ color: e.target.value })}
                className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={selectedBlock.color}
                onChange={(e) => updateBlock({ color: e.target.value })}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono uppercase focus:outline-none focus:border-indigo-500 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => handlePickColor('text')}
                title="Sample text color from image (EyeDropper)"
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition active:scale-95"
              >
                <Pipette className="w-4 h-4 text-indigo-600" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {palette.map((hex) => (
                <button
                  key={hex}
                  onClick={() => updateBlock({ color: hex })}
                  className={`w-5 h-5 rounded-md border transition active:scale-90 ${
                    selectedBlock.color.toLowerCase() === hex.toLowerCase() 
                      ? 'border-indigo-600 ring-2 ring-indigo-500/30' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          </div>

          {/* Background Patch & Clean Mask Customization */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Square className="w-3.5 h-3.5 text-indigo-600" />
                <span>Background Patch</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBlock.showBackgroundPatch !== false}
                  onChange={(e) => updateBlock({ showBackgroundPatch: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-0"
                />
                <span>Cover original</span>
              </label>
            </div>

            {selectedBlock.showBackgroundPatch !== false && (
              <>
                {/* Background Color Picker + Eyedropper */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span>Patch Fill Color</span>
                    <span className="font-mono text-slate-700 font-semibold">{selectedBlock.backgroundColor || '#FFFFFF'}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="color"
                      value={selectedBlock.backgroundColor || '#FFFFFF'}
                      onChange={(e) => updateBlock({ backgroundColor: e.target.value })}
                      className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={selectedBlock.backgroundColor || '#FFFFFF'}
                      onChange={(e) => updateBlock({ backgroundColor: e.target.value })}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono uppercase focus:outline-none focus:border-indigo-500 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => handlePickColor('bg')}
                      title="Sample background color from image (EyeDropper)"
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition active:scale-95"
                    >
                      <Pipette className="w-4 h-4 text-emerald-600" />
                    </button>
                  </div>

                  {/* Quick BG Swatches */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {bgPalette.map((hex) => (
                      <button
                        key={hex}
                        onClick={() => updateBlock({ backgroundColor: hex })}
                        className={`w-5 h-5 rounded-md border transition active:scale-90 ${
                          (selectedBlock.backgroundColor || '#FFFFFF').toLowerCase() === hex.toLowerCase() 
                            ? 'border-emerald-600 ring-2 ring-emerald-500/30' 
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                {/* Padding sliders: X and Y */}
                <div className="space-y-2 pt-1">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                      <span>Horizontal Padding</span>
                      <span className="font-mono text-indigo-700 font-bold">{selectedBlock.patchPaddingX ?? 6}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={selectedBlock.patchPaddingX ?? 6}
                      onChange={(e) => updateBlock({ patchPaddingX: Number(e.target.value) })}
                      className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                      <span>Vertical Padding</span>
                      <span className="font-mono text-indigo-700 font-bold">{selectedBlock.patchPaddingY ?? 4}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={selectedBlock.patchPaddingY ?? 4}
                      onChange={(e) => updateBlock({ patchPaddingY: Number(e.target.value) })}
                      className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Position & Geometry Dimensions */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>Layer Coordinates & Size</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-0.5">X Pos (px)</label>
                <input
                  type="number"
                  value={selectedBlock.x}
                  onChange={(e) => updateBlock({ x: Number(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono text-xs focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Y Pos (px)</label>
                <input
                  type="number"
                  value={selectedBlock.y}
                  onChange={(e) => updateBlock({ y: Number(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono text-xs focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Width (px)</label>
                <input
                  type="number"
                  min={10}
                  value={selectedBlock.width}
                  onChange={(e) => updateBlock({ width: Math.max(10, Number(e.target.value) || 10) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono text-xs focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-0.5">Height (px)</label>
                <input
                  type="number"
                  min={10}
                  value={selectedBlock.height}
                  onChange={(e) => updateBlock({ height: Math.max(10, Number(e.target.value) || 10) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 font-mono text-xs focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons: Duplicate, Reset, Delete */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onDuplicateBlock(selectedBlock.id)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition active:scale-95"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Duplicate</span>
              </button>

              <button
                onClick={() => onUpdateBlock({ ...selectedBlock, text: selectedBlock.originalText, isModified: false })}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition active:scale-95"
                title="Reset to original detected text"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset</span>
              </button>
            </div>

            <button
              onClick={() => onDeleteBlock(selectedBlock.id)}
              className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 transition active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Text Layer</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
