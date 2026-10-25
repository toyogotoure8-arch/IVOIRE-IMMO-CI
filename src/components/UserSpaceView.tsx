import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OwnerDashboard } from './OwnerDashboard';
import { AdminDashboard } from './AdminDashboard';
import { BookingsView } from './BookingsView';
import { MessagesView } from './MessagesView';
import { FaqImmobilierSection } from './FaqImmobilierSection';
import { OwnerPromoterGuideSection } from './OwnerPromoterGuideSection';
import { ActualitesConseilsSection } from './ActualitesConseilsSection';
import { RecentlyViewedSection } from './RecentlyViewedSection';
import { formatIvorianPhone } from '../utils/calculations';
import {
  User,
  ShieldCheck,
  LogOut,
  CalendarCheck,
  MessageSquare,
  Building2,
  BellRing,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
  BookOpen,
  Newspaper,
  History,
  AlertCircle,
  Mail,
  Phone,
  Lock,
  Link,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onOpenPublish: () => void;
  onOpenAlerts: () => void;
  onOpenSpaceSwitcher?: () => void;
}

export const UserSpaceView: React.FC<Props> = ({ onOpenPublish, onOpenAlerts, onOpenSpaceSwitcher }) => {
  const {
    currentUser,
    firebaseUser,
    setShowAuthModal,
    logout,
    recentlyViewedListings,
    switchActiveSpace,
    resendVerificationEmail,
    linkEmailCredential,
    showToast,
  } = useApp();

  const activeSpace = currentUser?.espaceActif || 'chercheur';
  const userRoles = currentUser?.roles || [];

  const [clientSubTab, setClientSubTab] = useState<'reservations' | 'messages' | 'recents' | 'faq' | 'guide' | 'actualites'>('reservations');
  const [showGuestFaq, setShowGuestFaq] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [linkEmail, setLinkEmail] = useState('');
  const [linkPassword, setLinkPassword] = useState('');
  const [isLinkingEmail, setIsLinkingEmail] = useState(false);

  if (!currentUser) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto my-4">
        {/* Unauthenticated Login Card */}
        <div className="bg-white dark:bg-[#16261c] rounded-3xl p-8 sm:p-10 text-center border border-gray-200/80 dark:border-gray-800 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#0F6B3F]/10 text-[#0F6B3F] mx-auto flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white">
            Accéder à mon espace
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            Connectez-vous par Téléphone, E-mail ou Google pour accéder à vos espaces Chercheur et Propriétaire.
          </p>
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="w-full py-3.5 px-4 bg-[#0F6B3F] hover:bg-[#0B5431] text-white rounded-2xl text-sm font-extrabold shadow-md active:scale-[0.98] transition-all"
          >
            Se connecter / S'inscrire
          </button>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setShowGuestFaq((prev) => !prev)}
              className="text-xs font-bold text-[#0F6B3F] dark:text-[#34D399] hover:underline flex items-center justify-center gap-1.5 mx-auto"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showGuestFaq ? "Masquer la FAQ Immobilier CI" : "Consulter la FAQ & Guide Juridique (Sans connexion)"}</span>
            </button>
          </div>
        </div>

        {/* Guest FAQ Section Toggle */}
        {showGuestFaq && <FaqImmobilierSection />}

        {/* Recently Viewed for Guest */}
        {recentlyViewedListings.length > 0 && <RecentlyViewedSection />}
      </div>
    );
  }

  const handleLinkEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkEmail.trim() || !linkPassword) return;
    setIsLinkingEmail(true);
    try {
      await linkEmailCredential(linkEmail, linkPassword);
      setLinkEmail('');
      setLinkPassword('');
      setShowSecurityModal(false);
    } catch (err) {
      // Error is handled in linkEmailCredential toast
    } finally {
      setIsLinkingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Verification Banner */}
      {firebaseUser && firebaseUser.email && !firebaseUser.emailVerified && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 p-4 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-sm block">Vérifiez votre adresse e-mail</span>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Un e-mail de confirmation a été envoyé à <strong>{firebaseUser.email}</strong>. Confirmez votre adresse pour publier des annonces et sécuriser votre compte.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resendVerificationEmail}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs shrink-0 transition-all shadow active:scale-95"
          >
            Renvoyer l'e-mail
          </button>
        </div>
      )}

      {/* User Card */}
      <div className="bg-white dark:bg-[#16261c] rounded-3xl p-5 sm:p-6 border border-gray-200/80 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#0F6B3F] text-white flex items-center justify-center text-xl font-black shadow-md shadow-[#0F6B3F]/20 shrink-0">
            {currentUser.nom.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                {currentUser.nom} {currentUser.prenoms ? currentUser.prenoms : ''}
              </h2>
              {currentUser.verifie && (
                <span title="Profil certifié">
                  <ShieldCheck className="w-4 h-4 text-[#0F6B3F] fill-[#0F6B3F]/20" />
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {formatIvorianPhone(currentUser.telephone)} {currentUser.commune && `• ${currentUser.commune}`} {currentUser.email && `• ${currentUser.email}`}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#0F6B3F] dark:text-[#34D399] border border-emerald-600/20">
                Espace actif : {activeSpace === 'proprietaire' ? '🏡 Propriétaire' : '🔍 Chercheur'}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (onOpenSpaceSwitcher) onOpenSpaceSwitcher();
                }}
                className="text-[11px] text-[#F28C1B] font-bold underline hover:opacity-80 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Changer d'espace</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setShowSecurityModal((prev) => !prev)}
            className="py-2 px-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-[#0F6B3F]" />
            <span>Sécurité & Connexion</span>
          </button>
          <button
            type="button"
            onClick={logout}
            className="py-2 px-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Security & Credentials Linking Section Modal / Drawer */}
      {showSecurityModal && (
        <div className="bg-white dark:bg-[#16261c] rounded-3xl p-6 border border-[#0F6B3F]/20 shadow-md space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#0F6B3F]" />
              <h3 className="font-black text-base text-gray-900 dark:text-white">
                Sécurité & Modes de connexion (Compte unique)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowSecurityModal(false)}
              className="text-xs text-gray-400 hover:text-gray-600 font-bold"
            >
              Fermer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* E-mail Linking */}
            <div className="bg-gray-50 dark:bg-[#1a2d22] p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0F6B3F]" />
                <span className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white">
                  Lier une adresse e-mail
                </span>
              </div>
              {currentUser.email ? (
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Lié à : {currentUser.email}</span>
                </div>
              ) : (
                <form onSubmit={handleLinkEmailSubmit} className="space-y-2">
                  <p className="text-[11px] text-gray-500">
                    Liez une adresse e-mail et un mot de passe à votre compte pour pouvoir vous connecter avec les deux modes.
                  </p>
                  <input
                    type="email"
                    placeholder="Adresse e-mail à lier"
                    value={linkEmail}
                    onChange={(e) => setLinkEmail(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-[#132219] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs"
                  />
                  <input
                    type="password"
                    placeholder="Mot de passe (8 car. min)"
                    value={linkPassword}
                    onChange={(e) => setLinkPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-white dark:bg-[#132219] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    type="submit"
                    disabled={isLinkingEmail}
                    className="w-full py-2 px-3 bg-[#0F6B3F] hover:bg-[#0B5431] text-white font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
                  >
                    {isLinkingEmail ? 'Liaison...' : 'Lier mon adresse e-mail'}
                  </button>
                </form>
              )}
            </div>

            {/* Telephone Linking Info */}
            <div className="bg-gray-50 dark:bg-[#1a2d22] p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F28C1B]" />
                <span className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white">
                  Numéro de téléphone (Contact)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 font-semibold bg-white dark:bg-[#132219] p-2.5 rounded-xl border border-gray-200 dark:border-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Contact enregistre : {formatIvorianPhone(currentUser.telephone)}</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Votre numéro de téléphone permet aux bailleurs et clients de vous contacter directement sur WhatsApp.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation bar for switching sub-views */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => setClientSubTab('reservations')}
          className={`pb-3 px-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            clientSubTab === 'reservations'
              ? 'border-[#0F6B3F] text-[#0F6B3F] dark:text-[#34D399]'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>
            {activeSpace === 'proprietaire'
              ? 'Gestion de mes Biens'
              : userRoles.includes('admin')
              ? 'Administration'
              : 'Mes Réservations'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setClientSubTab('messages')}
          className={`pb-3 px-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            clientSubTab === 'messages'
              ? 'border-[#0F6B3F] text-[#0F6B3F] dark:text-[#34D399]'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Messages & Contact</span>
        </button>

        <button
          type="button"
          onClick={() => setClientSubTab('faq')}
          className={`pb-3 px-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            clientSubTab === 'faq'
              ? 'border-[#0F6B3F] text-[#0F6B3F] dark:text-[#34D399]'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>FAQ & Guide Juridique CI</span>
        </button>

        <button
          type="button"
          onClick={() => setClientSubTab('guide')}
          className={`pb-3 px-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            clientSubTab === 'guide'
              ? 'border-[#0F6B3F] text-[#0F6B3F] dark:text-[#34D399]'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#F28C1B]" />
          <span>Guide des Propriétaires</span>
        </button>

        <button
          type="button"
          onClick={() => setClientSubTab('actualites')}
          className={`pb-3 px-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            clientSubTab === 'actualites'
              ? 'border-[#0F6B3F] text-[#0F6B3F] dark:text-[#34D399]'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
          }`}
        >
          <Newspaper className="w-4 h-4 text-blue-500" />
          <span>Actualités & Conseils</span>
        </button>

        <button
          type="button"
          onClick={() => setClientSubTab('recents')}
          className={`pb-3 px-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            clientSubTab === 'recents'
              ? 'border-[#0F6B3F] text-[#0F6B3F] dark:text-[#34D399]'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
          }`}
        >
          <History className="w-4 h-4 text-emerald-600" />
          <span>Récemment consultés</span>
          {recentlyViewedListings.length > 0 && (
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-[#0F6B3F] dark:text-[#34D399] px-1.5 py-0.5 rounded-full font-black">
              {recentlyViewedListings.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab View */}
      {clientSubTab === 'faq' ? (
        <FaqImmobilierSection />
      ) : clientSubTab === 'guide' ? (
        <OwnerPromoterGuideSection />
      ) : clientSubTab === 'actualites' ? (
        <ActualitesConseilsSection />
      ) : clientSubTab === 'recents' ? (
        <RecentlyViewedSection />
      ) : activeSpace === 'proprietaire' ? (
        <OwnerDashboard onOpenPublish={onOpenPublish} />
      ) : userRoles.includes('admin') && activeSpace === 'chercheur' ? (
        <AdminDashboard />
      ) : (
        /* Chercheur View */
        <div className="space-y-6">
          {/* Quick Chercheur Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => setClientSubTab('reservations')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                clientSubTab === 'reservations'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#0F6B3F] text-[#0F6B3F]'
                  : 'bg-white dark:bg-[#16261c] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <CalendarCheck className="w-5 h-5 mb-2 text-[#0F6B3F]" />
              <span className="font-bold text-xs sm:text-sm">Mes Réservations</span>
              <span className="text-[11px] text-gray-500">Hôtels et meublés</span>
            </button>

            <button
              type="button"
              onClick={() => setClientSubTab('messages')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                clientSubTab === 'messages'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#0F6B3F] text-[#0F6B3F]'
                  : 'bg-white dark:bg-[#16261c] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <MessageSquare className="w-5 h-5 mb-2 text-[#0F6B3F]" />
              <span className="font-bold text-xs sm:text-sm">Mes Messages</span>
              <span className="text-[11px] text-gray-500">Discussions bailleurs</span>
            </button>

            <button
              type="button"
              onClick={() => setClientSubTab('recents')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                (clientSubTab as string) === 'recents'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#0F6B3F] text-[#0F6B3F]'
                  : 'bg-white dark:bg-[#16261c] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <History className="w-5 h-5 mb-2 text-emerald-600" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm">Récemment vus</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-[#0F6B3F] dark:text-[#34D399] px-1.5 py-0.5 rounded-full font-bold">
                  {recentlyViewedListings.length}/5
                </span>
              </div>
              <span className="text-[11px] text-gray-500">5 dernières annonces</span>
            </button>

            <button
              type="button"
              onClick={onOpenAlerts}
              className="p-4 rounded-2xl border bg-white dark:bg-[#16261c] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-left transition-all flex flex-col justify-between"
            >
              <BellRing className="w-5 h-5 mb-2 text-[#F28C1B]" />
              <span className="font-bold text-xs sm:text-sm">Alertes de recherche</span>
              <span className="text-[11px] text-gray-500">Critères enregistrés</span>
            </button>
          </div>

          {/* Subtab content */}
          {clientSubTab === 'reservations' ? (
            <div className="space-y-6">
              <BookingsView />
              <RecentlyViewedSection />
            </div>
          ) : (
            <MessagesView />
          )}

          {/* Banner to switch to Owner */}
          <div className="bg-[#F2F6F0] dark:bg-[#1a2d22] p-5 rounded-3xl border border-[#0F6B3F]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-base text-gray-900 dark:text-white">
                Vous possédez un bien immobilier ou un hôtel ?
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {userRoles.includes('proprietaire')
                  ? 'Basculez dans votre espace Propriétaire pour gérer vos offres.'
                  : 'Activez le statut Propriétaire sur votre compte unique pour déposer des annonces.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (userRoles.includes('proprietaire')) {
                  switchActiveSpace('proprietaire');
                } else if (onOpenSpaceSwitcher) {
                  onOpenSpaceSwitcher();
                }
              }}
              className="py-2.5 px-4 bg-[#F28C1B] hover:bg-[#D9770E] text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow"
            >
              <span>{userRoles.includes('proprietaire') ? 'Ouvrir Espace Propriétaire' : 'Activer statut Propriétaire'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


