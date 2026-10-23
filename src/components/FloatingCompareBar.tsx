import React from 'react';
import { useApp } from '../context/AppContext';
import { Scale, X, ArrowRight } from 'lucide-react';

export const FloatingCompareBar: React.FC = () => {
  const { compareListings, toggleCompare, clearCompare, setIsCompareModalOpen, listings } = useApp();

  if (compareListings.length === 0) return null;

  const comparedItems = listings.filter((l) => compareListings.includes(l.id));

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-60 w-full max-w-xl px-4 animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-gray-900/95 dark:bg-[#16261c]/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-white/10 dark:border-gray-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-[#0F6B3F] text-white shrink-0 shadow">
            <Scale className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-xs sm:text-sm truncate">
              Comparateur ({compareListings.length}/3 biens)
            </div>
            <div className="text-[11px] text-gray-300 truncate">
              {comparedItems.map((l) => l.titre).join(' • ')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCompareModalOpen(true)}
            className="px-4 py-2 bg-[#0F6B3F] hover:bg-[#0B5431] text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span>Comparer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={clearCompare}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
            title="Effacer la sélection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
