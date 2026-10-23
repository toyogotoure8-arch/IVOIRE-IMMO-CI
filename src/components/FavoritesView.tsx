import React from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from './ListingCard';
import { Heart, Search } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { listings, favorites, setActiveTab } = useApp();

  const favoriteListings = listings.filter((l) => favorites.includes(l.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
            Mes Favoris
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {favoriteListings.length} bien{favoriteListings.length > 1 ? 's' : ''} enregistré{favoriteListings.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {favoriteListings.length === 0 ? (
        <div className="bg-white dark:bg-[#16261c] rounded-3xl p-10 text-center border border-dashed border-gray-300 dark:border-gray-800 space-y-3">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 mx-auto flex items-center justify-center">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            Aucun favori enregistré
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Touchez le cœur d'une annonce pour l'ajouter à vos favoris et la retrouver facilement à tout moment.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('accueil')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold rounded-xl shadow transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Explorer les annonces</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};
