import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  FileCheck2,
  Home,
  Briefcase,
  Building,
  Scale,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export interface FaqItem {
  id: string;
  category: 'location' | 'achat' | 'meuble' | 'securite';
  question: string;
  answer: string;
  lawRef?: string;
  highlights?: string[];
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'caution-avance-plafond',
    category: 'location',
    question: 'Combien de mois de caution et d\'avance un propriétaire a-t-il le droit d\'exiger en Côte d\'Ivoire ?',
    answer:
      'Selon la loi N° 2018-548 du 26 juillet 2018 régissant le bail d\'habitation en Côte d\'Ivoire, le bailleur ne peut pas exiger plus de 2 mois de loyer au titre du dépôt de garantie (caution) et plus de 2 mois de loyer d\'avance. Ainsi, le total exigible au démarrage ne peut dépasser 4 mois de loyer (hors honoraires d\'agence immobilière agréée). Tout montant supérieur est strictement contraire à la loi.',
    lawRef: 'Loi N° 2018-548 du 26 Juillet 2018 (Art. 13 & 14)',
    highlights: ['2 mois de caution max', '2 mois d\'avance max', 'Total maximum : 4 mois de loyer'],
  },
  {
    id: 'frais-agence-bareme',
    category: 'location',
    question: 'A combien s\'élèvent les frais d\'agence immobilière et qui doit les payer ?',
    answer:
      'En Côte d\'Ivoire, la pratique usuelle pour une location d\'habitation est de 1 mois de loyer payé par le futur locataire à la signature du bail au titre des honoraires d\'agence. Il est recommandé de traiter exclusivement avec des agences disposant d\'un agrément du Ministère de la Construction, du Logement et de l\'Urbanisme (MCLU).',
    lawRef: 'Pratique professionnelle agréée MCLU',
    highlights: ['1 mois de loyer pour l\'agence', 'Exiger une carte professionnelle ou reçu officiel'],
  },
  {
    id: 'documents-requis-dossier',
    category: 'location',
    question: 'Quels sont les documents obligatoires requis pour constituer un dossier de location ou d\'achat ?',
    answer:
      'Pour une location d\'habitation en Côte d\'Ivoire :\n1. Pièce d\'identité valide (CNI Ivoirienne, Passeport ou Carte de Résident).\n2. 3 derniers bulletins de salaire ou attestation de travail (ou Registre de Commerce DFC pour les indépendants/commerçants).\n3. Relevé d\'identité bancaire ou justificatif de revenus réguliers.\n\nPour un achat immobilier :\n1. CNI / Passeport valide + Extrait d\'acte de naissance.\n2. Certificat de résidence.\n3. Extrait de contrat de mariage (selon le régime matrimonial).\n4. Justificatif de provenance des fonds transmis sous compte séquestre notariale.',
    lawRef: 'Loi N° 2018-548 & Code du Notariat CI',
    highlights: ['CNI/Passeport valide', '3 bulletins de paie ou Registre de commerce', 'Acte de naissance & Justificatif foncier'],
  },
  {
    id: 'duree-bail-resiliation',
    category: 'location',
    question: 'Quelle est la durée légale du bail d\'habitation et comment résilier le contrat ?',
    answer:
      'Sauf stipulation contraire écrite, le bail d\'habitation est réputé conclu pour une durée de 3 ans ou 1 an renouvelable par tacite reconduction. Le locataire ou le propriétaire peut résilier le contrat en observant un préavis écrit de 3 mois (souvent signifié par acte d\'commissaire de justice / huissier ou lettre recommandée avec accusé de réception).',
    lawRef: 'Loi N° 2018-548 (Art. 20 et suivants)',
    highlights: ['Préavis légal de 3 mois', 'Notification par écrit obligatoire'],
  },
  {
    id: 'restitution-caution',
    category: 'location',
    question: 'Dans quel délai la caution doit-elle être restituée à la fin du contrat ?',
    answer:
      'Le propriétaire dispose d\'un délai maximal de 30 jours (1 mois) après la remise effective des clés et la réalisation de l\'état des lieux de sortie pour restituer la caution. S\'il y a des dégradations constatées au-delà de l\'usure normale, le bailleur peut déduire le coût des réparations, à condition de fournir des devis ou factures justificatifs.',
    lawRef: 'Loi N° 2018-548 (Art. 15)',
    highlights: ['Restitution sous 30 jours', 'État des lieux de sortie obligatoire', 'Justificatifs de réparation requis'],
  },
  {
    id: 'reparations-qui-paie',
    category: 'location',
    question: 'Qui prend en charge les gros travaux et les réparations dans le logement ?',
    answer:
      'Le propriétaire a l\'obligation de délivrer un logement en bon état d\'usage et d\'assumer les grosses réparations (étanchéité, toiture, structure des murs, fissures majeures, canalisations principales). Le locataire prend en charge l\'entretien courant (remplacement des ampoules, joints de robinets, entretien des serrures) et les réparations découlant de dégradations occasionnées pendant son occupation.',
    highlights: ['Grosses réparations : Propriétaire', 'Entretien courant : Locataire'],
  },
  {
    id: 'acd-titre-foncier-difference',
    category: 'achat',
    question: 'Qu\'est-ce que l\'ACD (Arrêté de Concession Définitive) et pourquoi est-il indispensable ?',
    answer:
      'L\'ACD est le seul document officiel délivré par le Ministère de la Construction (MCLU) qui confère la pleine propriété inattaquable sur un terrain ou un immeuble urbain en Côte d\'Ivoire. Sans ACD ou Titre Foncier (TF) immatriculé au Livre Foncier, vous ne possédez pas juridiquement le terrain aux yeux de l\'État.',
    lawRef: 'Décret N° 2013-481 relatif à l\'ACD',
    highlights: ['Titre officiel inattaquable', 'Délivré par le MCLU', 'Garantie bancaire & notariale'],
  },
  {
    id: 'attestation-villageoise-danger',
    category: 'achat',
    question: 'Peut-on acheter en toute sécurité un terrain sous simple Attestation Villageoise ?',
    answer:
      'ATTENTION DANGER : Une attestation villageoise (ou attestation d\'attribution coutumière) n\'est PAS un titre de propriété définitif. Elle indique simplement qu\'une communauté villageoise vous attribue un lot. Avant d\'effectuer tout paiement conséquent, vérifiez que le lotissement est approuvé au Journal Officiel et engagez immédiatement la procédure d\'ACD. N\'achetez jamais sans passer par une vérification approfondie auprès de la Conservation Foncière ou d\'un Notaire.',
    lawRef: 'Mise en garde du Ministère de la Construction (MCLU)',
    highlights: ['Non constitutif de propriété', 'Risque élevé de litige / double vente', 'Demander l\'arrêté d\'approbation du lotissement'],
  },
  {
    id: 'role-obligatoire-notaire',
    category: 'achat',
    question: 'Le recours à un Notaire est-il obligatoire pour acheter un bien immobilier ?',
    answer:
      'OUI, en Côte d\'Ivoire, l\'intervention d\'un Notaire est légalement OBLIGATOIRE pour toute transaction portant sur un bien immobilier immatriculé. Le notaire effectue les recherches d\'état foncier (vérifie l\'absence d\'hypothèques ou de saisis), rédige l\'acte authentique de vente et enregistre la mutation à la Conservation Foncière.',
    lawRef: 'Code Général des Impôts & Réglementation Notariale CI',
    highlights: ['Obligation légale', 'Sécurisation des fonds sous compte séquestre', 'Vérification des charges foncières'],
  },
  {
    id: 'meuble-airbnb-reglementation',
    category: 'meuble',
    question: 'Quelles sont les obligations pour la location meublée de courte durée (Résidence Hôtelière) ?',
    answer:
      'Les résidences meublées et meublés de tourisme doivent offrir un logement entièrement équipé et répondre aux normes de sécurité et d\'hygiène. Pour les séjours, un contrat de location saisonnière ou un récépissé de réservation avec pièce d\'identité est recommandé. Les propriétaires doivent déclarer leur activité touristique et s\'acquitter de la taxe de séjour de la commune.',
    highlights: ['Équipements complets', 'Présentation de pièce d\'identité requise', 'Reçu de paiement obligatoire'],
  },
  {
    id: 'bail-commercial-ohada',
    category: 'meuble',
    question: 'Comment fonctionne le bail commercial pour un magasin ou un bureau (Droit OHADA) ?',
    answer:
      'Le bail commercial en Côte d\'Ivoire est régi par l\'Acte Uniforme OHADA portant droit commercial général. Le locataire commerçant qui occupe les lieux depuis plus de 2 ans bénéficie du droit au renouvellement de son bail. Un pas-de-porte ou droit au bail peut être négocié contractuellement.',
    lawRef: 'Acte Uniforme OHADA (Art. 101 à 134)',
    highlights: ['Protection du fonds de commerce', 'Droit au renouvellement après 2 ans', 'Encadrement strict des révisions de loyer'],
  },
  {
    id: 'securisation-transactions-mobile-money',
    category: 'securite',
    question: 'Comment sécuriser les paiements d\'acomptes et de loyers (Mobile Money & Comptes Séquestres) ?',
    answer:
      'Pour sécuriser l\'ensemble de vos transactions immobilières en Côte d\'Ivoire :\n1. Ne faites AUCUN virement Mobile Money (Wave, Orange Money, MTN MoMo, Moov) avant d\'avoir visité le bien physiquement et contrôlé la pièce d\'identité du bailleur ou la carte d\'agrément de l\'agence.\n2. Exigez un reçu de paiement daté, signé et tamponné spécifiant la désignation exacte du bien et l\'objet du versment.\n3. Pour une réservation d\'hôtel ou de meublé, privilégiez le paiement sécurisé en ligne ou l\'acompte tracé par Mobile Money CinetPay.\n4. Pour un achat immobilier ou foncier, utilisez EXCLUSIVEMENT le compte séquestre ouvert auprès de l\'étude du Notaire instrumentaire.',
    lawRef: 'Protocole de Sécurisation IvoireImmo & Notariat CI',
    highlights: ['Visite physique préalable obligatoire', 'Reçu écrit obligatoire', 'Compte séquestre notarial pour achat'],
  },
  {
    id: 'arnaques-frais-visite-visite-payante',
    category: 'securite',
    question: 'Comment se protéger des arnaques immobilières et des démarcheurs frauduleux ?',
    answer:
      '1. Ne donnez JAMAIS d\'argent avant d\'avoir visité physiquement le logement en présence du bailleur ou de l\'agent habilité.\n2. Exigez la carte d\'identité du bailleur ou l\'agrément de l\'agence.\n3. Ne payez pas de "frais de visite" exhorbitants (les frais raisonnables de carburant/déplacement ne doivent jamais dépasser 2 000 à 5 000 FCFA max et donner lieu à un reçu).\n4. Payez vos acomptes ou loyers via des moyens traçables (Chèque, Virement ou Mobile Money Wave/Orange/MTN avec reçu officiel).',
    lawRef: 'Alertes de sécurité ImmoCI',
    highlights: ['Jamais de paiement sans visite', 'Exiger une pièce d\'identité', 'Exiger un reçu récapitulatif'],
  },
  {
    id: 'signalement-annonce-suspecte',
    category: 'securite',
    question: 'Que se passe-t-il lorsque je signale une annonce sur ImmoCI ?',
    answer:
      'Lorsque vous cliquez sur "Signaler cette annonce" (motif : arnaque, bien déjà loué, prix mensonger, photos volées), l\'équipe de modération analyse l\'annonce en priorité. Dès que 3 annonces d\'un même propriétaire sont signalées pour motif sérieux, son compte est automatiquement suspendu dans l\'attente d\'une vérification approfondie de son identité et des titres du bien.',
    highlights: ['Modération prioritaire', 'Suspension automatique dès 3 signalements', 'Protection de la communauté'],
  },
];

