/**
 * Configuration CinetPay pour le paiement Mobile Money (Wave, Orange Money, MTN MoMo, Moov Money)
 * 
 * REMARQUE CRITIQUE DE SÉCURITÉ :
 * Les identifiants ci-dessous doivent être complétés avec vos clés CinetPay officielles.
 * Conservez ces valeurs confidentielles et ne les soumettez jamais dans un dépôt public.
 */

export const CINETPAY_CONFIG = {
  // Clé API fournie par le guichet CinetPay
  apiKey: process.env.VITE_CINETPAY_API_KEY || '1234567890abcdef12345678.12345678', // À renseigner

  // ID de votre site marchand sur CinetPay
  siteId: process.env.VITE_CINETPAY_SITE_ID || '1234567', // À renseigner

  // Clé secrète CinetPay pour la signature et validation HMAC
  secretKey: process.env.VITE_CINETPAY_SECRET_KEY || 'cinetpay_secret_key_to_replace', // À renseigner

  // URL de notification webhook (ipn)
  notifyUrl: 'https://mon-domaine.ci/api/cinetpay-webhook',

  // Devise par défaut pour la Côte d'Ivoire
  currency: 'XOF', // Franc CFA BCEAO

  // Mode de fonctionnement ('TEST' ou 'PRODUCTION')
  mode: 'TEST',
};

/** Offres de mise en avant d'annonces (Boost Propriétaire) */
export interface PromotionOffer {
  id: 'boost_7' | 'boost_30';
  title: string;
  durationDays: number;
  priceFCFA: number;
  badge: string;
  description: string;
  features: string[];
}

export const PROMOTION_OFFERS: PromotionOffer[] = [
  {
    id: 'boost_7',
    title: 'Boost 7 Jours',
    durationDays: 7,
    priceFCFA: 5000,
    badge: 'Populaire',
    description: 'Placez votre annonce en haut des recherches pendant 1 semaine',
    features: [
      'Visibilité x5 sur la page d\'accueil',
      'Badge « Annonce sponsorisée »',
      'Affichage prioritaire sur la carte interactive',
      'Statistiques de vues quotidiennes',
    ],
  },
  {
    id: 'boost_30',
    title: 'Boost 30 Jours',
    durationDays: 30,
    priceFCFA: 15000,
    badge: 'Meilleure Valeur',
    description: 'Visibilité maximale durant un mois complet pour louer ou vendre rapidement',
    features: [
      'Top position permanente pendant 30 jours',
      'Badge « Annonce sponsorisée + Vérifiée »',
      'Relance automatique sur les alertes acheteurs',
      'Support prioritaire Ivoire Logement',
    ],
  },
];

/** Offres d'abonnement professionnel pour agences immobilières et hôteliers */
export interface SubscriptionOffer {
  id: 'sub_agency' | 'sub_hotel';
  title: string;
  target: 'Agence Immobilière' | 'Hôtel & Résidence';
  priceFCFA: number;
  period: 'mois';
  features: string[];
}

export const SUBSCRIPTION_OFFERS: SubscriptionOffer[] = [
  {
    id: 'sub_agency',
    title: 'Pack Agence Pro',
    target: 'Agence Immobilière',
    priceFCFA: 25000,
    period: 'mois',
    features: [
      'Jusqu\'à 50 annonces simultanées',
      'Logo de l\'agence sur toutes les annonces',
      'Statistiques de performance d\'agence',
      'Badges certifiés "Agence Agréée"',
      'Export PDF des fiches de visite',
    ],
  },
  {
    id: 'sub_hotel',
    title: 'Pack Hôtelier Premium',
    target: 'Hôtel & Résidence',
    priceFCFA: 45000,
    period: 'mois',
    features: [
      'Annonces illimitées (Chambres & Suites)',
      'Module de réservation directe en ligne avec acompte',
      'Gestionnaire de calendrier d\'occupation',
      'Encaissement Mobile Money automatisé',
      'Support dédié 7j/7',
    ],
  },
];

/** Canaux de paiement Mobile Money disponibles via CinetPay en Côte d'Ivoire */
export interface MobileMoneyChannel {
  id: 'WAVE' | 'OM' | 'MOMO' | 'MOOV';
  name: string;
  code: string;
  logoUrl: string;
  color: string;
  instruction: string;
}

export const MOBILE_MONEY_CHANNELS: MobileMoneyChannel[] = [
  {
    id: 'WAVE',
    name: 'Wave Côte d\'Ivoire',
    code: 'WAVE_CI',
    logoUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=120&q=80',
    color: 'bg-sky-500 text-white',
    instruction: 'Paiement direct sans frais via l\'application Wave',
  },
  {
    id: 'OM',
    name: 'Orange Money CI',
    code: 'OM_CI',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    color: 'bg-amber-500 text-white',
    instruction: 'Composez le #144# ou validez la demande sur Orange Money',
  },
  {
    id: 'MOMO',
    name: 'MTN MoMo',
    code: 'MOMO_CI',
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80',
    color: 'bg-yellow-400 text-black',
    instruction: 'Composez le *133# pour valider la transaction MTN MoMo',
  },
  {
    id: 'MOOV',
    name: 'Moov Money',
    code: 'MOOV_CI',
    logoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=120&q=80',
    color: 'bg-blue-600 text-white',
    instruction: 'Validez la demande sur votre compte Moov Money',
  },
];
