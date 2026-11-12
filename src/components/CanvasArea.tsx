import React, { useRef, useState, useEffect } from 'react';
import { Upload, Sparkles, Move, Edit3 } from 'lucide-react';
import { TextBlock, EditorImageState } from '../types/editor';
import { SAMPLE_IMAGES, SampleImage } from '../engine/sampleImages';

interface CanvasAreaProps {
  imageState: EditorImageState | null;
  textBlocks: TextBlock[];
  selectedBlockId: string | null;
  zoom: number;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (updated: TextBlock) => void;
  onImageSelected: (file: File) => void;
  onSampleSelected: (sample: SampleImage) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  imageState,
  textBlocks,
  selectedBlockId,
  zoom,
  onSelectBlock,
  onUpdateBlock,
  onImageSelected,
  onSampleSelected,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  // Pan state for middle click or space-drag
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number; startPanX: number; startPanY: number } | null>(null);

  // Dragging a text block
  const handleBlockMouseDown = (e: React.MouseEvent, block: TextBlock) => {
    e.stopPropagation();
    onSelectBlock(block.id);

    // If already double-clicked to inline edit, allow text cursor selection instead of block drag
    if (editingBlockId === block.id) return;

    setIsDragging(true);
    dragRef.current = {
      id: block.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: block.x,
      origY: block.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Handle text block drag
      if (isDragging && dragRef.current) {
        const dx = (e.clientX - dragRef.current.startX) / zoom;
        const dy = (e.clientY - dragRef.current.startY) / zoom;
        const block = textBlocks.find(b => b.id === dragRef.current?.id);
        if (block) {
          onUpdateBlock({
            ...block,
            x: Math.round(dragRef.current.origX + dx),
            y: Math.round(dragRef.current.origY + dy),
            isModified: true,
          });
        }
      }

      // Handle canvas panning
      if (isPanning && panStartRef.current) {
        setPan({
          x: panStartRef.current.startPanX + (e.clientX - panStartRef.current.x),
          y: panStartRef.current.startPanY + (e.clientY - panStartRef.current.y),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
      setIsPanning(false);
      panStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isPanning, textBlocks, zoom, onUpdateBlock]);

  // Handle pan on background
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'IMG') {
      onSelectBlock(null);
      setEditingBlockId(null);
      if (e.button === 0 || e.button === 1) { // Left or middle click on background
        setIsPanning(true);
        panStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          startPanX: pan.x,
          startPanY: pan.y,
        };
      }
    }
  };

  // If no image is loaded yet, show the modern upload dropzone
  if (!imageState) {
    return (
      <main className="flex-1 h-full canvas-checkerboard flex flex-col items-center justify-center p-8 select-none overflow-auto">
        <div className="max-w-xl w-full p-8 rounded-2xl bg-studio-900/90 border border-studio-700/80 shadow-2xl backdrop-blur flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 shadow-lg">
            <Upload className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            TypeShift AI — In-Place Image Text Editor
          </h2>
          <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
            Upload any screenshot, poster, receipt, or graphic. Hover over any text to select and edit it in-place. The original image quality and logos remain 100% crisp and untouched.
          </p>

          <label className="cursor-pointer group flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95 mb-6">
            <Upload className="w-4 h-4" />
            <span>Choose Image to Edit</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onImageSelected(e.target.files[0]);
                }
              }}
            />
          </label>

          {/* Preset Samples */}
          <div className="w-full pt-6 border-t border-studio-800 flex flex-col items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Instant 1-Click Samples
            </span>
            <div className="grid grid-cols-2 gap-2.5 w-full">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSampleSelected(sample)}
                  className="p-3 rounded-xl bg-studio-800 hover:bg-studio-750 border border-studio-700/70 hover:border-indigo-500/50 text-left transition flex flex-col gap-1 group active:scale-95"
                >
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                    {sample.name}
                  </span>
                  <span className="text-[11px] text-slate-400 line-clamp-1">
                    {sample.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      className="flex-1 h-full canvas-checkerboard relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
    >
      {/* Viewport Transform Container */}
      <div
        className="relative transition-transform duration-75 origin-center shadow-2xl"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: imageState.width,
          height: imageState.height,
        }}
      >
        {/* 100% Original Pristine Base Image */}
        <img
          src={imageState.originalUrl}
          alt={imageState.fileName}
          className="w-full h-full object-contain pointer-events-none rounded shadow-lg block"
          style={{ width: imageState.width, height: imageState.height }}
        />

        {/* Text Layer Overlay */}
        {textBlocks.map((block) => {
          const isSelected = selectedBlockId === block.id;
          const isEditing = editingBlockId === block.id;
          const shouldRenderReplacement = block.isModified || isSelected;

          // If block is deleted, render clean patch to hide original text
          if (block.isDeleted) {
            return (
              <div
                key={block.id}
                className="absolute pointer-events-none rounded"
                style={{
                  left: `${block.x - 2}px`,
                  top: `${block.y - 2}px`,
                  width: `${block.width + 4}px`,
                  height: `${block.height + 4}px`,
                  backgroundColor: block.backgroundColor,
                }}
              />
            );
          }

          return (
            <div
              key={block.id}
              onMouseDown={(e) => handleBlockMouseDown(e, block)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onSelectBlock(block.id);
                setEditingBlockId(block.id);
              }}
              className={`absolute group cursor-pointer select-none transition-all duration-150 ${
                isSelected
                  ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-black/50 z-30'
                  : 'hover:ring-1 hover:ring-indigo-400 hover:bg-indigo-500/10 z-10'
              }`}
              style={{
                left: `${block.x}px`,
                top: `${block.y}px`,
                minWidth: `${Math.max(block.width, 24)}px`,
                minHeight: `${Math.max(block.height, 16)}px`,
              }}
            >
              {/* Background Patch: ONLY shown if text has been edited or is actively selected */}
              {shouldRenderReplacement && (
                <div
                  className="absolute -inset-1 rounded pointer-events-none"
                  style={{
                    backgroundColor: block.backgroundColor,
                    boxShadow: `0 0 4px ${block.backgroundColor}`,
                  }}
                />
              )}

              {/* Text Rendering: If editing, show inline input */}
              {isEditing ? (
                <textarea
                  autoFocus
                  value={block.text}
                  onChange={(e) => onUpdateBlock({ ...block, text: e.target.value, isModified: true })}
                  onBlur={() => setEditingBlockId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setEditingBlockId(null);
                  }}
                  className="relative z-10 w-full h-full bg-studio-950/90 border border-indigo-400 rounded px-1 text-slate-100 focus:outline-none resize-none leading-none"
                  style={{
                    fontFamily: block.fontFamily,
                    fontSize: `${block.fontSize}px`,
                    fontWeight: block.fontWeight,
                    fontStyle: block.fontStyle,
                    color: block.color,
                    textAlign: block.textAlign,
                    letterSpacing: `${block.letterSpacing}px`,
                    lineHeight: block.lineHeight,
                  }}
                />
              ) : shouldRenderReplacement ? (
                /* If modified, render clean new typography over the patch */
                <div
                  className="relative z-10 w-full h-full whitespace-pre-wrap pointer-events-none leading-none select-none"
                  style={{
                    fontFamily: block.fontFamily,
                    fontSize: `${block.fontSize}px`,
                    fontWeight: block.fontWeight,
                    fontStyle: block.fontStyle,
                    color: block.color,
                    textAlign: block.textAlign,
                    letterSpacing: `${block.letterSpacing}px`,
                    lineHeight: block.lineHeight,
                    opacity: block.opacity,
                  }}
                >
                  {block.text || <span className="opacity-0">.</span>}
                </div>
              ) : (
                /* If untouched and unselected: completely transparent so user sees 100% original image! */
                <div className="w-full h-full opacity-0 pointer-events-none">
                  {block.text}
                </div>
              )}

              {/* Bounding box hover hint */}
              {!isSelected && !isEditing && (
                <div className="opacity-0 group-hover:opacity-100 absolute -top-5 left-0 flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9px] font-medium tracking-wide pointer-events-none shadow-md transition-opacity">
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Click to edit</span>
                </div>
              )}

              {/* Selected badge with size & font */}
              {isSelected && !isEditing && (
                <div className="absolute -top-6 left-0 flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[10px] font-semibold tracking-wide pointer-events-none shadow-md z-30">
                  <Move className="w-2.5 h-2.5" />
                  <span>{block.fontSize}px {block.fontFamily}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
};
