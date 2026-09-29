import React, { useState, useEffect } from 'react';
import { WaxPackClubPage } from './components/WaxPackClubPage';
import { PlayerProfilePage } from './components/PlayerProfilePage';
import { AdminPanelPage } from './components/AdminPanelPage';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sparkles, X } from 'lucide-react';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'player-profile' | 'admin'>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  return (
    <div className="min-h-screen bg-[#ede7dc] text-[#0e3a73] relative">
      {currentPage === 'home' && (
        <WaxPackClubPage
          onShowToast={showToast}
          onOpenPlayerProfile={() => {
            setCurrentPage('player-profile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAdminPanel={() => {
            setCurrentPage('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {currentPage === 'player-profile' && (
        <PlayerProfilePage
          onBackToHome={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onShowToast={showToast}
          onOpenChecklistModal={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {currentPage === 'admin' && (
        <AdminPanelPage
          onBackToHome={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onShowToast={showToast}
        />
      )}

      {/* Floating Retro Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-bounce-short">
          <div className="bg-[#fff9e6] border-2 border-[#0c3975] text-[#0c3975] px-4 py-3 rounded-md shadow-2xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-xs sm:text-sm font-bold font-sans flex-1 leading-snug">
              {toastMessage}
            </p>
            <button
              onClick={() => setToastMessage(null)}
              className="text-[#0c3975]/60 hover:text-[#0c3975] transition-colors p-1 cursor-pointer"
              aria-label="Cerrar notificación"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
