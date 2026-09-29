import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Cpu, 
  ClipboardCheck, 
  ArrowRight, 
  Check, 
  Sparkles,
  Flame,
  Activity,
  Award,
  X
} from 'lucide-react';
import { playRetroSound } from '../utils/audio';

interface HowItWorksLandingSectionProps {
  onShowToast: (msg: string) => void;
  onOpenRegister?: () => void;
}

interface StepItem {
  number: string;
  stepBadge: string;
  title: string;
  subtitle: string;
  description: string;
  extendedDescription: string;
  bullets: string[];
  toastMessage: string;
  visual: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/* HAND-DRAWN RETRO SVG SCHEMATICS                                           */
/* -------------------------------------------------------------------------- */

// 1. FEB Database Connection Sketch (Paso 1)
const FebDatabaseConnectionSketch: React.FC = () => (
  <svg viewBox="0 0 120 70" fill="none" className="w-full h-16 text-[#0c3975] my-1">
    {/* Database Cylinder Left */}
    <ellipse cx="32" cy="18" rx="20" ry="7" stroke="#0c3975" strokeWidth="2.2" fill="#fff" />
    <path d="M 12 18 V 48 C 12 55, 52 55, 52 48 V 18" stroke="#0c3975" strokeWidth="2.2" fill="#fff" />
    <path d="M 12 28 C 12 34, 52 34, 52 28" stroke="#0c3975" strokeWidth="1.8" fill="none" />
    <path d="M 12 38 C 12 44, 52 44, 52 38" stroke="#0c3975" strokeWidth="1.8" fill="none" />
    
    {/* Animated sync arrow to API Gateway */}
    <path d="M 58 33 H 74" stroke="#c02328" strokeWidth="2.5" strokeDasharray="3 3" />
    <path d="M 70 28 L 76 33 L 70 38" fill="#c02328" />

    {/* Basketball Cloud / FEB Server Right */}
    <rect x="78" y="16" width="34" height="34" rx="4" stroke="#0c3975" strokeWidth="2.2" fill="#fff" />
    <circle cx="95" cy="33" r="10" stroke="#0c3975" strokeWidth="1.5" />
    <line x1="85" y1="33" x2="105" y2="33" stroke="#0c3975" strokeWidth="1.5" />
    <line x1="95" y1="23" x2="95" y2="43" stroke="#0c3975" strokeWidth="1.5" />
    <text x="83" y="60" fill="#0c3975" fontSize="7" fontFamily="monospace" fontWeight="bold">FEB SYNC</text>
  </svg>
);

// 2. Shot Chart & Heatmap Analytics Sketch (Paso 2)
const ShotChartSketch: React.FC = () => (
  <svg viewBox="0 0 120 70" fill="none" className="w-full h-16 text-[#0c3975] my-1">
    {/* Half Court Sketch */}
    <rect x="15" y="8" width="90" height="54" rx="2" stroke="#0c3975" strokeWidth="2" fill="#fff" />
    {/* Key / Paint */}
    <rect x="44" y="8" width="32" height="26" stroke="#0c3975" strokeWidth="1.6" fill="#ede7dc" fillOpacity="0.4" />
    {/* Free throw circle */}
    <path d="M 44 34 A 16 16 0 0 0 76 34" stroke="#0c3975" strokeWidth="1.6" strokeDasharray="3 2" />
    {/* Basket hoop */}
    <circle cx="60" cy="14" r="3" stroke="#c02328" strokeWidth="1.8" />
    <line x1="53" y1="9" x2="67" y2="9" stroke="#0c3975" strokeWidth="2.2" />
    {/* 3-Point Arc */}
    <path d="M 23 8 V 20 C 23 48, 97 48, 97 20 V 8" stroke="#0c3975" strokeWidth="1.8" />
    
    {/* Hot / Cold Heat Indicators */}
    {/* Green Made Shots */}
    <circle cx="34" cy="22" r="3.2" fill="#16a34a" />
    <circle cx="60" cy="24" r="3.8" fill="#16a34a" />
    <circle cx="86" cy="22" r="3.2" fill="#16a34a" />
    <circle cx="60" cy="46" r="3.5" fill="#16a34a" />

    {/* Red Misses (X's) */}
    <path d="M 47 16 L 51 20 M 51 16 L 47 20" stroke="#dc2626" strokeWidth="1.8" />
    <path d="M 70 16 L 74 20 M 74 16 L 70 20" stroke="#dc2626" strokeWidth="1.8" />
    <path d="M 38 38 L 42 42 M 42 38 L 38 42" stroke="#dc2626" strokeWidth="1.8" />
    <path d="M 80 38 L 84 42 M 84 38 L 80 42" stroke="#dc2626" strokeWidth="1.8" />
  </svg>
);

// 3. Playbook Clipboard & Match Plan Sketch (Paso 3)
const PlaybookClipboardSketch: React.FC = () => (
  <svg viewBox="0 0 120 70" fill="none" className="w-full h-16 text-[#0c3975] my-1">
    {/* Clipboard Outline */}
    <rect x="25" y="8" width="70" height="54" rx="4" stroke="#0c3975" strokeWidth="2.2" fill="#fff" />
    {/* Clip Top */}
    <rect x="47" y="4" width="26" height="8" rx="2" stroke="#0c3975" strokeWidth="2" fill="#ede7dc" />
    <circle cx="60" cy="7" r="1.5" fill="#0c3975" />

    {/* Tactical Lines & Diagram Inside */}
    {/* Offensive O's and X's */}
    <circle cx="40" cy="22" r="3" stroke="#0c3975" strokeWidth="1.6" />
    <circle cx="80" cy="22" r="3" stroke="#0c3975" strokeWidth="1.6" />
    <circle cx="60" cy="38" r="3.5" stroke="#c02328" strokeWidth="2" />

    {/* Tactical movement arrow */}
    <path d="M 60 34 Q 50 25 45 23" stroke="#0c3975" strokeWidth="1.6" strokeDasharray="2 2" />
    <path d="M 64 34 Q 72 26 77 24" stroke="#0c3975" strokeWidth="1.6" strokeDasharray="2 2" />
    
    {/* Coach Notes Lines */}
    <line x1="34" y1="48" x2="86" y2="48" stroke="#0c3975" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="34" y1="54" x2="72" y2="54" stroke="#0c3975" strokeWidth="1.5" strokeLinecap="round" />

    {/* Checkmark stamp */}
    <circle cx="92" cy="50" r="8" fill="#16a34a" fillOpacity="0.15" stroke="#16a34a" strokeWidth="1.5" />
    <path d="M 88 50 L 91 53 L 96 47" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* MAIN SECTION COMPONENT                                                     */
/* -------------------------------------------------------------------------- */

export const HowItWorksLandingSection: React.FC<HowItWorksLandingSectionProps> = ({
  onShowToast,
  onOpenRegister,
}) => {
  const [selectedStep, setSelectedStep] = useState<StepItem | null>(null);

  const steps: StepItem[] = [
    {
      number: "01",
      stepBadge: "PASO 1 • CONEXIÓN FEB",
      title: "DATOS OFICIALES FEB INTEGRADOS",
      subtitle: "Conexión directa • Cero subidas manuales",
      description:
        "No tienes que subir ni picar ningún archivo. Toda la información, actas y plantillas están ya registradas en nuestra base de datos gracias a la conexión oficial directa con la Federación Española de Baloncesto.",
      extendedDescription:
        "Acceso centralizado e instantáneo a todas las competiciones oficiales de la Federación Española de Baloncesto. El sistema sincroniza automáticamente cada jornada, acta digital, plantilla histórica y box score sin que tengas que gastar horas introduciendo datos en hojas de cálculo.",
      bullets: [
        "Conexión directa y continua con la base de datos oficial FEB",
        "Histórico completo de partidos, actas digitales y plantillas",
        "Actualización automática jornada a jornada sin descargas manuales",
        "Identificación unificada de licencias, edades y perfiles de jugadores",
        "Compatibilidad total con Liga Femenina, LEB Oro/Plata, Liga EBA y canteras",
      ],
      toastMessage: "Paso 1: Conexión nativa con la base de datos oficial de la Federación Española de Baloncesto.",
      visual: <FebDatabaseConnectionSketch />,
    },
    {
      number: "02",
      stepBadge: "PASO 2 • PROCESA",
      title: "TELEMETRÍA AVANZADA",
      subtitle: "Mapas de tiro, True Shooting & quintetos",
      description:
        "El motor calcula métricas de élite: True Shooting (TS%), Pace, Net Rating ofensivo y defensivo, mapas de calor por zonas de tiro e impacto real de cada quinteto en pista.",
      extendedDescription:
        "Convierte la estadística tradicional en telemetría táctica de primer nivel. El motor de BASKETDATA traduce cada tiro, rebote y rotación en mapas de calor interactivos, índices de posesión y rendimiento de quintetos que revelan qué combinaciones ganan partidos.",
      bullets: [
        "Mapas de tiro (Shot Charts) interactivos por zona y volumen",
        "Análisis de eficiencia de quintetos y rotaciones (+/- en pista)",
        "Métricas avanzadas de élite: eFG%, True Shooting (TS%), Pace y Ratings",
        "Detección de rachas y distribución de anotación por cuartos",
        "Filtros dinámicos por rival, local/visitante y minutos disputados",
      ],
      toastMessage: "Paso 2: Algoritmos analíticos y visualización de calor en pista.",
      visual: <ShotChartSketch />,
    },
    {
      number: "03",
      stepBadge: "PASO 3 • DECIDE",
      title: "SCOUTING & PLAN DE PARTIDO",
      subtitle: "Decisiones con datos en el vestuario",
      description:
        "Genera informes de scouting del próximo rival en un solo clic. Comparte fichas de tiro, tendencias del rival y planes tácticos directamente al móvil de tu plantilla y cuerpo técnico.",
      extendedDescription:
        "Prepara cada semana de competición con ventaja táctica real. Con un solo clic obtienes un dossier completo del rival con sus focos ofensivos, puntos débiles en defensa y tendencias tácticas clave para entregar a tu equipo o proyectar en la charla técnica.",
      bullets: [
        "Dossier de scouting del rival generado automáticamente en 1 clic",
        "Fichas tácticas individuales de tiradores y generadores rivales",
        "Exportación directa a formato imprimible, PDF e interactivo móvil",
        "Alertas predictivas sobre quintetos más peligrosos del rival",
        "Notas personalizadas del entrenador para la charla previa al partido",
      ],
      toastMessage: "Paso 3: Informes ejecutivos listos para competir en pista.",
      visual: <PlaybookClipboardSketch />,
    },
  ];

  return (
    <section id="how-it-works" className="relative z-10 py-10 sm:py-14 select-none font-sans">
      <div className="site-container">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER ROW (MATCHING TUTORIALS SECTION EXACT DESIGN HIERARCHY)     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end mb-8 sm:mb-12">
          
          {/* Left Column: Collegiate Headline & Sketched Underline */}
          <div className="lg:col-span-7 pl-0 sm:pl-2 lg:pl-[40px]">
            {/* Main Collegiate Slab Headline */}
            <h2 className="font-slab text-[38px] sm:text-[50px] lg:text-[65px] leading-[1.05] lg:leading-[64px] text-[#0b3260] tracking-tight uppercase font-black drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)]">
              ¿CÓMO<br />FUNCIONA?
            </h2>

            {/* Sub-headline / Tagline */}
            <div className="mt-2 flex items-center gap-3">
              <span className="font-condensed font-bold text-xs sm:text-sm text-[#c02328] uppercase tracking-widest bg-[#c02328]/10 px-2 py-0.5 rounded-[2px]">
                PASO A PASO
              </span>
              <span className="font-mono-code text-xs sm:text-[13px] text-[#0b3260] font-bold uppercase tracking-wider">
                DEL DATO EN BRUTO A LA VENTAJA EN PISTA
              </span>
            </div>

            {/* Sketched Navy Underline */}
            <div className="mt-3 max-w-sm sm:max-w-md">
              <div className="w-full">
                <svg viewBox="0 0 320 16" fill="none" className="w-full h-3 text-[#0b3260] opacity-80 overflow-visible">
                  <path 
                    d="M 2 8 C 50 14, 110 2, 170 9 C 230 15, 280 4, 318 10" 
                    stroke="currentColor" 
                    strokeWidth="3.6" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column: Paragraph Description + Quick Action */}
          <div className="lg:col-span-5 flex flex-col justify-end pr-0 sm:pr-4">
            <p className="font-mono-code text-xs sm:text-[13.5px] text-[#143d70] leading-relaxed max-w-lg mb-4">
              BASKETDATA transforma la información oficial de la Federación Española de Baloncesto en inteligencia táctica en 3 pasos clave. Toda la base de datos está ya integrada: tú solo eliges el equipo, jugador o partido que quieres analizar.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  playRetroSound('burst');
                  if (onOpenRegister) {
                    onOpenRegister();
                  } else {
                    onShowToast('Iniciando simulador de flujo de trabajo...');
                  }
                }}
                className="comic-interactive-card bg-[#0c3975] hover:bg-[#124b94] text-white py-2 px-5 rounded-[4px] font-condensed font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-white shadow-[0_0_0_2px_#0c3975] cursor-pointer flex items-center gap-2 transition-all active:scale-95"
              >
                <span>PROBAR FLUJO DE TRABAJO</span>
                <span>→</span>
              </button>

