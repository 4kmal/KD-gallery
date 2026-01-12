import React, { useState, useEffect, useRef } from 'react';
import { useSound } from './SoundManager';
import { MOCK_USERS } from '../constants';
import CodeEditorModal from './CodeEditorModal';

const FeaturedCube: React.FC = () => {
  const [faceTexts, setFaceTexts] = useState(['', '', '', '', '', '']);
  const [copied, setCopied] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const streamingIntervals = useRef<number[]>([]);
  const { playSound } = useSound();
  const author = MOCK_USERS.fourkmal;

  // Maximum characters to display per face
  const maxChars = 140;

  // Complete website project files
  const generateCodeFiles = () => {
    const htmlFile = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Portfolio</title>
</head>
<body>
    <nav class="navbar">
        <div class="logo"><span>&lt;dev/&gt;</span></div>
    </nav>
<section class="hero">
    <canvas id="particles"></canvas>
    <h1 class="glitch" data-text="Hello World">Hello World</h1>
</section>
</body>
</html>`;

    const cssFile = `* { margin: 0; padding: 0; }
:root { --primary: #00ffff; --secondary: #ff00ff; }
body { background: #0a0a0a; color: #fff; }
.glitch { font-size: 4rem; animation: glitch 2s infinite; }
@keyframes glitch {
0%, 100% { transform: translate(0); }
20% { transform: translate(-2px, 2px); }
}`;

    const jsFile = `class ParticleSystem {
constructor(canvas) {
this.canvas = canvas;
this.init();
}
init() {
    this.canvas.width = window.innerWidth;
    for (let i = 0; i < 100; i++) {
        this.particles.push({x: Math.random()});
    }
}
}`;

    return [
      { name: 'index.html', content: htmlFile },
      { name: 'styles.css', content: cssFile },
      { name: 'main.js', content: jsFile }
    ];
  };

  const handleCopyProject = () => {
    playSound('copy');
    const files = generateCodeFiles();
    const fullProjectCode = `/* index.html */\n${files[0].content}\n\n/* styles.css */\n${files[1].content}\n\n/* main.js */\n${files[2].content}`;
    navigator.clipboard.writeText(fullProjectCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewCode = () => {
    playSound('click');
    setIsEditorOpen(true);
  };

  useEffect(() => {
    streamingIntervals.current.forEach(clearInterval);
    streamingIntervals.current = [];

    const codeFiles = generateCodeFiles();

    [codeFiles[0].content, codeFiles[1].content, codeFiles[2].content, codeFiles[0].content, codeFiles[1].content, codeFiles[2].content].forEach((content, faceIndex) => {
      let charIndex = 0;
      const interval = setInterval(() => {
        if (charIndex < content.length) {
          setFaceTexts(prev => {
            const newTexts = [...prev];
            newTexts[faceIndex] = (newTexts[faceIndex] + content[charIndex]).slice(-maxChars);
            return newTexts;
          });
          charIndex++;
        } else {
          charIndex = 0;
          setFaceTexts(prev => {
            const newTexts = [...prev];
            newTexts[faceIndex] = '';
            return newTexts;
          });
        }
      }, 30);
      
      streamingIntervals.current[faceIndex] = interval as any;
    });
    
    return () => {
      streamingIntervals.current.forEach(clearInterval);
    };
  }, []);

  const faceStyles = {
    front: { transform: 'translateZ(90px)', color: '#0ff', background: 'rgba(0, 255, 255, 0.05)', borderColor: 'rgba(0, 255, 255, 0.3)' },
    right: { transform: 'rotateY(90deg) translateZ(90px)', color: '#f0f', background: 'rgba(255, 0, 255, 0.05)', borderColor: 'rgba(255, 0, 255, 0.3)' },
    top: { transform: 'rotateX(90deg) translateZ(90px)', color: '#ff0', background: 'rgba(255, 255, 0, 0.05)', borderColor: 'rgba(255, 255, 0, 0.3)' },
    back: { transform: 'rotateY(180deg) translateZ(90px)', color: '#0f0', background: 'rgba(0, 255, 0, 0.05)', borderColor: 'rgba(0, 255, 0, 0.3)' },
    left: { transform: 'rotateY(-90deg) translateZ(90px)', color: '#f80', background: 'rgba(255, 136, 0, 0.05)', borderColor: 'rgba(255, 136, 0, 0.3)' },
    bottom: { transform: 'rotateX(-90deg) translateZ(90px)', color: '#88f', background: 'rgba(136, 136, 255, 0.05)', borderColor: 'rgba(136, 136, 255, 0.3)' },
  };

  const faceLabels = ['index.html', 'styles.css', 'main.js', 'index.html', 'styles.css', 'main.js'];

  return (
    <>
      <div className="relative w-full h-[550px] flex flex-col justify-between items-center bg-zinc-950/50 border border-emerald-900/50 overflow-hidden rounded-3xl p-8 group">
        <style>{`
        @keyframes rotateCube {
          from { transform: rotateX(-20deg) rotateY(30deg); }
          to { transform: rotateX(-20deg) rotateY(390deg); }
        }
        `}</style>
        
        <div className="text-center z-10 w-full">
          <p className="text-emerald-400 text-lg font-bold tracking-widest drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)] uppercase">
            NEURAL_CUBE
          </p>
          <div className="mt-2 inline-block px-3 py-1 bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-500 rounded uppercase">
            TSX / CSS / HTML
          </div>
        </div>

        <div className="relative flex-grow flex items-center justify-center">
          <div style={{
            width: '180px',
            height: '180px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            animation: 'rotateCube 15s infinite linear',
          }}>
            {Object.entries(faceStyles).map(([face, style], index) => (
              <div
                key={face}
                style={{
                  position: 'absolute',
                  width: '180px',
                  height: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: '8px',
                  lineHeight: '1.1',
                  overflow: 'hidden',
                  wordBreak: 'break-all',
                  padding: '8px',
                  boxSizing: 'border-box',
                  border: '1px solid',
                  fontFamily: 'monospace',
                  ...style,
                } as React.CSSProperties}
              >
                <div style={{ fontSize: '7px', fontWeight: 'bold', marginBottom: '4px', opacity: 0.8, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '2px', color: style.color }}>
                  {faceLabels[index]}
                </div>
                <p style={{ flex: 1, overflow: 'hidden', whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0, color: style.color }}>
                  {faceTexts[index]}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="z-10 w-full flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyProject}
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
        files={generateCodeFiles()} 
      />
    </>
  );
};

export default FeaturedCube;
