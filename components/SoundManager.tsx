
import React, { createContext, useContext, useCallback, useRef, useEffect } from 'react';
import { SOUND_URLS } from '../constants';
import { SoundType } from '../types';

interface SoundContextType {
  playSound: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Pool size for each sound type
const POOL_SIZE = 3;

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pre-loaded audio pools for each sound type
  const audioPools = useRef<Record<SoundType, HTMLAudioElement[]>>({
    hover: [],
    click: [],
    copy: [],
    generate: [],
  });
  
  // Track current index in each pool
  const poolIndices = useRef<Record<SoundType, number>>({
    hover: 0,
    click: 0,
    copy: 0,
    generate: 0,
  });
  
  // Throttle timestamps for hover sounds
  const lastHoverTime = useRef<number>(0);
  const HOVER_THROTTLE_MS = 100; // Only play hover sound every 100ms max

  // Pre-load audio on mount
  useEffect(() => {
    const types: SoundType[] = ['hover', 'click', 'copy', 'generate'];
    types.forEach(type => {
      for (let i = 0; i < POOL_SIZE; i++) {
        const audio = new Audio(SOUND_URLS[type]);
        audio.volume = type === 'copy' ? 0.3 : type === 'hover' ? 0.08 : 0.15;
        audio.preload = 'auto';
        audioPools.current[type].push(audio);
      }
    });
    
    // Cleanup on unmount
    return () => {
      types.forEach(type => {
        audioPools.current[type].forEach(audio => {
          audio.pause();
          audio.src = '';
        });
        audioPools.current[type] = [];
      });
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    // Throttle hover sounds
    if (type === 'hover') {
      const now = Date.now();
      if (now - lastHoverTime.current < HOVER_THROTTLE_MS) {
        return;
      }
      lastHoverTime.current = now;
    }
    
    try {
      const pool = audioPools.current[type];
      if (pool.length === 0) return;
      
      // Get next audio element from pool (round-robin)
      const index = poolIndices.current[type];
      const audio = pool[index];
      poolIndices.current[type] = (index + 1) % pool.length;
      
      // Reset and play
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Silently fail if browser blocks autoplay
      });
    } catch (e) {
      // Silently fail
    }
  }, []);

  return (
    <SoundContext.Provider value={{ playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within a SoundProvider');
  return context;
};
