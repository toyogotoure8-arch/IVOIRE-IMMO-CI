import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatFCFA, formatIvorianPhone } from '../utils/calculations';
import { compressImageFile } from '../utils/imageCompressor';
import {
  Eye,
  PhoneCall,
  CalendarCheck,
  PlusCircle,
  ShieldCheck,
  Clock,
  Trash2,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  XCircle,
  Upload,
  Calendar,
  AlertCircle,
  Building,
} from 'lucide-react';

interface Props {
  onOpenPublish: () => void;
}

export const OwnerDashboard: React.FC<Props> = ({ onOpenPublish }) => {
  const {
    currentUser,
    listings,
    bookings,
    updateListing,
    deleteListing,
    updateBookingStatus,
    updateUserVerification,
    contestSuspension,
    showToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'annonces' | 'reservations' | 'calendrier' | 'identite'>('annonces');
  const [contestationTexts, setContestationTexts] = useState<Record<string, string>>({});
  const [isSubmittingContest, setIsSubmittingContest] = useState<Record<string, boolean>>({});

  // Filter listings owned by this user
  const myListings = listings.filter((l) => currentUser && l.ownerId === currentUser.id);

  // Total KPIs
  const totalVues = myListings.reduce((sum, l) => sum + (l.vues || 0), 0);
  const totalContacts = myListings.reduce((sum, l) => sum + (l.contacts || 0), 0);
  const totalDemandes = myListings.reduce((sum, l) => sum + (l.demandes || 0), 0);

  // Bookings received for this owner's listings
  const receivedBookings = bookings.filter((b) => currentUser && b.ownerId === currentUser.id);

  // ID verification upload state
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [idType, setIdType] = useState('CNI Ivoirienne (Carte Nationale d\'Identité)');
  const [isUploadingId, setIsUploadingId] = useState(false);

  // Calendar dates management for hotels/meublés
  const [selectedListingForCalendar, setSelectedListingForCalendar] = useState<string>(myListings[0]?.id || '');
  const [newOccupiedDate, setNewOccupiedDate] = useState('');

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingId(true);
      const res = await compressImageFile(file, 1280, 0.85);
      setIdPhoto(res.dataUrl);
      await updateUserVerification(res.dataUrl, idType);
    } catch (err) {
      showToast('Erreur lors du traitement de la photo', 'error');
    } finally {
      setIsUploadingId(false);
    }
  };

  const handleToggleListingStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'publiee' ? 'masquee' : 'publiee';
    await updateListing(id, { statut: newStatus });
  };

  const handleAddOccupiedDate = async () => {
    if (!selectedListingForCalendar || !newOccupiedDate) return;
    const target = listings.find((l) => l.id === selectedListingForCalendar);
    if (!target) return;

    const existingDates = target.datesOccupees || [];
    if (existingDates.includes(newOccupiedDate)) {
      showToast('Cette date est déjà marquée comme occupée', 'info');
      return;
    }

    const updatedDates = [...existingDates, newOccupiedDate].sort();
    await updateListing(selectedListingForCalendar, { datesOccupees: updatedDates });
    setNewOccupiedDate('');
    showToast('Date ajoutée au calendrier d\'indisponibilité', 'success');
  };

  const handleRemoveOccupiedDate = async (dateToRemove: string) => {
    if (!selectedListingForCalendar) return;
    const target = listings.find((l) => l.id === selectedListingForCalendar);
    if (!target) return;

    const updatedDates = (target.datesOccupees || []).filter((d) => d !== dateToRemove);
    await updateListing(selectedListingForCalendar, { datesOccupees: updatedDates });
    showToast('Date retirée', 'info');
  };

  const handleContest = async (listingId: string) => {
    const text = contestationTexts[listingId];
    if (!text || text.trim().length < 10) {
      showToast('Veuillez expliquer votre contestation en au moins 10 caractères', 'error');
      return;
    }

    setIsSubmittingContest(prev => ({ ...prev, [listingId]: true }));
    try {
      await contestSuspension(listingId, text.trim());
      showToast('Votre contestation a été envoyée pour examen.', 'success');
    } catch (err) {
      showToast('Erreur lors de l\'envoi de la contestation', 'error');
    } finally {
      setIsSubmittingContest(prev => ({ ...prev, [listingId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & KPI Cards */}
      <div className="bg-white dark:bg-[#16261c] rounded-3xl p-5 sm:p-6 border border-gray-200/80 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                Espace Propriétaire & Hôtelier
              </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentUser?.phoneVerified ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                  <ShieldCheck className="w-3 h-3" />
                  Téléphone vérifié
                </span>
              ) : (
                <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800 px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                  Téléphone non vérifié
                </span>
              )}
              {currentUser?.emailVerified ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/50">
                  <ShieldCheck className="w-3 h-3" />
                  Email vérifié
                </span>
              ) : (
                <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800 px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                  Email non vérifié
                </span>
              )}
            </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Gérez vos biens immobiliers, chambres d'hôtel et réservations en temps réel.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenPublish}
            className="w-full sm:w-auto py-2.5 px-4 bg-[#0F6B3F] hover:bg-[#0B5431] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publier un bien</span>
          </button>
        </div>

        {/* 3 KPI Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#F2F6F0] dark:bg-[#1a2d22] p-3.5 rounded-2xl border border-[#0F6B3F]/10 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-2">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-lg sm:text-2xl font-extrabold text-gray-900 dark:text-white">
              {totalVues}
            </span>
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
              Vues totales
            </span>
          </div>

          <div className="bg-[#F2F6F0] dark:bg-[#1a2d22] p-3.5 rounded-2xl border border-[#0F6B3F]/10 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-[#0F6B3F] dark:text-[#34D399] mb-2">
              <PhoneCall className="w-4 h-4" />
            </div>
            <span className="text-lg sm:text-2xl font-extrabold text-gray-900 dark:text-white">
              {totalContacts}
            </span>
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
              Prises de contact
            </span>
          </div>

          <div className="bg-[#F2F6F0] dark:bg-[#1a2d22] p-3.5 rounded-2xl border border-[#0F6B3F]/10 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-[#F28C1B] mb-2">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <span className="text-lg sm:text-2xl font-extrabold text-gray-900 dark:text-white">
              {totalDemandes}
            </span>
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
              Demandes reçues
            </span>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'annonces', label: `Mes annonces (${myListings.length})` },
          { id: 'reservations', label: `Réservations (${receivedBookings.length})` },
          { id: 'calendrier', label: 'Dates occupées' },
          { id: 'identite', label: 'Badge Vérifié' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all shrink-0 ${
              activeSubTab === tab.id
                ? 'bg-[#0F6B3F] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Mes Annonces */}
      {activeSubTab === 'annonces' && (
        <div className="space-y-3">
          {myListings.length === 0 ? (
            <div className="bg-white dark:bg-[#16261c] rounded-3xl p-8 text-center border border-dashed border-gray-300 dark:border-gray-800">
              <Building className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <h4 className="font-bold text-base text-gray-900 dark:text-white">
                Aucune annonce publiée pour le moment
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                Publiez votre premier appartement, studio, villa, terrain ou chambre d'hôtel en Côte d'Ivoire.
              </p>
              <button
                type="button"
                onClick={onOpenPublish}
                className="px-4 py-2.5 bg-[#0F6B3F] text-white rounded-xl text-xs font-bold"
              >
                Publier une annonce
              </button>
            </div>
          ) : (
            myListings.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#16261c] rounded-2xl p-4 border border-gray-200/80 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <img
                    src={item.photos[0]}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {item.categorie}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.statut === 'publiee'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : item.statut === 'en_attente'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : item.statut === 'suspendue'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800'
                        }`}
                      >
                        {item.statut === 'publiee'
                          ? 'En ligne'
                          : item.statut === 'en_attente'
                          ? 'Vérification automatique'
                          : item.statut === 'suspendue'
                          ? 'Suspendue (trop de signalements)'
                          : item.statut === 'rejetee'
                          ? 'Rejetée'
                          : 'Masquée'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {item.titre}
                    </h4>

                    {item.statut === 'suspendue' && (
                      <div className="mt-2 space-y-2">
                        <p className="text-[10px] text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-100 dark:border-red-900/50">
                          Cette annonce a été suspendue automatiquement suite à plusieurs signalements d'utilisateurs.
                        </p>
                        {item.contestation ? (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3" />
                            Contestation envoyée : "{item.contestation}"
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Expliquez pourquoi c'est une erreur..."
                              value={contestationTexts[item.id] || ''}
                              onChange={(e) => setContestationTexts(prev => ({ ...prev, [item.id]: e.target.value }))}
                              className="flex-1 text-[10px] bg-white dark:bg-[#1a2d22] border border-red-200 dark:border-red-900/50 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-red-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleContest(item.id)}
                              disabled={isSubmittingContest[item.id]}
                              className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              Contester
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      {item.commune} • {formatFCFA(item.prix)}
                    </p>
                  </div>
                </div>

                {/* Metrics & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span title="Vues" className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {item.vues}
                    </span>
                    <span title="Contacts WhatsApp/Appels" className="flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-[#0F6B3F]" /> {item.contacts}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleListingStatus(item.id, item.statut)}
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold flex items-center gap-1"
                      title={item.statut === 'publiee' ? 'Masquer l\'annonce' : 'Activer l\'annonce'}
                    >
                      {item.statut === 'publiee' ? (
                        <ToggleRight className="w-5 h-5 text-[#0F6B3F]" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteListing(item.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      title="Supprimer l'annonce"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. Demandes de Réservation */}
      {activeSubTab === 'reservations' && (
        <div className="space-y-3">
          {receivedBookings.length === 0 ? (
            <div className="bg-white dark:bg-[#16261c] rounded-3xl p-8 text-center border border-dashed border-gray-300 dark:border-gray-800">
              <CalendarCheck className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <h4 className="font-bold text-base text-gray-900 dark:text-white">
                Aucune demande de réservation pour l'instant
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                Les demandes des voyageurs pour vos résidences meublées et chambres d'hôtels s'afficheront ici.
              </p>
            </div>
          ) : (
            receivedBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-[#16261c] rounded-2xl p-4 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        b.statut === 'acceptee'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.statut === 'refusee'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.statut === 'demandee' ? 'En attente' : b.statut}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1">
                      {b.listingTitre}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Client : <strong className="text-gray-800 dark:text-gray-200">{b.clientNom}</strong> ({formatIvorianPhone(b.clientTelephone)})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-[#0F6B3F] dark:text-[#34D399]">
                      {formatFCFA(b.montantTotal)}
                    </span>
                    <div className="text-[11px] text-gray-500">{b.nuits} nuits</div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-[#1a2d22] p-2.5 rounded-xl text-xs text-gray-600 dark:text-gray-300 flex items-center justify-between">
                  <span>Arrivée : <strong>{b.dateArrivee}</strong></span>
                  <span>Départ : <strong>{b.dateDepart}</strong></span>
                </div>

                {b.notes && (
                  <p className="text-xs italic text-gray-500 bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-lg">
                    "{b.notes}"
                  </p>
                )}

                {b.statut === 'demandee' && (
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => updateBookingStatus(b.id, 'acceptee')}
                      className="flex-1 py-2 px-3 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accepter la réservation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateBookingStatus(b.id, 'refusee')}
                      className="py-2 px-3 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Refuser</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. Calendrier des dates occupées */}
      {activeSubTab === 'calendrier' && (
        <div className="bg-white dark:bg-[#16261c] rounded-3xl p-5 sm:p-6 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-base text-gray-900 dark:text-white">
              Gestion des dates occupées (Hôtels & Meublés)
            </h4>
            <p className="text-xs text-gray-500">
              Bloquez les dates d'indisponibilité pour éviter les doubles réservations.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Sélectionnez le logement
            </label>
            <select
              value={selectedListingForCalendar}
              onChange={(e) => setSelectedListingForCalendar(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white font-medium"
            >
              {myListings
                .filter((l) => l.categorie === 'meuble' || l.categorie === 'hotel')
                .map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.titre} ({l.commune})
                  </option>
                ))}
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="date"
              value={newOccupiedDate}
              onChange={(e) => setNewOccupiedDate(e.target.value)}
              className="flex-1 bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddOccupiedDate}
              className="px-4 py-2 bg-[#0F6B3F] hover:bg-[#0B5431] text-white rounded-xl text-xs font-bold"
            >
              Ajouter date
            </button>
          </div>

          {/* Occupied dates list */}
          {(() => {
            const currentSelected = listings.find((l) => l.id === selectedListingForCalendar);
            const occupied = currentSelected?.datesOccupees || [];
            return (
              <div className="pt-2">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">
                  Dates bloquées ({occupied.length})
                </span>
                {occupied.length === 0 ? (
                  <p className="text-xs text-gray-400">Aucune date bloquée pour ce bien.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {occupied.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs font-semibold"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {d}
                        <button
                          type="button"
                          onClick={() => handleRemoveOccupiedDate(d)}
                          className="hover:text-red-900 ml-1 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* 4. Vérification d'identité (Badge Vérifié) */}
      {activeSubTab === 'identite' && (
        <div className="bg-white dark:bg-[#16261c] rounded-3xl p-5 sm:p-6 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0F6B3F]/10 text-[#0F6B3F]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white">
                Obtenir le badge « Propriétaire Vérifié »
              </h4>
              <p className="text-xs text-gray-500">
                Gagnez la confiance des locataires et acheteurs en certifiant votre identité.
              </p>
            </div>
          </div>

          {currentUser?.verifie ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#0F6B3F]" />
              <div>
                <strong className="block font-bold">Votre compte est officiellement vérifié</strong>
                Le badge vert apparaît désormais sur l'ensemble de vos annonces.
              </div>
            </div>
          ) : currentUser?.pieceIdentiteStatut === 'en_attente' ? (
            <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600 animate-spin" />
              <div>
                <strong className="block font-bold">Document en cours de vérification</strong>
                Votre pièce d'identité a bien été reçue et est en cours d'examen par notre équipe de modération.
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Type de pièce officielle
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white"
                >
                  <option value="CNI Ivoirienne">CNI Ivoirienne (Carte Nationale d'Identité)</option>
                  <option value="Passeport">Passeport biométrique</option>
                  <option value="Permis de conduire">Permis de conduire ivoirien</option>
                  <option value="Registre de Commerce (RCCM)">Extrait RCCM (Agence / Entreprise)</option>
                </select>
              </div>

              <label className="border-2 border-dashed border-[#0F6B3F]/30 hover:border-[#0F6B3F] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#F2F6F0]/50 dark:bg-[#1a2d22]/30 transition-colors">
                <Upload className="w-6 h-6 text-[#0F6B3F]" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  Télécharger une photo lisible de votre pièce
                </span>
                <span className="text-[11px] text-gray-400">
                  Format image (JPEG, PNG). Vos documents restent strictement confidentiels.
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIdUpload}
                  disabled={isUploadingId}
                  className="hidden"
                />
              </label>

              {isUploadingId && (
                <p className="text-xs text-center text-[#0F6B3F] font-semibold animate-pulse">
                  Transmission sécurisée du document en cours...
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