export const FaqImmobilierSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'location' | 'achat' | 'meuble' | 'securite'>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'caution-avance-plafond': true, // Open first item by default for quick discovery
    'acd-titre-foncier-difference': true,
  });

  const toggleAccordion = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        (item.lawRef && item.lawRef.toLowerCase().includes(query)) ||
        item.highlights?.some((h) => h.toLowerCase().includes(query));

      return matchCategory && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0F6B3F] via-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-extrabold backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Guide Juridique & Réglementation CI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            FAQ Immobilier Côte d'Ivoire
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Toutes les réponses officielles et pratiques sur les loyers (Loi 2018-548), la caution maximale, les démarches d'ACD / Titre Foncier, les bails meublés et les règles de sécurité anti-arnaque à Abidjan et à l'intérieur.
          </p>

          {/* Quick Stat Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-amber-300 font-black text-base sm:text-lg block">2+2 mois</span>
              <span className="text-[11px] text-emerald-100">Plafond légal Caution & Avance</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-amber-300 font-black text-base sm:text-lg block">ACD Officiel</span>
              <span className="text-[11px] text-emerald-100">Titre définitif MCLU</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-amber-300 font-black text-base sm:text-lg block">Notaire</span>
              <span className="text-[11px] text-emerald-100">Acte de vente obligatoire</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-amber-300 font-black text-base sm:text-lg block">Anti-Arnaque</span>
              <span className="text-[11px] text-emerald-100">Suspension dès 3 signalements</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white dark:bg-[#16261c] rounded-3xl p-4 sm:p-5 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une question (ex: caution, avance, ACD, notaire, travaux, résiliation...)"
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#1f3327] border border-gray-200 dark:border-gray-700 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F6B3F] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-[#0F6B3F] text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Toutes les questions ({FAQ_DATA.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('location')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'location'
                ? 'bg-[#0F6B3F] text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Location & Loyers</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('achat')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'achat'
                ? 'bg-[#0F6B3F] text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Achat & Foncier (ACD)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('meuble')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'meuble'
                ? 'bg-[#0F6B3F] text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Meublés & Commercial</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('securite')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'securite'
                ? 'bg-[#0F6B3F] text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Sécurité & Anti-arnaque</span>
          </button>
        </div>
      </div>

      {/* Accordion FAQ Items List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white dark:bg-[#16261c] rounded-3xl p-8 text-center border border-dashed border-gray-300 dark:border-gray-800 space-y-3">
            <HelpCircle className="w-10 h-10 text-gray-400 mx-auto" />
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
              Aucun résultat pour "{searchQuery}"
            </h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Essayez avec un autre mot-clé comme "caution", "ACD", "notaire" ou modifiez la catégorie sélectionnée.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-[#0F6B3F] text-white text-xs font-extrabold rounded-xl shadow"
            >
              Voir toutes les questions
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = !!openItems[faq.id];

            return (
              <div
                key={faq.id}
                className={`bg-white dark:bg-[#16261c] rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#0F6B3F] shadow-sm'
                    : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 focus:outline-none"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          faq.category === 'location'
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                            : faq.category === 'achat'
                            ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                            : faq.category === 'meuble'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {faq.category === 'location'
                          ? 'Bail & Loyer'
                          : faq.category === 'achat'
                          ? 'Achat & Foncier'
                          : faq.category === 'meuble'
                          ? 'Meublé / Commercial'
                          : 'Sécurité Anti-Arnaque'}
                      </span>

                      {faq.lawRef && (
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-600/20 flex items-center gap-1">
                          <Scale className="w-3 h-3" />
                          <span>{faq.lawRef}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`p-1.5 rounded-xl transition-all shrink-0 ${
                      isOpen
                        ? 'bg-[#0F6B3F] text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}
                  >
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Accordion Expanded Content */}
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-gray-100 dark:border-gray-800/80 space-y-4 animate-in fade-in slide-in-from-top-1 duration-150">
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>

                    {/* Highlights Badges */}
                    {faq.highlights && faq.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {faq.highlights.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-[11px] font-bold border border-emerald-600/20"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#0F6B3F] shrink-0" />
                            <span>{item}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Legal Disclaimer & Emergency Support Box */}
      <div className="bg-amber-50/80 dark:bg-amber-950/30 rounded-3xl p-5 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-xs sm:text-sm text-amber-900 dark:text-amber-200">
              Besoin d'un conseil juridique ou d'un signalement urgent ?
            </h4>
            <p className="text-[11px] sm:text-xs text-amber-800/80 dark:text-amber-300/80 leading-normal">
              Ce guide est fourni à titre d'information légale générale selon le droit ivoirien. Pour tout litige complexe, consultez le Ministère de la Construction (MCLU) ou un Notaire inscrit à la Chambre des Notaires de Côte d'Ivoire.
            </p>
          </div>
        </div>

        <a
          href="tel:+2250700000000"
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-2xl shadow flex items-center gap-1.5 shrink-0 active:scale-95 transition-all self-end sm:self-auto"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Assistance ImmoCI</span>
        </a>
      </div>
    </div>
  );
};
