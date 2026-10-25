export type CategoryType = 'location' | 'vente' | 'meuble' | 'hotel';

export type UserRole = 'chercheur' | 'proprietaire' | 'admin' | 'client';
export type AppSpace = 'chercheur' | 'proprietaire';
export type OwnerType = 'particulier' | 'agence' | 'hotelier' | 'promoteur';

export type ListingStatus = 'en_attente' | 'publiee' | 'rejetee' | 'masquee' | 'suspendue';

export type BookingStatus = 'demandee' | 'acceptee' | 'refusee';

export type VerificationStatus = 'non_fournie' | 'en_attente' | 'validee' | 'rejetee';

export interface DonneesChercheur {
  budgetMaxPrefe?: number;
  communePreferee?: string;
  typeRecherche?: string;
}

export interface DonneesProprietaire {
  typeProfil: OwnerType;
  nomCommercial?: string;
  whatsappPro?: string;
  adressePro?: string;
  pieceIdentiteUrl?: string;
  pieceIdentiteStatut?: VerificationStatus;
  pieceIdentiteType?: string;
  verifie?: boolean;
}

export interface UserProfile {
  id: string;
  nom: string;
  prenoms?: string;
  telephone: string;
  commune: string;
  email?: string;
  roles: UserRole[];
  espaceActif: AppSpace;
  profilComplet?: boolean;
  verifie?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  bloque?: boolean;
  donneesChercheur?: DonneesChercheur;
  donneesProprietaire?: DonneesProprietaire;
  dateCreation: string;
  // Backward compatibility getters
  role?: UserRole;
  pieceIdentiteUrl?: string;
  pieceIdentiteStatut?: VerificationStatus;
  pieceIdentiteType?: string;
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
  ownerWhatsapp?: string;
  ownerTelephone: string;
  ownerTelVerifie: boolean;
  ownerEmailVerifie: boolean;
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
  demo?: boolean;
  misEnAvant?: boolean;
  misEnAvantFin?: string;
  signalements: number;
  contestation?: string;
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

export type ReportReason = 'arnaque' | 'bien déjà loué' | 'prix faux' | 'photos volées' | 'autre';

export interface Report {
  id: string;
  listingId: string;
  listingTitre: string;
  ownerId: string;
  reporterId: string;
  userId?: string;
  motif: ReportReason | string;
  description?: string;
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
  tri: 'recent' | 'prix_croissant' | 'prix_decroissant' | 'proximite';
  maxDistanceKm?: number;
  userLocation?: { lat: number; lng: number };
}

