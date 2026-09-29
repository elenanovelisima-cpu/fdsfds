import React from 'react';
import { homeContent } from '../data/homeContent';
import { playRetroSound } from '../utils/audio';

interface HowItWorksAssistantSectionProps {
  onShowToast: (msg: string) => void;
}

/* -------------------------------------------------------------------------- */
/* SVG ASSETS (HAND-DRAWN CHALK / VINTAGE BLUEPRINT ARTWORK)                  */
/* -------------------------------------------------------------------------- */

// 1. Chalk Basketball for Banner
const ChalkBasketballIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={`${className} shrink-0 filter drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]`}>
    <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="4.2" strokeLinecap="round" />
    <path d="M 8 52 Q 50 63 92 52" fill="none" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <path d="M 52 8 Q 58 50 52 92" fill="none" stroke="white" strokeWidth="3.6" strokeLinecap="round" />
    <line x1="55" y1="52" x2="21" y2="20" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <line x1="55" y1="52" x2="71" y2="10" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <line x1="55" y1="52" x2="90" y2="31" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <line x1="55" y1="52" x2="88" y2="74" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <line x1="55" y1="52" x2="40" y2="91" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <line x1="55" y1="52" x2="14" y2="77" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <line x1="55" y1="52" x2="8" y2="47" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
  </svg>
);

// 2. Binoculars (Monitorea)
const BinocularsIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={`${className} stroke-white`}>
    <circle cx="15" cy="28" r="9" stroke="white" strokeWidth="3.5" fill="none" />
    <circle cx="33" cy="28" r="9" stroke="white" strokeWidth="3.5" fill="none" />
    <path d="M15 19 L19 9 L25 9 L21 19" stroke="white" strokeWidth="3.2" strokeLinejoin="round" fill="none" />
    <path d="M33 19 L29 9 L23 9 L27 19" stroke="white" strokeWidth="3.2" strokeLinejoin="round" fill="none" />
    <line x1="19" y1="9" x2="29" y2="9" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <path d="M21 28 Q 24 25 27 28" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="15" cy="28" r="3.5" fill="white" />
    <circle cx="33" cy="28" r="3.5" fill="white" />
  </svg>
);

// 3. Target / Bullseye (Detecta)
const TargetBullseyeIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={`${className} stroke-white`}>
    <circle cx="24" cy="24" r="18" stroke="white" strokeWidth="3.2" strokeDasharray="5 2" />
    <circle cx="24" cy="24" r="12" stroke="white" strokeWidth="3.5" />
    <circle cx="24" cy="24" r="5" fill="white" />
    {/* Arrow hitting center */}
    <line x1="4" y1="24" x2="10" y2="24" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="38" y1="24" x2="44" y2="24" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="24" y1="4" x2="24" y2="10" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="24" y1="38" x2="24" y2="44" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

// 4. Alert Bell (Avisa)
const AlertBellIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={`${className} stroke-white`}>
    <path d="M24 6 C25.5 6 27 7.5 27 9 C27 10 27 11 27 12 C33 14 36 19 36 26 L38 33 L10 33 L12 26 C12 19 15 14 21 12 C21 11 21 10 21 9 C21 7.5 22.5 6 24 6 Z" stroke="white" strokeWidth="3.5" strokeLinejoin="round" fill="none" />
    <line x1="8" y1="33" x2="40" y2="33" stroke="white" strokeWidth="3.8" strokeLinecap="round" />
    <path d="M20 35 C20 37.5 21.8 39.5 24 39.5 C26.2 39.5 28 37.5 28 35" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" />
  </svg>
);

