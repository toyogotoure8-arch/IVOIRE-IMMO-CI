import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatFCFA, formatIvorianPhone } from '../utils/calculations';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Users,
  Building2,
  CalendarCheck,
  Flag,
  ShieldCheck,
  Eye,
  Ban,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    listings,
    validateListing,
    verifyOwnerIdentity,
    toggleUserBlock,
    allUsers,
    bookings,
    reports,
    resolveReport,
    setSelectedListing,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'attente' | 'verifications' | 'signalements' | 'utilisateurs' | 'stats'>('attente');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectingListingId, setRejectingListingId] = useState<string | null>(null);

  // Pending listings queue
  const pendingListings = listings.filter((l) => l.statut === 'en_attente');

  // Pending ID verifications
  const pendingVerifications = allUsers.filter((u) => u.pieceIdentiteStatut === 'en_attente');

  // Pending reports
  const pendingReports = reports.filter((r) => r.statut === 'en_attente');

  // Stats
  const totalListings = listings.length;
  const publishedListings = listings.filter((l) => l.statut === 'publiee').length;
  const totalUsers = allUsers.length;
  const totalBookings = bookings.length;

  const handleApprove = async (id: string) => {
    await validateListing(id, true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectingListingId) return;
    await validateListing(rejectingListingId, false, rejectReason || 'Non conforme aux règles IvoireImmo');
    setRejectingListingId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-800/80 text-amber-300">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Console d'Administration IvoireImmo
            </h2>
            <p className="text-xs text-emerald-300">
              Contrôle qualité, modération, attribution des badges certifiés et sécurité.
            </p>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-emerald-800/60">
          <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-800/40">
            <span className="text-xs text-emerald-300 font-medium block">Total Annonces</span>
            <span className="text-xl font-black text-white">{totalListings}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">{publishedListings} en ligne</span>
          </div>

          <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-800/40">
            <span className="text-xs text-emerald-300 font-medium block">Comptes Utilisateurs</span>
            <span className="text-xl font-black text-white">{totalUsers}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Propriétaires & Clients</span>
          </div>

          <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-800/40">
            <span className="text-xs text-emerald-300 font-medium block">Réservations</span>
            <span className="text-xl font-black text-white">{totalBookings}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Hôtels et Meublés</span>
          </div>

          <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-800/40">
            <span className="text-xs text-emerald-300 font-medium block">Signalements</span>
            <span className="text-xl font-black text-amber-300">{pendingReports.length}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">À traiter</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'attente', label: `File d'attente (${pendingListings.length})`, alert: pendingListings.length > 0 },
          { id: 'verifications', label: `Badges Vérifiés (${pendingVerifications.length})`, alert: pendingVerifications.length > 0 },
          { id: 'signalements', label: `Signalements (${pendingReports.length})`, alert: pendingReports.length > 0 },
          { id: 'utilisateurs', label: `Utilisateurs (${allUsers.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeAdminTab === tab.id
                ? 'bg-[#0F6B3F] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.alert && (
              <span className="w-2 h-2 rounded-full bg-[#F28C1B] animate-pulse"></span>
            )}
          </button>
        ))}
      </div>

      {/* 1. File d'attente des annonces */}
      {activeAdminTab === 'attente' && (
        <div className="space-y-3">
          {pendingListings.length === 0 ? (
            <div className="bg-white dark:bg-[#16261c] rounded-3xl p-8 text-center border border-dashed border-gray-300 dark:border-gray-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-base text-gray-900 dark:text-white">
                File d'attente vide
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                Toutes les annonces soumises ont été examinées et validées.
              </p>
            </div>
          ) : (
            pendingListings.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#16261c] rounded-2xl p-4 sm:p-5 border border-amber-200 dark:border-amber-900/50 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.photos[0]}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer"
                      onClick={() => setSelectedListing(item)}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {item.categorie} • {item.type}
                        </span>
                        <span className="text-xs font-extrabold text-[#0F6B3F] dark:text-[#34D399]">
                          {formatFCFA(item.prix)}
                        </span>
                      </div>
                      <h4
                        className="font-bold text-sm text-gray-900 dark:text-white hover:underline cursor-pointer"
                        onClick={() => setSelectedListing(item)}
                      >
                        {item.titre}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {item.commune} ({item.quartier}) • Proposé par {item.ownerNom} ({item.ownerTelephone})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleApprove(item.id)}
                      className="flex-1 sm:flex-none py-2 px-3.5 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approuver</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRejectingListingId(item.id)}
                      className="flex-1 sm:flex-none py-2 px-3.5 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Rejeter</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#1a2d22] p-2.5 rounded-xl line-clamp-2">
                  {item.description}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. Validation des Badges Vérifiés */}
      {activeAdminTab === 'verifications' && (
        <div className="space-y-3">
          {pendingVerifications.length === 0 ? (
            <div className="bg-white dark:bg-[#16261c] rounded-3xl p-8 text-center border border-dashed border-gray-300 dark:border-gray-800">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-base text-gray-900 dark:text-white">
                Aucune demande de vérification en attente
              </h4>
            </div>
          ) : (
            pendingVerifications.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-[#16261c] rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-base text-gray-900 dark:text-white">
                      {user.nom}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Téléphone : {formatIvorianPhone(user.telephone)} • Rôle : {user.role}
                    </p>
                    <p className="text-xs font-semibold text-[#0F6B3F] mt-1">
                      Type de document : {user.pieceIdentiteType || 'CNI'}
                    </p>
                  </div>

                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    En attente de validation
                  </span>
                </div>

                {user.pieceIdentiteUrl && (
                  <div className="rounded-xl overflow-hidden max-h-60 bg-gray-100 dark:bg-gray-800 border border-gray-200">
                    <img
                      src={user.pieceIdentiteUrl}
                      alt="Pièce d'identité"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => verifyOwnerIdentity(user.id, true)}
                    className="flex-1 py-2.5 px-3 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Valider le badge « Vérifié »</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => verifyOwnerIdentity(user.id, false)}
                    className="py-2.5 px-3 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. Signalements */}
      {activeAdminTab === 'signalements' && (
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="bg-white dark:bg-[#16261c] rounded-3xl p-8 text-center border border-dashed border-gray-300 dark:border-gray-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-base text-gray-900 dark:text-white">
                Aucun signalement
              </h4>
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white dark:bg-[#16261c] rounded-2xl p-4 border border-red-200 dark:border-red-900/50 shadow-sm space-y-2.5"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-red-500 shrink-0" />
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      Annonce : {rep.listingTitre}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rep.statut === 'traite' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {rep.statut === 'traite' ? 'Traité' : 'En attente'}
                  </span>
                </div>

                <div className="bg-red-50/50 dark:bg-red-950/20 p-3 rounded-xl text-xs text-red-900 dark:text-red-300 space-y-1">
                  <div>
                    <strong className="font-bold">Motif : </strong>
                    <span className="font-extrabold uppercase bg-red-100 dark:bg-red-900/60 px-2 py-0.5 rounded text-[11px] text-red-800 dark:text-red-200">
                      {rep.motif}
                    </span>
                  </div>
                  {rep.description && (
                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                      <strong>Explications :</strong> {rep.description}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    Propriétaire ID : <span className="font-mono">{rep.ownerId || 'Non spécifié'}</span>
                  </p>
                </div>

                {rep.statut === 'en_attente' && (
                  <div className="flex justify-end gap-2 pt-1">
                    {rep.ownerId && (
                      <button
                        type="button"
                        onClick={() => toggleUserBlock(rep.ownerId)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
                      >
                        Suspendre le propriétaire
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => resolveReport(rep.id)}
                      className="px-3 py-1.5 bg-[#0F6B3F] hover:bg-[#0B5431] text-white rounded-lg text-xs font-bold"
                    >
                      Marquer comme résolu
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. Liste des utilisateurs & Suspension */}
      {activeAdminTab === 'utilisateurs' && (
        <div className="bg-white dark:bg-[#16261c] rounded-3xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
          <h4 className="font-bold text-base text-gray-900 dark:text-white mb-2">
            Gestion des comptes utilisateurs ({allUsers.length})
          </h4>
          <div className="space-y-2">
            {allUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1a2d22] text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-gray-900 dark:text-white">{user.nom}</strong>
                    {user.verifie && <ShieldCheck className="w-3.5 h-3.5 text-[#0F6B3F]" />}
                    {user.bloque && (
                      <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        Suspendu
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500">
                    {user.telephone} • Rôle : {user.role}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleUserBlock(user.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
                    user.bloque
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {user.bloque ? 'Réactiver le compte' : 'Suspendre le compte'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Rejection Motive */}
      {rejectingListingId && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16261c] max-w-md w-full rounded-2xl p-5 shadow-2xl space-y-3">
            <h4 className="font-bold text-base text-gray-900 dark:text-white">
              Motif de rejet de l'annonce
            </h4>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ex: Photos non conformes, prix anormal ou coordonnées erronées..."
              rows={3}
              className="w-full text-sm bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingListingId(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="px-4 py-2 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
