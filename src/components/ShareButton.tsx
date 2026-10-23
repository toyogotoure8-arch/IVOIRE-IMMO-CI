import React, { useState } from 'react';
import { Share2, Copy, Check, MessageSquare } from 'lucide-react';
import { Listing } from '../types';
import { shareOnWhatsApp, copyListingLink } from '../utils/shareUtils';
import { useApp } from '../context/AppContext';

interface Props {
  listing: Listing;
  variant?: 'full' | 'compact' | 'icon';
  className?: string;
}

export const ShareButton: React.FC<Props> = ({ listing, variant = 'full', className = '' }) => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    shareOnWhatsApp(listing);
    showToast('Redirection vers WhatsApp...', 'info');
    setShowOptions(false);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyListingLink(listing);
    if (success) {
      setCopied(true);
      showToast('Lien de l\'annonce copié dans le presse-papier !', 'success');
      setTimeout(() => setCopied(false), 3000);
    } else {
      showToast('Impossible de copier le lien', 'error');
    }
    setShowOptions(false);
  };

  if (variant === 'icon') {
    return (
      <div className="relative inline-block">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
          title="Partager cette annonce"
          className={`p-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#0F6B3F] dark:text-[#34D399] hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors shadow-sm active:scale-95 ${className}`}
        >
          <Share2 className="w-4 h-4" />
        </button>

        {showOptions && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#16261c] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950 flex items-center gap-2.5"
            >
              <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
              </span>
              <span>Partager sur WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2.5 mt-1"
            >
              <span className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center shrink-0">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </span>
              <span>{copied ? 'Lien copié !' : 'Copier le lien public'}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleWhatsApp}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 ${className}`}
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span>Partager</span>
      </button>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleWhatsApp}
        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all active:scale-98"
      >
        <MessageSquare className="w-4 h-4 fill-white" />
        <span>Partager sur WhatsApp</span>
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 text-xs sm:text-sm font-bold rounded-2xl transition-all active:scale-98"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        <span>{copied ? 'Copié !' : 'Copier le lien'}</span>
      </button>
    </div>
  );
};
