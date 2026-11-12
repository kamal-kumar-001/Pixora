import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { CanvasArea } from './components/CanvasArea';
import { StylePanel } from './components/StylePanel';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { LandingHero } from './components/LandingHero';
import { TextBlock, EditorImageState, ProcessingProgress } from './types/editor';
import { detectTextWithGemini, applyAiRewritePrompt } from './engine/geminiAi';
import { runOcrAndExtractStyles } from './engine/ocr';
import { exportEditedImage } from './engine/exporter';
import { ensureFontLoaded } from './engine/fonts';
import { SampleImage } from './engine/sampleImages';

export const App: React.FC = () => {
  const [route, setRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p === '/edit' || window.location.hash === '#edit') return '/edit';
    }
    return '/';
  });

  const [imageState, setImageState] = useState<EditorImageState | null>(null);
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<ProcessingProgress>({
    status: 'idle',
    progress: 0,
    message: '',
  });

  // Undo / Redo History Stack
  const historyRef = useRef<TextBlock[][]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateHistoryState = () => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  };

  const pushHistorySnapshot = useCallback((newBlocks: TextBlock[]) => {
    // Truncate future history if branched
    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push(JSON.parse(JSON.stringify(newBlocks)));
    // Keep max 40 steps
    if (nextHistory.length > 40) {
      nextHistory.shift();
    }
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
    updateHistoryState();
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const snapshot = historyRef.current[historyIndexRef.current];
      setTextBlocks(JSON.parse(JSON.stringify(snapshot)));
      updateHistoryState();
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const snapshot = historyRef.current[historyIndexRef.current];
      setTextBlocks(JSON.parse(JSON.stringify(snapshot)));
      updateHistoryState();
    }
  }, []);

  // Global Keyboard shortcuts for Undo and Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      if (cmdKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (!isMac && cmdKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === '/edit' || window.location.hash === '#edit') {
        setRoute('/edit');
      } else {
        setRoute('/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
    }
    setRoute(path);
  };

  // Process an image source (from File or DataURL)
  const processImageSource = async (src: string, fileName: string) => {
    try {
      setProgress({
        status: 'uploading',
        progress: 10,
        message: 'Loading image into AI Canvas...',
      });

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      // Calculate initial zoom fit
      const maxW = window.innerWidth - 380;
      const maxH = window.innerHeight - 120;
      const scaleFit = Math.min(1, Math.min(maxW / canvas.width, maxH / canvas.height));
      setZoom(Math.max(0.4, Number(scaleFit.toFixed(2))));

      let detectedBlocks: TextBlock[] = [];

      // 1. Try Gemini Vision AI first for highest precision
      try {
        detectedBlocks = await detectTextWithGemini(canvas, setProgress);
      } catch (geminiError) {
        console.warn('Gemini Vision API fallback to local OCR:', geminiError);
        detectedBlocks = await runOcrAndExtractStyles(canvas, setProgress);
      }

      // Preload detected fonts
      for (const b of detectedBlocks) {
        ensureFontLoaded(b.fontFamily);
      }

      const originalUrl = canvas.toDataURL('image/png');

      setImageState({
        originalUrl,
        width: canvas.width,
        height: canvas.height,
        fileName,
      });

      setTextBlocks(detectedBlocks);
      setSelectedBlockId(null);

      // Initialize history stack with initial state
      historyRef.current = [JSON.parse(JSON.stringify(detectedBlocks))];
      historyIndexRef.current = 0;
      updateHistoryState();

      navigateTo('/edit');

      setProgress({
        status: 'ready',
        progress: 100,
        message: 'Ready!',
      });
    } catch (err) {
      console.error('Image processing failed:', err);
      setProgress({
        status: 'idle',
        progress: 0,
        message: 'Failed to process image.',
      });
      alert('Could not process this image. Please try another image.');
    }
  };

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        processImageSource(e.target.result as string, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSampleSelected = (sample: SampleImage) => {
    const dataUrl = sample.generateDataUrl();
    processImageSource(dataUrl, `${sample.id}.png`);
  };

  const handleAddText = () => {
    if (!imageState) return;

    // Place new text at center of image
    const newBlock: TextBlock = {
      id: `text-block-${Date.now()}`,
      text: 'New Headline',
      originalText: '',
      x: Math.round(imageState.width / 2 - 120),
      y: Math.round(imageState.height / 2 - 30),
      width: 240,
      height: 60,
      originalX: Math.round(imageState.width / 2 - 120),
      originalY: Math.round(imageState.height / 2 - 30),
      originalWidth: 240,
      originalHeight: 60,
      patchPaddingX: 6,
      patchPaddingY: 4,
      showBackgroundPatch: true,
      fontSize: 36,
      fontFamily: 'Manrope',
      fontWeight: '700',
      fontStyle: 'normal',
      color: '#0F172A',
      backgroundColor: '#FFFFFF',
      textAlign: 'center',
      letterSpacing: 0,
      lineHeight: 1.2,
      opacity: 1,
      confidence: 100,
      isModified: true,
      isDeleted: false,
    };

    setTextBlocks(prev => {
      const updated = [...prev, newBlock];
      pushHistorySnapshot(updated);
      return updated;
    });
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlock = (updated: TextBlock) => {
    const isNowModified = updated.isModified || updated.text !== updated.originalText;
    const finalBlock = { ...updated, isModified: isNowModified };
    setTextBlocks(prev => {
      const next = prev.map(b => b.id === updated.id ? finalBlock : b);
      pushHistorySnapshot(next);
      return next;
    });
  };

  const handleDeleteBlock = (id: string) => {
    setTextBlocks(prev => {
      const next = prev.map(b => b.id === id ? { ...b, isDeleted: true, isModified: true } : b);
      pushHistorySnapshot(next);
      return next;
    });
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const handleDuplicateBlock = (id: string) => {
    const block = textBlocks.find(b => b.id === id);
    if (!block) return;

    const duplicated: TextBlock = {
      ...block,
      id: `text-block-${Date.now()}`,
      x: block.x + 20,
      y: block.y + 20,
      isModified: true,
    };

    setTextBlocks(prev => {
      const next = [...prev, duplicated];
      pushHistorySnapshot(next);
      return next;
    });
    setSelectedBlockId(duplicated.id);
  };

  const handleAiPrompt = async (instruction: string) => {
    if (!textBlocks.length) return;
    setIsAiProcessing(true);
    try {
      const updated = await applyAiRewritePrompt(instruction, textBlocks);
      setTextBlocks(updated);
      pushHistorySnapshot(updated);
    } catch (e) {
      console.error('AI rewrite error:', e);
      alert('AI rewrite encountered an issue. You can edit text directly on the image.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleExport = () => {
    if (!imageState) return;
    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = imageState.originalUrl;
    bgImg.onload = () => {
      exportEditedImage(bgImg, textBlocks, imageState.fileName);
    };
  };

  const selectedBlock = textBlocks.find(b => b.id === selectedBlockId && !b.isDeleted) || null;

  if (route !== '/edit') {
    return <LandingHero onNavigateToEditor={() => navigateTo('/edit')} />;
  }

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-slate-50 font-sans">
      <Header
        onImageSelected={handleImageFile}
        onSampleSelected={handleSampleSelected}
        onExport={handleExport}
        onAddText={handleAddText}
        onNavigateToLanding={() => navigateTo('/')}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        zoom={zoom}
        onZoomChange={setZoom}
        hasImage={!!imageState}
        blockCount={textBlocks.filter(b => !b.isDeleted).length}
      />

      <div className="flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden">
        <CanvasArea
          imageState={imageState}
          textBlocks={textBlocks}
          selectedBlockId={selectedBlockId}
          zoom={zoom}
          onSelectBlock={setSelectedBlockId}
          onUpdateBlock={handleUpdateBlock}
          onImageSelected={handleImageFile}
          onSampleSelected={handleSampleSelected}
        />

        {imageState && (
          <StylePanel
            selectedBlock={selectedBlock}
            blocks={textBlocks}
            onUpdateBlock={handleUpdateBlock}
            onSelectBlock={setSelectedBlockId}
            onDeleteBlock={handleDeleteBlock}
            onDuplicateBlock={handleDuplicateBlock}
            onAiPrompt={handleAiPrompt}
            isAiProcessing={isAiProcessing}
          />
        )}
      </div>

      <ProcessingOverlay progress={progress} />
    </div>
  );
};
export default App;
