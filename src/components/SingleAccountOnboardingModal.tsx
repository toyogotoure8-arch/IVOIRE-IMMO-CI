import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AppSpace, OwnerType } from '../types';
import { COMMUNES_ABIDJAN, AUTRES_VILLES } from '../constants/ciData';
import {
  X,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  Search,
  CheckCircle2,
  ArrowRight,
  Info,
  Eye,
  EyeOff,
  Lock,
  User,
  KeyRound,
  Send,
} from 'lucide-react';
import { GoogleAccountPicker } from './GoogleAccountPicker';

interface Props {
  targetSpace: AppSpace;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SingleAccountOnboardingModal: React.FC<Props> = ({ targetSpace, onClose, onSuccess }) => {
  const {
    currentUser,
    registerSingleAccount,
    addRoleToAccount,
    loginWithEmail,
    loginWithPhone,
    loginWithGoogle,
    sendPasswordReset,
    showToast,
  } = useApp();

  // If already logged in, this modal simply adds the missing role
  const isAddingRoleOnly = Boolean(currentUser && !currentUser.roles.includes(targetSpace));

  // Mode: Inscription or Connexion (for not logged in users)
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  // Authentication Method: E-mail, Téléphone, or Google
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'google'>('email');

  // Common Fields
  const [nom, setNom] = useState(currentUser?.nom || '');
  const [prenoms, setPrenoms] = useState(currentUser?.prenoms || '');
  const [telephone, setTelephone] = useState(currentUser?.telephone || '+225 07 ');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [commune, setCommune] = useState(currentUser?.commune || 'Cocody');

  // Password fields for Email Auth
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Phone OTP state
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  const [otpCode, setOtpCode] = useState('');

  // Donnees Chercheur
  const [budgetMax, setBudgetMax] = useState<number | ''>(currentUser?.donneesChercheur?.budgetMaxPrefe || '');
  const [typeRecherche, setTypeRecherche] = useState(currentUser?.donneesChercheur?.typeRecherche || 'Location d\'appartement ou villa');

  // Donnees Proprietaire
  const [typeProfil, setTypeProfil] = useState<OwnerType>(currentUser?.donneesProprietaire?.typeProfil || 'particulier');
  const [nomCommercial, setNomCommercial] = useState(currentUser?.donneesProprietaire?.nomCommercial || '');
  const [whatsappPro, setWhatsappPro] = useState(currentUser?.donneesProprietaire?.whatsappPro || '');
  const [adressePro, setAdressePro] = useState(currentUser?.donneesProprietaire?.adressePro || '');
  const [pieceIdentiteUrl, setPieceIdentiteUrl] = useState(currentUser?.donneesProprietaire?.pieceIdentiteUrl || '');
  const [pieceIdentiteType, setPieceIdentiteType] = useState(currentUser?.donneesProprietaire?.pieceIdentiteType || 'CNI Ivoirienne');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-sync if user logs in via Google during modal session
  useEffect(() => {
    if (currentUser) {
      if (!nom && currentUser.nom) setNom(currentUser.nom);
      if (!prenoms && currentUser.prenoms) setPrenoms(currentUser.prenoms);
      if (!email && currentUser.email) setEmail(currentUser.email);
      if (currentUser.telephone && currentUser.telephone !== '+225 07 00 00 00 00') {
        setTelephone(currentUser.telephone);
      }
    }
  }, [currentUser]);

  // Handle Google Auth with chosen account
  const handleGoogleClick = async (chosenEmail?: string, chosenName?: string) => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle(chosenEmail, chosenName);
      if (chosenEmail) {
        setEmail(chosenEmail);
      }
      if (chosenName) {
        const parts = chosenName.split(' ');
        setNom(parts[0] || chosenName);
        if (parts.slice(1).length > 0) {
          setPrenoms(parts.slice(1).join(' '));
        }
      }
      showToast('Compte Google sélectionné avec succès !', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la connexion avec Google', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Veuillez saisir votre adresse e-mail pour recevoir le lien.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await sendPasswordReset(email.trim());
      setIsForgotPassword(false);
    } catch (err) {
      // toast shown in helper
    } finally {
      setIsSubmitting(false);
    }
  };

