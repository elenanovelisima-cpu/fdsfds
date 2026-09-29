import React, { useState } from 'react';
import { 
  BarChart3,
  PieChart,
  Users,
  Trophy,
  Search,
  ChevronDown,
  Download,
  Calendar, 
  CheckCircle2, 
  Star, 
  ChevronRight, 
  Sparkles, 
  X, 
  ArrowRight,
  Flame,
  Shield,
  Clock,
  Menu,
  RefreshCw
} from 'lucide-react';
import { 
  NBA_STAR_CARDS,
  DetailedBasketballCard
} from '../data/waxPackData';
import { playRetroSound } from '../utils/audio';
import { TutorialsSection } from './TutorialsSection';
import { ProToolsSection } from './ProToolsSection';
import { HowItWorksLandingSection } from './HowItWorksLandingSection';
import { SiteFooter } from './SiteFooter';
import { homeContent } from '../data/homeContent';
import { RegisterModal, LoginModal } from './AuthModals';
import { useAuth } from '../context/AuthContext';
import { SupabasePlayerModal } from './SupabasePlayerModal';
import { searchSupabasePlayers, SupabasePlayerItem } from '../lib/supabaseAdmin';

interface WaxPackClubPageProps {
  onShowToast: (msg: string) => void;
  onOpenPlayerProfile?: (playerId?: string) => void;
  onOpenAdminPanel?: () => void;
}

