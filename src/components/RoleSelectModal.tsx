import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, PlusCircle, Building2, Home } from 'lucide-react';

export const RoleSelectModal: React.FC = () => {
  const { showRoleModal, switchRole } = useApp();

  if (!showRoleModal) return null;

  return (
    <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#132219] w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-200/80 dark:border-gray-800 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div>
          <span className="text-3xl mb-2 inline-block">🇨🇮</span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            Bienvenue sur IvoireImmo !
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Choisissez votre profil pour une expérience sur mesure. Vous pourrez changer à tout moment.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => switchRole('client')}
            className="w-full p-4 rounded-2xl border-2 border-emerald-600/30 hover:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 text-left transition-all active:scale-[0.98] group flex items-start gap-3.5"
          >
            <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-sm shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-emerald-700">
                « Je cherche » (Locataire, acheteur ou voyageur)
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Trouvez des studios, appartements, villas, terrains et réservez des hôtels ou résidences meublées.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => switchRole('proprietaire')}
            className="w-full p-4 rounded-2xl border-2 border-amber-600/30 hover:border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 text-left transition-all active:scale-[0.98] group flex items-start gap-3.5"
          >
            <div className="p-3 rounded-xl bg-[#F28C1B] text-white shadow-sm shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-amber-700">
                « Je publie » (Propriétaire, agence ou hôtelier)
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Publiez vos annonces, recevez des contacts WhatsApp et gérez vos demandes de réservation.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
