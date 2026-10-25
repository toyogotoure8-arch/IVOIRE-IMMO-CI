import React, { useState } from 'react';
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
} from 'lucide-react';

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

  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | 'google'>('email');
  const [emailMode, setEmailMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Phone state
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('07');
  const [otpCode, setOtpCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showAuthModal) return null;

  // Phone login submit
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 8) {
      showToast('Veuillez saisir un numéro de téléphone valide (10 chiffres)', 'error');
      return;
    }
    setStep('otp');
    showToast('Code SMS de validation envoyé ! Code test : 1234', 'info');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithPhone(phoneNumber, selectedRole, userName);
  };

  // Email login/register submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast('Veuillez saisir votre adresse e-mail', 'error');
      return;
    }

    if (emailMode === 'forgot') {
      setIsSubmitting(true);
      try {
        await sendPasswordReset(email);
        setEmailMode('login');
      } catch (err) {
        // Error handled in sendPasswordReset
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (password.length < 8) {
      showToast('Le mot de passe doit contenir au moins 8 caractères.', 'error');
      return;
    }

    if (emailMode === 'register') {
      if (password !== confirmPassword) {
        showToast('Les mots de passe ne correspondent pas.', 'error');
        return;
      }
      setIsSubmitting(true);
      try {
        await registerWithEmail(email, password, userName, phoneNumber);
      } catch (err) {
        // Error handled in registerWithEmail
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(true);
      try {
        await loginWithEmail(email, password);
      } catch (err) {
        // Error handled in loginWithEmail
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFastDemoLogin = async (role: UserRole, name: string) => {
    let uid = 'client-touriste';
    let phone = '+225 07 12 34 56 78';
    let isVerif = false;

    if (role === 'proprietaire') {
      uid = 'owner-koffi';
      phone = '+225 07 08 12 34 56';
      name = 'Koffi & Frères Immobilier';
      isVerif = true;
    } else if (role === 'admin') {
      uid = 'admin-demo';
      phone = '+225 01 00 00 00 00';
      name = 'Administrateur IvoireImmo';
      isVerif = true;
    }

    const profile = {
      id: uid,
      nom: name,
      telephone: phone,
      commune: 'Cocody',
      roles: [role === 'admin' ? 'chercheur' : role, 'proprietaire'],
      espaceActif: role === 'proprietaire' ? 'proprietaire' : 'chercheur',
      profilComplet: true,
      verifie: isVerif,
      bloque: false,
      dateCreation: new Date().toISOString(),
    };

    localStorage.setItem('ivoire_user', JSON.stringify(profile));
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#132219] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-200/80 dark:border-gray-800 animate-in zoom-in-95 duration-200 p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#0F6B3F] dark:text-[#34D399]">
            <ShieldCheck className="w-6 h-6" />
            <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
              Connexion / Inscription
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAuthModal(false)}
            aria-label="Fermer la fenêtre de connexion"
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 VISIBLE CHOICES: Téléphone, E-mail, Continuer avec Google */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 dark:bg-[#1a2d22] rounded-2xl">
          <button
            type="button"
            onClick={() => setAuthMethod('email')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'email'
                ? 'bg-white dark:bg-[#132219] text-[#0F6B3F] dark:text-[#34D399] shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>E-mail</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMethod('phone')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'phone'
                ? 'bg-white dark:bg-[#132219] text-[#0F6B3F] dark:text-[#34D399] shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Téléphone</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('google');
              loginWithGoogle();
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'google'
                ? 'bg-white dark:bg-[#132219] text-blue-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.41 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.59 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>Google</span>
          </button>
        </div>

        {/* METHOD 1: EMAIL */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            
            {/* Toggle Connexion / Inscription */}
            {emailMode !== 'forgot' && (
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                <button
                  type="button"
                  onClick={() => setEmailMode('login')}
                  className={`text-xs font-black pb-1 transition-all ${
                    emailMode === 'login'
                      ? 'text-[#0F6B3F] dark:text-[#34D399] border-b-2 border-[#0F6B3F]'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Se connecter
                </button>
                <button
                  type="button"
                  onClick={() => setEmailMode('register')}
                  className={`text-xs font-black pb-1 transition-all ${
                    emailMode === 'register'
                      ? 'text-[#0F6B3F] dark:text-[#34D399] border-b-2 border-[#0F6B3F]'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Créer un compte par e-mail
                </button>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Adresse e-mail *
              </label>
              <input
                type="email"
                required
                placeholder="votre.nom@domaine.ci"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-2xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6B3F]"
              />
            </div>

            {/* Password Fields for Login or Register */}
            {emailMode !== 'forgot' && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                      Mot de passe (8 caractères minimum) *
                    </label>
                    {emailMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setEmailMode('forgot')}
                        className="text-[11px] font-extrabold text-[#F28C1B] hover:underline"
                      >
                        Mot de passe oublié ?
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-2xl pl-3.5 pr-10 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6B3F]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                      aria-label="Afficher / Masquer le mot de passe"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {emailMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Confirmer le mot de passe *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-2xl pl-3.5 pr-10 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6B3F]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                        aria-label="Afficher / Masquer la confirmation"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Forgot Password Mode Note */}
            {emailMode === 'forgot' && (
              <p className="text-xs text-gray-500">
                Un e-mail contenant un lien sécurisé de réinitialisation vous sera envoyé à l'adresse indiquée ci-dessus.
              </p>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#0F6B3F] hover:bg-[#0B5431] active:scale-[0.98] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Traitement...</span>
                ) : emailMode === 'forgot' ? (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Envoyer le lien de réinitialisation</span>
                  </>
                ) : emailMode === 'register' ? (
                  <>
                    <span>S'inscrire par E-mail</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Se connecter par E-mail</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {emailMode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => setEmailMode('login')}
                  className="w-full mt-2 text-xs font-bold text-gray-500 hover:underline text-center block"
                >
                  Retour à la connexion
                </button>
              )}
            </div>
          </form>
        )}

        {/* METHOD 2: TELEPHONE */}
        {authMethod === 'phone' && (
          <div>
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Votre nom complet
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Koffi Kouassi"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-2xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6B3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Numéro de téléphone en Côte d'Ivoire
                  </label>
                  <div className="flex rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1a2d22] focus-within:ring-2 focus-within:ring-[#0F6B3F]">
                    <div className="px-3.5 py-3 bg-gray-200/70 dark:bg-gray-800 text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 shrink-0 border-r border-gray-300 dark:border-gray-700">
                      <span>🇨🇮</span>
                      <span>+225</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="07 00 00 00 00"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full px-3.5 py-3 text-sm font-semibold text-gray-900 dark:text-white bg-transparent focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Un code SMS gratuit vous sera envoyé.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#0F6B3F] hover:bg-[#0B5431] active:scale-[0.98] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Recevoir le code SMS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="bg-[#F2F6F0] dark:bg-[#1a2d22] p-3 rounded-xl text-xs text-gray-700 dark:text-gray-300">
                  Code envoyé au <strong className="text-[#0F6B3F]">+225 {phoneNumber}</strong>. (Code d'essai : <strong>1234</strong>)
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Entrez le code à 4 chiffres
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="1234"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    autoFocus
                    required
                    className="w-full text-center tracking-widest text-2xl font-black bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-2xl py-3 text-[#0F6B3F] focus:outline-none focus:ring-2 focus:ring-[#0F6B3F]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="py-3 px-4 border border-gray-300 dark:border-gray-700 text-gray-600 rounded-2xl text-xs font-bold"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-2xl bg-[#0F6B3F] text-white font-extrabold text-sm shadow-md"
                  >
                    Confirmer le code
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* METHOD 3: GOOGLE */}
        {authMethod === 'google' && (
          <div className="space-y-3 py-2 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Connexion instantanée sécurisée par Google.
            </p>
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2.5 shadow-sm transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.41 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.59 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Continuer avec Google</span>
            </button>
          </div>
        )}

        {/* Demo Fast Login Shortcuts */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2 text-center">
            Comptes de test rapide (1-Clic)
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleFastDemoLogin('client', 'Christian Kouassi (Client)')}
              className="py-1.5 px-2 bg-gray-100 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[11px] font-semibold rounded-lg text-gray-700 dark:text-gray-300"
            >
              👤 Client
            </button>
            <button
              type="button"
              onClick={() => handleFastDemoLogin('proprietaire', 'Koffi Immobilier (Bailleur)')}
              className="py-1.5 px-2 bg-gray-100 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[11px] font-semibold rounded-lg text-gray-700 dark:text-gray-300"
            >
              🏡 Bailleur
            </button>
            <button
              type="button"
              onClick={() => handleFastDemoLogin('admin', 'Administrateur IvoireImmo')}
              className="py-1.5 px-2 bg-amber-100 dark:bg-amber-950/50 hover:bg-amber-200 text-[11px] font-bold rounded-lg text-amber-900 dark:text-amber-200"
            >
              🛡️ Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