export const WaxPackClubPage: React.FC<WaxPackClubPageProps> = ({
  onShowToast,
  onOpenPlayerProfile,
  onOpenAdminPanel,
}) => {
  const { currentUser, logout } = useAuth();
  const [selectedCard, setSelectedCard] = useState<DetailedBasketballCard | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isRipPackOpen, setIsRipPackOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [stackCardIndex, setStackCardIndex] = useState(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 7 days');
  const [heroDesignMode, setHeroDesignMode] = useState<'cards' | 'hero2'>('hero2');
  
  // Supabase Player Modal & Checklist Search State
  const [selectedSupabasePlayerId, setSelectedSupabasePlayerId] = useState<string | null>(null);
  const [checklistTab, setChecklistTab] = useState<'supabase' | 'nba'>('supabase');
  const [supabaseSearchQuery, setSupabaseSearchQuery] = useState('');
  const [supabasePlayersList, setSupabasePlayersList] = useState<SupabasePlayerItem[]>([]);
  const [isSearchingSupabase, setIsSearchingSupabase] = useState(false);

  // Search Supabase players when checklist modal opens or query changes
  React.useEffect(() => {
    if (isChecklistModalOpen && checklistTab === 'supabase') {
      setIsSearchingSupabase(true);
      const timer = setTimeout(async () => {
        const results = await searchSupabasePlayers(supabaseSearchQuery, undefined, 20);
        setSupabasePlayersList(results);
        setIsSearchingSupabase(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isChecklistModalOpen, checklistTab, supabaseSearchQuery]);

  const currentNbaCard = NBA_STAR_CARDS[stackCardIndex % NBA_STAR_CARDS.length];

  const handleNextNbaCard = () => {
    playRetroSound('card');
    const nextIdx = (stackCardIndex + 1) % NBA_STAR_CARDS.length;
    setStackCardIndex(nextIdx);
    const card = NBA_STAR_CARDS[nextIdx];
    onShowToast(`Switched to ${card.name} (${card.number} · ${card.teamShort})!`);
  };

  const handleRipPack = () => {
    playRetroSound('rip');
    onShowToast('Wax pack unwrapped! Added 9 basketball cards to your analytics collection.');
  };

  return (
    <div className="min-h-screen bg-[#ede7dc] text-[#0e3a73] relative select-none font-sans pb-0">
      {/* CAPA EXACTA DEL FONDO CON LA TEXTURA */}
      <div className="absolute inset-0 pointer-events-none opacity-25 texture-paper-pulp z-0" />

      {/* 1. TOP HEADER BAR (EXACT MATCH TO SCREENSHOT) */}
      <header className="relative z-10 border-b-[1.5px] border-[#c02328] bg-[#ede7dc] px-4 sm:px-8 py-2.5 select-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {/* Same paper pulp texture integrated directly in the header */}
        <div className="absolute inset-0 pointer-events-none opacity-25 texture-paper-pulp z-0" />

        <div className="relative z-10 site-container flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Mobile 3-Lines Button (Subtle, No Box) + Brand Logo & Typography */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Subtle 3-Lines Button (Mobile Only, Just 3 Clean Lines) */}
            <button
              onClick={() => {
                playRetroSound('click');
                setIsMobileMenuOpen(true);
              }}
              className="md:hidden p-1.5 -ml-1 text-[#0e3a73] hover:text-[#c02328] transition-colors cursor-pointer flex flex-col justify-center items-center gap-[4.5px] focus:outline-none group"
              aria-label="Abrir menú"
            >
              <span className="w-5 h-[2px] bg-[#0e3a73] group-hover:bg-[#c02328] rounded-full block transition-colors" />
              <span className="w-5 h-[2px] bg-[#0e3a73] group-hover:bg-[#c02328] rounded-full block transition-colors" />
              <span className="w-5 h-[2px] bg-[#0e3a73] group-hover:bg-[#c02328] rounded-full block transition-colors" />
            </button>

            {/* Brand Logo & Typography */}
            <div 
              onClick={() => {
                playRetroSound('burst');
                onShowToast('BASKETDATA: Real Basketball Data Engine');
              }}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
            >
              {/* Simple icon.png icon, no square box, matching height of BASKETDATA */}
              <img 
                src="/assets/images/icon.png" 
                alt="BASKETDATA" 
                className="w-[36px] h-[40px] sm:w-[41px] sm:h-[46px] object-contain shrink-0 group-hover:scale-105 transition-transform"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/icon.png')) {
                    target.src = '/icon.png';
                  }
                }}
              />

              {/* Typography: BASKETDATA / ★ ANALYTICS ★ */}
              <div className="leading-none">
                <span className="font-slab text-xl sm:text-[25px] md:text-[27px] text-[#0e3a73] tracking-wide uppercase block font-black">
                  {homeContent.header.brandName}
                </span>
                <span 
                  className="font-condensed text-[12px] sm:text-[14px] text-[#0e3a73] font-bold tracking-[0.2em] sm:tracking-[0.28em] uppercase block mt-0.5 text-center w-auto max-w-[210.325px]"
                >
                  ★ {homeContent.header.brandSubtitle} ★
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Links - Desktop only */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-10 text-[15px] sm:text-[16px] font-condensed tracking-wider text-[#0e3a73]">
            {homeContent.header.navLinks.map((link, idx) => (
              <button
                key={link.label}
                onClick={() => {
                  playRetroSound('click');
                  if (idx === 0) {
                    const el = document.getElementById('how-it-works');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else if (idx === 1) {
                    setIsChecklistModalOpen(true);
                  } else if (idx === 2) {
                    setIsJoinModalOpen(true);
                  } else {
                    onShowToast(`${link.label}: Real basketball telemetry & insights.`);
                  }
                }}
                className="hover:text-[#c02328] transition-colors cursor-pointer font-bold uppercase tracking-wide"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action: START ANALYZING & SIGN IN */}
          <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6">
            {!currentUser && (
              <button
                onClick={() => {
                  playRetroSound('burst');
                  setIsJoinModalOpen(true);
                }}
                className="comic-interactive-card relative bg-[#0c356a] hover:bg-[#124b94] text-white font-condensed font-bold text-[13px] sm:text-[14px] md:text-[15px] tracking-wider uppercase px-3 sm:px-5 py-1.5 rounded-[5px] border-[1.5px] border-white shadow-[0_0_0_1.5px_#0c356a] cursor-pointer"
              >
                {homeContent.header.ctaButton}
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Conectado indicator */}
                <div className="flex items-center gap-1.5 bg-[#0b6645]/10 border border-[#0b6645]/30 text-[#0b6645] px-2.5 py-1 rounded-[4px] font-mono-code text-xs font-bold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#0b6645] animate-pulse"></span>
                  <span className="uppercase tracking-wider">CONECTADO</span>
                  <span className="text-slate-600 font-normal hidden lg:inline max-w-[130px] truncate">({currentUser.email})</span>
                </div>

                {/* If admin, button to Admin Panel */}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      playRetroSound('burst');
                      if (onOpenAdminPanel) onOpenAdminPanel();
                    }}
                    className="bg-[#c02328] hover:bg-[#991b1b] text-white px-2.5 py-1 rounded-[3px] text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                    title="Acceder al Panel de Control de Administrador"
                  >
                    <span>★ PANEL ADMIN</span>
                  </button>
                )}

                {/* Salir */}
                <button
                  onClick={async () => {
                    playRetroSound('click');
                    await logout();
                    onShowToast('Sesión cerrada.');
                  }}
                  className="text-xs font-condensed font-bold text-slate-500 hover:text-[#c02328] uppercase tracking-wider cursor-pointer"
                  title="Cerrar sesión"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  playRetroSound('click');
                  setIsLoginModalOpen(true);
                }}
                className="hidden md:inline-block font-condensed text-[15px] sm:text-[16px] font-bold text-[#0e3a73] hover:text-[#c02328] uppercase tracking-wider cursor-pointer"
              >
                {homeContent.header.signInButton}
              </button>
            )}
          </div>

        </div>
      </header>

      {/* MOBILE LATERAL DRAWER MENU (SUPERIOR LATERAL DESPLEGABLE DESDE LA IZQUIERDA) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden select-none animate-in fade-in duration-200">
          {/* Blurred dark backdrop */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
          />

          {/* Lateral Drawer Menu panel from the left */}
          <div className="absolute top-0 left-0 w-[84%] max-w-[320px] h-full bg-[#faf7f0] border-r-4 border-[#0c3975] shadow-2xl flex flex-col justify-between p-5 z-10 overflow-y-auto animate-in slide-in-from-left duration-250">
            <div>
              {/* Drawer Top Row: Logo + Close button */}
              <div className="flex items-center justify-between border-b-2 border-[#0c3975] pb-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/assets/images/icon.png" 
                    alt="Logo" 
                    className="w-8 h-8 object-contain shrink-0"
                    onError={(e) => { e.currentTarget.src = '/icon.png'; }}
                  />
                  <div className="leading-none">
                    <span className="font-slab text-lg font-black text-[#0c3975] uppercase block">
                      {homeContent.header.brandName}
                    </span>
                    <span className="font-condensed text-[11px] font-bold text-[#c02328] uppercase tracking-wider block mt-0.5">
                      ★ {homeContent.header.brandSubtitle} ★
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playRetroSound('click');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-7 h-7 bg-white text-black font-black border border-black hover:bg-yellow-300 flex items-center justify-center rounded cursor-pointer transition-colors shadow-xs"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>

              {/* Action Buttons in Drawer */}
              <div className="space-y-2.5 mb-6">
                {!currentUser && (
                  <button
                    onClick={() => {
                      playRetroSound('burst');
                      setIsMobileMenuOpen(false);
                      setIsJoinModalOpen(true);
                    }}
                    className="w-full bg-[#0c3975] hover:bg-[#124b94] text-white py-2.5 px-4 font-slab text-xs uppercase tracking-wider rounded shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{homeContent.header.ctaButton}</span>
                    <span>→</span>
                  </button>
                )}

                {currentUser ? (
                  <div className="space-y-2 p-3 bg-emerald-50 border-2 border-[#0b6645]/30 rounded-[4px]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[#0b6645] font-mono-code font-bold text-xs uppercase">
                        <span className="w-2 h-2 rounded-full bg-[#0b6645] animate-pulse"></span>
                        CONECTADO
                      </span>
                      {currentUser.role === 'admin' && (
                        <span className="bg-[#c02328] text-white font-mono-code text-[9px] font-bold px-1.5 py-0.5 rounded">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <span className="block font-mono-code text-[11px] text-slate-700 truncate">
                      {currentUser.email}
                    </span>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          playRetroSound('burst');
                          setIsMobileMenuOpen(false);
                          if (onOpenAdminPanel) onOpenAdminPanel();
                        }}
                        className="w-full bg-[#c02328] hover:bg-[#991b1b] text-white py-1.5 px-3 rounded font-condensed font-bold text-xs uppercase flex items-center justify-center gap-1 cursor-pointer"
                      >
                        ★ IR AL PANEL ADMIN
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        playRetroSound('click');
                        setIsMobileMenuOpen(false);
                        await logout();
                        onShowToast('Sesión cerrada.');
                      }}
                      className="w-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 py-1 px-3 rounded font-mono-code text-[11px] uppercase cursor-pointer text-center block"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      playRetroSound('click');
                      setIsMobileMenuOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full bg-white hover:bg-slate-100 text-[#0c3975] border-2 border-[#0c3975] py-2 px-4 font-slab text-xs uppercase tracking-wider rounded shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{homeContent.header.signInButton}</span>
                  </button>
                )}
              </div>

              {/* Navigation Links in Drawer */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-slate-500 block mb-2 px-1">
                  SECCIONES & NAVEGACIÓN
                </span>

                {homeContent.header.navLinks.map((link, idx) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      playRetroSound('click');
                      setIsMobileMenuOpen(false);
                      if (idx === 0) {
                        const el = document.getElementById('how-it-works');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      } else if (idx === 1) {
                        setIsChecklistModalOpen(true);
                      } else if (idx === 2) {
                        setIsJoinModalOpen(true);
                      } else {
                        onShowToast(`${link.label}: Telemetría y analítica.`);
                      }
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-[4px] font-condensed font-bold text-sm tracking-wide text-[#0e3a73] hover:bg-[#0c3975]/10 hover:text-[#c02328] transition-colors flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <span className="text-xs text-slate-400">→</span>
                  </button>
                ))}

                {onOpenPlayerProfile && (
                  <button
                    onClick={() => {
                      playRetroSound('burst');
                      setIsMobileMenuOpen(false);
                      onOpenPlayerProfile();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-[4px] bg-[#c02328]/10 text-[#c02328] hover:bg-[#c02328] hover:text-white transition-all font-condensed font-bold text-sm tracking-wide flex items-center justify-between mt-3"
                  >
                    <span>★ PERFIL LUKA DONČIĆ</span>
                    <span className="text-xs">→</span>
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Bottom Info */}
            <div className="border-t border-[#0c3975]/20 pt-4 mt-6 text-center">
              <span className="font-mono-code text-[10px] text-slate-500 block">
                FEB TEMP. 26/27 • DATOS OFICIALES
              </span>
            </div>

          </div>
        </div>
      )}

      {/* 2. HERO SHOWCASE SECTION (MATCHING EXACT PROPORTIONS & STRUCTURE OF INICIO.JPG) */}
      <section className="relative z-10 site-container pt-4 sm:pt-5 pb-4 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-0">
          
          {/* LEFT COLUMN: Monumental Typography, Value Props & Boxed Features */}
          <div className="w-full lg:w-[48%] xl:w-[46%] 2xl:w-[44%] shrink-0 flex flex-col justify-start relative z-10 pr-4 sm:pr-6 lg:pr-2 pt-0">
            
            {/* Monumental 3-Line Letterpress Headline */}
            <h1 className="font-slab text-[#0b3260] leading-[0.92] uppercase tracking-normal select-text mt-0">
              <span className="block whitespace-nowrap" style={{ fontSize: 'clamp(42px, 12vw, 83px)' }}>{homeContent.hero.headline.line1}</span>
              <span className="block whitespace-nowrap" style={{ fontSize: 'clamp(42px, 12vw, 83px)' }}>{homeContent.hero.headline.line2}</span>
              <span className="block whitespace-nowrap" style={{ fontSize: 'clamp(42px, 12vw, 83px)' }}>{homeContent.hero.headline.line3}</span>
            </h1>

            {/* Red Star Tagline */}
            <div 
              className="mt-3.5 sm:mt-4 flex items-center gap-2 font-condensed font-bold tracking-wider text-[#0b3260] uppercase select-text"
              style={{ width: '607.75px', maxWidth: '100%', height: 'auto', minHeight: '28px', fontSize: 'clamp(14px, 4vw, 19.5px)' }}
            >
              <span className="text-[#c02328] text-base sm:text-lg">★</span>
              <span>{homeContent.hero.tagline}</span>
              <span className="text-[#c02328] text-base sm:text-lg">★</span>
            </div>

            {/* Paragraph Description (Typewriter / Mono Style) - constrained so it never overlaps the hero image and adds an extra line */}
            <p className="mt-3 sm:mt-3.5 text-xs sm:text-[14px] text-slate-800 font-mono-code font-medium max-w-md lg:max-w-[390px] xl:max-w-[430px] leading-relaxed select-text">
              {homeContent.hero.description}
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-5">
              <button
                onClick={() => {
                  playRetroSound('burst');
                  setIsJoinModalOpen(true);
                }}
                className="comic-interactive-card relative bg-[#0c3975] hover:bg-[#124b94] text-white font-condensed font-bold text-sm sm:text-base tracking-wider uppercase px-5 sm:px-6 py-2 rounded-[4px] border-2 border-white shadow-[0_0_0_2px_#0c3975] cursor-pointer"
              >
                {homeContent.hero.primaryButton}
              </button>

              <button
                onClick={() => {
                  playRetroSound('click');
                  if (onOpenPlayerProfile) {
                    onOpenPlayerProfile();
                  } else {
                    setIsChecklistModalOpen(true);
                  }
                }}
                className="font-condensed font-bold text-sm sm:text-base text-[#0b3260] hover:text-[#c02328] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors group"
              >
                <span className="underline underline-offset-4">{homeContent.hero.secondaryButton}</span>
                <span className="text-[#c02328] font-black text-lg group-hover:translate-x-1 transition-transform">&gt;</span>
              </button>
            </div>

            {/* 4 Feature Badges in Boxed Horizontal Bar matching inicio.jpg */}
            <div className="mt-6 sm:mt-7 border border-[#0b3260]/30 rounded-[4px] bg-[#ede7dc]/60 backdrop-blur-xs shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#0b3260]/20">
                {homeContent.hero.features.map((feat, idx) => {
                  const Icon = idx === 0 ? BarChart3 : idx === 1 ? Clock : idx === 2 ? Search : Trophy;
                  return (
                    <div 
                      key={feat.title}
                      onClick={() => onShowToast(feat.toastMessage)}
                      className="p-2 sm:p-2.5 flex items-center gap-2 hover:bg-[#0b3260]/5 cursor-pointer transition-colors"
                    >
                      <div className="w-7 h-7 rounded-xs bg-[#0b3260] text-white flex items-center justify-center shrink-0">
                        <Icon size={15} strokeWidth={2.5} />
                      </div>
                      <div className="leading-tight">
                        <span className="font-condensed font-bold text-[11px] sm:text-[11.5px] text-[#0b3260] uppercase block whitespace-nowrap">
                          {feat.title}
                        </span>
                        <span className="text-[9.5px] text-slate-700 block leading-tight">
                          {feat.subtitle}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: HERO IMAGE (Top-aligned with REAL DATA, massive scale extending under badges) */}
          <div className="w-full lg:flex-1 lg:w-[56%] xl:w-[58%] 2xl:w-[60%] flex items-start justify-center lg:justify-end select-none pointer-events-none relative z-[1] lg:-ml-8 xl:-ml-14 2xl:-ml-20 pt-0">
            <img
              src="/assets/images/entrenador1.png"
              alt="Basketball Analytics Hero"
              draggable={false}
              className="w-full h-auto max-h-[580px] sm:max-h-[660px] lg:max-h-[740px] xl:max-h-[820px] 2xl:max-h-[900px] object-contain object-top lg:object-right-top select-none pointer-events-none drop-shadow-2xl"
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/entrenador1.png')) {
                  target.src = '/entrenador1.png';
                }
              }}
            />
          </div>

        </div>

        {/* DESIGN TOGGLE: HIDDEN AS ONLY HERO 2 IS ACTIVE */}
        <div className="hidden" aria-hidden="true">
          <span className="text-[10px] font-condensed font-bold uppercase tracking-wider text-slate-700">
            HERO:
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playRetroSound('click');
              setHeroDesignMode('cards');
              onShowToast('Hero: Cartas Coleccionables');
            }}
            className={`px-2.5 py-0.5 text-[11px] font-condensed font-bold uppercase rounded-full transition-all cursor-pointer ${
              heroDesignMode === 'cards'
                ? 'bg-[#0c3975] text-white shadow-xs'
                : 'text-[#0c3975] hover:bg-black/5'
            }`}
          >
            Cartas
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playRetroSound('click');
              setHeroDesignMode('hero2');
              onShowToast('Hero: HERO 2');
            }}
            className={`px-2.5 py-0.5 text-[11px] font-condensed font-bold uppercase rounded-full transition-all cursor-pointer ${
              heroDesignMode === 'hero2'
                ? 'bg-[#c02328] text-white shadow-xs'
                : 'text-[#0c3975] hover:bg-black/5'
            }`}
          >
            HERO 2
          </button>
        </div>

        {/* PRESERVED ALTERNATIVE HERO DESIGN (HIDDEN, NOT DELETED) */}
        <div className="hidden" aria-hidden="true">
              {/* The Unified Large Card Section */}
              <div 
                onClick={handleNextNbaCard}
                title="Click anywhere on the cards to cycle NBA players!"
                className="comic-interactive-card relative w-full max-w-[670px] xl:max-w-[720px] h-[470px] sm:h-[495px] lg:h-[515px] cursor-pointer group"
              >
              
              {/* 1. TOP RIGHT: Torn Vintage Red Crinkly NBA Wax Pack Wrapper */}
              <div className="absolute right-0 -top-2 w-[38%] aspect-[3/4] rounded-xs overflow-hidden shadow-2xl border-2 border-red-950/40 transform rotate-[11deg] z-10 pointer-events-none group-hover:rotate-[9deg] transition-transform duration-200">
                <img
                  src="/src/assets/images/nba_red_wax_wrapper_1790618402765.jpg"
                  alt="NBA Wax Pack Wrapper"
                  className="w-full h-full object-cover filter contrast-110"
                />
                <div className="absolute inset-0 bg-red-900/10" />

                {/* Stamped NBA Stencil Header */}
                <div className="absolute top-2 right-3 font-slab text-4xl sm:text-5xl text-white font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  NBA
                </div>

                {/* Red handwritten cursive slogan */}
                <div className="absolute top-16 right-3 text-right leading-tight font-serif italic text-white/95 text-[11px] sm:text-xs font-bold drop-shadow">
                  REAL STATS.<br />
                  REAL INSIGHTS.<br />
                  REAL HOOPS.
                </div>

                {/* Chalkboard Playbook Diagram */}
                <div className="absolute bottom-3 right-3 w-24 h-24 opacity-85">
                  <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none stroke-[2.5] stroke-linecap-round">
                    <path d="M 20 85 Q 50 50 80 30" strokeDasharray="4 4" />
                    <polyline points="72,25 80,30 82,38" fill="white" />
                    <path d="M 30 20 Q 55 45 40 75" />
                    <polyline points="33,70 40,75 48,72" fill="white" />
                    <line x1="20" y1="45" x2="32" y2="57" strokeWidth="3" />
                    <line x1="32" y1="45" x2="20" y2="57" strokeWidth="3" />
                    <circle cx="70" cy="65" r="7" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>

              {/* 2. CENTER-RIGHT: TILTED VINTAGE CARDBOARD CARD BACK */}
              <div className="absolute right-[4%] top-[2.5%] w-[49%] aspect-[2.45/3.5] rounded-[6px] card-back-chipboard border-2 border-[#80735e] p-2.5 sm:p-3 shadow-2xl transform rotate-[2.8deg] z-20 transition-all duration-200 group-hover:rotate-[1.5deg] flex flex-col justify-between">
                
                {/* Top Card Back Bar: SEASON AVERAGES & 2023-24 */}
                <div className="bg-[#0c3975] text-white px-2.5 py-1 rounded-[3px] flex items-center justify-between font-condensed uppercase tracking-wider text-xs font-bold border-b border-white/20">
                  <span className="font-slab text-[12px] tracking-wide">SEASON AVERAGES</span>
                  <span className="font-mono-code text-[11px] text-yellow-300">{currentNbaCard.season}</span>
                </div>

                {/* Table 1: GP | MIN | PTS | REB | AST | STL | BLK */}
                <div className="my-1.5 overflow-hidden border border-black/15 bg-white/40 rounded-[3px]">
                  <table className="w-full text-center text-[9.5px] font-mono-code font-bold border-collapse">
                    <thead>
                      <tr className="bg-[#0c3975]/10 text-[#0c3975] border-b border-black/20">
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
                      <tr className="divide-x divide-black/10">
                        <td className="py-0.5">{currentNbaCard.seasonAverages.gp}</td>
                        <td>{currentNbaCard.seasonAverages.min}</td>
                        <td className="font-black text-[#0c3975]">{currentNbaCard.seasonAverages.pts}</td>
                        <td>{currentNbaCard.seasonAverages.reb}</td>
                        <td>{currentNbaCard.seasonAverages.ast}</td>
                        <td>{currentNbaCard.seasonAverages.stl}</td>
                        <td>{currentNbaCard.seasonAverages.blk}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 2: SHOOTING PERCENTAGE */}
                <div className="my-1">
                  <div className="text-[10px] font-condensed font-bold text-[#0c3975] tracking-wider uppercase border-b border-black/20 pb-0.5 mb-1">
                    SHOOTING PERCENTAGE
                  </div>
                  <div className="grid grid-cols-3 text-center border border-black/15 bg-white/40 rounded-[3px] divide-x divide-black/10 text-[9.5px] font-mono-code">
                    <div className="py-1">
                      <div className="text-[8px] text-slate-500 font-bold uppercase">FG</div>
                      <div className="font-black text-[#0c3975]">{currentNbaCard.shooting.fg}</div>
                    </div>
                    <div className="py-1">
                      <div className="text-[8px] text-slate-500 font-bold uppercase">3P</div>
                      <div className="font-black text-[#0c3975]">{currentNbaCard.shooting.threeP}</div>
                    </div>
                    <div className="py-1">
                      <div className="text-[8px] text-slate-500 font-bold uppercase">FT</div>
                      <div className="font-black text-[#0c3975]">{currentNbaCard.shooting.ft}</div>
                    </div>
                  </div>
                </div>

                {/* Section 3: ADVANCED METRICS */}
                <div className="my-1">
                  <div className="text-[10px] font-condensed font-bold text-[#0c3975] tracking-wider uppercase border-b border-black/20 pb-0.5 mb-1">
                    ADVANCED METRICS
                  </div>
                  <div className="grid grid-cols-4 text-center border border-black/15 bg-white/40 rounded-[3px] divide-x divide-black/10 text-[9.5px] font-mono-code">
                    <div className="py-1">
                      <div className="text-[8px] text-slate-500 font-bold uppercase">PER</div>
                      <div className="font-black text-[#0c3975]">{currentNbaCard.advanced.per}</div>
                    </div>
                    <div className="py-1">
                      <div className="text-[8px] text-slate-500 font-bold uppercase">TS%</div>
                      <div className="font-black text-[#0c3975]">{currentNbaCard.advanced.tsPct}</div>
                    </div>
                    <div className="py-1">
                      <div className="text-[8px] text-slate-500 font-bold uppercase">USG%</div>
                      <div className="font-black text-[#0c3975]">{currentNbaCard.advanced.usgPct}</div>
                    </div>
                    <div className="py-1">
                      <div className="text-[8px] text-slate-500 font-bold uppercase">BPM</div>
                      <div className="font-black text-[#b91c1c]">{currentNbaCard.advanced.bpm}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Watermark: BASKETDATA ANALYTICS LOGO */}
                <div className="mt-auto pt-2 border-t border-black/20 flex items-center justify-center gap-2">
                  <img 
                    src="/assets/images/icon.png" 
                    alt="BASKETDATA" 
                    className="h-5 w-auto object-contain shrink-0"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/icon.png')) {
                        target.src = '/icon.png';
                      }
                    }}
                  />
                  <div className="leading-tight text-center">
                    <span className="font-slab text-xs text-[#0c3975] font-black uppercase tracking-wider block">
                      BASKETDATA
                    </span>
                    <span className="font-condensed text-[8px] text-[#0c3975] font-bold tracking-[0.2em] uppercase block">
                      ★ ANALYTICS ★
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. CENTER-LEFT: THE THICK VINTAGE CARD STACK WITH LUKA DONČIĆ ON TOP */}
              <div className="absolute left-0 top-0 w-[49%] aspect-[2.5/3.5] rounded-[6px] card-stack-depth bg-[#ede5d6] border-2 border-black p-2 sm:p-2.5 z-30 transition-all duration-200 transform group-hover:-translate-y-1.5 group-hover:rotate-[-1deg]">
                {/* Outer Cardboard Border & Inner Royal Blue Frame */}
                <div className="w-full h-full rounded-[4px] bg-[#0c4383] border-2 border-white p-2 flex flex-col justify-between relative shadow-inner overflow-hidden">
                  
                  {/* Top Player Name & Jersey Number */}
                  <div className="flex items-start justify-between border-b border-white/40 pb-1 px-1">
                    <div>
                      <h3 className="font-slab text-base sm:text-lg lg:text-xl text-white tracking-tight leading-none uppercase drop-shadow">
                        {currentNbaCard.name}
                      </h3>
                      {/* Position Label PG right below the name */}
                      <span className="font-slab text-xs sm:text-sm font-bold text-white uppercase block mt-0.5 drop-shadow">
                        {currentNbaCard.position}
                      </span>
                    </div>

                    {/* Jersey Number */}
                    <div className="font-slab text-base sm:text-lg lg:text-xl text-white font-black tracking-tight drop-shadow">
                      {currentNbaCard.number}
                    </div>
                  </div>

                  {/* Player Photo with Lithograph Grain & Team Logo in corner */}
                  <div className="relative flex-1 my-1 rounded-[3px] overflow-hidden border border-white/60 bg-[#082346] flex items-center justify-center">
                    <img
                      src={currentNbaCard.image}
                      alt={currentNbaCard.name}
                      className="w-full h-full object-cover filter contrast-110"
                    />

                    {/* Team Circular Insignia (Bottom-Right corner of photo) */}
                    <div className="absolute bottom-1 right-1 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0c3975] border-2 border-white flex items-center justify-center shadow-lg p-0.5">
                      <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-white font-slab text-[8px] sm:text-[9px] font-black uppercase text-center leading-none">
                        {currentNbaCard.teamShort}
                      </div>
                    </div>
                  </div>

                  {/* Bottom 2x3 Stat Grid with Fine White Hairline Dividers */}
                  <div className="border border-white/70 rounded-[3px] overflow-hidden bg-black/25 backdrop-blur-[1px]">
                    {/* Row 1: PPG | RPG | APG */}
                    <div className="grid grid-cols-3 text-center text-white font-condensed font-bold text-[11px] sm:text-xs divide-x divide-white/40 border-b border-white/40 py-1">
                      <span>{currentNbaCard.cardStats.ppg}</span>
                      <span>{currentNbaCard.cardStats.rpg}</span>
                      <span>{currentNbaCard.cardStats.apg}</span>
                    </div>
                    {/* Row 2: FG% | 3P% | FT% */}
                    <div className="grid grid-cols-3 text-center text-white font-condensed font-bold text-[11px] sm:text-xs divide-x divide-white/40 py-1 bg-white/5">
                      <span>{currentNbaCard.cardStats.fgPct}</span>
                      <span>{currentNbaCard.cardStats.threePct}</span>
                      <span>{currentNbaCard.cardStats.ftPct}</span>
                    </div>
                  </div>

                </div>

                {/* Stack Draw Indicator Hint */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0c3975] text-white text-[9px] font-condensed font-bold uppercase px-3 py-0.5 rounded-full shadow border border-white whitespace-nowrap">
                  CLICK TO CYCLE NBA CARDS 🎴
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* 3. BOTTOM THREE GRID PANELS (OCULTO POR PETICIÓN DEL USUARIO) */}
      <section className="relative z-10 site-container mt-5 hidden" aria-hidden="true">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          
          {/* PANEL 1: FEATURED ANALYSIS (Red Header: Dončić vs Jokić) */}
          <div className="comic-interactive-card lg:col-span-3 bg-[#faf7f0] border-2 border-[#113568]/30 rounded-xs shadow-[3px_3px_0_rgba(17,53,104,0.15)] flex flex-col justify-between overflow-hidden">
            {/* Red Header Bar */}
            <div className="bg-[#b91c1c] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3 py-1 border-b-2 border-black/20 flex items-center gap-1.5">
              <Flame size={13} className="text-yellow-300" />
              <span>{homeContent.panel1Comparison.badge}</span>
            </div>

            <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-slab text-base sm:text-[17px] text-[#0c3975] uppercase leading-tight">
                  {homeContent.panel1Comparison.title}
                </h3>
                <span className="font-condensed font-bold text-[11px] text-[#b91c1c] uppercase tracking-wider block mt-0.5">
                  {homeContent.panel1Comparison.matchup}
                </span>

                <p className="mt-1 text-[10.5px] text-slate-700 leading-snug font-medium font-mono-code line-clamp-2">
                  {homeContent.panel1Comparison.description}
                </p>

                {/* Visual Head-to-Head Box */}
                <div className="mt-2 flex items-center justify-around gap-2 bg-[#ede7dc] px-2 py-1.5 rounded border border-black/15">
                  {/* Luka Dončić */}
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xs overflow-hidden border-2 border-[#0c3975] mx-auto shadow-xs">
                      <img src="/src/assets/images/vintage_hoops_card_star_1790618421190.jpg" alt="Dončić" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-condensed font-bold text-[9px] text-[#0c3975] block mt-0.5 uppercase truncate max-w-[65px]">
                      {homeContent.panel1Comparison.player1Name}
                    </span>
                  </div>

                  {/* VS Badge */}
                  <div className="w-5 h-5 rounded-full bg-[#0c3975] text-white font-slab text-[8.5px] flex items-center justify-center border border-white shadow-xs shrink-0">
                    {homeContent.panel1Comparison.vsBadge}
                  </div>

                  {/* Nikola Jokić */}
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xs overflow-hidden border-2 border-[#b91c1c] mx-auto shadow-xs">
                      <img src="/src/assets/images/wax_pull_basketball_player_2_1790616449728.jpg" alt="Jokić" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-condensed font-bold text-[9px] text-[#b91c1c] block mt-0.5 uppercase truncate max-w-[65px]">
                      {homeContent.panel1Comparison.player2Name}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  playRetroSound('click');
                  if (onOpenPlayerProfile) {
                    onOpenPlayerProfile();
                  } else {
                    onShowToast(homeContent.panel1Comparison.toastMessage);
                  }
                }}
                className="mt-2 w-full btn-retro-white py-1 px-2 text-[10.5px] sm:text-xs font-condensed font-bold uppercase tracking-wider text-center border border-[#0c3975] cursor-pointer hover:bg-yellow-50 shadow-[1px_1px_0_#0c3975]"
              >
                {homeContent.panel1Comparison.buttonText}
              </button>
            </div>
          </div>

          {/* PANEL 2: TOP PLAYERS THIS SEASON (Blue Header: 5 NBA Cards) */}
          <div className="comic-interactive-card lg:col-span-6 bg-[#faf7f0] border-2 border-[#113568]/30 rounded-xs shadow-[3px_3px_0_rgba(17,53,104,0.15)] flex flex-col justify-between overflow-hidden">
            {/* Blue Header Bar */}
            <div className="bg-[#0c3975] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3 py-1 border-b-2 border-black/20 flex items-center justify-between">
              <span>{homeContent.panel2TopPlayers.badge}</span>
              <button
                onClick={() => {
                  playRetroSound('click');
                  setIsChecklistModalOpen(true);
                }}
                className="text-[10.5px] text-yellow-300 hover:underline uppercase cursor-pointer flex items-center gap-1 font-bold"
              >
                <span>{homeContent.panel2TopPlayers.viewAllText}</span>
                <span>→</span>
              </button>
            </div>

            {/* 4 Player Cards Row from cropped jugadores.png */}
            <div className="p-2 sm:p-2.5 grid grid-cols-4 gap-1.5 sm:gap-2 flex-1 items-stretch">
              {homeContent.panel2TopPlayers.players.slice(0, 4).map((p, index) => {
                const playerImg = p.image || `/jugador_${index + 1}.png`;
                return (
                  <div 
                    key={p.name + index}
                    onClick={() => {
                      playRetroSound('card');
                      setStackCardIndex(index);
                      if (index === 0 && onOpenPlayerProfile) {
                        onOpenPlayerProfile();
                      } else {
                        onShowToast(`Loaded ${p.number} ${p.name}`);
                      }
                    }}
                    className="comic-interactive-card bg-white border border-[#0c3975] rounded-xs p-1 flex flex-col justify-between cursor-pointer shadow-xs hover:border-[#b91c1c] transition-all"
                  >
                    <div className="flex justify-between items-center text-[8px] font-slab px-0.5 border-b border-black/20 pb-0.5">
                      <span className="text-[#0c3975]">{p.number}</span>
                      <span className="bg-[#0c3975] text-white px-1 rounded-[2px] text-[7.5px]">{p.pos}</span>
                    </div>
                    <div className="aspect-[3/3.3] my-1 rounded-xs overflow-hidden border border-black/20 bg-slate-900">
                      <img 
                        src={playerImg} 
                        alt={p.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes(`/src/assets/images/jugador_${index + 1}.png`)) {
                            target.src = `/src/assets/images/jugador_${index + 1}.png`;
                          }
                        }}
                      />
                    </div>
                    <div className="text-center leading-tight">
                      <span className="font-slab text-[8.5px] text-[#0c3975] block truncate">{p.name}</span>
                      <span className="text-[7px] font-mono-code text-slate-500 block truncate">{p.team}</span>
                      <div className="flex justify-around text-[7.5px] font-mono-code font-bold text-slate-800 mt-1 border-t border-black/10 pt-0.5">
                        <span>{p.stat1}</span>
                        <span>{p.stat2}</span>
                        <span>{p.stat3}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PANEL 3: YOUR ANALYSIS COLLECTION (Red Header) */}
          <div className="comic-interactive-card lg:col-span-3 bg-[#faf7f0] border-2 border-[#113568]/30 rounded-xs shadow-[3px_3px_0_rgba(17,53,104,0.15)] flex flex-col justify-between overflow-hidden">
            {/* Red Header Bar */}
            <div className="bg-[#b91c1c] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3 py-1 border-b-2 border-black/20 flex items-center justify-between">
              <span>{homeContent.panel3Collection.badge}</span>
            </div>

            <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1">
              {/* Dropdown & Export Button */}
              <div className="flex items-center gap-1.5">
                <div className="flex-1 bg-white border border-black/20 px-2 py-0.5 rounded-[2px] flex items-center justify-between text-[10px] font-mono-code">
                  <span>{selectedTimeRange}</span>
                  <ChevronDown size={12} />
                </div>
                <button
                  onClick={() => {
                    playRetroSound('click');
                    onShowToast(homeContent.panel3Collection.exportToast);
                  }}
                  className="bg-[#0c3975] text-white text-[10px] font-condensed font-bold px-2 py-0.5 rounded-[2px] uppercase tracking-wider cursor-pointer hover:bg-[#124b94]"
                >
                  {homeContent.panel3Collection.exportButton}
                </button>
              </div>

              {/* 3 Metric Counters */}
              <div className="grid grid-cols-3 gap-1 text-center my-1.5 py-1 border-y border-black/10">
                <div>
                  <span className="font-slab text-lg sm:text-xl text-[#0c3975] block leading-none">
                    {homeContent.panel3Collection.counters.games.value}
                  </span>
                  <span className="font-condensed text-[8.5px] font-bold text-slate-600 uppercase block mt-0.5">
                    {homeContent.panel3Collection.counters.games.label}
                  </span>
                </div>
                <div>
                  <span className="font-slab text-lg sm:text-xl text-[#0c3975] block leading-none">
                    {homeContent.panel3Collection.counters.players.value}
                  </span>
                  <span className="font-condensed text-[8.5px] font-bold text-slate-600 uppercase block mt-0.5">
                    {homeContent.panel3Collection.counters.players.label}
                  </span>
                </div>
                <div>
                  <span className="font-slab text-lg sm:text-xl text-[#0c3975] block leading-none">
                    {homeContent.panel3Collection.counters.teams.value}
                  </span>
                  <span className="font-condensed text-[8.5px] font-bold text-slate-600 uppercase block mt-0.5">
                    {homeContent.panel3Collection.counters.teams.label}
                  </span>
                </div>
              </div>

              {/* RECENT SEARCHES */}
              <div className="text-[10px] font-mono-code space-y-0.5">
                <span className="font-condensed font-bold text-slate-500 uppercase block text-[9.5px]">
                  {homeContent.panel3Collection.recentSearchesTitle}
                </span>
                {homeContent.panel3Collection.recentSearches.map((item) => (
                  <div 
                    key={item.query}
                    onClick={() => onShowToast(item.toast)}
                    className="flex items-center justify-between hover:bg-black/5 p-1 rounded cursor-pointer"
                  >
                    <span className="text-[#0c3975] truncate text-[9.5px]">{item.query}</span>
                    <span className="text-slate-400 text-[8.5px] shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3.5 ¿CÓMO FUNCIONA? (SECCIÓN DEL DATO A LA PISTA) */}
      <HowItWorksLandingSection 
        onShowToast={onShowToast} 
        onOpenRegister={() => setIsJoinModalOpen(true)}
      />

      {/* TUTORIALES PASO A PASO (EXACT REPLICA OF CAPTURA DE PANTALLA) */}
      <TutorialsSection onShowToast={onShowToast} />

      {/* 4. HERRAMIENTAS PRO & CHALK BANNER (EXACT REPLICA OF USER SCREENSHOT) */}
      <section className="mt-8">
        <ProToolsSection onShowToast={onShowToast} />
      </section>

      {/* 6. SITE FOOTER (EXACT MATCH TO CAPTURA DE PANTALLA 2026-09-29 124115.PNG) */}
      <SiteFooter onShowToast={onShowToast} />

      {/* MODAL 1: CHECKLIST & BUSCADOR DE JUGADORES FEB SUPABASE */}
      {isChecklistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-[#faf7f0] border-4 border-[#0c3975] rounded-md shadow-2xl p-5 flex flex-col max-h-[88vh]">
            
            <div className="flex items-center justify-between border-b-2 border-[#0c3975] pb-2 mb-3">
              <span className="font-slab text-xl text-[#0c3975] uppercase flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                <span>Explorador de Jugadores & Cartas</span>
              </span>
              <button
                onClick={() => setIsChecklistModalOpen(false)}
                className="w-7 h-7 bg-white text-black font-black border border-black hover:bg-yellow-300 flex items-center justify-center cursor-pointer rounded"
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>

            {/* Tabs inside Checklist Modal */}
            <div className="flex gap-2 mb-3 font-mono-code text-xs">
              <button
                type="button"
                onClick={() => setChecklistTab('supabase')}
                className={`flex-1 py-1.5 px-3 rounded font-bold uppercase cursor-pointer border ${
                  checklistTab === 'supabase'
                    ? 'bg-[#0c3975] text-white border-[#0c3975]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                ★ Baloncesto FEB Supabase (4.124)
              </button>
              <button
                type="button"
                onClick={() => setChecklistTab('nba')}
                className={`py-1.5 px-3 rounded font-bold uppercase cursor-pointer border ${
                  checklistTab === 'nba'
                    ? 'bg-[#0c3975] text-white border-[#0c3975]'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Cartas Retro NBA
              </button>
            </div>

            {checklistTab === 'supabase' ? (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={supabaseSearchQuery}
                    onChange={(e) => setSupabaseSearchQuery(e.target.value)}
                    placeholder="Escribe para buscar (ej: Garcia, Moreno, Savkov, Lukic)..."
                    className="w-full bg-white border-2 border-[#0c3975]/30 rounded pl-8 pr-3 py-1.5 text-xs font-mono-code text-slate-900 focus:outline-none focus:border-[#0c3975]"
                    autoFocus
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 divide-y divide-black/10 pr-1">
                  {isSearchingSupabase ? (
                    <div className="py-8 text-center text-xs font-mono-code text-slate-500 flex items-center justify-center gap-2">
                      <RefreshCw size={14} className="animate-spin text-[#0c3975]" />
                      <span>Buscando en Supabase...</span>
                    </div>
                  ) : supabasePlayersList.length === 0 ? (
                    <div className="py-8 text-center text-xs font-mono-code text-slate-500">
                      No se encontraron jugadores con ese nombre.
                    </div>
                  ) : (
                    supabasePlayersList.map((player) => (
                      <div
                        key={player.id}
                        onClick={() => {
                          playRetroSound('card');
                          setSelectedSupabasePlayerId(player.id);
                        }}
                        className="py-2 px-2 flex items-center justify-between hover:bg-[#0c3975]/10 rounded cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={player.photoUrl}
                            alt={player.name}
                            className="w-8 h-10 object-cover object-top rounded border border-slate-300 bg-slate-100"
                            onError={(e) => {
                              e.currentTarget.src = 'https://imagenes.feb.es/Imagen.aspx?i=logo&ti=1';
                            }}
                          />
                          <div>
                            <span className="font-bold text-xs text-[#0c3975] group-hover:text-[#c02328] block">
                              {player.name}
                            </span>
                            <span className="text-[10px] text-slate-600 block">
                              {player.team} • {player.league}
                            </span>
                          </div>
                        </div>

                        <div className="text-right font-mono-code text-xs">
                          <span className="text-[#c02328] font-bold block">{player.points} PTS</span>
                          <span className="text-[10px] text-emerald-700 font-bold block">{player.valuation} VAL</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-1.5 text-xs font-mono-code divide-y divide-black/10">
                {NBA_STAR_CARDS.map((card: DetailedBasketballCard) => (
                  <div 
                    key={card.id}
                    onClick={() => {
                      const idx = NBA_STAR_CARDS.findIndex((c: DetailedBasketballCard) => c.id === card.id);
                      setStackCardIndex(idx);
                      setIsChecklistModalOpen(false);
                      onShowToast(`Selected ${card.name}`);
                    }}
                    className="py-1.5 flex justify-between items-center cursor-pointer hover:bg-black/5 px-1 rounded"
                  >
                    <span className="font-bold text-[#0c3975]">{card.number} {card.name}</span>
                    <span className="text-slate-600">{card.team} ({card.position})</span>
                    <span className="text-[#c02328] font-bold">{card.cardStats.ppg}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setIsChecklistModalOpen(false)}
              className="mt-3 w-full bg-[#0c3975] text-white py-2 font-slab text-xs uppercase cursor-pointer rounded"
            >
              Cerrar Explorador
            </button>
          </div>
        </div>
      )}

      {/* MODAL: FICHA COMPLETA SUPABASE */}
      <SupabasePlayerModal
        playerId={selectedSupabasePlayerId}
        isOpen={!!selectedSupabasePlayerId}
        onClose={() => setSelectedSupabasePlayerId(null)}
        onShowToast={onShowToast}
        onOpenFullProfile={(id) => {
          setSelectedSupabasePlayerId(null);
          if (onOpenPlayerProfile) onOpenPlayerProfile(id);
        }}
      />

      {/* MODAL 2: CREAR CUENTA (REGISTRO + SELECCIÓN DE ROL) */}
      <RegisterModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSwitchToLogin={() => {
          setIsJoinModalOpen(false);
          setIsLoginModalOpen(true);
        }}
        onShowToast={onShowToast}
        onRegisterSuccess={() => {
          onShowToast('¡Cuenta creada! Has iniciado sesión en BASKETDATA.');
        }}
      />

      {/* MODAL 3: INICIAR SESIÓN / ENTRAR (MISMO DISEÑO) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsJoinModalOpen(true);
        }}
        onShowToast={onShowToast}
        onLoginSuccess={(role) => {
          if (role === 'admin' && onOpenAdminPanel) {
            onOpenAdminPanel();
          }
        }}
      />

    </div>
  );
};
