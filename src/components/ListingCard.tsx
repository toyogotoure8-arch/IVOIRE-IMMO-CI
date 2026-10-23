import React from 'react';
import { Listing } from '../types';
import { formatFCFA, calculateDistanceKm } from '../utils/calculations';
import { useApp } from '../context/AppContext';
import { ShareButton } from './ShareButton';
import {
  Heart,
  MapPin,
  ShieldCheck,
  Droplets,
  Zap,
  Wind,
  Wifi,
  Eye,
  Navigation,
} from 'lucide-react';

interface Props {
  listing: Listing;
}

export const ListingCard: React.FC<Props> = ({ listing }) => {
  const { setSelectedListing, favorites, toggleFavorite, userCoords, incrementListingMetric, compareListings, toggleCompare } = useApp();
  const isFavorite = favorites.includes(listing.id);
  const isCompared = compareListings.includes(listing.id);
  const [imgLoaded, setImgLoaded] = React.useState(false);

  const priceLabel =
    listing.categorie === 'location'
      ? '/mois'
      : listing.categorie === 'meuble' || listing.categorie === 'hotel'
      ? '/nuit'
      : '';

  const categoryLabels: Record<string, { label: string; color: string }> = {
    location: { label: 'Location', color: 'bg-emerald-600' },
    vente: { label: 'Vente', color: 'bg-amber-600' },
    meuble: { label: 'Meublé', color: 'bg-blue-600' },
    hotel: { label: 'Hôtel', color: 'bg-purple-600' },
  };

  const catInfo = categoryLabels[listing.categorie] || { label: listing.categorie, color: 'bg-gray-600' };

  let distanceKm: number | null = null;
  if (userCoords && listing.position) {
    distanceKm = calculateDistanceKm(
      userCoords.lat,
      userCoords.lng,
      listing.position.lat,
      listing.position.lng
    );
  }

  const handleCardClick = () => {
    incrementListingMetric(listing.id, 'vues');
    setSelectedListing(listing);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-[#16261c] rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col active:scale-[0.99]"
    >
      {/* Photo Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse z-0" />
        )}
        <img
          src={listing.photos[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'}
          alt={listing.titre}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            setImgLoaded(true);
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80';
          }}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 relative z-1 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />


        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
          <span className={`text-[11px] font-bold text-white px-2.5 py-0.5 rounded-full shadow-sm ${catInfo.color}`}>
            {catInfo.label}
          </span>
          {listing.isExemple && (
            <span className="text-[10px] font-semibold bg-black/60 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded-full border border-amber-300/30">
              Exemple
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(listing.id);
            }}
            className={`text-[10px] font-extrabold px-2 py-1 rounded-full shadow transition-all backdrop-blur-md ${
              isCompared
                ? 'bg-[#0F6B3F] text-white'
                : 'bg-white/90 dark:bg-black/70 text-gray-800 dark:text-gray-200 hover:bg-emerald-50'
            }`}
            title="Ajouter au comparateur (max 3)"
          >
            ⚖️ {isCompared ? 'Comparé' : 'Comparer'}
          </button>
        </div>

        {/* Top Right Actions: Favorite & Share */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <ShareButton listing={listing} variant="icon" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(listing.id);
            }}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className="p-2 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:text-red-500 active:scale-90 transition-all shadow-sm"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'
              }`}
            />
          </button>
        </div>

        {/* Verified Owner Badge */}
        {listing.ownerVerifie && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-[#0F6B3F]/90 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Propriétaire vérifié</span>
          </div>
        )}

        {/* Distance Indicator if GPS active */}
        {distanceKm !== null && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            <Navigation className="w-3 h-3 text-emerald-400" />
            <span>{distanceKm} km</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1">
        {/* Price */}
        <div className="flex items-baseline justify-between mb-1">
          <div className="text-lg sm:text-xl font-extrabold text-[#0F6B3F] dark:text-[#34D399]">
            {formatFCFA(listing.prix)}
            {priceLabel && <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">{priceLabel}</span>}
          </div>
          {listing.pieces > 0 && (
            <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md">
              {listing.pieces} {listing.pieces > 1 ? 'pièces' : 'pièce'}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#0F6B3F] transition-colors mb-1.5">
          {listing.titre}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#F28C1B] shrink-0" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">{listing.commune}</span>
          <span>•</span>
          <span className="truncate">{listing.quartier}</span>
        </div>

        {/* Equipments mini-bar */}
        <div className="mt-auto pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            {listing.equipements.includes('eau') && (
              <span title="Eau SODECI" className="text-blue-500"><Droplets className="w-3.5 h-3.5" /></span>
            )}
            {listing.equipements.includes('electricite') && (
              <span title="Électricité CIE" className="text-amber-500"><Zap className="w-3.5 h-3.5" /></span>
            )}
            {listing.equipements.includes('climatisation') && (
              <span title="Climatisation" className="text-teal-500"><Wind className="w-3.5 h-3.5" /></span>
            )}
            {listing.equipements.includes('wifi') && (
              <span title="Wi-Fi / Fibre" className="text-indigo-500"><Wifi className="w-3.5 h-3.5" /></span>
            )}
            <span className="text-[11px] font-medium text-gray-400">
              {listing.type}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <Eye className="w-3 h-3" />
            <span>{listing.vues || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
