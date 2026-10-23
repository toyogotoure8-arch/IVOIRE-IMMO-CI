import React, { useState } from 'react';
import { X, Sparkles, Building2, Hotel, Check, Zap, CreditCard, ChevronRight } from 'lucide-react';
import { PROMOTION_OFFERS, SUBSCRIPTION_OFFERS, PromotionOffer, SubscriptionOffer } from '../config/cinetpay';
import { formatFCFA } from '../utils/calculations';
import { Listing } from '../types';

export interface SelectedPaymentContext {
  type: 'boost' | 'subscription' | 'deposit';
  offerId: string;
  title: string;
  amountFCFA: number;
  description: string;
  listingId?: string;
  listingTitre?: string;
}

interface Props {
  onClose: () => void;
  onSelectOffer: (context: SelectedPaymentContext) => void;
  initialListing?: Listing | null;
}

export const OfferSelectionModal: React.FC<Props> = ({ onClose, onSelectOffer, initialListing }) => {
  const [activeTab, setActiveTab] = useState<'boost' | 'subscription' | 'deposit'>('boost');
  const [customDepositAmount, setCustomDepositAmount] = useState<number>(10000);

  const handleSelectBoost = (offer: PromotionOffer) => {
    onSelectOffer({
      type: 'boost',
      offerId: offer.id,
      title: offer.title,
      amountFCFA: offer.priceFCFA,
      description: offer.description,
      listingId: initialListing?.id,
      listingTitre: initialListing?.titre,
    });
  };

  const handleSelectSubscription = (offer: SubscriptionOffer) => {
    onSelectOffer({
      type: 'subscription',
      offerId: offer.id,
      title: offer.title,
      amountFCFA: offer.priceFCFA,
      description: `Abonnement mensuel : ${offer.target}`,
    });
  };

  const handleSelectDeposit = () => {
    onSelectOffer({
      type: 'deposit',
      offerId: 'hotel_deposit',
      title: 'Acompte de Réservation Hôtel / Meublé',
      amountFCFA: customDepositAmount,
      description: `Acompte garanti pour la réservation de ${initialListing ? initialListing.titre : 'votre hébergement'}`,
      listingId: initialListing?.id,
      listingTitre: initialListing?.titre,
    });
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#16261c] w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#0F6B3F] text-white flex items-center justify-between shrink-0 relative">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-200">
                Paiement Mobile Money CinetPay
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold">Choisissez votre Offre</h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              Wave, Orange Money, MTN MoMo & Moov Money
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('boost')}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'boost'
                ? 'bg-white dark:bg-[#16261c] text-[#0F6B3F] dark:text-[#34D399] shadow-sm'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Booster Annonce</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('subscription')}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'subscription'
                ? 'bg-white dark:bg-[#16261c] text-[#0F6B3F] dark:text-[#34D399] shadow-sm'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-500" />
            <span>Abonnements Pro</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'deposit'
                ? 'bg-white dark:bg-[#16261c] text-[#0F6B3F] dark:text-[#34D399] shadow-sm'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Hotel className="w-4 h-4 text-purple-500" />
            <span>Acompte Hôtel</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: BOOST ANNONCE */}
          {activeTab === 'boost' && (
            <div className="space-y-4">
              {initialListing && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold">Annonce concernée :</span> {initialListing.titre} ({initialListing.commune})
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-600 dark:text-gray-300">
                Multipliez les appels et les visites en plaçant votre bien en tête de liste et sur la bannière de la page d'accueil.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROMOTION_OFFERS.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white dark:bg-gray-800/60 rounded-3xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-[#0F6B3F] hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                          {offer.badge}
                        </span>
                        <span className="text-xs text-gray-400 font-semibold">{offer.durationDays} Jours</span>
                      </div>
                      <h3 className="font-extrabold text-base text-gray-900 dark:text-white mb-1">
                        {offer.title}
                      </h3>
                      <div className="text-2xl font-black text-[#0F6B3F] dark:text-[#34D399] mb-3">
                        {formatFCFA(offer.priceFCFA)}
                      </div>
                      <ul className="space-y-2 mb-4">
                        {offer.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectBoost(offer)}
                      className="w-full py-2.5 px-4 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold rounded-2xl shadow transition-all flex items-center justify-center gap-2"
                    >
                      <span>Payer {formatFCFA(offer.priceFCFA)}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ABONNEMENTS PRO */}
          {activeTab === 'subscription' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Abonnement mensuel sans engagement pour agences immobilières et complexes hôteliers en Côte d'Ivoire.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SUBSCRIPTION_OFFERS.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white dark:bg-gray-800/60 rounded-3xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-[#0F6B3F] hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 mb-2 inline-block">
                        {offer.target}
                      </span>
                      <h3 className="font-extrabold text-base text-gray-900 dark:text-white mb-1">
                        {offer.title}
                      </h3>
                      <div className="text-2xl font-black text-[#0F6B3F] dark:text-[#34D399] mb-3">
                        {formatFCFA(offer.priceFCFA)}{' '}
                        <span className="text-xs text-gray-400 font-normal">/ mois</span>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {offer.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectSubscription(offer)}
                      className="w-full py-2.5 px-4 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold rounded-2xl shadow transition-all flex items-center justify-center gap-2"
                    >
                      <span>S'abonner via Mobile Money</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ACOMPTE HÔTEL */}
          {activeTab === 'deposit' && (
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-3xl border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Hotel className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Acompte de garantie pour réservation</span>
                </div>
                <p>
                  Payez un acompte en Mobile Money pour bloquer immédiatement vos dates auprès de l'établissement hôtelier ou de la résidence meublée.
                </p>
              </div>

              <div className="space-y-3 bg-gray-50 dark:bg-gray-900/60 p-4 rounded-3xl border border-gray-200 dark:border-gray-800">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Montant de l'acompte à régler (en FCFA)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[5000, 10000, 25000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCustomDepositAmount(amt)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        customDepositAmount === amt
                          ? 'border-[#0F6B3F] bg-[#0F6B3F] text-white'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {formatFCFA(amt)}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={customDepositAmount || ''}
                    onChange={(e) => setCustomDepositAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 font-bold text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F6B3F] outline-none"
                    placeholder="Montant personnalisé"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    FCFA
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSelectDeposit}
                className="w-full py-3.5 px-4 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Payer l'acompte de {formatFCFA(customDepositAmount)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
