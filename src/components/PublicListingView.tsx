import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Building,
  Calendar,
  AlertOctagon,
  CreditCard,
  CheckCircle2,
  Droplets,
  Zap,
  Wind,
  Wifi,
  Eye,
  Flag,
  FileDown,
} from 'lucide-react';
import { Listing, ReportReason } from '../types';
import { formatFCFA } from '../utils/calculations';
import { ShareButton } from './ShareButton';
import { RentalFeesCalculator } from './RentalFeesCalculator';
import { useApp } from '../context/AppContext';

interface Props {
  listing: Listing;
  onGoHome: () => void;
  onOpenPaymentModal?: () => void;
}

export const PublicListingView: React.FC<Props> = ({ listing, onGoHome, onOpenPaymentModal }) => {
  const { submitReport, showToast } = useApp();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMotif, setReportMotif] = useState<ReportReason>('arnaque');
  const [reportDesc, setReportDesc] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const priceSuffix =
    listing.categorie === 'location'
      ? '/mois'
      : listing.categorie === 'meuble' || listing.categorie === 'hotel'
      ? '/nuit'
      : '';

  const handleDownloadPDF = () => {
    window.print();
    showToast('Fiche informative prête : sélectionnez "Enregistrer au format PDF" dans la boîte de dialogue d\'impression.', 'success');
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReport(true);
    try {
      await submitReport(listing.id, listing.titre, listing.ownerId, reportMotif, reportDesc);
      showToast('Signalement transmis à l\'équipe d\'administration Ivoire Logement.', 'success');
      setShowReportModal(false);
      setReportDesc('');
    } catch (err) {
      showToast('Erreur lors du signalement.', 'error');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F6F0] dark:bg-[#0d1712] text-gray-900 dark:text-gray-100 flex flex-col font-sans pb-16">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#16261c]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0F6B3F] dark:text-[#34D399] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Toutes les annonces</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
              Fiche Publique
            </span>
            <ShareButton listing={listing} variant="compact" />
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {/* Photo Gallery Header */}
        <div className="bg-white dark:bg-[#16261c] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm space-y-2 p-3">
          <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={listing.photos[activePhotoIndex] || listing.photos[0]}
              alt={listing.titre}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {listing.ownerVerifie && (
              <div className="absolute top-3 left-3 bg-[#0F6B3F] text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Propriétaire Vérifié</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {listing.photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 pt-1">
              {listing.photos.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activePhotoIndex === idx
                      ? 'border-[#0F6B3F] scale-105 shadow'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Details Box */}
        <div className="bg-white dark:bg-[#16261c] rounded-3xl p-5 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F28C1B]">
                {listing.categorie} • {listing.type}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-0.5">
                {listing.titre}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 mt-1">
                <MapPin className="w-4 h-4 text-[#F28C1B] shrink-0" />
                <span className="font-bold text-gray-900 dark:text-gray-100">{listing.commune}</span>
                <span>•</span>
                <span>{listing.quartier}</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-2xl sm:text-3xl font-black text-[#0F6B3F] dark:text-[#34D399]">
                {formatFCFA(listing.prix)}
                {priceSuffix && <span className="text-xs font-semibold text-gray-500 ml-1">{priceSuffix}</span>}
              </div>
              <div className="text-[11px] text-gray-400 flex items-center sm:justify-end gap-1 mt-0.5">
                <Eye className="w-3.5 h-3.5" />
                <span>{listing.vues || 0} vues sur cette annonce</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Description du bien</h3>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Equipment Pills */}
          {listing.equipements.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Équipements & Commodités</h3>
              <div className="flex flex-wrap gap-2">
                {listing.equipements.map((eq, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-800 dark:text-gray-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F6B3F]" />
                    <span className="capitalize">{eq}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Installation Fees Calculator for Rental */}
          {listing.categorie === 'location' && (
            <div className="pt-3">
              <RentalFeesCalculator initialRent={listing.prix} />
            </div>
          )}

          {/* Hotel Deposit Button if Hotel/Meublé */}
          {(listing.categorie === 'hotel' || listing.categorie === 'meuble') && onOpenPaymentModal && (
            <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-2xl border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs text-purple-900 dark:text-purple-200">
                  Réservation sécurisée en ligne
                </div>
                <div className="text-[11px] text-purple-700 dark:text-purple-300">
                  Bloquez vos dates immédiatement en payant un acompte via Wave ou Mobile Money.
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenPaymentModal}
                className="shrink-0 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                <span>Payer Acompte Mobile Money</span>
              </button>
            </div>
          )}

          {/* Scam Prevention Notice */}
          <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-2 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2 font-extrabold text-amber-900 dark:text-amber-300">
              <AlertOctagon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Conseils Anti-Arnaque Ivoire Logement</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] font-medium">
              <li><strong>Ne jamais payer</strong> d'avance avant la visite effective du logement.</li>
              <li>Exigez de vérifier le <strong>titre foncier</strong> ou l'<strong>ACD</strong> pour tout achat immobilier.</li>
              <li>Exigez un <strong>reçu écrit et signé</strong> avec pièce d'identité pour tout paiement d'acompte.</li>
            </ul>
          </div>

          {/* Share & Report Section */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-auto flex items-center gap-2 flex-wrap">
              <ShareButton listing={listing} variant="full" />
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-[#0F6B3F] dark:text-[#34D399] border border-emerald-600/30 rounded-xl text-xs font-bold shadow-2xs hover:bg-emerald-100 transition-all"
                title="Sauvegarder les informations essentielles au format PDF"
              >
                <FileDown className="w-4 h-4" />
                <span>Télécharger en PDF</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 px-3 py-2 rounded-xl transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Signaler cette annonce</span>
            </button>
          </div>
        </div>

        {/* Direct Contact Bar */}
        <div className="bg-white dark:bg-[#16261c] rounded-3xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-gray-500">Proposé par le propriétaire :</div>
            <div className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <span>{listing.ownerNom}</span>
              {listing.ownerVerifie && (
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <a
              href={`tel:${listing.ownerTelephone}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold rounded-2xl shadow transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Appeler ({listing.ownerTelephone})</span>
            </a>

            <a
              href={`https://wa.me/225${listing.ownerTelephone.replace(/\s+/g, '')}?text=${encodeURIComponent(`Bonjour, je vous contacte au sujet de votre annonce : ${listing.titre}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-bold rounded-2xl shadow transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </main>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16261c] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-600" />
                <span>Signaler cette annonce</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Motif du signalement
                </label>
                <select
                  value={reportMotif}
                  onChange={(e) => setReportMotif(e.target.value as ReportReason)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold"
                >
                  <option value="arnaque">🚨 Arnaque / Demande de paiement suspect</option>
                  <option value="bien déjà loué">🔑 Bien déjà loué ou vendu</option>
                  <option value="prix faux">💵 Prix mensonger</option>
                  <option value="photos volées">📸 Photos volées / Non conformes</option>
                  <option value="autre">❓ Autre motif</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Explications complémentaires
                </label>
                <textarea
                  rows={3}
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Précisez le problème rencontré..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  {isSubmittingReport ? 'Envoi...' : 'Transmettre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
