import React, { useState } from 'react';
import { calculateRentalFees, formatFCFA } from '../utils/calculations';
import { Calculator, Info, ShieldCheck, CalendarCheck, HelpCircle } from 'lucide-react';

interface Props {
  initialRent: number;
}

export const RentalFeesCalculator: React.FC<Props> = ({ initialRent }) => {
  const [rentInput, setRentInput] = useState<number>(initialRent);
  const breakdown = calculateRentalFees(rentInput);

  return (
    <div className="bg-[#F2F6F0] dark:bg-[#132219] rounded-2xl p-4 sm:p-5 border border-[#0F6B3F]/15 my-4">
      <div className="flex items-center gap-2.5 mb-3 text-[#0F6B3F] dark:text-[#34D399]">
        <div className="p-2 rounded-xl bg-[#0F6B3F]/10 dark:bg-[#0F6B3F]/30">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-base leading-tight">Calculateur de frais d'installation</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300">Estimation pour bail de location en Côte d'Ivoire</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Loyer mensuel indicatif
        </label>
        <div className="relative">
          <input
            type="number"
            min={0}
            step={5000}
            value={rentInput}
            onChange={(e) => setRentInput(Math.max(0, Number(e.target.value)))}
            className="w-full bg-white dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-base font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6B3F]"
          />
          <span className="absolute right-3 top-2.5 text-sm font-semibold text-gray-500">FCFA/mois</span>
        </div>
      </div>

      <div className="space-y-2.5 text-sm border-t border-[#0F6B3F]/15 pt-3">
        <div className="flex justify-between items-center text-gray-700 dark:text-gray-200">
          <span className="flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-[#0F6B3F]" />
            1er mois de loyer :
          </span>
          <span className="font-semibold">{formatFCFA(breakdown.firstMonth)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-700 dark:text-gray-200">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0F6B3F]" />
            2 mois de caution :
          </span>
          <span className="font-semibold">{formatFCFA(breakdown.cautionAmount)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-700 dark:text-gray-200">
          <span className="flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-[#0F6B3F]" />
            2 mois d'avance :
          </span>
          <span className="font-semibold">{formatFCFA(breakdown.advanceAmount)}</span>
        </div>

        <div className="flex justify-between items-center pt-2.5 border-t border-dashed border-[#0F6B3F]/30 text-base font-extrabold text-[#0F6B3F] dark:text-[#34D399]">
          <span>Total frais d'installation :</span>
          <span className="text-lg bg-[#0F6B3F]/10 px-2.5 py-1 rounded-lg">
            {formatFCFA(breakdown.totalEstimated)}
          </span>
        </div>
      </div>

      <div className="mt-3.5 flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 bg-amber-500/10 dark:bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30">
        <Info className="w-4 h-4 shrink-0 text-[#F28C1B] mt-0.5" />
        <p>
          <span className="font-bold">Avertissement :</span> Ceci est une estimation indicative hors frais d'agence ou frais de dossier.
        </p>
      </div>
    </div>
  );
};
