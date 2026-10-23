import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SearchBanner } from './components/SearchBanner';
import { ListingCard } from './components/ListingCard';
import { MapView } from './components/MapView';
import { ListingDetailModal } from './components/ListingDetailModal';
import { FiltersModal } from './components/FiltersModal';
import { PublishModal } from './components/PublishModal';
import { AuthModal } from './components/AuthModal';
import { RoleSelectModal } from './components/RoleSelectModal';
import { FavoritesView } from './components/FavoritesView';
import { UserSpaceView } from './components/UserSpaceView';
import { AlertsModal } from './components/AlertsModal';
import {
  Sparkles,
  TrendingUp,
  Search,
  Building,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    filteredListings,
    selectedListing,
    setSelectedListing,
    isFiltersOpen,
    isMapView,
    resetFilters,
    toast,
  } = useApp();

  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  // Split featured listings (ex: with verified owners or high views) and recent listings
  const featuredListings = filteredListings.filter((l) => l.ownerVerifie || l.vues > 200).slice(0, 4);
  const recentListings = filteredListings.slice(0, 12);

  return (
    <div className="min-h-screen bg-[#F2F6F0] dark:bg-[#0d1712] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200 pb-20 sm:pb-12">
      {/* Toast popup */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-70 animate-in fade-in slide-in-from-top-4 duration-200 max-w-sm w-full px-4">
          <div
            className={`flex items-center gap-2.5 p-3.5 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold text-white ${
              toast.type === 'error'
                ? 'bg-red-600'
                : toast.type === 'info'
                ? 'bg-blue-600'
                : 'bg-[#0F6B3F]'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0" />
            )}
            <span className="flex-1">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenAlerts={() => setIsAlertsOpen(true)}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1 w-full">
        {/* 1. Tab Accueil */}
        {activeTab === 'accueil' && (
          <div className="space-y-6">
            <SearchBanner />

            {/* List vs Map View */}
            {isMapView ? (
              <MapView listings={filteredListings} />
            ) : (
              <>
                {/* Empty state if search has no results */}
                {filteredListings.length === 0 ? (
                  <div className="bg-white dark:bg-[#16261c] rounded-3xl p-10 text-center border border-dashed border-gray-300 dark:border-gray-800 space-y-3 my-6">
                    <Building className="w-12 h-12 text-gray-400 mx-auto" />
                    <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                      Aucune annonce ne correspond à vos filtres
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Essayez d'élargir la commune, d'augmenter le budget maximum ou de réduire les équipements exigés.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold rounded-xl shadow"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Réinitialiser les filtres</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Annonces à la Une (Featured) */}
                    {featuredListings.length > 0 && (
                      <section className="space-y-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#F28C1B]" />
                          <h2 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                            Annonces à la une
                          </h2>
                          <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                            Sélection vérifiée
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {featuredListings.map((item) => (
                            <ListingCard key={`featured-${item.id}`} listing={item} />
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Toutes les Annonces Récentes */}
                    <section className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#0F6B3F] dark:text-[#34D399]" />
                          <h2 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                            Annonces récentes en Côte d'Ivoire
                          </h2>
                        </div>
                        <span className="text-xs text-gray-500">
                          {filteredListings.length} disponible{filteredListings.length > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recentListings.map((item) => (
                          <ListingCard key={item.id} listing={item} />
                        ))}
                      </div>
                    </section>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* 2. Tab Favoris */}
        {activeTab === 'favoris' && <FavoritesView />}

        {/* 3. Tab Publier (Trigger direct ou modal) */}
        {activeTab === 'publier' && (
          <div className="py-2">
            <PublishModal onClose={() => setActiveTab('accueil')} />
          </div>
        )}

        {/* 4. Tab Mon Espace */}
        {activeTab === 'mon_espace' && (
          <UserSpaceView
            onOpenPublish={() => setIsPublishOpen(true)}
            onOpenAlerts={() => setIsAlertsOpen(true)}
          />
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav onOpenPublish={() => setIsPublishOpen(true)} />

      {/* Modals & Dialogs */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}

      {isFiltersOpen && <FiltersModal />}

      {isPublishOpen && (
        <PublishModal onClose={() => setIsPublishOpen(false)} />
      )}

      {isAlertsOpen && (
        <AlertsModal onClose={() => setIsAlertsOpen(false)} />
      )}

      <AuthModal />
      <RoleSelectModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
