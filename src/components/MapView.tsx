import React, { useState } from 'react';
import { Listing } from '../types';
import { formatFCFA, calculateDistanceKm } from '../utils/calculations';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, X, ShieldCheck, Heart, Eye } from 'lucide-react';
import { COORDONNEES_LOCALITES } from '../constants/ciData';

interface Props {
  listings: Listing[];
}

export const MapView: React.FC<Props> = ({ listings }) => {
  const { setSelectedListing, userCoords, requestUserLocation, toggleFavorite, favorites } = useApp();
  const [activePin, setActivePin] = useState<Listing | null>(listings[0] || null);

  // Bounding box for Côte d'Ivoire / Abidjan mapping representation
  // CI lat range ~ 4.5 to 10.5, lng ~ -8.5 to -2.5
  // Abidjan lat ~ 5.2 to 5.5, lng ~ -4.2 to -3.8
  const centerLat = userCoords?.lat || 5.3400;
  const centerLng = userCoords?.lng || -3.9900;

  // Convert GPS coordinates to SVG coordinate percentages
  // Focused on Grand Abidjan area (5.18 to 5.48 Lat, -4.25 to -3.70 Lng)
  const getSvgCoordinates = (lat: number, lng: number) => {
    const minLat = 5.15;
    const maxLat = 5.50;
    const minLng = -4.30;
    const maxLng = -3.70;

    // If outside Abidjan (e.g. Yamoussoukro, Bouaké), clamp gently into interior zone
    let clampedLat = Math.min(Math.max(lat, minLat), maxLat);
    let clampedLng = Math.min(Math.max(lng, minLng), maxLng);

    const x = ((clampedLng - minLng) / (maxLng - minLng)) * 100;
    // Invert Y because latitude increases upwards
    const y = ((maxLat - clampedLat) / (maxLat - minLat)) * 100;

    return { x: Math.max(5, Math.min(95, x)), y: Math.max(8, Math.min(92, y)) };
  };

  return (
    <div className="relative w-full h-[calc(100vh-230px)] min-h-[460px] bg-[#E8EFE9] dark:bg-[#0e1913] rounded-3xl overflow-hidden border border-[#0F6B3F]/20 shadow-inner flex flex-col">
      {/* Top Map Controls */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow text-xs font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-1.5 pointer-events-auto border border-gray-200 dark:border-gray-800">
          <MapPin className="w-3.5 h-3.5 text-[#0F6B3F]" />
          <span>{listings.length} biens localisés</span>
        </div>

        <button
          type="button"
          onClick={requestUserLocation}
          className="bg-white/95 dark:bg-[#16261c] hover:bg-emerald-50 dark:hover:bg-[#1c3325] text-[#0F6B3F] dark:text-[#34D399] p-2.5 rounded-full shadow-md pointer-events-auto border border-emerald-600/30 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold"
          title="Centrer sur ma position GPS"
        >
          <Navigation className="w-4 h-4 fill-[#0F6B3F] dark:fill-[#34D399]" />
          <span className="hidden sm:inline">Autour de moi</span>
        </button>
      </div>

      {/* Interactive Map Visual Area (Stylized Map of Abidjan Lagoon & Districts) */}
      <div className="relative flex-1 w-full h-full overflow-hidden select-none">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          {/* Lagoon Ebrié styling */}
          <path
            d="M 0,65 Q 25,60 45,68 T 80,62 T 100,67 L 100,80 Q 75,75 50,78 T 0,75 Z"
            fill="#B4D5E5"
            className="dark:fill-[#1b3442] opacity-70"
          />
          <path
            d="M 30,55 Q 40,45 55,50 T 70,55 T 60,65 Z"
            fill="#B4D5E5"
            className="dark:fill-[#1b3442] opacity-60"
          />
          {/* Main Road Axes */}
          <path
            d="M 10,40 Q 50,45 90,35"
            stroke="#D1DCD3"
            strokeWidth="1.5"
            fill="none"
            className="dark:stroke-[#203a2c]"
          />
          <path
            d="M 50,10 Q 52,50 48,90"
            stroke="#D1DCD3"
            strokeWidth="1.5"
            fill="none"
            className="dark:stroke-[#203a2c]"
          />
        </svg>

        {/* User GPS Pin if detected */}
        {userCoords && (
          <div
            style={{
              left: `${getSvgCoordinates(userCoords.lat, userCoords.lng).x}%`,
              top: `${getSvgCoordinates(userCoords.lat, userCoords.lng).y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75"></span>
              <div className="relative p-1.5 rounded-full bg-blue-600 text-white shadow-lg border-2 border-white">
                <Navigation className="w-3.5 h-3.5 fill-white" />
              </div>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
              Moi
            </div>
          </div>
        )}

        {/* Listings Pins */}
        {listings.map((item) => {
          const coords = item.position || COORDONNEES_LOCALITES[item.commune] || { lat: 5.34, lng: -4.0 };
          const pos = getSvgCoordinates(coords.lat, coords.lng);
          const isSelected = activePin?.id === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePin(item)}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10 ${
                isSelected ? 'z-30 scale-125' : 'hover:scale-110'
              }`}
            >
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-extrabold shadow-md border transition-all ${
                  isSelected
                    ? 'bg-[#F28C1B] text-white border-white ring-2 ring-[#F28C1B]/50'
                    : 'bg-[#0F6B3F] text-white border-white/80 hover:bg-[#0B5431]'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>
                  {item.prix >= 1000000
                    ? `${Math.round(item.prix / 1000000)}M`
                    : `${Math.round(item.prix / 1000)}k`}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Floating Card for Selected Pin */}
      {activePin && (
        <div className="absolute bottom-20 left-3 right-3 z-30 animate-in slide-in-from-bottom duration-200">
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
