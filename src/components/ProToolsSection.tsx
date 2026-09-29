import React, { useState } from 'react';
import { 
  Bot, 
  TrendingUp, 
  CalendarDays, 
  ClipboardCheck, 
  Search, 
  Video, 
  X,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { playRetroSound } from '../utils/audio';
import { homeContent } from '../data/homeContent';
import waxtarjetaImg from '../assets/images/waxtarjeta.png';

interface ProToolsSectionProps {
  onShowToast: (msg: string) => void;
}

interface ProToolItem {
  id: string;
  name: string;
  badge: 'ACTIVO' | 'PRÓXIMAMENTE';
  description: string;
  iconType: 'bot' | 'panel' | 'trending' | 'calendar' | 'scout' | 'search' | 'video' | 'crown';
  modalTitle: string;
  modalCategory: string;
  statsPreview: { label: string; value: string; detail: string }[];
  actionPrompt: string;
}

const PRO_TOOLS_DATA: ProToolItem[] = [
  {
    id: 'asistente-auto',
    name: 'ASISTENTE AUTOMÁTICO',
    badge: 'ACTIVO',
    description: 'Configura una vez y recibe alertas e informes sin hacer nada más.',
    iconType: 'bot',
    modalTitle: 'ASISTENTE AUTOMÁTICO DE SCOUTING & ALERTAS',
    modalCategory: 'AUTOMATIZACIÓN & ALERTAS EN TIEMPO REAL',
    statsPreview: [
      { label: 'Informes Enviados', value: '1,420+', detail: 'Entregados tras cada partido' },
      { label: 'Tiempo de Ahorro', value: '4.5 hrs/sem', detail: 'Por analista principal' },
      { label: 'Precisión Disparador', value: '99.4%', detail: 'Filtros de telemetría' },
    ],
    actionPrompt: 'CONFIGURAR REGLAS DE ALERTA'
  },
  {
    id: 'panel-analisis',
    name: 'PANEL DE ANÁLISIS PRO',
    badge: 'ACTIVO',
    description: 'Rendimiento, predicciones IA y alertas de fatiga en un solo panel.',
    iconType: 'panel',
    modalTitle: 'PANEL DE ANÁLISIS PRO CON TELEMETRÍA',
    modalCategory: 'MÉTRICAS AVANZADAS & PREDICTIVAS',
    statsPreview: [
      { label: 'Offensive Rating', value: '119.8', detail: 'Top 5% en la liga' },
      { label: 'Predictive Win%', value: '78.4%', detail: 'Modelo probabilístico IA' },
      { label: 'Índice de Fatiga', value: '18.2%', detail: 'Nivel óptimo de recuperación' },
    ],
    actionPrompt: 'ABRIR TELEMETRÍA EN DIRECTO'
  },
  {
    id: 'alertas-rendimiento',
    name: 'ALERTAS RENDIMIENTO',
    badge: 'ACTIVO',
    description: 'Monitorea cambios significativos en jugadores.',
    iconType: 'trending',
    modalTitle: 'SISTEMA DE DETECCIÓN DE ANOMALÍAS DE RENDIMIENTO',
    modalCategory: 'MONITORIZACIÓN Y ANÁLISIS DE TENDENCIAS',
    statsPreview: [
      { label: 'Caída de Acierto 3P', value: '-8.5%', detail: 'En partidos sin 48h de descanso' },
      { label: 'Picos de Carga', value: '+14%', detail: 'Últimos 3 minutos del 4º cuarto' },
      { label: 'Eficacia en Transición', value: '1.34 PPP', detail: 'Supera el percentil 92' },
    ],
    actionPrompt: 'CALIBRAR UMBRALES DE ALERTA'
  },
  {
    id: 'planificacion',
    name: 'PLANIFICACIÓN',
    badge: 'ACTIVO',
    description: 'Calendario, plantilla y fichajes de tu equipo en un solo sitio.',
    iconType: 'calendar',
    modalTitle: 'PLANIFICADOR TÁCTICO & GESTIÓN DE PLANTILLA',
    modalCategory: 'CALENDARIO Y ASIGNACIÓN DE MINUTOS',
    statsPreview: [
      { label: 'Carga Semanal', value: '3 Partidos', detail: '1 Back-to-back detectado' },
      { label: 'Disponibilidad Roster', value: '93.3%', detail: '14 de 15 jugadores activos' },
      { label: 'Minutos Proyectados', value: '240.0 min', detail: 'Rotación balanceada de 9 hombres' },
    ],
    actionPrompt: 'EDITAR ROTACIÓN Y CALENDARIO'
  },
  {
    id: 'scout-arbitral',
    name: 'SCOUT ARBITRAL',
    badge: 'ACTIVO',
    description: 'Analiza tendencias arbitrales y prepara tu estrategia.',
    iconType: 'scout',
    modalTitle: 'DOSSIER ARBITRAL & SESGO DE PISTADA',
    modalCategory: 'SCOUTING ARBITRAL & GESTIÓN DE FALTAS',
    statsPreview: [
      { label: 'Faltas / 48 min', value: '41.2', detail: 'Trío asignado arbitra por encima de la media' },
      { label: 'Sesgo Local / Visitante', value: '+3.1%', detail: 'Margen favorable en tiros libres local' },
      { label: 'Técnicas por Partido', value: '0.85', detail: 'Tolerancia baja a protestas en transición' },
    ],
    actionPrompt: 'VER REPORTE ARBITRAL COMPLETO'
  },
  {
    id: 'ojeador-ia',
    name: 'OJEADOR IA',
    badge: 'ACTIVO',
    description: 'Detecta jugadores emergentes con inteligencia artificial.',
    iconType: 'search',
    modalTitle: 'RADAR DE TALENTO & CLUSTERING IA',
    modalCategory: 'SCOUTING DE PROSPECTOS & COMPARATIVAS',
    statsPreview: [
      { label: 'Similitud de Perfil', value: '94.2%', detail: 'Coincide con perfil Luka Dončić a los 21' },
      { label: 'Índice de Proyección', value: '91 / 100', detail: 'Impacto potencial All-Star' },
      { label: 'True Shooting Proyectado', value: '62.4%', detail: 'Ajustado a volumen de posesión' },
    ],
    actionPrompt: 'INICIAR BÚSQUEDA DE PROSPECTOS'
  },
  {
    id: 'video-automatico',
    name: 'ANÁLISIS DE VÍDEO AUTOMÁTICO',
    badge: 'PRÓXIMAMENTE',
    description: 'Sube tus partidos y obtén clips y stats generados por IA.',
    iconType: 'video',
    modalTitle: 'PROCESADOR AUTOMATIZADO DE VÍDEO Y CLIPS IA',
    modalCategory: 'COMPUTER VISION EN PISTA (PRÓXIMAMENTE)',
    statsPreview: [
      { label: 'Segmentación', value: 'Automática', detail: 'Reconocimiento de P&R e Isolation' },
      { label: 'Clips por Partido', value: '180+ cortes', detail: 'Etiquetado en menos de 9 minutos' },
      { label: 'Resolución Máxima', value: '4K 60fps', detail: 'Mapeo espacial de coordenadas X/Y' },
    ],
    actionPrompt: 'UNIRSE A LISTA DE ESPERA VIP'
  },
  {
    id: 'modo-estrategia',
    name: 'MODO ESTRATEGIA',
    badge: 'PRÓXIMAMENTE',
    description: 'Simulaciones, escenarios y recomendaciones tácticas.',
    iconType: 'crown',
    modalTitle: 'MOTOR DE SIMULACIÓN TÁCTICA MONTE CARLO',
    modalCategory: 'WAR ROOM DE ESTRATEGIA (PRÓXIMAMENTE)',
    statsPreview: [
      { label: 'Simulaciones / seg', value: '10,000 runs', detail: 'Modelos de finales de partido apretados' },
      { label: 'Defensa Óptima', value: 'Drop Coverage', detail: 'Limita efectividad rival al 41.2% eFG' },
      { label: 'Acierto Estratégico', value: '+4.8 pts net', detail: 'Ventaja neta esperada por cada 100 posesiones' },
    ],
    actionPrompt: 'SOLICITAR DEMO TÁCTICA PRIVADA'
  },
];

/* -------------------------------------------------------------------------- */
/* EXACT REPLICAS OF THE 3 USER-UPLOADED CROPS (PIXEL-PERFECT SVGS)          */
/* -------------------------------------------------------------------------- */

// 1. Chalk Basketball (Crop 1: Captura de pantalla 2026-09-28 232129.png)
const ChalkBasketballCrop: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`${className} shrink-0 filter drop-shadow-[0_0_1.5px_rgba(255,255,255,0.7)]`}
  >
    {/* Outer chalk circle */}
    <circle cx="50" cy="50" r="41" fill="none" stroke="white" strokeWidth="4.2" strokeLinecap="round" />
    
    {/* Horizontal curved seam */}
    <path d="M 9 52 Q 50 63 91 52" fill="none" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    
    {/* Center radiating spokes (starburst basketball seams) */}
    <path d="M 53 9 Q 58 50 52 91" fill="none" stroke="white" strokeWidth="3.6" strokeLinecap="round" />
    <line x1="56" y1="53" x2="23" y2="22" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <line x1="56" y1="53" x2="69" y2="11" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <line x1="56" y1="53" x2="89" y2="33" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <line x1="56" y1="53" x2="86" y2="73" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <line x1="56" y1="53" x2="41" y2="90" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <line x1="56" y1="53" x2="16" y2="76" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <line x1="56" y1="53" x2="9" y2="48" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
  </svg>
);

