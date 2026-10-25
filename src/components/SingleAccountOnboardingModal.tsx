import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppSpace, OwnerType } from '../types';
import { COMMUNES_ABIDJAN, AUTRES_VILLES } from '../constants/ciData';
import {
  X,
  UserCheck,
  Building2,
  Search,
  ShieldCheck,
  Phone,
  MapPin,
  FileCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

interface Props {
  targetSpace: AppSpace;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SingleAccountOnboardingModal: React.FC<Props> = ({ targetSpace, onClose, onSuccess }) => {
  const { currentUser, registerSingleAccount, addRoleToAccount, showToast } = useApp();

  const isAddingRoleOnly = Boolean(currentUser && !currentUser.roles.includes(targetSpace));

  // Common Fields (Only needed if user doesn't exist yet)
  const [nom, setNom] = useState(currentUser?.nom || '');
  const [prenoms, setPrenoms] = useState(currentUser?.prenoms || '');
  const [telephone, setTelephone] = useState(currentUser?.telephone || '+225 ');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [commune, setCommune] = useState(currentUser?.commune || 'Cocody');

  // Donnees Chercheur
  const [budgetMax, setBudgetMax] = useState<number | ''>(currentUser?.donneesChercheur?.budgetMaxPrefe || '');
  const [typeRecherche, setTypeRecherche] = useState(currentUser?.donneesChercheur?.typeRecherche || 'Location d\'appartement / villa');

  // Donnees Proprietaire
  const [typeProfil, setTypeProfil] = useState<OwnerType>(currentUser?.donneesProprietaire?.typeProfil || 'particulier');
  const [nomCommercial, setNomCommercial] = useState(currentUser?.donneesProprietaire?.nomCommercial || '');
  const [whatsappPro, setWhatsappPro] = useState(currentUser?.donneesProprietaire?.whatsappPro || '');
  const [adressePro, setAdressePro] = useState(currentUser?.donneesProprietaire?.adressePro || '');
  const [pieceIdentiteUrl, setPieceIdentiteUrl] = useState(currentUser?.donneesProprietaire?.pieceIdentiteUrl || '');
  const [pieceIdentiteType, setPieceIdentiteType] = useState(currentUser?.donneesProprietaire?.pieceIdentiteType || 'CNI Ivoirienne');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      // 1. Initial Account Creation
      if (!nom.trim()) {
        showToast('Veuillez entrer votre nom', 'error');
        return;
      }
      if (!telephone.trim() || telephone.trim().length < 8) {
        showToast('Veuillez entrer un numéro de téléphone valide (+225...)', 'error');
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
      } catch (err) {
        showToast('Erreur lors de la création du compte', 'error');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // 2. Add Role Only to Existing Account (Single Account Model)
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
      } catch (err) {
        showToast('Erreur lors de l\'activation du statut', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#16261c] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
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
                {isAddingRoleOnly ? 'Ajouter ce statut à mon compte' : 'Création de profil unique (1 seul compte)'}
              </div>
              <h3 className="text-lg sm:text-xl font-black">
                {targetSpace === 'chercheur'
                  ? 'Activer le profil Chercheur'
                  : 'Activer le profil Propriétaire'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Notice when adding role to existing account */}
          {isAddingRoleOnly && currentUser && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-600/30 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#0F6B3F] shrink-0 mt-0.5" />
              <div className="text-xs text-gray-700 dark:text-gray-300">
                <span className="font-bold text-[#0F6B3F] dark:text-[#34D399]">
                  Compte unique conservé : {currentUser.nom} {currentUser.prenoms || ''}
                </span>
                <p className="mt-0.5 text-gray-500">
                  Tél : {currentUser.telephone} • Commune : {currentUser.commune}. Vos coordonnées sont réutilisées. Remplissez uniquement les critères ci-dessous.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 1: COMMON INFORMATIONS (Only shown on initial sign-up) */}
          {!currentUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 pb-1 border-b border-gray-100 dark:border-gray-800">
                <UserCheck className="w-4 h-4 text-[#0F6B3F]" />
                <span>Informations Personnelles Communes</span>
              </div>

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
                    className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
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
                    className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>

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
                    className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Adresse e-mail (contact)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@domaine.ci"
                    className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Commune de résidence *
                </label>
                <select
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                >
                  <optgroup label="Abidjan">
                    {COMMUNES_ABIDJAN.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Intérieur du Pays">
                    {AUTRES_VILLES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          )}


          {/* SECTION 2: SPECIFIC FIELDS FOR CHERCHEUR */}
          {targetSpace === 'chercheur' && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-[#34D399] pb-1 border-b border-gray-100 dark:border-gray-800">
                <Search className="w-4 h-4 text-[#0F6B3F]" />
                <span>Critères de Recherche (Profil Chercheur)</span>
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
                  className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Type de bien ou service recherché
                </label>
                <select
                  value={typeRecherche}
                  onChange={(e) => setTypeRecherche(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                >
                  <option value="Location d'appartement / villa">Location d'appartement ou villa</option>
                  <option value="Achat de maison / immeuble">Achat immobilier (Maison / Immeuble)</option>
                  <option value="Résidence meublée / Court séjour">Résidence meublée / Court séjour (Airbnb)</option>
                  <option value="Achat de terrain avec ACD">Achat de terrain certifié ACD</option>
                  <option value="Bail commercial / Bureau">Bail commercial / Bureau / Magasin</option>
                </select>
              </div>
            </div>
          )}

          {/* SECTION 3: SPECIFIC FIELDS FOR PROPRIETAIRE */}
          {targetSpace === 'proprietaire' && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 pb-1 border-b border-gray-100 dark:border-gray-800">
                <Building2 className="w-4 h-4 text-[#F28C1B]" />
                <span>Informations Bailleur / Propriétaire</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Type de profil propriétaire / bailleur *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTypeProfil('particulier')}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                      typeProfil === 'particulier'
                        ? 'border-[#F28C1B] bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>Particulier (Bailleur privé)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeProfil('agence')}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                      typeProfil === 'agence'
                        ? 'border-[#F28C1B] bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>Agence Immobilière Agréée</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeProfil('hotelier')}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                      typeProfil === 'hotelier'
                        ? 'border-[#F28C1B] bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>Hôtelier / Résidence meublée</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeProfil('promoteur')}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                      typeProfil === 'promoteur'
                        ? 'border-[#F28C1B] bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>Promoteur Immobilier</span>
                  </button>
                </div>
              </div>

              {(typeProfil === 'agence' || typeProfil === 'hotelier' || typeProfil === 'promoteur') && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Nom commercial / Raison sociale
                  </label>
                  <input
                    type="text"
                    value={nomCommercial}
                    onChange={(e) => setNomCommercial(e.target.value)}
                    placeholder="Ex: Cabinet Immobilier Ivoire SARL"
                    className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
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
                    className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
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
                    placeholder="Ex: Cocody II Plateaux Vallon, Immeuble..."
                    className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Identity document requested ONLY for owner profile */}
              <div className="bg-amber-50/80 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900 dark:text-amber-200">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Vérification d'identité Propriétaire (Visible par l'administrateur uniquement)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Type de document d'identité
                    </label>
                    <select
                      value={pieceIdentiteType}
                      onChange={(e) => setPieceIdentiteType(e.target.value)}
                      className="w-full bg-white dark:bg-[#1a2d22] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white"
                    >
                      <option value="CNI Ivoirienne">CNI Ivoirienne</option>
                      <option value="Passeport">Passeport</option>
                      <option value="Registre de Commerce DFC">Registre de Commerce (DFC)</option>
                      <option value="Carte Consulaire / Résident">Carte de Résident / Consulaire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Lien ou photo de la pièce
                    </label>
                    <input
                      type="url"
                      value={pieceIdentiteUrl}
                      onChange={(e) => setPieceIdentiteUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white dark:bg-[#1a2d22] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80">
                  Conformément aux exigences de sécurité, ce document permet d'obtenir le macaron « Propriétaire Vérifié ». Il est strictement confidentiel et accessible uniquement par l'administrateur.
                </p>
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
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
              <span>{isSubmitting ? 'Enregistrement...' : isAddingRoleOnly ? 'Activer ce statut' : 'Valider & Entrer'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
