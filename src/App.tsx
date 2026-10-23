import React, { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
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
import { PublicListingView } from './components/PublicListingView';
import { OfferSelectionModal, SelectedPaymentContext } from './components/OfferSelectionModal';
import { CinetPayPaymentModal, PaymentSuccessResult } from './components/CinetPayPaymentModal';
import { PaymentConfirmationModal } from './components/PaymentConfirmationModal';
import { SkeletonListingGrid } from './components/SkeletonListingCard';
import { TestimonialsSection } from './components/TestimonialsSection';
import { NewsletterSection } from './components/NewsletterSection';
import { FloatingCompareBar } from './components/FloatingCompareBar';
import { ComparisonModal } from './components/ComparisonModal';

import { Listing } from './types';
import {
  Sparkles,
  TrendingUp,
  Search,
  Building,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Info,
  CreditCard,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    listings,
    filteredListings,
    isLoadingListings,
    selectedListing,
    setSelectedListing,
    isFiltersOpen,
    isMapView,
    resetFilters,
    toast,
    showToast,
    isCompareModalOpen,
    setIsCompareModalOpen,
  } = useApp();


  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);


  // Public standalone page state (via URL ?annonce=ID or ?listing=ID)
  const [publicListing, setPublicListing] = useState<Listing | null>(null);

  // Payment flow state
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [targetListingForPayment, setTargetListingForPayment] = useState<Listing | null>(null);
  const [selectedPaymentContext, setSelectedPaymentContext] = useState<SelectedPaymentContext | null>(null);
  const [paymentSuccessResult, setPaymentSuccessResult] = useState<PaymentSuccessResult | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  // Parse URL query parameter for public standalone listing view
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const annonceId = params.get('annonce') || params.get('listing') || params.get('id');

    if (annonceId && listings.length > 0) {
      const found = listings.find((l) => l.id === annonceId);
      if (found) {
        setPublicListing(found);
      }
    }
  }, [listings]);

  const handleClosePublicView = () => {
    setPublicListing(null);
    // Clean URL query without page reload
    const newUrl = window.location.pathname;
    window.history.pushState({}, '', newUrl);
  };

  const handleOpenOfferModal = (listing?: Listing) => {
    setTargetListingForPayment(listing || null);
    setShowOfferModal(true);
  };

  const handleSelectOffer = (context: SelectedPaymentContext) => {
    setSelectedPaymentContext(context);
    setShowOfferModal(false);
  };

  const handlePaymentSuccess = (result: PaymentSuccessResult) => {
    setSelectedPaymentContext(null);
    setPaymentSuccessResult(result);
    showToast(`Paiement de ${result.amountFCFA} FCFA confirmé via CinetPay !`, 'success');
  };

  // If public listing link is active, show the standalone unauthenticated page
  if (publicListing) {
    return (
      <PublicListingView
        listing={publicListing}
        onGoHome={handleClosePublicView}
        onOpenPaymentModal={() => handleOpenOfferModal(publicListing)}
      />
    );
  }

  // Split featured listings (ex: with verified owners or high views) and recent listings
  const featuredListings = filteredListings.filter((l) => l.ownerVerifie || l.vues > 200).slice(0, 4);
  const recentListings = filteredListings.slice(0, 12);

  return (
    <div className="min-h-screen bg-[#F2F6F0] dark:bg-[#0d1712] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200 pb-20 sm:pb-12">
      {/* Google Maps Quota Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

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
        {/* Banner for CinetPay Mobile Money Offers */}
        <div className="mb-4 bg-gradient-to-r from-[#0F6B3F] to-emerald-800 text-white p-3.5 sm:p-4 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-amber-300 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs sm:text-sm">
                Paiements Mobile Money via CinetPay
              </div>
              <p className="text-[11px] text-emerald-100">
                Booster d'annonce (7j / 30j), abonnements agence/hôtel & acomptes de réservation (Wave, Orange Money, MTN MoMo).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleOpenOfferModal()}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow transition-all shrink-0 active:scale-95"
          >
            Voir les offres Mobile Money
          </button>
        </div>

        {/* 1. Tab Accueil */}
        {activeTab === 'accueil' && (
          <div className="space-y-6">
            <SearchBanner />

            {/* Skeleton Loading State or Real Listings */}
            {isLoadingListings ? (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-[#0F6B3F] border-t-transparent animate-spin" />
                  <h2 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                    Chargement des annonces en Côte d'Ivoire...
                  </h2>
                </div>
                <SkeletonListingGrid count={8} />
              </section>
            ) : isMapView ? (
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

                    {/* Testimonials & Verified Reviews Section */}
                    <TestimonialsSection />

                    {/* Newsletter & Email Alerts Section */}
                    <NewsletterSection />
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
          onOpenOfferModal={handleOpenOfferModal}
        />
      )}

      {isFiltersOpen && <FiltersModal />}

      {isPublishOpen && (
        <PublishModal onClose={() => setIsPublishOpen(false)} />
      )}

      {isAlertsOpen && (
        <AlertsModal onClose={() => setIsAlertsOpen(false)} />
      )}

      {/* CinetPay Payment Modals */}
      {showOfferModal && (
        <OfferSelectionModal
          onClose={() => setShowOfferModal(false)}
          onSelectOffer={handleSelectOffer}
          initialListing={targetListingForPayment}
        />
      )}

      {selectedPaymentContext && (
        <CinetPayPaymentModal
          paymentContext={selectedPaymentContext}
          onBack={() => {
            setSelectedPaymentContext(null);
            setShowOfferModal(true);
          }}
          onClose={() => setSelectedPaymentContext(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {paymentSuccessResult && (
        <PaymentConfirmationModal
          result={paymentSuccessResult}
          onClose={() => setPaymentSuccessResult(null)}
        />
      )}

      <AuthModal />
      <RoleSelectModal />

      {/* Comparison Components */}
      <FloatingCompareBar />
      {isCompareModalOpen && (
        <ComparisonModal
          onClose={() => setIsCompareModalOpen(false)}
          onSelectListing={(l) => setSelectedListing(l)}
        />
      )}
    </div>
  );
};

export default function App() {
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyByBkvaOc5j5x8cAyYPbv-raS3PGgn3Iqk';

  return (
    <APIProvider apiKey={mapsApiKey} libraries={['routes', 'places', 'geometry']}>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </APIProvider>
  );
}

