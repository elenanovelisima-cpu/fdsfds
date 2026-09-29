import React from 'react';
import { Play, Clock, Laptop } from 'lucide-react';
import { playRetroSound } from '../utils/audio';
import { homeContent } from '../data/homeContent';

interface TutorialsSectionProps {
  onShowToast: (msg: string) => void;
}

export const TutorialsSection: React.FC<TutorialsSectionProps> = ({ onShowToast }) => {
  const t = homeContent.tutorials;

  return (
    <section className="relative z-10 site-container mt-8 sm:mt-10">
      {/* Natural layout on original page background */}
      <div className="relative py-4 sm:py-6">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: HEADLINE, SUBTITLE, SKETCHED UNDERLINE, DESCRIPTION, BADGES */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-center pl-0 sm:pl-2 lg:pl-[65px]">
            
            {/* Main Collegiate Slab Headline: TUTORIALES PASO A PASO. */}
            <h2 className="font-slab text-[38px] sm:text-[50px] lg:text-[65px] leading-[1.05] lg:leading-[64px] text-[#0b3260] tracking-tight uppercase font-black drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)]">
              {t.headline.line1}<br />{t.headline.line2}
            </h2>

            {/* Subtitle in Distressed Italic Brush / Marker Font */}
            <div className="mt-4 sm:mt-5">
              <p className="font-condensed font-black italic text-[26px] sm:text-[32px] lg:text-[40px] text-[#0b3260] uppercase tracking-wide leading-tight">
                {t.subtitle.line1}<br />{t.subtitle.line2}
              </p>

              {/* Hand-drawn Red Sketched Scribble Underline (Exact match to screenshot) */}
              <div className="mt-1 w-full max-w-[310px]">
                <svg viewBox="0 0 310 16" fill="none" className="w-full h-auto text-[#c52222]">
                  <path 
                    d="M3 9C55 5.5 140 4 307 7.5C240 11 110 12.5 7 13.5C40 11.5 120 10.5 210 9" 
                    stroke="#c52222" 
                    strokeWidth="3.6" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>
            </div>

            {/* Typewriter / Monospace Description Paragraph */}
            <p className="mt-5 sm:mt-6 font-mono-code text-xs sm:text-[13px] lg:text-[13.5px] text-[#143d70] leading-relaxed max-w-xl">
              {t.description}
            </p>

            {/* Bottom 3 Feature Badges Row separated by Red Stars */}
            <div className="mt-6 sm:mt-8 pt-2 flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5">
              
              {/* Feature 1: VÍDEOS PASO A PASO */}
              <div 
                onClick={() => {
                  playRetroSound('click');
                  onShowToast(t.badges.videos.toast);
                }}
                className="flex items-center gap-2.5 cursor-pointer group hover:opacity-90 transition-opacity"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] border-2 border-[#0b3260] flex items-center justify-center text-[#0b3260] shrink-0 bg-transparent group-hover:scale-105 transition-transform">
                  <Play size={18} fill="#0b3260" className="ml-0.5" />
                </div>
                <div className="leading-tight">
                  <span className="font-condensed font-black text-xs sm:text-[13.5px] text-[#0b3260] tracking-wider uppercase block">
                    {t.badges.videos.line1}
                  </span>
                  <span className="font-condensed font-bold text-[10px] sm:text-[11px] text-[#0b3260] tracking-wider uppercase block">
                    {t.badges.videos.line2}
                  </span>
                </div>
              </div>

              {/* Red Star Separator 1 */}
              <span className="text-[#c52222] font-black text-sm sm:text-base select-none shrink-0">
                ★
              </span>

              {/* Feature 2: DESDE CERO HASTA AVANZADO */}
              <div 
                onClick={() => {
                  playRetroSound('click');
                  onShowToast(t.badges.levels.toast);
                }}
                className="flex items-center gap-2.5 cursor-pointer group hover:opacity-90 transition-opacity"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#0b3260] flex items-center justify-center text-[#0b3260] shrink-0 bg-transparent group-hover:scale-105 transition-transform">
                  <Clock size={20} strokeWidth={2.4} />
                </div>
                <div className="leading-tight">
                  <span className="font-condensed font-black text-xs sm:text-[13.5px] text-[#0b3260] tracking-wider uppercase block">
                    {t.badges.levels.line1}
                  </span>
                  <span className="font-condensed font-bold text-[10px] sm:text-[11px] text-[#0b3260] tracking-wider uppercase block">
                    {t.badges.levels.line2}
                  </span>
                </div>
              </div>

              {/* Red Star Separator 2 */}
              <span className="text-[#c52222] font-black text-sm sm:text-base select-none shrink-0">
                ★
              </span>

              {/* Feature 3: ENFOCADOS EN LA PRÁCTICA */}
              <div 
                onClick={() => {
                  playRetroSound('click');
                  onShowToast(t.badges.practical.toast);
                }}
                className="flex items-center gap-2.5 cursor-pointer group hover:opacity-90 transition-opacity"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#0b3260] shrink-0 group-hover:scale-105 transition-transform">
                  <Laptop size={26} strokeWidth={2.4} />
                </div>
                <div className="leading-tight">
                  <span className="font-condensed font-black text-xs sm:text-[13.5px] text-[#0b3260] tracking-wider uppercase block">
                    {t.badges.practical.line1}
                  </span>
                  <span className="font-condensed font-bold text-[10px] sm:text-[11px] text-[#0b3260] tracking-wider uppercase block">
                    {t.badges.practical.line2}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: EXACT CHICA.PNG IMAGE                                       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 relative flex justify-center items-center mr-[55px]">
            <img 
              src={t.imageSrc}
              alt={t.imageAlt}
              className="w-[543px] h-[471px] max-w-none object-contain drop-shadow-[4px_6px_16px_rgba(0,0,0,0.2)] select-none"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/chica.png')) {
                  target.src = '/chica.png';
                }
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
};
