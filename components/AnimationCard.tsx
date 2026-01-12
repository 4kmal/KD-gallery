import React, { useState, useRef, useCallback, useEffect, useId, memo } from 'react';
import { LoadingAnimation } from '../types';
import { useSound } from './SoundManager';
import CodeEditorModal from './CodeEditorModal';

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
  const cardRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const author = animation.author;
  
  // Generate unique ID for this card instance
  const uniqueId = useId().replace(/:/g, '-');

  // Execute inline scripts for canvas-based animations (Westworld category)
  // with visibility-based pausing
  useEffect(() => {
    if (animation.category === 'Westworld' && previewRef.current) {
      const canvas = previewRef.current.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return;
      
      const canvasId = `canvas-${uniqueId}`;
      canvas.id = canvasId;
      
      const scriptMatch = animation.html.match(/<script>([\s\S]*?)<\/script>/);
      if (!scriptMatch || !scriptMatch[1]) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Parse and modify the script to be more robust
      let scriptContent = scriptMatch[1]
        // Replace any variant of finding the canvas with direct ID access
        .replace(/document\.currentScript[\s\S]*?querySelector\(['"]canvas['"]\)/g, `document.getElementById('${canvasId}')`)
        // Ensure requestAnimationFrame check visibility
        .replace(
          /requestAnimationFrame\(animate\)/g,
          `if(window['__anim_visible_${canvasId}']) { window['__anim_raf_${canvasId}'] = requestAnimationFrame(animate); }`
        );
      
      // Set up visibility and animation state tracking
      (window as any)[`__anim_visible_${canvasId}`] = true;
      (window as any)[`__anim_raf_${canvasId}`] = null;
      
      // Try to expose the animate function by injecting a wrapper
      // We wrap the script to capture the 'animate' function if it's defined
      const wrappedScript = `
        (function() {
          const originalRAF = window.requestAnimationFrame;
          let capturedAnimate = null;
          
          // Temporary override to capture the animate function
          window.requestAnimationFrame = function(cb) {
            if (!capturedAnimate) capturedAnimate = cb;
            return originalRAF(cb);
          };
          
          ${scriptContent}
          
          // Restore RAF and store the captured function
          window.requestAnimationFrame = originalRAF;
          if (capturedAnimate) {
            window['__anim_fn_${canvasId}'] = capturedAnimate;
          }
        })();
      `;
      
      try {
        const fn = new Function(wrappedScript);
        fn();
      } catch (e) {
        console.error('Error executing animation script:', e);
      }
      
      // Set up IntersectionObserver to pause off-screen animations
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const isVisible = entry.isIntersecting;
            (window as any)[`__anim_visible_${canvasId}`] = isVisible;
            
            if (isVisible) {
              // Restart animation if it was paused
              const rafId = (window as any)[`__anim_raf_${canvasId}`];
              const animateFn = (window as any)[`__anim_fn_${canvasId}`];
              if (!rafId && animateFn) {
                requestAnimationFrame(animateFn);
              }
            } else {
              // Mark as not running so it can be restarted
              (window as any)[`__anim_raf_${canvasId}`] = null;
            }
          });
        },
        { threshold: 0, rootMargin: '100px' }
      );
      
      observer.observe(canvas);
      
      return () => {
        observer.disconnect();
        (window as any)[`__anim_visible_${canvasId}`] = false;
        const rafId = (window as any)[`__anim_raf_${canvasId}`];
        if (rafId) cancelAnimationFrame(rafId);
        delete (window as any)[`__anim_visible_${canvasId}`];
        delete (window as any)[`__anim_raf_${canvasId}`];
        delete (window as any)[`__anim_fn_${canvasId}`];
      };
    }
  }, [animation, uniqueId]);

  // Throttled mouse move handler - only update every 32ms (~30fps)
  const handleMouseMove = useCallback(
    throttle((e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      });

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.4,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)`,
      });
    }, 32),
    []
  );

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s ease-out',
    });
    setGlareStyle({ opacity: 0, transition: 'opacity 0.4s ease' });
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
          className="relative bg-[#0a0a0a] border border-zinc-900 overflow-hidden flex flex-col h-full hover:border-emerald-500/50 transition-colors duration-300 will-change-transform"
          style={style}
        >
          {/* Dynamic Glare Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{ ...glareStyle, willChange: 'opacity, background' }}
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
  </>
  );
};

export default memo(AnimationCard);