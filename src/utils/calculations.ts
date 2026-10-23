/**
 * IvoireImmo - Pure calculation & business logic functions
 */

export interface RentalFeesBreakdown {
  monthlyRent: number;
  firstMonth: number;
  cautionMonths: number;
  cautionAmount: number;
  advanceMonths: number;
  advanceAmount: number;
  totalEstimated: number;
  notice: string;
}

/**
 * Calcule les frais d'entrée pour un contrat de bail d'habitation en Côte d'Ivoire.
 * Selon les usages et la loi ivoirienne :
 * - 1er mois de loyer
 * - 2 mois de caution (dépôt de garantie)
 * - 2 mois d'avance de loyer
 */
export function calculateRentalFees(monthlyRent: number): RentalFeesBreakdown {
  const rent = Math.max(0, Math.round(monthlyRent));
  const cautionMonths = 2;
  const advanceMonths = 2;
  const cautionAmount = rent * cautionMonths;
  const advanceAmount = rent * advanceMonths;
  const totalEstimated = rent + cautionAmount + advanceAmount;

  return {
    monthlyRent: rent,
    firstMonth: rent,
    cautionMonths,
    cautionAmount,
    advanceMonths,
    advanceAmount,
    totalEstimated,
    notice: 'Estimation indicative (1 mois de loyer + 2 mois de caution + 2 mois d\'avance), hors frais éventuels d\'agence.',
  };
}

/**
 * Calcule le nombre de nuits et le montant total pour un séjour en meublé ou hôtel.
 */
export function calculateBookingCost(
  pricePerNight: number,
  checkInDate: string,
  checkOutDate: string
): { nights: number; total: number; valid: boolean; error?: string } {
  if (!checkInDate || !checkOutDate) {
    return { nights: 0, total: 0, valid: false, error: 'Veuillez sélectionner les dates d\'arrivée et de départ' };
  }

  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);

  // Normalize to UTC dates to avoid DST quirks
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return { nights: 0, total: 0, valid: false, error: 'La date de départ doit être postérieure à la date d\'arrivée' };
  }

  const nights = diffDays;
  const total = nights * pricePerNight;

  return { nights, total, valid: true };
}

/**
 * Calcule la distance en kilomètres entre deux coordonnées géographiques (formule de Haversine).
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Formate un montant en Franc CFA (FCFA) avec séparateurs de milliers.
 */
export function formatFCFA(amount: number): string {
  if (isNaN(amount)) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

/**
 * Génère le lien WhatsApp sécurisé avec numéro et message pré-rempli.
 */
export function getWhatsAppLink(phone: string, listingTitle: string, listingPrice: string, listingUrl?: string): string {
  // Nettoyage du numéro
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (!cleanPhone.startsWith('225')) {
    cleanPhone = '225' + cleanPhone;
  }

  const text = `Bonjour, je vous contacte depuis IvoireImmo concernant votre annonce : « ${listingTitle} » (${listingPrice}). Est-elle toujours disponible ? Merci !`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Normalise un numéro d'appel téléphonique ivoirien.
 */
export function formatIvorianPhone(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '');
  if (digits.startsWith('225') && digits.length === 13) {
    // 225 07 00 00 00 00
    const local = digits.slice(3);
    return `+225 ${local.slice(0, 2)} ${local.slice(2, 4)} ${local.slice(4, 6)} ${local.slice(6, 8)} ${local.slice(8, 10)}`;
  }
  if (digits.length === 10) {
    return `+225 ${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  }
  return raw;
}
