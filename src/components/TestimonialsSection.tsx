import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  Quote,
  CheckCircle2,
  Building,
  PlusCircle,
  ThumbsUp,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  propertyType: string;
  verified: boolean;
  avatarBg: string;
}

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Christian Kouassi',
    role: 'Locataire (Famille)',
    location: 'Cocody Angré 8e Tranche',
    rating: 5,
    date: 'Il y a 3 jours',
    comment:
      'J’ai trouvé mon appartement 3 pièces en seulement 48 heures. Ce que j’ai le plus apprécié, c’est la transparence sur les frais d’agence et les conseils anti-arnaque très clairs.',
    propertyType: 'Appartement 3 pièces',
    verified: true,
    avatarBg: 'bg-emerald-600',
  },
  {
    id: 'test-2',
    name: 'Aïcha Diomandé',
    role: 'Bailleur & Résidences Meublées',
    location: 'Marcory Zone 4',
    rating: 5,
    date: 'Il y a 1 semaine',
    comment:
      'En tant que propriétaire de meublés, le badge « Propriétaire Vérifié » et le système d’acompte Mobile Money ont rassuré mes clients venant d’Europe et de la sous-région. Taux de remplissage à 90% !',
    propertyType: 'Meublé haut standing',
    verified: true,
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'test-3',
    name: 'Marc-Olivier Touré',
    role: 'Acquéreur foncier',
    location: 'Bingerville M’Batto',
    rating: 5,
    date: 'Il y a 2 semaines',
    comment:
      'Acheter un terrain en Côte d’Ivoire était ma plus grande hantise à cause des doubles ventes. Ivoire Logement m’a permis d’entrer en contact direct avec un promoteur sérieux avec ACD vérifié.',
    propertyType: 'Terrain avec ACD',
    verified: true,
    avatarBg: 'bg-blue-600',
  },
  {
    id: 'test-4',
    name: 'Fatouma Traoré',
    role: 'Professionnelle en mission',
    location: 'Plateau & Grand-Bassam',
    rating: 5,
    date: 'Il y a 3 semaines',
    comment:
      'La fonction de calcul de distance et le tri par proximité m’ont fait gagner un temps précieux pour trouver un logement à moins de 15 minutes de mon bureau au Plateau.',
    propertyType: 'Studio meublé d’affaires',
    verified: true,
    avatarBg: 'bg-purple-600',
  },
];

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('ivoire_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('Cocody');
  const [newRole, setNewRole] = useState('Locataire');
  const [newProperty, setNewProperty] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    setIsSubmitting(true);
    const newEntry: Testimonial = {
      id: 'test-' + Date.now(),
      name: newName.trim(),
      role: newRole,
      location: newLocation,
      rating: newRating,
      date: 'À l’instant',
      comment: newComment.trim(),
      propertyType: newProperty.trim() || 'Logement',
      verified: true,
      avatarBg: 'bg-[#0F6B3F]',
    };

    const updated = [newEntry, ...testimonials];
    setTestimonials(updated);
    localStorage.setItem('ivoire_testimonials', JSON.stringify(updated));

    setIsSubmitting(false);
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setShowModal(false);
      setNewName('');
      setNewProperty('');
      setNewComment('');
    }, 1500);
  };

  return (
    <section className="space-y-4 pt-4 border-t border-gray-200/80 dark:border-gray-800">
      {/* Header with Title and Add Review Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
              Témoignages & Avis Vérifiés
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#0F6B3F] dark:text-[#34D399] border border-emerald-600/20">
              4.9 / 5 étoiles
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Retour d'expérience de locataires, acheteurs et bailleurs en Côte d'Ivoire.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#16261c] hover:bg-gray-50 dark:hover:bg-gray-800 text-[#0F6B3F] dark:text-[#34D399] border border-emerald-600/30 font-bold text-xs shadow-xs active:scale-95 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Donner mon avis</span>
        </button>
      </div>

      {/* Trust Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 py-1">
        <div className="bg-white dark:bg-[#16261c] p-3 rounded-2xl border border-gray-200/70 dark:border-gray-800/80 flex items-center gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#0F6B3F] dark:text-[#34D399] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm text-gray-900 dark:text-white">100% Vérifiés</div>
            <div className="text-[10px] text-gray-400">Bailleurs & identités</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#16261c] p-3 rounded-2xl border border-gray-200/70 dark:border-gray-800/80 flex items-center gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-[#F28C1B] flex items-center justify-center shrink-0">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm text-gray-900 dark:text-white">4.9 / 5 Note</div>
            <div className="text-[10px] text-gray-400">Satisfaction clients</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#16261c] p-3 rounded-2xl border border-gray-200/70 dark:border-gray-800/80 flex items-center gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm text-gray-900 dark:text-white">+1 500 Biens</div>
            <div className="text-[10px] text-gray-400">Loués & vendus en CI</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#16261c] p-3 rounded-2xl border border-gray-200/70 dark:border-gray-800/80 flex items-center gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm text-gray-900 dark:text-white">Anti-Arnaque</div>
            <div className="text-[10px] text-gray-400">Paiements sécurisés</div>
          </div>
        </div>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {testimonials.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#16261c] rounded-2xl p-4 border border-gray-200/80 dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-3 hover:border-[#0F6B3F]/40 transition-all"
          >
            <div className="space-y-2.5">
              {/* Rating stars & verified badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300 dark:text-gray-700'
                      }`}
                    />
                  ))}
                </div>

                {item.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Avis vérifié</span>
                  </span>
                )}
              </div>

              {/* Quote comment */}
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic line-clamp-4">
                « {item.comment} »
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-full ${item.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs`}
              >
                {item.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-gray-900 dark:text-white truncate">
                  {item.name}
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1 truncate">
                  <MapPin className="w-2.5 h-2.5 text-[#F28C1B] shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leave a review modal */}
      {showModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16261c] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0F6B3F] dark:text-[#34D399]" />
                <h3 className="font-black text-base text-gray-900 dark:text-white">
                  Partager votre expérience
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedbackSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#0F6B3F] mx-auto animate-bounce" />
                <h4 className="font-black text-sm text-gray-900 dark:text-white">
                  Merci pour votre témoignage !
                </h4>
                <p className="text-xs text-gray-500">
                  Votre avis a été vérifié et ajouté à la communauté.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Votre Nom ou Prénom
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Christian K."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Votre Profil
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                    >
                      <option value="Locataire">Locataire</option>
                      <option value="Propriétaire / Bailleur">Propriétaire / Bailleur</option>
                      <option value="Acquéreur">Acquéreur</option>
                      <option value="Voyageur (Meublé)">Voyageur (Meublé)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Commune / Ville
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Cocody Angré"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Votre Note
                  </label>
                  <div className="flex items-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-600 ml-2">
                      {newRating} / 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Votre Avis & Recommandation
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Comment s'est passée votre recherche ou la publication de votre bien ?"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-[#0F6B3F] hover:bg-[#0B5431] text-white font-bold shadow transition-all"
                  >
                    {isSubmitting ? 'Envoi...' : 'Publier mon avis'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
