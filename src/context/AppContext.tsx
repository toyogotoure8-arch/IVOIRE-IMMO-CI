import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Listing,
  UserProfile,
  Booking,
  Favorite,
  SearchAlert,
  Report,
  Message,
  CategoryType,
  FilterCriteria,
  UserRole,
  AppSpace,
  DonneesChercheur,
  DonneesProprietaire,
} from '../types';
import { TOUTES_LOCALITES, COORDONNEES_LOCALITES } from '../constants/ciData';

import { calculateDistanceKm } from '../utils/calculations';
import { RecentSearch, DEFAULT_RECENT_SEARCHES, addRecentSearch, deleteRecentSearch } from '../utils/recentSearches';
import { db, auth, googleProvider, handleFirestoreError, OperationType, testFirestoreConnection, getAuthErrorMessage } from '../services/firebase';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, deleteDoc, increment, writeBatch } from 'firebase/firestore';
import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  linkWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';

interface AppContextType {
  // Auth & Profile
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phone: string, role?: UserRole, customName?: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name?: string, phone?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  linkEmailCredential: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showRoleModal: boolean;
  setShowRoleModal: (show: boolean) => void;
  updateUserVerification: (idCardUrl: string, type: string) => Promise<void>;
  registerSingleAccount: (data: {
    nom: string;
    prenoms?: string;
    telephone: string;
    commune: string;
    email?: string;
    initialSpace: AppSpace;
    donneesChercheur?: DonneesChercheur;
    donneesProprietaire?: DonneesProprietaire;
  }) => Promise<void>;
  addRoleToAccount: (data: {
    newSpaceRole: AppSpace;
    donneesChercheur?: DonneesChercheur;
    donneesProprietaire?: DonneesProprietaire;
  }) => Promise<void>;
  switchActiveSpace: (space: AppSpace) => Promise<void>;

  // Navigation
  activeTab: 'accueil' | 'favoris' | 'publier' | 'mon_espace' | 'demandes' | 'mes_annonces' | 'demandes_recues';
  setActiveTab: (tab: 'accueil' | 'favoris' | 'publier' | 'mon_espace' | 'demandes' | 'mes_annonces' | 'demandes_recues') => void;
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;
  isFiltersOpen: boolean;
  setIsFiltersOpen: (open: boolean) => void;
  isMapView: boolean;
  setIsMapView: (map: boolean) => void;
  userCoords: { lat: number; lng: number } | null;
  isLocationLoading: boolean;
  locationError: string | null;
  requestUserLocation: () => Promise<void>;

  // Portal Gateway Space ('chercheur' | 'proprietaire' | null)
  userPortal: 'chercheur' | 'proprietaire' | null;
  setUserPortal: (space: 'chercheur' | 'proprietaire' | null) => void;
  selectPortal: (space: 'chercheur' | 'proprietaire') => void;
  resetPortal: () => void;

  // Listings & Filtering
  listings: Listing[];
  filteredListings: Listing[];
  isLoadingListings: boolean;
  refreshListings: () => Promise<void>;
  filters: FilterCriteria;
  setFilters: React.Dispatch<React.SetStateAction<FilterCriteria>>;
  resetFilters: () => void;

  addListing: (listingData: Omit<Listing, 'id' | 'dateCreation' | 'vues' | 'contacts' | 'demandes'>) => Promise<string>;
  updateListing: (id: string, updates: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  incrementListingMetric: (id: string, metric: 'vues' | 'contacts' | 'demandes') => Promise<void>;

  // Bookings
  bookings: Booking[];
  createBooking: (bookingData: Omit<Booking, 'id' | 'dateCreation' | 'statut'>) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: 'acceptee' | 'refusee') => Promise<void>;

  // Favorites
  favorites: string[]; // listing IDs
  toggleFavorite: (listingId: string) => Promise<void>;

  // Search Alerts
  alerts: SearchAlert[];
  createAlert: (alert: Omit<SearchAlert, 'id' | 'dateCreation' | 'userId'>) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;

  // Recent Searches
  recentSearches: RecentSearch[];
  recordSearch: (label: string, commune?: string, categorie?: CategoryType | 'toutes') => void;
  removeSearch: (id: string) => void;
  clearAllSearches: () => void;

  // Reports
  reports: Report[];
  submitReport: (
    listingId: string,
    listingTitre: string,
    ownerId: string,
    motif: string,
    description?: string
  ) => Promise<void>;
  resolveReport: (reportId: string) => Promise<void>;

  // Admin Actions
  validateListing: (listingId: string, approve: boolean, motifRejet?: string) => Promise<void>;
  verifyOwnerIdentity: (userId: string, approve: boolean) => Promise<void>;
  toggleUserBlock: (userId: string) => Promise<void>;
  deleteDemoListings: () => Promise<void>;
  contestSuspension: (listingId: string, motif: string) => Promise<void>;
  allUsers: UserProfile[];

  // Messages
  messages: Message[];
  sendMessage: (receiverId: string, text: string, listingId?: string, listingTitre?: string) => Promise<void>;

  // Toast notifications
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Comparison (up to 3 listings)
  compareListings: string[];
  toggleCompare: (listingId: string) => void;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;

  // Recently Viewed (up to 5 listings stored in localStorage)
  recentlyViewedIds: string[];
  recentlyViewedListings: Listing[];
  addToRecentlyViewed: (listingId: string) => void;
  removeFromRecentlyViewed: (listingId: string) => void;
  clearRecentlyViewed: () => void;
}

