import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import { LoadingAnimation, FilterSettings, ColorOverlay, AnimationSpeed } from '../types';
import { useSound } from './SoundManager';

interface FullscreenViewerProps {
  isOpen: boolean;
  onClose: () => void;
  animation: LoadingAnimation;
}

const DEFAULT_FILTERS: FilterSettings = {
  blur: 0,
  grayscale: 0,
  sepia: 0,
  invert: false,
  contrast: 100,
  brightness: 100,
  saturate: 100,
  hueRotate: 0,
  crtEffect: false,
  showStatusText: false,
  colorOverlay: 'none',
  speed: 1,
  isPaused: false,
};

const COLOR_OVERLAYS: { id: ColorOverlay; label: string; gradient: string }[] = [
  { id: 'none', label: 'None', gradient: 'transparent' },
  { id: 'neon', label: 'Neon', gradient: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)' },
  { id: 'matrix', label: 'Matrix', gradient: 'linear-gradient(180deg, rgba(0,255,0,0.15) 0%, rgba(0,100,0,0.3) 100%)' },
  { id: 'cyberpunk', label: 'Cyber', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(236,72,153,0.3) 100%)' },
  { id: 'amber', label: 'Amber', gradient: 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(180,83,9,0.2) 100%)' },
  { id: 'ice', label: 'Ice', gradient: 'radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(14,165,233,0.2) 100%)' },
];

