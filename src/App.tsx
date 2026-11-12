import React, { useState } from 'react';
import { Header } from './components/Header';
import { CanvasArea } from './components/CanvasArea';
import { StylePanel } from './components/StylePanel';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { TextBlock, EditorImageState, ProcessingProgress } from './types/editor';
import { runOcrAndExtractStyles } from './engine/ocr';
import { exportEditedImage } from './engine/exporter';
import { ensureFontLoaded } from './engine/fonts';
import { SampleImage } from './engine/sampleImages';

export const App: React.FC = () => {
  const [imageState, setImageState] = useState<EditorImageState | null>(null);
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [progress, setProgress] = useState<ProcessingProgress>({
    status: 'idle',
    progress: 0,
    message: '',
  });

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

      // 1. Run OCR and Style Extraction
      const detectedBlocks = await runOcrAndExtractStyles(canvas, setProgress);

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
      // Keep selectedBlockId null initially so the user views the pristine image!
      setSelectedBlockId(null);

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
      originalText: 'New Headline',
      x: Math.round(imageState.width / 2 - 120),
      y: Math.round(imageState.height / 2 - 30),
      width: 240,
      height: 60,
      fontSize: 36,
      fontFamily: 'Inter',
      fontWeight: '700',
      fontStyle: 'normal',
      color: '#ffffff',
      backgroundColor: '#12141c',
      textAlign: 'center',
      letterSpacing: 0,
      lineHeight: 1.2,
      opacity: 1,
      confidence: 100,
      isModified: true,
      isDeleted: false,
    };

    setTextBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlock = (updated: TextBlock) => {
    setTextBlocks(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const handleDeleteBlock = (id: string) => {
    setTextBlocks(prev => prev.map(b => b.id === id ? { ...b, isDeleted: true, isModified: true } : b));
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

    setTextBlocks(prev => [...prev, duplicated]);
    setSelectedBlockId(duplicated.id);
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

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-studio-950 font-sans">
      <Header
        onImageSelected={handleImageFile}
        onSampleSelected={handleSampleSelected}
        onExport={handleExport}
        onAddText={handleAddText}
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
          />
        )}
      </div>

      <ProcessingOverlay progress={progress} />
    </div>
  );
};
export default App;