// 5. Header Basketball with Chalkboard Play Diagram
const PlaybookChalkDiagram: React.FC<{ className?: string }> = ({ className = "w-28 h-16" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {/* Basketball sketch */}
    <svg viewBox="0 0 60 60" className="w-12 h-12 shrink-0 stroke-[#0c315e]">
      <circle cx="30" cy="30" r="26" fill="none" strokeWidth="2.8" />
      <path d="M 5 31 Q 30 38 55 31" fill="none" strokeWidth="2.4" />
      <path d="M 31 5 Q 36 30 31 55" fill="none" strokeWidth="2.4" />
      <line x1="33" y1="31" x2="11" y2="11" strokeWidth="2.4" />
      <line x1="33" y1="31" x2="42" y2="7" strokeWidth="2.4" />
      <line x1="33" y1="31" x2="53" y2="18" strokeWidth="2.4" />
      <line x1="33" y1="31" x2="52" y2="44" strokeWidth="2.4" />
      <line x1="33" y1="31" x2="24" y2="54" strokeWidth="2.4" />
      <line x1="33" y1="31" x2="8" y2="46" strokeWidth="2.4" />
    </svg>

    {/* Hand-drawn Playbook Arrows & X / O */}
    <svg viewBox="0 0 65 50" className="w-14 h-12 shrink-0 stroke-[#0c315e]">
      {/* X and O markers */}
      <text x="6" y="16" fill="#0c315e" fontSize="12" fontWeight="bold" fontFamily="monospace">O</text>
      <text x="24" y="36" fill="#0c315e" fontSize="12" fontWeight="bold" fontFamily="monospace">X</text>
      <text x="46" y="16" fill="#0c315e" fontSize="12" fontWeight="bold" fontFamily="monospace">O</text>
      
      {/* Dashed curved play arrows */}
      <path d="M 16 14 Q 28 22 28 28" fill="none" strokeWidth="2.2" strokeDasharray="3 2" />
      <path d="M 32 30 Q 42 22 45 18" fill="none" strokeWidth="2.2" />
      <polygon points="45,18 39,20 42,24" fill="#0c315e" />
      
      {/* Screen pick mark */}
      <line x1="38" y1="38" x2="48" y2="38" strokeWidth="2.4" />
      <line x1="43" y1="34" x2="43" y2="42" strokeWidth="2.4" />
    </svg>
  </div>
);

// 6. Sliders Graphic for Step 01
const SlidersGraphic: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 60 60" fill="none" className={`${className} stroke-[#0c315e]`}>
    {/* Line 1 */}
    <line x1="8" y1="16" x2="52" y2="16" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="24" cy="16" r="4.5" fill="#0c315e" strokeWidth="2" />
    
    {/* Line 2 */}
    <line x1="8" y1="30" x2="52" y2="30" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="38" cy="30" r="4.5" fill="#0c315e" strokeWidth="2" />
    
    {/* Line 3 */}
    <line x1="8" y1="44" x2="52" y2="44" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="20" cy="44" r="4.5" fill="#0c315e" strokeWidth="2" />
  </svg>
);

// 7. Tactical Court Graphic for Step 02
const TacticalHalfCourtGraphic: React.FC<{ className?: string }> = ({ className = "w-28 h-20" }) => (
  <svg viewBox="0 0 100 70" fill="none" className={`${className} stroke-[#0c315e]`}>
    {/* Outer Court Border */}
    <rect x="2" y="2" width="96" height="66" strokeWidth="2" fill="#faf7f0" rx="2" />
    
    {/* Key / Paint */}
    <rect x="36" y="2" width="28" height="34" strokeWidth="1.8" fill="none" />
    
    {/* Free throw circle */}
    <circle cx="50" cy="36" r="14" strokeWidth="1.8" strokeDasharray="3 2" fill="none" />
    
    {/* Hoop / Backboard */}
    <line x1="43" y1="7" x2="57" y2="7" strokeWidth="2.5" />
    <circle cx="50" cy="11" r="3.5" strokeWidth="1.8" fill="none" />
    
    {/* 3-Point Line Arc */}
    <path d="M 12 2 L 12 18 Q 50 64 88 18 L 88 2" strokeWidth="1.8" fill="none" />
    
    {/* Play tactical vectors */}
    <text x="26" y="25" fill="#0c315e" fontSize="9" fontWeight="bold" fontFamily="monospace">X</text>
    <text x="68" y="22" fill="#0c315e" fontSize="9" fontWeight="bold" fontFamily="monospace">O</text>
    <circle cx="54" cy="50" r="3" fill="#0c315e" />
    
    {/* Pass Vector with Arrow */}
    <path d="M 54 48 Q 42 36 34 26" strokeWidth="1.8" strokeDasharray="3 2" fill="none" />
    <polygon points="34,26 39,27 36,31" fill="#0c315e" />
    
    {/* Cut to basket arrow */}
    <path d="M 70 24 L 70 38" strokeWidth="1.8" fill="none" />
    <polygon points="70,38 67,33 73,33" fill="#0c315e" />
  </svg>
);

