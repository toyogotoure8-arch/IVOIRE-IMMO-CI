import { CategoryType } from '../types';

export interface RecentSearch {
  id: string;
  label: string;
  commune?: string;
  categorie?: CategoryType | 'toutes';
  timestamp: number;
}

export const DEFAULT_RECENT_SEARCHES: RecentSearch[] = [
  { id: 'rs-1', label: 'Cocody (Location)', commune: 'Cocody', categorie: 'location', timestamp: Date.now() - 3600000 },
  { id: 'rs-2', label: 'Marcory Zone 4', commune: 'Marcory', categorie: 'toutes', timestamp: Date.now() - 7200000 },
  { id: 'rs-3', label: 'Plateau (Meublé)', commune: 'Plateau', categorie: 'meuble', timestamp: Date.now() - 10800000 },
];

/**
 * Ajoute une recherche récente en conservant uniquement les 3 plus récentes sans doublon.
 */
export function addRecentSearch(
  current: RecentSearch[],
  newItem: { label: string; commune?: string; categorie?: CategoryType | 'toutes' }
): RecentSearch[] {
  const cleanLabel = newItem.label.trim();
  if (!cleanLabel) return current;

  // Filter out any duplicate with the same label or criteria (case-insensitive)
  const filtered = current.filter(
    (item) => item.label.toLowerCase() !== cleanLabel.toLowerCase()
  );

  const entry: RecentSearch = {
    id: 'rs-' + Date.now(),
    label: cleanLabel,
    commune: newItem.commune,
    categorie: newItem.categorie,
    timestamp: Date.now(),
  };

  // Prepend and cap at 3 items maximum
  return [entry, ...filtered].slice(0, 3);
}

/**
 * Supprime une recherche récente par son identifiant.
 */
export function deleteRecentSearch(current: RecentSearch[], id: string): RecentSearch[] {
  return current.filter((item) => item.id !== id);
}
