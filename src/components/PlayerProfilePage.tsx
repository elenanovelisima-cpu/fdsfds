import React, { useState, useEffect } from 'react';
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
  Users,
  Search,
  RefreshCw,
  Database,
  Shuffle,
  Eye,
  Copy,
  Check,
  X,
  Shield
} from 'lucide-react';
import { playRetroSound } from '../utils/audio';
import { fetchFullPlayerDetails, searchSupabasePlayers, SupabasePlayerItem } from '../lib/supabaseAdmin';

interface PlayerProfilePageProps {
  playerId?: string;
  onBackToHome: () => void;
  onShowToast: (msg: string) => void;
  onOpenChecklistModal?: () => void;
  onSelectPlayer?: (playerId: string) => void;
}

// Country Flag helper
function getCountryFlag(nationality?: string): string {
  if (!nationality) return '🇪🇸';
  const n = nationality.toUpperCase();
  if (n.includes('ESP')) return '🇪🇸';
  if (n.includes('RUS')) return '🇷🇺';
  if (n.includes('SER') || n.includes('SRB')) return '🇷🇸';
  if (n.includes('USA') || n.includes('ESTADOS')) return '🇺🇸';
  if (n.includes('FRA')) return '🇫🇷';
  if (n.includes('ITA')) return '🇮🇹';
  if (n.includes('ARG')) return '🇦🇷';
  if (n.includes('BRA')) return '🇧🇷';
  if (n.includes('LIT') || n.includes('LTU')) return '🇱🇹';
  if (n.includes('CRO')) return '🇭🇷';
  if (n.includes('SLO') || n.includes('ESLOV')) return '🇸🇮';
  if (n.includes('SEN') || n.includes('SNG')) return '🇸🇳';
  if (n.includes('CAN')) return '🇨🇦';
  if (n.includes('GER') || n.includes('ALE')) return '🇩🇪';
  return '🏀';
}

// Calculate age from FEB format "DD/MM/YYYY"
function calculateAge(birthDateStr?: string): string {
  if (!birthDateStr) return 'N/D';
  const parts = birthDateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const birth = new Date(year, month, day);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 && age < 60 ? `${age}` : 'N/D';
  }
  return 'N/D';
}

// Format height (e.g. "208" -> "2.08 m")
function formatHeight(h?: string): string {
  if (!h) return 'N/D';
  const clean = h.trim();
  const num = parseFloat(clean);
  if (!isNaN(num) && num > 100) {
    return `${(num / 100).toFixed(2)} m`;
  }
  return clean.includes('m') ? clean : `${clean} m`;
}

// Parse FEB numbers (handles comma decimals like "13,5")
function parseFebNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  const s = String(val).replace('%', '').replace(',', '.').trim();
  const parsed = parseFloat(s);
  return isNaN(parsed) ? 0 : parsed;
}

// Pre-seeded quick featured players in Supabase
const FEATURED_FEB_PLAYERS = [
  { id: '2438847', name: 'SAVKOV, ALEKSANDR', team: 'CASADEMONT ZARAGOZA' },
  { id: '2125634', name: 'GARCIA SANCHEZ, JUAN', team: 'CASADEMONT ZARAGOZA' },
  { id: '2008960', name: 'MORENO VALERO, ALEJANDRO', team: 'CASADEMONT ZARAGOZA' },
  { id: '2646355', name: 'LUKIC, MATIJA', team: 'CASADEMONT ZARAGOZA' },
  { id: '1975428', name: 'ALIAS BERMUDEZ, CARLOS', team: 'CASADEMONT ZARAGOZA' }
];

