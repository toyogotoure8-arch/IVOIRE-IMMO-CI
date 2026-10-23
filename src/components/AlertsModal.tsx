import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMMUNES_ABIDJAN, AUTRES_VILLES, CATEGORIES_CONFIG } from '../constants/ciData';
import { formatFCFA } from '../utils/calculations';
import { X, BellRing, Trash2, Plus, Sparkles } from 'lucide-react';
import { CategoryType } from '../types';

interface Props {
  onClose: () => void;
}

export const AlertsModal: React.FC<Props> = ({ onClose }) => {
  const { alerts, createAlert, deleteAlert, currentUser, showToast } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [categorie, setCategorie] = useState<CategoryType | 'toutes'>('location');
  const [commune, setCommune] = useState('Cocody');
  const [budgetMax, setBudgetMax] = useState<number | ''>(200000);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAlert({
      categorie,
      commune,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
    });
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#132219] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-[#0F6B3F] dark:text-[#34D399]">
            <BellRing className="w-5 h-5" />
            <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
              Mes Alertes de Recherche
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer les alertes"
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <p className="text-xs text-gray-500">
            Soyez prévenu dès qu'un bien correspondant à vos critères est publié.
          </p>

          {/* Add form */}
          {showAddForm ? (
            <form onSubmit={handleCreate} className="bg-gray-50 dark:bg-[#1a2d22] p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Nouvelle alerte
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Catégorie</label>
                  <select
                    value={categorie}
                    onChange={(e) => setCategorie(e.target.value as any)}
                    className="w-full bg-white dark:bg-[#132219] border border-gray-300 dark:border-gray-700 rounded-xl px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                  >
                    <option value="toutes">Toutes</option>
                    {CATEGORIES_CONFIG.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Commune / Ville</label>
                  <select
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="w-full bg-white dark:bg-[#132219] border border-gray-300 dark:border-gray-700 rounded-xl px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                  >
                    <optgroup label="Abidjan">
                      {COMMUNES_ABIDJAN.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Autres villes">
                      {AUTRES_VILLES.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Budget Max en FCFA</label>
                <input
                  type="number"
                  placeholder="Ex: 150000"
                  step={5000}
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-white dark:bg-[#132219] border border-gray-300 dark:border-gray-700 rounded-xl px-2.5 py-1.5 text-xs text-gray-900 dark:text-white font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0F6B3F] text-white rounded-xl text-xs font-bold"
                >
                  Enregistrer l'alerte
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-[#0F6B3F]/30 hover:border-[#0F6B3F] text-[#0F6B3F] dark:text-[#34D399] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une nouvelle alerte de recherche</span>
            </button>
          )}

          {/* List of alerts */}
          <div className="space-y-2 pt-2">
            {alerts.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                Aucune alerte configurée.
              </p>
            ) : (
              alerts.map((al) => (
                <div
                  key={al.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-[#1a2d22] border border-gray-200 dark:border-gray-800"
                >
                  <div>
                    <div className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                      <span className="uppercase text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        {al.categorie || 'Toutes'}
                      </span>
                      <span>à {al.commune || 'Toutes communes'}</span>
                    </div>
                    {al.budgetMax && (
                      <span className="text-[11px] text-gray-500">
                        Max {formatFCFA(al.budgetMax)}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteAlert(al.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                    title="Supprimer cette alerte"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