  // Main Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // CASE 1: Adding a role to an already authenticated account
    if (currentUser) {
      setIsSubmitting(true);
      try {
        await addRoleToAccount({
          newSpaceRole: targetSpace,
          donneesChercheur: targetSpace === 'chercheur' ? {
            budgetMaxPrefe: Number(budgetMax) || undefined,
            typeRecherche,
          } : undefined,
          donneesProprietaire: targetSpace === 'proprietaire' ? {
            typeProfil,
            nomCommercial: nomCommercial.trim() || undefined,
            whatsappPro: whatsappPro.trim() || undefined,
            adressePro: adressePro.trim() || undefined,
            pieceIdentiteUrl: pieceIdentiteUrl.trim() || undefined,
            pieceIdentiteType,
            pieceIdentiteStatut: pieceIdentiteUrl.trim() ? 'en_attente' : 'non_fournie',
            verifie: false,
          } : undefined,
        });

        if (onSuccess) onSuccess();
        onClose();
      } catch (err: any) {
        showToast(err.message || 'Erreur lors de l\'activation du statut', 'error');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // CASE 2: User is NOT logged in and chose "CONNEXION (J'ai déjà un compte)"
    if (authMode === 'login') {
      if (authMethod === 'email') {
        if (!email.trim() || !password) {
          showToast('Veuillez renseigner votre e-mail et votre mot de passe', 'error');
          return;
        }
        setIsSubmitting(true);
        try {
          await loginWithEmail(email, password);
          if (onSuccess) onSuccess();
          onClose();
        } catch (err) {
          // Toast is shown in loginWithEmail
        } finally {
          setIsSubmitting(false);
        }
      } else if (authMethod === 'phone') {
        if (phoneStep === 'input') {
          if (telephone.length < 8) {
            showToast('Veuillez saisir un numéro de téléphone valide', 'error');
            return;
          }
          setPhoneStep('otp');
          showToast('Code SMS envoyé au ' + telephone + ' (Code test : 1234)', 'info');
          return;
        }
        // OTP Step
        setIsSubmitting(true);
        try {
          await loginWithPhone(telephone, targetSpace === 'chercheur' ? 'chercheur' : 'proprietaire');
          if (onSuccess) onSuccess();
          onClose();
        } catch (err) {
          showToast('Code incorrect ou expiré', 'error');
        } finally {
          setIsSubmitting(false);
        }
      }
      return;
    }

    // CASE 3: User is NOT logged in and chose "INSCRIPTION (Créer mon compte)"
    if (!nom.trim()) {
      showToast('Veuillez saisir votre nom de famille', 'error');
      return;
    }

    if (!telephone.trim() || telephone.trim().length < 8) {
      showToast('Veuillez saisir un numéro de téléphone (contact) valide (+225...)', 'error');
      return;
    }

    // Email-specific registration validation
    if (authMethod === 'email') {
      if (!email.trim()) {
        showToast('Une adresse e-mail est obligatoire pour l\'inscription par e-mail', 'error');
        return;
      }
      if (password.length < 8) {
        showToast('Le mot de passe doit contenir au moins 8 caractères.', 'error');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Les mots de passe ne correspondent pas.', 'error');
        return;
      }
    }

    // Phone-specific registration OTP check
    if (authMethod === 'phone' && phoneStep === 'input') {
      setPhoneStep('otp');
      showToast('Code SMS envoyé au ' + telephone + ' (Code test : 1234)', 'info');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerSingleAccount({
        nom: nom.trim(),
        prenoms: prenoms.trim(),
        telephone: telephone.trim(),
        commune,
        email: email.trim() || undefined,
        password: authMethod === 'email' ? password : undefined,
        authMethod,
        initialSpace: targetSpace,
        donneesChercheur: targetSpace === 'chercheur' ? {
          budgetMaxPrefe: Number(budgetMax) || undefined,
          typeRecherche,
        } : undefined,
        donneesProprietaire: targetSpace === 'proprietaire' ? {
          typeProfil,
          nomCommercial: nomCommercial.trim() || undefined,
          whatsappPro: whatsappPro.trim() || undefined,
          adressePro: adressePro.trim() || undefined,
          pieceIdentiteUrl: pieceIdentiteUrl.trim() || undefined,
          pieceIdentiteType,
          pieceIdentiteStatut: pieceIdentiteUrl.trim() ? 'en_attente' : 'non_fournie',
          verifie: false,
        } : undefined,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la création du compte', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#16261c] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className={`p-5 sm:p-6 text-white flex items-center justify-between ${
          targetSpace === 'chercheur'
            ? 'bg-gradient-to-r from-emerald-800 via-[#0F6B3F] to-emerald-950'
            : 'bg-gradient-to-r from-amber-600 via-[#F28C1B] to-amber-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md">
              {targetSpace === 'chercheur' ? <Search className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-200">
                {isAddingRoleOnly
                  ? 'Ajouter ce statut à mon compte unique'
                  : authMode === 'register'
                  ? 'Inscription — Compte Unique IvoireLogement'
                  : 'Connexion à votre espace'}
              </div>
              <h3 className="text-lg sm:text-xl font-black">
                {targetSpace === 'chercheur'
                  ? 'Espace Chercheur (Locataire & Acheteur)'
                  : 'Espace Propriétaire (Bailleur & Hôtelier)'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto space-y-5">
          
          {/* NOTICE IF ALREADY LOGGED IN: Adding Role */}
          {isAddingRoleOnly && currentUser && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-600/30 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#0F6B3F] shrink-0 mt-0.5" />
              <div className="text-xs text-gray-700 dark:text-gray-300">
                <span className="font-bold text-[#0F6B3F] dark:text-[#34D399]">
                  Compte connecté : {currentUser.nom} {currentUser.prenoms || ''}
                </span>
                <p className="mt-0.5 text-gray-500">
                  Tél : {currentUser.telephone} • Commune : {currentUser.commune}. Vos coordonnées sont conservées. Remplissez simplement les critères ci-dessous pour activer votre statut {targetSpace}.
                </p>
              </div>
            </div>
          )}

          {/* FOR VISITORS NOT YET CONNECTED: Multiple Login / Signup Modes */}
          {!currentUser && (
            <div className="space-y-4">
              
              {/* 1. Toggle Mode: Inscription / Connexion */}
              <div className="flex p-1 bg-gray-100 dark:bg-[#1a2d22] rounded-2xl border border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setIsForgotPassword(false);
                  }}
                  className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                    authMode === 'register'
                      ? 'bg-white dark:bg-[#132219] text-[#0F6B3F] dark:text-[#34D399] shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  ✨ Créer mon compte
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setIsForgotPassword(false);
                  }}
                  className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                    authMode === 'login'
                      ? 'bg-white dark:bg-[#132219] text-[#0F6B3F] dark:text-[#34D399] shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  🔑 J'ai déjà un compte (Connexion)
                </button>
              </div>

              {/* 2. Choose Authentication Method: Téléphone, E-mail, Google */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Choisissez votre mode de {authMode === 'register' ? 'création de compte' : 'connexion'} :
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('email');
                      setIsForgotPassword(false);
                    }}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      authMethod === 'email'
                        ? 'border-[#0F6B3F] bg-emerald-50 dark:bg-emerald-950/40 text-[#0F6B3F] dark:text-[#34D399] font-black shadow-xs ring-2 ring-[#0F6B3F]/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2d22] text-gray-600 dark:text-gray-300 font-semibold hover:border-gray-300'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-xs">E-mail</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('phone');
                      setIsForgotPassword(false);
                    }}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      authMethod === 'phone'
                        ? 'border-[#0F6B3F] bg-emerald-50 dark:bg-emerald-950/40 text-[#0F6B3F] dark:text-[#34D399] font-black shadow-xs ring-2 ring-[#0F6B3F]/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2d22] text-gray-600 dark:text-gray-300 font-semibold hover:border-gray-300'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-xs">Téléphone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('google');
                      setIsForgotPassword(false);
                    }}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      authMethod === 'google'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-black shadow-xs ring-2 ring-blue-500/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2d22] text-gray-600 dark:text-gray-300 font-semibold hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.41 7.34 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.13z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.59 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                    </svg>
                    <span className="text-xs">Google</span>
                  </button>
                </div>
              </div>

              {/* GOOGLE ACCOUNT CHOOSER */}
              {authMethod === 'google' && (
                <div className="pt-1">
                  <GoogleAccountPicker
                    onSelectAccount={(chosenEmail, chosenName) =>
                      handleGoogleClick(chosenEmail, chosenName)
                    }
                    onOpenNativePopup={() => loginWithGoogle()}
                    isLoading={isSubmitting}
                  />
                </div>
              )}
            </div>
          )}

          {/* FORGOT PASSWORD SUB-FLOW */}
          {!currentUser && authMethod === 'email' && isForgotPassword && (
            <form onSubmit={handleForgotPassword} className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                <KeyRound className="w-4 h-4 text-[#F28C1B]" />
                <span>Réinitialisation du mot de passe</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Indiquez votre adresse e-mail. Nous vous enverrons immédiatement un lien pour définir un nouveau mot de passe.
              </p>
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@domaine.ci"
                  className="w-full bg-white dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-between items-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-xs font-bold text-gray-500 hover:underline"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#F28C1B] hover:bg-[#D9770E] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer l'e-mail</span>
                </button>
              </div>
            </form>
          )}

          {/* MAIN FORM: Inscription, Connexion, or Role Addition */}
          {(!isForgotPassword || authMethod !== 'email') && (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* IF IN LOGIN MODE: Only Email/Pass or Phone/OTP */}
              {!currentUser && authMode === 'login' && authMethod === 'email' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Adresse e-mail de connexion *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@domaine.ci"
                      className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F6B3F] outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                        Mot de passe *
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-[11px] font-extrabold text-[#F28C1B] hover:underline"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F6B3F] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* IF IN LOGIN MODE WITH PHONE */}
              {!currentUser && authMode === 'login' && authMethod === 'phone' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Numéro de téléphone (+225) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="+225 07 00 00 00 00"
                      className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                    />
                  </div>

                  {phoneStep === 'otp' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Code SMS reçu à 4 chiffres (Code test: 1234) *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="1234"
                        className="w-full text-center tracking-widest text-xl font-black bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl py-2 text-[#0F6B3F]"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* IF IN REGISTER MODE OR ROLE ADDITION: Full Registration Form */}
              {(authMode === 'register' || currentUser) && (
                <div className="space-y-4">
                  
                  {/* Common Information Block */}
                  {!currentUser && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 pb-1 border-b border-gray-100 dark:border-gray-800">
                        <User className="w-4 h-4 text-[#0F6B3F]" />
                        <span>Informations du profil unique</span>
                      </div>

                      {/* Name & First Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Nom de famille *
                          </label>
                          <input
                            type="text"
                            required
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            placeholder="Ex: Koffi"
                            className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Prénoms
                          </label>
                          <input
                            type="text"
                            value={prenoms}
                            onChange={(e) => setPrenoms(e.target.value)}
                            placeholder="Ex: Jean-Marc"
                            className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Phone Contact & Email Contact */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Numéro de téléphone (contact) *
                          </label>
                          <input
                            type="tel"
                            required
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            placeholder="+225 07 00 00 00 00"
                            className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Adresse e-mail {authMethod === 'email' ? '*' : '(contact)'}
                          </label>
                          <input
                            type="email"
                            required={authMethod === 'email'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre.email@domaine.ci"
                            className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Password inputs if Email registration method */}
                      {authMethod === 'email' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                              Mot de passe (8 car. min) *
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl pl-3 pr-9 py-2 text-xs sm:text-sm text-gray-900 dark:text-white"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                              >
                                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                              Confirmer le mot de passe *
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                minLength={8}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl pl-3 pr-9 py-2 text-xs sm:text-sm text-gray-900 dark:text-white"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                              >
                                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Commune */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Commune de résidence *
                        </label>
                        <select
                          value={commune}
                          onChange={(e) => setCommune(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white font-medium"
                        >
                          <optgroup label="Communes d'Abidjan">
                            {COMMUNES_ABIDJAN.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </optgroup>
                          <optgroup label="Villes de l'intérieur">
                            {AUTRES_VILLES.map((v) => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Role Specific Block: Chercheur */}
                  {targetSpace === 'chercheur' && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0F6B3F] dark:text-[#34D399] pb-1 border-b border-gray-100 dark:border-gray-800">
                        <Search className="w-4 h-4 text-[#0F6B3F]" />
                        <span>Critères de recherche (Profil Chercheur)</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Budget mensuel / d'achat souhaité (FCFA)
                        </label>
                        <input
                          type="number"
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(e.target.value ? Number(e.target.value) : '')}
                          placeholder="Ex: 250000"
                          className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Type de bien ou service recherché
                        </label>
                        <select
                          value={typeRecherche}
                          onChange={(e) => setTypeRecherche(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white font-medium"
                        >
                          <option value="Location d'appartement ou villa">Location d'appartement ou villa</option>
                          <option value="Achat de maison / terrain">Achat immobilier (Maison, Terrain, Immeuble)</option>
                          <option value="Résidence meublée / Court séjour">Résidence meublée / Court séjour (Séjour VIP)</option>
                          <option value="Hôtel / Chambre">Hôtel / Chambre climatisée</option>
                          <option value="Bail commercial / Bureau">Bail commercial / Bureau / Magasin</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Role Specific Block: Propriétaire */}
                  {targetSpace === 'proprietaire' && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#F28C1B] pb-1 border-b border-gray-100 dark:border-gray-800">
                        <Building2 className="w-4 h-4 text-[#F28C1B]" />
                        <span>Informations Bailleur / Propriétaire</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Type de profil propriétaire *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'particulier', label: 'Particulier (Bailleur privé)' },
                            { id: 'agence', label: 'Agence Immobilière' },
                            { id: 'hotelier', label: 'Hôtelier / Résidence' },
                            { id: 'promoteur', label: 'Promoteur Immobilier' },
                          ].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setTypeProfil(item.id as OwnerType)}
                              className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                                typeProfil === item.id
                                  ? 'border-[#F28C1B] bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300'
                                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {typeProfil !== 'particulier' && (
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Nom commercial / Raison sociale
                          </label>
                          <input
                            type="text"
                            value={nomCommercial}
                            onChange={(e) => setNomCommercial(e.target.value)}
                            placeholder="Ex: Agence Ivoire Logement"
                            className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Numéro WhatsApp Pro (Contact direct)
                          </label>
                          <input
                            type="tel"
                            value={whatsappPro}
                            onChange={(e) => setWhatsappPro(e.target.value)}
                            placeholder="+225 07 00 00 00 00"
                            className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Adresse physique / Siège
                          </label>
                          <input
                            type="text"
                            value={adressePro}
                            onChange={(e) => setAdressePro(e.target.value)}
                            placeholder="Ex: Cocody Angré 8e Tranche"
                            className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2.5 rounded-xl text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 ${
                    targetSpace === 'chercheur'
                      ? 'bg-[#0F6B3F] hover:bg-[#0B5431]'
                      : 'bg-[#F28C1B] hover:bg-[#D9770E]'
                  }`}
                >
                  <span>
                    {isSubmitting
                      ? 'Traitement en cours...'
                      : isAddingRoleOnly
                      ? 'Activer ce statut'
                      : authMode === 'login'
                      ? 'Se connecter & Entrer'
                      : 'Valider & Entrer'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