              <span className="text-[11px] font-mono-code text-slate-600 font-bold uppercase">
                ★ 100% ONLINE • SIN INSTALACIÓN
              </span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. 3 INTERACTIVE WORKFLOW CARDS ROW (SIN CHECKLIST EN LA TARJETA)         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {steps.map((step) => (
            <div
              key={step.number}
              onClick={() => {
                playRetroSound('card');
                setSelectedStep(step);
              }}
              className="comic-interactive-card bg-[#faf7f0] border-2 border-[#0c3975] rounded-[6px] p-5 sm:p-6 shadow-[4px_4px_0_rgba(12,57,117,0.18)] flex flex-col justify-between hover:border-[#b91c1c] transition-all cursor-pointer group hover:-translate-y-1"
            >
              <div>
                {/* Top Card Row: Big Distressed Step Number + Pill Badge */}
                <div className="flex items-center justify-between border-b border-black/15 pb-2.5 mb-3">
                  <span className="font-slab text-4xl sm:text-5xl font-black text-[#0c3975]/30 group-hover:text-[#b91c1c]/50 transition-colors leading-none">
                    {step.number}
                  </span>
                  <span className="font-mono-code text-[10px] sm:text-[10.5px] font-bold tracking-wider px-2 py-0.5 bg-[#0c3975] text-white rounded-[3px] uppercase">
                    {step.stepBadge}
                  </span>
                </div>

                {/* Hand-drawn Retro Schematic Visual */}
                <div className="bg-[#ede7dc]/70 rounded-[4px] p-2 border border-black/10 flex items-center justify-center">
                  {step.visual}
                </div>

                {/* Card Titles */}
                <h3 className="font-slab text-lg sm:text-[19px] text-[#0c3975] group-hover:text-[#b91c1c] transition-colors uppercase mt-3.5 leading-tight">
                  {step.title}
                </h3>
                <span className="font-condensed font-bold text-xs text-[#c02328] uppercase tracking-wide block mt-0.5">
                  {step.subtitle}
                </span>

                {/* Description */}
                <p className="mt-2.5 text-xs text-slate-700 font-mono-code leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom Card Footer Action */}
              <div className="mt-5 pt-3 border-t-2 border-[#0c3975]/15 flex items-center justify-between text-xs font-condensed font-bold text-[#0c3975] uppercase group-hover:text-[#b91c1c] transition-colors">
                <span className="flex items-center gap-1.5">
                  <span>VER DETALLES Y CHECKLIST</span>
                </span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM BADGES ROW SEPARATED BY RED STARS                               */}
        {/* ========================================================================= */}
        <div className="mt-8 sm:mt-10 pt-4 border-t border-[#0b3260]/15 flex flex-wrap items-center justify-center sm:justify-between gap-3 text-center sm:text-left">
          
          <div className="flex items-center gap-2">
            <span className="text-[#c52222] font-black text-sm">★</span>
            <span className="font-condensed font-bold text-xs sm:text-sm text-[#0b3260] uppercase tracking-wider">
              DATOS OFICIALES FEB TEMP. 26/27
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#c52222] font-black text-sm">★</span>
            <span className="font-condensed font-bold text-xs sm:text-sm text-[#0b3260] uppercase tracking-wider">
              COMPATIBLE CON TODAS LAS CATEGORÍAS (LF, EBA, CANTERA)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#c52222] font-black text-sm">★</span>
            <span className="font-condensed font-bold text-xs sm:text-sm text-[#0b3260] uppercase tracking-wider">
              INFORMES EJECUTIVOS EN 1 CLIC
            </span>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL POPUP DETALLADO CON CHECKLIST Y EXPLICACIÓN EXTENDIDA            */}
      {/* ========================================================================= */}
      {selectedStep && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedStep(null)}
        >
          <div 
            className="relative w-full max-w-xl bg-[#faf7f0] border-4 border-[#0c3975] rounded-[6px] shadow-2xl p-5 sm:p-7 overflow-hidden max-h-[90vh] flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Paper Texture layer */}
            <div className="absolute inset-0 pointer-events-none opacity-20 texture-paper-pulp z-0" />

            <div className="relative z-10 overflow-y-auto pr-1">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b-2 border-[#0c3975] pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-slab text-3xl sm:text-4xl text-[#0c3975] font-black leading-none">
                    {selectedStep.number}
                  </span>
                  <div>
                    <span className="font-mono-code text-[10px] font-bold tracking-wider px-2 py-0.5 bg-[#0c3975] text-white rounded-[3px] uppercase block w-fit mb-1">
                      {selectedStep.stepBadge}
                    </span>
                    <h3 className="font-slab text-xl sm:text-2xl text-[#0c3975] uppercase leading-tight">
                      {selectedStep.title}
                    </h3>
                    <p className="font-condensed font-bold text-xs text-[#c02328] uppercase tracking-wide">
                      {selectedStep.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playRetroSound('click');
                    setSelectedStep(null);
                  }}
                  className="w-8 h-8 bg-white text-black font-black border-2 border-[#0c3975] hover:bg-yellow-300 flex items-center justify-center cursor-pointer rounded transition-colors shrink-0 ml-2 shadow-xs"
                  aria-label="Cerrar ventana"
                >
                  <X size={18} strokeWidth={3} />
                </button>
              </div>

              {/* Schematic Illustration */}
              <div className="bg-[#ede7dc]/80 rounded-[4px] p-3 border border-black/10 flex items-center justify-center mb-4 shadow-inner">
                {selectedStep.visual}
              </div>

              {/* Detailed Service Explanation */}
              <div className="mb-5">
                <h4 className="font-slab text-xs sm:text-sm text-[#0c3975] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>¿EN QUÉ CONSISTE ESTE SERVICIO?</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 font-mono-code leading-relaxed mb-3">
                  {selectedStep.description}
                </p>
                <div className="bg-[#0c3975]/5 border-l-4 border-[#0c3975] p-3 rounded-r-[4px]">
                  <p className="text-xs text-[#0c3975] font-mono-code leading-relaxed font-semibold">
                    {selectedStep.extendedDescription}
                  </p>
                </div>
              </div>

              {/* Checklist Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 border-b border-black/15 pb-1.5 mb-2.5">
                  <ClipboardCheck size={16} className="text-[#0c3975]" />
                  <span className="font-slab text-xs sm:text-sm text-[#0c3975] uppercase tracking-wider">
                    CHECKLIST DE CAPACIDADES Y VENTAJAS
                  </span>
                </div>
                <div className="space-y-2 font-mono-code text-xs text-[#0c3975]">
                  {selectedStep.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-white/70 p-2.5 rounded-[4px] border border-black/10 shadow-xs">
                      <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 border border-green-600/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        ✔
                      </span>
                      <span className="leading-snug text-slate-800 font-medium">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="relative z-10 pt-4 mt-2 border-t-2 border-[#0c3975]/15 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  playRetroSound('click');
                  setSelectedStep(null);
                }}
                className="bg-transparent hover:bg-black/5 text-[#0c3975] font-condensed font-bold text-xs uppercase px-4 py-2 rounded border border-[#0c3975]/30 cursor-pointer transition-colors"
              >
                CERRAR
              </button>

              <button
                type="button"
                onClick={() => {
                  playRetroSound('burst');
                  setSelectedStep(null);
                  if (onOpenRegister) {
                    onOpenRegister();
                  } else {
                    onShowToast(`Probando flujo: ${selectedStep.title}`);
                  }
                }}
                className="bg-[#0c3975] hover:bg-[#124b94] text-white font-slab text-xs uppercase px-5 py-2 rounded border-2 border-white shadow-[0_0_0_2px_#0c3975] cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span>PROBAR ESTE FLUJO</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
