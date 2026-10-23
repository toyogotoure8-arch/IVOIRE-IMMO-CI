import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, ShieldAlert, Send } from 'lucide-react';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useApp } from '../context/AppContext';

export const NewsletterSection: React.FC = () => {
  const { showToast } = useApp();
  const [email, setEmail] = useState('');
  const [communePref, setCommunePref] = useState('Toutes');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Veuillez entrer une adresse e-mail valide.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const subscriberId = 'sub-' + Date.now();
      const subscriberData = {
        id: subscriberId,
        email: email.trim(),
        commune: communePref,
        dateCreation: new Date().toISOString(),
        source: 'accueil_newsletter',
      };

      try {
        await setDoc(doc(db, 'newslettersubscribers', subscriberId), subscriberData);
      } catch (fbErr) {
        console.warn('Firestore newsletter fallback note:', fbErr);
      }

      // Also store in localStorage for offline persistence
      const existing = JSON.parse(localStorage.getItem('ivoire_subscribers') || '[]');
      localStorage.setItem('ivoire_subscribers', JSON.stringify([...existing, subscriberData]));

      setIsSubscribed(true);
      showToast('Inscription à la newsletter réussie ! Vous recevrez nos alertes.', 'success');
      setEmail('');
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de l\'inscription. Veuillez réessayer.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0F6B3F] via-emerald-800 to-[#16261c] text-white rounded-3xl p-6 sm:p-10 shadow-lg my-6">
      {/* Background decorative elements */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Alertes Immobilières en Exclusivité</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black">
          Ne ratez aucune nouvelle opportunité immobilière en Côte d'Ivoire
        </h2>

        <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto">
          Recevez directement dans votre boîte e-mail les dernières annonces de villas, appartements et terrains dès leur publication, propulsé par nos alertes automatiques.
        </p>

        {isSubscribed ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl space-y-2 animate-in fade-in duration-300">
            <CheckCircle2 className="w-10 h-10 text-amber-300 mx-auto" />
            <h3 className="font-extrabold text-sm sm:text-base">Inscription confirmée avec succès !</h3>
            <p className="text-xs text-emerald-100">
              Vous recevrez désormais nos sélections et alertes ciblées pour la commune de {communePref}.
            </p>
            <button
              type="button"
              onClick={() => setIsSubscribed(false)}
              className="mt-2 text-xs text-amber-300 underline font-semibold hover:text-white"
            >
              Inscrire une autre adresse e-mail
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4 text-emerald-300" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Votre adresse e-mail (ex: nom@gmail.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-white/10 dark:bg-black/20 border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-md"
                />
              </div>

              <select
                value={communePref}
                onChange={(e) => setCommunePref(e.target.value)}
                className="py-3.5 px-4 bg-emerald-900/80 text-white border border-white/20 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="Toutes">Toutes les communes</option>
                <option value="Cocody">Cocody</option>
                <option value="Marcory">Marcory</option>
                <option value="Yopougon">Yopougon</option>
                <option value="Plateau">Plateau</option>
                <option value="Bingerville">Bingerville</option>
                <option value="Grand-Bassam">Grand-Bassam</option>
              </select>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all shrink-0 flex items-center justify-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Inscription...' : 'S\'inscrire'}</span>
              </button>
            </div>

            <div className="text-[11px] text-emerald-200/80 flex items-center justify-center gap-1.5 pt-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Zéro spam. Désabonnement possible à tout moment en un clic.</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
