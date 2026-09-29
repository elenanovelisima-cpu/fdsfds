import React, { useState } from 'react';
import { 
  ArrowLeft,
  Flame,
  Award,
  Calendar,
  Activity,
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Share2,
  Download,
  Filter,
  Users
} from 'lucide-react';
import { playRetroSound } from '../utils/audio';

interface PlayerProfilePageProps {
  onBackToHome: () => void;
  onShowToast: (msg: string) => void;
  onOpenChecklistModal?: () => void;
}

export const PlayerProfilePage: React.FC<PlayerProfilePageProps> = ({
  onBackToHome,
  onShowToast,
  onOpenChecklistModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'shot-chart' | 'graphs' | 'game-log' | 'news'>('overview');
  const [isGameLogModalOpen, setIsGameLogModalOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Multi-season historical data for points, rebounds, assists
  const seasonStatsData = [
    { season: '19-20', pts: 28.8, reb: 9.4, ast: 8.8, ts: 58.5, usg: 36.8 },
    { season: '20-21', pts: 27.7, reb: 8.0, ast: 8.6, ts: 58.7, usg: 36.0 },
    { season: '21-22', pts: 28.4, reb: 9.1, ast: 8.7, ts: 57.1, usg: 37.4 },
    { season: '22-23', pts: 32.4, reb: 8.6, ast: 8.0, ts: 60.9, usg: 37.6 },
    { season: '23-24', pts: 33.9, reb: 9.2, ast: 9.8, ts: 61.7, usg: 36.0 }
  ];

  // Full recent game log
  const recentGames = [
    { date: 'Apr 12', opp: '@ BOS', pts: 32, reb: 10, ast: 12, min: 37, result: 'W 112-109', fg: '11/21' },
    { date: 'Apr 10', opp: 'vs LAL', pts: 28, reb: 8, ast: 9, min: 36, result: 'W 120-114', fg: '10/19' },
    { date: 'Apr 8', opp: '@ PHX', pts: 31, reb: 7, ast: 11, min: 35, result: 'L 105-111', fg: '12/24' },
    { date: 'Apr 6', opp: 'vs DEN', pts: 27, reb: 9, ast: 8, min: 38, result: 'W 108-103', fg: '9/18' },
    { date: 'Apr 4', opp: '@ SAC', pts: 24, reb: 6, ast: 10, min: 34, result: 'W 117-104', fg: '8/17' }
  ];

  // Shot chart points (x: 0-100, y: 0-100, made: boolean, zone: string)
  const shotChartDots = [
    // Paint / Rim
    { x: 50, y: 88, made: true, z: 'Rim' },
    { x: 48, y: 84, made: true, z: 'Rim' },
    { x: 52, y: 86, made: true, z: 'Rim' },
    { x: 47, y: 80, made: true, z: 'Rim' },
    { x: 53, y: 81, made: false, z: 'Rim' },
    { x: 49, y: 76, made: true, z: 'Paint' },
    { x: 51, y: 73, made: true, z: 'Paint' },
    { x: 45, y: 74, made: false, z: 'Paint' },
    { x: 55, y: 75, made: true, z: 'Paint' },
    { x: 46, y: 68, made: true, z: 'Floater' },
    { x: 54, y: 69, made: false, z: 'Floater' },

    // Mid-Range
    { x: 38, y: 64, made: true, z: 'Mid Left' },
    { x: 62, y: 64, made: false, z: 'Mid Right' },
    { x: 35, y: 55, made: true, z: 'Mid Left' },
    { x: 65, y: 56, made: true, z: 'Mid Right' },
    { x: 40, y: 50, made: false, z: 'Mid High' },
    { x: 60, y: 50, made: true, z: 'Mid High' },
    { x: 50, y: 52, made: true, z: 'Nail' },
    { x: 32, y: 68, made: true, z: 'Elbow' },
    { x: 68, y: 68, made: false, z: 'Elbow' },

    // 3-Pointers
    { x: 50, y: 28, made: true, z: 'Top 3PT' },
    { x: 48, y: 25, made: false, z: 'Top 3PT' },
    { x: 52, y: 26, made: true, z: 'Top 3PT' },
    { x: 42, y: 30, made: true, z: 'Left Wing 3PT' },
    { x: 38, y: 34, made: false, z: 'Left Wing 3PT' },
    { x: 34, y: 38, made: true, z: 'Left Wing 3PT' },
    { x: 58, y: 30, made: false, z: 'Right Wing 3PT' },
    { x: 62, y: 34, made: true, z: 'Right Wing 3PT' },
    { x: 66, y: 38, made: false, z: 'Right Wing 3PT' },
    { x: 18, y: 78, made: true, z: 'Left Corner 3PT' },
    { x: 16, y: 84, made: false, z: 'Left Corner 3PT' },
    { x: 82, y: 78, made: true, z: 'Right Corner 3PT' },
    { x: 84, y: 84, made: true, z: 'Right Corner 3PT' },
    { x: 45, y: 22, made: true, z: 'Deep 3PT' },
    { x: 55, y: 22, made: false, z: 'Deep 3PT' },
    { x: 30, y: 44, made: false, z: 'Left Wing 3PT' },
    { x: 70, y: 44, made: true, z: 'Right Wing 3PT' }
  ];

  return (
    <div className="min-h-screen bg-[#ede7dc] text-[#0e3a73] font-sans relative overflow-x-hidden pb-12 select-none">
      
      {/* Macro Unbleached Paper Pulp Texture Overlay (Continuous for entire page) */}
      <div className="absolute inset-0 pointer-events-none opacity-25 texture-paper-pulp z-0" />

      {/* 1. TOP HEADER BAR */}
      <header className="relative z-10 border-b-[1.5px] border-[#c02328] bg-[#ede7dc] px-4 sm:px-8 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {/* Same paper pulp texture integrated directly in the header */}
        <div className="absolute inset-0 pointer-events-none opacity-25 texture-paper-pulp z-0" />
        <div className="relative z-10 site-container flex flex-wrap items-center justify-between gap-4">
          
          {/* Left Brand: Logo-1.png & Typography */}
          <div 
            onClick={() => {
              playRetroSound('burst');
              onBackToHome();
            }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <img 
              src="/assets/images/icon.png" 
              alt="BASKETDATA" 
              className="w-[41px] h-[46px] object-contain shrink-0 group-hover:scale-105 transition-transform"
              style={{ width: '41px', height: '46px' }}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/icon.png')) {
                  target.src = '/icon.png';
                }
              }}
            />

            <div className="leading-none">
              <span className="font-slab text-xl sm:text-2xl text-[#0b3260] tracking-tight block uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                BASKETDATA
              </span>
              <span 
                className="font-condensed text-[14px] text-[#0b3260] font-bold tracking-[0.25em] uppercase block mt-0.5 text-center w-[210.325px]"
                style={{ fontSize: '14px', textAlign: 'center', width: '210.325px' }}
              >
                ★ ANALYTICS ★
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-condensed font-bold text-[14px] text-[#0b3260] tracking-wider uppercase">
            <button 
              onClick={() => {
                playRetroSound('click');
                onBackToHome();
              }}
              className="flex items-center gap-1.5 text-[#c02328] hover:text-[#991b1b] transition-colors cursor-pointer bg-black/5 px-2.5 py-1 rounded-[3px] border border-[#c02328]/30 shadow-xs"
            >
              <ArrowLeft size={14} />
              <span>VOLVER AL INICIO</span>
            </button>
            <span className="hover:text-[#c02328] transition-colors cursor-pointer" onClick={() => onShowToast('How It Works')}>HOW IT WORKS</span>
            <span className="hover:text-[#c02328] transition-colors cursor-pointer" onClick={() => onShowToast('Features')}>FEATURES</span>
            <span className="hover:text-[#c02328] transition-colors cursor-pointer" onClick={() => onShowToast('Pricing')}>PRICING</span>
            <span className="hover:text-[#c02328] transition-colors cursor-pointer" onClick={() => onShowToast('Blog')}>BLOG</span>
            <span className="hover:text-[#c02328] transition-colors cursor-pointer" onClick={() => onShowToast('Store')}>STORE</span>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                playRetroSound('burst');
                onShowToast('START ANALYZING: Deep Player Analytics Active');
              }}
              className="comic-interactive-card relative bg-[#0c3975] hover:bg-[#124b94] text-white font-condensed font-bold text-xs sm:text-[13px] tracking-wider uppercase px-4 sm:px-5 py-2 rounded-[4px] border-2 border-white shadow-[0_0_0_2px_#0c3975] cursor-pointer"
            >
              START ANALYZING
            </button>

            <button
              onClick={() => {
                playRetroSound('click');
                onShowToast('Sign in to your BASKETDATA account.');
              }}
              className="font-condensed font-bold text-xs sm:text-[13px] text-[#0b3260] hover:text-[#c02328] uppercase tracking-wider cursor-pointer"
            >
              SIGN IN
            </button>
          </div>

        </div>
      </header>

      {/* Breadcrumb / Back button on Mobile */}
      <div className="site-container pt-3 pb-1 flex items-center justify-between text-xs font-mono-code text-slate-600">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBackToHome}
            className="flex items-center gap-1 text-[#0c3975] hover:text-[#c02328] font-bold uppercase transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>INICIO</span>
          </button>
          <span>/</span>
          <span className="text-slate-500 uppercase">JUGADORES</span>
          <span>/</span>
          <span className="font-bold text-[#b91c1c] uppercase">LUKA DONČIĆ (#77)</span>
        </div>

        <button 
          onClick={() => {
            playRetroSound('click');
            onShowToast('Copiando enlace del perfil de Luka Dončić...');
          }}
          className="flex items-center gap-1 text-slate-700 hover:text-[#0c3975] font-condensed font-bold uppercase text-[11px] cursor-pointer"
        >
          <Share2 size={13} />
          <span>COMPARTIR PERFIL</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. PLAYER HERO SHOWCASE: DEEP BLUE CHALKBOARD / VINTAGE CARD              */}
      {/* ========================================================================= */}
      <section className="relative z-10 site-container mt-2">
        <div className="fondoazul-solid rounded-[6px] border-none outline-none ring-0 p-5 sm:p-7 lg:p-9 shadow-2xl relative overflow-hidden text-white">
          
          {/* Background Watermark: Dallas Mavericks Horse Silhouette Sketch */}
          <div className="absolute right-6 top-4 w-72 h-72 opacity-15 pointer-events-none select-none">
            <svg viewBox="0 0 200 200" className="w-full h-full stroke-white fill-none stroke-2">
              <circle cx="100" cy="100" r="90" strokeDasharray="6 6" />
              <path d="M 60 140 Q 90 70 140 60 Q 150 90 120 120 Q 90 140 60 140" fill="white" fillOpacity="0.08" />
              <circle cx="130" cy="80" r="8" fill="white" />
              <path d="M 80 130 L 110 160 L 140 140" />
            </svg>
          </div>

          {/* Chalk Handwritten Slogan in Top Right */}
          <div className="absolute right-6 top-8 text-right hidden md:block select-none pointer-events-none">
            <div className="chalk-text-italic text-white/85 text-xs sm:text-sm font-bold leading-tight">
              REAL STATS.<br />
              REAL INSIGHTS.<br />
              REAL HOOPS.
            </div>
            {/* Chalk Crown Doodle */}
            <div className="mt-1 flex justify-end text-white/80">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white fill-none stroke-2">
                <path d="M 2 18 L 4 6 L 9 12 L 12 4 L 15 12 L 20 6 L 22 18 Z" />
                <line x1="2" y1="20" x2="22" y2="20" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* LEFT: Authentic Vintage Card Stack of Luka Dončić */}
            <div className="lg:col-span-4 xl:col-span-4 flex justify-center">
              <div 
                onClick={() => {
                  playRetroSound('card');
                  onShowToast('Luka Dončić Vintage 2023-24 Star Card');
                }}
                className="comic-interactive-card relative w-64 sm:w-72 aspect-[2.5/3.5] rounded-[6px] card-stack-depth bg-[#ede5d6] border-2 border-black p-2.5 shadow-2xl cursor-pointer group transform hover:-translate-y-1 transition-all"
              >
                {/* Vintage Tape on top */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-200/50 backdrop-blur-xs border border-yellow-300/40 transform -rotate-1 rounded-xs pointer-events-none z-40" />

                {/* Inner Royal Blue Frame */}
                <div className="w-full h-full rounded-[4px] bg-[#0c4383] border-2 border-white p-2 flex flex-col justify-between relative shadow-inner overflow-hidden text-white">
                  
                  {/* Card Header: LUKA DONČIĆ & #77 */}
                  <div className="flex items-start justify-between border-b border-white/40 pb-1 px-1">
                    <div>
                      <h3 className="font-slab text-base sm:text-lg text-white tracking-tight leading-none uppercase drop-shadow">
                        LUKA DONČIĆ
                      </h3>
                      <span className="font-slab text-xs font-bold text-white uppercase block mt-0.5 drop-shadow">
                        PG
                      </span>
                    </div>

                    <div className="font-slab text-base sm:text-lg text-white font-black tracking-tight drop-shadow">
                      #77
                    </div>
                  </div>

                  {/* Player Photo with Mavericks Jersey and Basketball */}
                  <div className="relative flex-1 my-1.5 rounded-[3px] overflow-hidden border border-white/60 bg-[#082346] flex items-center justify-center">
                    <img 
                      src="/src/assets/images/vintage_hoops_card_star_1790618421190.jpg" 
                      alt="Luka Dončić" 
                      className="w-full h-full object-cover filter contrast-115 group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Ultra '94 Gold Stamp on top-left */}
                    <div className="absolute top-1 left-1.5 bg-gradient-to-r from-amber-400 to-yellow-200 text-black px-1 rounded-[2px] text-[7.5px] font-black uppercase tracking-tight shadow">
                      ULTRA '94
                    </div>

                    {/* Round MAVS Badge on bottom-right */}
                    <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#0c3975] border-1.5 border-white flex items-center justify-center text-[7.5px] font-slab font-black text-white shadow-md">
                      MAVS
                    </div>

                    {/* Bottom Plate on photo */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1 pt-3 text-center">
                      <span className="font-slab text-[10px] text-yellow-300 tracking-wider uppercase block">
                        LUKA DONČIĆ
                      </span>
                    </div>
                  </div>

                  {/* Bottom Stats Bars on Card */}
                  <div className="border border-white/50 rounded-[2px] overflow-hidden bg-black/40">
                    <div className="grid grid-cols-3 text-center text-white font-mono-code font-bold text-[9.5px] border-b border-white/30 py-0.5 bg-white/10">
                      <span>28.7 PPG</span>
                      <span>8.9 RPG</span>
                      <span>8.1 APG</span>
                    </div>
                    <div className="grid grid-cols-3 text-center text-white font-mono-code font-bold text-[9px] py-0.5">
                      <span>58.3% FG</span>
                      <span>38.7% 3P</span>
                      <span>88.2% FT</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* CENTER / RIGHT: Monumental Headline & Player Bio Meta */}
            <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-center">
              
              {/* Monumental Slab Headline: LUKA DONČIĆ */}
              <h1 className="font-slab text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white tracking-normal uppercase leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                LUKA DONČIĆ
              </h1>

              {/* Subtitle / Role Tagline */}
              <div className="mt-2 flex items-center gap-2 text-xs sm:text-[15px] font-condensed font-bold tracking-wider text-white/90 uppercase">
                <span className="text-[#c02328] text-base sm:text-lg">★</span>
                <span>POINT GUARD &nbsp;/&nbsp; DALLAS MAVERICKS &nbsp;/&nbsp; #77</span>
              </div>

              {/* Player Bio Attributes Grid (Age, Height, Weight, Country) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 max-w-2xl bg-black/35 p-3 rounded-[4px] border border-white/20 backdrop-blur-xs">
                {/* Age */}
                <div className="border-r border-white/20 pr-2">
                  <span className="text-[10px] font-mono-code text-white/70 uppercase block">AGE</span>
                  <span className="font-slab text-xl sm:text-2xl text-white block mt-0.5">25</span>
                </div>

                {/* Height */}
                <div className="border-r border-white/20 pr-2">
                  <span className="text-[10px] font-mono-code text-white/70 uppercase block">HEIGHT</span>
                  <span className="font-slab text-xl sm:text-2xl text-white block mt-0.5">2.01 m</span>
                </div>

                {/* Weight */}
                <div className="sm:border-r sm:border-white/20 pr-2">
                  <span className="text-[10px] font-mono-code text-white/70 uppercase block">WEIGHT</span>
                  <span className="font-slab text-xl sm:text-2xl text-white block mt-0.5">104 kg</span>
                </div>

                {/* Country with Flag */}
                <div>
                  <span className="text-[10px] font-mono-code text-white/70 uppercase block">COUNTRY</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-lg">🇸🇮</span>
                    <span className="font-condensed font-bold text-base sm:text-lg text-white uppercase">Slovenia</span>
                  </div>
                </div>
              </div>

              {/* Bio Paragraph */}
              <p className="mt-4 text-xs sm:text-[14px] text-white/90 font-mono-code font-normal leading-relaxed max-w-2xl select-text">
                Elite playmaker with exceptional court vision, scoring ability and basketball IQ. Luka Dončić combines size, skill and leadership, making him one of the most complete players in the NBA.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SUB-NAV TABS BAR                                                       */}
      {/* OVERVIEW | STATS | SHOT CHART | GRAPHS | GAME LOG | NEWS                  */}
      {/* Direct on website beige background without white box layer                */}
      {/* ========================================================================= */}
      <section className="relative z-10 site-container mt-4">
        <div className="flex items-center justify-between flex-wrap gap-3 py-1.5 border-b border-[#0c3975]/20">
          
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-[13px] font-condensed font-bold uppercase tracking-wider">
            {/* Overview Tab */}
            <button
              onClick={() => {
                playRetroSound('click');
                setActiveTab('overview');
              }}
              className={`px-4 py-1 rounded-[2px] transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#b91c1c] text-white shadow-xs'
                  : 'text-[#0c3975] hover:text-[#b91c1c]'
              }`}
            >
              OVERVIEW
            </button>

            <span className="text-[#0c3975]/30 font-light">|</span>

            {/* Stats Tab */}
            <button
              onClick={() => {
                playRetroSound('click');
                setActiveTab('stats');
              }}
              className={`px-2.5 py-1 rounded-[2px] transition-all cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-[#b91c1c] text-white shadow-xs'
                  : 'text-[#0c3975] hover:text-[#b91c1c]'
              }`}
            >
              STATS
            </button>

            <span className="text-[#0c3975]/30 font-light">|</span>

            {/* Shot Chart Tab */}
            <button
              onClick={() => {
                playRetroSound('click');
                setActiveTab('shot-chart');
              }}
              className={`px-2.5 py-1 rounded-[2px] transition-all cursor-pointer ${
                activeTab === 'shot-chart'
                  ? 'bg-[#b91c1c] text-white shadow-xs'
                  : 'text-[#0c3975] hover:text-[#b91c1c]'
              }`}
            >
              SHOT CHART
            </button>

            <span className="text-[#0c3975]/30 font-light">|</span>

            {/* Graphs Tab */}
            <button
              onClick={() => {
                playRetroSound('click');
                setActiveTab('graphs');
              }}
              className={`px-2.5 py-1 rounded-[2px] transition-all cursor-pointer ${
                activeTab === 'graphs'
                  ? 'bg-[#b91c1c] text-white shadow-xs'
                  : 'text-[#0c3975] hover:text-[#b91c1c]'
              }`}
            >
              GRAPHS
            </button>

            <span className="text-[#0c3975]/30 font-light">|</span>

            {/* Game Log Tab */}
            <button
              onClick={() => {
                playRetroSound('click');
                setActiveTab('game-log');
              }}
              className={`px-2.5 py-1 rounded-[2px] transition-all cursor-pointer ${
                activeTab === 'game-log'
                  ? 'bg-[#b91c1c] text-white shadow-xs'
                  : 'text-[#0c3975] hover:text-[#b91c1c]'
              }`}
            >
              GAME LOG
            </button>

            <span className="text-[#0c3975]/30 font-light">|</span>

            {/* News Tab */}
            <button
              onClick={() => {
                playRetroSound('click');
                setActiveTab('news');
              }}
              className={`px-2.5 py-1 rounded-[2px] transition-all cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-[#b91c1c] text-white shadow-xs'
                  : 'text-[#0c3975] hover:text-[#b91c1c]'
              }`}
            >
              NEWS
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playRetroSound('click');
                setIsGameLogModalOpen(true);
              }}
              className="py-1 px-3 text-[11px] font-condensed font-bold uppercase tracking-wider text-[#0c3975] border border-[#0c3975]/40 rounded-[2px] cursor-pointer hover:bg-black/5"
            >
              TABLA COMPLETA
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ROW 1: KEY STATS (2023-24) & SEASON AVERAGES CARD                     */}
      {/* Pure beige paper background - NO white card layer                         */}
      {/* ========================================================================= */}
      <section className="relative z-10 site-container mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* LEFT: KEY STATS (2023-24) -> 6 Main Stat Columns */}
          <div className="lg:col-span-8 border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden flex flex-col justify-between">
            
            {/* Dark Blue Header Bar */}
            <div className="bg-[#0c3975] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 flex items-center gap-1.5">
              <span className="text-[#c02328]">★</span>
              <span>KEY STATS (2023-24)</span>
            </div>

            {/* 6 Large Stat Columns with Dividers directly on beige */}
            <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-2 divide-y sm:divide-y-0 sm:divide-x divide-[#0c3975]/25 flex-1 items-center">
              
              {/* Stat 1: PTS */}
              <div className="text-center pt-2 sm:pt-0 sm:px-2">
                <span className="font-slab text-3xl sm:text-4xl lg:text-[40px] text-[#0c3975] block leading-none">
                  28.7
                </span>
                <span className="font-condensed font-bold text-[11px] sm:text-xs text-slate-800 tracking-wider uppercase block mt-1.5">
                  POINTS<br />PER GAME
                </span>
              </div>

              {/* Stat 2: REB */}
              <div className="text-center pt-2 sm:pt-0 sm:px-2">
                <span className="font-slab text-3xl sm:text-4xl lg:text-[40px] text-[#0c3975] block leading-none">
                  8.9
                </span>
                <span className="font-condensed font-bold text-[11px] sm:text-xs text-slate-800 tracking-wider uppercase block mt-1.5">
                  REBOUNDS<br />PER GAME
                </span>
              </div>

              {/* Stat 3: AST */}
              <div className="text-center pt-2 sm:pt-0 sm:px-2">
                <span className="font-slab text-3xl sm:text-4xl lg:text-[40px] text-[#0c3975] block leading-none">
                  8.1
                </span>
                <span className="font-condensed font-bold text-[11px] sm:text-xs text-slate-800 tracking-wider uppercase block mt-1.5">
                  ASSISTS<br />PER GAME
                </span>
              </div>

              {/* Stat 4: FG% */}
              <div className="text-center pt-2 sm:pt-0 sm:px-2">
                <span className="font-slab text-3xl sm:text-4xl lg:text-[40px] text-[#0c3975] block leading-none">
                  58.3%
                </span>
                <span className="font-condensed font-bold text-[11px] sm:text-xs text-slate-800 tracking-wider uppercase block mt-1.5">
                  FIELD GOAL %
                </span>
              </div>

              {/* Stat 5: 3P% */}
              <div className="text-center pt-2 sm:pt-0 sm:px-2">
                <span className="font-slab text-3xl sm:text-4xl lg:text-[40px] text-[#0c3975] block leading-none">
                  38.7%
                </span>
                <span className="font-condensed font-bold text-[11px] sm:text-xs text-slate-800 tracking-wider uppercase block mt-1.5">
                  3 POINT %
                </span>
              </div>

              {/* Stat 6: FT% */}
              <div className="text-center pt-2 sm:pt-0 sm:px-2">
                <span className="font-slab text-3xl sm:text-4xl lg:text-[40px] text-[#0c3975] block leading-none">
                  88.2%
                </span>
                <span className="font-condensed font-bold text-[11px] sm:text-xs text-slate-800 tracking-wider uppercase block mt-1.5">
                  FREE THROW %
                </span>
              </div>

            </div>
          </div>

          {/* RIGHT: SEASON AVERAGES (Card Back Chipboard Table) */}
          <div className="lg:col-span-4 border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden p-3 flex flex-col justify-between">
            
            {/* Top Bar */}
            <div className="bg-[#0c3975] text-white px-2.5 py-1 rounded-[2px] flex items-center justify-between font-condensed uppercase tracking-wider text-xs font-bold">
              <span className="font-slab text-[12px] tracking-wide flex items-center gap-1">
                <span className="text-[#c02328]">★</span>
                <span>SEASON AVERAGES</span>
              </span>
              <span className="font-mono-code text-[11px] text-yellow-300">2023-24</span>
            </div>

            {/* Table: GP | MIN | PTS | REB | AST | STL | BLK directly on beige */}
            <div className="my-1.5 overflow-hidden border border-[#0c3975]/25 rounded-[2px]">
              <table className="w-full text-center text-[9.5px] font-mono-code font-bold border-collapse">
                <thead>
                  <tr className="bg-[#0c3975]/10 text-[#0c3975] border-b border-[#0c3975]/20">
                    <th className="py-0.5">GP</th>
                    <th>MIN</th>
                    <th>PTS</th>
                    <th>REB</th>
                    <th>AST</th>
                    <th>STL</th>
                    <th>BLK</th>
                  </tr>
                </thead>
                <tbody className="text-slate-900">
                  <tr className="divide-x divide-[#0c3975]/15">
                    <td className="py-0.5">70</td>
                    <td>36.8</td>
                    <td className="font-black text-[#0c3975]">28.7</td>
                    <td>8.9</td>
                    <td>8.1</td>
                    <td>1.4</td>
                    <td>0.5</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 2: SHOOTING PERCENTAGE */}
            <div className="my-1">
              <div className="text-[10px] font-condensed font-bold text-[#0c3975] tracking-wider uppercase border-b border-[#0c3975]/20 pb-0.5 mb-1">
                SHOOTING PERCENTAGE
              </div>
              <div className="grid grid-cols-3 text-center border border-[#0c3975]/25 rounded-[2px] divide-x divide-[#0c3975]/15 text-[9.5px] font-mono-code">
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">FG</div>
                  <div className="font-black text-[#0c3975]">58.3%</div>
                </div>
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">3P</div>
                  <div className="font-black text-[#0c3975]">38.7%</div>
                </div>
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">FT</div>
                  <div className="font-black text-[#0c3975]">88.2%</div>
                </div>
              </div>
            </div>

            {/* Section 3: ADVANCED METRICS */}
            <div className="my-1">
              <div className="text-[10px] font-condensed font-bold text-[#0c3975] tracking-wider uppercase border-b border-[#0c3975]/20 pb-0.5 mb-1">
                ADVANCED METRICS
              </div>
              <div className="grid grid-cols-4 text-center border border-[#0c3975]/25 rounded-[2px] divide-x divide-[#0c3975]/15 text-[9.5px] font-mono-code">
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">PER</div>
                  <div className="font-black text-[#0c3975]">28.6</div>
                </div>
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">TS%</div>
                  <div className="font-black text-[#0c3975]">63.4%</div>
                </div>
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">USG%</div>
                  <div className="font-black text-[#0c3975]">32.8%</div>
                </div>
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">BPM</div>
                  <div className="font-black text-[#b91c1c]">+8.7</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ROW 2: PERFORMANCE GRAPHS (POINTS/REB/AST, EFFICIENCY, SHOT CHART)     */}
      {/* Pure beige paper background - NO white card layer                         */}
      {/* ========================================================================= */}
      <section className="relative z-10 site-container mt-4">
        <div className="border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden">
          
          {/* Red Header Bar */}
          <div className="bg-[#b91c1c] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 flex items-center gap-1.5">
            <Flame size={14} className="text-yellow-300" />
            <span>PERFORMANCE GRAPHS</span>
          </div>

          {/* 3 Panels Grid directly on beige */}
          <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[#0c3975]/25">
            
            {/* PANEL 1: POINTS, REBOUNDS & ASSISTS (Multi-Bar Chart) */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <h3 className="font-slab text-base text-[#0c3975] uppercase tracking-tight">
                  POINTS, REBOUNDS & ASSISTS
                </h3>

                {/* Legend */}
                <div className="flex items-center gap-3 mt-1.5 text-[10.5px] font-mono-code font-bold">
                  <span className="flex items-center gap-1 text-[#0c3975]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0c3975]" /> PTS
                  </span>
                  <span className="flex items-center gap-1 text-[#0284c7]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" /> REB
                  </span>
                  <span className="flex items-center gap-1 text-[#b91c1c]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#b91c1c]" /> AST
                  </span>
                </div>
              </div>

              {/* Bar Chart Visualization directly on beige */}
              <div className="mt-4 pt-2">
                <div className="h-44 flex items-end justify-between gap-2 border-b border-l border-[#0c3975]/40 pb-1 pl-2 relative">
                  
                  {/* Y-Axis Grid Lines & Labels */}
                  <div className="absolute left-0 inset-y-0 -translate-x-full pr-1.5 flex flex-col justify-between text-[9px] font-mono-code text-slate-600">
                    <span>40</span>
                    <span>30</span>
                    <span>20</span>
                    <span>10</span>
                    <span>0</span>
                  </div>

                  <div className="absolute inset-x-0 top-1/4 border-b border-[#0c3975]/10 pointer-events-none" />
                  <div className="absolute inset-x-0 top-2/4 border-b border-[#0c3975]/10 pointer-events-none" />
                  <div className="absolute inset-x-0 top-3/4 border-b border-[#0c3975]/10 pointer-events-none" />

                  {/* 5 Season Columns */}
                  {seasonStatsData.map((item) => (
                    <div 
                      key={item.season}
                      className="flex-1 flex flex-col items-center group cursor-pointer"
                      onMouseEnter={() => setHoveredBar(`PTS: ${item.pts} | REB: ${item.reb} | AST: ${item.ast}`)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Bar Group */}
                      <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-36">
                        {/* PTS Bar */}
                        <div 
                          style={{ height: `${(item.pts / 40) * 100}%` }}
                          className="w-2.5 sm:w-3.5 bg-[#0c3975] rounded-t-[1px] group-hover:brightness-110 transition-all shadow-xs"
                          title={`PTS: ${item.pts}`}
                        />
                        {/* REB Bar */}
                        <div 
                          style={{ height: `${(item.reb / 40) * 100}%` }}
                          className="w-2 sm:w-2.5 bg-[#0284c7] rounded-t-[1px] group-hover:brightness-110 transition-all shadow-xs"
                          title={`REB: ${item.reb}`}
                        />
                        {/* AST Bar */}
                        <div 
                          style={{ height: `${(item.ast / 40) * 100}%` }}
                          className="w-2 sm:w-2.5 bg-[#b91c1c] rounded-t-[1px] group-hover:brightness-110 transition-all shadow-xs"
                          title={`AST: ${item.ast}`}
                        />
                      </div>
                      
                      {/* Season Label */}
                      <span className="text-[9.5px] font-mono-code text-slate-800 mt-1 font-bold">
                        {item.season}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tooltip display */}
                <div className="h-4 text-center mt-1 text-[10px] font-mono-code font-bold text-[#0c3975]">
                  {hoveredBar || 'Pasa el ratón por las barras para ver detalle'}
                </div>
              </div>
            </div>

            {/* PANEL 2: EFFICIENCY METRICS (Trendline SVG Graph) */}
            <div className="lg:col-span-4 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
              <div>
                <h3 className="font-slab text-base text-[#0c3975] uppercase tracking-tight">
                  EFFICIENCY METRICS
                </h3>

                {/* Legend */}
                <div className="flex items-center gap-3 mt-1.5 text-[10.5px] font-mono-code font-bold">
                  <span className="flex items-center gap-1 text-[#0284c7]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" /> TS%
                  </span>
                  <span className="flex items-center gap-1 text-[#b91c1c]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#b91c1c]" /> USG%
                  </span>
                </div>
              </div>

              {/* Trendline Graph directly on beige */}
              <div className="mt-4 pt-2">
                <div className="h-44 border-b border-l border-[#0c3975]/40 relative pb-1 pl-2">
                  
                  {/* Y-Axis percentage scale */}
                  <div className="absolute left-0 inset-y-0 -translate-x-full pr-1.5 flex flex-col justify-between text-[9px] font-mono-code text-slate-600">
                    <span>80%</span>
                    <span>60%</span>
                    <span>40%</span>
                    <span>20%</span>
                  </div>

                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 top-0 border-b border-[#0c3975]/10" />
                  <div className="absolute inset-x-0 top-1/3 border-b border-[#0c3975]/10" />
                  <div className="absolute inset-x-0 top-2/3 border-b border-[#0c3975]/10" />

                  {/* SVG Lines */}
                  <svg className="w-full h-36 overflow-visible" viewBox="0 0 240 100" preserveAspectRatio="none">
                    {/* TS% Line (Blue) */}
                    <path
                      d="M 20 40 L 70 38 L 120 42 L 170 30 L 220 22"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                    />
                    {/* TS% Points */}
                    <circle cx="20" cy="40" r="3.5" fill="#0284c7" />
                    <circle cx="70" cy="38" r="3.5" fill="#0284c7" />
                    <circle cx="120" cy="42" r="3.5" fill="#0284c7" />
                    <circle cx="170" cy="30" r="3.5" fill="#0284c7" />
                    <circle cx="220" cy="22" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />

                    {/* USG% Line (Red) */}
                    <path
                      d="M 20 62 L 70 65 L 120 60 L 170 58 L 220 50"
                      fill="none"
                      stroke="#b91c1c"
                      strokeWidth="2.5"
                    />
                    {/* USG% Points */}
                    <circle cx="20" cy="62" r="3.5" fill="#b91c1c" />
                    <circle cx="70" cy="65" r="3.5" fill="#b91c1c" />
                    <circle cx="120" cy="60" r="3.5" fill="#b91c1c" />
                    <circle cx="170" cy="58" r="3.5" fill="#b91c1c" />
                    <circle cx="220" cy="50" r="4" fill="#b91c1c" stroke="#ffffff" strokeWidth="1" />
                  </svg>

                  {/* X-Axis Seasons */}
                  <div className="flex justify-between text-[9.5px] font-mono-code text-slate-800 font-bold px-2 mt-1">
                    <span>19-20</span>
                    <span>20-21</span>
                    <span>21-22</span>
                    <span>22-23</span>
                    <span>23-24</span>
                  </div>

                </div>

                <div className="h-4 text-center mt-1 text-[10px] font-mono-code text-slate-600">
                  Progreso de TS% (+3.2%) y USG% en 5 temporadas
                </div>
              </div>
            </div>

            {/* PANEL 3: SHOT CHART (2023-24) Half-Court Visualizer */}
            <div className="lg:col-span-4 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="font-slab text-base text-[#0c3975] uppercase tracking-tight">
                  SHOT CHART <span className="text-xs font-mono-code text-slate-600">(2023-24)</span>
                </h3>

                {/* Legend */}
                <div className="flex items-center gap-2.5 text-[10.5px] font-mono-code font-bold">
                  <span className="flex items-center gap-1 text-[#0284c7]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" /> Made
                  </span>
                  <span className="flex items-center gap-1 text-[#b91c1c]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#b91c1c]" /> Missed
                  </span>
                </div>
              </div>

              {/* Shot Court + Stats Breakdown Row */}
              <div className="mt-3 flex items-center gap-4">
                
                {/* Half Court Visualizer */}
                <div className="relative w-44 sm:w-48 aspect-[1/1] bg-[#1a4a82] rounded-[3px] border-2 border-[#0c3975] overflow-hidden p-1 shadow-inner">
                  {/* SVG Court Lines */}
                  <svg viewBox="0 0 100 100" className="w-full h-full stroke-white/60 fill-none stroke-[1.2]">
                    {/* Baseline */}
                    <line x1="5" y1="95" x2="95" y2="95" strokeWidth="2" />
                    {/* Rim & Backboard */}
                    <line x1="42" y1="90" x2="58" y2="90" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="50" cy="86" r="4.5" stroke="#f59e0b" strokeWidth="1.5" />
                    {/* Restricted Area */}
                    <path d="M 44 90 A 6 6 0 0 1 56 90" strokeDasharray="2 2" />
                    {/* Key / Paint */}
                    <rect x="36" y="55" width="28" height="40" strokeWidth="1.5" />
                    {/* Free Throw Circle */}
                    <circle cx="50" cy="55" r="14" strokeWidth="1.5" />
                    {/* 3-Point Arc */}
                    <line x1="14" y1="95" x2="14" y2="70" />
                    <line x1="86" y1="95" x2="86" y2="70" />
                    <path d="M 14 70 A 42 42 0 0 1 86 70" strokeWidth="1.5" />
                  </svg>

                  {/* Render Shot Dots */}
                  {shotChartDots.map((pt, idx) => (
                    <div
                      key={idx}
                      style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                      className={`absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-xs transition-transform hover:scale-200 cursor-pointer ${
                        pt.made ? 'bg-[#38bdf8] ring-1 ring-white/60' : 'bg-[#ef4444]'
                      }`}
                      title={`${pt.z}: ${pt.made ? 'Anotado' : 'Fallado'}`}
                    />
                  ))}
                </div>

                {/* Right Breakdown Metrics directly on beige */}
                <div className="flex-1 flex flex-col justify-around h-44 py-2 border-l border-[#0c3975]/20 pl-3">
                  <div>
                    <span className="text-[10px] font-condensed font-bold text-slate-600 uppercase tracking-wider block">
                      AT RIM
                    </span>
                    <span className="font-slab text-xl text-[#0c3975] leading-none block">
                      62.3%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-condensed font-bold text-slate-600 uppercase tracking-wider block">
                      MID RANGE
                    </span>
                    <span className="font-slab text-xl text-[#0c3975] leading-none block">
                      42.1%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-condensed font-bold text-slate-600 uppercase tracking-wider block">
                      3PT
                    </span>
                    <span className="font-slab text-xl text-[#0c3975] leading-none block">
                      38.7%
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ROW 3: ADVANCED ANALYTICS (PIE, TS%, USG%, BPM + SCOUT QUOTE)          */}
      {/* Pure beige paper background - NO white card layer                         */}
      {/* ========================================================================= */}
      <section className="relative z-10 site-container mt-4">
        <div className="border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden">
          
          {/* Navy Header Bar */}
          <div className="bg-[#0c3975] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 flex items-center gap-1.5">
            <span className="text-[#c02328]">★</span>
            <span>ADVANCED ANALYTICS</span>
          </div>

          <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* LEFT: 4 Metric Columns directly on beige */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 divide-x divide-[#0c3975]/20">
              
              {/* Metric 1: PIE */}
              <div className="px-2 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1.5 text-[#0c3975] font-condensed font-bold text-xs uppercase">
                  <Clock size={14} className="text-[#0c3975]" />
                  <span>PIE</span>
                </div>
                <span className="font-slab text-3xl text-[#0c3975] my-1.5 block leading-none">
                  28.6
                </span>
                <span className="text-[9.5px] font-mono-code text-slate-700 block leading-tight uppercase font-medium">
                  PLAYER EFFICIENCY RATING
                </span>
              </div>

              {/* Metric 2: TS% */}
              <div className="px-2 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1.5 text-[#0c3975] font-condensed font-bold text-xs uppercase">
                  <Target size={14} className="text-[#0c3975]" />
                  <span>TS%</span>
                </div>
                <span className="font-slab text-3xl text-[#0c3975] my-1.5 block leading-none">
                  63.4%
                </span>
                <span className="text-[9.5px] font-mono-code text-slate-700 block leading-tight uppercase font-medium">
                  TRUE SHOOTING PERCENTAGE
                </span>
              </div>

              {/* Metric 3: USG% */}
              <div className="px-2 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1.5 text-[#0c3975] font-condensed font-bold text-xs uppercase">
                  <Activity size={14} className="text-[#0c3975]" />
                  <span>USG%</span>
                </div>
                <span className="font-slab text-3xl text-[#0c3975] my-1.5 block leading-none">
                  32.8%
                </span>
                <span className="text-[9.5px] font-mono-code text-slate-700 block leading-tight uppercase font-medium">
                  USAGE PERCENTAGE
                </span>
              </div>

              {/* Metric 4: BPM */}
              <div className="px-2 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1.5 text-[#b91c1c] font-condensed font-bold text-xs uppercase">
                  <BarChart3 size={14} className="text-[#b91c1c]" />
                  <span>BPM</span>
                </div>
                <span className="font-slab text-3xl text-[#b91c1c] my-1.5 block leading-none">
                  +8.7
                </span>
                <span className="text-[9.5px] font-mono-code text-slate-700 block leading-tight uppercase font-medium">
                  BOX PLUS/MINUS
                </span>
              </div>

            </div>

            {/* RIGHT: Analyst Quote directly on beige */}
            <div className="lg:col-span-5 p-3 border-l lg:border-l border-[#0c3975]/25 relative">
              <div className="flex items-start gap-3">
                <span className="text-4xl text-[#b91c1c] font-serif leading-none select-none">“</span>
                <div className="leading-relaxed">
                  <p className="text-xs sm:text-[13px] font-mono-code text-slate-800 font-medium italic">
                    Luka Dončić is a unique blend of skill, size and basketball IQ. He changes the game on both ends of the floor.
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-condensed font-bold text-[#0c3975] uppercase tracking-wider block">
                      — BASKETDATA ANALYTICS
                    </span>
                    {/* Crown doodle */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[#0c3975] fill-none stroke-2">
                      <path d="M 2 18 L 4 6 L 9 12 L 12 4 L 15 12 L 20 6 L 22 18 Z" />
                      <line x1="2" y1="20" x2="22" y2="20" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. ROW 4: 3-COLUMN BOTTOM PANELS (LAST 5 GAMES, COMPARISONS, NEWS)        */}
      {/* Pure beige paper background - NO white card layer                         */}
      {/* ========================================================================= */}
      <section className="relative z-10 site-container mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* COLUMN 1: LAST 5 GAMES */}
          <div className="lg:col-span-4 border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden flex flex-col justify-between">
            
            <div className="bg-[#0c3975] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 flex items-center gap-1.5">
              <span className="text-[#c02328]">★</span>
              <span>LAST 5 GAMES</span>
            </div>

            <div className="p-3.5 flex flex-col justify-between flex-1">
              <table className="w-full text-center text-xs font-mono-code border-collapse">
                <thead>
                  <tr className="text-[10px] text-slate-600 font-bold border-b border-[#0c3975]/20 uppercase">
                    <th className="py-1 text-left">DATE</th>
                    <th>OPPONENT</th>
                    <th>PTS</th>
                    <th>REB</th>
                    <th>AST</th>
                    <th>MIN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0c3975]/15">
                  {recentGames.map((g, idx) => (
                    <tr key={idx} className="hover:bg-black/5 transition-colors">
                      <td className="py-1.5 text-left font-bold text-slate-800">{g.date}</td>
                      <td className="font-bold text-[#0c3975]">{g.opp}</td>
                      <td className="font-bold text-[#b91c1c]">{g.pts}</td>
                      <td>{g.reb}</td>
                      <td>{g.ast}</td>
                      <td className="text-slate-600">{g.min}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={() => {
                  playRetroSound('click');
                  setIsGameLogModalOpen(true);
                }}
                className="mt-4 w-full bg-[#0c3975] hover:bg-[#124b94] text-white py-1.5 px-3 text-xs font-condensed font-bold uppercase tracking-wider text-center rounded-[2px] border border-black/20 cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>VIEW FULL GAME LOG</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* COLUMN 2: PLAYER COMPARISONS (PTS PER GAME) */}
          <div className="lg:col-span-4 border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden flex flex-col justify-between">
            
            <div className="bg-[#0c3975] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 flex items-center gap-1.5">
              <span className="text-[#c02328]">★</span>
              <span>PLAYER COMPARISONS</span>
            </div>

            <div className="p-3.5 flex flex-col justify-between flex-1">
              <div>
                <span className="text-[11px] font-mono-code text-slate-700 block">
                  How Luka Dončić compares to other elite players
                </span>

                {/* Comparative Bars directly on beige */}
                <div className="mt-3 space-y-2.5 font-mono-code text-xs">
                  
                  {/* Luka Dončić (Highlighted) */}
                  <div>
                    <div className="flex justify-between font-bold text-[11px] mb-0.5">
                      <span className="text-[#0c3975] font-slab">L. DONČIĆ</span>
                      <span className="text-[#0c3975]">28.7</span>
                    </div>
                    <div className="w-full bg-[#0c3975]/15 h-3 rounded-[1px] overflow-hidden">
                      <div className="bg-[#0c3975] h-full" style={{ width: '82%' }} />
                    </div>
                  </div>

                  {/* Joel Embiid */}
                  <div>
                    <div className="flex justify-between font-medium text-[11px] mb-0.5">
                      <span className="text-slate-700">J. EMBIID</span>
                      <span className="text-slate-900">28.5</span>
                    </div>
                    <div className="w-full bg-[#0c3975]/15 h-3 rounded-[1px] overflow-hidden">
                      <div className="bg-[#0284c7] h-full" style={{ width: '81%' }} />
                    </div>
                  </div>

                  {/* SGA */}
                  <div>
                    <div className="flex justify-between font-medium text-[11px] mb-0.5">
                      <span className="text-slate-700">S. GILGEOUS-ALEXANDER</span>
                      <span className="text-slate-900">31.2</span>
                    </div>
                    <div className="w-full bg-[#0c3975]/15 h-3 rounded-[1px] overflow-hidden">
                      <div className="bg-[#0284c7] h-full" style={{ width: '89%' }} />
                    </div>
                  </div>

                  {/* Jokić */}
                  <div>
                    <div className="flex justify-between font-medium text-[11px] mb-0.5">
                      <span className="text-slate-700">N. JOKIĆ</span>
                      <span className="text-slate-900">26.4</span>
                    </div>
                    <div className="w-full bg-[#0c3975]/15 h-3 rounded-[1px] overflow-hidden">
                      <div className="bg-[#0284c7] h-full" style={{ width: '75%' }} />
                    </div>
                  </div>

                  {/* LeBron James */}
                  <div>
                    <div className="flex justify-between font-medium text-[11px] mb-0.5">
                      <span className="text-slate-700">L. JAMES</span>
                      <span className="text-slate-900">25.8</span>
                    </div>
                    <div className="w-full bg-[#0c3975]/15 h-3 rounded-[1px] overflow-hidden">
                      <div className="bg-[#0284c7] h-full" style={{ width: '73%' }} />
                    </div>
                  </div>

                </div>
              </div>

              <div className="text-right mt-3 pt-2 border-t border-[#0c3975]/20">
                <span className="text-[10px] font-condensed font-bold text-slate-600 uppercase tracking-wider">
                  PTS PER GAME
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 3: RECENT NEWS & INSIGHTS */}
          <div className="lg:col-span-4 border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden flex flex-col justify-between">
            
            <div className="bg-[#0c3975] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 flex items-center gap-1.5">
              <span className="text-[#c02328]">★</span>
              <span>RECENT NEWS & INSIGHTS</span>
            </div>

            <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
              
              {/* News Item 1 */}
              <div 
                onClick={() => onShowToast('Noticia: Actuación histórica de 50 puntos de Luka')}
                className="flex gap-2.5 items-start cursor-pointer group hover:bg-black/5 p-1 rounded transition-colors"
              >
                <div className="w-14 h-14 rounded-xs overflow-hidden border border-[#0c3975]/30 shrink-0 bg-slate-900">
                  <img src="/src/assets/images/vintage_hoops_card_star_1790618421190.jpg" alt="Luka" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="leading-tight">
                  <h4 className="font-slab text-xs text-[#0c3975] group-hover:text-[#c02328] transition-colors leading-snug">
                    Luka Dončić's historic 50-point performance
                  </h4>
                  <span className="text-[9.5px] font-mono-code text-slate-600 block mt-0.5">Apr 10, 2024</span>
                  <p className="text-[10px] font-mono-code text-slate-700 line-clamp-2 mt-0.5">
                    Dončić puts on a show with 50 points, 10 rebounds and 12 assists in a thriller...
                  </p>
                </div>
              </div>

              {/* News Item 2 */}
              <div 
                onClick={() => onShowToast('Noticia: Mavericks en carrera a playoffs')}
                className="flex gap-2.5 items-start cursor-pointer group hover:bg-black/5 p-1 rounded transition-colors"
              >
                <div className="w-14 h-14 rounded-xs overflow-hidden border border-[#0c3975]/30 shrink-0 bg-slate-900">
                  <img src="/src/assets/images/vintage_hoops_card_star_1790618421190.jpg" alt="Luka" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="leading-tight">
                  <h4 className="font-slab text-xs text-[#0c3975] group-hover:text-[#c02328] transition-colors leading-snug">
                    Mavericks keep playoff hopes alive
                  </h4>
                  <span className="text-[9.5px] font-mono-code text-slate-600 block mt-0.5">Apr 6, 2024</span>
                  <p className="text-[10px] font-mono-code text-slate-700 line-clamp-2 mt-0.5">
                    Dallas secures crucial win behind another stellar performance from their franchise player...
                  </p>
                </div>
              </div>

              {/* News Item 3 */}
              <div 
                onClick={() => onShowToast('Noticia: Legado de Dončić en Dallas')}
                className="flex gap-2.5 items-start cursor-pointer group hover:bg-black/5 p-1 rounded transition-colors"
              >
                <div className="w-14 h-14 rounded-xs overflow-hidden border border-[#0c3975]/30 shrink-0 bg-slate-900">
                  <img src="/src/assets/images/vintage_hoops_card_star_1790618421190.jpg" alt="Luka" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="leading-tight">
                  <h4 className="font-slab text-xs text-[#0c3975] group-hover:text-[#c02328] transition-colors leading-snug">
                    The next chapter: Dončić's legacy in Dallas
                  </h4>
                  <span className="text-[9.5px] font-mono-code text-slate-600 block mt-0.5">Apr 2, 2024</span>
                  <p className="text-[10px] font-mono-code text-slate-700 line-clamp-2 mt-0.5">
                    How Luka is shaping the future of the Mavericks franchise with unprecedented numbers...
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BOTTOM FOOTER BANNER: MORE DATA. DEEPER INSIGHTS.                      */}
      {/* ========================================================================= */}
      <section className="relative z-10 site-container mt-6">
        <div className="fondoazul-solid rounded-[6px] border-none outline-none ring-0 px-4 sm:px-8 py-3.5 shadow-lg relative overflow-hidden text-white flex items-center justify-between flex-wrap gap-4">
          
          {/* Left: Chalk Basketball diagram + Headline */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white/60 flex items-center justify-center p-1 bg-white/10 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none stroke-[3.5]">
                <circle cx="50" cy="50" r="45" />
                <line x1="5" y1="50" x2="95" y2="50" />
                <line x1="50" y1="5" x2="50" y2="95" />
                <path d="M 20 12 Q 35 50 20 88" />
                <path d="M 80 12 Q 65 50 80 88" />
              </svg>
            </div>

            <span className="chalk-text-italic text-white text-xl sm:text-2xl md:text-[27px] uppercase tracking-wider block">
              MORE DATA. DEEPER INSIGHTS.
            </span>
          </div>

          {/* Right: START ANALYZING button + Chalk Crown Doodle */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <button
              onClick={() => {
                playRetroSound('burst');
                onShowToast('START ANALYZING: Deep Player Analytics Engine');
              }}
              className="comic-interactive-card relative bg-[#0c3975] hover:bg-[#124b94] text-white font-condensed font-bold text-xs sm:text-[13px] tracking-wider uppercase px-5 py-2 rounded-[4px] border-2 border-white shadow-[0_0_0_2px_#0c3975] cursor-pointer"
            >
              START ANALYZING
            </button>

            {/* Chalk Crown Doodle */}
            <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-white fill-none stroke-2 opacity-85">
              <path d="M 2 18 L 4 6 L 9 12 L 12 4 L 15 12 L 20 6 L 22 18 Z" />
              <line x1="2" y1="20" x2="22" y2="20" strokeWidth="2" />
            </svg>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. MODAL: FULL GAME LOG                                                   */}
      {/* ========================================================================= */}
      {isGameLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#ede7dc] border-3 border-[#0c3975] rounded-[4px] shadow-2xl max-w-2xl w-full p-5 relative max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b-2 border-[#0c3975]/20 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[#c02328] font-black text-lg">★</span>
                <h3 className="font-slab text-xl text-[#0c3975] uppercase">
                  LUKA DONČIĆ - TEMPORADA 2023-24 (GAME LOG)
                </h3>
              </div>
              <button 
                onClick={() => setIsGameLogModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#0c3975]/10 hover:bg-[#c02328] hover:text-white flex items-center justify-center cursor-pointer transition-colors font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <table className="w-full text-center text-xs font-mono-code border-collapse">
              <thead>
                <tr className="bg-[#0c3975] text-white font-condensed uppercase tracking-wider py-1.5 text-xs">
                  <th className="py-1.5 text-left pl-2">FECHA</th>
                  <th>RIVAL</th>
                  <th>RESULTADO</th>
                  <th>MIN</th>
                  <th>PTS</th>
                  <th>REB</th>
                  <th>AST</th>
                  <th>FG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0c3975]/15">
                {recentGames.map((g, idx) => (
                  <tr key={idx} className="hover:bg-black/5 transition-colors py-1">
                    <td className="py-2 text-left pl-2 font-bold">{g.date}</td>
                    <td className="font-bold text-[#0c3975]">{g.opp}</td>
                    <td className="font-bold">{g.result}</td>
                    <td>{g.min}</td>
                    <td className="font-black text-[#b91c1c] text-sm">{g.pts}</td>
                    <td>{g.reb}</td>
                    <td>{g.ast}</td>
                    <td>{g.fg}</td>
                  </tr>
                ))}
                <tr className="hover:bg-black/5 transition-colors py-1">
                  <td className="py-2 text-left pl-2 font-bold">Apr 2</td>
                  <td className="font-bold text-[#0c3975]">@ GSW</td>
                  <td className="font-bold">L 100-104</td>
                  <td>39</td>
                  <td className="font-black text-[#b91c1c] text-sm">30</td>
                  <td>12</td>
                  <td>11</td>
                  <td>11/22</td>
                </tr>
                <tr className="hover:bg-black/5 transition-colors py-1">
                  <td className="py-2 text-left pl-2 font-bold">Mar 31</td>
                  <td className="font-bold text-[#0c3975]">@ HOU</td>
                  <td className="font-bold">W 125-107</td>
                  <td>35</td>
                  <td className="font-black text-[#b91c1c] text-sm">47</td>
                  <td>12</td>
                  <td>7</td>
                  <td>18/30</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsGameLogModalOpen(false)}
                className="bg-[#0c3975] text-white px-5 py-1.5 font-condensed font-bold uppercase text-xs rounded-[2px] tracking-wider cursor-pointer"
              >
                CERRAR
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
