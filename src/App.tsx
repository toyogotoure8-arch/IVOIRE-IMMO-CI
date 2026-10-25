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
import { OwnerDashboard } from './components/OwnerDashboard';
import { BookingsView } from './components/BookingsView';
import { MessagesView } from './components/MessagesView';
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
import { PortalGatewaySection } from './components/PortalGatewaySection';
import { FaqImmobilierSection } from './components/FaqImmobilierSection';
import { SingleAccountOnboardingModal } from './components/SingleAccountOnboardingModal';
import { SpaceSwitchModal } from './components/SpaceSwitchModal';
import { ChercheurHomeView } from './components/ChercheurHomeView';

import { Listing, AppSpace } from './types';
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
    currentUser,
    switchActiveSpace,
  } = useApp();

  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [onboardingTargetSpace, setOnboardingTargetSpace] = useState<AppSpace | null>(null);
  const [isSpaceSwitchOpen, setIsSpaceSwitchOpen] = useState(false);

  const feedRef = React.useRef<HTMLDivElement>(null);

  const handleScrollToFeed = () => {
    feedRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
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

  const handleDoorSelect = (space: AppSpace) => {
    if (currentUser && currentUser.roles && currentUser.roles.includes(space)) {
      switchActiveSpace(space);
    } else {
      setOnboardingTargetSpace(space);
    }
  };

  // Profile completeness check (must have at least 1 role created)
  const hasCompletedProfile = Boolean(currentUser && currentUser.roles && currentUser.roles.length > 0);

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
        onOpenSpaceSwitcher={() => setIsSpaceSwitchOpen(true)}
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

        {/* Main Content View Logic */}
        {!hasCompletedProfile ? (
          /* UNAUTHENTICATED VISITOR OR INCOMPLETE PROFILE -> Show Gateway Doors */
          <div className="space-y-6 sm:space-y-8">
            <PortalGatewaySection
              onSelectDoor={handleDoorSelect}
              onOpenSpaceSwitcher={() => setIsSpaceSwitchOpen(true)}
              onOpenPublish={() => setIsPublishOpen(true)}
            />

            {/* Public FAQ Section for visitors */}
            <section className="pt-4">
              <FaqImmobilierSection />
            </section>
          </div>
        ) : (
          /* LOGGED IN USER WITH COMPLETED PROFILE -> Direct Space Views */
          <>
            {/* 1. ESPACE PROPRIÉTAIRE */}
            {currentUser?.espaceActif === 'proprietaire' && (
              <>
                {(activeTab === 'accueil' || activeTab === 'mes_annonces') && (
                  <OwnerDashboard onOpenPublish={() => setIsPublishOpen(true)} />
                )}

                {activeTab === 'demandes_recues' && (
                  <div className="space-y-6">
                    <BookingsView />
                    <MessagesView />
                  </div>
                )}
              </>
            )}

            {/* 2. ESPACE CHERCHEUR */}
            {currentUser?.espaceActif === 'chercheur' && (
              <>
                {activeTab === 'accueil' && <ChercheurHomeView />}

                {activeTab === 'favoris' && <FavoritesView />}

                {activeTab === 'demandes' && (
                  <div className="space-y-6">
                    <BookingsView />
                    <MessagesView />
                  </div>
                )}
              </>
            )}

            {/* Common Mon Espace Tab */}
            {activeTab === 'mon_espace' && (
              <UserSpaceView
                onOpenPublish={() => setIsPublishOpen(true)}
                onOpenAlerts={() => setIsAlertsOpen(true)}
                onOpenSpaceSwitcher={() => setIsSpaceSwitchOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Navigation (Only visible for logged in users with complete profile) */}
      {hasCompletedProfile && (
        <BottomNav onOpenPublish={() => setIsPublishOpen(true)} />
      )}

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

      {/* Single Account Onboarding & Space Switch Modals */}
      {onboardingTargetSpace && (
        <SingleAccountOnboardingModal
          targetSpace={onboardingTargetSpace}
          onClose={() => setOnboardingTargetSpace(null)}
        />
      )}

      {isSpaceSwitchOpen && (
        <SpaceSwitchModal
          onClose={() => setIsSpaceSwitchOpen(false)}
          onOpenOnboardingForRole={(space) => setOnboardingTargetSpace(space)}
        />
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

