import React from 'react';
import { useApp } from '../context/AppContext';
import { COMMUNES_ABIDJAN, AUTRES_VILLES, EQUIPEMENTS_LIST, CATEGORIES_CONFIG } from '../constants/ciData';
import { X, RotateCcw, Check, BellRing, Navigation } from 'lucide-react';
import { CategoryType } from '../types';

export const FiltersModal: React.FC = () => {
  const { filters, setFilters, resetFilters, setIsFiltersOpen, createAlert, currentUser, setShowAuthModal, setActiveTab, userCoords, requestUserLocation } = useApp();


  const handleEquipementToggle = (id: string) => {
    setFilters((prev) => {
      const exists = prev.equipements.includes(id);
      return {
        ...prev,
        equipements: exists ? prev.equipements.filter((e) => e !== id) : [...prev.equipements, id],
      };
    });
  };

  const handleSaveAlert = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    await createAlert({
      categorie: filters.categorie,
      commune: filters.commune !== 'Toutes' ? filters.commune : undefined,
      budgetMax: typeof filters.budgetMax === 'number' ? filters.budgetMax : undefined,
    });
    setIsFiltersOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div className="bg-white dark:bg-[#132219] w-full max-w-xl max-h-[92vh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-[#132219]/95 backdrop-blur-md">
          <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
            Filtres de recherche
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-gray-500 hover:text-[#0F6B3F] flex items-center gap-1 p-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
            <button
              type="button"
              onClick={() => setIsFiltersOpen(false)}
              aria-label="Fermer les filtres"
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filters Content */}
        <div className="overflow-y-auto p-5 space-y-6 flex-1">
          {/* Catégorie */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
              Catégorie d'annonce
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, categorie: 'toutes' }))}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  filters.categorie === 'toutes'
                    ? 'bg-[#0F6B3F] text-white border-[#0F6B3F]'
                    : 'bg-gray-50 dark:bg-[#1a2d22] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}
              >
                Toutes
              </button>
              {CATEGORIES_CONFIG.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, categorie: c.id as CategoryType }))}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    filters.categorie === c.id
                      ? 'bg-[#0F6B3F] text-white border-[#0F6B3F]'
                      : 'bg-gray-50 dark:bg-[#1a2d22] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {c.nom}
                </button>
              ))}
            </div>
          </div>

          {/* Ville ou Commune */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
              Commune d'Abidjan ou Ville
            </label>
            <select
              value={filters.commune}
              onChange={(e) => setFilters((prev) => ({ ...prev, commune: e.target.value }))}
              className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6B3F]"
            >
              <option value="Toutes">Toute la Côte d'Ivoire</option>
              <optgroup label="Communes d'Abidjan">
                {COMMUNES_ABIDJAN.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Villes de l'intérieur">
                {AUTRES_VILLES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Budget Min / Max en FCFA */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
              Budget en FCFA
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Budget minimum</span>
                <input
                  type="number"
                  placeholder="Min (ex: 50 000)"
                  min={0}
                  step={10000}
                  value={filters.budgetMin}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      budgetMin: e.target.value ? Number(e.target.value) : '',
                    }))
                  }
                  className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Budget maximum</span>
                <input
                  type="number"
                  placeholder="Max (ex: 300 000)"
                  min={0}
                  step={10000}
                  value={filters.budgetMax}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      budgetMax: e.target.value ? Number(e.target.value) : '',
                    }))
                  }
                  className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Nombre de pièces */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
              Nombre de pièces
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['toutes', '1', '2', '3', '4', '5'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      pieces: p === 'toutes' ? 'toutes' : Number(p),
                    }))
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                    filters.pieces === (p === 'toutes' ? 'toutes' : Number(p))
                      ? 'bg-[#0F6B3F] text-white border-[#0F6B3F]'
                      : 'bg-gray-50 dark:bg-[#1a2d22] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {p === 'toutes' ? 'Indifférent' : `${p} pièce${Number(p) > 1 ? 's' : ''}`}
                </button>
              ))}
            </div>
          </div>

          {/* Équipements & Commodités demandés */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
              Équipements indispensables
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {EQUIPEMENTS_LIST.map((eq) => {
                const isChecked = filters.equipements.includes(eq.id);
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => handleEquipementToggle(eq.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                      isChecked
                        ? 'bg-[#0F6B3F]/10 border-[#0F6B3F] text-[#0F6B3F] dark:text-[#34D399]'
                        : 'bg-gray-50 dark:bg-[#1a2d22] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        isChecked ? 'bg-[#0F6B3F] border-[#0F6B3F] text-white' : 'border-gray-400'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                    <span>{eq.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tri */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
              Ordre de tri
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'recent', label: 'Plus récents' },
                { id: 'prix_croissant', label: 'Prix croissant' },
                { id: 'prix_decroissant', label: 'Prix décroissant' },
                { id: 'proximite', label: '📍 Proximité GPS' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    if (t.id === 'proximite' && !userCoords) {
                      requestUserLocation();
                    }
                    setFilters((prev) => ({ ...prev, tri: t.id as any }));
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                    filters.tri === t.id
                      ? 'bg-[#0F6B3F] text-white border-[#0F6B3F]'
                      : 'bg-gray-50 dark:bg-[#1a2d22] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#132219] flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveAlert}
            className="p-3 rounded-xl border border-[#0F6B3F] text-[#0F6B3F] dark:text-[#34D399] hover:bg-[#0F6B3F]/10 text-xs font-bold flex items-center gap-1.5 shrink-0"
            title="Créer une alerte pour ces critères"
          >
            <BellRing className="w-4 h-4" />
            <span className="hidden sm:inline">Créer une alerte</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('accueil');
              setIsFiltersOpen(false);
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#0F6B3F] hover:bg-[#0B5431] active:scale-[0.98] text-white font-extrabold text-sm shadow-md transition-all text-center"
          >
            Afficher les résultats
          </button>
        </div>
      </div>
    </div>
  );
};
