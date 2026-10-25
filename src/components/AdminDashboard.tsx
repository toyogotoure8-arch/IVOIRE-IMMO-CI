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
  Trash2,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    listings,
    toggleUserBlock,
    allUsers,
    bookings,
    reports,
    resolveReport,
    setSelectedListing,
    deleteDemoListings,
    validateListing,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'suspendues' | 'signalements' | 'utilisateurs' | 'stats'>('suspendues');

  // Suspended listings
  const suspendedListings = listings.filter((l) => l.statut === 'suspendue');
  const listingsWithContestation = suspendedListings.filter(l => l.contestation);

  // Pending reports
  const pendingReports = reports.filter((r) => r.statut === 'en_attente');

  // Stats
  const totalListings = listings.length;
  const publishedListings = listings.filter((l) => l.statut === 'publiee').length;
  const totalUsers = allUsers.length;
  const totalBookings = bookings.length;

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
              Console d'Administration Auto-Modérée
            </h2>
            <p className="text-xs text-emerald-300">
              Surveillance des suspensions automatiques, contestations et gestion des utilisateurs.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <button
            type="button"
            onClick={async () => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement toutes les annonces de démonstration ?')) {
                await deleteDemoListings();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Supprimer les annonces de démonstration</span>
          </button>
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
            <span className="text-[10px] text-emerald-400 block mt-0.5">{allUsers.filter(u => u.bloque).length} suspendus</span>
          </div>

          <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-800/40">
            <span className="text-xs text-emerald-300 font-medium block">Réservations</span>
            <span className="text-xl font-black text-white">{totalBookings}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Hôtels et Meublés</span>
          </div>

          <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-800/40">
            <span className="text-xs text-emerald-300 font-medium block">Signalements</span>
            <span className="text-xl font-black text-amber-300">{pendingReports.length}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Actifs</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'suspendues', label: `Suspensions (${suspendedListings.length})`, alert: listingsWithContestation.length > 0 },
          { id: 'signalements', label: `Signalements (${reports.length})` },
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
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </button>
        ))}
      </div>

      {/* 1. Annonces Suspendues & Contestations */}
      {activeAdminTab === 'suspendues' && (
        <div className="space-y-3">
          {suspendedListings.length === 0 ? (
            <div className="bg-white dark:bg-[#16261c] rounded-3xl p-8 text-center border border-dashed border-gray-300 dark:border-gray-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-base text-gray-900 dark:text-white">
                Aucune annonce suspendue
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                Le système d'auto-modération n'a détecté aucune anomalie majeure.
              </p>
            </div>
          ) : (
            suspendedListings.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#16261c] rounded-2xl p-4 sm:p-5 border border-red-200 dark:border-red-900/50 shadow-sm space-y-3"
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
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-800">
                          Suspendue
                        </span>
                        <span className="text-xs font-semibold text-gray-500">
                          {item.signalements} signalements
                        </span>
                      </div>
                      <h4
                        className="font-bold text-sm text-gray-900 dark:text-white hover:underline cursor-pointer"
                        onClick={() => setSelectedListing(item)}
                      >
                        {item.titre}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Propriétaire : {item.ownerNom} ({item.ownerTelephone})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => validateListing(item.id, true)}
                      className="flex-1 sm:flex-none py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Rétablir</span>
                    </button>
                  </div>
                </div>

                {item.contestation && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                      <MessageCircle className="w-3.5 h-3.5" />
                      Contestation du propriétaire
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-200 italic">
                      "{item.contestation}"
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. Signalements */}
      {activeAdminTab === 'signalements' && (
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="bg-white dark:bg-[#16261c] rounded-3xl p-8 text-center border border-dashed border-gray-300 dark:border-gray-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-base text-gray-900 dark:text-white">
                Aucun signalement historique
              </h4>
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white dark:bg-[#16261c] rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2.5"
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
                    {rep.statut === 'traite' ? 'Traité' : 'Actif'}
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
                    Signaleur ID : <span className="font-mono">{rep.reporterId}</span>
                  </p>
                </div>

                {rep.statut === 'en_attente' && (
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => resolveReport(rep.id)}
                      className="px-3 py-1.5 bg-[#0F6B3F] hover:bg-[#0B5431] text-white rounded-lg text-xs font-bold"
                    >
                      Archiver
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. Liste des utilisateurs & Suspension */}
      {activeAdminTab === 'utilisateurs' && (
        <div className="bg-white dark:bg-[#16261c] rounded-3xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
          <h4 className="font-bold text-base text-gray-900 dark:text-white mb-2 text-center sm:text-left">
            Gestion des comptes utilisateurs ({allUsers.length})
          </h4>
          <div className="space-y-2">
            {allUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1a2d22] text-xs gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-gray-900 dark:text-white">{user.nom}</strong>
                    {user.phoneVerified && <span title="Téléphone vérifié"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /></span>}
                    {user.emailVerified && <span title="Email vérifié"><ShieldCheck className="w-3.5 h-3.5 text-blue-500" /></span>}
                    {user.bloque && (
                      <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        Suspendu
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500">
                    {user.telephone} • {user.email || 'Pas d\'email'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleUserBlock(user.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors w-full sm:w-auto ${
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
    </div>
  );
};
