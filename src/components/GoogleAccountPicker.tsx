import React, { useState } from 'react';
import { Check, Plus, User, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';

export interface GoogleAccountItem {
  email: string;
  name: string;
  isPrimary?: boolean;
}

interface Props {
  onSelectAccount: (email: string, name: string) => Promise<void> | void;
  onOpenNativePopup?: () => void;
  isLoading?: boolean;
}

export const GoogleAccountPicker: React.FC<Props> = ({
  onSelectAccount,
  onOpenNativePopup,
  isLoading = false,
}) => {
  const defaultAccounts: GoogleAccountItem[] = [
    {
      email: 'toyogotoure8@gmail.com',
      name: 'Toure Toyogo',
      isPrimary: true,
    },
  ];

  const [accounts, setAccounts] = useState<GoogleAccountItem[]>(() => {
    try {
      const saved = localStorage.getItem('ivoire_google_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // Ignore
    }
    return defaultAccounts;
  });

  const [selectedEmail, setSelectedEmail] = useState<string>(accounts[0]?.email || 'toyogotoure8@gmail.com');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');

  const handleChoose = async (email: string, name: string) => {
    setSelectedEmail(email);
    await onSelectAccount(email, name);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newEmail.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) return;

    const cleanName = newName.trim() || cleanEmail.split('@')[0];
    const updated = [
      ...accounts.filter((a) => a.email.toLowerCase() !== cleanEmail.toLowerCase()),
      { email: cleanEmail, name: cleanName, isPrimary: false },
    ];
    setAccounts(updated);
    try {
      localStorage.setItem('ivoire_google_accounts', JSON.stringify(updated));
    } catch (err) {
      // Ignore
    }
    setSelectedEmail(cleanEmail);
    setShowAddForm(false);
    setNewEmail('');
    setNewName('');
    onSelectAccount(cleanEmail, cleanName);
  };

  const currentSelected = accounts.find((a) => a.email === selectedEmail) || accounts[0];

  return (
    <div className="bg-white dark:bg-[#16261c] rounded-2xl border border-gray-200 dark:border-gray-700/80 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Google Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
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
        <div>
          <h4 className="font-black text-sm text-gray-900 dark:text-white leading-tight">
            Choisir un compte Google
          </h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Pour continuer vers IvoireImmo
          </p>
        </div>
      </div>

      {/* Account List */}
      <div className="space-y-2">
        {accounts.map((acc) => {
          const isSelected = acc.email === selectedEmail;
          return (
            <button
              key={acc.email}
              type="button"
              onClick={() => setSelectedEmail(acc.email)}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50/50 dark:bg-gray-800/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {acc.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-gray-900 dark:text-white truncate">
                      {acc.name}
                    </span>
                    {acc.isPrimary && (
                      <span className="text-[9px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 px-1.5 py-0.5 rounded-full shrink-0">
                        Principal
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {acc.email}
                  </p>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}

        {/* Option to Add / Use another Google account */}
        {!showAddForm ? (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="w-full p-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-400 text-gray-600 dark:text-gray-300 hover:text-blue-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Utiliser un autre compte Google</span>
          </button>
        ) : (
          <form
            onSubmit={handleAddAccount}
            className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-blue-200 dark:border-blue-900/50 space-y-2.5 animate-in fade-in duration-150"
          >
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block">
              Saisir un autre compte Google :
            </span>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="votre.compte@gmail.com"
              className="w-full bg-white dark:bg-[#132219] border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Votre Nom & Prénom"
              className="w-full bg-white dark:bg-[#132219] border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 text-xs font-semibold text-gray-500 hover:text-gray-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Ajouter et sélectionner
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        disabled={isLoading || !currentSelected}
        onClick={() => currentSelected && handleChoose(currentSelected.email, currentSelected.name)}
        className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span>
          {isLoading
            ? 'Connexion en cours...'
            : currentSelected
            ? `Continuer en tant que ${currentSelected.name.split(' ')[0]}`
            : 'Continuer avec Google'}
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* External native popup test fallback */}
      {onOpenNativePopup && (
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={onOpenNativePopup}
            className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 inline-flex items-center gap-1 hover:underline font-medium"
          >
            <span>Ouvrir la pop-up de connexion externe Google</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Google security notice */}
      <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-normal">
        Pour continuer, Google partage votre nom, votre adresse e-mail et votre photo de profil avec IvoireImmo conformément aux règles de confidentialité.
      </p>
    </div>
  );
};
