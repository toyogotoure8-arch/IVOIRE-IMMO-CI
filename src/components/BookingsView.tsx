import React from 'react';
import { useApp } from '../context/AppContext';
import { formatFCFA, formatIvorianPhone } from '../utils/calculations';
import { CalendarCheck, MapPin, Clock, CheckCircle2, XCircle, Search } from 'lucide-react';

export const BookingsView: React.FC = () => {
  const { bookings, currentUser, setActiveTab, setSelectedListing, listings } = useApp();

  const myBookings = bookings.filter((b) => currentUser && b.clientId === currentUser.id);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
          Mes Réservations
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Suivi de vos demandes pour meublés et hôtels
        </p>
      </div>

      {myBookings.length === 0 ? (
        <div className="bg-white dark:bg-[#16261c] rounded-3xl p-10 text-center border border-dashed border-gray-300 dark:border-gray-800 space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#0F6B3F] mx-auto flex items-center justify-center">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            Aucune réservation en cours
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Trouvez une agréable résidence meublée à Abidjan ou un hôtel à Grand-Bassam ou Yamoussoukro et réservez en quelques clics.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('accueil')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F6B3F] text-white text-xs font-bold rounded-xl shadow"
          >
            <Search className="w-4 h-4" />
            <span>Découvrir les meublés & hôtels</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {myBookings.map((b) => {
            const originalListing = listings.find((l) => l.id === b.listingId);
            return (
              <div
                key={b.id}
                className="bg-white dark:bg-[#16261c] rounded-2xl p-4 sm:p-5 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        b.statut === 'acceptee'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : b.statut === 'refusee'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {b.statut === 'acceptee' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Réservation acceptée
                        </>
                      ) : b.statut === 'refusee' ? (
                        <>
                          <XCircle className="w-3 h-3" />
                          Réservation refusée
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          En attente de réponse du propriétaire
                        </>
                      )}
                    </span>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white mt-1.5">
                      {b.listingTitre}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#F28C1B]" />
                      {b.listingCommune}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-lg font-black text-[#0F6B3F] dark:text-[#34D399]">
                      {formatFCFA(b.montantTotal)}
                    </span>
                    <span className="text-xs text-gray-500 block">
                      {b.nuits} nuit{b.nuits > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-[#1a2d22] p-3 rounded-xl text-xs flex justify-between items-center text-gray-700 dark:text-gray-300">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Arrivée</span>
                    <span className="font-bold">{b.dateArrivee}</span>
                  </div>
                  <div className="text-center font-bold text-gray-400">→</div>
                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px]">Départ</span>
                    <span className="font-bold">{b.dateDepart}</span>
                  </div>
                </div>

                {originalListing && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedListing(originalListing)}
                      className="text-xs font-bold text-[#0F6B3F] dark:text-[#34D399] hover:underline"
                    >
                      Revoir l'annonce complète →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
