import React, { useState } from 'react';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Listing } from '../types';
import { formatFCFA } from '../utils/calculations';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, X, ShieldCheck, Loader2 } from 'lucide-react';
import { COORDONNEES_LOCALITES } from '../constants/ciData';

interface Props {
  listings: Listing[];
}

export const MapView: React.FC<Props> = ({ listings }) => {
  const { setSelectedListing, userCoords, isLocationLoading, requestUserLocation } = useApp();

  const [activePin, setActivePin] = useState<Listing | null>(listings[0] || null);

  // Default center Abidjan
  const defaultCenter = {
    lat: userCoords?.lat || 5.3400,
    lng: userCoords?.lng || -3.9900,
  };

  return (
    <div className="relative w-full h-[calc(100vh-230px)] min-h-[460px] bg-[#E8EFE9] dark:bg-[#0e1913] rounded-3xl overflow-hidden border border-[#0F6B3F]/20 shadow-inner flex flex-col">
      {/* Top Map Controls */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow text-xs font-bold text-gray-800 dark:text-gray-100 flex items-center gap-1.5 pointer-events-auto border border-gray-200 dark:border-gray-800">
          <MapPin className="w-3.5 h-3.5 text-[#0F6B3F]" />
          <span>{listings.length} biens localisés (Google Maps)</span>
        </div>

        <button
          type="button"
          onClick={requestUserLocation}
          disabled={isLocationLoading}
          className="bg-white/95 dark:bg-[#16261c] hover:bg-emerald-50 dark:hover:bg-[#1c3325] text-[#0F6B3F] dark:text-[#34D399] p-2.5 rounded-full shadow-md pointer-events-auto border border-emerald-600/30 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold"
          title="Centrer sur ma position GPS"
        >
          {isLocationLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#0F6B3F] dark:text-[#34D399]" />
          ) : (
            <Navigation className="w-4 h-4 fill-[#0F6B3F] dark:fill-[#34D399]" />
          )}
          <span className="hidden sm:inline">
            {isLocationLoading ? 'Recherche GPS...' : 'Autour de moi'}
          </span>
        </button>

      </div>

      {/* Real Google Maps Container */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={defaultCenter}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          className="w-full h-full"
        >
          {/* User GPS Pin */}
          {userCoords && (
            <AdvancedMarker position={userCoords} title="Ma position GPS">
              <Pin background="#2563EB" borderColor="#1D4ED8" glyphColor="#FFFFFF" />
            </AdvancedMarker>
          )}


          {/* Listing Markers */}
          {listings.map((item) => {
            const coords = item.position || COORDONNEES_LOCALITES[item.commune] || { lat: 5.34, lng: -4.0 };
            const isSelected = activePin?.id === item.id;
            const formattedPrice =
              item.prix >= 1000000
                ? `${Math.round(item.prix / 1000000)}M`
                : `${Math.round(item.prix / 1000)}k`;

            return (
              <AdvancedMarker
                key={item.id}
                position={coords}
                title={`${item.titre} — ${formatFCFA(item.prix)}`}
                onClick={() => setActivePin(item)}
              >
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-md border cursor-pointer transition-transform ${
                    isSelected
                      ? 'bg-[#F28C1B] text-white border-white ring-2 ring-[#F28C1B]/50 scale-125 z-30'
                      : 'bg-[#0F6B3F] text-white border-white/80 hover:scale-110'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>{formattedPrice}</span>
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
      </div>

      {/* Bottom Floating Card for Selected Pin */}
      {activePin && (
        <div className="absolute bottom-5 left-3 right-3 z-30 animate-in slide-in-from-bottom duration-200 max-w-lg mx-auto">
          <div className="bg-white dark:bg-[#16261c] rounded-2xl p-3 shadow-2xl border border-gray-200/80 dark:border-gray-800 flex items-center gap-3 relative">
            <button
              type="button"
              onClick={() => setActivePin(null)}
              aria-label="Fermer la fiche carte"
              className="absolute -top-2 -right-2 p-1 rounded-full bg-gray-900 text-white shadow hover:bg-gray-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <img
              src={activePin.photos[0]}
              alt={activePin.titre}
              className="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer"
              onClick={() => setSelectedListing(activePin)}
            />

            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedListing(activePin)}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold text-[#0F6B3F] dark:text-[#34D399] uppercase">
                  {activePin.categorie}
                </span>
                {activePin.ownerVerifie && (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F6B3F]" />
                )}
              </div>

              <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                {activePin.titre}
              </h4>

              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {activePin.commune} • {activePin.quartier}
              </p>

              <div className="text-sm font-extrabold text-[#0F6B3F] dark:text-[#34D399] mt-0.5">
                {formatFCFA(activePin.prix)}
                <span className="text-[11px] font-normal text-gray-400 ml-1">
                  {activePin.categorie === 'location' ? '/mois' : (activePin.categorie === 'meuble' || activePin.categorie === 'hotel') ? '/nuit' : ''}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedListing(activePin)}
              className="px-3 py-2 bg-[#0F6B3F] hover:bg-[#0B5431] text-white rounded-xl text-xs font-bold shrink-0 shadow-sm"
            >
              Voir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
