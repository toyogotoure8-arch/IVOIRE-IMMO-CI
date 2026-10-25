import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Home,
  ShieldCheck,
  CreditCard,
  MapPin,
  KeyRound,
} from 'lucide-react';

interface Props {
  onOpenPublish: () => void;
}

export const PortalEntryCards: React.FC<Props> = ({ onOpenPublish }) => {
  const {
    userPortal,
    setUserPortal,
    currentUser,
    switchRole,
    setActiveTab,
    showToast,
  } = useApp();

  const handleSelectChercheur = () => {
    setUserPortal('chercheur');
    setActiveTab('accueil');
    showToast('Bienvenue dans l’Espace Chercheur ! Explorez les offres.', 'success');

    // Smooth scroll down to listings feed
    const feedElement = document.getElementById('fil-actualite-offres');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProprietaire = () => {
    setUserPortal('proprietaire');
    if (currentUser && currentUser.role !== 'proprietaire') {
      switchRole('proprietaire');
    }
    showToast('Bienvenue dans l’Espace Propriétaire !', 'success');
    onOpenPublish();
  };

  return (
    <div className="space-y-4 sm:space-y-6 mb-6">
      {/* Welcome Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 text-[#0F6B3F] dark:text-[#34D399] text-xs font-black shadow-xs">
          <span>Portail Immobilier N°1 en Côte d'Ivoire</span>
          <span>🇨🇮</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Bienvenue sur Ivoire<span className="text-[#0F6B3F] dark:text-[#34D399]">Immo</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          Choisissez votre porte d'entrée pour accéder à votre espace dédié, ou parcourez les dernières offres en accès libre ci-dessous.
        </p>

        {/* Persistent "Changer d'espace" bar if an space is currently remembered */}
        {userPortal && (
          <div className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#16261c] border border-gray-200 dark:border-gray-700 shadow-xs text-xs font-bold">
            <span className="text-gray-500 dark:text-gray-400">Votre espace actuel :</span>
            <span className={`px-2.5 py-0.5 rounded-full text-white text-[11px] font-extrabold ${
              userPortal === 'chercheur' ? 'bg-[#0F6B3F]' : 'bg-[#F28C1B]'
            }`}>
              {userPortal === 'chercheur' ? '🔍 Espace Chercheur' : '🏡 Espace Propriétaire'}
            </span>
            <button
              type="button"
              onClick={() => {
                setUserPortal(null);
                showToast('Sélectionnez à nouveau votre espace de navigation.', 'info');
              }}
              className="ml-2 text-[#0F6B3F] dark:text-[#34D399] hover:underline flex items-center gap-1 font-black cursor-pointer"
              title="Changer d'espace"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Changer d'espace</span>
            </button>
          </div>
        )}
      </div>

      {/* The Two Gateways - Identical Size, Stacked on Mobile, Side-by-Side on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
        
        {/* Door 1: « Je cherche un bien » */}
        <div
          onClick={handleSelectChercheur}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSelectChercheur();
            }
          }}
          className={`group relative flex flex-col justify-between h-full p-6 sm:p-7 rounded-3xl border-2 transition-all duration-200 cursor-pointer text-left shadow-sm hover:shadow-xl active:scale-[0.98] ${
            userPortal === 'chercheur'
              ? 'bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/30 dark:from-[#16261c] dark:via-[#1a2d22] dark:to-[#0f2418] border-[#0F6B3F] ring-2 ring-[#0F6B3F]/20'
              : 'bg-white dark:bg-[#16261c] border-gray-200/90 dark:border-gray-800 hover:border-[#0F6B3F]'
          }`}
        >
          {/* Active status pill */}
          {userPortal === 'chercheur' && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#0F6B3F] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              <span>Espace Actif</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Header Icon + Number Tag */}
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F6B3F] to-emerald-700 text-white flex items-center justify-center shadow-lg shadow-[#0F6B3F]/25 group-hover:scale-105 transition-transform">
                <Search className="w-7 h-7" />
              </div>
              <span className="text-xs font-black text-[#0F6B3F] dark:text-[#34D399] tracking-wider uppercase">
                Porte 1 • Acquéreurs & Locataires
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white group-hover:text-[#0F6B3F] dark:group-hover:text-[#34D399] transition-colors flex items-center gap-2">
                <span>Je cherche un bien</span>
                <span className="text-lg">🔑</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                Pour ceux qui veulent louer, acheter ou réserver une maison, un appartement, une résidence meublée, un hôtel ou un terrain en Côte d'Ivoire.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800/80 text-xs text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F6B3F] shrink-0" />
                <span>Recherche par commune (Cocody, Marcory, Yopougon...)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F6B3F] shrink-0" />
                <span>Vue sur carte Google Maps et tri par proximité GPS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F6B3F] shrink-0" />
                <span>Calculateur de frais de bail et conseils anti-arnaque</span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-6 mt-4">
            <button
              type="button"
              className="w-full py-3.5 px-5 rounded-2xl bg-[#0F6B3F] group-hover:bg-[#0B5431] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Entrer dans l'espace Chercheur</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Door 2: « Je propose un bien » */}
        <div
          onClick={handleSelectProprietaire}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSelectProprietaire();
            }
          }}
          className={`group relative flex flex-col justify-between h-full p-6 sm:p-7 rounded-3xl border-2 transition-all duration-200 cursor-pointer text-left shadow-sm hover:shadow-xl active:scale-[0.98] ${
            userPortal === 'proprietaire'
              ? 'bg-gradient-to-br from-white via-amber-50/40 to-amber-100/30 dark:from-[#16261c] dark:via-[#261f14] dark:to-[#1a150d] border-[#F28C1B] ring-2 ring-[#F28C1B]/20'
              : 'bg-white dark:bg-[#16261c] border-gray-200/90 dark:border-gray-800 hover:border-[#F28C1B]'
          }`}
        >
          {/* Active status pill */}
          {userPortal === 'proprietaire' && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#F28C1B] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-white" />
              <span>Espace Actif</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Header Icon + Number Tag */}
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F28C1B] to-amber-700 text-white flex items-center justify-center shadow-lg shadow-[#F28C1B]/25 group-hover:scale-105 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>
              <span className="text-xs font-black text-[#F28C1B] tracking-wider uppercase">
                Porte 2 • Bailleurs & Professionnels
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white group-hover:text-[#F28C1B] transition-colors flex items-center gap-2">
                <span>Je propose un bien</span>
                <span className="text-lg">🏡</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                Pour les propriétaires, agences et hôteliers qui veulent publier des offres, trouver des clients sérieux et encaisser en toute sécurité.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800/80 text-xs text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F28C1B] shrink-0" />
                <span>Publication gratuite et visibilité immédiate en Côte d'Ivoire</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F28C1B] shrink-0" />
                <span>Badge « Propriétaire Vérifié » avec validation CNI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F28C1B] shrink-0" />
                <span>Acomptes Mobile Money & Boosts d'audience CinetPay</span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-6 mt-4">
            <button
              type="button"
              className="w-full py-3.5 px-5 rounded-2xl bg-[#F28C1B] group-hover:bg-[#D9770E] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Entrer dans l'espace Propriétaire</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>

      {/* Quick Action Strip for Owners */}
      {userPortal === 'proprietaire' && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F28C1B] text-white">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-gray-900 dark:text-white">
                Prêt à mettre votre logement en location ou vente ?
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                Publiez votre annonce en moins de 2 minutes et recevez des appels directs.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPublish}
            className="px-5 py-2.5 bg-[#F28C1B] hover:bg-[#D9770E] text-white font-extrabold text-xs rounded-xl shadow-md transition-all shrink-0 active:scale-95"
          >
            + Déposer une annonce maintenant
          </button>
        </div>
      )}
    </div>
  );
};
