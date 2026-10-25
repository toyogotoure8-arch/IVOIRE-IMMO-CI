import React from 'react';
import { useApp } from '../context/AppContext';
import { AppSpace } from '../types';
import {
  Search,
  Building2,
  ArrowRight,
  CheckCircle2,
  User,
} from 'lucide-react';

interface Props {
  onSelectDoor: (space: AppSpace) => void;
  onOpenSpaceSwitcher: () => void;
  onOpenPublish: () => void;
}

export const PortalGatewaySection: React.FC<Props> = ({
  onSelectDoor,
}) => {
  const { currentUser, setShowAuthModal } = useApp();

  // Rule 1: Do not render if the user is logged in with a completed profile
  if (currentUser && currentUser.profilComplet) {
    return null;
  }

  return (
    <section className="space-y-5 pt-1 sm:pt-2">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-[#0F6B3F] to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -top-8 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold backdrop-blur-md">
              <span>🇨🇮</span>
              <span>Portail Immobilier de Côte d'Ivoire</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
              Bienvenue sur IvoireLogement
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Choisissez votre porte d'entrée ci-dessous pour accéder directement à votre espace :
            </p>
          </div>

          {/* Unauthenticated / Existing user direct login button */}
          {!currentUser && (
            <div className="pt-2 md:pt-0 shrink-0">
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>J'ai déjà un profil / Se connecter</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* The TWO GATEWAY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
        
        {/* CARTE 1 : « 1. Je cherche un bien » */}
        <div
          onClick={() => onSelectDoor('chercheur')}
          className="group relative bg-white dark:bg-[#16261c] rounded-3xl p-6 sm:p-7 border border-gray-200/90 dark:border-gray-800 hover:border-[#0F6B3F] transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-lg active:scale-[0.985] select-none"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-[#0F6B3F] dark:text-[#34D399] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Search className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F6B3F] dark:text-[#34D399] bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-600/20">
                  Locataires • Acheteurs • Voyageurs
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1">
                  1. Je cherche un bien
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Pour ceux qui veulent louer, acheter ou réserver une maison, un appartement, une résidence, un hôtel ou un terrain.
            </p>

            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400 font-medium pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F6B3F] dark:text-[#34D399] shrink-0" />
                <span>Recherche ciblée à Abidjan & intérieur du pays</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F6B3F] dark:text-[#34D399] shrink-0" />
                <span>Contact direct WhatsApp et appel téléphonique</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectDoor('chercheur');
              }}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#0F6B3F] hover:bg-[#0B5431] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>Accéder à l'interface Chercheur</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CARTE 2 : « 2. Je propose un bien » */}
        <div
          onClick={() => onSelectDoor('proprietaire')}
          className="group relative bg-white dark:bg-[#16261c] rounded-3xl p-6 sm:p-7 border border-gray-200/90 dark:border-gray-800 hover:border-[#F28C1B] transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-lg active:scale-[0.985] select-none"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-[#F28C1B] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F28C1B] bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-600/20">
                  Propriétaires • Agences • Hôteliers
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1">
                  2. Je propose un bien
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              Pour les propriétaires, agences et hôteliers qui veulent publier des offres et trouver des clients.
            </p>

            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400 font-medium pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F28C1B] shrink-0" />
                <span>Publication instantanée et gestion simplifiée des annonces</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F28C1B] shrink-0" />
                <span>Paiements d'acomptes sécurisés par Mobile Money</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectDoor('proprietaire');
              }}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#F28C1B] hover:bg-[#D9770E] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>Accéder à l'interface Propriétaire</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
