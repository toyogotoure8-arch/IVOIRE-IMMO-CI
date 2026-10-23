import React, { useState } from 'react';
import {
  BookOpen,
  Eye,
  Camera,
  CalendarCheck,
  ShieldCheck,
  CheckCircle2,
  Lightbulb,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface GuideArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  content: string[];
  tips: string[];
}

const GUIDE_ARTICLES: GuideArticle[] = [
  {
    id: 'visibilite',
    title: 'Comment maximiser la visibilité de vos annonces en Côte d’Ivoire',
    category: 'Visibilité & Performance',
    readTime: '3 min de lecture',
    icon: TrendingUp,
    summary: 'Découvrez les meilleures pratiques pour faire ressortir vos biens immobiliers et attirer rapidement des locataires ou acheteurs qualifiés à Abidjan et à l’intérieur du pays.',
    content: [
      'Le marché immobilier ivoirien est très dynamique, notamment à Cocody, Marcory, Yopougon et dans les zones en forte expansion comme Bingerville et Grand-Bassam. Pour que votre bien se démarque parmi des centaines d\'annonces, la précision et la complétude des informations sont primordiales.',
      'Renseignez toujours avec exactitude la commune, le quartier précis (ex: Angré 8e Tranche, Zone 4, Riviera Golf), le nombre de pièces exact ainsi que le loyer mensuel charges comprises ou le prix de vente net.',
      'Activez le badge « Propriétaire Vérifié » en soumettant votre pièce d\'identité : cela inspire immédiatement confiance aux futurs locataires qui évitent les fausses annonces.',
    ],
    tips: [
      'Utilisez un titre descriptif et accrocheur (ex: « Superbe Appartement 3 pièces meublé avec piscine à Marcory Zone 4 »).',
      'Mettez en avant les équipements indispensables en Côte d’Ivoire : eau SODECI, électricité CIE, climatisation et groupe électrogène si disponible.',
      'Profitez des options de boost mobile money pour placer votre bien en tête de liste pendant 7 ou 30 jours.',
    ],
  },
  {
    id: 'photos',
    title: 'Guide photo : Préparer et photographier son bien pour séduire',
    category: 'Photographie & Présentation',
    readTime: '4 min de lecture',
    icon: Camera,
    summary: 'Les annonces avec des photos lumineuses, nettes et professionnelles génèrent jusqu’à 4 fois plus de contacts et de demandes de visite.',
    content: [
      'La photo est le tout premier contact visuel qu\'un client a avec votre maison, studio ou terrain. Des photos sombres ou floues font fuir les prospects les plus sérieux.',
      'Rangez et désencombrez soigneusement chaque pièce avant la prise de vue. Ouvrez grand les rideaux et les volets pour faire entrer un maximum de lumière naturelle.',
      'Prenez les photos en format paysage (horizontal), en vous positionnant dans les coins de la pièce pour donner une impression d\'espace et de profondeur.',
    ],
    tips: [
      'Photographiez chaque espace clé : le salon, la cuisine équipée, les chambres, les salles d\'eau et l\'extérieur (cour, parking, façade).',
      'Évitez d\'utiliser le flash de nuit si l’éclairage intérieur est insuffisant ; privilégiez les heures ensoleillées de la journée.',
      'Ajoutez au moins 4 à 6 photos variées pour rassurer pleinement l\'acquéreur ou le locataire potentiel.',
    ],
  },
  {
    id: 'reservations',
    title: 'Gérer efficacement les demandes de réservation et les visites',
    category: 'Relation Client & Gestion',
    readTime: '3 min de lecture',
    icon: CalendarCheck,
    summary: 'Réactivité, clarté dans les conditions de location et formalisation des acomptes : les clés d’une gestion locative sereine et professionnelle.',
    content: [
      'Sur Ivoire Logement, les clients et voyageurs vous contactent directement par téléphone ou via WhatsApp. La rapidité de votre réponse est déterminante pour conclure une location ou une réservation de meublé.',
      'Pour les meublés et séjours hôteliers, utilisez le système d\'acompte sécurisé CinetPay pour bloquer fermement les dates et éviter les faux bons plans de dernière minute.',
      'Préparez toujours les visites à l\'avance en informant les potentiels locataires des exigences locales (caution, avance sur loyer, frais d\'agence s\'il y a lieu).',
    ],
    tips: [
      'Répondez aux messages WhatsApp dans l\'heure qui suit pour maintenir l\'intérêt du prospect.',
      'Exigez un reçu écrit et signé pour tout versement d\'arrhes ou d\'acompte de réservation.',
      'Mettez à jour le statut de votre bien dès qu\'il est loué ou vendu pour éviter les appels superflus.',
    ],
  },
];

export const OwnerPromoterGuideSection: React.FC = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const selectedArticle = GUIDE_ARTICLES.find((a) => a.id === selectedArticleId);

  return (
    <div className="bg-white dark:bg-[#16261c] rounded-3xl p-5 sm:p-6 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#0F6B3F]/10 text-[#0F6B3F] dark:text-[#34D399]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              Guide des Propriétaires et Promoteurs
            </h3>
            <p className="text-xs text-gray-500">
              Conseils pratiques et astuces pour réussir vos locations et ventes immobilières en Côte d'Ivoire.
            </p>
          </div>
        </div>

        {selectedArticleId && (
          <button
            type="button"
            onClick={() => setSelectedArticleId(null)}
            className="text-xs font-bold text-[#0F6B3F] dark:text-[#34D399] hover:underline"
          >
            ← Retour aux articles
          </button>
        )}
      </div>

      {selectedArticle ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F28C1B] bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full">
              {selectedArticle.category} • {selectedArticle.readTime}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              {selectedArticle.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
              {selectedArticle.summary}
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {selectedArticle.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="bg-[#F2F6F0] dark:bg-[#1a2d22] p-5 rounded-2xl border border-[#0F6B3F]/20 space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm text-[#0F6B3F] dark:text-[#34D399]">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Conseils d'expert Ivoire Logement :</span>
            </div>
            <ul className="space-y-2">
              {selectedArticle.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#0F6B3F] dark:text-[#34D399] shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSelectedArticleId(null)}
              className="px-5 py-2.5 rounded-xl bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold shadow"
            >
              Fermer et voir les autres guides
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {GUIDE_ARTICLES.map((article) => {
            const Icon = article.icon;
            return (
              <div
                key={article.id}
                onClick={() => setSelectedArticleId(article.id)}
                className="group bg-[#F2F6F0] dark:bg-[#1a2d22] hover:bg-emerald-50 dark:hover:bg-emerald-950/50 p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800 text-[#0F6B3F] dark:text-[#34D399] shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">
                      {article.readTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold text-[#F28C1B] uppercase">
                      {article.category}
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white mt-1 group-hover:text-[#0F6B3F] dark:group-hover:text-[#34D399] transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {article.summary}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#0F6B3F] dark:text-[#34D399] pt-2 border-t border-gray-200/50 dark:border-gray-800">
                  <span>Lire l'article</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