// 2. White Chalk Crown (Crop 2: Captura de pantalla 2026-09-28 232138.png)
const WhiteChalkCrownCrop: React.FC<{ className?: string }> = ({ className = "w-8 h-6" }) => (
  <svg 
    viewBox="0 0 100 80" 
    className={`${className} shrink-0 filter drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]`}
  >
    <polygon 
      points="12,68 88,68 82,24 64,48 50,13 36,48 18,24" 
      fill="none" 
      stroke="white" 
      strokeWidth="5.5" 
      strokeLinejoin="round" 
      strokeLinecap="round" 
    />
  </svg>
);

// 3. Gold Crown With Separate Underline Bar (Crop 3: Captura de pantalla 2026-09-28 232151.png)
const GoldCrownWithBarCrop: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg 
    viewBox="0 0 100 92" 
    className={`${className} shrink-0 filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]`}
  >
    {/* 3-peak hollow gold crown */}
    <polygon 
      points="14,64 86,64 80,20 62,44 50,11 38,44 20,20" 
      fill="none" 
      stroke="#f59e0b" 
      strokeWidth="6.5" 
      strokeLinejoin="round" 
      strokeLinecap="round" 
    />
    {/* Separate horizontal underline bar directly below */}
    <line 
      x1="22" 
      y1="82" 
      x2="78" 
      y2="82" 
      stroke="#f59e0b" 
      strokeWidth="6.5" 
      strokeLinecap="round" 
    />
  </svg>
);

