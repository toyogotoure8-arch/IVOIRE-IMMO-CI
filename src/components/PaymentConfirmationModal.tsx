import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Download, ExternalLink } from 'lucide-react';
import { PaymentSuccessResult } from './CinetPayPaymentModal';
import { formatFCFA } from '../utils/calculations';

interface Props {
  result: PaymentSuccessResult;
  onClose: () => void;
}

export const PaymentConfirmationModal: React.FC<Props> = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyTx = () => {
    navigator.clipboard.writeText(result.transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#16261c] w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden my-auto p-6 text-center space-y-5">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#0F6B3F] dark:text-[#34D399] flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
            Paiement Validé CinetPay
          </span>
          <h2 className="text-xl font-black text-gray-900 dark:text-white mt-2">
            Transaction Réussie !
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Votre service a été activé avec succès.
          </p>
        </div>

        {/* Receipt Box */}
        <div className="bg-gray-50 dark:bg-gray-900/60 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
            <span className="text-gray-500">Service souscrit :</span>
            <span className="font-bold text-gray-900 dark:text-white">{result.offerTitle}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
            <span className="text-gray-500">Montant réglé :</span>
            <span className="font-extrabold text-[#0F6B3F] dark:text-[#34D399] text-sm">
              {formatFCFA(result.amountFCFA)}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
            <span className="text-gray-500">Moyen de paiement :</span>
            <span className="font-bold text-gray-900 dark:text-white">{result.channel}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
            <span className="text-gray-500">Numéro débité :</span>
            <span className="font-bold text-gray-900 dark:text-white">{result.customerPhone}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
            <span className="text-gray-500">Date & Heure :</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{result.date}</span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-gray-500">Référence CinetPay :</span>
            <button
              type="button"
              onClick={handleCopyTx}
              className="inline-flex items-center gap-1 font-mono font-bold text-gray-900 dark:text-white hover:text-[#0F6B3F] transition-colors"
            >
              <span>{result.transactionId}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all active:scale-98"
          >
            Retour à l'application
          </button>
        </div>
      </div>
    </div>
  );
};
