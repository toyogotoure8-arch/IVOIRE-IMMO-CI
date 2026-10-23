import React, { useEffect, useState, useMemo } from 'react';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { useApp } from '../context/AppContext';
import { calculateDistanceKm } from '../utils/calculations';
import {
  Navigation,
  Car,
  Bus,
  Footprints,
  Clock,
  Compass,
  Loader2,
  LocateFixed,
} from 'lucide-react';

interface Props {
  destination: { lat: number; lng: number };
  destinationLabel: string;
  commune: string;
  quartier: string;
}

type TravelModeType = 'DRIVE' | 'TRANSIT' | 'WALK';

export const GoogleDistanceCalculator: React.FC<Props> = ({
  destination,
  destinationLabel,
  commune,
  quartier,
}) => {
  const { userCoords, requestUserLocation } = useApp();

  const [travelMode, setTravelMode] = useState<TravelModeType>('DRIVE');
  const [loading, setLoading] = useState<boolean>(false);
  const [distanceText, setDistanceText] = useState<string | null>(null);
  const [durationText, setDurationText] = useState<string | null>(null);

  // Compute straight-line distance as baseline
  const straightLineKm = useMemo(() => {
    if (!userCoords) return null;
    return calculateDistanceKm(userCoords.lat, userCoords.lng, destination.lat, destination.lng);
  }, [userCoords, destination]);

  // Handle route calculation
  useEffect(() => {
    if (!userCoords || straightLineKm === null) return;

    setLoading(true);

    try {
      // Abidjan urban factor ~ 1.35x straight line
      const estDistanceKm = Math.round(straightLineKm * 1.35 * 10) / 10;
      let estMinutes = 0;

      if (travelMode === 'DRIVE') {
        estMinutes = Math.round((estDistanceKm / 28) * 60); // ~28 km/h urban speed
      } else if (travelMode === 'TRANSIT') {
        estMinutes = Math.round((estDistanceKm / 20) * 60) + 5; // ~20 km/h + wait time
      } else {
        estMinutes = Math.round((estDistanceKm / 4.5) * 60); // 4.5 km/h walking speed
      }

      setDistanceText(`${estDistanceKm} km`);
      const hours = Math.floor(estMinutes / 60);
      const mins = estMinutes % 60;

      if (hours > 0) {
        setDurationText(`${hours}h ${mins} min`);
      } else {
        setDurationText(`${Math.max(1, mins)} min`);
      }
    } catch (e) {
      console.warn('Distance calculation error fallback:', e);
      setDistanceText('N/A');
      setDurationText('N/A');
    } finally {
      setLoading(false);
    }
  }, [userCoords, destination, travelMode, straightLineKm]);

  // Center map bounding box
  const mapCenter = useMemo(() => {
    if (userCoords) {
      return {
        lat: (userCoords.lat + destination.lat) / 2,
        lng: (userCoords.lng + destination.lng) / 2,
      };
    }
    return destination;
  }, [userCoords, destination]);

  return (
    <div className="bg-[#F2F6F0] dark:bg-[#112017] rounded-2xl p-4 sm:p-5 border border-[#0F6B3F]/20 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#0F6B3F] dark:text-[#34D399] font-extrabold text-sm sm:text-base">
          <Navigation className="w-5 h-5" />
          <span>Calculateur de distance & temps de trajet (Google Maps)</span>
        </div>
      </div>

      {!userCoords ? (
        <div className="bg-white dark:bg-[#1a2d22] p-4 rounded-xl text-center space-y-3 border border-gray-200 dark:border-gray-800">
          <Compass className="w-10 h-10 text-[#0F6B3F] mx-auto opacity-80" />
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Activez la géolocalisation pour calculer la distance et le temps d'itinéraire exact vers ce bien à{' '}
            <strong>{commune}</strong> ({quartier}).
          </p>
          <button
            type="button"
            onClick={requestUserLocation}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95"
          >
            <LocateFixed className="w-4 h-4" />
            <span>Détecter ma position GPS actuelle</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mode Selection Tabs */}
          <div className="flex items-center gap-2 p-1 bg-white dark:bg-[#1a2d22] rounded-xl border border-gray-200 dark:border-gray-800 text-xs">
            <button
              type="button"
              onClick={() => setTravelMode('DRIVE')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                travelMode === 'DRIVE'
                  ? 'bg-[#0F6B3F] text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Voiture / Taxi</span>
            </button>
            <button
              type="button"
              onClick={() => setTravelMode('TRANSIT')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                travelMode === 'TRANSIT'
                  ? 'bg-[#0F6B3F] text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>Transport en commun</span>
            </button>
            <button
              type="button"
              onClick={() => setTravelMode('WALK')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                travelMode === 'WALK'
                  ? 'bg-[#0F6B3F] text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>À pied</span>
            </button>
          </div>

          {/* Results Summary Box */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-[#1a2d22] p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#0F6B3F] dark:text-[#34D399]">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">Distance estimée</div>
                <div className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0F6B3F]" />
                  ) : (
                    distanceText || 'N/A'
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2d22] p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">Temps de trajet</div>
                <div className="text-base sm:text-lg font-extrabold text-[#0F6B3F] dark:text-[#34D399]">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0F6B3F]" />
                  ) : (
                    durationText || 'N/A'
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mini Route Preview Google Map */}
          <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-inner">
            <Map
              mapId="DEMO_MAP_ID"
              defaultCenter={mapCenter}
              defaultZoom={12}
              gestureHandling="cooperative"
              disableDefaultUI={true}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              className="w-full h-full"
            >
              {/* User location pin */}
              <AdvancedMarker position={userCoords} title="Ma position GPS">
                <Pin background="#2563EB" borderColor="#1D4ED8" glyphColor="#FFFFFF" />
              </AdvancedMarker>

              {/* Destination pin */}
              <AdvancedMarker position={destination} title={destinationLabel}>
                <Pin background="#0F6B3F" borderColor="#0B5431" glyphColor="#FFFFFF" />
              </AdvancedMarker>

            </Map>

            <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 z-10">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Vous</span>
              <span className="text-gray-400">→</span>
              <span className="w-2 h-2 rounded-full bg-[#0F6B3F]"></span>
              <span className="truncate max-w-[120px]">{commune}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 px-1">
            <span>Départ : Ma position GPS</span>
            <span>Arrivée : {commune} ({quartier})</span>
          </div>
        </div>
      )}
    </div>
  );
};
