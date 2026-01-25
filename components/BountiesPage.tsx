import React, { useState } from 'react';
import { useSound } from './SoundManager';
import { Bounty, BountyDifficulty, BountyStatus } from '../types';

// Sample bounties data based on the Kracked Devs bounty program
const BOUNTIES_DATA: Bounty[] = [
  {
    id: '1',
    title: 'MYR EXPENSE TRACKER + BUDGET COACH',
    description: 'Bounty Description Build a MYR expense tracker + budget coach that helps Malaysians track spending and stay within category budgets. Include simple OAuth login (Google or GitHub).',
    prize: 200,
    currency: 'RM',
    difficulty: 'INTERMEDIATE',
    status: 'COMPLETED',
    winner: '@Marot.js',
    createdAt: '2024-01-15',
    completedAt: '2024-02-10',
  },
  {
    id: '2',
    title: 'VIRAL FOOD DIRECTORY (MAP EDITION)',
    description: 'Build a map-first web app to discover viral food spots, powered by reviews from Google plus one other source.',
    prize: 200,
    currency: 'RM',
    difficulty: 'ADVANCED',
    status: 'COMPLETED',
    winner: '@4kmal',
    createdAt: '2024-01-20',
    completedAt: '2024-02-15',
  },
  {
    id: '3',
    title: 'BUILD A KRACKED DEVS PROFILE GITHUB WIDGET',
    description: 'Build a customizable GitHub widget for Kracked Devs profiles with OAuth, contribution graph, themes, and live preview.',
    prize: 150,
    currency: 'RM',
    difficulty: 'ADVANCED',
    status: 'COMPLETED',
    winner: '@4kmal',
    createdAt: '2024-02-01',
    completedAt: '2024-03-01',
  },
  {
    id: '4',
    title: 'BUILD A GAMIFIED TECH JOB BOARD FOR KRACKED DEVS',
    description: 'Implement gamification features into a tech job board – points, badges, leaderboards for job applications, postings, or hires.',
    prize: 150,
    currency: 'RM',
    difficulty: 'INTERMEDIATE',
    status: 'COMPLETED',
    winner: '@name-iffat',
    createdAt: '2024-02-10',
    completedAt: '2024-03-15',
  },
  {
    id: '5',
    title: 'KRACKED DEVS LANDING PAGE',
    description: 'Create a creative, standout landing page design for Kracked Devs – a vibrant developer community.',
    prize: 100,
    currency: 'RM',
    difficulty: 'BEGINNER',
    status: 'COMPLETED',
    winner: '@zafranudin_z',
    createdAt: '2024-02-20',
    completedAt: '2024-03-10',
  },
];

interface BountyCardProps {
  bounty: Bounty;
}

const getDifficultyColor = (difficulty: BountyDifficulty): string => {
  switch (difficulty) {
    case 'BEGINNER':
      return 'border-emerald-500 text-emerald-500';
    case 'INTERMEDIATE':
      return 'border-amber-500 text-amber-500';
    case 'ADVANCED':
      return 'border-red-500 text-red-500';
    default:
      return 'border-zinc-500 text-zinc-500';
  }
};

const getStatusColor = (status: BountyStatus): string => {
  switch (status) {
    case 'COMPLETED':
      return 'border-zinc-600 text-zinc-400';
    case 'OPEN':
      return 'border-emerald-500 text-emerald-500';
    case 'IN_PROGRESS':
      return 'border-amber-500 text-amber-500';
    default:
      return 'border-zinc-500 text-zinc-500';
  }
};