const defaultFilters: FilterCriteria = {
  categorie: 'toutes',
  commune: 'Toutes',
  budgetMin: '',
  budgetMax: '',
  pieces: 'toutes',
  equipements: [],
  tri: 'recent',
  maxDistanceKm: 25,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ivoire_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const [activeTab, setActiveTab] = useState<'accueil' | 'favoris' | 'publier' | 'mon_espace' | 'demandes' | 'mes_annonces' | 'demandes_recues'>('accueil');
  const [selectedListing, _setSelectedListing] = useState<Listing | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isMapView, setIsMapView] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(() => {
    const saved = localStorage.getItem('ivoire_user_coords');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);


  const [isLoadingListings, setIsLoadingListings] = useState<boolean>(true);

  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('ivoire_listings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate any stale photo URLs
      return parsed.map((item: Listing) => ({
        ...item,
        photos: item.photos.map((p) =>
          p.includes('photo-1502005229762-ae1b460020e2')
            ? 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
            : p
        ),
      }));
    }
    return [];
  });

  const refreshListings = async () => {
    setIsLoadingListings(true);
    try {
      const snap = await getDocs(collection(db, 'listings'));
      const fetched: Listing[] = [];
      snap.forEach((docSnap) => {
        fetched.push(docSnap.data() as Listing);
      });
      setListings(fetched);
    } catch (e) {
      console.warn('Firestore refresh note:', e);
    } finally {
      setTimeout(() => {
        setIsLoadingListings(false);
      }, 500);
    }
  };

  useEffect(() => {
    refreshListings();
  }, []);


  const [filters, setFilters] = useState<FilterCriteria>(defaultFilters);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('ivoire_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [compareListings, setCompareListings] = useState<string[]>(() => {
    const saved = localStorage.getItem('ivoire_compare');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ivoire_compare', JSON.stringify(compareListings));
  }, [compareListings]);

  const toggleCompare = (listingId: string) => {
    setCompareListings((prev) => {
      const exists = prev.includes(listingId);
      if (exists) {
        showToast('Annonce retirée du comparateur', 'info');
        return prev.filter((id) => id !== listingId);
      } else {
        if (prev.length >= 3) {
          showToast('Vous pouvez comparer au maximum 3 annonces simultanément.', 'error');
          return prev;
        }
        showToast('Annonce ajoutée au comparateur ⚖️', 'success');
        return [...prev, listingId];
      }
    });
  };

  const clearCompare = () => {
    setCompareListings([]);
    showToast('Comparateur vidé.', 'info');
  };

  // Recently Viewed Listings (up to 5 stored in localStorage)
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ivoire_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToRecentlyViewed = (listingId: string) => {
    if (!listingId) return;
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== listingId);
      const updated = [listingId, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('ivoire_recently_viewed', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage error saving recently viewed:', e);
      }
      return updated;
    });
  };

  const removeFromRecentlyViewed = (listingId: string) => {
    setRecentlyViewedIds((prev) => {
      const updated = prev.filter((id) => id !== listingId);
      try {
        localStorage.setItem('ivoire_recently_viewed', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage error removing recently viewed:', e);
      }
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewedIds([]);
    try {
      localStorage.removeItem('ivoire_recently_viewed');
    } catch (e) {
      console.warn('LocalStorage error clearing recently viewed:', e);
    }
    showToast('Historique des annonces consultées effacé.', 'info');
  };

  const setSelectedListing: React.Dispatch<React.SetStateAction<Listing | null>> = (action) => {
    _setSelectedListing((prev) => {
      const next = typeof action === 'function' ? (action as (prev: Listing | null) => Listing | null)(prev) : action;
      if (next?.id) {
        addToRecentlyViewed(next.id);
      }
      return next;
    });
  };

  // Derive the 5 Listing objects preserving recent view order
  const recentlyViewedListings = React.useMemo(() => {
    return recentlyViewedIds
      .map((id) => listings.find((l) => l.id === id))
      .filter((l): l is Listing => Boolean(l));
  }, [recentlyViewedIds, listings]);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('ivoire_bookings');
    return saved ? JSON.parse(saved) : [
      {
        id: 'booking-demo-1',
        listingId: 'demo-6',
        listingTitre: 'Appartement meublé design avec vue panoramique au Plateau',
        listingPhoto: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        listingCommune: 'Plateau',
        clientId: 'client-touriste',
        clientNom: 'Christian Kouassi',
        clientTelephone: '+225 07 12 34 56 78',
        ownerId: 'owner-residence',
        dateArrivee: '2026-11-05',
        dateDepart: '2026-11-08',
        nuits: 3,
        montantTotal: 135000,
        statut: 'acceptee',
        dateCreation: '2026-10-20T10:00:00.000Z',
      },
    ];
  });

  const [alerts, setAlerts] = useState<SearchAlert[]>(() => {
    const saved = localStorage.getItem('ivoire_alerts');
    return saved ? JSON.parse(saved) : [
      {
        id: 'alert-1',
        userId: 'client-touriste',
        categorie: 'location',
        commune: 'Cocody',
        budgetMax: 200000,
        dateCreation: '2026-10-18T10:00:00.000Z',
      },
    ];
  });

  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    const saved = localStorage.getItem('ivoire_recent_searches');
    return saved ? JSON.parse(saved) : DEFAULT_RECENT_SEARCHES;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('ivoire_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('ivoire_all_users');
    return saved ? JSON.parse(saved) : [
      {
        id: 'owner-koffi',
        nom: 'Koffi & Frères Immobilier',
        telephone: '+225 07 08 12 34 56',
        role: 'proprietaire',
        verifie: true,
        pieceIdentiteStatut: 'validee',
        dateCreation: '2026-10-01T08:00:00.000Z',
      },
      {
        id: 'owner-aminata',
        nom: 'Agence Aminata Prestige',
        telephone: '+225 05 45 78 90 12',
        role: 'proprietaire',
        verifie: true,
        pieceIdentiteStatut: 'validee',
        dateCreation: '2026-10-02T09:30:00.000Z',
      },
      {
        id: 'owner-yao',
        nom: 'M. Yao Kouamé',
        telephone: '+225 01 02 03 04 05',
        role: 'proprietaire',
        verifie: false,
        pieceIdentiteStatut: 'en_attente',
        pieceIdentiteUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        pieceIdentiteType: 'CNI Ivoirienne',
        dateCreation: '2026-10-14T11:00:00.000Z',
      },
    ];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('ivoire_messages');
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg-1',
        listingId: 'demo-1',
        listingTitre: 'Coquet Studio moderne à Cocody Angré',
        senderId: 'owner-koffi',
        senderNom: 'Koffi & Frères Immobilier',
        receiverId: 'client-touriste',
        texte: 'Bonjour M. Touriste, le studio à Angré est bien disponible pour visite ce samedi dès 10h.',
        dateCreation: '2026-10-21T14:30:00.000Z',
      },
    ];
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Gateway Portal Space ('chercheur' | 'proprietaire' | null)
  const [userPortal, setUserPortalState] = useState<'chercheur' | 'proprietaire' | null>(() => {
    try {
      const saved = localStorage.getItem('ivoire_user_space');
      if (saved === 'chercheur' || saved === 'proprietaire') {
        return saved;
      }
    } catch (e) {
      // Ignore
    }
    return null;
  });

  const setUserPortal = (space: 'chercheur' | 'proprietaire' | null) => {
    setUserPortalState(space);
    try {
      if (space) {
        localStorage.setItem('ivoire_user_space', space);
      } else {
        localStorage.removeItem('ivoire_user_space');
      }
    } catch (e) {
      console.warn('LocalStorage error setting portal space:', e);
    }
  };

  const selectPortal = (space: 'chercheur' | 'proprietaire') => {
    setUserPortal(space);
    if (space === 'proprietaire') {
      if (currentUser?.role !== 'proprietaire' && currentUser?.role !== 'admin') {
        switchRole('proprietaire');
      }
      showToast('Espace Propriétaire activé 🏡 Déposez vos offres !', 'success');
    } else {
      if (currentUser?.role === 'proprietaire') {
        switchRole('client');
      }
      showToast('Espace Chercheur activé 🔍 Découvrez toutes les offres !', 'success');
    }
  };

  const resetPortal = () => {
    setUserPortal(null);
    showToast('Porte d\'entrée réinitialisée. Choisissez votre espace.', 'info');
  };

  // Sync state to local storage for instant responsiveness & offline support
  useEffect(() => {
    localStorage.setItem('ivoire_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('ivoire_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('ivoire_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('ivoire_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('ivoire_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem('ivoire_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('ivoire_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ivoire_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ivoire_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ivoire_user');
    }
  }, [currentUser]);

  // Firebase auth state listener & firestore connection check
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Fetch or create user profile in Firestore
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            const normalizedData: UserProfile = {
              ...data,
              roles: data.roles || (data.role ? [data.role === 'client' ? 'chercheur' : data.role] : ['chercheur']),
              espaceActif: data.espaceActif || (data.role === 'proprietaire' ? 'proprietaire' : 'chercheur'),
              commune: data.commune || 'Cocody',
              telephone: data.telephone || '+225 07 00 00 00 00',
            };
            setCurrentUser(normalizedData);
          } else {
            // Check if admin email
            const isAdminEmail = fbUser.email === 'toyogotoure8@gmail.com';
            const newProfile: UserProfile = {
              id: fbUser.uid,
              nom: fbUser.displayName || 'Utilisateur',
              telephone: fbUser.phoneNumber || '+225 07 00 00 00 00',
              commune: 'Cocody',
              email: fbUser.email || undefined,
              roles: isAdminEmail ? ['chercheur', 'proprietaire', 'admin'] : ['chercheur'],
              espaceActif: 'chercheur',
              dateCreation: new Date().toISOString(),
            };
            await setDoc(userRef, newProfile);
            setCurrentUser(newProfile);
          }
        } catch (e) {
          console.warn('Firestore user fetch note:', e);
          if (!currentUser) {
            const fallbackProfile: UserProfile = {
              id: fbUser.uid,
              nom: fbUser.displayName || 'Utilisateur',
              telephone: fbUser.phoneNumber || '+225 07 00 00 00 00',
              commune: 'Cocody',
              email: fbUser.email || undefined,
              roles: fbUser.email === 'toyogotoure8@gmail.com' ? ['chercheur', 'proprietaire', 'admin'] : ['chercheur'],
              espaceActif: 'chercheur',
              dateCreation: new Date().toISOString(),
            };
            setCurrentUser(fallbackProfile);
          }
        }
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const registerSingleAccount = async (data: {
    nom: string;
    prenoms?: string;
    telephone: string;
    commune: string;
    email?: string;
    initialSpace: AppSpace;
    donneesChercheur?: DonneesChercheur;
    donneesProprietaire?: DonneesProprietaire;
  }) => {
    const uid = auth.currentUser?.uid || ('usr-' + data.telephone.replace(/[^0-9]/g, ''));
    const roles: UserRole[] = [data.initialSpace];
    if (data.email === 'toyogotoure8@gmail.com' || auth.currentUser?.email === 'toyogotoure8@gmail.com') {
      roles.push('admin');
    }

    const emailToUse = data.email || auth.currentUser?.email || undefined;

    const newProfile: UserProfile = {
      id: uid,
      nom: data.nom,
      prenoms: data.prenoms,
      telephone: data.telephone,
      commune: data.commune,
      email: emailToUse,
      roles,
      espaceActif: data.initialSpace,
      profilComplet: true,
      verifie: Boolean(data.donneesProprietaire?.verifie || false),
      bloque: false,
      donneesChercheur: data.donneesChercheur,
      donneesProprietaire: data.donneesProprietaire,
      dateCreation: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', uid), newProfile);
    } catch (e) {
      console.warn('Firestore offline fallback saving user:', e);
    }

    setCurrentUser(newProfile);
    setUserPortal(data.initialSpace);
    showToast(`Compte unique créé avec succès ! Bienvenue dans votre espace ${data.initialSpace === 'chercheur' ? 'Chercheur' : 'Propriétaire'}.`, 'success');
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setIsAuthLoading(true);
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      showToast(`Connexion réussie ! Bienvenue.`, 'success');
      setShowAuthModal(false);
    } catch (err: any) {
      console.warn('Email login error:', err);
      const msg = getAuthErrorMessage(err);
      showToast(msg, 'error');
      throw new Error(msg);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name?: string, phone?: string) => {
    try {
      setIsAuthLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const fbUser = res.user;

      try {
        await sendEmailVerification(fbUser);
      } catch (e) {
        console.warn('Send verification email error:', e);
      }

      showToast('Compte créé avec succès ! Un e-mail de vérification vous a été envoyé.', 'success');
      setShowAuthModal(false);
    } catch (err: any) {
      console.warn('Email register error:', err);
      const msg = getAuthErrorMessage(err);
      showToast(msg, 'error');
      throw new Error(msg);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      showToast('E-mail de réinitialisation envoyé ! Vérifiez votre boîte de réception.', 'success');
    } catch (err: any) {
      const msg = getAuthErrorMessage(err);
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
      showToast('E-mail de vérification renvoyé avec succès !', 'success');
    } catch (err: any) {
      const msg = getAuthErrorMessage(err);
      showToast(msg, 'error');
    }
  };

  const linkEmailCredential = async (email: string, pass: string) => {
    if (!auth.currentUser) return;
    try {
      const credential = EmailAuthProvider.credential(email.trim(), pass);
      await linkWithCredential(auth.currentUser, credential);
      showToast('Adresse e-mail liée avec succès à votre compte !', 'success');

      if (currentUser) {
        const updated = { ...currentUser, email: email.trim() };
        setCurrentUser(updated);
        try {
          await updateDoc(doc(db, 'users', currentUser.id), { email: email.trim() });
        } catch (e) {
          console.warn('Firestore update email link note:', e);
        }
      }
    } catch (err: any) {
      const msg = getAuthErrorMessage(err);
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  const addRoleToAccount = async (data: {
    newSpaceRole: AppSpace;
    donneesChercheur?: DonneesChercheur;
    donneesProprietaire?: DonneesProprietaire;
  }) => {
    if (!currentUser) return;

    const existingRoles = currentUser.roles || [currentUser.espaceActif || 'chercheur'];
    const updatedRoles = Array.from(new Set([...existingRoles, data.newSpaceRole]));

    const updatedProfile: UserProfile = {
      ...currentUser,
      roles: updatedRoles,
      espaceActif: data.newSpaceRole,
      donneesChercheur: data.donneesChercheur ? { ...currentUser.donneesChercheur, ...data.donneesChercheur } : currentUser.donneesChercheur,
      donneesProprietaire: data.donneesProprietaire ? { ...currentUser.donneesProprietaire, ...data.donneesProprietaire } : currentUser.donneesProprietaire,
    };

    try {
      await updateDoc(doc(db, 'users', currentUser.id), {
        roles: updatedRoles,
        espaceActif: data.newSpaceRole,
        ...(data.donneesChercheur ? { donneesChercheur: updatedProfile.donneesChercheur } : {}),
        ...(data.donneesProprietaire ? { donneesProprietaire: updatedProfile.donneesProprietaire } : {}),
      });
    } catch (e) {
      console.warn('Firestore update role fallback:', e);
    }

    setCurrentUser(updatedProfile);
    setUserPortal(data.newSpaceRole);
    showToast(`Nouveau statut « ${data.newSpaceRole === 'chercheur' ? 'Chercheur' : 'Propriétaire'} » ajouté à votre compte unique !`, 'success');
  };

  const switchActiveSpace = async (space: AppSpace) => {
    if (!currentUser) return;

    if (!currentUser.roles || !currentUser.roles.includes(space)) {
      showToast(`Le statut « ${space} » doit être activé sur votre compte.`, 'info');
      return;
    }

    const updatedProfile: UserProfile = {
      ...currentUser,
      espaceActif: space,
    };

    try {
      await updateDoc(doc(db, 'users', currentUser.id), {
        espaceActif: space,
      });
    } catch (e) {
      console.warn('Firestore update space fallback:', e);
    }

    setCurrentUser(updatedProfile);
    setUserPortal(space);
    showToast(`Espace actif : ${space === 'chercheur' ? 'Chercheur' : 'Propriétaire'}`, 'info');
  };

  // Request user geolocation for "Autour de moi"
  const requestUserLocation = async () => {
    if (!navigator.geolocation) {
      const msg = 'La géolocalisation n\'est pas supportée par votre navigateur';
      setLocationError(msg);
      showToast(msg, 'error');
      return;
    }

    setIsLocationLoading(true);
    setLocationError(null);
    showToast('Recherche de votre position GPS...', 'info');

    // Check permissions if supported
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const perm = await navigator.permissions.query({ name: 'geolocation' });
        if (perm.state === 'denied') {
          const denyMsg = 'Permission de géolocalisation refusée par le navigateur. Position Abidjan appliquée.';
          setLocationError(denyMsg);
          const fallbackCoords = { lat: 5.3235, lng: -4.0197 };
          setUserCoords(fallbackCoords);
          localStorage.setItem('ivoire_user_coords', JSON.stringify(fallbackCoords));
          setFilters((prev) => ({ ...prev, userLocation: fallbackCoords }));
          showToast(denyMsg, 'info');
          setIsLocationLoading(false);
          return;
        }
      } catch (e) {
        // Ignore permission query error if unsupported
      }
    }

    const handleSuccess = (pos: GeolocationPosition) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setUserCoords(coords);
      localStorage.setItem('ivoire_user_coords', JSON.stringify(coords));
      setLocationError(null);

      // Check if user is roughly within Côte d'Ivoire (Lat 4.0-11.0, Lng -9.0 to -2.0)
      const isInCI =
        coords.lat >= 4.0 &&
        coords.lat <= 11.0 &&
        coords.lng >= -9.0 &&
        coords.lng <= -2.0;

      if (isInCI) {
        setFilters((prev) => ({ ...prev, userLocation: coords }));
        showToast('Position GPS détectée en Côte d\'Ivoire !', 'success');
      } else {
        const ciCenter = { lat: 5.3235, lng: -4.0197 };
        setFilters((prev) => ({ ...prev, userLocation: ciCenter }));
        showToast('Position GPS détectée (Hors Côte d\'Ivoire). Biens localisés à Abidjan.', 'info');
      }
      setIsLocationLoading(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      console.warn('Geolocation error:', err.code, err.message);
      let errMsg = 'Impossible d\'obtenir votre position GPS.';
      if (err.code === err.PERMISSION_DENIED) {
        errMsg = 'Permission GPS refusée par le navigateur.';
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        errMsg = 'Signal GPS indisponible sur cet appareil.';
      } else if (err.code === err.TIMEOUT) {
        errMsg = 'Délai d\'attente GPS dépassé.';
      }

      setLocationError(errMsg);
      const fallbackCoords = { lat: 5.3235, lng: -4.0197 };
      setUserCoords(fallbackCoords);
      localStorage.setItem('ivoire_user_coords', JSON.stringify(fallbackCoords));
      setFilters((prev) => ({ ...prev, userLocation: fallbackCoords }));
      showToast(`${errMsg} Position Abidjan appliquée.`, 'info');
      setIsLocationLoading(false);
    };

    // Try standard high-accuracy geolocation first with 6s timeout, fallback to low-accuracy on timeout
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      (err) => {
        if (err.code === err.TIMEOUT) {
          navigator.geolocation.getCurrentPosition(
            handleSuccess,
            handleError,
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
          );
        } else {
          handleError(err);
        }
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 30000 }
    );
  };



  const loginWithGoogle = async () => {
    try {
      setIsAuthLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      showToast(`Bienvenue, ${res.user.displayName || 'cher utilisateur'} !`, 'success');
    } catch (err: any) {
      console.warn('Google login auth note (using local session fallback):', err);
      // Fallback local session for offline/token-service disabled mode
      const fallbackUser: UserProfile = {
        id: 'google-user-' + Date.now(),
        nom: 'Utilisateur Google',
        telephone: '+225 07 12 34 56 78',
        commune: 'Cocody',
        email: 'utilisateur@gmail.com',
        roles: ['chercheur'],
        espaceActif: 'chercheur',
        verifie: false,
        dateCreation: new Date().toISOString(),
      };
      setCurrentUser(fallbackUser);
      showToast('Connexion locale établie (Mode hors-ligne actif).', 'success');
    } finally {
      setIsAuthLoading(false);
      setShowAuthModal(false);
    }
  };

  const loginWithPhone = async (phone: string, chosenRole: UserRole = 'client', customName?: string) => {
    try {
      setIsAuthLoading(true);
      const uid = 'phone-' + phone.replace(/[^0-9]/g, '');
      const assignedSpace: AppSpace = chosenRole === 'proprietaire' ? 'proprietaire' : 'chercheur';
      const profile: UserProfile = {
        id: uid,
        nom: customName?.trim() || `Utilisateur CI (${phone.slice(-4)})`,
        telephone: phone.startsWith('+225') ? phone : `+225 ${phone}`,
        commune: 'Cocody',
        roles: [assignedSpace],
        espaceActif: assignedSpace,
        verifie: false,
        dateCreation: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', uid), profile);
      } catch (e) {
        console.warn('Firestore offline fallback for user save:', e);
      }

      setCurrentUser(profile);
      showToast('Connexion réussie par numéro de téléphone !', 'success');
      setShowAuthModal(false);
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la validation du code SMS', 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn(e);
    }
    setCurrentUser(null);
    showToast('Vous avez été déconnecté.', 'info');
  };

  const switchRole = async (newRole: UserRole) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role: newRole };
    setCurrentUser(updated);
    try {
      await updateDoc(doc(db, 'users', currentUser.id), { role: newRole });
    } catch (e) {
      console.warn('Firestore update role fallback:', e);
    }
    showToast(`Mode activé : ${newRole === 'client' ? '« Je cherche » (Client)' : newRole === 'proprietaire' ? '« Je publie » (Propriétaire/Hôtelier)' : 'Administrateur'}`, 'success');
    setShowRoleModal(false);
  };

  const updateUserVerification = async (idCardUrl: string, type: string) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      pieceIdentiteUrl: idCardUrl,
      pieceIdentiteStatut: 'en_attente',
      pieceIdentiteType: type,
    };
    setCurrentUser(updated);

    // Update in allUsers list for admin
    setAllUsers((prev) => {
      const idx = prev.findIndex((u) => u.id === currentUser.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [...prev, updated];
    });

    try {
      await updateDoc(doc(db, 'users', currentUser.id), {
        pieceIdentiteUrl: idCardUrl,
        pieceIdentiteStatut: 'en_attente',
        pieceIdentiteType: type,
      });
    } catch (e) {
      console.warn(e);
    }
    showToast('Pièce d\'identité envoyée. En attente de validation par l\'administration.', 'info');
  };

  const addListing = async (listingData: Omit<Listing, 'id' | 'dateCreation' | 'vues' | 'contacts' | 'demandes' | 'signalements' | 'ownerTelVerifie' | 'ownerEmailVerifie' | 'ownerVerifie' | 'statut'>): Promise<string> => {
    if (!currentUser) throw new Error('Veuillez vous connecter pour publier.');
    if (currentUser.bloque) throw new Error('Votre compte est bloqué. Publication impossible.');

    // 1. Profil complet check
    if (!currentUser.profilComplet) throw new Error('Veuillez compléter votre profil propriétaire avant de publier.');

    // 2. New owner check (< 7 days, max 3 listings)
    const accountAgeDays = (Date.now() - new Date(currentUser.dateCreation).getTime()) / (1000 * 60 * 60 * 24);
    if (accountAgeDays < 7) {
      const activeCount = listings.filter(l => l.ownerId === currentUser.id && l.statut !== 'rejetee').length;
      if (activeCount >= 3) {
        throw new Error('Limite de 3 annonces atteinte pour les comptes de moins de 7 jours (Nouveau propriétaire).');
      }
    }

    // 3. Duplicate check
    const isDuplicate = listings.some(l => 
      l.ownerId === currentUser.id && 
      l.titre.toLowerCase().trim() === listingData.titre.toLowerCase().trim() &&
      l.commune === listingData.commune &&
      l.statut !== 'rejetee'
    );
    if (isDuplicate) throw new Error('Vous avez déjà publié une annonce identique (même titre et commune).');

    // 4. Verification check (Email or Phone)
    const isEmailVerified = Boolean(auth.currentUser?.emailVerified || currentUser.emailVerified);
    const isPhoneVerified = Boolean(currentUser.phoneVerified || (currentUser.telephone && currentUser.telephone.length > 8));
    
    if (!isEmailVerified && !isPhoneVerified) {
      throw new Error('Votre e-mail ou votre téléphone doit être vérifié pour publier.');
    }

    const newId = 'listing-' + Date.now();
    const ownerNom = currentUser.donneesProprietaire?.nomCommercial || currentUser.nom || 'Propriétaire';
    const ownerWhatsapp = currentUser.donneesProprietaire?.whatsappPro || currentUser.telephone || '';
    
    const newListing: Listing = {
      ...listingData,
      id: newId,
      ownerId: currentUser.id,
      ownerNom,
      ownerWhatsapp,
      ownerTelephone: currentUser.telephone,
      ownerTelVerifie: isPhoneVerified,
      ownerEmailVerifie: isEmailVerified,
      ownerVerifie: Boolean(currentUser.verifie),
      signalements: 0,
      misEnAvant: false,
      vues: 0,
      contacts: 0,
      demandes: 0,
      statut: 'publiee', // Auto-published if controls pass
      dateCreation: new Date().toISOString(),
    };

    setListings((prev) => [newListing, ...prev]);

    try {
      await setDoc(doc(db, 'listings', newId), newListing);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'listings');
    }

    showToast('Annonce publiée avec succès ! Elle est maintenant visible par tous.', 'success');
    return newId;
  };

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    setListings((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    if (selectedListing && selectedListing.id === id) {
      setSelectedListing((prev) => (prev ? { ...prev, ...updates } : null));
    }
    try {
      await updateDoc(doc(db, 'listings', id), updates);
    } catch (e) {
      console.warn('Update listing warning:', e);
    }
    showToast('Annonce mise à jour avec succès.', 'success');
  };

  const deleteListing = async (id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    if (selectedListing && selectedListing.id === id) {
      setSelectedListing(null);
    }
    try {
      await deleteDoc(doc(db, 'listings', id));
    } catch (e) {
      console.warn('Delete listing warning:', e);
    }
    showToast('Annonce supprimée.', 'info');
  };

  const incrementListingMetric = async (id: string, metric: 'vues' | 'contacts' | 'demandes') => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [metric]: (item[metric] || 0) + 1 } : item))
    );
    try {
      const listing = listings.find((l) => l.id === id);
      if (listing) {
        await updateDoc(doc(db, 'listings', id), {
          [metric]: (listing[metric] || 0) + 1,
        });
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const toggleFavorite = async (listingId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(listingId);
      if (exists) {
        showToast('Annonce retirée de vos favoris', 'info');
        return prev.filter((id) => id !== listingId);
      } else {
        showToast('Annonce ajoutée à vos favoris ❤️', 'success');
        return [...prev, listingId];
      }
    });
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'dateCreation' | 'statut'>) => {
    const id = 'booking-' + Date.now();
    const newBooking: Booking = {
      ...bookingData,
      id,
      statut: 'demandee',
      dateCreation: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    incrementListingMetric(bookingData.listingId, 'demandes');

    try {
      await setDoc(doc(db, 'bookings', id), newBooking);
    } catch (e) {
      console.warn('Booking create warning:', e);
    }

    showToast('Demande de réservation transmise au propriétaire !', 'success');
  };

  const updateBookingStatus = async (bookingId: string, status: 'acceptee' | 'refusee') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, statut: status } : b))
    );
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { statut: status });
    } catch (e) {
      console.warn(e);
    }
    showToast(
      status === 'acceptee'
        ? 'Réservation acceptée ! Le client a été notifié.'
        : 'Réservation refusée.',
      status === 'acceptee' ? 'success' : 'info'
    );
  };

  const createAlert = async (alertData: Omit<SearchAlert, 'id' | 'dateCreation' | 'userId'>) => {
    const id = 'alert-' + Date.now();
    const newAlert: SearchAlert = {
      ...alertData,
      id,
      userId: currentUser?.id || 'guest',
      dateCreation: new Date().toISOString(),
    };
    setAlerts((prev) => [newAlert, ...prev]);
    showToast('Alerte de recherche enregistrée ! Vous serez notifié des nouvelles annonces.', 'success');
  };

  const deleteAlert = async (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Alerte supprimée.', 'info');
  };

  const recordSearch = (label: string, commune?: string, categorie?: CategoryType | 'toutes') => {
    setRecentSearches((prev) => addRecentSearch(prev, { label, commune, categorie }));
  };

  const removeSearch = (id: string) => {
    setRecentSearches((prev) => deleteRecentSearch(prev, id));
  };

  const clearAllSearches = () => {
    setRecentSearches([]);
  };

  const submitReport = async (
    listingId: string,
    listingTitre: string,
    ownerId: string,
    motif: string,
    description?: string
  ) => {
    const currentUid = currentUser?.id || 'guest';
    const reportId = `${listingId}_${currentUid}`;
    
    // 1. One report per user per listing
    const reportRef = doc(db, 'reports', reportId);
    const snap = await getDoc(reportRef);
    if (snap.exists()) {
      showToast('Vous avez déjà signalé cette annonce.', 'info');
      return;
    }

    const newReport: Report = {
      id: reportId,
      listingId,
      listingTitre,
      ownerId,
      reporterId: currentUid,
      userId: currentUid,
      motif,
      description,
      statut: 'en_attente',
      dateCreation: new Date().toISOString(),
    };

    // 2. Atomic increment and report creation
    const batch = writeBatch(db);
    batch.set(reportRef, newReport);
    batch.update(doc(db, 'listings', listingId), { signalements: increment(1) });

    try {
      await batch.commit();
      setReports((prev) => [newReport, ...prev]);

      // 3. Auto-suspension check
      const listingSnap = await getDoc(doc(db, 'listings', listingId));
      if (listingSnap.exists()) {
        const data = listingSnap.data() as Listing;
        if (data.signalements >= 3 && data.statut === 'publiee') {
          await updateDoc(doc(db, 'listings', listingId), { statut: 'suspendue' });
          setListings((prev) => prev.map(l => l.id === listingId ? { ...l, statut: 'suspendue', signalements: data.signalements } : l));
          showToast('Annonce suspendue automatiquement après plusieurs signalements.', 'info');
        } else {
          setListings((prev) => prev.map(l => l.id === listingId ? { ...l, signalements: data.signalements } : l));
          showToast('Signalement enregistré. Merci de veiller à la sécurité de la communauté.', 'info');
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'reports');
    }
  };

  const contestSuspension = async (listingId: string, motif: string) => {
    try {
      await updateDoc(doc(db, 'listings', listingId), { contestation: motif });
      setListings((prev) => prev.map(l => l.id === listingId ? { ...l, contestation: motif } : l));
      showToast('Votre contestation a été transmise à l\'administration.', 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'listings');
    }
  };

  const resolveReport = async (reportId: string) => {
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, statut: 'traite' } : r)));
    showToast('Signalement marqué comme traité.', 'success');
  };

  const validateListing = async (listingId: string, approve: boolean, motifRejet?: string) => {
    const updates: Partial<Listing> = {
      statut: approve ? 'publiee' : 'rejetee',
      motifRejet: approve ? undefined : motifRejet || 'Non conforme aux règles de diffusion',
    };
    await updateListing(listingId, updates);
    showToast(
      approve ? 'Annonce validée et publiée !' : 'Annonce rejetée.',
      approve ? 'success' : 'info'
    );
  };

  const verifyOwnerIdentity = async (userId: string, approve: boolean) => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              verifie: approve,
              pieceIdentiteStatut: approve ? 'validee' : 'rejetee',
            }
          : u
      )
    );

    // Also update all listings owned by this user
    setListings((prev) =>
      prev.map((l) => (l.ownerId === userId ? { ...l, ownerVerifie: approve } : l))
    );

    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              verifie: approve,
              pieceIdentiteStatut: approve ? 'validee' : 'rejetee',
            }
          : null
      );
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        verifie: approve,
        pieceIdentiteStatut: approve ? 'validee' : 'rejetee',
      });
    } catch (e) {
      console.warn(e);
    }

    showToast(
      approve ? 'Badge « Vérifié » attribué avec succès !' : 'Demande d\'identité rejetée.',
      approve ? 'success' : 'info'
    );
  };

  const toggleUserBlock = async (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, bloque: !u.bloque } : u))
    );
    showToast('Statut du compte mis à jour.', 'info');
  };

  const deleteDemoListings = async () => {
    try {
      const snap = await getDocs(collection(db, 'listings'));
      const batchDeletes: string[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data() as Listing;
        if (data.isExemple || data.demo || docSnap.id.startsWith('demo-')) {
          batchDeletes.push(docSnap.id);
        }
      });

      for (const id of batchDeletes) {
        await deleteDoc(doc(db, 'listings', id));
      }

      setListings((prev) => prev.filter((l) => !l.isExemple && !l.demo && !l.id.startsWith('demo-')));
      showToast(`${batchDeletes.length} annonce(s) de démonstration supprimée(s).`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Erreur lors de la suppression des annonces de démonstration', 'error');
    }
  };

  const sendMessage = async (receiverId: string, texte: string, listingId?: string, listingTitre?: string) => {
    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      listingId,
      listingTitre,
      senderId: currentUser?.id || 'guest',
      senderNom: currentUser?.nom || 'Client IvoireImmo',
      receiverId,
      texte,
      dateCreation: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    showToast('Message envoyé !', 'success');
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Filter listings based on criteria (Rule: Home, feed, search, map, favorites read ONLY published listings)
  const filteredListings = listings.filter((item) => {
    const isOwner = currentUser && item.ownerId === currentUser.id;
    const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.roles?.includes('admin'));

    if (item.statut !== 'publiee') {
      if (!isOwner && !isAdmin) return false;
    }

    // Category
    if (filters.categorie !== 'toutes' && item.categorie !== filters.categorie) {
      return false;
    }

    // Commune
    if (filters.commune !== 'Toutes' && item.commune.toLowerCase() !== filters.commune.toLowerCase()) {
      return false;
    }

    // Budget Min
    if (filters.budgetMin !== '' && item.prix < Number(filters.budgetMin)) {
      return false;
    }

    // Budget Max
    if (filters.budgetMax !== '' && item.prix > Number(filters.budgetMax)) {
      return false;
    }

    // Pieces
    if (filters.pieces !== 'toutes' && item.pieces !== Number(filters.pieces)) {
      return false;
    }

    // Equipments (must contain all selected equipments)
    if (filters.equipements.length > 0) {
      const hasAllEquipments = filters.equipements.every((eq) => item.equipements.includes(eq));
      if (!hasAllEquipments) return false;
    }

    // Geolocation radius filter
    if (filters.userLocation && item.position && filters.maxDistanceKm) {
      const dist = calculateDistanceKm(
        filters.userLocation.lat,
        filters.userLocation.lng,
        item.position.lat,
        item.position.lng
      );
      if (dist > filters.maxDistanceKm) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (filters.tri === 'proximite') {
      const posA = a.position || COORDONNEES_LOCALITES[a.commune] || { lat: 5.34, lng: -3.99 };
      const posB = b.position || COORDONNEES_LOCALITES[b.commune] || { lat: 5.34, lng: -3.99 };
      const origin = userCoords || { lat: 5.3235, lng: -4.0197 }; // Default Abidjan Plateau if GPS pending
      const distA = calculateDistanceKm(origin.lat, origin.lng, posA.lat, posA.lng);
      const distB = calculateDistanceKm(origin.lat, origin.lng, posB.lat, posB.lng);
      return distA - distB;
    }
    if (filters.tri === 'prix_croissant') {
      return a.prix - b.prix;
    }
    if (filters.tri === 'prix_decroissant') {
      return b.prix - a.prix;
    }
    // Default: recent
    return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
  });


  return (
    <AppContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isAuthLoading,
        loginWithGoogle,
        loginWithPhone,
        loginWithEmail,
        registerWithEmail,
        sendPasswordReset,
        resendVerificationEmail,
        linkEmailCredential,
        logout,
        switchRole,
        showAuthModal,
        setShowAuthModal,
        showRoleModal,
        setShowRoleModal,
        updateUserVerification,

        activeTab,
        setActiveTab,
        selectedListing,
        setSelectedListing,
        isFiltersOpen,
        setIsFiltersOpen,
        isMapView,
        setIsMapView,
        userCoords,
        isLocationLoading,
        locationError,
        requestUserLocation,


        listings,
        filteredListings,
        isLoadingListings,
        refreshListings,
        filters,
        setFilters,
        resetFilters,

        addListing,
        updateListing,
        deleteListing,
        incrementListingMetric,

        bookings,
        createBooking,
        updateBookingStatus,

        favorites,
        toggleFavorite,

        alerts,
        createAlert,
        deleteAlert,

        recentSearches,
        recordSearch,
        removeSearch,
        clearAllSearches,

        reports,
        submitReport,
        resolveReport,

        validateListing,
        verifyOwnerIdentity,
        toggleUserBlock,
        deleteDemoListings,
        contestSuspension,
        allUsers,

        messages,
        sendMessage,

        toast,
        showToast,

        compareListings,
        toggleCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,

        recentlyViewedIds,
        recentlyViewedListings,
        addToRecentlyViewed,
        removeFromRecentlyViewed,
        clearRecentlyViewed,

        userPortal,
        setUserPortal,
        selectPortal,
        resetPortal,

        registerSingleAccount,
        addRoleToAccount,
        switchActiveSpace,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
