export type CategoryType = 'location' | 'vente' | 'meuble' | 'hotel';

export type UserRole = 'client' | 'proprietaire' | 'admin';

export type ListingStatus = 'en_attente' | 'publiee' | 'rejetee' | 'masquee';

export type BookingStatus = 'demandee' | 'acceptee' | 'refusee';

export type VerificationStatus = 'non_fournie' | 'en_attente' | 'validee' | 'rejetee';

export interface UserProfile {
  id: string;
  nom: string;
  telephone: string;
  email?: string;
  role: UserRole;
  verifie: boolean;
  pieceIdentiteUrl?: string;
  pieceIdentiteStatut?: VerificationStatus;
  pieceIdentiteType?: string;
  bloque?: boolean;
  dateCreation: string;
}

export interface ListingPosition {
  lat: number;
  lng: number;
  label?: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  ownerNom: string;
  ownerTelephone: string;
  ownerVerifie: boolean;
  categorie: CategoryType;
  type: string;
  titre: string;
  description: string;
  prix: number;
  commune: string;
  quartier: string;
  pieces: number;
  equipements: string[];
  photos: string[];
  position?: ListingPosition;
  statut: ListingStatus;
  motifRejet?: string;
  vues: number;
  contacts: number;
  demandes: number;
  datesOccupees?: string[]; // ISO date strings (YYYY-MM-DD)
  isExemple?: boolean;
  dateCreation: string;
}

export interface Booking {
  id: string;
  listingId: string;
  listingTitre: string;
  listingPhoto?: string;
  listingCommune: string;
  clientId: string;
  clientNom: string;
  clientTelephone: string;
  ownerId: string;
  dateArrivee: string;
  dateDepart: string;
  nuits: number;
  montantTotal: number;
  statut: BookingStatus;
  notes?: string;
  dateCreation: string;
}

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  dateCreation: string;
}

export interface SearchAlert {
  id: string;
  userId: string;
  categorie?: CategoryType | 'toutes';
  commune?: string;
  budgetMax?: number;
  dateCreation: string;
}

export interface Report {
  id: string;
  listingId: string;
  listingTitre: string;
  userId: string;
  motif: string;
  statut: 'en_attente' | 'traite';
  dateCreation: string;
}

export interface Message {
  id: string;
  listingId?: string;
  listingTitre?: string;
  senderId: string;
  senderNom: string;
  receiverId: string;
  texte: string;
  dateCreation: string;
}

export interface FilterCriteria {
  categorie: CategoryType | 'toutes';
  commune: string;
  budgetMin: number | '';
  budgetMax: number | '';
  pieces: number | 'toutes';
  equipements: string[];
  tri: 'recent' | 'prix_croissant' | 'prix_decroissant';
  maxDistanceKm?: number;
  userLocation?: { lat: number; lng: number };
}
