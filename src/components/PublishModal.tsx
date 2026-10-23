import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryType } from '../types';
import { COMMUNES_ABIDJAN, AUTRES_VILLES, EQUIPEMENTS_LIST, CATEGORIES_CONFIG, COORDONNEES_LOCALITES } from '../constants/ciData';
import { compressImageFile } from '../utils/imageCompressor';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  MapPin,
  Sparkles,
  Info,
  Trash2,
  Phone,
  AlertCircle,
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const PublishModal: React.FC<Props> = ({ onClose }) => {
  const { addListing, currentUser, setShowAuthModal, showToast } = useApp();

  const [categorie, setCategorie] = useState<CategoryType>('location');
  const [type, setType] = useState('Studio');
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState<number | ''>('');
  const [commune, setCommune] = useState('Cocody');
  const [quartier, setQuartier] = useState('');
  const [pieces, setPieces] = useState<number>(1);
  const [equipements, setEquipements] = useState<string[]>(['eau', 'electricite']);
  const [telephone, setTelephone] = useState(currentUser?.telephone || '+225 07 00 00 00 00');
  const [photos, setPhotos] = useState<string[]>([]);
  const [compressionStats, setCompressionStats] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available types based on selected category
  const currentCategoryConfig = CATEGORIES_CONFIG.find((c) => c.id === categorie) || CATEGORIES_CONFIG[0];

  const handleCategoryChange = (newCat: CategoryType) => {
    setCategorie(newCat);
    const catConf = CATEGORIES_CONFIG.find((c) => c.id === newCat);
    if (catConf && catConf.types.length > 0) {
      setType(catConf.types[0]);
    }
  };

  const handleEquipementToggle = (id: string) => {
    setEquipements((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 10) {
      showToast('Maximum 10 photos autorisées par annonce', 'error');
      return;
    }

    setIsCompressing(true);
    const newPhotos: string[] = [];
    const newStats: string[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        const res = await compressImageFile(file, 1280, 0.82);
        newPhotos.push(res.dataUrl);
        newStats.push(`-${res.reductionPercentage}%`);
      } catch (err) {
        console.error('Compression error:', err);
      }
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
    setCompressionStats((prev) => [...prev, ...newStats]);
    setIsCompressing(false);
    showToast(`${newPhotos.length} photo(s) compressée(s) à 1280px prête(s) !`, 'success');
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setCompressionStats((prev) => prev.filter((_, i) => i !== idx));
  };

  const [ownerName, setOwnerName] = useState(currentUser?.nom || '');

  const handleAddPresetPhotos = () => {
    const presets = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ];
    setPhotos((prev) => [...prev, ...presets].slice(0, 10));
    setCompressionStats((prev) => [...prev, '-75%', '-68%', '-72%'].slice(0, 10));
    showToast('3 photos haute définition ajoutées !', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titre.trim() || !prix || !quartier.trim()) {
      showToast('Veuillez remplir tous les champs obligatoires (titre, prix, quartier)', 'error');
      return;
    }

    if (photos.length === 0) {
      showToast('Veuillez ajouter au moins 1 photo pour illustrer votre annonce', 'error');
      return;
    }

    let ownerId = currentUser?.id;
    let ownerNom = currentUser?.nom || ownerName.trim() || 'Bailleur IvoireImmo';
    let isVerif = currentUser?.verifie || false;

    if (!currentUser) {
      const cleanDigits = telephone.replace(/[^0-9]/g, '');
      ownerId = 'owner-' + (cleanDigits || Date.now());
      const guestProfile = {
        id: ownerId,
        nom: ownerNom,
        telephone: telephone.startsWith('+225') ? telephone : `+225 ${telephone}`,
        role: 'proprietaire' as const,
        verifie: false,
        dateCreation: new Date().toISOString(),
      };
      localStorage.setItem('ivoire_user', JSON.stringify(guestProfile));
    }

    setIsSubmitting(true);
    try {
      const positionCoords = COORDONNEES_LOCALITES[commune] || { lat: 5.34, lng: -4.0 };
      await addListing({
        ownerId: ownerId || 'owner-' + Date.now(),
        ownerNom,
        ownerTelephone: telephone,
        ownerVerifie: isVerif,
        categorie,
        type,
        titre: titre.trim(),
        description: description.trim() || `${type} bien situé à ${commune} (${quartier}). Disponible immédiatement.`,
        prix: Number(prix),
        commune,
        quartier: quartier.trim(),
        pieces: Number(pieces),
        equipements,
        photos,
        position: {
          lat: positionCoords.lat,
          lng: positionCoords.lng,
          label: `${commune} - ${quartier}`,
        },
        statut: 'en_attente',
      });
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la publication', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#132219] w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-[#132219]/95 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
              Publier une annonce
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Immobilier et hébergement en Côte d'Ivoire
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le formulaire de publication"
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          {/* Notice */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#0F6B3F]" />
            <p>
              Toute nouvelle annonce est vérifiée par notre équipe avant publication sur la plateforme pour garantir la fiabilité des offres.
            </p>
          </div>

          {/* 1. Catégorie & Type */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
              1. Catégorie & Type de bien
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES_CONFIG.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCategoryChange(c.id as CategoryType)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    categorie === c.id
                      ? 'bg-[#0F6B3F] text-white border-[#0F6B3F] shadow-sm'
                      : 'bg-gray-50 dark:bg-[#1a2d22] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {c.nom}
                </button>
              ))}
            </div>

            <div className="mt-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Type de bien ({currentCategoryConfig.nom})
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white font-medium"
              >
                {currentCategoryConfig.types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Titre & Prix */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
              2. Titre & Prix
            </label>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Titre de l'annonce *
              </label>
              <input
                type="text"
                placeholder="Ex: Superbe appartement 3 pièces avec balcon à Cocody"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
                maxLength={120}
                className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Prix en FCFA {currentCategoryConfig.labelPrix} *
                </label>
                <input
                  type="number"
                  placeholder="Ex: 150000"
                  min={0}
                  step={5000}
                  value={prix}
                  onChange={(e) => setPrix(e.target.value ? Number(e.target.value) : '')}
                  required
                  className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Nombre de pièces
                </label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={pieces}
                  onChange={(e) => setPieces(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Localisation */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
              3. Localisation géographique
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Commune ou Ville *
                </label>
                <select
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white font-semibold"
                >
                  <optgroup label="Communes d'Abidjan">
                    {COMMUNES_ABIDJAN.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Autres Villes">
                    {AUTRES_VILLES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Quartier / Repère *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Angré 8e Tranche, Carrefour Duncan"
                  value={quartier}
                  onChange={(e) => setQuartier(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* 4. Équipements */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
              4. Équipements disponibles
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EQUIPEMENTS_LIST.map((eq) => {
                const isSelected = equipements.includes(eq.id);
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => handleEquipementToggle(eq.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                      isSelected
                        ? 'bg-[#0F6B3F]/10 border-[#0F6B3F] text-[#0F6B3F] dark:text-[#34D399]'
                        : 'bg-gray-50 dark:bg-[#1a2d22] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        isSelected ? 'bg-[#0F6B3F] border-[#0F6B3F] text-white' : 'border-gray-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span>{eq.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Photos avec compression */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
                5. Photos du bien ({photos.length}/10)
              </label>
              <span className="text-[11px] text-[#0F6B3F] font-semibold">
                Compressées automatiquement à max 1280px
              </span>
            </div>

            {/* Upload Area */}
            <label className="border-2 border-dashed border-[#0F6B3F]/30 dark:border-[#0F6B3F]/40 hover:border-[#0F6B3F] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#F2F6F0]/50 dark:bg-[#1a2d22]/30 transition-colors">
              <Upload className="w-7 h-7 text-[#0F6B3F]" />
              <div className="text-center">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  Ajouter des photos
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG ou WEBP (sélectionnez jusqu'à 10 images)
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isCompressing || photos.length >= 10}
                className="hidden"
              />
            </label>

            {/* Quick 1-click test photos button */}
            {photos.length === 0 && (
              <button
                type="button"
                onClick={handleAddPresetPhotos}
                className="w-full py-2 px-3 rounded-xl border border-dashed border-emerald-600/40 text-[#0F6B3F] dark:text-[#34D399] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Charger 3 photos immobilières d'exemple pour tester</span>
              </button>
            )}

            {isCompressing && (
              <div className="text-xs text-center text-[#0F6B3F] font-semibold animate-pulse">
                Optimisation et compression des images en cours...
              </div>
            )}

            {/* Photos Preview Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
                {photos.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group"
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {compressionStats[idx] && (
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {compressionStats[idx]}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white shadow opacity-90 hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. Description & WhatsApp */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
              6. Description & Contact WhatsApp
            </label>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Numéro WhatsApp pour être contacté (+225) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="+225 07 00 00 00 00"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                  className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-gray-900 dark:text-white font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Description détaillée
              </label>
              <textarea
                rows={4}
                placeholder="Décrivez les atouts de votre bien : agencement, état, conditions, commodités environnantes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className="w-full py-4 px-5 rounded-2xl bg-[#0F6B3F] hover:bg-[#0B5431] active:scale-[0.98] text-white font-extrabold text-base shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Publication en cours...' : 'Publier l\'annonce'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