// 8. Smartphone Alerta Graphic for Step 03
const SmartphoneAlertGraphic: React.FC<{ className?: string }> = ({ className = "w-20 h-24" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    {/* Radiating sound/alert sparks */}
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-[#0c315e]">
      {/* Outer sparks */}
      <line x1="14" y1="40" x2="6" y2="34" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="60" x2="4" y2="60" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="80" x2="6" y2="86" strokeWidth="2" strokeLinecap="round" />
      
      <line x1="86" y1="40" x2="94" y2="34" strokeWidth="2" strokeLinecap="round" />
      <line x1="88" y1="60" x2="96" y2="60" strokeWidth="2" strokeLinecap="round" />
      <line x1="86" y1="80" x2="94" y2="86" strokeWidth="2" strokeLinecap="round" />

      {/* Phone chassis */}
      <rect x="22" y="10" width="56" height="100" rx="8" fill="#faf7f0" strokeWidth="2.8" />
      
      {/* Phone ear speaker notch */}
      <line x1="42" y1="16" x2="58" y2="16" strokeWidth="2.2" strokeLinecap="round" />
      
      {/* Inner Screen */}
      <rect x="27" y="22" width="46" height="76" rx="4" fill="white" strokeWidth="1.5" />
      
      {/* Screen elements: Crown */}
      <polygon points="40,36 60,36 57,28 50,33 43,28" fill="#d97706" stroke="#b45309" strokeWidth="1" />
      
      {/* ALERTA Text */}
      <text x="50" y="47" textAnchor="middle" fill="#0c315e" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">ALERTA</text>
      
      {/* Red Star */}
      <text x="50" y="58" textAnchor="middle" fill="#b91c1c" fontSize="9" fontWeight="bold">★</text>
      
      {/* Notification preview bars */}
      <line x1="33" y1="65" x2="67" y2="65" stroke="#0c315e" strokeWidth="2" strokeLinecap="round" />
      <line x1="33" y1="72" x2="67" y2="72" stroke="#0c315e" strokeWidth="2" strokeLinecap="round" />
      <line x1="33" y1="79" x2="55" y2="79" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  </div>
);

export const HowItWorksAssistantSection: React.FC<HowItWorksAssistantSectionProps> = ({ onShowToast }) => {
  const content = homeContent.howItWorks;

  return (
    <section className="hidden relative z-10 site-container mt-10 mb-8 select-none font-sans">
      
      {/* ========================================================================= */}
      {/* 1. TOP BLUE BANNER (TU ASISTENTE, SIEMPRE VIGILANDO + 3 COLUMNS)           */}
      {/* Exact match to user screenshot: Chalk Basketball, slanting text, columns  */}
      {/* ========================================================================= */}
      <div className="fondoazul-solid rounded-[6px] border border-[#113568]/40 shadow-xl px-4 sm:px-6 md:px-8 py-4 sm:py-5 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          
          {/* Left Brand: Chalk Basketball + Monumental Italic Headline */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 w-full lg:w-auto justify-start">
            <ChalkBasketballIcon className="w-11 h-11 sm:w-14 sm:h-14" />

            <div className="leading-[1.05]">
              <span className="chalk-text-italic text-white text-xl sm:text-2xl md:text-[27px] xl:text-[30px] uppercase block tracking-wider">
                {content.banner.headline1}
              </span>
              <span className="chalk-text-italic text-white text-xl sm:text-2xl md:text-[27px] xl:text-[30px] uppercase block tracking-wider mt-0.5">
                {content.banner.headline2}
              </span>
            </div>
          </div>

          {/* Right 3 Columns: MONITOREA / DETECTA / AVISA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full lg:w-auto flex-1 lg:pl-6">
            
            {/* Column 1: MONITOREA */}
            <div 
              onClick={() => {
                playRetroSound('click');
                onShowToast('Monitoreo activo: Seguimiento de datos, partidos y rendimiento 24/7.');
              }}
              className="flex items-start gap-3 sm:border-r border-white/20 sm:pr-4 cursor-pointer group hover:bg-white/5 p-1 rounded transition-colors"
            >
              <div className="mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                <BinocularsIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h4 className="font-slab font-black text-white text-sm sm:text-[15px] uppercase tracking-wider leading-tight">
                  {content.banner.columns[0].title}
                </h4>
                <p className="font-mono-code text-[11px] sm:text-xs text-blue-100/90 leading-snug mt-1">
                  {content.banner.columns[0].description}
                </p>
              </div>
            </div>

            {/* Column 2: DETECTA */}
            <div 
              onClick={() => {
                playRetroSound('click');
                onShowToast('Detección automática: Identificando rachas, anomalías y caídas de eficiencia.');
              }}
              className="flex items-start gap-3 sm:border-r border-white/20 sm:pr-4 cursor-pointer group hover:bg-white/5 p-1 rounded transition-colors"
            >
              <div className="mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                <TargetBullseyeIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h4 className="font-slab font-black text-white text-sm sm:text-[15px] uppercase tracking-wider leading-tight">
                  {content.banner.columns[1].title}
                </h4>
                <p className="font-mono-code text-[11px] sm:text-xs text-blue-100/90 leading-snug mt-1">
                  {content.banner.columns[1].description}
                </p>
              </div>
            </div>

            {/* Column 3: AVISA */}
            <div 
              onClick={() => {
                playRetroSound('click');
                onShowToast('Avisos configurados: Notificaciones push y reportes instantáneos.');
              }}
              className="flex items-start gap-3 cursor-pointer group hover:bg-white/5 p-1 rounded transition-colors"
            >
              <div className="mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                <AlertBellIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h4 className="font-slab font-black text-white text-sm sm:text-[15px] uppercase tracking-wider leading-tight">
                  {content.banner.columns[2].title}
                </h4>
                <p className="font-mono-code text-[11px] sm:text-xs text-blue-100/90 leading-snug mt-1">
                  {content.banner.columns[2].description}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN "¿CÓMO FUNCIONA?" SECTION (VINTAGE CARDSTOCK + 3 SKETCHED STEPS)   */}
      {/* ========================================================================= */}
      <div className="mt-5 bg-[#ede7dc] border-2 border-[#113568]/25 rounded-[6px] shadow-lg p-5 sm:p-7 md:p-8 relative overflow-hidden">
        {/* Paper pulp texture layer */}
        <div className="absolute inset-0 pointer-events-none opacity-20 texture-paper-pulp z-0" />

        {/* --------------------------------------------------------------------- */}
        {/* HEADER: ★ ¿CÓMO FUNCIONA? | En 3 simples pasos... + Playbook Sketch   */}
        {/* --------------------------------------------------------------------- */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#113568]/15">
          <div className="flex flex-wrap items-center gap-3">
            {/* Red Star */}
            <span className="text-[#b91c1c] text-3xl font-black shrink-0 leading-none">★</span>

            {/* Monumental Slab Headline */}
            <h3 className="font-slab font-black text-2xl sm:text-3xl md:text-[34px] text-[#0c315e] tracking-tight uppercase leading-none">
              {content.sectionHeader.title}
            </h3>

            {/* Divider pipe */}
            <span className="text-slate-400 font-light text-2xl hidden lg:inline px-1">|</span>

            {/* Explanation paragraph */}
            <p className="font-mono-code text-xs sm:text-[13px] text-slate-700 max-w-xl font-medium leading-relaxed">
              {content.sectionHeader.subtitle}
            </p>
          </div>

          {/* Right decorative playbook diagram */}
          <div className="hidden md:flex justify-end">
            <PlaybookChalkDiagram />
          </div>
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* 3 STEP CARDS WITH CONNECTING ARROWS                                    */}
        {/* --------------------------------------------------------------------- */}
        <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-11 gap-4 lg:gap-2 items-stretch">
          
          {/* STEP 01 CARD (cols 1..3) */}
          <div 
            onClick={() => {
              playRetroSound('click');
              onShowToast('Paso 01: Elige jugadores, equipos y estadísticas para activar tus filtros.');
            }}
            className="lg:col-span-3 bg-[#faf7f0] border-2 border-[#113568]/30 rounded-[4px] p-4 sm:p-5 shadow-[3px_3px_0_rgba(17,53,104,0.15)] flex flex-col justify-between relative cursor-pointer hover:border-[#b91c1c] transition-all group"
          >
            {/* Red Torn Tape Badge: 01 */}
            <div className="absolute -top-3 left-4 bg-[#b91c1c] text-white font-slab font-black text-sm px-3 py-0.5 rounded-[2px] shadow-sm transform -rotate-1 border border-black/20">
              {content.steps[0].number}
            </div>

            <div>
              {/* Visual Sketch Area: Sliders Icon + Checklist Box */}
              <div className="pt-2 flex items-center justify-between gap-3 min-h-[90px]">
                {/* Sliders */}
                <SlidersGraphic className="w-12 h-12 shrink-0 group-hover:scale-105 transition-transform" />

                {/* Checklist Notepad Box */}
                <div className="bg-[#ede7dc]/80 border border-[#113568]/25 rounded-[3px] p-2 text-[11px] font-mono-code space-y-1 w-32 shadow-2xs">
                  {content.steps[0].options?.map((opt) => (
                    <div key={opt} className="flex items-center gap-1.5 text-slate-800 font-semibold truncate">
                      <span className="text-[#0c315e] font-bold text-xs">☑</span>
                      <span className="truncate">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="font-slab font-black text-base sm:text-[17px] text-[#0c315e] uppercase tracking-wide mt-4 group-hover:text-[#b91c1c] transition-colors leading-tight">
                {content.steps[0].title}
              </h4>

              <p className="font-mono-code text-[11.5px] sm:text-xs text-slate-700 leading-snug mt-2">
                {content.steps[0].description}
              </p>
            </div>
          </div>

          {/* ARROW 1 -> 2 (col 4) */}
          <div className="lg:col-span-1 flex items-center justify-center py-2 lg:py-0">
            <span className="text-[#b91c1c] font-black text-3xl transform lg:rotate-0 rotate-90 select-none">
              ➔
            </span>
          </div>

          {/* STEP 02 CARD (cols 5..7) */}
          <div 
            onClick={() => {
              playRetroSound('click');
              onShowToast('Paso 02: El motor IA procesa telemetría y patrones tácticos en segundos.');
            }}
            className="lg:col-span-3 bg-[#faf7f0] border-2 border-[#113568]/30 rounded-[4px] p-4 sm:p-5 shadow-[3px_3px_0_rgba(17,53,104,0.15)] flex flex-col justify-between relative cursor-pointer hover:border-[#b91c1c] transition-all group"
          >
            {/* Red Torn Tape Badge: 02 */}
            <div className="absolute -top-3 left-4 bg-[#b91c1c] text-white font-slab font-black text-sm px-3 py-0.5 rounded-[2px] shadow-sm transform -rotate-1 border border-black/20">
              {content.steps[1].number}
            </div>

            <div>
              {/* Visual Sketch Area: Magnifying Glass + Tactical Half Court Diagram */}
              <div className="pt-2 flex items-center justify-between gap-3 min-h-[90px]">
                {/* Search & Bars Icon */}
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 48 48" className="w-11 h-11 stroke-[#0c315e] fill-none group-hover:scale-105 transition-transform">
                    {/* Magnifying lens */}
                    <circle cx="20" cy="20" r="13" strokeWidth="3.2" />
                    <line x1="29" y1="29" x2="42" y2="42" strokeWidth="4.2" strokeLinecap="round" />
                    {/* Mini bar chart inside/adjacent */}
                    <line x1="14" y1="24" x2="14" y2="20" strokeWidth="2.8" strokeLinecap="round" stroke="#b91c1c" />
                    <line x1="20" y1="24" x2="20" y2="15" strokeWidth="2.8" strokeLinecap="round" stroke="#0c315e" />
                    <line x1="26" y1="24" x2="26" y2="11" strokeWidth="2.8" strokeLinecap="round" stroke="#b91c1c" />
                  </svg>
                </div>

                {/* Tactical Court Sketch Box */}
                <div className="rounded-[3px] overflow-hidden shadow-2xs">
                  <TacticalHalfCourtGraphic className="w-32 h-20" />
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="font-slab font-black text-base sm:text-[17px] text-[#0c315e] uppercase tracking-wide mt-4 group-hover:text-[#b91c1c] transition-colors leading-tight">
                {content.steps[1].title}
              </h4>

              <p className="font-mono-code text-[11.5px] sm:text-xs text-slate-700 leading-snug mt-2">
                {content.steps[1].description}
              </p>
            </div>
          </div>

          {/* ARROW 2 -> 3 (col 8) */}
          <div className="lg:col-span-1 flex items-center justify-center py-2 lg:py-0">
            <span className="text-[#b91c1c] font-black text-3xl transform lg:rotate-0 rotate-90 select-none">
              ➔
            </span>
          </div>

          {/* STEP 03 CARD (cols 9..11) */}
          <div 
            onClick={() => {
              playRetroSound('burst');
              onShowToast('Paso 03: Alertas accionables directo a tu móvil y correo en tiempo real.');
            }}
            className="lg:col-span-3 bg-[#faf7f0] border-2 border-[#113568]/30 rounded-[4px] p-4 sm:p-5 shadow-[3px_3px_0_rgba(17,53,104,0.15)] flex flex-col justify-between relative cursor-pointer hover:border-[#b91c1c] transition-all group"
          >
            {/* Red Torn Tape Badge: 03 */}
            <div className="absolute -top-3 left-4 bg-[#b91c1c] text-white font-slab font-black text-sm px-3 py-0.5 rounded-[2px] shadow-sm transform -rotate-1 border border-black/20">
              {content.steps[2].number}
            </div>

            <div>
              {/* Visual Sketch Area: Bell Icon + Smartphone Alert Mockup */}
              <div className="pt-2 flex items-center justify-between gap-3 min-h-[90px]">
                {/* Large Vintage Ringing Bell */}
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 48 48" className="w-11 h-11 stroke-[#0c315e] fill-none group-hover:scale-105 transition-transform">
                    <path d="M24 8 C25.5 8 27 9.5 27 11 C27 12 27 13 27 14 C33 16 35 21 35 28 L37 34 L11 34 L13 28 C13 21 15 16 21 14 C21 13 21 12 21 11 C21 9.5 22.5 8 24 8 Z" strokeWidth="3" strokeLinejoin="round" />
                    <line x1="9" y1="34" x2="39" y2="34" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="24" cy="38" r="2.5" fill="#0c315e" />
                    {/* Ring sound wave lines */}
                    <path d="M7 22 Q 4 28 7 34" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M41 22 Q 44 28 41 34" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Smartphone Alert Sketch */}
                <SmartphoneAlertGraphic className="w-24 h-22" />
              </div>

              {/* Title & Description */}
              <h4 className="font-slab font-black text-base sm:text-[17px] text-[#0c315e] uppercase tracking-wide mt-4 group-hover:text-[#b91c1c] transition-colors leading-tight">
                {content.steps[2].title}
              </h4>

              <p className="font-mono-code text-[11.5px] sm:text-xs text-slate-700 leading-snug mt-2">
                {content.steps[2].description}
              </p>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
