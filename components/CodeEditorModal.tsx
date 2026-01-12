import React, { useState, useEffect, useRef } from 'react';
import { useSound } from './SoundManager';

interface CodeFile {
  name: string;
  content: string;
}

interface CodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: CodeFile[];
}

const CodeEditorModal: React.FC<CodeEditorModalProps> = ({ isOpen, onClose, files }) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { playSound } = useSound();
  const editorRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setActiveFileIndex(0);
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleCopy = () => {
    playSound('copy');
    navigator.clipboard.writeText(files[activeFileIndex].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  // Very basic regex-based syntax highlighting for a retro feel
  const highlightCode = (code: string) => {
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(".*?")/g, '<span class="text-emerald-300">$1</span>') // Strings
      .replace(/(\b(?:class|id|style|type|href|src|alt|onclick)\b=)/g, '<span class="text-amber-400">$1</span>') // Attributes
      .replace(/(&lt;!--.*?--&gt;)/g, '<span class="text-zinc-600 italic">$1</span>') // Comments
      .replace(/(&lt;\/?[a-z0-9]+)/gi, '<span class="text-emerald-500 font-bold">$1</span>') // Tags start
      .replace(/(&gt;)/g, '<span class="text-emerald-500 font-bold">$1</span>') // Tags end
      .replace(/(\.[a-z0-9_-]+)\b/gi, '<span class="text-cyan-400">$1</span>') // CSS Classes
      .replace(/(@[a-z-]+)\b/gi, '<span class="text-pink-400">$1</span>') // At-rules
      .replace(/(\b(?:const|let|var|function|return|if|else|for|while|import|export|class|new|this|await|async)\b)/g, '<span class="text-pink-500 font-bold">$1</span>'); // JS Keywords
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-[80vh] bg-zinc-950 border-4 border-emerald-900 shadow-[0_0_50px_rgba(16,185,129,0.1)] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-emerald-900/20 border-b-2 border-emerald-900">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            </div>
            <span className="text-emerald-500 font-black tracking-widest uppercase text-sm ml-4">
              [ CODE_VIEWER_PRO ]
            </span>
          </div>
          <button 
            onClick={onClose}
            onMouseEnter={() => playSound('hover')}
            className="text-zinc-500 hover:text-white transition-colors text-2xl font-black"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-zinc-900 overflow-x-auto no-scrollbar border-b border-zinc-800">
          {files.map((file, idx) => (
            <button
              key={file.name}
              onClick={() => {
                playSound('click');
                setActiveFileIndex(idx);
              }}
              onMouseEnter={() => playSound('hover')}
              className={`px-6 py-3 text-lg font-bold uppercase transition-all flex items-center gap-2 border-r border-zinc-800 whitespace-nowrap ${
                activeFileIndex === idx 
                  ? 'bg-zinc-950 text-emerald-400 border-b-2 border-b-emerald-500' 
                  : 'text-zinc-600 hover:bg-zinc-800 hover:text-zinc-400'
              }`}
            >
              <i className={`fas ${file.name.endsWith('.html') ? 'fa-code' : file.name.endsWith('.css') ? 'fa-css3' : 'fa-js'} text-sm`}></i>
              {file.name}
            </button>
          ))}
          <div className="flex-grow bg-zinc-900"></div>
          <button 
            onClick={handleCopy}
            className={`px-6 py-3 font-black text-lg uppercase transition-all ${
              copied ? 'bg-emerald-600 text-black' : 'bg-emerald-900/30 text-emerald-500 hover:bg-emerald-900/50'
            }`}
          >
            {copied ? 'COPIED!' : 'COPY_ALL'}
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-grow flex overflow-hidden relative group">
          {/* Line Numbers */}
          <div className="w-12 bg-zinc-950 border-r border-zinc-900 flex flex-col items-center pt-6 text-zinc-800 font-mono text-sm select-none">
            {files[activeFileIndex].content.split('\n').map((_, i) => (
              <div key={i} className="h-6 flex items-center justify-center">{i + 1}</div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-grow overflow-auto bg-black/40 relative">
            <pre 
              ref={editorRef}
              className="p-6 font-mono text-base leading-6 text-zinc-300 selection:bg-emerald-500/30 whitespace-pre"
              dangerouslySetInnerHTML={{ __html: highlightCode(files[activeFileIndex].content) }}
            />
          </div>

          {/* Minimap */}
          <div className="hidden lg:flex w-32 bg-zinc-950/80 border-l border-zinc-900 flex-col py-6 px-2 overflow-hidden select-none pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
            <div className="text-[2px] leading-[2.5px] font-mono whitespace-pre opacity-30 text-emerald-500">
              {files[activeFileIndex].content.slice(0, 5000)}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-4 py-1.5 bg-emerald-900/10 border-t border-emerald-900/30 flex justify-between items-center text-[10px] uppercase font-bold text-zinc-600 tracking-widest">
          <div className="flex gap-4">
            <span>FILE: {files[activeFileIndex].name}</span>
            <span>UTF-8</span>
            <span>{files[activeFileIndex].content.length} CHRS</span>
          </div>
          <div className="flex gap-4">
            <span>LN: 1 COL: 1</span>
            <span className="text-emerald-700">KRACKED_EDITOR v1.0.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorModal;