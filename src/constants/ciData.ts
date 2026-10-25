import { Listing } from '../types';

export const COMMUNES_ABIDJAN = [
  'Cocody',
  'Marcory',
  'Koumassi',
  'Yopougon',
  'Plateau',
  'Treichville',
  'Abobo',
  'Adjamé',
  'Port-Bouët',
  'Bingerville',
  'Anyama',
  'Songon',
  'Attécoubé',
] as const;

export const AUTRES_VILLES = [
  'Grand-Bassam',
  'Yamoussoukro',
  'Bouaké',
  'San-Pédro',
  'Daloa',
  'Korhogo',
] as const;

export const TOUTES_LOCALITES = [...COMMUNES_ABIDJAN, ...AUTRES_VILLES];

export const COORDONNEES_LOCALITES: Record<string, { lat: number; lng: number }> = {
  // Abidjan
  'Cocody': { lat: 5.3533, lng: -3.9855 },
  'Marcory': { lat: 5.2982, lng: -3.9806 },
  'Koumassi': { lat: 5.2890, lng: -3.9510 },
  'Yopougon': { lat: 5.3489, lng: -4.0872 },
  'Plateau': { lat: 5.3235, lng: -4.0197 },
  'Treichville': { lat: 5.3052, lng: -4.0125 },
  'Abobo': { lat: 5.4167, lng: -4.0167 },
  'Adjamé': { lat: 5.3587, lng: -4.0275 },
  'Port-Bouët': { lat: 5.2588, lng: -3.9478 },
  'Bingerville': { lat: 5.3556, lng: -3.8894 },
  'Anyama': { lat: 5.4947, lng: -4.0519 },
  'Songon': { lat: 5.3167, lng: -4.2667 },
  'Attécoubé': { lat: 5.3347, lng: -4.0436 },
  // Autres villes
  'Grand-Bassam': { lat: 5.2089, lng: -3.7388 },
  'Yamoussoukro': { lat: 6.8276, lng: -5.2893 },
  'Bouaké': { lat: 7.6898, lng: -5.0308 },
  'San-Pédro': { lat: 4.7485, lng: -6.6363 },
  'Daloa': { lat: 6.8774, lng: -6.4502 },
  'Korhogo': { lat: 9.4580, lng: -5.6296 },
};

export const EQUIPEMENTS_LIST = [
  { id: 'eau', label: 'Eau SODECI', icon: 'Droplets' },
  { id: 'electricite', label: 'Électricité CIE', icon: 'Zap' },
  { id: 'climatisation', label: 'Climatisation', icon: 'Wind' },
  { id: 'wifi', label: 'Wi-Fi / Fibre', icon: 'Wifi' },
  { id: 'gardien', label: 'Gardien 24h/7', icon: 'ShieldCheck' },
  { id: 'parking', label: 'Parking sécurisé', icon: 'Car' },
  { id: 'cloture', label: 'Cour clôturée', icon: 'Fence' },
  { id: 'route_bitumee', label: 'Route bitumée', icon: 'Navigation' },
] as const;

export const CATEGORIES_CONFIG = [
  {
    id: 'location',
    nom: 'Location',
    types: ['Chambre', 'Studio', 'Appartement', 'Villa', 'Bureau', 'Magasin'],
    labelPrix: '/mois',
    description: 'Logements et locaux commerciaux à louer à l\'année',
  },
  {
    id: 'vente',
    nom: 'Vente',
    types: ['Maison', 'Villa', 'Appartement', 'Terrain'],
    labelPrix: 'au comptant',
    description: 'Achat de biens immobiliers et terrains avec ACD / Titre foncier',
  },
  {
    id: 'meuble',
    nom: 'Meublé',
    types: ['Studio meublé', 'Appartement meublé', 'Villa meublée', 'Suite'],
    labelPrix: '/nuit',
    description: 'Résidences meublées pour séjours courts et vacances',
  },
  {
    id: 'hotel',
    nom: 'Hôtels',
    types: ['Chambre standard', 'Chambre supérieure', 'Suite', 'Bungalow'],
    labelPrix: '/nuit',
    description: 'Hôtels et resorts touristiques en Côte d\'Ivoire',
  },
] as const;
