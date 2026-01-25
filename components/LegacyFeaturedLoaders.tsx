import React, { useState } from 'react';
import { useSound } from './SoundManager';
import { MOCK_USERS } from '../constants';
import { User, LoadingAnimation } from '../types';
import CodeEditorModal from './CodeEditorModal';
import FullscreenViewer from './FullscreenViewer';

interface LoaderCardProps {
  title: string;
  code: string;
  fullscreenHtml: string;
  techStack: string;
  author: User;
  children: React.ReactNode;
}

const LoaderCard: React.FC<LoaderCardProps> = ({ title, code, fullscreenHtml, techStack, author, children }) => {
  const { playSound } = useSound();
  const [copied, setCopied] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const handleCopy = () => {
    playSound('copy');
    navigator.clipboard.writeText(code);
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
  const loaderAnimation: LoadingAnimation = {
    id: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: title,
    description: `${title} loading animation`,
    category: 'Shape Shift',
    html: fullscreenHtml,
    tailwindClasses: '',
    author: author,
  };

  return (
    <>
      <div className="bg-zinc-950/50 border border-emerald-900/50 rounded-3xl p-8 flex flex-col items-center justify-between h-[550px] group transition-all hover:border-emerald-500/30 w-full">
        <div className="text-center w-full">
          <p className="text-emerald-400 text-lg font-bold tracking-widest uppercase text-center">{title}</p>
          <div className="mt-2 inline-block px-3 py-1 bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-500 rounded uppercase">
            {techStack}
          </div>
        </div>
        
        <div className="w-[300px] h-[300px] flex justify-center items-center relative overflow-hidden scale-110">
          {/* Fullscreen Button */}
          <button
            onClick={handleFullscreen}
            onMouseDown={() => playSound('click')}
            className="absolute top-0 right-0 w-8 h-8 bg-black/60 hover:bg-emerald-600 text-zinc-400 hover:text-black flex items-center justify-center transition-all z-20 border border-zinc-800 hover:border-emerald-500 opacity-0 group-hover:opacity-100"
            title="View Fullscreen"
          >
            <i className="fas fa-expand text-sm"></i>
          </button>
          {children}
        </div>

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
        files={[{ name: `${title.toLowerCase()}.html`, content: code }]} 
      />

      <FullscreenViewer
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        animation={loaderAnimation}
      />
    </>
  );
};

const LegacyFeaturedLoaders: React.FC = () => {
  const solarCode = `<!-- SOLAR SYSTEM -->
<div class="spinner-box">
  <div class="solar-system">
    <div class="earth-orbit orbit">
      <div class="planet earth"></div>
      <div class="venus-orbit orbit">
        <div class="planet venus"></div>
        <div class="mercury-orbit orbit">
          <div class="planet mercury"></div>
          <div class="sun"></div>
        </div>
      </div>
    </div>
  </div>
</div>`;

  const squaresCode = `<!-- SPINNING SQUARES -->
<div class="spinner-box">
  <div class="configure-border-1">  
    <div class="configure-core"></div>
  </div>  
  <div class="configure-border-2">
    <div class="configure-core"></div>
  </div> 
</div>`;

  const styles = `
    @keyframes spin { from { transform: rotate(0); } to { transform: rotate(359deg); } }
    @keyframes configure-clockwise { 
      0% { transform: rotate(0); } 25% { transform: rotate(90deg); } 50% { transform: rotate(180deg); } 75% { transform: rotate(270deg); } 100% { transform: rotate(360deg); } 
    }
    @keyframes configure-xclockwise { 
      0% { transform: rotate(45deg); } 25% { transform: rotate(-45deg); } 50% { transform: rotate(-135deg); } 75% { transform: rotate(-225deg); } 100% { transform: rotate(-315deg); } 
    }
    .solar-system { width: 250px; height: 250px; display: flex; justify-content: center; align-items: center; }
    .orbit { position: relative; display: flex; justify-content: center; align-items: center; border: 1px solid #10b98155; border-radius: 50%; } 
    .earth-orbit { width: 165px; height: 165px; animation: spin 12s linear 0s infinite; }
    .venus-orbit { width: 120px; height: 120px; animation: spin 7.4s linear 0s infinite; }
    .mercury-orbit { width: 90px; height: 90px; animation: spin 3s linear 0s infinite; }
    .planet { position: absolute; top: -5px; width: 10px; height: 10px; border-radius: 50%; background-color: #3ff9dc; }
    .sun { width: 35px; height: 35px; border-radius: 50%; background-color: #ffab91; }
    .configure-border-1 { width: 115px; height: 115px; padding: 3px; position: absolute; display: flex; justify-content: center; align-items: center; background: #fb5b53; animation: configure-clockwise 3s ease-in-out 0s infinite alternate; }
    .configure-border-2 { width: 115px; height: 115px; padding: 3px; left: -115px; display: flex; justify-content: center; align-items: center; background: #3ff9dc; transform: rotate(45deg); animation: configure-xclockwise 3s ease-in-out 0s infinite alternate; }
    .configure-core { width: 100%; height: 100%; background-color: #050505; }
  `;

  // Fullscreen HTML with embedded styles
  const solarFullscreenHtml = `<style>
    @keyframes spin { from { transform: rotate(0); } to { transform: rotate(359deg); } }
    .solar-system { width: 250px; height: 250px; display: flex; justify-content: center; align-items: center; }
    .orbit { position: relative; display: flex; justify-content: center; align-items: center; border: 1px solid #10b98155; border-radius: 50%; } 
    .earth-orbit { width: 165px; height: 165px; animation: spin 12s linear 0s infinite; }
    .venus-orbit { width: 120px; height: 120px; animation: spin 7.4s linear 0s infinite; }
    .mercury-orbit { width: 90px; height: 90px; animation: spin 3s linear 0s infinite; }
    .planet { position: absolute; top: -5px; width: 10px; height: 10px; border-radius: 50%; background-color: #3ff9dc; }
    .sun { width: 35px; height: 35px; border-radius: 50%; background-color: #ffab91; }
  </style>
  <div class="solar-system">
    <div class="earth-orbit orbit">
      <div class="planet earth"></div>
      <div class="venus-orbit orbit">
        <div class="planet venus"></div>
        <div class="mercury-orbit orbit">
          <div class="planet mercury"></div>
          <div class="sun"></div>
        </div>
      </div>
    </div>
  </div>`;

  const squaresFullscreenHtml = `<style>
    @keyframes configure-clockwise { 
      0% { transform: rotate(0); } 25% { transform: rotate(90deg); } 50% { transform: rotate(180deg); } 75% { transform: rotate(270deg); } 100% { transform: rotate(360deg); } 
    }
    @keyframes configure-xclockwise { 
      0% { transform: rotate(45deg); } 25% { transform: rotate(-45deg); } 50% { transform: rotate(-135deg); } 75% { transform: rotate(-225deg); } 100% { transform: rotate(-315deg); } 
    }
    .spinner-box { position: relative; width: 230px; height: 115px; display: flex; justify-content: center; align-items: center; }
    .configure-border-1 { width: 115px; height: 115px; padding: 3px; position: absolute; display: flex; justify-content: center; align-items: center; background: #fb5b53; animation: configure-clockwise 3s ease-in-out 0s infinite alternate; }
    .configure-border-2 { width: 115px; height: 115px; padding: 3px; position: absolute; left: 115px; display: flex; justify-content: center; align-items: center; background: #3ff9dc; transform: rotate(45deg); animation: configure-xclockwise 3s ease-in-out 0s infinite alternate; }
    .configure-core { width: 100%; height: 100%; background-color: #050505; }
  </style>
  <div class="spinner-box">
    <div class="configure-border-1"><div class="configure-core"></div></div>  
    <div class="configure-border-2"><div class="configure-core"></div></div> 
  </div>`;

  return (
    <>
      <style>{styles}</style>
      <LoaderCard title="SOLAR_SYSTEM" techStack="HTML / CSS" author={MOCK_USERS.jinbei} code={solarCode} fullscreenHtml={solarFullscreenHtml}>
        <div className="solar-system">
          <div className="earth-orbit orbit">
            <div className="planet earth"></div>
            <div className="venus-orbit orbit">
              <div className="planet venus"></div>
              <div className="mercury-orbit orbit">
                <div className="planet mercury"></div>
                <div className="sun"></div>
              </div>
            </div>
          </div>
        </div>
      </LoaderCard>

      <LoaderCard title="SQUARE_LOADER" techStack="HTML / CSS" author={MOCK_USERS.kiyoraka} code={squaresCode} fullscreenHtml={squaresFullscreenHtml}>
        <div className="configure-border-1"><div className="configure-core"></div></div>  
        <div className="configure-border-2"><div className="configure-core"></div></div> 
      </LoaderCard>
    </>
  );
};

export default LegacyFeaturedLoaders;