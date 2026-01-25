import React, { useState, useRef, useCallback, useEffect, useId, memo } from 'react';
import { LoadingAnimation } from '../types';
import { useSound } from './SoundManager';
import CodeEditorModal from './CodeEditorModal';
import FullscreenViewer from './FullscreenViewer';

interface AnimationCardProps {
  animation: LoadingAnimation;
}

// Throttle helper
function throttle<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let lastCall = 0;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
}

const AnimationCard: React.FC<AnimationCardProps> = ({ animation }) => {
  const { playSound } = useSound();
  const [copied, setCopied] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const author = animation.author;
  
  // Generate unique ID for this card instance
  const uniqueId = useId().replace(/:/g, '-');

  // Execute inline scripts for canvas-based animations (Westworld category)
  // Ensures a constant, reliable loop by providing a scoped RAF and stop check
  useEffect(() => {
    if (animation.category === 'Westworld' && previewRef.current) {
      const canvas = previewRef.current.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return;
      
      const canvasId = `canvas-${uniqueId}`;
      canvas.id = canvasId;
      
      const scriptMatch = animation.html.match(/<script>([\s\S]*?)<\/script>/);
      if (!scriptMatch || !scriptMatch[1]) return;
      
      // Inject a local requestAnimationFrame that handles the stop flag and delta protection
      const scriptContent = `
        (function() {
          const canvasId = "${canvasId}";
          let lastTime = 0;
          
          // Local override for requestAnimationFrame
          const requestAnimationFrame = (callback) => {
            return window.requestAnimationFrame((ts) => {
              if (window['__stop_' + canvasId]) return;
              
              // Delta protection: if the tab was suspended, don't let ts - lastTime be huge
              if (lastTime > 0 && ts - lastTime > 200) {
                // Adjust ts to be just 16ms ahead of lastTime to keep it smooth
                callback(lastTime + 16);
                lastTime = lastTime + 16;
              } else {
                callback(ts);
                lastTime = ts;
              }
            });
          };
          
          // Execute the original script, replacing document.currentScript calls
          ${scriptMatch[1].replace(/document\.currentScript[\s\S]*?querySelector\(['"]canvas['"]\)/g, "document.getElementById(canvasId)")}
        })();
      `;
      
      try {
        window[`__stop_${canvasId}`] = false;
        const fn = new Function(scriptContent);
        fn();
      } catch (e) {
        console.error('Error executing Westworld animation:', e);
      }
      
      return () => {
        window[`__stop_${canvasId}`] = true;
      };
    }
  }, [animation.id, uniqueId]);

  // Use requestAnimationFrame for tilt to avoid lag and React re-renders
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!innerRef.current || !glareRef.current) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const rect = innerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    rafRef.current = requestAnimationFrame(() => {
      if (!innerRef.current || !glareRef.current) return;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Lessened tilt angle (from 15 to 8)
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      innerRef.current.style.setProperty('--rotateX', `${rotateX}deg`);
      innerRef.current.style.setProperty('--rotateY', `${rotateY}deg`);
      innerRef.current.style.setProperty('--scale', '1.02');
      
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glareRef.current.style.setProperty('--glareX', `${glareX}%`);
      glareRef.current.style.setProperty('--glareY', `${glareY}%`);
      glareRef.current.style.setProperty('--glareOpacity', '0.4');
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!innerRef.current || !glareRef.current) return;
    
    innerRef.current.style.setProperty('--rotateX', '0deg');
    innerRef.current.style.setProperty('--rotateY', '0deg');
    innerRef.current.style.setProperty('--scale', '1');
    glareRef.current.style.setProperty('--glareOpacity', '0');
  }, []);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playSound('copy');
    navigator.clipboard.writeText(animation.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playSound('click');
    setIsEditorOpen(true);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playSound('click');
    setIsFullscreenOpen(true);
  };

  return (
    <>
      <div 
        className="group h-full cursor-pointer relative"
        style={{ contain: 'layout style paint' }}
        onMouseEnter={() => playSound('hover')}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={cardRef}
      >
        <div 
          ref={innerRef}
          className="relative bg-[#0a0a0a] border border-zinc-900 overflow-hidden flex flex-col h-full hover:border-emerald-500/50 transition-[border-color,transform] duration-200 will-change-transform"
          style={{ 
            transform: 'perspective(1000px) rotateX(var(--rotateX, 0deg)) rotateY(var(--rotateY, 0deg)) scale3d(var(--scale, 1), var(--scale, 1), var(--scale, 1))' 
          }}
        >
          {/* Dynamic Glare Overlay */}
          <div 
            ref={glareRef}
            className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-200"
            style={{ 
              opacity: 'var(--glareOpacity, 0)',
              background: 'radial-gradient(circle at var(--glareX, 50%) var(--glareY, 50%), rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
              willChange: 'opacity, background' 
            }}
          />
          
          {/* Preview Area */}
          <div className="h-48 bg-black flex items-center justify-center relative overflow-hidden border-b border-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]"></div>
            
            <div 
                 ref={previewRef}
                 className="z-10 scale-125" 
                 dangerouslySetInnerHTML={{ 
                   __html: animation.category === 'Westworld' 
                     ? animation.html.replace(/<script>[\s\S]*?<\/script>/g, '') 
                     : animation.html 
                 }} 
          />
          
          {/* Label Tag */}
          <div className="absolute top-4 left-4 px-2 py-1 bg-emerald-950/40 text-xs font-black text-emerald-500 uppercase tracking-widest border border-emerald-900/50 z-10">
            {animation.category}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={handleFullscreen}
            onMouseDown={() => playSound('click')}
            className="absolute top-4 right-4 w-8 h-8 bg-black/60 hover:bg-emerald-600 text-zinc-400 hover:text-black flex items-center justify-center transition-all z-20 border border-zinc-800 hover:border-emerald-500 opacity-0 group-hover:opacity-100"
            title="View Fullscreen"
          >
            <i className="fas fa-expand text-sm"></i>
          </button>
        </div>

        {/* Info Area */}
        <div className="p-5 flex flex-col flex-grow relative bg-gradient-to-b from-zinc-950/50 to-black">
          <div className="mb-4">
            <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight mb-1">
              {animation.name}
            </h3>
            <p className="text-base text-zinc-500 leading-relaxed font-medium">
              {animation.description}
            </p>
          </div>
          
          <div className="mt-auto space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopy}
                onMouseDown={() => playSound('click')}
                className={`py-4 font-black text-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] z-30 relative uppercase tracking-tighter shadow-[4px_4px_0px_rgba(0,0,0,0.5)] ${
                  copied 
                    ? 'bg-emerald-500 text-black shadow-none translate-y-[2px]' 
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                }`}
              >
                {copied ? (
                  <>
                    <i className="fas fa-check"></i>
                    COPIED
                  </>
                ) : (
                  <>
                    <i className="fas fa-copy"></i>
                    COPY
                  </>
                )}
              </button>
              <button
                onClick={handleViewCode}
                onMouseDown={() => playSound('click')}
                className="py-4 font-black text-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] z-30 relative uppercase tracking-tighter shadow-[4px_4px_0px_rgba(0,0,0,0.5)] bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-emerald-400 border border-zinc-800"
              >
                <i className="fas fa-search"></i>
                VIEW
              </button>
            </div>

            {author && (
              <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-sm overflow-hidden border border-zinc-800 bg-zinc-900">
                    <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-zinc-500 text-lg font-bold uppercase hover:text-emerald-400 transition-colors">
                    {author.name}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-zinc-700 text-xs font-black">LVL {author.level}</span>
                   <span className="text-emerald-600 text-base font-black uppercase">{author.xp} XP</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    <CodeEditorModal 
      isOpen={isEditorOpen} 
      onClose={() => setIsEditorOpen(false)} 
      files={[{ name: `${animation.id}.html`, content: animation.html }]} 
    />

    <FullscreenViewer
      isOpen={isFullscreenOpen}
      onClose={() => setIsFullscreenOpen(false)}
      animation={animation}
    />
  </>
  );
};

export default memo(AnimationCard);