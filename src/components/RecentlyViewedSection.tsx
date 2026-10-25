import React from 'react';
import { useApp } from '../context/AppContext';
import { formatFCFA } from '../utils/calculations';
import {
  History,
  Trash2,
  MapPin,
  Eye,
  ArrowRight,
  X,
  Building,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const RecentlyViewedSection: React.FC = () => {
  const {
    recentlyViewedListings,
    removeFromRecentlyViewed,
    clearRecentlyViewed,
    setSelectedListing,
    setActiveTab,
  } = useApp();

  const categoryLabels: Record<string, { label: string; color: string }> = {
    location: { label: 'Location', color: 'bg-emerald-600' },
    vente: { label: 'Vente', color: 'bg-amber-600' },
    meuble: { label: 'Meublé', color: 'bg-blue-600' },
    hotel: { label: 'Hôtel', color: 'bg-purple-600' },
  };

  return (
    <div className="bg-white dark:bg-[#16261c] rounded-3xl p-5 sm:p-6 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#0F6B3F]/10 text-[#0F6B3F] dark:text-[#34D399]">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                Récemment consultés
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#0F6B3F] dark:text-[#34D399] border border-emerald-600/20">
                {recentlyViewedListings.length}/5 mémorisés
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Retrouvez en un clic les 5 dernières annonces visitées depuis votre appareil.
            </p>
          </div>
        </div>

        {recentlyViewedListings.length > 0 && (
          <button
            type="button"
            onClick={clearRecentlyViewed}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 dark:bg-gray-800 dark:hover:bg-red-950/40 text-gray-600 dark:text-gray-300 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Effacer tout l'historique des annonces visitées"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Effacer l'historique</span>
          </button>
        )}
      </div>

      {/* Content */}
      {recentlyViewedListings.length === 0 ? (
        <div className="py-12 px-4 text-center space-y-3 bg-gray-50/50 dark:bg-[#121f17] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#0F6B3F] dark:text-[#34D399] flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
              Aucune annonce consultée pour le moment
            </h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Dès que vous ouvrez une annonce pour voir ses détails ou ses photos, elle apparaîtra automatiquement ici.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('accueil')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95"
          >
            <span>Découvrir les annonces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {recentlyViewedListings.map((item) => {
            const catInfo = categoryLabels[item.categorie] || { label: item.categorie, color: 'bg-gray-600' };
            const priceSuffix =
              item.categorie === 'location'
                ? '/mois'
                : item.categorie === 'meuble' || item.categorie === 'hotel'
                ? '/nuit'
                : '';

            return (
              <div
                key={`recent-${item.id}`}
                className="group relative bg-[#F2F6F0] dark:bg-[#121f17] rounded-2xl p-3 border border-gray-200/80 dark:border-gray-800 hover:border-[#0F6B3F]/40 transition-all flex flex-col justify-between space-y-2.5 shadow-2xs"
              >
                {/* Remove single button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromRecentlyViewed(item.id);
                  }}
                  className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 dark:bg-black/80 text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-xs"
                  title="Retirer de l'historique"
                  aria-label="Retirer de l'historique"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Top Image + Badges */}
                <div
                  onClick={() => setSelectedListing(item)}
                  className="relative aspect-16/10 w-full rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 cursor-pointer"
                >
                  <img
                    src={item.photos[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'}
                    alt={item.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full shadow-xs ${catInfo.color}`}>
                      {catInfo.label}
                    </span>
                    {item.ownerVerifie && (
                      <span className="p-1 rounded-full bg-[#0F6B3F] text-white shadow-xs" title="Propriétaire vérifié">
                        <ShieldCheck className="w-3 h-3 text-amber-300" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <div className="font-extrabold text-sm text-[#0F6B3F] dark:text-[#34D399]">
                      {formatFCFA(item.prix)}
                      {priceSuffix && (
                        <span className="text-[10px] text-gray-400 font-normal ml-0.5">
                          {priceSuffix}
                        </span>
                      )}
                    </div>
                    {item.pieces > 0 && (
                      <span className="text-[10px] font-semibold text-gray-500 bg-white/80 dark:bg-black/40 px-1.5 py-0.5 rounded">
                        {item.pieces} {item.pieces > 1 ? 'pcs' : 'pc'}
                      </span>
                    )}
                  </div>

                  <h4
                    onClick={() => setSelectedListing(item)}
                    className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#0F6B3F] transition-colors cursor-pointer"
                  >
                    {item.titre}
                  </h4>

                  <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                    <MapPin className="w-3 h-3 text-[#F28C1B] shrink-0" />
                    <span className="truncate">{item.commune} • {item.quartier}</span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => setSelectedListing(item)}
                  className="w-full py-1.5 px-3 bg-white dark:bg-gray-800 hover:bg-[#0F6B3F] hover:text-white dark:hover:bg-[#0F6B3F] text-[#0F6B3F] dark:text-[#34D399] border border-[#0F6B3F]/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Revoir cette annonce</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