const BountyCard: React.FC<BountyCardProps> = ({ bounty }) => {
  const { playSound } = useSound();

  return (
    <div
      className="group relative bg-zinc-950 border-2 border-zinc-800 p-6 hover:border-emerald-500/50 transition-all duration-300"
      onMouseEnter={() => playSound('hover')}
    >
      {/* Header with title and prize */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-lg font-black uppercase tracking-wider text-zinc-300 group-hover:text-emerald-400 transition-colors leading-tight">
          {bounty.title}
        </h3>
        <span className="text-2xl font-black text-zinc-600 whitespace-nowrap">
          {bounty.currency}{bounty.prize}
        </span>
      </div>

      {/* Description */}
      <p className="text-zinc-600 text-sm leading-relaxed mb-6 line-clamp-3">
        {bounty.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border ${getDifficultyColor(bounty.difficulty)}`}>
          {bounty.difficulty}
        </span>
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border ${getStatusColor(bounty.status)}`}>
          {bounty.status}
        </span>
      </div>

      {/* Winner */}
      {bounty.winner && (
        <div className="flex items-center gap-2 text-sm">
          <i className="fas fa-trophy text-amber-500"></i>
          <span className="text-zinc-600">Winner:</span>
          <span className="text-emerald-400 font-bold">{bounty.winner}</span>
        </div>
      )}

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
};

interface BountiesPageProps {
  onNavigateHome: () => void;
}

const BountiesPage: React.FC<BountiesPageProps> = ({ onNavigateHome }) => {
  const { playSound } = useSound();
  const [filter, setFilter] = useState<'ALL' | BountyStatus>('ALL');

  const completedCount = BOUNTIES_DATA.filter(b => b.status === 'COMPLETED').length;
  const totalCount = BOUNTIES_DATA.length;

  const filteredBounties = filter === 'ALL' 
    ? BOUNTIES_DATA 
    : BOUNTIES_DATA.filter(b => b.status === filter);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full -z-10"></div>
          
          {/* Breadcrumb */}
          <button
            onClick={() => {
              playSound('click');
              onNavigateHome();
            }}
            onMouseEnter={() => playSound('hover')}
            className="flex items-center gap-2 text-zinc-600 hover:text-emerald-400 transition-colors mb-8 group"
          >
            <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            <span className="uppercase tracking-wider text-sm">Back to Gallery</span>
          </button>

          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter leading-none uppercase">
                <span className="text-amber-500">COMPLETED</span> BOUNTIES
              </h1>
              <p className="text-zinc-500 text-lg uppercase tracking-wider">
                Past challenges conquered by the Kracked community
              </p>
            </div>
            
            <div className="text-right">
              <span className="text-4xl font-black text-emerald-500">{completedCount}</span>
              <span className="text-zinc-600 text-2xl font-bold"> OF </span>
              <span className="text-4xl font-black text-zinc-500">{totalCount}</span>
              <p className="text-zinc-700 uppercase tracking-widest text-sm mt-1">COMPLETED</p>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="mb-12">
          <div className="flex items-center gap-4 flex-wrap">
            {(['ALL', 'COMPLETED', 'OPEN', 'IN_PROGRESS'] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  playSound('click');
                  setFilter(status);
                }}
                onMouseEnter={() => playSound('hover')}
                className={`px-6 py-2 text-sm font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_#000] active:translate-y-[2px] active:shadow-none ${
                  filter === status
                    ? 'bg-emerald-600 text-black'
                    : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800'
                }`}
              >
                {status === 'IN_PROGRESS' ? 'IN PROGRESS' : status}
              </button>
            ))}
          </div>
        </section>

        {/* Bounties Grid */}
        <section>
          {filteredBounties.length === 0 ? (
            <div className="py-32 text-center border-4 border-dashed border-zinc-900">
              <h3 className="text-2xl font-black text-zinc-700 uppercase tracking-widest mb-4">
                NO BOUNTIES FOUND
              </h3>
              <p className="text-lg text-zinc-800 uppercase">
                Check back later for new challenges.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBounties.map((bounty) => (
                <BountyCard key={bounty.id} bounty={bounty} />
              ))}
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="mt-24 border-2 border-zinc-900 bg-zinc-950 p-8">
          <h2 className="text-xl font-black uppercase tracking-widest text-zinc-500 mb-8">
            [ BOUNTY_STATS ]
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-4xl font-black text-emerald-500">
                {BOUNTIES_DATA.reduce((sum, b) => sum + b.prize, 0)}
              </p>
              <p className="text-zinc-600 uppercase tracking-wider text-sm mt-1">RM Total Awarded</p>
            </div>
            <div>
              <p className="text-4xl font-black text-amber-500">{completedCount}</p>
              <p className="text-zinc-600 uppercase tracking-wider text-sm mt-1">Bounties Completed</p>
            </div>
            <div>
              <p className="text-4xl font-black text-cyan-500">
                {new Set(BOUNTIES_DATA.filter(b => b.winner).map(b => b.winner)).size}
              </p>
              <p className="text-zinc-600 uppercase tracking-wider text-sm mt-1">Unique Winners</p>
            </div>
            <div>
              <p className="text-4xl font-black text-purple-500">
                {Math.round(BOUNTIES_DATA.reduce((sum, b) => sum + b.prize, 0) / completedCount)}
              </p>
              <p className="text-zinc-600 uppercase tracking-wider text-sm mt-1">Avg Prize (RM)</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BountiesPage;

