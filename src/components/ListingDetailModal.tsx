import React, { useState } from 'react';
import { Listing } from '../types';
import { formatFCFA, getWhatsAppLink, formatIvorianPhone, calculateBookingCost } from '../utils/calculations';
import { useApp } from '../context/AppContext';
import { RentalFeesCalculator } from './RentalFeesCalculator';
import { ShareButton } from './ShareButton';
import { GoogleDistanceCalculator } from './GoogleDistanceCalculator';
import { COORDONNEES_LOCALITES } from '../constants/ciData';
import {
  X,
  Heart,
  MapPin,
  ShieldCheck,
  Phone,
  MessageCircle,
  Flag,
  Share2,
  Calendar,
  CheckCircle2,
  Droplets,
  Zap,
  Wind,
  Wifi,
  Car,
  Fence,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  Receipt,
  CreditCard,
  FileDown,
} from 'lucide-react';

interface Props {
  listing: Listing;
  onClose: () => void;
  onOpenOfferModal?: (listing?: Listing) => void;
}

export const ListingDetailModal: React.FC<Props> = ({ listing, onClose, onOpenOfferModal }) => {
  const {
    favorites,
    toggleFavorite,
    incrementListingMetric,
    currentUser,
    createBooking,
    submitReport,
    setShowAuthModal,
    showToast,
  } = useApp();

  const isFavorite = favorites.includes(listing.id);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Booking state for meublé and hotels
  const isStay = listing.categorie === 'meuble' || listing.categorie === 'hotel';
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [bookingNote, setBookingNote] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Report modal state
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState<string>('arnaque');
  const [reportDescription, setReportDescription] = useState<string>('');

  const bookingCost = calculateBookingCost(listing.prix, checkIn, checkOut);

  const priceLabel =
    listing.categorie === 'location'
      ? '/mois'
      : isStay
      ? '/nuit'
      : '';

  const handleWhatsAppClick = () => {
    incrementListingMetric(listing.id, 'contacts');
    const waUrl = getWhatsAppLink(listing.ownerTelephone, listing.titre, formatFCFA(listing.prix) + (priceLabel || ''));
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCallClick = () => {
    incrementListingMetric(listing.id, 'contacts');
    window.location.href = `tel:${listing.ownerTelephone.replace(/[^0-9+]/g, '')}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.titre,
          text: `Découvrez cette annonce sur IvoireImmo : ${listing.titre} à ${listing.commune} (${formatFCFA(listing.prix)})`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Lien de l\'annonce copié dans le presse-papiers !', 'info');
    }
  };

  const handleDownloadPDF = () => {
    window.print();
    showToast('Fiche informative prête : sélectionnez "Enregistrer au format PDF" dans la boîte de dialogue d\'impression.', 'success');
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Veuillez vous connecter pour faire une demande de réservation', 'info');
      setShowAuthModal(true);
      return;
    }

    if (!bookingCost.valid) {
      showToast(bookingCost.error || 'Dates invalides', 'error');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      await createBooking({
        listingId: listing.id,
        listingTitre: listing.titre,
        listingPhoto: listing.photos[0],
        listingCommune: listing.commune,
        clientId: currentUser.id,
        clientNom: currentUser.nom,
        clientTelephone: currentUser.telephone,
        ownerId: listing.ownerId,
        dateArrivee: checkIn,
        dateDepart: checkOut,
        nuits: bookingCost.nights,
        montantTotal: bookingCost.total,
        notes: bookingNote,
      });
      onClose();
    } catch (err) {
      showToast('Erreur lors de la réservation', 'error');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) {
      showToast('Veuillez préciser le motif du signalement', 'error');
      return;
    }
    await submitReport(listing.id, listing.titre, listing.ownerId, reportReason, reportDescription);
    setShowReportDialog(false);
    setReportReason('arnaque');
    setReportDescription('');
  };

  const equipementIcons: Record<string, { label: string; icon: any }> = {
    eau: { label: 'Eau SODECI', icon: Droplets },
    electricite: { label: 'Électricité CIE', icon: Zap },
    climatisation: { label: 'Climatisation', icon: Wind },
    wifi: { label: 'Wi-Fi / Fibre', icon: Wifi },
    gardien: { label: 'Gardien 24h/7', icon: ShieldCheck },
    parking: { label: 'Parking sécurisé', icon: Car },
    cloture: { label: 'Cour clôturée', icon: Fence },
    route_bitumee: { label: 'Route bitumée', icon: Navigation },
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#132219] w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-[#132219]/95 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-[#0F6B3F]/10 text-[#0F6B3F] dark:text-[#34D399]">
              {listing.categorie}
            </span>
            {listing.isExemple && (
              <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                Annonce d'exemple
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <ShareButton listing={listing} variant="icon" />
            <button
              type="button"
              onClick={() => toggleFavorite(listing.id)}
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la vue détaillée"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* Gallery View */}
          <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-gray-900 group">
            <img
              src={listing.photos[activePhotoIdx] || listing.photos[0]}
              alt={listing.titre}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80';
              }}
              className="w-full h-full object-cover"
            />

            {listing.photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : listing.photos.length - 1))
                  }
                  aria-label="Photo précédente"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all opacity-80 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIdx((prev) => (prev < listing.photos.length - 1 ? prev + 1 : 0))
                  }
                  aria-label="Photo suivante"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all opacity-80 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold">
                  {activePhotoIdx + 1} / {listing.photos.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {listing.photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {listing.photos.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activePhotoIdx === idx ? 'border-[#0F6B3F] scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title & Price Header */}
          <div>
            <div className="flex items-baseline justify-between gap-4 mb-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F6B3F] dark:text-[#34D399]">
                {formatFCFA(listing.prix)}
                {priceLabel && <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">{priceLabel}</span>}
              </div>
              {listing.pieces > 0 && (
                <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full">
                  {listing.pieces} {listing.pieces > 1 ? 'pièces' : 'pièce'} • {listing.type}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-snug">
              {listing.titre}
            </h1>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-2">
              <MapPin className="w-4 h-4 text-[#F28C1B] shrink-0" />
              <span className="font-semibold text-gray-900 dark:text-white">{listing.commune}</span>
              <span>—</span>
              <span>{listing.quartier}</span>
            </div>
          </div>

          {/* Verified Owner Card */}
          <div className="bg-gray-50 dark:bg-[#1a2d22] rounded-2xl p-4 flex items-center justify-between border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#0F6B3F]/15 flex items-center justify-center font-bold text-[#0F6B3F] text-lg">
                {listing.ownerNom.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white text-sm">
                  {listing.ownerNom}
                  {listing.ownerVerifie && (
                    <span title="Propriétaire vérifié par l'administration IvoireImmo">
                      <ShieldCheck className="w-4 h-4 text-[#0F6B3F] fill-[#0F6B3F]/20" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatIvorianPhone(listing.ownerTelephone)}
                </p>
              </div>
            </div>

            {listing.ownerVerifie ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0F6B3F] dark:text-[#34D399] bg-[#0F6B3F]/10 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Vérifié
              </span>
            ) : (
              <span className="text-xs text-gray-400">
                Non vérifié
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">
              Description du bien
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Equipments Grid */}
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3">
              Équipements & Commodités
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {listing.equipements.map((eq) => {
                const conf = equipementIcons[eq];
                const IconComponent = conf ? conf.icon : Sparkles;
                return (
                  <div
                    key={eq}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-[#1a2d22] border border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-800 dark:text-gray-200"
                  >
                    <IconComponent className="w-4 h-4 text-[#0F6B3F]" />
                    <span>{conf ? conf.label : eq}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location Lease Fees Calculator (Only for Location category) */}
          {listing.categorie === 'location' && (
            <RentalFeesCalculator initialRent={listing.prix} />
          )}

          {/* Google Maps Distance & Estimated Travel Time Calculator */}
          <GoogleDistanceCalculator
            destination={listing.position || COORDONNEES_LOCALITES[listing.commune] || { lat: 5.34, lng: -3.99 }}
            destinationLabel={listing.titre}
            commune={listing.commune}
            quartier={listing.quartier}
          />


          {/* Reservation Request Box (For Meublé & Hôtels) */}
          {isStay && (
            <div className="bg-[#F2F6F0] dark:bg-[#132219] rounded-2xl p-5 border border-[#0F6B3F]/20">
              <div className="flex items-center gap-2 text-[#0F6B3F] dark:text-[#34D399] font-bold text-base mb-3">
                <Calendar className="w-5 h-5" />
                <span>Demande de réservation de séjour</span>
              </div>

              {listing.datesOccupees && listing.datesOccupees.length > 0 && (
                <div className="mb-3 text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50">
                  <span className="font-bold">Dates déjà occupées : </span>
                  {listing.datesOccupees.join(', ')}
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Date d'arrivée
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Date de départ
                    </label>
                    <input
                      type="date"
                      min={checkIn || today}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Message ou remarque (optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Arrivée prévue vers 15h, 2 adultes"
                    value={bookingNote}
                    onChange={(e) => setBookingNote(e.target.value)}
                    className="w-full bg-white dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>

                {bookingCost.valid && (
                  <div className="bg-white/80 dark:bg-black/20 p-3 rounded-xl flex justify-between items-center text-sm border border-[#0F6B3F]/10">
                    <div>
                      <span className="font-semibold">{bookingCost.nights} nuit{bookingCost.nights > 1 ? 's' : ''}</span>
                      <span className="text-gray-500 text-xs ml-1">× {formatFCFA(listing.prix)}</span>
                    </div>
                    <div className="font-extrabold text-[#0F6B3F] dark:text-[#34D399] text-base">
                      Total : {formatFCFA(bookingCost.total)}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingBooking || !bookingCost.valid}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#F28C1B] hover:bg-[#D9770E] active:scale-[0.98] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isSubmittingBooking ? 'Envoi en cours...' : 'Demander la réservation'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Conseils Anti-Arnaque Box */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-sm sm:text-base">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Conseils anti-arnaque</span>
            </div>
            <div className="space-y-2 text-xs text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="font-bold">Ne jamais payer avant la visite :</strong> Ne transférez aucun acompte ou frais de dossier avant d'avoir visité physiquement le bien avec le propriétaire.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="font-bold">Vérifier le titre foncier ou l'ACD pour un achat :</strong> Exigez les documents officiels (ACD / Titre Foncier) auprès d'un notaire certifié avant tout versement.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Receipt className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="font-bold">Demander un reçu pour tout paiement :</strong> Exigez systématiquement une quittance officielle ou un reçu écrit, signé et daté pour tout loyer ou caution.
                </span>
              </div>
            </div>
          </div>

          {/* CinetPay Boost & Share section */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
            {onOpenOfferModal && (
              <button
                type="button"
                onClick={() => onOpenOfferModal(listing)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Mettre en avant cette annonce ou s'abonner (Mobile Money CinetPay)</span>
              </button>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShareButton listing={listing} variant="compact" />
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-[#0F6B3F] dark:text-[#34D399] border border-emerald-600/30 rounded-xl text-xs font-bold shadow-2xs hover:bg-emerald-100 transition-all"
                  title="Sauvegarder les informations essentielles au format PDF"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Télécharger en PDF</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowReportDialog(true)}
                className="text-xs text-gray-500 hover:text-red-500 dark:text-gray-400 flex items-center gap-1.5 transition-colors font-medium"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Signaler cette annonce</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA Actions Sticky Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#132219] border-t border-gray-100 dark:border-gray-800 flex gap-2.5 sticky bottom-0 z-20">
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm shadow flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Contacter sur WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleCallClick}
            className="py-3 px-4 rounded-xl bg-[#0F6B3F] hover:bg-[#0B5431] active:scale-[0.98] text-white font-bold text-sm shadow flex items-center justify-center gap-2 transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Appeler</span>
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReportDialog && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16261c] max-w-md w-full rounded-2xl p-5 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2 text-red-600">
                <Flag className="w-4 h-4" />
                Signaler cette annonce
              </h4>
              <button
                type="button"
                onClick={() => setShowReportDialog(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300">
              Aidez-nous à préserver la sécurité sur IvoireImmo en signalant tout contenu suspect.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Motif du signalement *
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                  className="w-full text-sm bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6B3F]"
                >
                  <option value="arnaque">arnaque (Annonce frauduleuse / tentative d'escroquerie)</option>
                  <option value="bien déjà loué">bien déjà loué (Le bien est déjà loué ou vendu)</option>
                  <option value="prix faux">prix faux (Le prix indiqué est faux ou trompeur)</option>
                  <option value="photos volées">photos volées (Les photos ne sont pas authentiques)</option>
                  <option value="autre">autre (Autre motif à préciser)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Explications complémentaires (optionnel)
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Expliquez brièvement les faits constatés..."
                  rows={3}
                  className="w-full text-sm bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6B3F]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportDialog(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow"
                >
                  Envoyer le signalement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
