import React from 'react';
import { homeContent } from '../data/homeContent';
import { playRetroSound } from '../utils/audio';

interface SiteFooterProps {
  onShowToast: (msg: string) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ onShowToast }) => {
  const content = homeContent.footer;

  const handleNavClick = (link: { label: string; href?: string }) => {
    playRetroSound('click');
    if (link.href && link.href.startsWith('#')) {
      const targetId = link.href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    onShowToast(`${link.label}: Navegando a la sección`);
  };

  const handleSocialClick = (platform: string) => {
    playRetroSound('click');
    onShowToast(`Abriendo ${platform} oficial de ${content.brandName}`);
  };

  return (
    <footer className="w-full relative select-none font-sans mt-12">
      {/* --------------------------------------------------------------------- */}
      {/* 1. TOP SEPARATOR LINE (FINE BLUE/NAVY HAIRLINE ACROSS CONTAINER)       */}
      {/* --------------------------------------------------------------------- */}
      <div className="site-container pb-6">
        <div className="w-full h-[1.5px] bg-[#0e3a73]/25" />
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 2. MAIN FOOTER CONTENT BAR (VINTAGE CREAM PAPER BACKGROUND)           */}
      {/* --------------------------------------------------------------------- */}
      <div className="relative bg-[#ede7dc] px-4 sm:px-8 py-5 sm:py-6 overflow-hidden">
        {/* Paper pulp texture layer */}
        <div className="absolute inset-0 pointer-events-none opacity-25 texture-paper-pulp z-0" />

        <div className="relative z-10 site-container flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          
          {/* LEFT: BRAND SHIELD LOGO + HOOPDATA / ★ ANALYTICS ★ */}
          <div 
            onClick={() => {
              playRetroSound('burst');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <img 
              src="/assets/images/icon.png" 
              alt={content.brandName} 
              className="h-9 sm:h-10 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/icon.png')) {
                  target.src = '/icon.png';
                }
              }}
            />

            <div className="leading-none">
              <span className="font-slab text-2xl sm:text-[26px] text-[#0e3a73] tracking-wide uppercase block font-black">
                {content.brandName}
              </span>
              <span className="font-condensed text-[10px] sm:text-[11px] text-[#0e3a73] font-bold tracking-[0.28em] uppercase block mt-1">
                ★ {content.brandSubtitle} ★
              </span>
            </div>
          </div>

          {/* CENTER: NAVIGATION LINKS */}
          <nav className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 md:gap-9 text-xs sm:text-[13.5px] font-condensed tracking-wider text-[#0e3a73]">
            {content.navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className="hover:text-[#c02328] transition-colors cursor-pointer font-bold uppercase tracking-wider"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* RIGHT: SOCIAL MEDIA ICONS & COPYRIGHT */}
          <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
            {/* Social Icons Row */}
            <div className="flex items-center gap-3.5 text-[#0e3a73]">
              {/* Twitter / X */}
              <button
                onClick={() => handleSocialClick('Twitter / X')}
                aria-label="Twitter"
                className="hover:text-[#c02328] hover:scale-110 transition-all cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>

              {/* Instagram */}
              <button
                onClick={() => handleSocialClick('Instagram')}
                aria-label="Instagram"
                className="hover:text-[#c02328] hover:scale-110 transition-all cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-currentColor stroke-2 stroke-linecap-round stroke-linejoin-round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </button>

              {/* YouTube */}
              <button
                onClick={() => handleSocialClick('YouTube')}
                aria-label="YouTube"
                className="hover:text-[#c02328] hover:scale-110 transition-all cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </button>

              {/* Discord / Community */}
              <button
                onClick={() => handleSocialClick('Comunidad Discord')}
                aria-label="Discord"
                className="hover:text-[#c02328] hover:scale-110 transition-all cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </button>
            </div>

            {/* Copyright */}
            <p className="font-mono-code text-[11px] text-[#0e3a73]/75 text-center md:text-right">
              {content.copyright}
            </p>
          </div>

        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 3. BOTTOM FULL-WIDTH BLUE TEXTURED BAND (FONDOAZUL TEXTURE)            */}
      {/* Uses the authentic chalk/grunge dark navy texture from project assets  */}
      {/* --------------------------------------------------------------------- */}
      <div 
        className="w-full h-16 sm:h-20 md:h-24 relative overflow-hidden bg-[#062b54]"
        style={{
          backgroundImage: "url('/src/assets/images/fondoazul2.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Subtle darker torn crease along the top edge */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-b from-black/40 via-black/20 to-transparent pointer-events-none" />
      </div>
    </footer>
  );
};
