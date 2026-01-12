import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import AnimationCard from './components/AnimationCard';
import FeaturedCube from './components/FeaturedCube';
import LegacyFeaturedLoaders from './components/LegacyFeaturedLoaders';
import { INITIAL_ANIMATIONS } from './constants';
import { SoundProvider, useSound } from './components/SoundManager';
import { LoadingAnimation } from './types';

// Category display order and styling
const CATEGORY_CONFIG: Record<string, { icon: string; color: string }> = {
  'Spinnners': { icon: 'fa-circle-notch', color: 'text-emerald-400' },
  'Dots': { icon: 'fa-ellipsis', color: 'text-cyan-400' },
  'Bars': { icon: 'fa-bars-progress', color: 'text-amber-400' },
  'Shape Shift': { icon: 'fa-shapes', color: 'text-purple-400' },
  'AI Generated': { icon: 'fa-robot', color: 'text-pink-400' },
  'Westworld': { icon: 'fa-atom', color: 'text-sky-400' },
};

interface CategorySectionProps {
  category: string;
  animations: LoadingAnimation[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, animations }) => {
  const config = CATEGORY_CONFIG[category] || { icon: 'fa-folder', color: 'text-zinc-400' };
  
  return (
    <div className="mb-16">
      {/* Category Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center gap-3 px-4 py-2 bg-zinc-950 border-2 border-zinc-800 ${config.color}`}>
          <i className={`fas ${config.icon} text-lg`}></i>
          <span className="text-xl font-black uppercase tracking-[0.15em]">{category}</span>
          <span className="text-zinc-600 text-sm font-mono">({animations.length})</span>
        </div>
        <div className="h-[2px] bg-gradient-to-r from-zinc-800 to-transparent flex-grow"></div>
      </div>
      
      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {animations.map((anim) => (
          <AnimationCard key={anim.id} animation={anim} />
        ))}
      </div>
    </div>
  );
};

const Main: React.FC = () => {
  const [animations] = useState<LoadingAnimation[]>(INITIAL_ANIMATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const { playSound } = useSound();

  const filteredAnimations = animations.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group animations by category when ALL is selected
  const isAllSelected = searchTerm === '';
  const groupedAnimations = useMemo(() => {
    if (!isAllSelected) return null;
    
    const groups: Record<string, LoadingAnimation[]> = {};
    const categoryOrder = ['Spinnners', 'Dots', 'Bars', 'Shape Shift', 'AI Generated', 'Westworld'];
    
    // Initialize groups in order
    categoryOrder.forEach(cat => {
      groups[cat] = [];
    });
    
    // Populate groups
    filteredAnimations.forEach(anim => {
      if (groups[anim.category]) {
        groups[anim.category].push(anim);
      } else {
        groups[anim.category] = [anim];
      }
    });
    
    // Filter out empty categories
    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }, [filteredAnimations, isAllSelected]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black">
      <Header />

      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full -z-10"></div>
          
          <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none uppercase logo-glitch">
            <span className="text-emerald-500">KRACKED</span> GALLERY
          </h2>
          <p className="text-zinc-400 text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed uppercase tracking-wider">
            Code Snippets <br className="hidden md:block"/>
            For Kracked Devs
          </p>
        </section>

        {/* Featured Selections */}
        <section className="mb-32">
           <div className="flex items-center gap-6 mb-12">
              <h2 className="text-zinc-300 text-xl font-black tracking-[0.2em] uppercase whitespace-nowrap">
                [ FEATURED_SELECTIONS ]
              </h2>
              <div className="h-[2px] bg-zinc-900 flex-grow"></div>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              <FeaturedCube />
              <LegacyFeaturedLoaders />
           </div>
        </section>

        {/* Filter & Search Bar */}
        <section id="gallery" className="mb-16">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between bg-zinc-950 border-2 border-zinc-900 p-8">
            <div className="relative w-full lg:w-1/3">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 flex justify-center text-zinc-700">
                <i className="fas fa-search text-lg"></i>
              </div>
              <input 
                type="text" 
                placeholder="SEARCH_ASSETS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => playSound('hover')}
                className="w-full bg-transparent border-b-2 border-zinc-800 py-2 pl-10 text-xl focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-800 text-emerald-400 uppercase tracking-tighter"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto pb-4 lg:pb-0 no-scrollbar">
              {['All', 'Spinnners', 'Dots', 'Bars', 'Shape Shift', 'Westworld'].map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    playSound('click');
                    setSearchTerm(cat === 'All' ? '' : cat);
                  }}
                  onMouseEnter={() => playSound('hover')}
                  className={`whitespace-nowrap px-6 py-2 text-lg font-black uppercase tracking-tighter transition-all shadow-[2px_2px_0px_#000] active:translate-y-[2px] active:shadow-none ${
                    (cat === 'All' && searchTerm === '') || searchTerm === cat
                      ? 'bg-emerald-600 text-black translate-y-[2px] shadow-none'
                      : 'bg-zinc-900 text-zinc-500 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section>
          {filteredAnimations.length === 0 ? (
            <div className="py-32 text-center border-4 border-dashed border-zinc-900">
              <h3 className="text-2xl font-black text-zinc-700 uppercase tracking-widest mb-4">404: ASSET_MISSING</h3>
              <p className="text-lg text-zinc-800 uppercase">THE ARCHIVE CONTAINS NO MATCHING DATA.</p>
            </div>
          ) : isAllSelected && groupedAnimations ? (
            // Categorized view with dividers when ALL is selected
            <div>
              {groupedAnimations.map(([category, categoryAnimations]) => (
                <CategorySection 
                  key={category} 
                  category={category} 
                  animations={categoryAnimations} 
                />
              ))}
            </div>
          ) : (
            // Flat grid when filtering by category or search term
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredAnimations.map((anim) => (
                <AnimationCard key={anim.id} animation={anim} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="mt-32 border-t-4 border-zinc-900 bg-[#020202] py-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="flex items-center text-3xl font-black tracking-tighter select-none mb-4">
              <span className="text-emerald-500">&lt;Kracked</span>
              <span className="text-emerald-50 ml-1">Devs</span>
              <span className="text-emerald-500 ml-1">/&gt;</span>
              <span className="ml-2 px-1 py-0.5 bg-[#f59e0b] text-black text-sm font-bold rounded flex items-center justify-center leading-none">
                BETA
              </span>
            </div>
            <p className="text-zinc-600 text-lg uppercase tracking-widest max-w-xs leading-none">
              LEVELING UP WEB UI ONE PIXEL AT A TIME.
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-zinc-700 text-sm font-black uppercase tracking-[0.3em] mb-4">
              SYS.VER // 24.1.0_PROD
            </p>
            <p className="text-zinc-800 text-sm font-bold uppercase">
              &copy; 2024 Kracked Devs. NO RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SoundProvider>
      <Main />
    </SoundProvider>
  );
};

export default App;