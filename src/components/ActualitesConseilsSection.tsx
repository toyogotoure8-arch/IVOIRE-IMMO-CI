import React, { useState } from 'react';
import {
  Newspaper,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Share2,
  Bookmark,
  Building,
  TrendingUp,
} from 'lucide-react';

interface BlogArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  excerpt: string;
  content: string[];
  author: string;
}

const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'actu-1',
    title: 'Évolution des prix de l\'immobilier à Abidjan : Cocody vs Yopougon en 2026',
    category: 'Marché Immobilier',
    readTime: '4 min de lecture',
    date: '22 Octobre 2026',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Analyse détaillée des tendances locatives et des prix d\'achat dans les communes phares d\'Abidjan avec l\'extension du métro et des nouvelles voiries.',
    author: 'Kouassi M., Analyste Immobilier CI',
    content: [
      'Le marché immobilier à Abidjan continue sa transformation rapide portée par les grands projets d\'infrastructure urbaine. À Cocody, des quartiers comme la Riviera Golf, Angré et M’Badon affirment leur positionnement haut standing avec une demande soutenue pour les appartements meublés et les villas duplex.',
      'Parallèlement, Yopougon et Abobo connaissent un boom remarquable grâce à l\'achèvement des travaux de transport et l\'amélioration de la voirie. Les studios et appartements de 2 à 3 pièces y attirent une classe moyenne active à la recherche de rapports qualité-prix attractifs.',
      'Que vous soyez investisseur ou primo-accédant, comprendre ces dynamiques locales est essentiel pour optimiser votre rentabilité locative ou votre projet d\'acquisition.',
    ],
  },
  {
    id: 'actu-2',
    title: 'Guide pratique : Obtenir son ACD en Côte d\'Ivoire en toute sécurité',
    category: 'Juridique & Foncier',
    readTime: '5 min de lecture',
    date: '18 Octobre 2026',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Tout ce qu\'il faut savoir sur l\'Arrêté de Concession Définitive (ACD), les vérifications cadastrales et comment sécuriser l\'achat de son terrain.',
    author: 'Maître G. B., Notaire Associé',
    content: [
      'L\'Arrêté de Concession Définitive (ACD) reste le titre de propriété incontournable pour sécuriser un terrain ou un bien immobilier en Côte d\'Ivoire. Malheureusement, les litiges fonciers et doubles ventes persistent dans certaines zones périurbaines.',
      'Avant de verser le moindre acompte, il est impératif d\'exiger un certificat de non-litige et de vérifier l\'authenticité du dossier technique auprès du Ministère de la Construction et du Logement.',
      'Grâce aux plateformes numériques et aux cabinets notariaux agréés, les délais de vérification se sont considérablement raccourcis, garantissant une sérénité totale aux acquéreurs.',
    ],
  },
  {
    id: 'actu-3',
    title: 'Location meublée vs Location annuelle : Quel choix pour votre bien ?',
    category: 'Investissement Locatif',
    readTime: '3 min de lecture',
    date: '15 Octobre 2026',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Comparatif chiffré des revenus locatifs entre la location classique à l\'année et les résidences meublées touristiques à Marcory Zone 4 et au Plateau.',
    author: 'Aminata D., Gestionnaire Immobilière',
    content: [
      'Le choix entre location annuelle classique et location meublée dépend essentiellement de l\'emplacement de votre bien et de votre gestion du temps.',
      'La location meublée (ou studio de tourisme) génère des revenus mensuels bruts souvent supérieurs de 40% à 70% par rapport à une location vide, mais requiert une attention accrue sur l\'entretien, le linge et le service client.',
      'À l\'inverse, la location annuelle offre une stabilité financière à long terme avec moins de rotation de locataires et des charges d\'exploitation réduites.',
    ],
  },
];

export const ActualitesConseilsSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white dark:bg-[#16261c] rounded-3xl p-5 sm:p-6 border border-gray-200/80 dark:border-gray-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#0F6B3F]/10 text-[#0F6B3F] dark:text-[#34D399]">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              Actualités & Conseils Immobiliers
            </h3>
            <p className="text-xs text-gray-500">
              Articles d'experts, tendances du marché et décryptages juridiques en Côte d'Ivoire.
            </p>
          </div>
        </div>

        {selectedArticle && (
          <button
            type="button"
            onClick={() => setSelectedArticle(null)}
            className="text-xs font-bold text-[#0F6B3F] dark:text-[#34D399] hover:underline"
          >
            ← Retour à la liste
          </button>
        )}
      </div>

      {selectedArticle ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden shadow-sm">
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#0F6B3F] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
              {selectedArticle.category}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#F28C1B]" />
                {selectedArticle.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0F6B3F]" />
                {selectedArticle.readTime}
              </span>
              <span>Par {selectedArticle.author}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              {selectedArticle.title}
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {selectedArticle.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="bg-[#F2F6F0] dark:bg-[#1a2d22] p-4 rounded-2xl border border-[#0F6B3F]/20 flex items-center justify-between">
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
              Cet article vous a été utile ? Partagez-le avec vos proches.
            </div>
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: selectedArticle.title, url: window.location.href });
                } else {
                  alert('Lien copié dans le presse-papier !');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0F6B3F] text-white rounded-xl text-xs font-bold shadow"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Partager</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold shadow"
            >
              ← Voir tous les articles d'actualités
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BLOG_ARTICLES.map((article) => {
            const isBookmarked = bookmarkedIds.includes(article.id);
            return (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group bg-[#F2F6F0] dark:bg-[#1a2d22] hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 rounded-2xl border border-gray-200/80 dark:border-gray-800 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#0F6B3F] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
                      {article.category}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(article.id, e)}
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md shadow transition-colors ${
                        isBookmarked
                          ? 'bg-[#F28C1B] text-white'
                          : 'bg-white/80 dark:bg-black/60 text-gray-700 dark:text-gray-300 hover:text-[#F28C1B]'
                      }`}
                      title={isBookmarked ? 'Retirer des favoris' : 'Sauvegarder'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#F28C1B]" />
                        {article.date}
                      </span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h4 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-[#0F6B3F] dark:group-hover:text-[#34D399] transition-colors line-clamp-2">
                      {article.title}
                    </h4>

                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between text-xs font-bold text-[#0F6B3F] dark:text-[#34D399]">
                  <span>Lire l'article complet</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