const SPEED_OPTIONS: AnimationSpeed[] = [0.25, 0.5, 1, 2, 4];

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ isOpen, onClose, animation }) => {
  const { playSound } = useSound();
  const [filters, setFilters] = useState<FilterSettings>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, '-');

  // Reset filters when opening
  useEffect(() => {
    if (isOpen) {
      setFilters(DEFAULT_FILTERS);
    }
  }, [isOpen]);

  // Initialize canvas animations for Westworld category
  useEffect(() => {
    if (!isOpen || animation.category !== 'Westworld' || !previewRef.current) return;

    const canvas = previewRef.current.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const canvasId = `fullscreen-canvas-${uniqueId}`;
    canvas.id = canvasId;
    
    // Scale up canvas for fullscreen
    canvas.width = 240;
    canvas.height = 240;

    const scriptMatch = animation.html.match(/<script>([\s\S]*?)<\/script>/);
    if (!scriptMatch || !scriptMatch[1]) return;

    // Inject animation with speed control
    const scriptContent = `
      (function() {
        const canvasId = "${canvasId}";
        let lastTime = 0;
        
        const requestAnimationFrame = (callback) => {
          return window.requestAnimationFrame((ts) => {
            if (window['__stop_' + canvasId]) return;
            if (window['__paused_' + canvasId]) {
              window.requestAnimationFrame(() => requestAnimationFrame(callback));
              return;
            }
            
            const speed = window['__speed_' + canvasId] || 1;
            
            if (lastTime > 0 && ts - lastTime > 200) {
              callback(lastTime + 16 * speed);
              lastTime = lastTime + 16 * speed;
            } else {
              const adjustedTs = lastTime + (ts - (lastTime || ts)) * speed;
              callback(adjustedTs);
              lastTime = adjustedTs;
            }
          });
        };
        
        ${scriptMatch[1]
          .replace(/document\.currentScript[\s\S]*?querySelector\(['"]canvas['"]\)/g, "document.getElementById(canvasId)")
          .replace(/const W=120,H=120/g, "const W=240,H=240")
          .replace(/width: 120/g, "width: 240")
          .replace(/height: 120/g, "height: 240")}
      })();
    `;

    try {
      (window as any)[`__stop_${canvasId}`] = false;
      (window as any)[`__paused_${canvasId}`] = filters.isPaused;
      (window as any)[`__speed_${canvasId}`] = filters.speed;
      const fn = new Function(scriptContent);
      fn();
    } catch (e) {
      console.error('Error executing Westworld animation:', e);
    }

    return () => {
      (window as any)[`__stop_${canvasId}`] = true;
    };
  }, [isOpen, animation.id, uniqueId]);

  // Generic script execution for non-Westworld animations
  useEffect(() => {
    if (!isOpen || animation.category === 'Westworld' || !previewRef.current) return;

    const scriptMatch = animation.html.match(/<script>([\s\S]*?)<\/script>/);
    if (!scriptMatch || !scriptMatch[1]) return;

    const uniqueNamespace = `__anim_${uniqueId}`;
    const scriptCode = scriptMatch[1];

    // Helper to allow scripts to register intervals that get cleaned up
    const wrappedScript = `
      const root = document.getElementById('${uniqueId}');
      const registerInterval = (fn, delay) => {
        const id = window.setInterval(fn, delay);
        window['${uniqueNamespace}_intervals'] = window['${uniqueNamespace}_intervals'] || [];
        window['${uniqueNamespace}_intervals'].push(id);
        return id;
      };
      
      try {
        ${scriptCode}
      } catch (e) {
        console.error('Error in animation script:', e);
      }
    `;

    try {
      new Function(wrappedScript)();
    } catch (e) {
      console.error('Failed to execute animation script:', e);
    }

    return () => {
      const intervals = (window as any)[`${uniqueNamespace}_intervals`];
      if (intervals && Array.isArray(intervals)) {
        intervals.forEach(window.clearInterval);
      }
      delete (window as any)[`${uniqueNamespace}_intervals`];
    };
  }, [isOpen, animation, uniqueId]);

  // Update canvas animation controls
  useEffect(() => {
    if (animation.category === 'Westworld') {
      const canvasId = `fullscreen-canvas-${uniqueId}`;
      (window as any)[`__paused_${canvasId}`] = filters.isPaused;
      (window as any)[`__speed_${canvasId}`] = filters.speed;
    }
  }, [filters.isPaused, filters.speed, animation.category, uniqueId]);

  // Build CSS filter string
  const getFilterString = useCallback(() => {
    const parts: string[] = [];
    if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
    if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`);
    if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`);
    if (filters.invert) parts.push('invert(1)');
    if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
    if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
    if (filters.saturate !== 100) parts.push(`saturate(${filters.saturate}%)`);
    if (filters.hueRotate > 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);
    return parts.length > 0 ? parts.join(' ') : 'none';
  }, [filters]);

  // Get animation speed style
  const getSpeedStyle = useCallback(() => {
    if (filters.isPaused) {
      return { animationPlayState: 'paused' as const };
    }
    return { animationDuration: `calc(var(--animation-duration, 1s) / ${filters.speed})` };
  }, [filters.speed, filters.isPaused]);

  // Get color overlay gradient
  const getOverlayGradient = useCallback(() => {
    const overlay = COLOR_OVERLAYS.find(o => o.id === filters.colorOverlay);
    return overlay?.gradient || 'transparent';
  }, [filters.colorOverlay]);

  const updateFilter = <K extends keyof FilterSettings>(key: K, value: FilterSettings[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    playSound('click');
    setFilters(DEFAULT_FILTERS);
  };

  const handleClose = () => {
    playSound('click');
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  // Prepare HTML with speed modifications for CSS animations
  const getModifiedHtml = () => {
    if (animation.category === 'Westworld') {
      return animation.html.replace(/<script>[\s\S]*?<\/script>/g, '')
        .replace(/width="120"/g, 'width="240"')
        .replace(/height="120"/g, 'height="240"');
    }
    
    // For CSS animations, wrap with speed control
    let html = animation.html;
    
    // High-res overrides for Neural Cube
    if (animation.name === 'NEURAL_CUBE') {
      html = `
        <style>
          :root {
            --nc-size: 450px !important;
            --nc-split: 225px !important;
            --nc-font-base: 25px !important;
            --nc-font-label: 17.5px !important;
            --nc-font-content: 20px !important;
          }
        </style>
        ${html}
      `;
    }

    if (!filters.isPaused && filters.speed !== 1) {
      // Add inline style to modify animation speed
      html = `<div style="--speed-multiplier: ${1/filters.speed};">${html}</div>`;
    }
    return html;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      onClick={handleClose}
    >
      {/* Mac Window Container */}
      <div 
        className="w-full max-w-6xl h-[95vh] max-h-[900px] bg-[#1c1c1e] rounded-xl overflow-hidden shadow-2xl flex flex-col"
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.1)' 
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="h-12 bg-[#2c2c2e] flex items-center px-4 gap-2 border-b border-[#3c3c3e] flex-shrink-0">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleClose}
              className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] transition-colors group relative"
            >
              <span className="absolute inset-0 flex items-center justify-center text-[8px] text-black/60 opacity-0 group-hover:opacity-100">✕</span>
            </button>
            <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
          </div>
          
          {/* Title */}
          <div className="flex-1 text-center">
            <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
              {animation.name} — Fullscreen Viewer
            </span>
          </div>
          
          {/* Toggle Filters Button */}
          <button
            onClick={() => {
              playSound('click');
              setShowFilters(!showFilters);
            }}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded transition-all ${
              showFilters 
                ? 'bg-emerald-600 text-black' 
                : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
            }`}
          >
            <i className={`fas fa-sliders-h mr-2`}></i>
            Filters
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Animation Preview Area */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-black">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]"></div>
            
            {/* Animation Container */}
            <div 
              className="relative z-10"
              style={{ 
                filter: getFilterString(),
              }}
            >
              <div 
                className={animation.name === 'NEURAL_CUBE' ? '' : 'transform scale-[2] md:scale-[2.5]'}
                style={{ 
                  ...(animation.category !== 'Westworld' ? getSpeedStyle() : {})
                }}
              >
                <div 
                  ref={previewRef}
                  id={uniqueId}
                  className={filters.isPaused && animation.category !== 'Westworld' ? '[&_*]:!animation-play-state-paused' : ''}
                  style={animation.category !== 'Westworld' && filters.speed !== 1 ? {
                    ['--animation-speed' as any]: filters.speed,
                  } : {}}
                  dangerouslySetInnerHTML={{ __html: getModifiedHtml() }}
                />
              </div>
            </div>

            {/* Color Overlay */}
            {filters.colorOverlay !== 'none' && (
              <div 
                className="absolute inset-0 pointer-events-none z-20"
                style={{ 
                  background: getOverlayGradient(),
                  mixBlendMode: 'screen'
                }}
              />
            )}

            {/* CRT Scanline Effect */}
            {filters.crtEffect && (
              <div 
                className="absolute inset-0 pointer-events-none z-30"
                style={{
                  background: `
                    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                    linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))
                  `,
                  backgroundSize: '100% 2px, 3px 100%',
                  opacity: 0.6
                }}
              />
            )}

            {/* Status Text */}
            {filters.showStatusText && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-30">
                <div className="text-emerald-400 font-mono text-sm animate-pulse tracking-[0.2em] uppercase font-bold">
                  ESTABLISHING CONNECTION...
                </div>
                <div className="text-zinc-600 font-mono text-xs tracking-[0.1em]">
                  ENCRYPTING DATA STREAM
                </div>
              </div>
            )}

            {/* Paused Indicator */}
            {filters.isPaused && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 border border-zinc-700 rounded text-zinc-400 text-sm font-bold uppercase tracking-wider z-40">
                <i className="fas fa-pause mr-2"></i>
                Paused
              </div>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="w-80 bg-[#1c1c1e] border-l border-[#3c3c3e] overflow-y-auto flex-shrink-0">
              <div className="p-4 space-y-6">
                {/* Visual Filters Section */}
                <div>
                  <h3 className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <i className="fas fa-magic"></i>
                    Visual Filters
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Blur */}
                    <FilterSlider
                      label="Blur"
                      value={filters.blur}
                      min={0}
                      max={10}
                      unit="px"
                      onChange={(v) => updateFilter('blur', v)}
                    />
                    
                    {/* Brightness */}
                    <FilterSlider
                      label="Brightness"
                      value={filters.brightness}
                      min={50}
                      max={200}
                      unit="%"
                      defaultValue={100}
                      onChange={(v) => updateFilter('brightness', v)}
                    />
                    
                    {/* Contrast */}
                    <FilterSlider
                      label="Contrast"
                      value={filters.contrast}
                      min={50}
                      max={200}
                      unit="%"
                      defaultValue={100}
                      onChange={(v) => updateFilter('contrast', v)}
                    />
                    
                    {/* Saturate */}
                    <FilterSlider
                      label="Saturate"
                      value={filters.saturate}
                      min={0}
                      max={200}
                      unit="%"
                      defaultValue={100}
                      onChange={(v) => updateFilter('saturate', v)}
                    />
                    
                    {/* Grayscale */}
                    <FilterSlider
                      label="Grayscale"
                      value={filters.grayscale}
                      min={0}
                      max={100}
                      unit="%"
                      onChange={(v) => updateFilter('grayscale', v)}
                    />
                    
                    {/* Sepia */}
                    <FilterSlider
                      label="Sepia"
                      value={filters.sepia}
                      min={0}
                      max={100}
                      unit="%"
                      onChange={(v) => updateFilter('sepia', v)}
                    />
                    
                    {/* Hue Rotate */}
                    <FilterSlider
                      label="Hue Rotate"
                      value={filters.hueRotate}
                      min={0}
                      max={360}
                      unit="°"
                      onChange={(v) => updateFilter('hueRotate', v)}
                    />
                    
                    {/* Invert Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-sm font-medium">Invert</span>
                      <button
                        onClick={() => {
                          playSound('click');
                          updateFilter('invert', !filters.invert);
                        }}
                        className={`w-12 h-6 rounded-full transition-all relative ${
                          filters.invert ? 'bg-emerald-600' : 'bg-zinc-700'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                          filters.invert ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    {/* CRT Effect Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-sm font-medium">CRT Scanlines</span>
                      <button
                        onClick={() => {
                          playSound('click');
                          updateFilter('crtEffect', !filters.crtEffect);
                        }}
                        className={`w-12 h-6 rounded-full transition-all relative ${
                          filters.crtEffect ? 'bg-emerald-600' : 'bg-zinc-700'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                          filters.crtEffect ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    {/* Status Text Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-sm font-medium">Status Text</span>
                      <button
                        onClick={() => {
                          playSound('click');
                          updateFilter('showStatusText', !filters.showStatusText);
                        }}
                        className={`w-12 h-6 rounded-full transition-all relative ${
                          filters.showStatusText ? 'bg-emerald-600' : 'bg-zinc-700'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                          filters.showStatusText ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Color Overlays Section */}
                <div>
                  <h3 className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <i className="fas fa-palette"></i>
                    Color Overlays
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {COLOR_OVERLAYS.map(overlay => (
                      <button
                        key={overlay.id}
                        onClick={() => {
                          playSound('click');
                          updateFilter('colorOverlay', overlay.id);
                        }}
                        className={`p-2 rounded text-xs font-bold uppercase transition-all ${
                          filters.colorOverlay === overlay.id
                            ? 'bg-emerald-600 text-black'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                      >
                        {overlay.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animation Controls Section */}
                <div>
                  <h3 className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <i className="fas fa-tachometer-alt"></i>
                    Animation Speed
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {SPEED_OPTIONS.map(speed => (
                      <button
                        key={speed}
                        onClick={() => {
                          playSound('click');
                          updateFilter('speed', speed);
                        }}
                        className={`flex-1 py-2 rounded text-xs font-bold transition-all ${
                          filters.speed === speed
                            ? 'bg-emerald-600 text-black'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                  
                  {/* Play/Pause Button */}
                  <button
                    onClick={() => {
                      playSound('click');
                      updateFilter('isPaused', !filters.isPaused);
                    }}
                    className={`w-full py-3 rounded font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      filters.isPaused
                        ? 'bg-emerald-600 text-black hover:bg-emerald-500'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    <i className={`fas ${filters.isPaused ? 'fa-play' : 'fa-pause'}`}></i>
                    {filters.isPaused ? 'Resume' : 'Pause'}
                  </button>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetFilters}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-zinc-700"
                >
                  <i className="fas fa-undo"></i>
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Filter Slider Component
interface FilterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  defaultValue?: number;
  onChange: (value: number) => void;
}

const FilterSlider: React.FC<FilterSliderProps> = ({ 
  label, 
  value, 
  min, 
  max, 
  unit, 
  defaultValue = min,
  onChange 
}) => {
  const { playSound } = useSound();
  const isDefault = value === defaultValue;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400 text-sm font-medium">{label}</span>
        <span className={`text-xs font-mono ${isDefault ? 'text-zinc-600' : 'text-emerald-400'}`}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onMouseDown={() => playSound('click')}
        className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-emerald-500
          [&::-webkit-slider-thumb]:hover:bg-emerald-400
          [&::-webkit-slider-thumb]:transition-colors
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-emerald-500
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:hover:bg-emerald-400"
        style={{
          background: `linear-gradient(to right, #10b981 0%, #10b981 ${((value - min) / (max - min)) * 100}%, #27272a ${((value - min) / (max - min)) * 100}%, #27272a 100%)`
        }}
      />
    </div>
  );
};

export default React.memo(FullscreenViewer);

