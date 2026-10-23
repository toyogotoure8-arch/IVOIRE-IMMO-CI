import React, { useState } from 'react';
import { X, ShieldCheck, ArrowLeft, Smartphone, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { MOBILE_MONEY_CHANNELS, MobileMoneyChannel, CINETPAY_CONFIG } from '../config/cinetpay';
import { SelectedPaymentContext } from './OfferSelectionModal';
import { formatFCFA } from '../utils/calculations';
import { useApp } from '../context/AppContext';

export interface PaymentSuccessResult {
  transactionId: string;
  channel: string;
  amountFCFA: number;
  offerTitle: string;
  date: string;
  customerPhone: string;
}

interface Props {
  paymentContext: SelectedPaymentContext;
  onBack: () => void;
  onClose: () => void;
  onSuccess: (result: PaymentSuccessResult) => void;
}

export const CinetPayPaymentModal: React.FC<Props> = ({
  paymentContext,
  onBack,
  onClose,
  onSuccess,
}) => {
  const { currentUser, showToast } = useApp();
  const [selectedChannel, setSelectedChannel] = useState<MobileMoneyChannel>(MOBILE_MONEY_CHANNELS[0]);
  const [phone, setPhone] = useState(currentUser?.telephone || '');
  const [customerName, setCustomerName] = useState(currentUser?.nom || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 8) {
      showToast('Veuillez entrer un numéro de téléphone valide (Côte d\'Ivoire)', 'error');
      return;
    }

    setIsProcessing(true);

    // Simulation de l'appel d'API CinetPay avec clés configurées dans /src/config/cinetpay.ts
    setTimeout(() => {
      setIsProcessing(false);
      const txId = `CP-CI-${Date.now().toString().slice(-8)}`;

      onSuccess({
        transactionId: txId,
        channel: selectedChannel.name,
        amountFCFA: paymentContext.amountFCFA,
        offerTitle: paymentContext.title,
        date: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        customerPhone: phone,
      });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#16261c] w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0F6B3F] to-[#0B5431] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-extrabold">Paiement Mobile Money</h2>
              <p className="text-[11px] text-emerald-200">Guichet sécurisé CinetPay</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CinetPay API Key Status Notice */}
        <div className="bg-amber-50 dark:bg-amber-950/40 px-4 py-2.5 border-b border-amber-200 dark:border-amber-900 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Clés API CinetPay définies dans <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 rounded">src/config/cinetpay.ts</code> (Marquées "À renseigner").
          </span>
        </div>

        {/* Content */}
        <form onSubmit={handlePay} className="p-4 sm:p-6 space-y-5">
          {/* Summary Box */}
          <div className="bg-gray-50 dark:bg-gray-900/60 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 space-y-2">
            <div className="text-[11px] font-bold uppercase text-gray-400">Récapitulatif de la commande</div>
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-sm text-gray-900 dark:text-white">{paymentContext.title}</div>
                <div className="text-xs text-gray-500">{paymentContext.description}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-[#0F6B3F] dark:text-[#34D399]">
                  {formatFCFA(paymentContext.amountFCFA)}
                </div>
                <div className="text-[10px] text-gray-400">TTC</div>
              </div>
            </div>
          </div>

          {/* Mobile Money Provider Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
              Choisissez votre opérateur Mobile Money
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MOBILE_MONEY_CHANNELS.map((chan) => {
                const isSelected = selectedChannel.id === chan.id;
                return (
                  <button
                    key={chan.id}
                    type="button"
                    onClick={() => setSelectedChannel(chan)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#0F6B3F] bg-emerald-50/50 dark:bg-emerald-950/30 shadow-sm'
                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${chan.color}`}>
                        {chan.id}
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {chan.name}
                      </span>
                    </div>
                    {isSelected && <CheckCircle className="w-4 h-4 text-[#0F6B3F] dark:text-[#34D399]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: Kouassi Jean"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F6B3F] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Numéro Mobile Money (Côte d'Ivoire)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-gray-500">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>+225</span>
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07 08 09 10 11"
                  className="w-full pl-16 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F6B3F] outline-none"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                {selectedChannel.instruction}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-[#0F6B3F] hover:bg-[#0B5431] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connexion à CinetPay en cours...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Payer {formatFCFA(paymentContext.amountFCFA)} via {selectedChannel.name}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Paiement 100% sécurisé et instantané via CinetPay CI</span>
          </div>
        </form>
      </div>
    </div>
  );
};
