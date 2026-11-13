import React, { useRef, useState, useEffect } from 'react';
import { Upload, Sparkles, Move, Edit3, ImagePlus } from 'lucide-react';
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
  const [isDragOver, setIsDragOver] = useState(false);

  // Dragging state tracking using pointer events with target coordinates
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    hasMoved: boolean;
  } | null>(null);

  // Global window drag and drop file handler
  useEffect(() => {
    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.types?.includes('Files')) {
        setIsDragOver(true);
      }
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Only set false if leaving window
      if (e.relatedTarget === null || e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setIsDragOver(false);
      }
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          onImageSelected(file);
        }
      }
    };

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [onImageSelected]);

  // Pointer-down handler for smooth, non-sticking text layer dragging
  const handlePointerDown = (e: React.PointerEvent, block: TextBlock) => {
    if (editingBlockId === block.id) return;
    e.stopPropagation();
    onSelectBlock(block.id);

    dragRef.current = {
      id: block.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: block.x,
      origY: block.y,
      hasMoved: false,
    };

    // Pointer capture ensures move and up events continue even outside the element
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    e.stopPropagation();

    const dx = (e.clientX - dragRef.current.startX) / zoom;
    const dy = (e.clientY - dragRef.current.startY) / zoom;

    // Small deadband to distinguish click from intentional drag
    if (!dragRef.current.hasMoved && Math.hypot(dx, dy) < 2) {
      return;
    }

    dragRef.current.hasMoved = true;
    const block = textBlocks.find(b => b.id === dragRef.current?.id);
    if (block) {
      onUpdateBlock({
        ...block,
        x: Math.round(dragRef.current.origX + dx),
        y: Math.round(dragRef.current.origY + dy),
        isModified: true,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current) {
      dragRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch (_) {}
    }
  };

  // Click on background deselects
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'IMG') {
      onSelectBlock(null);
      setEditingBlockId(null);
    }
  };

  // If no image is loaded yet, show the light theme modern upload dropzone
  if (!imageState) {
    return (
      <main className="flex-1 h-full canvas-checkerboard flex flex-col items-center justify-center p-8 select-none overflow-auto relative">
        {/* Full-screen drag-over indicator */}
        {isDragOver && (
          <div className="absolute inset-4 rounded-3xl border-3 border-dashed border-indigo-500 bg-indigo-50/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg mb-3">
              <ImagePlus className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold text-indigo-900">Drop image to start editing</p>
            <p className="text-xs text-indigo-700 mt-1">Supports PNG, JPG, WebP</p>
          </div>
        )}

        <div className="max-w-xl w-full p-8 rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5 shadow-xs">
            <Upload className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            Pixora Studio — In-Place Image Text Editor
          </h2>
          <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
            Drag and drop any receipt, screenshot, poster, or graphic directly into this window to detect and edit typography in place.
          </p>

          <label className="cursor-pointer group flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition active:scale-95 mb-6">
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
          <div className="w-full pt-6 border-t border-slate-100 flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Instant 1-Click Samples
            </span>
            <div className="grid grid-cols-2 gap-2.5 w-full">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSampleSelected(sample)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 text-left transition flex flex-col gap-1 group active:scale-95 shadow-2xs"
                >
                  <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">
                    {sample.name}
                  </span>
                  <span className="text-[11px] text-slate-500 line-clamp-1">
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
      onClick={handleCanvasClick}
      className="flex-1 h-full canvas-checkerboard relative overflow-auto select-none p-8"
    >
      {/* Drag-over indicator when image is already loaded */}
      {isDragOver && (
        <div className="absolute inset-4 rounded-3xl border-3 border-dashed border-indigo-500 bg-indigo-50/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg mb-3">
            <ImagePlus className="w-8 h-8" />
          </div>
          <p className="text-lg font-bold text-indigo-900">Drop new image to load</p>
        </div>
      )}

      {/* Centering wrapper that allows full scrollability in all directions without clipping */}
      <div className="min-w-full min-h-full flex items-center justify-center p-4">
        {/* Stage wrapper whose dimensions MATCH EXACTLY the scaled image size */}
        <div
          className="relative shadow-xl transition-all duration-75 flex-shrink-0 bg-white rounded-lg border border-slate-200/60"
          style={{
            width: Math.ceil(imageState.width * zoom),
            height: Math.ceil(imageState.height * zoom),
          }}
        >
          {/* Inner canvas stage at 100% unscaled coordinate space */}
          <div
            className="absolute top-0 left-0 origin-top-left"
            style={{
              width: imageState.width,
              height: imageState.height,
              transform: `scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            {/* 100% Original Pristine Base Image */}
            <img
              src={imageState.originalUrl}
              alt={imageState.fileName}
              className="w-full h-full object-contain pointer-events-none rounded block"
              style={{ width: imageState.width, height: imageState.height }}
            />

            {/* Dedicated Background Patch Layer: Covers the union of original text and edited text */}
            {textBlocks.map((block) => {
              const isSelected = selectedBlockId === block.id;
              const shouldPatch = block.isDeleted || block.isModified || isSelected;
              if (!shouldPatch || block.showBackgroundPatch === false) return null;

              const padX = block.patchPaddingX ?? 6;
              const padY = block.patchPaddingY ?? 4;
              const origX = block.originalX !== undefined ? block.originalX : block.x;
              const origY = block.originalY !== undefined ? block.originalY : block.y;
              const origW = block.originalWidth !== undefined ? block.originalWidth : block.width;
              const origH = block.originalHeight !== undefined ? block.originalHeight : block.height;

              // Union coordinates cover the full area so no leftover original characters peek out
              const minX = Math.min(block.x, origX);
              const minY = Math.min(block.y, origY);
              const maxX = Math.max(block.x + block.width, origX + origW);
              const maxY = Math.max(block.y + block.height, origY + origH);

              const patchLeft = Math.max(0, minX - padX);
              const patchTop = Math.max(0, minY - padY);
              const patchWidth = (maxX - minX) + padX * 2;
              const patchHeight = (maxY - minY) + padY * 2;

              return (
                <div
                  key={`patch-${block.id}`}
                  className="absolute pointer-events-none z-10"
                  style={{
                    left: `${patchLeft}px`,
                    top: `${patchTop}px`,
                    width: `${patchWidth}px`,
                    height: `${patchHeight}px`,
                    backgroundColor: block.backgroundColor || '#FFFFFF',
                  }}
                />
              );
            })}

            {/* Text Interactive Layer */}
            {textBlocks.map((block) => {
              if (block.isDeleted) return null;
              const isSelected = selectedBlockId === block.id;
              const isEditing = editingBlockId === block.id;
              const shouldRenderText = block.isModified || isSelected;

              return (
                <div
                  key={block.id}
                  onPointerDown={(e) => handlePointerDown(e, block)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onSelectBlock(block.id);
                    setEditingBlockId(block.id);
                  }}
                  className={`absolute group cursor-move select-none transition-shadow duration-75 z-20 touch-none ${
                    isSelected
                      ? 'ring-2 ring-indigo-600 ring-offset-1 ring-offset-white z-30'
                      : 'hover:ring-1 hover:ring-indigo-400 hover:bg-indigo-500/10'
                  }`}
                  style={{
                    left: `${block.x}px`,
                    top: `${block.y}px`,
                    minWidth: `${Math.max(block.width, 24)}px`,
                    minHeight: `${Math.max(block.height, 16)}px`,
                  }}
                >
                  {/* Inline input/textarea when double clicked: 100% zero-jump seamless typing */}
                  {isEditing ? (
                    block.text.includes("\n") ? (
                      <textarea
                        autoFocus
                        value={block.text}
                        onChange={(e) => {
                          onUpdateBlock({
                            ...block,
                            text: e.target.value,
                            isModified: true,
                          });
                        }}
                        onBlur={() => setEditingBlockId(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setEditingBlockId(null);
                        }}
                        className="relative z-20 w-full bg-transparent border-0 outline-none p-0 m-0 focus:ring-0 resize-none overflow-hidden"
                        style={{
                          fontFamily: `"${block.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
                          fontSize: `${block.fontSize}px`,
                          fontWeight: block.fontWeight,
                          fontStyle: block.fontStyle,
                          color: block.color,
                          textAlign: block.textAlign,
                          letterSpacing: `${block.letterSpacing}px`,
                          lineHeight: 1,
                          filter: block.blur > 0 ? `blur(${block.blur}px)` : "none",
                        }}
                      />
                    ) : (
                      <input
                        autoFocus
                        type="text"
                        value={block.text}
                        onChange={(e) => {
                          onUpdateBlock({
                            ...block,
                            text: e.target.value,
                            isModified: true,
                          });
                        }}
                        onBlur={() => setEditingBlockId(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape" || e.key === "Enter") setEditingBlockId(null);
                        }}
                        className="relative z-20 bg-transparent border-0 outline-none p-0 m-0 focus:ring-0"
                        style={{
                          fontFamily: `"${block.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
                          fontSize: `${block.fontSize}px`,
                          fontWeight: block.fontWeight,
                          fontStyle: block.fontStyle,
                          color: block.color,
                          textAlign: block.textAlign,
                          letterSpacing: `${block.letterSpacing}px`,
                          lineHeight: 1,
                          filter: block.blur > 0 ? `blur(${block.blur}px)` : "none",
                          minWidth: `${Math.max(block.width, 30)}px`,
                          width: "100%",
                        }}
                      />
                    )
                  ) : shouldRenderText ? (
                    /* Modified or selected text: rendered with realistic blur, degradation & exact typography */
                    <div
                      className="relative z-20 w-full whitespace-pre pointer-events-none select-none"
                      style={{
                        fontFamily: `"${block.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
                        fontSize: `${block.fontSize}px`,
                        fontWeight: block.fontWeight,
                        fontStyle: block.fontStyle,
                        color: block.color,
                        textAlign: block.textAlign,
                        letterSpacing: `${block.letterSpacing}px`,
                        lineHeight: 1,
                        opacity: block.opacity,
                        filter: `${block.blur > 0 ? `blur(${block.blur}px)` : ""}${block.degradation > 0 ? ` contrast(${100 - block.degradation * 0.22}%)` : ""}`.trim() || "none",
                        textShadow: block.degradation > 15 ? `0 0 1px rgba(0,0,0,${Math.min(0.4, (block.degradation / 100) * 0.4)})` : undefined,
                      }}
                    >
                      {block.text || <span className="opacity-0">.</span>}
                    </div>
                  ) : (
                    /* Untouched: 100% transparent so original image shines through */
                    <div className="w-full h-full opacity-0 pointer-events-none">
                      {block.text}
                    </div>
                  )}

                  {/* Bounding box hover hint */}
                  {!isSelected && !isEditing && (
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-5 left-0 flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9px] font-semibold tracking-wide pointer-events-none shadow-md transition-opacity">
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>Click to edit</span>
                    </div>
                  )}

                  {/* Selected badge with size & font */}
                  {isSelected && !isEditing && (
                    <div className="absolute -top-6 left-0 flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-[10px] font-bold tracking-wide pointer-events-none shadow-md z-30">
                      <Move className="w-2.5 h-2.5" />
                      <span>{block.fontSize}px {block.fontFamily}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};
