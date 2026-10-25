import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from './ListingCard';
import { MapView } from './MapView';
import { COMMUNES_ABIDJAN, CATEGORIES_CONFIG } from '../constants/ciData';
import { CategoryType } from '../types';
import {
  Search,
  SlidersHorizontal,
  Map,
  List,
  Navigation,
  Sparkles,
  TrendingUp,
  Building,
  RotateCcw,
  History,
  X,
  ShieldAlert,
  Hotel,
  BellRing,
  CheckCircle,
  Loader2,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';

export const ChercheurHomeView: React.FC = () => {
  const {
    currentUser,
    listings,
    filteredListings,
    isLoadingListings,
    filters,
    setFilters,
    setIsFiltersOpen,
    isMapView,
    setIsMapView,
    resetFilters,
    requestUserLocation,
    userCoords,
    isLocationLoading,
    recentSearches,
    recordSearch,
    removeSearch,
    clearAllSearches,
    createAlert,
    switchActiveSpace,
  } = useApp();

  const [showLocationHint, setShowLocationHint] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  const prenom = currentUser?.prenoms || currentUser?.nom || 'Chercheur';

  const handleCategoryClick = (cat: CategoryType | 'toutes') => {
    setFilters((prev) => ({ ...prev, categorie: cat }));
    if (cat !== 'toutes') {
      const catObj = CATEGORIES_CONFIG.find((c) => c.id === cat);
      recordSearch(catObj?.nom || cat, filters.commune !== 'Toutes' ? filters.commune : undefined, cat);
    }
  };

  const handleCommuneClick = (communeName: string) => {
    setFilters((prev) => ({ ...prev, commune: communeName }));
    recordSearch(communeName, communeName, filters.categorie);
  };

  const handleCreateAlertFromCriteria = async () => {
    await createAlert({
      categorie: filters.categorie,
      commune: filters.commune !== 'Toutes' ? filters.commune : 'Cocody',
      budgetMax: typeof filters.budgetMax === 'number' ? filters.budgetMax : undefined,
    });
  };

  const handleAutourDeMoiClick = async () => {
    setShowLocationHint(true);
    await requestUserLocation();
  };

  // Count active filters
  let activeFilterCount = 0;
  if (filters.commune !== 'Toutes') activeFilterCount++;
  if (filters.budgetMin !== '') activeFilterCount++;
  if (filters.budgetMax !== '') activeFilterCount++;
  if (filters.pieces !== 'toutes') activeFilterCount++;
  if (filters.equipements.length > 0) activeFilterCount += filters.equipements.length;

  // Total published listings in the app
  const allPublishedListings = listings.filter((l) => l.statut === 'publiee');
  const hasAnyPublished = allPublishedListings.length > 0;

  // « Annonces à la une » : uniquement les annonces réellement mises en avant (misEnAvant == true et date de fin non dépassée).
  const featuredListings = filteredListings.filter(
    (l) => l.misEnAvant === true && (!l.misEnAvantFin || new Date(l.misEnAvantFin).getTime() > Date.now())
  );
  const hasVerifiedInFeatured = featuredListings.some((l) => l.ownerVerifie === true);

  const recentListings = filteredListings.slice(0, 8);
  const hotelsAndStays = listings.filter((l) => l.statut === 'publiee' && (l.categorie === 'hotel' || l.categorie === 'meuble')).slice(0, 6);

  const majorCommunes = ['Cocody', 'Marcory', 'Koumassi', 'Yopougon', 'Plateau', 'Bingerville', 'Grand-Bassam', 'Port-Bouët'];

  const hasOwnerRole = currentUser?.roles?.includes('proprietaire') || currentUser?.role === 'proprietaire';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 2. BLOC DE RECHERCHE */}
      <section className="bg-white dark:bg-[#16261c] p-4 sm:p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-4">
        {/* Short Salutation */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            Bonjour {prenom}, que cherchez-vous ?
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Trouvez votre location, achat, meublé ou hôtel vérifié en Côte d'Ivoire.
          </p>
        </div>

        {/* Main Search Input Bar + Filter Trigger + Map Toggle */}
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
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#132219] border border-gray-200 dark:border-gray-700 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F6B3F] shadow-2xs transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsFiltersOpen(true)}
            className={`relative p-3 rounded-2xl border transition-all flex items-center justify-center shrink-0 active:scale-95 shadow-2xs ${
              activeFilterCount > 0
                ? 'bg-[#0F6B3F] text-white border-[#0F6B3F]'
                : 'bg-gray-50 dark:bg-[#132219] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-[#0F6B3F]'
            }`}
            aria-label="Filtres avancés"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F28C1B] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMapView(!isMapView)}
            className="p-3 rounded-2xl bg-gray-50 dark:bg-[#132219] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-[#0F6B3F] transition-all flex items-center justify-center shrink-0 active:scale-95 shadow-2xs"
            aria-label={isMapView ? 'Vue liste' : 'Vue carte'}
            title={isMapView ? 'Vue Liste' : 'Vue Carte'}
          >
            {isMapView ? <List className="w-5 h-5 text-[#0F6B3F]" /> : <Map className="w-5 h-5 text-[#0F6B3F]" />}
          </button>
        </div>

        {/* Intent Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategoryClick('toutes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 flex items-center gap-1.5 shadow-2xs ${
              filters.categorie === 'toutes'
                ? 'bg-[#0F6B3F] text-white'
                : 'bg-gray-50 dark:bg-[#132219] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tous</span>
          </button>

          {CATEGORIES_CONFIG.map((cat) => {
            const isSelected = filters.categorie === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id as CategoryType)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 flex items-center gap-1.5 shadow-2xs ${
                  isSelected
                    ? 'bg-[#0F6B3F] text-white'
                    : 'bg-gray-50 dark:bg-[#132219] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span>{cat.nom}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Filters in One Line & "Autour de moi" button (Disabled by default) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          {/* Quick Commune */}
          <select
            value={filters.commune}
            onChange={(e) => setFilters((prev) => ({ ...prev, commune: e.target.value }))}
            className="bg-gray-50 dark:bg-[#132219] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0F6B3F]"
          >
            <option value="Toutes">Toutes les communes</option>
            {COMMUNES_ABIDJAN.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Quick Budget Max */}
          <select
            value={filters.budgetMax}
            onChange={(e) => setFilters((prev) => ({ ...prev, budgetMax: e.target.value ? Number(e.target.value) : '' }))}
            className="bg-gray-50 dark:bg-[#132219] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0F6B3F]"
          >
            <option value="">Budget max (FCFA)</option>
            <option value={100000}>100 000 FCFA</option>
            <option value={200000}>200 000 FCFA</option>
            <option value={350000}>350 000 FCFA</option>
            <option value={500000}>500 000 FCFA</option>
            <option value={1000000}>1 000 000 FCFA</option>
          </select>

          {/* Quick Rooms */}
          <select
            value={filters.pieces}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                pieces: e.target.value === 'toutes' ? 'toutes' : Number(e.target.value),
              }))
            }
            className="bg-gray-50 dark:bg-[#132219] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0F6B3F]"
          >
            <option value="toutes">Pièces</option>
            <option value={1}>1 pièce (Studio)</option>
            <option value={2}>2 pièces</option>
            <option value={3}>3 pièces</option>
            <option value={4}>4+ pièces</option>
          </select>

          {/* Autour de moi Button */}
          <button
            type="button"
            onClick={handleAutourDeMoiClick}
            disabled={isLocationLoading}
            className={`ml-auto px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 flex items-center gap-1.5 border ${
              userCoords
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-gray-50 dark:bg-[#132219] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-emerald-50'
            }`}
          >
            {isLocationLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-[#0F6B3F] dark:text-[#34D399]" />
            )}
            <span>{userCoords ? 'Autour de moi (Actif)' : 'Autour de moi'}</span>
          </button>
        </div>

        {showLocationHint && (
          <p className="text-[11px] text-gray-500 dark:text-gray-400 italic bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-xl border border-emerald-500/20">
            📍 La géolocalisation GPS est activée sur demande pour calculer la distance des biens autour de vous en Côte d'Ivoire.
          </p>
        )}
      </section>

      {/* 3. « REPRENDRE MA RECHERCHE » (Shown only if user has searched) */}
      {recentSearches.length > 0 && (
        <section className="bg-white dark:bg-[#16261c] p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#0F6B3F] dark:text-[#34D399]" />
              <h2 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                Reprendre ma recherche
              </h2>
            </div>
            <button
              type="button"
              onClick={clearAllSearches}
              className="text-[11px] text-gray-400 hover:text-red-500 underline"
            >
              Effacer l'historique
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {recentSearches.slice(0, 4).map((rs) => (
              <div
                key={rs.id}
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    commune: rs.commune || 'Toutes',
                    categorie: rs.categorie || prev.categorie,
                  }));
                  recordSearch(rs.label, rs.commune, rs.categorie);
                }}
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-50 dark:bg-[#132219] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 text-xs font-semibold cursor-pointer shadow-2xs transition-all"
              >
                <span>{rs.label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSearch(rs.id);
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs text-gray-500">
              Recevez des alertes automatiques pour ces critères.
            </span>
            <button
              type="button"
              onClick={handleCreateAlertFromCriteria}
              className="px-3 py-1.5 rounded-xl bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <BellRing className="w-3.5 h-3.5 text-amber-300" />
              <span>Créer une alerte avec ces critères</span>
            </button>
          </div>
        </section>
      )}

      {/* Map View or Grid View */}
      {isLoadingListings ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-3 border-[#0F6B3F] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-600 dark:text-gray-300">Chargement des biens immobiliers...</p>
        </div>
      ) : isMapView ? (
        <MapView listings={filteredListings} />
      ) : (
        <>
          {/* EMPTY STATE 1: No published listings at all in the application */}
          {!hasAnyPublished ? (
            <div className="bg-white dark:bg-[#16261c] rounded-3xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-800 space-y-4 my-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#0F6B3F] dark:text-[#34D399] mx-auto flex items-center justify-center">
                <Building className="w-8 h-8" />
              </div>
              <h3 className="font-black text-lg text-gray-900 dark:text-white">
                Les premières annonces arrivent bientôt
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Aucune annonce n'est publiée pour le moment. Créez une alerte pour être notifié dès la mise en ligne du premier bien.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCreateAlertFromCriteria}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold rounded-xl shadow transition-all"
                >
                  <BellRing className="w-4 h-4 text-amber-300" />
                  <span>Créer une alerte</span>
                </button>

                {hasOwnerRole && (
                  <button
                    type="button"
                    onClick={() => switchActiveSpace('proprietaire')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publier la première annonce</span>
                  </button>
                )}
              </div>
            </div>
          ) : filteredListings.length === 0 ? (
            /* EMPTY STATE 2: Search yields no results */
            <div className="bg-white dark:bg-[#16261c] rounded-3xl p-10 text-center border border-dashed border-gray-300 dark:border-gray-800 space-y-3 my-6">
              <Building className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                Aucun bien ne correspond. Élargissez votre budget ou changez de commune.
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Essayez d'ajuster vos critères de recherche ou créez une alerte pour recevoir les biens correspondants.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser</span>
                </button>
                <button
                  type="button"
                  onClick={handleCreateAlertFromCriteria}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold rounded-xl shadow"
                >
                  <BellRing className="w-3.5 h-3.5 text-amber-300" />
                  <span>Créer une alerte avec ces critères</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 4. « ANNONCES À LA UNE » (Only if misEnAvant == true and date not expired. Mask entirely if none) */}
              {featuredListings.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#F28C1B]" />
                      <h2 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                        Annonces à la une
                      </h2>
                    </div>
                    {hasVerifiedInFeatured && (
                      <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                        Vérifiées & Populaires
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {featuredListings.map((item) => (
                      <ListingCard key={`featured-${item.id}`} listing={item} />
                    ))}
                  </div>
                </section>
              )}

              {/* 5. « NOUVEAUTÉS » (Sorted by creation date) */}
              <section className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0F6B3F] dark:text-[#34D399]" />
                    <h2 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                      Nouveautés en Côte d'Ivoire
                    </h2>
                  </div>
                  <span className="text-xs text-gray-500">
                    {filteredListings.length} bien{filteredListings.length > 1 ? 's' : ''} trouvé{filteredListings.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recentListings.map((item) => (
                    <ListingCard key={`recent-${item.id}`} listing={item} />
                  ))}
                </div>
              </section>

              {/* 6. « EXPLORER PAR COMMUNE » */}
              <section className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-[#F28C1B]" />
                  <h2 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                    Explorer par commune
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                  {majorCommunes.map((commune) => (
                    <button
                      key={commune}
                      type="button"
                      onClick={() => handleCommuneClick(commune)}
                      className="p-3 rounded-2xl bg-white dark:bg-[#16261c] border border-gray-200/80 dark:border-gray-800 hover:border-[#0F6B3F] text-center transition-all shadow-2xs group active:scale-95"
                    >
                      <div className="text-xs font-extrabold text-gray-900 dark:text-white group-hover:text-[#0F6B3F]">
                        {commune}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Abidjan</div>
                    </button>
                  ))}
                </div>
              </section>

              {/* 7. « HÔTELS ET SÉJOURS » */}
              {hotelsAndStays.length > 0 && (
                <section className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hotel className="w-4 h-4 text-purple-600" />
                      <h2 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                        Hôtels et séjours meublés
                      </h2>
                    </div>
                    <span className="text-xs text-gray-500">Séjours de courte et longue durée</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {hotelsAndStays.map((item) => (
                      <ListingCard key={`hotel-${item.id}`} listing={item} />
                    ))}
                  </div>
                </section>
              )}

              {/* 8. « CONSEILS ANTI-ARNAQUE » */}
              <section className="bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 rounded-3xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500 text-white">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-amber-950 dark:text-amber-200">
                      Conseils anti-arnaque immobilière en Côte d'Ivoire
                    </h3>
                    <p className="text-xs text-amber-900/80 dark:text-amber-300/80">
                      Protégez vos transactions immobilières à Abidjan et à l'intérieur du pays.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white dark:bg-[#16261c] p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-1">
                    <div className="font-extrabold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#0F6B3F]" />
                      <span>1. Jamais d'acompte sans visite</span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400">
                      Ne versez jamais d'argent (Wave, Orange Money) avant d'avoir visité physiquement le bien avec le propriétaire ou son représentant agréé.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-[#16261c] p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-1">
                    <div className="font-extrabold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#0F6B3F]" />
                      <span>2. Vérifiez les documents</span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400">
                      Exigez la consultation des originaux (Titre Foncier, ACD, Arrêté de Concession Définitive ou Attestation Villageoise sécurisée).
                    </p>
                  </div>

                  <div className="bg-white dark:bg-[#16261c] p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-1">
                    <div className="font-extrabold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#0F6B3F]" />
                      <span>3. Signalez les anomalies</span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400">
                      Utilisez le bouton « Signaler » sur toute annonce suspecte ou présentant des photos trompeuses pour protéger la communauté.
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};