export const ProToolsSection: React.FC<ProToolsSectionProps> = ({ onShowToast }) => {
  const [selectedTool, setSelectedTool] = useState<ProToolItem | null>(null);

  const renderIcon = (type: ProToolItem['iconType']) => {
    switch (type) {
      case 'bot':
        return <Bot size={22} strokeWidth={2.4} className="text-white" />;
      case 'panel':
        return (
          <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-white fill-none stroke-[2.2] stroke-linecap-round stroke-linejoin-round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            <path d="M12 13v5" />
            <path d="m9 16 3 3 3-3" />
          </svg>
        );
      case 'trending':
        return <TrendingUp size={22} strokeWidth={2.6} className="text-white" />;
      case 'calendar':
        return <CalendarDays size={22} strokeWidth={2.4} className="text-white" />;
      case 'scout':
        return <ClipboardCheck size={22} strokeWidth={2.4} className="text-white" />;
      case 'search':
        return <Search size={22} strokeWidth={2.6} className="text-white" />;
      case 'video':
        return <Video size={22} strokeWidth={2.4} className="text-white" />;
      case 'crown':
        // Card 8 Modo Estrategia uses the same crown motif in white
        return (
          <svg viewBox="0 0 100 92" className="w-[22px] h-[20px]">
            <polygon 
              points="14,64 86,64 80,20 62,44 50,11 38,44 20,20" 
              fill="none" 
              stroke="white" 
              strokeWidth="7" 
              strokeLinejoin="round" 
              strokeLinecap="round" 
            />
            <line 
              x1="22" 
              y1="82" 
              x2="78" 
              y2="82" 
              stroke="white" 
              strokeWidth="7" 
              strokeLinecap="round" 
            />
          </svg>
        );
    }
  };

  return (
    <div className="relative z-10 site-container mt-6 select-none font-sans">
      {/* ========================================================================= */}
      {/* 2. STANDALONE SECTION: HERRAMIENTAS PRO                                   */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-2 sm:py-4">
        
        {/* Section Header: Gold Crown With Bar (Crop 3) + HERRAMIENTAS PRO + Subtitle */}
        <div className="relative z-10 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            {/* Exactly Crop 3: 3-peak Gold Crown with separate underline bar */}
            <GoldCrownWithBarCrop className="w-9 h-8 sm:w-10 sm:h-9" />

            {/* Bold Slab Title: HERRAMIENTAS PRO */}
            <h2 className="font-slab text-2xl sm:text-3xl text-[#0c315e] tracking-wide uppercase font-black">
              {homeContent.proTools.sectionHeader.title}
            </h2>
          </div>

          {/* Subtitle in clean black monospaced style */}
          <p className="mt-2 text-black font-mono-code text-xs sm:text-[13px] leading-relaxed max-w-4xl">
            {homeContent.proTools.sectionHeader.subtitle}
          </p>
        </div>

        {/* ======================================================================= */}
        {/* 3. 8 PRO CARDS GRID (2 ROWS X 4 COLUMNS)                                */}
        {/* ======================================================================= */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {PRO_TOOLS_DATA.map((tool) => (
            <div
              key={tool.id}
              onClick={() => {
                playRetroSound('click');
                setSelectedTool(tool);
                onShowToast(`Abriendo ${tool.name} (${tool.badge})`);
              }}
              className="comic-interactive-card bg-[#faf7f0] rounded-[8px] p-4 sm:p-5 border-2 border-[#0c315e]/25 shadow-[4px_4px_0_rgba(12,49,94,0.18)] hover:border-[#0c315e]/60 hover:-translate-y-1 hover:shadow-[5px_5px_0_rgba(12,49,94,0.22)] transition-all duration-150 cursor-pointer group flex flex-col justify-between relative overflow-hidden min-h-[215px]"
            >
              {/* Background waxtarjeta image with high-definition card cover and vintage texture */}
              <img 
                src={waxtarjetaImg} 
                alt="" 
                aria-hidden="true" 
                draggable={false} 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0" 
              />

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  {/* Top Row: Navy Icon Box + Status Pill (ACTIVO or PRÓXIMAMENTE) */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {/* Dark Navy Square Icon Container */}
                    <div className="w-10 h-10 rounded-[6px] bg-[#0c315e] border border-[#061d3b] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      {renderIcon(tool.iconType)}
                    </div>

                    {/* Status Badge */}
                    {tool.badge === 'ACTIVO' ? (
                      <span className="bg-[#0b6645] text-white font-mono-code font-semibold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-[4px] shadow-2xs">
                        ACTIVO
                      </span>
                    ) : (
                      <span className="bg-[#4e5d6d] text-white font-mono-code font-semibold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-[4px] shadow-2xs">
                        PRÓXIMAMENTE
                      </span>
                    )}
                  </div>

                  {/* Card Title: Refined SemiBold Navy Display without excess bold */}
                  <h3 className="font-display font-semibold text-[15px] sm:text-[16px] text-[#0c315e] uppercase tracking-wide leading-tight transition-colors">
                    {tool.name}
                  </h3>

                  {/* Card Description */}
                  <p className="mt-2 text-[#3a4959] text-[12px] font-mono-code font-normal leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Bottom Action: Crimson EXPLORAR -> clean font-medium without excess bold */}
                <div className="mt-4 pt-2 border-t border-[#0c315e]/15 flex items-center justify-between text-[#c02328] font-mono-code font-medium text-xs uppercase tracking-wider group-hover:text-[#991b1b] transition-colors">
                  <span className="font-medium tracking-wide">EXPLORAR</span>
                  <ArrowRight size={13} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE PRO TOOL DETAIL MODAL                                      */}
      {/* ========================================================================= */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#f8f5ee] border-4 border-[#0c315e] rounded-md shadow-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b-2 border-[#0c315e] pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[6px] bg-[#0c315e] flex items-center justify-center shrink-0">
                  {renderIcon(selectedTool.iconType)}
                </div>
                <div>
                  <span className="font-mono-code text-[11px] font-bold text-[#c02328] tracking-widest uppercase block">
                    {selectedTool.modalCategory}
                  </span>
                  <h3 className="font-slab text-xl sm:text-2xl text-[#0c315e] uppercase">
                    {selectedTool.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  playRetroSound('click');
                  setSelectedTool(null);
                }}
                className="w-8 h-8 bg-white text-black font-black border-2 border-black hover:bg-yellow-300 flex items-center justify-center cursor-pointer rounded shadow-xs"
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>

            {/* Description & Overview */}
            <p className="text-sm font-mono-code text-slate-700 leading-relaxed mb-4">
              {selectedTool.description} Diseñado específicamente para entornos competitivos profesionales, integrando algoritmos de telemetría de juego y modelos predictivos directos.
            </p>

            {/* Pro Metrics Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              {selectedTool.statsPreview.map((stat, i) => (
                <div key={i} className="bg-white p-3 border-2 border-[#0c315e]/20 rounded shadow-xs">
                  <span className="font-mono-code text-[10px] text-slate-500 uppercase block font-semibold">
                    {stat.label}
                  </span>
                  <span className="font-slab text-xl text-[#0c315e] block my-0.5">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono-code leading-tight block">
                    {stat.detail}
                  </span>
                </div>
              ))}
            </div>

            {/* Interactive Feature Checklist */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-900/20 rounded text-xs font-mono-code space-y-2 mb-5">
              <div className="flex items-center gap-2 font-bold text-[#0c315e]">
                <CheckCircle2 size={15} className="text-green-700 shrink-0" />
                <span>Exportación instantánea a CSV, PDF y Webhooks automatizados.</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-[#0c315e]">
                <CheckCircle2 size={15} className="text-green-700 shrink-0" />
                <span>Compatible con sistemas de vídeo HUDL, Synergy y Second Spectrum.</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-[#0c315e]">
                <CheckCircle2 size={15} className="text-green-700 shrink-0" />
                <span>Sincronización en la nube con cifrado y control de permisos de cuerpo técnico.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  playRetroSound('burst');
                  onShowToast(`${selectedTool.name}: Acción ejecutada correctamente.`);
                  setSelectedTool(null);
                }}
                className="w-full sm:flex-1 bg-[#0c315e] text-white py-3 px-4 font-slab text-xs uppercase cursor-pointer rounded shadow-md hover:bg-[#124584] transition-colors flex items-center justify-center gap-2"
              >
                <span>{selectedTool.actionPrompt}</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => {
                  playRetroSound('click');
                  setSelectedTool(null);
                }}
                className="w-full sm:w-auto bg-white border-2 border-black text-black py-3 px-5 font-slab text-xs uppercase cursor-pointer rounded hover:bg-slate-100 transition-colors"
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
