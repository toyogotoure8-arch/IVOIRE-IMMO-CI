import { Listing } from '../types';
import { formatFCFA } from './calculations';

/**
 * Génère l'URL publique directe vers une annonce
 */
export function getPublicListingUrl(listingId: string): string {
  const origin = window.location.origin;
  return `${origin}/?annonce=${listingId}`;
}

/**
 * Prépare le message formaté prêt à être partagé sur WhatsApp
 */
export function buildWhatsAppShareText(listing: Listing): string {
  const priceSuffix =
    listing.categorie === 'location'
      ? '/mois'
      : listing.categorie === 'meuble' || listing.categorie === 'hotel'
      ? '/nuit'
      : '';

  const publicUrl = getPublicListingUrl(listing.id);
  const mainPhoto = listing.photos[0] || 'Image indisponible';

  const message = [
    `🏡 *${listing.titre}*`,
    `💰 *Prix :* ${formatFCFA(listing.prix)}${priceSuffix}`,
    `📍 *Quartier :* ${listing.commune} (${listing.quartier})`,
    `📐 *Type :* ${listing.type}${listing.pieces ? ` • ${listing.pieces} pièces` : ''}`,
    ``,
    `🖼️ *Photo :* ${mainPhoto}`,
    ``,
    `🔗 *Voir la fiche complète :*`,
    publicUrl,
    ``,
    `_Découvert sur Ivoire Logement CI 🇨🇮_`
  ].join('\n');

  return message;
}

/**
 * Ouvre directement l'application WhatsApp avec le message pré-rempli
 */
export function shareOnWhatsApp(listing: Listing): void {
  const text = buildWhatsAppShareText(listing);
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Copie le lien ou le résumé dans le presse-papier
 */
export async function copyListingLink(listing: Listing): Promise<boolean> {
  const publicUrl = getPublicListingUrl(listing.id);
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(publicUrl);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Erreur de copie dans le presse-papier:', err);
    return false;
  }
}
