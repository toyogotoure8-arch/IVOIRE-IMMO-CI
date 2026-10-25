import React from 'react';
import { useApp } from '../context/AppContext';
import { AppSpace } from '../types';
import {
  X,
  Search,
  Building2,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface Props {
  onClose: () => void;
  onOpenOnboardingForRole: (space: AppSpace) => void;
}

export const SpaceSwitchModal: React.FC<Props> = ({ onClose, onOpenOnboardingForRole }) => {
  const { currentUser, switchActiveSpace, showToast } = useApp();

  const userRoles = currentUser?.roles || (currentUser?.espaceActif ? [currentUser.espaceActif] : []);
  const activeSpace = currentUser?.espaceActif || 'chercheur';

  const handleSelectSpace = async (space: AppSpace) => {
    if (userRoles.includes(space)) {
      await switchActiveSpace(space);
      onClose();
    } else {
      // User doesn't have this role yet -> open short role addition form (no re-asking common info)
      onClose();
      onOpenOnboardingForRole(space);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#16261c] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-[#0F6B3F] to-emerald-950 p-5 sm:p-6 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
              Compte Unique : {currentUser?.nom} ({currentUser?.telephone})
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
              Changer d'espace de travail
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Un seul compte gère l'ensemble de vos activités. Basculez d'un espace à l'autre ou activez un nouveau statut en 1 clic.
          </p>

          <div className="grid grid-cols-1 gap-3.5">
            {/* Card 1: Espace Chercheur */}
            <div
              onClick={() => handleSelectSpace('chercheur')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                activeSpace === 'chercheur'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#0F6B3F] ring-2 ring-[#0F6B3F]/20'
                  : 'bg-white dark:bg-[#121f17] border-gray-200 dark:border-gray-800 hover:border-[#0F6B3F]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0F6B3F]/15 text-[#0F6B3F] dark:text-[#34D399] flex items-center justify-center shrink-0">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                      Espace Chercheur
                    </h4>
                    {userRoles.includes('chercheur') ? (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-[#34D399] bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        Statut activé
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Nouveau statut
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Trouver une location, acheter un bien, réserver un meublé ou un hôtel.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                {activeSpace === 'chercheur' ? (
                  <span className="text-xs font-black text-[#0F6B3F] dark:text-[#34D399] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden xs:inline">Actif</span>
                  </span>
                ) : userRoles.includes('chercheur') ? (
                  <span className="px-3 py-1.5 bg-[#0F6B3F] text-white rounded-xl text-xs font-bold shadow flex items-center gap-1">
                    <span>Ouvrir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-emerald-100 text-[#0F6B3F] rounded-xl text-xs font-bold flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Activer</span>
                  </span>
                )}
              </div>
            </div>

            {/* Card 2: Espace Propriétaire */}
            <div
              onClick={() => handleSelectSpace('proprietaire')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                activeSpace === 'proprietaire'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-[#F28C1B] ring-2 ring-[#F28C1B]/20'
                  : 'bg-white dark:bg-[#121f17] border-gray-200 dark:border-gray-800 hover:border-[#F28C1B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-[#F28C1B] flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                      Espace Propriétaire
                    </h4>
                    {userRoles.includes('proprietaire') ? (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                        Statut activé
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                        Nouveau statut
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Publier des annonces, recevoir des réservations, gérer mes offres.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                {activeSpace === 'proprietaire' ? (
                  <span className="text-xs font-black text-[#F28C1B] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden xs:inline">Actif</span>
                  </span>
                ) : userRoles.includes('proprietaire') ? (
                  <span className="px-3 py-1.5 bg-[#F28C1B] text-white rounded-xl text-xs font-bold shadow flex items-center gap-1">
                    <span>Ouvrir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-amber-100 text-[#F28C1B] rounded-xl text-xs font-bold flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Activer</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-[#121f17] border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
