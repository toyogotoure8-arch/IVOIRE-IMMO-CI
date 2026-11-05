import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  X,
  Phone,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Send,
  Check,
  AlertCircle,
  Lock,
  User,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { GoogleAccountPicker } from './GoogleAccountPicker';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    loginWithPhone,
    loginWithEmail,
    registerWithEmail,
    sendPasswordReset,
    loginWithGoogle,
    showToast,
  } = useApp();

  // Primary mode: 'login' (Connexion) vs 'register' (Inscription)
  const [activeMode, setActiveMode] = useState<'login' | 'register'>('login');

  // Secondary sub-state for forgot password
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Authentication provider method: 'email', 'phone', or 'google'
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'google'>('email');

  // Form input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp'>('phone');
  const [selectedRole, setSelectedRole] = useState<UserRole>('chercheur');

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Touched states for showing errors after interaction
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // --- Real-time Dynamic Validation Helpers ---

  // 1. Email validation
  const emailValidation = useMemo(() => {
    const trimmed = email.trim();
    if (!trimmed) {
      return { isValid: false, message: 'Adresse e-mail requise' };
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const isValid = regex.test(trimmed);
    return {
      isValid,
      message: isValid ? 'Format e-mail valide' : 'Format invalide (ex: nom@domaine.ci)',
    };
  }, [email]);

  // 2. Password validation & strength analysis
  const passwordValidation = useMemo(() => {
    const hasMinLen = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    // Score from 0 to 4
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 10) score++;
    if (hasLetter && hasNumber) score++;
    if (hasSpecial) score++;

    let strengthLabel = 'Trop court';
    let strengthColor = 'bg-gray-200 dark:bg-gray-700';

    if (password.length > 0) {
      if (!hasMinLen) {
        strengthLabel = 'Insuffisant (< 8 car.)';
        strengthColor = 'bg-red-500';
      } else if (score <= 2) {
        strengthLabel = 'Moyen';
        strengthColor = 'bg-amber-500';
      } else {
        strengthLabel = 'Robuste & Sécurisé';
        strengthColor = 'bg-emerald-500';
      }
    }

    const isValid = hasMinLen && hasLetter && hasNumber;

    return {
      hasMinLen,
      hasLetter,
      hasNumber,
      hasSpecial,
      score,
      strengthLabel,
      strengthColor,
      isValid,
    };
  }, [password]);

  // 3. Confirm password validation (for register)
  const confirmPasswordValidation = useMemo(() => {
    if (!confirmPassword) {
      return { isValid: false, message: 'Confirmation requise' };
    }
    const isMatch = password === confirmPassword;
    return {
      isValid: isMatch,
      message: isMatch ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas',
    };
  }, [password, confirmPassword]);

  // 4. Phone number formatting & validation (Côte d'Ivoire)
  const phoneValidation = useMemo(() => {
    const cleanDigits = phoneNumber.replace(/[^0-9]/g, '');
    const isValid = cleanDigits.length >= 8 && cleanDigits.length <= 10;
    let helper = 'Saisissez 10 chiffres (ex: 07 12 34 56 78)';
    if (cleanDigits.length === 10) {
      helper = 'Numéro ivoirien complet détecté';
    } else if (cleanDigits.length > 0) {
      helper = `${cleanDigits.length}/10 chiffres`;
    }
    return {
      isValid,
      cleanDigits,
      helper,
    };
  }, [phoneNumber]);

  // 5. Name validation (for register)
  const nameValidation = useMemo(() => {
    const trimmed = name.trim();
    const isValid = trimmed.length >= 2;
    return {
      isValid,
      message: isValid ? 'Nom valide' : 'Minimum 2 caractères',
    };
  }, [name]);

  // 6. Global Form Validity Check
  const canSubmit = useMemo(() => {
    if (isForgotPassword) {
      return emailValidation.isValid;
    }

    if (authMethod === 'email') {
      if (activeMode === 'login') {
        return emailValidation.isValid && password.length >= 8;
      } else {
        return (
          emailValidation.isValid &&
          passwordValidation.hasMinLen &&
          confirmPasswordValidation.isValid &&
          nameValidation.isValid
        );
      }
    }

    if (authMethod === 'phone') {
      if (phoneStep === 'phone') {
        if (activeMode === 'register') {
          return phoneValidation.isValid && nameValidation.isValid;
        }
        return phoneValidation.isValid;
      }
      return otpCode.trim().length >= 4;
    }

    return true;
  }, [
    isForgotPassword,
    authMethod,
    activeMode,
    emailValidation,
    password,
    passwordValidation,
    confirmPasswordValidation,
    nameValidation,
    phoneMethodValidations(),
    phoneStep,
    otpCode,
  ]);

  function phoneMethodValidations() {
    return phoneValidation.isValid;
  }

  // Auto-format phone number with spaces for readibility
  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/[^0-9]/g, '').slice(0, 10);
    // Format in blocks of 2 digits: 07 12 34 56 78
    let formatted = '';
    for (let i = 0; i < digitsOnly.length; i++) {
      if (i > 0 && i % 2 === 0) formatted += ' ';
      formatted += digitsOnly[i];
    }
    setPhoneNumber(formatted);
  };

  if (!showAuthModal) return null;

  // --- Submission Handlers ---

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailValidation.isValid) {
      showToast('Veuillez saisir une adresse e-mail valide', 'error');
      return;
    }

    // Forgot password mode
    if (isForgotPassword) {
      setIsSubmitting(true);
      try {
        await sendPasswordReset(email.trim());
        setIsForgotPassword(false);
      } catch (err) {
        // error handled in context
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (password.length < 8) {
      showToast('Le mot de passe doit contenir au moins 8 caractères.', 'error');
      return;
    }

    // Inscription Mode
    if (activeMode === 'register') {
      if (!nameValidation.isValid) {
        showToast('Veuillez renseigner votre nom complet (au moins 2 caractères).', 'error');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Les mots de passe ne correspondent pas.', 'error');
        return;
      }

      setIsSubmitting(true);
      try {
        await registerWithEmail(email.trim(), password, name.trim(), phoneNumber.trim());
        setShowAuthModal(false);
      } catch (err) {
        // Handled in context
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Connexion Mode
      setIsSubmitting(true);
      try {
        await loginWithEmail(email.trim(), password);
        setShowAuthModal(false);
      } catch (err) {
        // Handled in context
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneValidation.isValid) {
      showToast('Veuillez saisir un numéro de téléphone valide à 10 chiffres', 'error');
      return;
    }
    if (activeMode === 'register' && !nameValidation.isValid) {
      showToast('Veuillez indiquer votre nom complet pour l\'inscription.', 'error');
      return;
    }
    setPhoneStep('otp');
    showToast(`Code SMS envoyé au +225 ${phoneNumber} (Code test : 1234)`, 'info');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length < 4) {
      showToast('Veuillez saisir le code reçu à 4 chiffres', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await loginWithPhone(phoneNumber.replace(/\s+/g, ''), selectedRole, name.trim());
      setShowAuthModal(false);
    } catch (err) {
      showToast('Erreur lors de la validation du code SMS', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSubmit = async (chosenEmail?: string, chosenName?: string) => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle(chosenEmail, chosenName);
      setShowAuthModal(false);
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la connexion avec Google', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFastDemoLogin = async (role: UserRole, customName: string) => {
    let uid = 'client-touriste';
    let phone = '+225 07 12 34 56 78';
    let isVerif = false;

    if (role === 'proprietaire') {
      uid = 'owner-koffi';
      phone = '+225 07 08 12 34 56';
      customName = 'Koffi & Frères Immobilier';
      isVerif = true;
    } else if (role === 'admin') {
      uid = 'admin-demo';
      phone = '+225 01 00 00 00 00';
      customName = 'Administrateur IvoireImmo';
      isVerif = true;
    }

    const profile = {
      id: uid,
      nom: customName,
      telephone: phone,
      commune: 'Cocody',
      roles: [role === 'admin' ? 'chercheur' : role, 'proprietaire'],
      espaceActif: role === 'proprietaire' ? 'proprietaire' : 'chercheur',
      profilComplet: true,
      verifie: isVerif,
      emailVerified: true,
      phoneVerified: true,
      bloque: false,
      dateCreation: new Date().toISOString(),
    };

    localStorage.setItem('ivoire_user', JSON.stringify(profile));
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#132219] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-200/90 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header Bar */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0F6B3F]/15 dark:bg-[#0F6B3F]/30 flex items-center justify-center text-[#0F6B3F] dark:text-[#34D399]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-gray-900 dark:text-white leading-tight">
                {isForgotPassword
                  ? 'Mot de passe oublié'
                  : activeMode === 'login'
                  ? 'Bienvenue sur IvoireImmo'
                  : 'Créer votre compte unique'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isForgotPassword
                  ? 'Récupérez l\'accès à votre compte'
                  : activeMode === 'login'
                  ? 'Connectez-vous pour accéder à vos services'
                  : 'Rejoignez-nous en moins d\'une minute'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAuthModal(false)}
            aria-label="Fermer la fenêtre de connexion"
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          
          {/* 1. SEPARATED MODE SELECTOR: Connexion vs Inscription */}
          {!isForgotPassword && (
            <div className="p-1 bg-gray-100 dark:bg-[#1a2d22] rounded-2xl flex border border-gray-200/80 dark:border-gray-800">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('login');
                  setIsForgotPassword(false);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeMode === 'login'
                    ? 'bg-white dark:bg-[#132219] text-[#0F6B3F] dark:text-[#34D399] shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Se connecter</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMode('register');
                  setIsForgotPassword(false);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeMode === 'register'
                    ? 'bg-white dark:bg-[#132219] text-[#0F6B3F] dark:text-[#34D399] shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>S'inscrire</span>
              </button>
            </div>
          )}

          {/* 2. CHOOSE METHOD: E-mail, Téléphone, Google */}
          {!isForgotPassword && (
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                Moyen d'accès :
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    authMethod === 'email'
                      ? 'border-[#0F6B3F] bg-emerald-50 dark:bg-emerald-950/40 text-[#0F6B3F] dark:text-[#34D399] ring-2 ring-[#0F6B3F]/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2d22] text-gray-600 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>E-mail</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    authMethod === 'phone'
                      ? 'border-[#0F6B3F] bg-emerald-50 dark:bg-emerald-950/40 text-[#0F6B3F] dark:text-[#34D399] ring-2 ring-[#0F6B3F]/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2d22] text-gray-600 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Téléphone</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMethod('google')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    authMethod === 'google'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2d22] text-gray-600 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.41 7.34 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.13z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.59 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                  </svg>
                  <span>Google</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. GOOGLE ACCOUNT CHOOSER SECTION */}
          {authMethod === 'google' && !isForgotPassword && (
            <div className="pt-1">
              <GoogleAccountPicker
                onSelectAccount={(chosenEmail, chosenName) =>
                  handleGoogleSubmit(chosenEmail, chosenName)
                }
                onOpenNativePopup={() => loginWithGoogle()}
                isLoading={isSubmitting}
              />
            </div>
          )}

          {/* 4. FORGOT PASSWORD VIEW */}
          {isForgotPassword && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                  <KeyRound className="w-4 h-4 text-[#F28C1B]" />
                  <span>Récupération du mot de passe</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Indiquez l'adresse e-mail associée à votre compte IvoireImmo. Vous recevrez immédiatement un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Votre adresse e-mail *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => markTouched('email')}
                    placeholder="votre.email@domaine.ci"
                    className={`w-full bg-gray-50 dark:bg-[#1a2d22] border rounded-2xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition-colors ${
                      touched.email
                        ? emailValidation.isValid
                          ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#0F6B3F]'
                    }`}
                  />
                  {touched.email && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {emailValidation.isValid ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {touched.email && (
                  <p
                    className={`text-[11px] mt-1 font-medium ${
                      emailValidation.isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                    }`}
                  >
                    {emailValidation.message}
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !emailValidation.isValid}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#0F6B3F] hover:bg-[#0B5431] active:scale-[0.98] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-center"
                >
                  Retour à la connexion
                </button>
              </div>
            </form>
          )}

          {/* 5. METHOD: E-MAIL FORM (Connexion ou Inscription) */}
          {authMethod === 'email' && !isForgotPassword && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              
              {/* Field: Nom complet (Only in Register mode) */}
              {activeMode === 'register' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                      Nom complet *
                    </label>
                    {touched.name && (
                      <span
                        className={`text-[10px] font-semibold ${
                          nameValidation.isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                        }`}
                      >
                        {nameValidation.message}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => markTouched('name')}
                      placeholder="Ex: Koffi Kouassi"
                      className={`w-full bg-gray-50 dark:bg-[#1a2d22] border rounded-2xl pl-3.5 pr-9 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition-colors ${
                        touched.name
                          ? nameValidation.isValid
                            ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                            : 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#0F6B3F]'
                      }`}
                    />
                    {touched.name && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {nameValidation.isValid ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Field: Adresse e-mail */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                    Adresse e-mail *
                  </label>
                  {touched.email && (
                    <span
                      className={`text-[10px] font-semibold ${
                        emailValidation.isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                      }`}
                    >
                      {emailValidation.message}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => markTouched('email')}
                    placeholder="votre.email@domaine.ci"
                    className={`w-full bg-gray-50 dark:bg-[#1a2d22] border rounded-2xl pl-3.5 pr-9 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition-colors ${
                      touched.email
                        ? emailValidation.isValid
                          ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#0F6B3F]'
                    }`}
                  />
                  {touched.email && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {emailValidation.isValid ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Field: Mot de passe */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                    Mot de passe *
                  </label>
                  {activeMode === 'login' ? (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[11px] font-extrabold text-[#F28C1B] hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  ) : (
                    password.length > 0 && (
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                        Force :{' '}
                        <strong
                          className={
                            passwordValidation.score >= 3
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : passwordValidation.hasMinLen
                              ? 'text-amber-500'
                              : 'text-red-500'
                          }
                        >
                          {passwordValidation.strengthLabel}
                        </strong>
                      </span>
                    )
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => markTouched('password')}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-2xl pl-3.5 pr-10 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#0F6B3F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                    aria-label="Afficher / Masquer le mot de passe"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Real-time Dynamic Password Guidance (Only in Register mode) */}
                {activeMode === 'register' && (
                  <div className="mt-2 space-y-1.5 p-2.5 rounded-xl bg-gray-50 dark:bg-[#1a2d22] border border-gray-100 dark:border-gray-800 text-[11px]">
                    {/* Visual Strength Progress Bar */}
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full transition-all duration-300 ${passwordValidation.strengthColor}`}
                        style={{
                          width: `${Math.min(100, Math.max(10, (passwordValidation.score / 4) * 100))}%`,
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1 pt-1 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                            passwordValidation.hasMinLen
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-300 dark:bg-gray-700 text-gray-500'
                          }`}
                        >
                          {passwordValidation.hasMinLen ? '✓' : '•'}
                        </span>
                        <span>8 caractères minimum</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                            passwordValidation.hasLetter
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-300 dark:bg-gray-700 text-gray-500'
                          }`}
                        >
                          {passwordValidation.hasLetter ? '✓' : '•'}
                        </span>
                        <span>Au moins 1 lettre</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                            passwordValidation.hasNumber
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-300 dark:bg-gray-700 text-gray-500'
                          }`}
                        >
                          {passwordValidation.hasNumber ? '✓' : '•'}
                        </span>
                        <span>Au moins 1 chiffre</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                            passwordValidation.hasSpecial
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-300 dark:bg-gray-700 text-gray-500'
                          }`}
                        >
                          {passwordValidation.hasSpecial ? '✓' : '•'}
                        </span>
                        <span>Caractère spécial (optionnel)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Field: Confirmer le mot de passe (Only in Register mode) */}
              {activeMode === 'register' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                      Confirmer le mot de passe *
                    </label>
                    {touched.confirmPassword && (
                      <span
                        className={`text-[10px] font-semibold ${
                          confirmPasswordValidation.isValid
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-500'
                        }`}
                      >
                        {confirmPasswordValidation.message}
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => markTouched('confirmPassword')}
                      placeholder="••••••••"
                      className={`w-full bg-gray-50 dark:bg-[#1a2d22] border rounded-2xl pl-3.5 pr-10 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition-colors ${
                        touched.confirmPassword
                          ? confirmPasswordValidation.isValid
                            ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                            : 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#0F6B3F]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                      aria-label="Afficher / Masquer la confirmation"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#0F6B3F] hover:bg-[#0B5431] active:scale-[0.98] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <span>
                    {isSubmitting
                      ? 'Traitement en cours...'
                      : activeMode === 'login'
                      ? 'Se connecter par E-mail'
                      : 'Créer mon compte par E-mail'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* 6. METHOD: TELEPHONE FORM */}
          {authMethod === 'phone' && !isForgotPassword && (
            <div>
              {phoneStep === 'phone' ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  {/* Name field in register mode */}
                  {activeMode === 'register' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                          Nom complet *
                        </label>
                        {touched.name && (
                          <span
                            className={`text-[10px] font-semibold ${
                              nameValidation.isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                            }`}
                          >
                            {nameValidation.message}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => markTouched('name')}
                        placeholder="Ex: Koffi Kouassi"
                        className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-2xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#0F6B3F]"
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                        Numéro de téléphone en Côte d'Ivoire *
                      </label>
                      <span
                        className={`text-[10px] font-semibold ${
                          phoneValidation.isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'
                        }`}
                      >
                        {phoneValidation.helper}
                      </span>
                    </div>

                    <div className="flex rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2d22] focus-within:ring-2 focus-within:ring-[#0F6B3F]">
                      <div className="px-3.5 py-3 bg-gray-200/70 dark:bg-gray-800 text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 shrink-0 border-r border-gray-300 dark:border-gray-700">
                        <span>🇨🇮</span>
                        <span>+225</span>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="07 00 00 00 00"
                        value={phoneNumber}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        onBlur={() => markTouched('phone')}
                        className="w-full px-3.5 py-3 text-sm font-semibold text-gray-900 dark:text-white bg-transparent focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Un code SMS gratuit de validation vous sera envoyé.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={!phoneValidation.isValid || (activeMode === 'register' && !nameValidation.isValid)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#0F6B3F] hover:bg-[#0B5431] active:scale-[0.98] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <span>Recevoir le code SMS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="bg-[#F2F6F0] dark:bg-[#1a2d22] p-3.5 rounded-2xl text-xs text-gray-700 dark:text-gray-300 border border-[#0F6B3F]/20">
                    Code envoyé au <strong className="text-[#0F6B3F]">+225 {phoneNumber}</strong>.
                    <div className="text-[11px] text-gray-500 mt-1">
                      Code de test instantané : <strong className="text-gray-800 dark:text-gray-100 font-mono">1234</strong>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Saisissez le code SMS à 4 chiffres *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      placeholder="1234"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full text-center tracking-widest text-2xl font-black bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-2xl py-3 text-[#0F6B3F] focus:outline-none focus:ring-2 focus:ring-[#0F6B3F]"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setPhoneStep('phone')}
                      className="py-3 px-4 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Modifier le numéro
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || otpCode.trim().length < 4}
                      className="flex-1 py-3 px-4 rounded-2xl bg-[#0F6B3F] hover:bg-[#0B5431] text-white font-extrabold text-sm shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? 'Validation...' : 'Valider le code'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Quick Demo Fast Login Footer */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Comptes de test rapide (1-Clic) :
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">Mode Démo</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleFastDemoLogin('chercheur', 'Christian Kouassi (Chercheur)')}
                className="py-1.5 px-2 bg-gray-100 dark:bg-gray-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[11px] font-semibold rounded-xl text-gray-700 dark:text-gray-300 transition-colors truncate"
                title="Connexion test Chercheur"
              >
                🔍 Chercheur
              </button>
              <button
                type="button"
                onClick={() => handleFastDemoLogin('proprietaire', 'Koffi Immobilier (Bailleur)')}
                className="py-1.5 px-2 bg-gray-100 dark:bg-gray-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[11px] font-semibold rounded-xl text-gray-700 dark:text-gray-300 transition-colors truncate"
                title="Connexion test Propriétaire"
              >
                🏡 Propriétaire
              </button>
              <button
                type="button"
                onClick={() => handleFastDemoLogin('admin', 'Administrateur IvoireImmo')}
                className="py-1.5 px-2 bg-amber-100 dark:bg-amber-950/50 hover:bg-amber-200 text-[11px] font-bold rounded-xl text-amber-900 dark:text-amber-200 transition-colors truncate"
                title="Connexion test Administrateur"
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
