
export interface User {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  isMod?: boolean;
}

export interface LoadingAnimation {
  id: string;
  name: string;
  description: string;
  category: 'Spinnners' | 'Dots' | 'Bars' | 'Shape Shift' | 'AI Generated' | 'Westworld';
  html: string;
  tailwindClasses: string;
  author?: User;
}

export type SoundType = 'hover' | 'click' | 'copy' | 'generate';

export type BountyDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type BountyStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';

export interface BountySubmission {
  id: string;
  hunterId: string;
  hunterUsername: string;
  submittedAt: string;
  isWinner: boolean;
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  prize: number;
  currency: string;
  difficulty: BountyDifficulty;
  status: BountyStatus;
  winner?: string;
  submissions?: BountySubmission[];
  createdAt: string;
  completedAt?: string;
}

export type PageType = 'gallery' | 'bounties';

// Filter settings for fullscreen viewer
export type ColorOverlay = 'none' | 'neon' | 'matrix' | 'cyberpunk' | 'amber' | 'ice';
export type AnimationSpeed = 0.25 | 0.5 | 1 | 2 | 4;

export interface FilterSettings {
  // Visual filters
  blur: number;           // 0-10 px
  grayscale: number;      // 0-100 %
  sepia: number;          // 0-100 %
  invert: boolean;
  contrast: number;       // 50-200 %
  brightness: number;     // 50-200 %
  saturate: number;       // 0-200 %
  hueRotate: number;      // 0-360 deg
  
  // Effects
  crtEffect: boolean;     // CRT scanline overlay
  showStatusText: boolean; // Show "ESTABLISHING CONNECTION..." text
  
  // Color overlay
  colorOverlay: ColorOverlay;
  
  // Animation controls
  speed: AnimationSpeed;
  isPaused: boolean;
}
