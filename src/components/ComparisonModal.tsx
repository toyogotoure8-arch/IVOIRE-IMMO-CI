import React from 'react';
import { useApp } from '../context/AppContext';
import { Listing } from '../types';
import { formatFCFA } from '../utils/calculations';
import {
  X,
  Scale,
  MapPin,
  CheckCircle2,
  Trash2,
  Eye,
  ShieldCheck,
  Building2,
  AlertCircle,
} from 'lucide-react';

interface Props {
  onClose: () => void;
  onSelectListing: (listing: Listing) => void;
}

export const ComparisonModal: React.FC<Props> = ({ onClose, onSelectListing }) => {
  const { compareListings, toggleCompare, clearCompare, listings } = useApp();

  const comparedItems = listings.filter((l) => compareListings.includes(l.id));

  return (
    <div className="fixed inset-0 z-70 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#16261c] w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-[#121f17]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#0F6B3F]/10 text-[#0F6B3F] dark:text-[#34D399]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                Comparateur d'annonces immobilières
              </h3>
              <p className="text-xs text-gray-500">
                Comparaison côte à côte de {comparedItems.length} sur 3 biens maximum
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedItems.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Tout vider</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Table Container */}
        <div className="p-4 sm:p-6 overflow-x-auto flex-1">
          {comparedItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Scale className="w-12 h-12 text-gray-400 mx-auto" />
              <h4 className="font-extrabold text-base text-gray-900 dark:text-white">
                Aucune annonce sélectionnée pour la comparaison
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Cliquez sur le bouton « Comparer » sur les cartes d'annonces (jusqu'à 3) pour les analyser côte à côte.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-[#0F6B3F] text-white rounded-xl text-xs font-bold shadow"
              >
                Explorer les annonces
              </button>
            </div>
          ) : (
            <div className="min-w-[650px] space-y-6">
              {/* Cards Header Row */}
              <div className="grid grid-cols-4 gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="font-extrabold text-xs text-gray-400 uppercase tracking-wider flex items-center">
                  Caractéristiques
                </div>
                {comparedItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 dark:bg-[#121f17] p-3 rounded-2xl border border-gray-200/80 dark:border-gray-800 space-y-2 relative flex flex-col justify-between">
                    <button
                      type="button"
                      onClick={() => toggleCompare(item.id)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500 shadow-xs"
                      title="Retirer du comparateur"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-gray-200">
                      <img src={item.photos[0]} alt={item.titre} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#F28C1B]">
                        {item.categorie} • {item.type}
                      </span>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-2">
                        {item.titre}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectListing(item);
                      }}
                      className="w-full py-1.5 bg-[#0F6B3F] text-white text-[11px] font-bold rounded-lg shadow-xs"
                    >
                      Voir détails
                    </button>
                  </div>
                ))}

                {/* Empty slots placeholders if less than 3 */}
                {Array.from({ length: 3 - comparedItems.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-gray-400 space-y-1.5">
                    <Building2 className="w-8 h-8 opacity-40" />
                    <span className="text-xs font-bold">Emplacement libre</span>
                    <span className="text-[10px]">Ajouter un 3e bien à comparer</span>
                  </div>
                ))}
              </div>

              {/* Rows Comparison */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                {/* Prix */}
                <div className="grid grid-cols-4 gap-3 py-3 items-center">
                  <div className="font-bold text-gray-500">Prix</div>
                  {comparedItems.map((item) => (
                    <div key={item.id} className="font-black text-sm text-[#0F6B3F] dark:text-[#34D399]">
                      {formatFCFA(item.prix)}
                      <span className="text-[10px] text-gray-400 font-normal ml-1">
                        {item.categorie === 'location' ? '/mois' : item.categorie === 'meuble' ? '/nuit' : ''}
                      </span>
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, i) => (
                    <div key={`empty-price-${i}`} className="text-gray-400">—</div>
                  ))}
                </div>

                {/* Localisation */}
                <div className="grid grid-cols-4 gap-3 py-3 items-center">
                  <div className="font-bold text-gray-500">Localisation</div>
                  {comparedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-1 text-gray-800 dark:text-gray-200 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-[#F28C1B] shrink-0" />
                      <span>{item.commune} ({item.quartier})</span>
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, i) => (
                    <div key={`empty-loc-${i}`} className="text-gray-400">—</div>
                  ))}
                </div>

                {/* Pièces */}
                <div className="grid grid-cols-4 gap-3 py-3 items-center">
                  <div className="font-bold text-gray-500">Nombre de pièces</div>
                  {comparedItems.map((item) => (
                    <div key={item.id} className="font-bold text-gray-800 dark:text-gray-200">
                      {item.pieces > 0 ? `${item.pieces} pièces` : 'Terrain / Autre'}
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, i) => (
                    <div key={`empty-pieces-${i}`} className="text-gray-400">—</div>
                  ))}
                </div>

                {/* Propriétaire & Vérification */}
                <div className="grid grid-cols-4 gap-3 py-3 items-center">
                  <div className="font-bold text-gray-500">Propriétaire</div>
                  {comparedItems.map((item) => (
                    <div key={item.id} className="space-y-0.5">
                      <div className="font-bold text-gray-800 dark:text-gray-200">{item.ownerNom}</div>
                      {item.ownerVerifie && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Vérifié</span>
                        </span>
                      )}
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, i) => (
                    <div key={`empty-owner-${i}`} className="text-gray-400">—</div>
                  ))}
                </div>

                {/* Équipements */}
                <div className="grid grid-cols-4 gap-3 py-3 items-start">
                  <div className="font-bold text-gray-500">Équipements & Commodités</div>
                  {comparedItems.map((item) => (
                    <div key={item.id} className="flex flex-wrap gap-1">
                      {item.equipements.length > 0 ? (
                        item.equipements.map((eq, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold"
                          >
                            {eq}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">Aucun spécifié</span>
                      )}
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, i) => (
                    <div key={`empty-eq-${i}`} className="text-gray-400">—</div>
                  ))}
                </div>

                {/* Vues / Popularité */}
                <div className="grid grid-cols-4 gap-3 py-3 items-center">
                  <div className="font-bold text-gray-500">Popularité</div>
                  {comparedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Eye className="w-3.5 h-3.5 text-[#0F6B3F]" />
                      <span>{item.vues || 0} vues sur l'annonce</span>
                    </div>
                  ))}
                  {Array.from({ length: 3 - comparedItems.length }).map((_, i) => (
                    <div key={`empty-views-${i}`} className="text-gray-400">—</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
