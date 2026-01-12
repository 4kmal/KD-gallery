
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
