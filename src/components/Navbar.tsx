import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  User,
  ShieldCheck,
  BellRing,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface Props {
  onOpenAlerts: () => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  onOpenPublish?: () => void;
  onOpenSpaceSwitcher?: () => void;
}

export const Navbar: React.FC<Props> = ({
  onOpenAlerts,
  isDark,
  toggleDarkMode,
  onOpenPublish,
  onOpenSpaceSwitcher,
}) => {
  const {
    currentUser,
    setShowAuthModal,
    alerts,
    logout,
    setActiveTab,
    resetPortal,
    showToast,
  } = useApp();

  const activeSpace = currentUser?.espaceActif || 'chercheur';

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#132219]/90 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('accueil')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0F6B3F] flex items-center justify-center text-white shadow-md shadow-[#0F6B3F]/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-xl tracking-tight text-gray-900 dark:text-white">
                Ivoire<span className="text-[#0F6B3F] dark:text-[#34D399]">Immo</span>
              </span>
              <span className="text-xs">🇨🇮</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-none hidden xs:block">
              Location • Vente • Hôtels
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Persistent "Changer d'espace" selector for logged-in users with complete profile */}
          {currentUser && currentUser.profilComplet && (
            <button
              type="button"
              onClick={() => {
                if (onOpenSpaceSwitcher) {
                  onOpenSpaceSwitcher();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-[#F28C1B] border border-amber-500/20 text-xs font-bold transition-all active:scale-95 shadow-2xs"
              title="Basculez d'espace ou activez un nouveau statut"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">
                {activeSpace === 'proprietaire' ? 'Changer d\'espace (Propriétaire)' : 'Changer d\'espace (Chercheur)'}
              </span>
              <span className="xs:hidden">Espace</span>
            </button>
          )}

          {/* Search Alerts Button */}
          <button
            type="button"
            onClick={onOpenAlerts}
            aria-label="Alertes de recherche"
            className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            title="Mes alertes de recherche"
          >
            <BellRing className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F28C1B]"></span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={isDark ? 'Passer en thème clair' : 'Passer en thème sombre'}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
          </button>

          {/* User Button */}
          {currentUser ? (
            <button
              type="button"
              onClick={() => setActiveTab('mon_espace')}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:border-[#0F6B3F] transition-all"
            >
              <div className="w-7 h-7 rounded-xl bg-[#0F6B3F]/15 flex items-center justify-center font-bold text-xs text-[#0F6B3F]">
                {currentUser.nom.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 max-w-[85px] truncate hidden md:inline">
                {currentUser.nom}
              </span>
              {(currentUser.phoneVerified || currentUser.emailVerified) && (
                <span title={currentUser.phoneVerified && currentUser.emailVerified ? 'Compte vérifié (Tél & Email)' : currentUser.phoneVerified ? 'Téléphone vérifié' : 'E-mail vérifié'}>
                  <ShieldCheck 
                    className={`w-3.5 h-3.5 ${currentUser.phoneVerified && currentUser.emailVerified ? 'text-emerald-500' : currentUser.phoneVerified ? 'text-amber-500' : 'text-blue-500'}`} 
                  />
                </span>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="py-2 px-3.5 rounded-xl bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Connexion</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

