import React, { useState } from 'react';
import { useSound } from './SoundManager';
import { MOCK_USERS } from '../constants';
import { LoadingAnimation } from '../types';
import CodeEditorModal from './CodeEditorModal';
import FullscreenViewer from './FullscreenViewer';

const FeaturedTesseractLoader: React.FC = () => {
  const { playSound } = useSound();
  const [copied, setCopied] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const author = MOCK_USERS.fourkmal;

  // Cube dimensions
  const size = 80; // px - outer cube
  const translate = size / 2;
  const innerSize = 40; // px - inner cube
  const innerTranslate = innerSize / 2;

  // Exportable HTML/CSS code
  const tesseractCode = `<!-- TESSERACT SPINNER -->
<style>
  @keyframes rotate-cube {
    0% { transform: rotateX(0deg) rotateY(0deg); }
    100% { transform: rotateX(360deg) rotateY(360deg); }
  }
  @keyframes rotate-cube-reverse {
    0% { transform: rotateX(0deg) rotateY(0deg); }
    100% { transform: rotateX(-360deg) rotateY(-360deg); }
  }
  .tesseract-container {
    perspective: 1000px;
  }
  .tesseract-outer {
    width: 80px;
    height: 80px;
    position: relative;
    transform-style: preserve-3d;
    animation: rotate-cube 4s infinite linear;
  }
  .tesseract-inner {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 20px;
    left: 20px;
    transform-style: preserve-3d;
    animation: rotate-cube-reverse 3s infinite linear;
  }
  .face-outer {
    position: absolute;
    width: 80px;
    height: 80px;
    border: 1px solid #10b981;
    background: rgba(16, 185, 129, 0.05);
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);
  }
  .face-inner {
    position: absolute;
    width: 40px;
    height: 40px;
    border: 1px solid #059669;
    background: rgba(5, 150, 105, 0.2);
  }
</style>

<div class="tesseract-container">
  <div class="tesseract-outer">
    <!-- Outer Cube Faces -->
    <div class="face-outer" style="transform: rotateY(0deg) translateZ(40px)"></div>
    <div class="face-outer" style="transform: rotateY(180deg) translateZ(40px)"></div>
    <div class="face-outer" style="transform: rotateY(90deg) translateZ(40px)"></div>
    <div class="face-outer" style="transform: rotateY(-90deg) translateZ(40px)"></div>
    <div class="face-outer" style="transform: rotateX(90deg) translateZ(40px)"></div>
    <div class="face-outer" style="transform: rotateX(-90deg) translateZ(40px)"></div>
    
    <!-- Inner Cube -->
    <div class="tesseract-inner">
      <div class="face-inner" style="transform: rotateY(0deg) translateZ(20px)"></div>
      <div class="face-inner" style="transform: rotateY(180deg) translateZ(20px)"></div>
      <div class="face-inner" style="transform: rotateY(90deg) translateZ(20px)"></div>
      <div class="face-inner" style="transform: rotateY(-90deg) translateZ(20px)"></div>
      <div class="face-inner" style="transform: rotateX(90deg) translateZ(20px)"></div>
      <div class="face-inner" style="transform: rotateX(-90deg) translateZ(20px)"></div>
    </div>
  </div>
</div>`;

  const handleCopy = () => {
    playSound('copy');
    navigator.clipboard.writeText(tesseractCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewCode = () => {
    playSound('click');
    setIsEditorOpen(true);
  };

  const handleFullscreen = () => {
    playSound('click');
    setIsFullscreenOpen(true);
  };

  // Create mock LoadingAnimation for FullscreenViewer
  const tesseractAnimation: LoadingAnimation = {
    id: 'tesseract-spinner',
    name: 'TESSERACT_SPINNER',
    description: 'A 3D tesseract (nested cube) spinner animation.',
    category: 'Shape Shift',
    html: tesseractCode,
    tailwindClasses: '',
    author: author,
  };

  // Inline styles for faces
  const outerFaceStyle: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    border: '1px solid #10b981',
    background: 'rgba(16, 185, 129, 0.05)',
    boxShadow: '0 0 15px rgba(16, 185, 129, 0.1)',
    backfaceVisibility: 'visible',
  };

  const innerFaceStyle: React.CSSProperties = {
    position: 'absolute',
    width: innerSize,
    height: innerSize,
    border: '1px solid #059669',
    background: 'rgba(5, 150, 105, 0.2)',
    backfaceVisibility: 'visible',
  };

  const styles = `
    @keyframes rotate-cube {
      0% { transform: rotateX(0deg) rotateY(0deg); }
      100% { transform: rotateX(360deg) rotateY(360deg); }
    }
    @keyframes rotate-cube-reverse {
      0% { transform: rotateX(0deg) rotateY(0deg); }
      100% { transform: rotateX(-360deg) rotateY(-360deg); }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="bg-zinc-950/50 border border-emerald-900/50 rounded-3xl p-8 flex flex-col items-center justify-between h-[550px] group transition-all hover:border-emerald-500/30 w-full">
        {/* Header */}
        <div className="text-center w-full">
          <p className="text-emerald-400 text-lg font-bold tracking-widest uppercase text-center">TESSERACT_SPINNER</p>
          <div className="mt-2 inline-block px-3 py-1 bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-500 rounded uppercase">
            HTML / CSS
          </div>
        </div>
        
        {/* Animation Container */}
        <div className="w-[300px] h-[300px] flex justify-center items-center relative overflow-hidden">
          {/* Fullscreen Button */}
          <button
            onClick={handleFullscreen}
            onMouseDown={() => playSound('click')}
            className="absolute top-0 right-0 w-8 h-8 bg-black/60 hover:bg-emerald-600 text-zinc-400 hover:text-black flex items-center justify-center transition-all z-20 border border-zinc-800 hover:border-emerald-500 opacity-0 group-hover:opacity-100"
            title="View Fullscreen"
          >
            <i className="fas fa-expand text-sm"></i>
          </button>

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity animate-pulse pointer-events-none" />
          
          {/* 3D Tesseract */}
          <div style={{ perspective: '1000px' }} className="relative z-10">
            <div style={{
              width: size,
              height: size,
              position: 'relative',
              transformStyle: 'preserve-3d',
              animation: 'rotate-cube 4s infinite linear',
            }}>
              {/* Outer Cube - 6 faces */}
              <div style={{ ...outerFaceStyle, transform: `rotateY(0deg) translateZ(${translate}px)` }} />
              <div style={{ ...outerFaceStyle, transform: `rotateY(180deg) translateZ(${translate}px)` }} />
              <div style={{ ...outerFaceStyle, transform: `rotateY(90deg) translateZ(${translate}px)` }} />
              <div style={{ ...outerFaceStyle, transform: `rotateY(-90deg) translateZ(${translate}px)` }} />
              <div style={{ ...outerFaceStyle, transform: `rotateX(90deg) translateZ(${translate}px)` }} />
              <div style={{ ...outerFaceStyle, transform: `rotateX(-90deg) translateZ(${translate}px)` }} />

              {/* Inner Cube (Tesseract Core) */}
              <div style={{
                width: innerSize,
                height: innerSize,
                position: 'absolute',
                top: (size - innerSize) / 2,
                left: (size - innerSize) / 2,
                transformStyle: 'preserve-3d',
                animation: 'rotate-cube-reverse 3s infinite linear',
              }}>
                <div style={{ ...innerFaceStyle, transform: `rotateY(0deg) translateZ(${innerTranslate}px)` }} />
                <div style={{ ...innerFaceStyle, transform: `rotateY(180deg) translateZ(${innerTranslate}px)` }} />
                <div style={{ ...innerFaceStyle, transform: `rotateY(90deg) translateZ(${innerTranslate}px)` }} />
                <div style={{ ...innerFaceStyle, transform: `rotateY(-90deg) translateZ(${innerTranslate}px)` }} />
                <div style={{ ...innerFaceStyle, transform: `rotateX(90deg) translateZ(${innerTranslate}px)` }} />
                <div style={{ ...innerFaceStyle, transform: `rotateX(-90deg) translateZ(${innerTranslate}px)` }} />
              </div>
            </div>
          </div>

          {/* Status Text */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
            <div className="text-emerald-400 font-mono text-xs animate-pulse tracking-[0.2em] uppercase font-bold">
              ESTABLISHING CONNECTION...
            </div>
            <div className="text-zinc-600 font-mono text-[10px] tracking-[0.1em]">
              ENCRYPTING DATA STREAM
            </div>
          </div>
        </div>

        {/* Footer with buttons and author */}
        <div className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              onMouseDown={() => playSound('click')}
              className={`w-full py-4 rounded-none font-bold text-2xl flex items-center justify-center gap-2 transition-all active:scale-95 z-30 relative shadow-[6px_6px_0px_rgba(0,0,0,0.5)] ${
                copied 
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-none translate-y-[2px]' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-emerald-950 hover:text-emerald-400 border border-zinc-700 hover:border-emerald-600'
              }`}
            >
              {copied ? (
                <>
                  <i className="fas fa-check text-xl"></i>
                  COPIED!
                </>
              ) : (
                <>
                  <i className="fas fa-copy text-xl"></i>
                  COPY
                </>
              )}
            </button>
            <button
              onClick={handleViewCode}
              onMouseDown={() => playSound('click')}
              className="w-full py-4 rounded-none font-bold text-2xl flex items-center justify-center gap-2 transition-all active:scale-95 z-30 relative shadow-[6px_6px_0px_rgba(0,0,0,0.5)] bg-zinc-800 text-zinc-400 hover:bg-emerald-950 hover:text-emerald-400 border border-zinc-700 hover:border-emerald-600"
            >
              <i className="fas fa-search text-xl"></i>
              VIEW
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-emerald-950/50 pt-4">
            <div className="flex items-center gap-3">
              <img src={author.avatar} alt={author.name} className="w-10 h-10 border border-emerald-900 bg-zinc-900 object-cover" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-xl font-bold uppercase">{author.name}</span>
                  {author.isMod && <span className="text-xs bg-emerald-600 text-black px-1.5 font-bold uppercase">MOD</span>}
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col">
              <span className="text-zinc-500 text-xs font-bold uppercase">LVL {author.level}</span>
              <span className="text-emerald-500 text-xl font-black uppercase tracking-tight">{author.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      <CodeEditorModal 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        files={[{ name: 'tesseract-spinner.html', content: tesseractCode }]} 
      />

      <FullscreenViewer
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        animation={tesseractAnimation}
      />
    </>
  );
};

export default FeaturedTesseractLoader;

