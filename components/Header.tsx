import React from 'react';
import { useSound } from './SoundManager';
import { PageType } from '../types';

interface HeaderProps {
  currentPage?: PageType;
  onNavigate?: (page: PageType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage = 'gallery', onNavigate }) => {
  const { playSound } = useSound();

  const handleScrollToGallery = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound('click');
    const gallery = document.getElementById('gallery');
    if (gallery) {
      gallery.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-zinc-900 bg-black/95 backdrop-blur-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            playSound('click');
            if (onNavigate) {
              onNavigate('gallery');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onMouseEnter={() => playSound('hover')}
        >
          <div className="flex items-center text-3xl font-black tracking-tighter select-none logo-glitch">
            <span className="text-emerald-500">&lt;Kracked</span>
            <span className="text-emerald-50 ml-1">Devs</span>
            <span className="text-emerald-500 ml-1">/&gt;</span>
            <span className="ml-2 px-1 py-0.5 bg-[#f59e0b] text-black text-sm font-bold rounded flex items-center justify-center leading-none">
              BETA
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-4">
          <button 
            onClick={handleScrollToGallery}
            onMouseEnter={() => playSound('hover')}
            className={`px-6 py-1.5 text-xl transition-colors uppercase tracking-tight shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none ${
              currentPage === 'gallery' 
                ? 'bg-emerald-500 text-black' 
                : 'bg-white text-black hover:bg-emerald-500 hover:text-white'
            }`}
          >
            Explore Assets
          </button>
          <button 
            onClick={() => {
              playSound('click');
              if (onNavigate) {
                onNavigate('bounties');
              }
            }}
            onMouseEnter={() => playSound('hover')}
            className={`px-6 py-1.5 text-xl transition-colors uppercase tracking-tight shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none ${
              currentPage === 'bounties' 
                ? 'bg-amber-500 text-black' 
                : 'bg-zinc-900 text-amber-500 border border-amber-500/50 hover:bg-amber-500 hover:text-black'
            }`}
          >
            <i className="fas fa-trophy mr-2"></i>
            Bounties
          </button>
          <button 
            onMouseEnter={() => playSound('hover')}
            onClick={() => playSound('click')}
            className="px-6 py-1.5 border border-zinc-800 text-zinc-400 text-xl hover:border-emerald-500 hover:text-emerald-500 transition-all uppercase tracking-tight shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none"
          >
            Documentation
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <a 
            href="https://discord.gg/krackeddevs"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playSound('hover')}
            onClick={() => playSound('click')}
            className="w-12 h-12 flex items-center justify-center bg-[#5865F2] text-white hover:bg-emerald-500 transition-all rounded-sm text-2xl shadow-[3px_3px_0px_#000] active:translate-y-[1px] active:shadow-none"
            title="Join Discord"
          >
            <i className="fab fa-discord"></i>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;