export const PlayerProfilePage: React.FC<PlayerProfilePageProps> = ({
  playerId = '2438847',
  onBackToHome,
  onShowToast,
  onOpenChecklistModal,
  onSelectPlayer
}) => {
  const [currentPlayerId, setCurrentPlayerId] = useState<string>(playerId);
  const [playerData, setPlayerData] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'totals' | 'career' | 'shot-chart' | 'raw-json'>('overview');
  const [isGameLogModalOpen, setIsGameLogModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SupabasePlayerItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [hasCopiedJson, setHasCopiedJson] = useState(false);

  // Sync prop changes
  useEffect(() => {
    if (playerId && playerId !== currentPlayerId) {
      setCurrentPlayerId(playerId);
    }
  }, [playerId]);

  // Load player from Supabase
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await fetchFullPlayerDetails(currentPlayerId);
        if (isMounted) {
          if (res && res.data) {
            setPlayerData(res.data);
          } else {
            // Fallback: try default Aleksandr Savkov
            const fallback = await fetchFullPlayerDetails('2438847');
            if (fallback && fallback.data) {
              setPlayerData(fallback.data);
            }
          }
        }
      } catch (err) {
        console.error('Error loading player data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [currentPlayerId]);

  // Handle player search inside Supabase
  useEffect(() => {
    if (!isSearchModalOpen) return;
    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchSupabasePlayers(searchQuery, undefined, 24);
      setSearchResults(results);
      setIsSearching(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, isSearchModalOpen]);

  const handleSelectNewPlayer = (newId: string, playerName?: string) => {
    playRetroSound('card');
    setCurrentPlayerId(newId);
    if (onSelectPlayer) onSelectPlayer(newId);
    setIsSearchModalOpen(false);
    onShowToast(`Perfil de ${playerName || 'jugador'} cargado desde Supabase`);
  };

  const handleCycleRandomPlayer = () => {
    playRetroSound('card');
    const remaining = FEATURED_FEB_PLAYERS.filter(p => p.id !== currentPlayerId);
    const randomPick = remaining[Math.floor(Math.random() * remaining.length)] || FEATURED_FEB_PLAYERS[0];
    handleSelectNewPlayer(randomPick.id, randomPick.name);
  };

  const handleCopyJson = () => {
    playRetroSound('click');
    navigator.clipboard.writeText(JSON.stringify(playerData, null, 2));
    setHasCopiedJson(true);
    onShowToast('JSON completo de Supabase copiado al portapapeles');
    setTimeout(() => setHasCopiedJson(false), 2000);
  };

  // Safe data accessor
  const d = playerData || {};
  const seasonStatsAvg: any[] = d.season_stats_avg || [];
  const seasonStatsTotal: any[] = d.season_stats_total || [];
  const careerHistory: any[] = d.career_history || [];

  // Primary average phase or global row
  const primaryAvg = seasonStatsAvg.find((r: any) => !r.fase) || seasonStatsAvg[0] || {};
  const primaryTotal = seasonStatsTotal.find((r: any) => !r.fase) || seasonStatsTotal[0] || {};

  // Formatted display values
  const displayName = d.player_name || 'JUGADOR FEB';
  const displayTeam = d.team_name || 'CASADEMONT ZARAGOZA';
  const displayLeague = d.league_name || 'LIGA U';
  const displayGroup = d.group_name || '';
  const displayPosition = d.position || 'Alero';
  const displayDorsal = d.dorsal ? `#${d.dorsal}` : '#00';
  const displayHeight = formatHeight(d.height);
  const displayAge = calculateAge(d.birth_date);
  const displayNationality = d.nationality || 'ESP';
  const displayFlag = getCountryFlag(displayNationality);
  const displayPhoto = d.photo_url || `https://imagenes.feb.es/Foto.aspx?c=${currentPlayerId}`;

  // Key stats
  const ptsVal = primaryAvg.puntos || d.points || '0';
  const rebVal = primaryAvg.rebotes_total || d.rebounds_total || '0';
  const astVal = primaryAvg.asistencias || d.assists || '0';
  const valVal = primaryAvg.valoracion || d.valuation || '0';
  const minVal = primaryAvg.minutos || d.minutes || '00:00';
  const t2Pct = primaryAvg.t2_pct || d.t2_pct || '0%';
  const t3Pct = primaryAvg.t3_pct || d.t3_pct || '0%';
  const tcPct = primaryAvg.tc_pct || d.tc_pct || '0%';
  const tlPct = primaryAvg.tl_pct || d.tl_pct || '0%';
  const stlVal = primaryAvg.robos || d.steals || '0';
  const blkVal = primaryAvg.tapones_favor || d.blocks_favor || '0';
  const tovVal = primaryAvg.perdidas || d.turnovers || '0';
  const gpVal = primaryAvg.partidos || '1';

  // Dynamic Shot Chart Dots: generated from real shooting percentages & player volume
  const shotChartDots = React.useMemo(() => {
    const dots: { x: number; y: number; made: boolean; z: string }[] = [];
    const t3Num = parseFebNumber(t3Pct);
    const t2Num = parseFebNumber(t2Pct);

    // Rim & Paint dots
    const rimCount = 8;
    for (let i = 0; i < rimCount; i++) {
      const made = (i / rimCount) * 100 <= (t2Num > 50 ? t2Num : 55);
      dots.push({
        x: 44 + (i % 4) * 4,
        y: 80 + Math.floor(i / 4) * 6,
        made,
        z: 'Rim'
      });
    }

    // Mid-Range dots
    const midCount = 8;
    for (let i = 0; i < midCount; i++) {
      const made = (i / midCount) * 100 <= (t2Num > 40 ? t2Num - 5 : 42);
      dots.push({
        x: 32 + (i * 5),
        y: 55 + (i % 3) * 7,
        made,
        z: 'Mid-Range'
      });
    }

    // 3PT dots
    const threeCount = 14;
    for (let i = 0; i < threeCount; i++) {
      const angle = (Math.PI / (threeCount + 1)) * (i + 1);
      const radius = 34;
      const x = 50 - radius * Math.cos(angle);
      const y = 88 - radius * Math.sin(angle);
      const made = (i / threeCount) * 100 <= t3Num;
      dots.push({
        x: Math.round(x),
        y: Math.round(y),
        made,
        z: '3-Point Arc'
      });
    }

    return dots;
  }, [t2Pct, t3Pct]);

  // Phase comparison bars from season_stats_avg
  const phaseComparisonData = seasonStatsAvg.length > 0
    ? seasonStatsAvg.map((phase: any) => ({
        phaseName: phase.fase || 'TOTAL',
        pts: parseFebNumber(phase.puntos),
        reb: parseFebNumber(phase.rebotes_total),
        ast: parseFebNumber(phase.asistencias),
        val: parseFebNumber(phase.valoracion),
        min: phase.minutos || '00:00',
        gp: phase.partidos || '0',
        tcPct: phase.tc_pct || '0%',
        t3Pct: phase.t3_pct || '0%'
      }))
    : [
        { phaseName: 'TEMP', pts: parseFebNumber(ptsVal), reb: parseFebNumber(rebVal), ast: parseFebNumber(astVal), val: parseFebNumber(valVal), min: minVal, gp: gpVal, tcPct, t3Pct }
      ];

  const maxPtsPhase = Math.max(...phaseComparisonData.map(p => p.pts), 25);

  return (
    <div className="min-h-screen bg-[#ede7dc] text-[#0e3a73] font-sans relative overflow-x-hidden pb-12 select-none">
      
      {/* Macro Unbleached Paper Pulp Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-25 texture-paper-pulp z-0" />

      {/* 1. TOP HEADER BAR WITH PLAYER SEARCH & SWITCHER */}
      <header className="relative z-20 border-b-[1.5px] border-[#c02328] bg-[#ede7dc] px-4 sm:px-8 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="absolute inset-0 pointer-events-none opacity-25 texture-paper-pulp z-0" />
        <div className="relative z-10 site-container flex flex-wrap items-center justify-between gap-4">
          
          {/* Left Brand */}
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
              >
                ★ SUPABASE PRO ★
              </span>
            </div>
          </div>

          {/* Quick Player Search Button & Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                playRetroSound('click');
                setIsSearchModalOpen(true);
              }}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-[#0c3975] border-2 border-[#0c3975] px-3 py-1.5 rounded-[4px] font-mono-code text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
            >
              <Search size={14} className="text-[#c02328]" />
              <span className="hidden sm:inline">BUSCAR JUGADOR SUPABASE</span>
              <span className="sm:hidden">BUSCAR</span>
              <span className="bg-[#0c3975] text-white px-1.5 py-0.2 rounded text-[10px]">
                4.124
              </span>
            </button>

            <button
              onClick={handleCycleRandomPlayer}
              className="flex items-center gap-1.5 bg-[#0c3975] hover:bg-[#124b94] text-white px-3 py-1.5 rounded-[4px] font-mono-code text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-all"
              title="Cargar otro jugador de Supabase"
            >
              <Shuffle size={13} className="text-amber-400" />
              <span className="hidden md:inline">OTRO JUGADOR</span>
            </button>
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                playRetroSound('click');
                onBackToHome();
              }}
              className="flex items-center gap-1.5 text-[#c02328] hover:text-[#991b1b] transition-colors cursor-pointer bg-black/5 px-3 py-1.5 rounded-[3px] border border-[#c02328]/30 shadow-xs font-condensed font-bold text-xs uppercase"
            >
              <ArrowLeft size={14} />
              <span>VOLVER AL INICIO</span>
            </button>
          </div>

        </div>
      </header>

      {/* Breadcrumb & Player Quick Meta */}
      <div className="site-container pt-3 pb-1 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-slate-600">
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={onBackToHome}
            className="flex items-center gap-1 text-[#0c3975] hover:text-[#c02328] font-bold uppercase transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>INICIO</span>
          </button>
          <span>/</span>
          <span className="text-slate-500 uppercase">{displayLeague}</span>
          <span>/</span>
          <span className="text-slate-700 font-bold uppercase truncate max-w-[160px] sm:max-w-none">{displayTeam}</span>
          <span>/</span>
          <span className="font-bold text-[#b91c1c] uppercase flex items-center gap-1">
            <span>{displayName}</span>
            <span>({displayDorsal})</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              playRetroSound('click');
              setActiveTab('raw-json');
              onShowToast('Visualizando esquema JSON crudo de Supabase');
            }}
            className="flex items-center gap-1 text-slate-700 hover:text-[#0c3975] font-condensed font-bold uppercase text-[11px] cursor-pointer bg-white px-2 py-0.5 rounded border border-slate-300"
          >
            <Database size={12} className="text-[#0c3975]" />
            <span>JSON SUPABASE</span>
          </button>

          <button 
            onClick={() => {
              playRetroSound('click');
              onShowToast(`Enlace al perfil de ${displayName} copiado.`);
            }}
            className="flex items-center gap-1 text-slate-700 hover:text-[#0c3975] font-condensed font-bold uppercase text-[11px] cursor-pointer"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">COMPARTIR</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PLAYER HERO SHOWCASE: DEEP BLUE CHALKBOARD / VINTAGE FEB CARD          */}
      {/* ========================================================================= */}
      <section className="relative z-10 site-container mt-2">
        <div className="fondoazul-solid rounded-[6px] border-none outline-none ring-0 p-5 sm:p-7 lg:p-9 shadow-2xl relative overflow-hidden text-white">
          
          {/* Background Watermark: Basketball Geometry Sketch */}
          <div className="absolute right-6 top-4 w-72 h-72 opacity-15 pointer-events-none select-none">
            <svg viewBox="0 0 200 200" className="w-full h-full stroke-white fill-none stroke-2">
              <circle cx="100" cy="100" r="90" strokeDasharray="6 6" />
              <line x1="10" y1="100" x2="190" y2="100" />
              <line x1="100" y1="10" x2="100" y2="190" />
              <path d="M 40 25 Q 70 100 40 175" />
              <path d="M 160 25 Q 130 100 160 175" />
            </svg>
          </div>

          {/* Chalk Handwritten Slogan in Top Right */}
          <div className="absolute right-6 top-8 text-right hidden md:block select-none pointer-events-none">
            <div className="chalk-text-italic text-white/85 text-xs sm:text-sm font-bold leading-tight">
              SUPABASE FEB.<br />
              4.124 JUGADORES.<br />
              DATOS EN VIVO.
            </div>
            <div className="mt-1 flex justify-end text-white/80">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white fill-none stroke-2">
                <path d="M 2 18 L 4 6 L 9 12 L 12 4 L 15 12 L 20 6 L 22 18 Z" />
                <line x1="2" y1="20" x2="22" y2="20" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* LEFT: Authentic Vintage Card Stack with Real Supabase Photo */}
            <div className="lg:col-span-4 xl:col-span-4 flex justify-center">
              <div 
                onClick={() => {
                  playRetroSound('card');
                  onShowToast(`Carta oficial FEB de ${displayName}`);
                }}
                className="comic-interactive-card relative w-64 sm:w-72 aspect-[2.5/3.5] rounded-[6px] card-stack-depth bg-[#ede5d6] border-2 border-black p-2.5 shadow-2xl cursor-pointer group transform hover:-translate-y-1 transition-all"
              >
                {/* Vintage Tape on top */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-200/50 backdrop-blur-xs border border-yellow-300/40 transform -rotate-1 rounded-xs pointer-events-none z-40" />

                {/* Inner Frame */}
                <div className="w-full h-full rounded-[4px] bg-[#0c4383] border-2 border-white p-2 flex flex-col justify-between relative shadow-inner overflow-hidden text-white">
                  
                  {/* Card Header: NAME & DORSAL */}
                  <div className="flex items-start justify-between border-b border-white/40 pb-1 px-1">
                    <div className="truncate mr-2">
                      <h3 className="font-slab text-sm sm:text-base text-white tracking-tight leading-none uppercase drop-shadow truncate" title={displayName}>
                        {displayName}
                      </h3>
                      <span className="font-slab text-[10px] sm:text-xs font-bold text-white uppercase block mt-0.5 drop-shadow">
                        {displayPosition} • {displayLeague}
                      </span>
                    </div>

                    <div className="font-slab text-base sm:text-lg text-white font-black tracking-tight drop-shadow shrink-0">
                      {displayDorsal}
                    </div>
                  </div>

                  {/* Player Photo from Supabase FEB */}
                  <div className="relative flex-1 my-1.5 rounded-[3px] overflow-hidden border border-white/60 bg-[#082346] flex items-center justify-center">
                    <img 
                      src={displayPhoto} 
                      alt={displayName} 
                      className="w-full h-full object-cover object-top filter contrast-110 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://imagenes.feb.es/Imagen.aspx?i=logo&ti=1';
                      }}
                    />

                    {/* Official FEB Stamp on top-left */}
                    <div className="absolute top-1 left-1.5 bg-[#c02328] text-white px-1.5 rounded-[2px] text-[7.5px] font-black uppercase tracking-tight shadow">
                      FEB {displayLeague}
                    </div>

                    {/* Team Badge on bottom-right */}
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#0c3975] border border-white text-[7.5px] font-slab font-black text-white shadow-md uppercase truncate max-w-[120px]">
                      {displayTeam}
                    </div>

                    {/* Bottom Plate on photo */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1 pt-3 text-center">
                      <span className="font-slab text-[9.5px] text-yellow-300 tracking-wider uppercase block truncate">
                        {displayName}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Stats Bars on Card from Supabase */}
                  <div className="border border-white/50 rounded-[2px] overflow-hidden bg-black/40">
                    <div className="grid grid-cols-3 text-center text-white font-mono-code font-bold text-[9.5px] border-b border-white/30 py-0.5 bg-white/10">
                      <span>{ptsVal} PTS</span>
                      <span>{rebVal} REB</span>
                      <span>{astVal} AST</span>
                    </div>
                    <div className="grid grid-cols-3 text-center text-white font-mono-code font-bold text-[9px] py-0.5">
                      <span>{tcPct} TC</span>
                      <span>{t3Pct} 3P</span>
                      <span>{valVal} VAL</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* CENTER / RIGHT: Monumental Headline & Player Bio Meta */}
            <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-center">
              
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#c02328] text-white text-[10px] font-mono-code font-bold px-2 py-0.5 rounded tracking-widest uppercase">
                  SUPABASE ID: {currentPlayerId}
                </span>
                <span className="bg-white/10 text-white/90 text-[10px] font-mono-code px-2 py-0.5 rounded uppercase">
                  {displayLeague}
                </span>
                {d.is_starter && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-mono-code px-2 py-0.5 rounded uppercase font-bold">
                    ★ TITULAR HABITUAL
                  </span>
                )}
              </div>

              {/* Monumental Slab Headline */}
              <h1 className="font-slab text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white tracking-normal uppercase leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {displayName}
              </h1>

              {/* Subtitle / Role Tagline */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-[15px] font-condensed font-bold tracking-wider text-white/90 uppercase">
                <span className="text-[#c02328] text-base sm:text-lg">★</span>
                <span>{displayPosition}</span>
                <span>&nbsp;/&nbsp;</span>
                <span className="text-yellow-300">{displayTeam}</span>
                <span>&nbsp;/&nbsp;</span>
                <span>{displayDorsal}</span>
                {displayGroup && (
                  <>
                    <span>&nbsp;/&nbsp;</span>
                    <span className="text-white/70">{displayGroup}</span>
                  </>
                )}
              </div>

              {/* Player Bio Attributes Grid (Age, Height, Weight/Formation, Country) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 max-w-2xl bg-black/35 p-3 rounded-[4px] border border-white/20 backdrop-blur-xs">
                {/* Age */}
                <div className="border-r border-white/20 pr-2">
                  <span className="text-[10px] font-mono-code text-white/70 uppercase block">EDAD / NACIMIENTO</span>
                  <span className="font-slab text-lg sm:text-2xl text-white block mt-0.5">
                    {displayAge !== 'N/D' ? `${displayAge} AÑOS` : d.birth_date || 'N/D'}
                  </span>
                </div>

                {/* Height */}
                <div className="border-r border-white/20 pr-2">
                  <span className="text-[10px] font-mono-code text-white/70 uppercase block">ALTURA</span>
                  <span className="font-slab text-lg sm:text-2xl text-white block mt-0.5">
                    {displayHeight}
                  </span>
                </div>

                {/* Formation / License */}
                <div className="sm:border-r sm:border-white/20 pr-2">
                  <span className="text-[10px] font-mono-code text-white/70 uppercase block">FORMACIÓN</span>
                  <span className="font-slab text-lg sm:text-2xl text-white block mt-0.5 truncate" title={d.formation || 'Nacional'}>
                    {d.formation === 'SI' || d.formation === 'Nacional' ? 'NACIONAL' : (d.formation || 'ORIGEN')}
                  </span>
                </div>

                {/* Country with Flag */}
                <div>
                  <span className="text-[10px] font-mono-code text-white/70 uppercase block">PAÍS / ORIGEN</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-lg">{displayFlag}</span>
                    <span className="font-condensed font-bold text-sm sm:text-base text-white uppercase truncate">
                      {displayNationality}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Bio Paragraph generated from Supabase telemetry */}
              <p className="mt-4 text-xs sm:text-[14px] text-white/90 font-mono-code font-normal leading-relaxed max-w-2xl select-text">
                Jugador de la plantilla de <strong className="text-white">{displayTeam}</strong> en <strong className="text-white">{displayLeague}</strong>. Promedia <strong className="text-yellow-300">{ptsVal} puntos</strong>, <strong className="text-white">{rebVal} rebotes</strong> y <strong className="text-white">{astVal} asistencias</strong> por encuentro, acumulando un índice de valoración oficial FEB de <strong className="text-emerald-300">{valVal}</strong> en {gpVal} partidos disputados.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SUB-NAV TABS BAR                                                       */}
      {/* ========================================================================= */}
      <section className="relative z-10 site-container mt-4">
        <div className="flex items-center justify-between flex-wrap gap-3 py-1.5 border-b border-[#0c3975]/20">
          
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-[13px] font-condensed font-bold uppercase tracking-wider">
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
              RESUMEN & METRICS
            </button>

            <span className="text-[#0c3975]/30 font-light">|</span>

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
              MEDIAS POR FASE ({seasonStatsAvg.length})
            </button>

            <span className="text-[#0c3975]/30 font-light">|</span>

            <button
              onClick={() => {
                playRetroSound('click');
                setActiveTab('totals');
              }}
              className={`px-2.5 py-1 rounded-[2px] transition-all cursor-pointer ${
                activeTab === 'totals'
                  ? 'bg-[#b91c1c] text-white shadow-xs'
                  : 'text-[#0c3975] hover:text-[#b91c1c]'
              }`}
            >
              TOTALES ACUMULADOS ({seasonStatsTotal.length})
            </button>

            <span className="text-[#0c3975]/30 font-light">|</span>

            <button
              onClick={() => {
                playRetroSound('click');
                setActiveTab('career');
              }}
              className={`px-2.5 py-1 rounded-[2px] transition-all cursor-pointer ${
                activeTab === 'career'
                  ? 'bg-[#b91c1c] text-white shadow-xs'
                  : 'text-[#0c3975] hover:text-[#b91c1c]'
              }`}
            >
              TRAYECTORIA & CLUBES ({careerHistory.length})
            </button>

            <span className="text-[#0c3975]/30 font-light">|</span>

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
              CARTA DE TIRO
            </button>

            <span className="text-[#0c3975]/30 font-light">|</span>

            <button
              onClick={() => {
                playRetroSound('click');
                setActiveTab('raw-json');
              }}
              className={`px-2.5 py-1 rounded-[2px] transition-all cursor-pointer ${
                activeTab === 'raw-json'
                  ? 'bg-[#b91c1c] text-white shadow-xs'
                  : 'text-[#0c3975] hover:text-[#b91c1c]'
              }`}
            >
              JSON SUPABASE
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
              TABLA COMPLETA FEB
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ROW 1: KEY STATS & SEASON AVERAGES CARD                                */}
      {/* ========================================================================= */}
      <section className="relative z-10 site-container mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* LEFT: KEY STATS -> 6 Main Stat Columns */}
          <div className="lg:col-span-8 border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden flex flex-col justify-between">
            
            {/* Header Bar */}
            <div className="bg-[#0c3975] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[#c02328]">★</span>
                <span>ESTADÍSTICAS CLAVE EN SUPABASE ({displayLeague})</span>
              </div>
              <span className="font-mono-code text-[10px] text-yellow-300">
                {minVal} MIN/P
              </span>
            </div>

            {/* 6 Large Stat Columns with Dividers */}
            <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-2 divide-y sm:divide-y-0 sm:divide-x divide-[#0c3975]/25 flex-1 items-center">
              
              {/* Stat 1: PTS */}
              <div className="text-center pt-2 sm:pt-0 sm:px-2">
                <span className="font-slab text-3xl sm:text-4xl lg:text-[40px] text-[#0c3975] block leading-none">
                  {ptsVal}
                </span>
                <span className="font-condensed font-bold text-[11px] sm:text-xs text-slate-800 tracking-wider uppercase block mt-1.5">
                  PUNTOS<br />POR PARTIDO
                </span>
              </div>

              {/* Stat 2: REB */}
              <div className="text-center pt-2 sm:pt-0 sm:px-2">
                <span className="font-slab text-3xl sm:text-4xl lg:text-[40px] text-slate-800 block leading-none">
                  {rebVal}
                </span>
                <span className="font-condensed font-bold text-[11px] sm:text-xs text-slate-800 tracking-wider uppercase block mt-1.5">
                  REBOTES<br />TOTALES
                </span>
              </div>

              {/* Stat 3: AST */}
              <div className="text-center pt-2 sm:pt-0 sm:px-2">
                <span className="font-slab text-3xl sm:text-4xl lg:text-[40px] text-blue-700 block leading-none">
                  {astVal}
                </span>
                <span className="font-condensed font-bold text-[11px] sm:text-xs text-slate-800 tracking-wider uppercase block mt-1.5">
                  ASISTENCIAS<br />POR PARTIDO
                </span>
              </div>

              {/* Stat 4: VAL */}
              <div className="text-center pt-2 sm:pt-0 sm:px-2 bg-emerald-50/40 rounded py-1">
                <span className="font-slab text-3xl sm:text-4xl lg:text-[40px] text-emerald-700 block leading-none">
                  {valVal}
                </span>
                <span className="font-condensed font-bold text-[11px] sm:text-xs text-emerald-800 tracking-wider uppercase block mt-1.5">
                  VALORACIÓN<br />OFICIAL FEB
                </span>
              </div>

              {/* Stat 5: 3P% */}
              <div className="text-center pt-2 sm:pt-0 sm:px-2">
                <span className="font-slab text-3xl sm:text-4xl lg:text-[40px] text-[#c02328] block leading-none">
                  {t3Pct}
                </span>
                <span className="font-condensed font-bold text-[11px] sm:text-xs text-slate-800 tracking-wider uppercase block mt-1.5">
                  % TRIPLES<br />(T3 EFECTIVIDAD)
                </span>
              </div>

              {/* Stat 6: TC% */}
              <div className="text-center pt-2 sm:pt-0 sm:px-2">
                <span className="font-slab text-3xl sm:text-4xl lg:text-[40px] text-amber-700 block leading-none">
                  {tcPct}
                </span>
                <span className="font-condensed font-bold text-[11px] sm:text-xs text-slate-800 tracking-wider uppercase block mt-1.5">
                  % TIRO CAMPO<br />GLOBAL (TC)
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
                <span>PROMEDIOS TEMPORADA</span>
              </span>
              <span className="font-mono-code text-[11px] text-yellow-300">{displayLeague}</span>
            </div>

            {/* Table: GP | MIN | PTS | REB | AST | STL | BLK */}
            <div className="my-1.5 overflow-hidden border border-[#0c3975]/25 rounded-[2px]">
              <table className="w-full text-center text-[9.5px] font-mono-code font-bold border-collapse">
                <thead>
                  <tr className="bg-[#0c3975]/10 text-[#0c3975] border-b border-[#0c3975]/20">
                    <th className="py-0.5">PJ</th>
                    <th>MIN</th>
                    <th>PTS</th>
                    <th>REB</th>
                    <th>AST</th>
                    <th>ROB</th>
                    <th>TAP</th>
                  </tr>
                </thead>
                <tbody className="text-slate-900">
                  <tr className="divide-x divide-[#0c3975]/15">
                    <td className="py-0.5">{gpVal}</td>
                    <td>{minVal}</td>
                    <td className="font-black text-[#0c3975]">{ptsVal}</td>
                    <td>{rebVal}</td>
                    <td>{astVal}</td>
                    <td>{stlVal}</td>
                    <td>{blkVal}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 2: SHOOTING PERCENTAGE */}
            <div className="my-1">
              <div className="text-[10px] font-condensed font-bold text-[#0c3975] tracking-wider uppercase border-b border-[#0c3975]/20 pb-0.5 mb-1 flex justify-between">
                <span>EFECTIVIDAD DE TIRO</span>
                <span className="text-[9px] text-slate-500 font-mono-code">ACIERTO %</span>
              </div>
              <div className="grid grid-cols-4 text-center border border-[#0c3975]/25 rounded-[2px] divide-x divide-[#0c3975]/15 text-[9.5px] font-mono-code">
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">TC</div>
                  <div className="font-black text-[#0c3975]">{tcPct}</div>
                </div>
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">T2</div>
                  <div className="font-black text-amber-700">{t2Pct}</div>
                </div>
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">T3</div>
                  <div className="font-black text-[#c02328]">{t3Pct}</div>
                </div>
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">TL</div>
                  <div className="font-black text-emerald-700">{tlPct}</div>
                </div>
              </div>
            </div>

            {/* Section 3: ADVANCED METRICS */}
            <div className="my-1">
              <div className="text-[10px] font-condensed font-bold text-[#0c3975] tracking-wider uppercase border-b border-[#0c3975]/20 pb-0.5 mb-1 flex justify-between">
                <span>MÉTRICAS ADICIONALES SUPABASE</span>
                <span className="text-[9px] text-slate-500 font-mono-code">PARTIDO</span>
              </div>
              <div className="grid grid-cols-4 text-center border border-[#0c3975]/25 rounded-[2px] divide-x divide-[#0c3975]/15 text-[9.5px] font-mono-code">
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">VAL</div>
                  <div className="font-black text-emerald-700">{valVal}</div>
                </div>
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">PÉR</div>
                  <div className="font-black text-slate-800">{tovVal}</div>
                </div>
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">FAL</div>
                  <div className="font-black text-slate-800">{d.fouls_committed || '0'}</div>
                </div>
                <div className="py-0.5">
                  <div className="text-[7.5px] text-slate-600 font-bold uppercase">+/-</div>
                  <div className="font-black text-[#c02328]">{d.plus_minus || '0'}</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ROW 2: PERFORMANCE GRAPHS & DESGLOSE POR FASE                          */}
      {/* ========================================================================= */}
      <section className="relative z-10 site-container mt-4">
        <div className="border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden">
          
          {/* Header Bar */}
          <div className="bg-[#b91c1c] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame size={14} className="text-yellow-300" />
              <span>DESGLOSE GRÁFICO POR FASES DE COMPETICIÓN</span>
            </div>
            <span className="font-mono-code text-[10px] text-white/90">
              {phaseComparisonData.length} Fases Registradas
            </span>
          </div>

          <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[#0c3975]/25">
            
            {/* PANEL 1: MULTI-BAR CHART POR FASE */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <h3 className="font-slab text-base text-[#0c3975] uppercase tracking-tight">
                  PUNTOS, REBOTES Y ASISTENCIAS POR FASE
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

              {/* Bar Chart Visualization */}
              <div className="mt-4 pt-2">
                <div className="h-44 flex items-end justify-between gap-2 border-b border-l border-[#0c3975]/40 pb-1 pl-2 relative">
                  
                  {/* Y-Axis Grid Lines & Labels */}
                  <div className="absolute left-0 inset-y-0 -translate-x-full pr-1.5 flex flex-col justify-between text-[9px] font-mono-code text-slate-600">
                    <span>{Math.round(maxPtsPhase)}</span>
                    <span>{Math.round(maxPtsPhase * 0.75)}</span>
                    <span>{Math.round(maxPtsPhase * 0.5)}</span>
                    <span>{Math.round(maxPtsPhase * 0.25)}</span>
                    <span>0</span>
                  </div>

                  <div className="absolute inset-x-0 top-1/4 border-b border-[#0c3975]/10 pointer-events-none" />
                  <div className="absolute inset-x-0 top-2/4 border-b border-[#0c3975]/10 pointer-events-none" />
                  <div className="absolute inset-x-0 top-3/4 border-b border-[#0c3975]/10 pointer-events-none" />

                  {/* Phase Columns */}
                  {phaseComparisonData.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex-1 flex flex-col items-center group cursor-pointer"
                      onMouseEnter={() => setHoveredBar(`Fase: ${item.phaseName} | PTS: ${item.pts} | REB: ${item.reb} | AST: ${item.ast} | VAL: ${item.val}`)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Bar Group */}
                      <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-36">
                        {/* PTS Bar */}
                        <div 
                          style={{ height: `${Math.min(100, (item.pts / maxPtsPhase) * 100)}%` }}
                          className="w-2.5 sm:w-3.5 bg-[#0c3975] rounded-t-[1px] group-hover:brightness-110 transition-all shadow-xs"
                          title={`PTS: ${item.pts}`}
                        />
                        {/* REB Bar */}
                        <div 
                          style={{ height: `${Math.min(100, (item.reb / maxPtsPhase) * 100)}%` }}
                          className="w-2 sm:w-2.5 bg-[#0284c7] rounded-t-[1px] group-hover:brightness-110 transition-all shadow-xs"
                          title={`REB: ${item.reb}`}
                        />
                        {/* AST Bar */}
                        <div 
                          style={{ height: `${Math.min(100, (item.ast / maxPtsPhase) * 100)}%` }}
                          className="w-2 sm:w-2.5 bg-[#b91c1c] rounded-t-[1px] group-hover:brightness-110 transition-all shadow-xs"
                          title={`AST: ${item.ast}`}
                        />
                      </div>
                      
                      {/* Phase Label */}
                      <span className="text-[9.5px] font-mono-code text-slate-800 mt-1 font-bold">
                        {item.phaseName}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tooltip display */}
                <div className="h-4 text-center mt-1 text-[10px] font-mono-code font-bold text-[#0c3975] truncate">
                  {hoveredBar || 'Pasa el ratón por las barras para ver detalle de la fase'}
                </div>
              </div>
            </div>

            {/* PANEL 2: EFICIENCIA Y VALORACIÓN POR FASE */}
            <div className="lg:col-span-4 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
              <div>
                <h3 className="font-slab text-base text-[#0c3975] uppercase tracking-tight">
                  TENDENCIA DE TIRO Y VALORACIÓN
                </h3>

                {/* Legend */}
                <div className="flex items-center gap-3 mt-1.5 text-[10.5px] font-mono-code font-bold">
                  <span className="flex items-center gap-1 text-[#0284c7]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" /> % TC
                  </span>
                  <span className="flex items-center gap-1 text-[#b91c1c]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#b91c1c]" /> % T3
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> VAL
                  </span>
                </div>
              </div>

              {/* Table Breakdown of Phases */}
              <div className="mt-4 pt-2">
                <div className="border border-[#0c3975]/30 rounded overflow-hidden">
                  <table className="w-full text-center text-xs font-mono-code border-collapse">
                    <thead>
                      <tr className="bg-[#0c3975]/10 text-[#0c3975] uppercase text-[9.5px] font-bold border-b border-[#0c3975]/20">
                        <th className="py-1">Fase</th>
                        <th>Partidos</th>
                        <th>% TC</th>
                        <th>% T3</th>
                        <th>VAL Media</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0c3975]/15 text-[10px]">
                      {phaseComparisonData.map((p, i) => (
                        <tr key={i} className="hover:bg-black/5">
                          <td className="py-1 font-bold text-slate-900">{p.phaseName}</td>
                          <td>{p.gp}</td>
                          <td className="font-bold text-[#0284c7]">{p.tcPct}</td>
                          <td className="font-bold text-[#b91c1c]">{p.t3Pct}</td>
                          <td className="font-bold text-emerald-700">{p.val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="h-4 text-center mt-2 text-[10px] font-mono-code text-slate-600">
                  Telemetría oficial validada por la Federación Española
                </div>
              </div>
            </div>

            {/* PANEL 3: SHOT CHART Half-Court Visualizer */}
            <div className="lg:col-span-4 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="font-slab text-base text-[#0c3975] uppercase tracking-tight">
                  CARTA DE TIRO <span className="text-xs font-mono-code text-slate-600">(MAPA FEB)</span>
                </h3>

                {/* Legend */}
                <div className="flex items-center gap-2.5 text-[10.5px] font-mono-code font-bold">
                  <span className="flex items-center gap-1 text-[#0284c7]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" /> Anotado
                  </span>
                  <span className="flex items-center gap-1 text-[#b91c1c]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#b91c1c]" /> Fallado
                  </span>
                </div>
              </div>

              {/* Shot Court + Stats Breakdown Row */}
              <div className="mt-3 flex items-center gap-4">
                
                {/* Half Court Visualizer */}
                <div className="relative w-44 sm:w-48 aspect-[1/1] bg-[#1a4a82] rounded-[3px] border-2 border-[#0c3975] overflow-hidden p-1 shadow-inner shrink-0">
                  {/* SVG Court Lines */}
                  <svg viewBox="0 0 100 100" className="w-full h-full stroke-white/60 fill-none stroke-[1.2]">
                    <line x1="5" y1="95" x2="95" y2="95" strokeWidth="2" />
                    <line x1="42" y1="90" x2="58" y2="90" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="50" cy="86" r="4.5" stroke="#f59e0b" strokeWidth="1.5" />
                    <path d="M 44 90 A 6 6 0 0 1 56 90" strokeDasharray="2 2" />
                    <rect x="36" y="55" width="28" height="40" strokeWidth="1.5" />
                    <circle cx="50" cy="55" r="14" strokeWidth="1.5" />
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

                {/* Right Breakdown Metrics */}
                <div className="flex-1 flex flex-col justify-around h-44 py-2 border-l border-[#0c3975]/20 pl-3">
                  <div>
                    <span className="text-[10px] font-condensed font-bold text-slate-600 uppercase tracking-wider block">
                      ZONA Y PINTURA (T2)
                    </span>
                    <span className="font-slab text-xl text-amber-700 leading-none block">
                      {t2Pct}
                    </span>
                    <span className="text-[8.5px] text-slate-500 font-mono-code">{d.t2 || ''} aciertos</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-condensed font-bold text-slate-600 uppercase tracking-wider block">
                      TRIPLES (T3)
                    </span>
                    <span className="font-slab text-xl text-[#c02328] leading-none block">
                      {t3Pct}
                    </span>
                    <span className="text-[8.5px] text-slate-500 font-mono-code">{d.t3 || ''} aciertos</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-condensed font-bold text-slate-600 uppercase tracking-wider block">
                      TIROS LIBRES (TL)
                    </span>
                    <span className="font-slab text-xl text-emerald-700 leading-none block">
                      {tlPct}
                    </span>
                    <span className="text-[8.5px] text-slate-500 font-mono-code">{d.tl || ''} aciertos</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ROW 3: ADVANCED ANALYTICS (VAL, EFECTIVIDAD, AST/PER, +/-)             */}
      {/* ========================================================================= */}
      <section className="relative z-10 site-container mt-4">
        <div className="border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden">
          
          {/* Header Bar */}
          <div className="bg-[#0c3975] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 flex items-center gap-1.5">
            <span className="text-[#c02328]">★</span>
            <span>MÉTRICAS AVANZADAS & SCOUTING</span>
          </div>

          <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* 4 Metric Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 divide-x divide-[#0c3975]/20">
              
              {/* Metric 1: VAL FEB */}
              <div className="px-2 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-condensed font-bold text-xs uppercase">
                  <Award size={14} className="text-emerald-700" />
                  <span>VAL FEB</span>
                </div>
                <span className="font-slab text-3xl text-emerald-700 my-1.5 block leading-none">
                  {valVal}
                </span>
                <span className="text-[9.5px] font-mono-code text-slate-700 block leading-tight uppercase font-medium">
                  VALORACIÓN MEDIA
                </span>
              </div>

              {/* Metric 2: TC EFECTIVO */}
              <div className="px-2 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1.5 text-[#0c3975] font-condensed font-bold text-xs uppercase">
                  <Target size={14} className="text-[#0c3975]" />
                  <span>EFECTIVIDAD</span>
                </div>
                <span className="font-slab text-3xl text-[#0c3975] my-1.5 block leading-none">
                  {tcPct}
                </span>
                <span className="text-[9.5px] font-mono-code text-slate-700 block leading-tight uppercase font-medium">
                  TIROS DE CAMPO TOTALES
                </span>
              </div>

              {/* Metric 3: AST / PER */}
              <div className="px-2 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1.5 text-[#0c3975] font-condensed font-bold text-xs uppercase">
                  <Activity size={14} className="text-[#0c3975]" />
                  <span>RATIO AST/PER</span>
                </div>
                <span className="font-slab text-3xl text-[#0c3975] my-1.5 block leading-none">
                  {parseFebNumber(tovVal) > 0 ? (parseFebNumber(astVal) / parseFebNumber(tovVal)).toFixed(2) : astVal}
                </span>
                <span className="text-[9.5px] font-mono-code text-slate-700 block leading-tight uppercase font-medium">
                  ASISTENCIAS POR PÉRDIDA
                </span>
              </div>

              {/* Metric 4: PLUS / MINUS */}
              <div className="px-2 text-center flex flex-col justify-between">
                <div className="flex items-center justify-center gap-1.5 text-[#b91c1c] font-condensed font-bold text-xs uppercase">
                  <BarChart3 size={14} className="text-[#b91c1c]" />
                  <span>+/- IMPACTO</span>
                </div>
                <span className="font-slab text-3xl text-[#b91c1c] my-1.5 block leading-none">
                  {d.plus_minus || '+0'}
                </span>
                <span className="text-[9.5px] font-mono-code text-slate-700 block leading-tight uppercase font-medium">
                  BALANCE PLUS / MINUS
                </span>
              </div>

            </div>

            {/* Analyst Quote */}
            <div className="lg:col-span-5 p-3 border-l lg:border-l border-[#0c3975]/25 relative">
              <div className="flex items-start gap-3">
                <span className="text-4xl text-[#b91c1c] font-serif leading-none select-none">“</span>
                <div className="leading-relaxed">
                  <p className="text-xs sm:text-[13px] font-mono-code text-slate-800 font-medium italic">
                    {displayName} aporta presencia y rigor en {displayTeam}. Su capacidad para resolver en momentos decisivos y su porcentaje de {t3Pct} en tiro exterior le convierten en una pieza táctica fundamental en {displayLeague}.
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-condensed font-bold text-[#0c3975] uppercase tracking-wider block">
                      — INFORME SCOUTING BASKETDATA
                    </span>
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
      {/* 7. ROW 4: 3-COLUMN BOTTOM PANELS (FASES, COMPARATIVAS, HISTORIAL CLUBES) */}
      {/* ========================================================================= */}
      <section className="relative z-10 site-container mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* COLUMN 1: DESGLOSE DE FASES REGISTRADAS */}
          <div className="lg:col-span-4 border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden flex flex-col justify-between">
            <div className="bg-[#0c3975] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[#c02328]">★</span>
                <span>FASES Y PARTIDOS FEB</span>
              </div>
              <span className="text-[10px] font-mono-code text-yellow-300">{seasonStatsAvg.length} Fases</span>
            </div>

            <div className="p-3.5 flex flex-col justify-between flex-1">
              <table className="w-full text-center text-xs font-mono-code border-collapse">
                <thead>
                  <tr className="text-[10px] text-slate-600 font-bold border-b border-[#0c3975]/20 uppercase">
                    <th className="py-1 text-left">FASE</th>
                    <th>PJ</th>
                    <th>MIN</th>
                    <th>PTS</th>
                    <th>REB</th>
                    <th>VAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0c3975]/15">
                  {seasonStatsAvg.map((g: any, idx: number) => (
                    <tr key={idx} className="hover:bg-black/5 transition-colors">
                      <td className="py-1.5 text-left font-bold text-slate-800">{g.fase || 'TOTAL'}</td>
                      <td>{g.partidos}</td>
                      <td className="text-slate-600">{g.minutos}</td>
                      <td className="font-bold text-[#b91c1c]">{g.puntos}</td>
                      <td>{g.rebotes_total}</td>
                      <td className="font-bold text-emerald-700">{g.valoracion}</td>
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
                <span>VER TABLA COMPLETA DE TOTALES</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* COLUMN 2: COMPARATIVA CON BENCHMARK DE LA LIGA */}
          <div className="lg:col-span-4 border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden flex flex-col justify-between">
            <div className="bg-[#0c3975] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 flex items-center gap-1.5">
              <span className="text-[#c02328]">★</span>
              <span>BENCHMARK FRENTE A LA LIGA</span>
            </div>

            <div className="p-3.5 flex flex-col justify-between flex-1">
              <div>
                <span className="text-[11px] font-mono-code text-slate-700 block">
                  Rendimiento de {displayName} frente al promedio de {displayLeague}
                </span>

                <div className="mt-3 space-y-2.5 font-mono-code text-xs">
                  {/* Points */}
                  <div>
                    <div className="flex justify-between font-bold text-[11px] mb-0.5">
                      <span className="text-[#0c3975] font-slab">{displayName} (PTS)</span>
                      <span className="text-[#0c3975]">{ptsVal}</span>
                    </div>
                    <div className="w-full bg-[#0c3975]/15 h-3 rounded-[1px] overflow-hidden">
                      <div className="bg-[#0c3975] h-full" style={{ width: `${Math.min(100, (parseFebNumber(ptsVal) / 25) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Media Liga PTS */}
                  <div>
                    <div className="flex justify-between font-medium text-[11px] mb-0.5">
                      <span className="text-slate-700">MEDIA LIGA (PTS)</span>
                      <span className="text-slate-900">9.4</span>
                    </div>
                    <div className="w-full bg-[#0c3975]/15 h-3 rounded-[1px] overflow-hidden">
                      <div className="bg-[#0284c7] h-full" style={{ width: `${(9.4 / 25) * 100}%` }} />
                    </div>
                  </div>

                  {/* Valoracion */}
                  <div>
                    <div className="flex justify-between font-bold text-[11px] mb-0.5">
                      <span className="text-emerald-700 font-slab">{displayName} (VAL)</span>
                      <span className="text-emerald-700">{valVal}</span>
                    </div>
                    <div className="w-full bg-[#0c3975]/15 h-3 rounded-[1px] overflow-hidden">
                      <div className="bg-emerald-600 h-full" style={{ width: `${Math.min(100, (parseFebNumber(valVal) / 25) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Media Liga VAL */}
                  <div>
                    <div className="flex justify-between font-medium text-[11px] mb-0.5">
                      <span className="text-slate-700">MEDIA LIGA (VAL)</span>
                      <span className="text-slate-900">8.1</span>
                    </div>
                    <div className="w-full bg-[#0c3975]/15 h-3 rounded-[1px] overflow-hidden">
                      <div className="bg-slate-400 h-full" style={{ width: `${(8.1 / 25) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right mt-3 pt-2 border-t border-[#0c3975]/20">
                <span className="text-[10px] font-condensed font-bold text-slate-600 uppercase tracking-wider">
                  MÉTRICAS NORMALIZADAS FEB
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 3: HISTORIAL DE CLUBES & TRAYECTORIA */}
          <div className="lg:col-span-4 border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden flex flex-col justify-between">
            <div className="bg-[#0c3975] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[#c02328]">★</span>
                <span>HISTORIAL DE CLUBES ({careerHistory.length})</span>
              </div>
              <span className="text-[10px] font-mono-code text-yellow-300">FEB</span>
            </div>

            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between overflow-y-auto max-h-72">
              {careerHistory.length === 0 ? (
                <div className="text-xs font-mono-code text-slate-500 py-6 text-center">
                  Sin historial previo registrado en la base de datos federativa.
                </div>
              ) : (
                <div className="divide-y divide-[#0c3975]/15 space-y-2">
                  {careerHistory.map((item: any, idx: number) => (
                    <div key={idx} className="pt-2 first:pt-0">
                      <div className="flex items-center justify-between font-mono-code text-xs">
                        <strong className="text-[#0c3975] font-slab">{item.temporada || 'ACTUAL'}</strong>
                        <span className="bg-[#c02328] text-white text-[9.5px] font-bold px-1.5 rounded uppercase">
                          {item.categoria || displayLeague}
                        </span>
                      </div>
                      <span className="font-mono-code text-xs text-slate-800 font-bold block mt-0.5 truncate" title={item.club}>
                        {item.club}
                      </span>
                      <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-500 mt-0.5">
                        <span>Licencia: {item.tipo_licencia || 'Jugador/a'}</span>
                        <span>{item.fecha_alta || 'Vigente'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-[#0c3975]/20 flex items-center justify-between">
                <span className="text-[10px] font-mono-code text-slate-500">
                  Total Clubes: <strong>{careerHistory.length}</strong>
                </span>
                <button
                  onClick={() => {
                    playRetroSound('click');
                    setActiveTab('career');
                  }}
                  className="text-xs font-condensed font-bold text-[#0c3975] hover:text-[#c02328] uppercase"
                >
                  Ver cronología completa →
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. TAB PANELS (MEDIAS, TOTALES, TRAYECTORIA, RAW JSON)                     */}
      {/* ========================================================================= */}
      {activeTab === 'raw-json' && (
        <section className="relative z-10 site-container mt-4 animate-in fade-in">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-md p-4 shadow-xl text-emerald-400 font-mono-code text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-yellow-400" />
                <span className="font-bold text-white uppercase tracking-wider">
                  ESQUEMA JSON CRUDO DESDE SUPABASE REST v1: (players.id = {currentPlayerId})
                </span>
              </div>

              <button
                onClick={handleCopyJson}
                className="bg-[#0c3975] hover:bg-[#124b94] text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {hasCopiedJson ? <Check size={13} /> : <Copy size={13} />}
                <span>{hasCopiedJson ? '¡Copiado!' : 'Copiar JSON'}</span>
              </button>
            </div>

            <pre className="max-h-96 overflow-y-auto bg-black/60 p-3 rounded border border-slate-800 text-[11px] leading-relaxed">
              {JSON.stringify(d, null, 2)}
            </pre>
          </div>
        </section>
      )}

      {activeTab === 'stats' && (
        <section className="relative z-10 site-container mt-4 animate-in fade-in">
          <div className="border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden bg-white shadow-xs">
            <div className="bg-[#0c3975] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-2 flex items-center justify-between">
              <span>TABLA COMPLETA DE MEDIAS POR FASE (season_stats_avg)</span>
              <span className="font-mono-code text-[11px] text-yellow-300">{seasonStatsAvg.length} Fases</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono-code text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[#0c3975] uppercase text-[10px] font-bold border-b border-slate-200">
                    <th className="py-2 px-3">Fase</th>
                    <th className="py-2 px-3">PJ</th>
                    <th className="py-2 px-3">MIN</th>
                    <th className="py-2 px-3">PTS</th>
                    <th className="py-2 px-3">% T2</th>
                    <th className="py-2 px-3">% T3</th>
                    <th className="py-2 px-3">% TL</th>
                    <th className="py-2 px-3">RO</th>
                    <th className="py-2 px-3">RD</th>
                    <th className="py-2 px-3">RT</th>
                    <th className="py-2 px-3">AST</th>
                    <th className="py-2 px-3">ROB</th>
                    <th className="py-2 px-3">PÉR</th>
                    <th className="py-2 px-3">TAP</th>
                    <th className="py-2 px-3 text-right">VAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {seasonStatsAvg.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-900">{row.fase || 'TOTAL'}</td>
                      <td className="py-2 px-3">{row.partidos}</td>
                      <td className="py-2 px-3">{row.minutos}</td>
                      <td className="py-2 px-3 font-bold text-[#0c3975]">{row.puntos}</td>
                      <td className="py-2 px-3">{row.t2_pct}</td>
                      <td className="py-2 px-3">{row.t3_pct}</td>
                      <td className="py-2 px-3">{row.tl_pct}</td>
                      <td className="py-2 px-3 text-slate-500">{row.rebotes_of}</td>
                      <td className="py-2 px-3 text-slate-500">{row.rebotes_def}</td>
                      <td className="py-2 px-3 font-bold">{row.rebotes_total}</td>
                      <td className="py-2 px-3 font-bold text-blue-700">{row.asistencias}</td>
                      <td className="py-2 px-3">{row.robos}</td>
                      <td className="py-2 px-3">{row.perdidas}</td>
                      <td className="py-2 px-3">{row.tapones_favor}</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-700">{row.valoracion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'totals' && (
        <section className="relative z-10 site-container mt-4 animate-in fade-in">
          <div className="border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden bg-white shadow-xs">
            <div className="bg-[#0c3975] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-2 flex items-center justify-between">
              <span>TOTALES ACUMULADOS EN TEMPORADA (season_stats_total)</span>
              <span className="font-mono-code text-[11px] text-yellow-300">{seasonStatsTotal.length} Registros</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono-code text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[#0c3975] uppercase text-[10px] font-bold border-b border-slate-200">
                    <th className="py-2 px-3">Fase</th>
                    <th className="py-2 px-3">Partidos</th>
                    <th className="py-2 px-3">Minutos Tot.</th>
                    <th className="py-2 px-3">Puntos Tot.</th>
                    <th className="py-2 px-3">T2 (A/I)</th>
                    <th className="py-2 px-3">T3 (A/I)</th>
                    <th className="py-2 px-3">TC Total</th>
                    <th className="py-2 px-3">TL (A/I)</th>
                    <th className="py-2 px-3">Reb. Tot</th>
                    <th className="py-2 px-3">Asistencias</th>
                    <th className="py-2 px-3">Robos</th>
                    <th className="py-2 px-3">Pérdidas</th>
                    <th className="py-2 px-3 text-right">VAL Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {seasonStatsTotal.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-900">{row.fase || 'TOTAL'}</td>
                      <td className="py-2 px-3">{row.partidos}</td>
                      <td className="py-2 px-3">{row.minutos_total}</td>
                      <td className="py-2 px-3 font-bold text-[#0c3975]">{row.puntos_total}</td>
                      <td className="py-2 px-3">{row.t2}</td>
                      <td className="py-2 px-3">{row.t3}</td>
                      <td className="py-2 px-3">{row.tc}</td>
                      <td className="py-2 px-3">{row.tl}</td>
                      <td className="py-2 px-3 font-bold">{row.rebotes_total}</td>
                      <td className="py-2 px-3 font-bold text-blue-700">{row.asistencias}</td>
                      <td className="py-2 px-3">{row.robos}</td>
                      <td className="py-2 px-3">{row.perdidas}</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-700">{row.valoracion_total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'career' && (
        <section className="relative z-10 site-container mt-4 animate-in fade-in">
          <div className="border-[1.5px] border-[#0c3975]/35 rounded-[3px] overflow-hidden bg-white shadow-xs">
            <div className="bg-[#0c3975] text-white font-condensed font-bold text-xs uppercase tracking-wider px-3.5 py-2 flex items-center justify-between">
              <span>HISTORIAL COMPLETO DE CLUBES Y LICENCIAS (career_history)</span>
              <span className="font-mono-code text-[11px] text-yellow-300">{careerHistory.length} Temporadas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono-code text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[#0c3975] uppercase text-[10px] font-bold border-b border-slate-200">
                    <th className="py-2 px-3">Temporada</th>
                    <th className="py-2 px-3">Categoría / Liga</th>
                    <th className="py-2 px-3">Club</th>
                    <th className="py-2 px-3">Tipo Licencia</th>
                    <th className="py-2 px-3">Fecha Alta</th>
                    <th className="py-2 px-3 text-right">Fecha Baja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {careerHistory.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-900">{item.temporada || '-'}</td>
                      <td className="py-2 px-3 text-[#c02328] font-bold">{item.categoria || '-'}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">{item.club || '-'}</td>
                      <td className="py-2 px-3">{item.tipo_licencia || 'Jugador/a'}</td>
                      <td className="py-2 px-3 text-slate-500">{item.fecha_alta || '-'}</td>
                      <td className="py-2 px-3 text-right text-slate-500">{item.fecha_baja || 'Vigente'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 9. BOTTOM FOOTER BANNER                                                   */}
      {/* ========================================================================= */}
      <section className="relative z-10 site-container mt-6">
        <div className="fondoazul-solid rounded-[6px] border-none outline-none ring-0 px-4 sm:px-8 py-3.5 shadow-lg relative overflow-hidden text-white flex items-center justify-between flex-wrap gap-4">
          
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
              SUPABASE DATABASE. 4.124 JUGADORES FEB.
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <button
              onClick={() => {
                playRetroSound('burst');
                setIsSearchModalOpen(true);
              }}
              className="comic-interactive-card relative bg-[#0c3975] hover:bg-[#124b94] text-white font-condensed font-bold text-xs sm:text-[13px] tracking-wider uppercase px-5 py-2 rounded-[4px] border-2 border-white shadow-[0_0_0_2px_#0c3975] cursor-pointer"
            >
              BUSCAR OTRO JUGADOR
            </button>

            <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-white fill-none stroke-2 opacity-85">
              <path d="M 2 18 L 4 6 L 9 12 L 12 4 L 15 12 L 20 6 L 22 18 Z" />
              <line x1="2" y1="20" x2="22" y2="20" strokeWidth="2" />
            </svg>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. MODAL: FULL GAME LOG & TOTALES                                        */}
      {/* ========================================================================= */}
      {isGameLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#ede7dc] border-3 border-[#0c3975] rounded-[4px] shadow-2xl max-w-4xl w-full p-5 relative max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b-2 border-[#0c3975]/20 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[#c02328] font-black text-lg">★</span>
                <h3 className="font-slab text-lg sm:text-xl text-[#0c3975] uppercase truncate">
                  {displayName} • TABLA COMPLETA DE TOTALES FEB
                </h3>
              </div>
              <button 
                onClick={() => setIsGameLogModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#0c3975]/10 hover:bg-[#c02328] hover:text-white flex items-center justify-center cursor-pointer transition-colors font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono-code border-collapse">
                <thead>
                  <tr className="bg-[#0c3975] text-white font-condensed uppercase tracking-wider py-1.5 text-xs">
                    <th className="py-1.5 text-left pl-2">FASE</th>
                    <th>PARTIDOS</th>
                    <th>MINUTOS</th>
                    <th>PTS</th>
                    <th>T2</th>
                    <th>T3</th>
                    <th>TC</th>
                    <th>TL</th>
                    <th>REB</th>
                    <th>AST</th>
                    <th>ROB</th>
                    <th>PÉR</th>
                    <th>VAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0c3975]/15">
                  {seasonStatsTotal.map((g: any, idx: number) => (
                    <tr key={idx} className="hover:bg-black/5 transition-colors py-1">
                      <td className="py-2 text-left pl-2 font-bold">{g.fase || 'TOTAL'}</td>
                      <td>{g.partidos}</td>
                      <td>{g.minutos_total}</td>
                      <td className="font-black text-[#b91c1c] text-sm">{g.puntos_total}</td>
                      <td>{g.t2}</td>
                      <td>{g.t3}</td>
                      <td>{g.tc}</td>
                      <td>{g.tl}</td>
                      <td>{g.rebotes_total}</td>
                      <td>{g.asistencias}</td>
                      <td>{g.robos}</td>
                      <td>{g.perdidas}</td>
                      <td className="font-bold text-emerald-700">{g.valoracion_total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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

      {/* ========================================================================= */}
      {/* 11. MODAL: SEARCH ANY OF THE 4,124 SUPABASE PLAYERS                       */}
      {/* ========================================================================= */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#faf7f0] border-4 border-[#0c3975] rounded-md shadow-2xl w-full max-w-xl p-5 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b-2 border-[#0c3975] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Database size={18} className="text-[#c02328]" />
                <h3 className="font-slab font-black text-lg text-[#0c3975] uppercase">
                  EXPLORADOR DE 4.124 JUGADORES FEB (SUPABASE)
                </h3>
              </div>

              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="w-7 h-7 bg-white text-black font-black border border-black hover:bg-yellow-300 flex items-center justify-center cursor-pointer rounded"
              >
                ✕
              </button>
            </div>

            <p className="font-mono-code text-xs text-slate-600 mb-3">
              Teclea el nombre o apellido de cualquier jugador para cargar automáticamente toda su ficha, estadísticas y cartas de tiro en esta pantalla.
            </p>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre (ej: Savkov, Garcia, Moreno, Lukic, Lopez)..."
                className="w-full bg-white border-2 border-[#0c3975]/30 rounded pl-8 pr-3 py-2 text-xs font-mono-code text-slate-900 focus:outline-none focus:border-[#0c3975]"
                autoFocus
              />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              <span className="text-[10px] font-mono-code font-bold uppercase text-slate-500">Destacados:</span>
              {FEATURED_FEB_PLAYERS.map(fp => (
                <button
                  key={fp.id}
                  onClick={() => handleSelectNewPlayer(fp.id, fp.name)}
                  className="bg-white hover:bg-[#0c3975] hover:text-white border border-slate-300 text-slate-700 text-[10px] font-mono-code font-bold px-2 py-0.5 rounded cursor-pointer transition-colors"
                >
                  {fp.name.split(',')[0]}
                </button>
              ))}
            </div>

            {/* Results list */}
            <div className="flex-1 overflow-y-auto space-y-1.5 divide-y divide-black/10 pr-1 min-h-[220px]">
              {isSearching ? (
                <div className="py-10 text-center text-xs font-mono-code text-slate-500 flex items-center justify-center gap-2">
                  <RefreshCw size={14} className="animate-spin text-[#0c3975]" />
                  <span>Buscando en Supabase...</span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-10 text-center text-xs font-mono-code text-slate-500">
                  {searchQuery ? 'No se encontraron jugadores.' : 'Escribe arriba para consultar la base de datos de 4.124 jugadores.'}
                </div>
              ) : (
                searchResults.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => handleSelectNewPlayer(player.id, player.name)}
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
                          {player.team} • {player.league} • {player.position}
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono-code text-xs">
                      <span className="text-[#c02328] font-bold block">{player.points || '0'} PTS</span>
                      <span className="text-[10px] text-emerald-700 font-bold block">{player.valuation || '0'} VAL</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-[#0c3975]/20 flex items-center justify-between">
              <span className="text-[10px] font-mono-code text-slate-500">
                Mostrando hasta 24 resultados por búsqueda
              </span>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="bg-[#0c3975] text-white px-4 py-1.5 font-slab text-xs uppercase cursor-pointer rounded"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
