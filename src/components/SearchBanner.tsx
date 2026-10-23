import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryType } from '../types';
import { CATEGORIES_CONFIG } from '../constants/ciData';
import { RecentSearch } from '../utils/recentSearches';
import {
  Search,
  SlidersHorizontal,
  Map,
  List,
  Navigation,
  Sparkles,
  Building2,
  Home,
  BedDouble,
  Hotel,
  History,
  X,
  Loader2,
} from 'lucide-react';

export const SearchBanner: React.FC = () => {
  const {
    filters,
    setFilters,
    setIsFiltersOpen,
    isMapView,
    setIsMapView,
    requestUserLocation,
    userCoords,
    isLocationLoading,
    filteredListings,
    recentSearches,
    recordSearch,
    removeSearch,
    clearAllSearches,
  } = useApp();


  const handleCategoryClick = (cat: CategoryType | 'toutes') => {
    setFilters((prev) => ({ ...prev, categorie: cat }));
    if (cat !== 'toutes') {
      const catObj = CATEGORIES_CONFIG.find((c) => c.id === cat);
      recordSearch(catObj?.nom || cat, filters.commune !== 'Toutes' ? filters.commune : undefined, cat);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filters.commune.trim() && filters.commune !== 'Toutes') {
      recordSearch(filters.commune.trim(), filters.commune.trim(), filters.categorie);
    }
  };

  const handleApplyRecentSearch = (rs: RecentSearch) => {
    setFilters((prev) => ({
      ...prev,
      commune: rs.commune || rs.label || 'Toutes',
      categorie: rs.categorie || prev.categorie,
    }));
    recordSearch(rs.label, rs.commune, rs.categorie);
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'location':
        return Home;
      case 'vente':
        return Building2;
      case 'meuble':
        return BedDouble;
      case 'hotel':
        return Hotel;
      default:
        return Sparkles;
    }
  };

  // Count active filters (non defaults)
  let activeFilterCount = 0;
  if (filters.commune !== 'Toutes') activeFilterCount++;
  if (filters.budgetMin !== '') activeFilterCount++;
  if (filters.budgetMax !== '') activeFilterCount++;
  if (filters.pieces !== 'toutes') activeFilterCount++;
  if (filters.equipements.length > 0) activeFilterCount += filters.equipements.length;
  if (filters.tri !== 'recent') activeFilterCount++;

  return (
    <div className="space-y-3 mb-5">
      {/* Search Input Bar + Filter Trigger */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4 text-[#0F6B3F]" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par commune, quartier, type..."
            value={filters.commune === 'Toutes' ? '' : filters.commune}
            onChange={(e) => setFilters((prev) => ({ ...prev, commune: e.target.value || 'Toutes' }))}
            onKeyDown={handleInputKeyDown}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#16261c] border border-gray-200/80 dark:border-gray-800 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F6B3F] shadow-sm transition-all"
          />
        </div>

        {/* Filter Sheet Button */}
        <button
          type="button"
          onClick={() => setIsFiltersOpen(true)}
          className={`relative p-3 rounded-2xl border transition-all flex items-center justify-center shrink-0 active:scale-95 shadow-sm ${
            activeFilterCount > 0
              ? 'bg-[#0F6B3F] text-white border-[#0F6B3F]'
              : 'bg-white dark:bg-[#16261c] text-gray-700 dark:text-gray-200 border-gray-200/80 dark:border-gray-800 hover:border-[#0F6B3F]'
          }`}
          aria-label="Ouvrir les filtres avancés"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#F28C1B] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Map / List View Toggle */}
        <button
          type="button"
          onClick={() => setIsMapView(!isMapView)}
          className="p-3 rounded-2xl bg-white dark:bg-[#16261c] text-gray-700 dark:text-gray-200 border border-gray-200/80 dark:border-gray-800 hover:border-[#0F6B3F] transition-all flex items-center justify-center shrink-0 active:scale-95 shadow-sm"
          aria-label={isMapView ? 'Passer en vue liste' : 'Passer en vue carte'}
          title={isMapView ? 'Vue Liste' : 'Vue Carte'}
        >
          {isMapView ? <List className="w-5 h-5 text-[#0F6B3F]" /> : <Map className="w-5 h-5 text-[#0F6B3F]" />}
        </button>
      </div>

      {/* 3 Dernières Recherches Récentes de l'utilisateur */}
      {recentSearches.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 font-bold text-[11px] shrink-0">
            <History className="w-3.5 h-3.5 text-[#0F6B3F] dark:text-[#34D399]" />
            <span>Récents :</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {recentSearches.slice(0, 3).map((rs) => (
              <div
                key={rs.id}
                onClick={() => handleApplyRecentSearch(rs)}
                className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#1a2d22] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-gray-800 dark:text-gray-200 hover:text-[#0F6B3F] dark:hover:text-[#34D399] border border-gray-200/90 dark:border-gray-700 text-[11px] font-semibold transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
                title={`Relancer la recherche : ${rs.label}`}
              >
                <span>{rs.label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSearch(rs.id);
                  }}
                  aria-label={`Supprimer ${rs.label} de l'historique`}
                  className="text-gray-400 hover:text-red-500 transition-colors rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {recentSearches.length > 0 && (
              <button
                type="button"
                onClick={clearAllSearches}
                className="text-[10px] text-gray-400 hover:text-red-500 underline ml-1 shrink-0"
              >
                Effacer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Categories Chips Bar (Horizontal Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => handleCategoryClick('toutes')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 flex items-center gap-1.5 shadow-sm ${
            filters.categorie === 'toutes'
              ? 'bg-[#0F6B3F] text-white shadow-[#0F6B3F]/20'
              : 'bg-white dark:bg-[#16261c] text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-800 hover:bg-gray-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Toutes</span>
        </button>

        {CATEGORIES_CONFIG.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const isSelected = filters.categorie === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id as CategoryType)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 flex items-center gap-1.5 shadow-sm ${
                isSelected
                  ? 'bg-[#0F6B3F] text-white shadow-[#0F6B3F]/20'
                  : 'bg-white dark:bg-[#16261c] text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-800 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.nom}</span>
            </button>
          );
        })}

        {/* Geolocation Button */}
        <button
          type="button"
          onClick={requestUserLocation}
          disabled={isLocationLoading}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 flex items-center gap-1.5 shadow-sm border ${
            userCoords
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-[#16261c] text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50 hover:bg-blue-50'
          }`}
        >
          {isLocationLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5 fill-current" />
          )}
          <span>
            {isLocationLoading
              ? 'Recherche GPS...'
              : userCoords
              ? 'Autour de moi (Actif)'
              : 'Autour de moi'}
          </span>
        </button>

      </div>

      {/* Results Header Count & Sort Quick Display */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
        <span>
          <strong className="text-gray-900 dark:text-white font-bold">{filteredListings.length}</strong> bien{filteredListings.length > 1 ? 's' : ''} trouvé{filteredListings.length > 1 ? 's' : ''}
          {filters.commune !== 'Toutes' && ` à ${filters.commune}`}
        </span>

        <span className="text-[11px] font-medium">
          Tri : {filters.tri === 'recent' ? 'Plus récents' : filters.tri === 'prix_croissant' ? 'Prix croissant' : filters.tri === 'prix_decroissant' ? 'Prix décroissant' : '📍 Proximité GPS'}
        </span>

      </div>
    </div>
  );
};
