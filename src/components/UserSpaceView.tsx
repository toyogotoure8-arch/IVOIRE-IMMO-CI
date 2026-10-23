import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OwnerDashboard } from './OwnerDashboard';
import { AdminDashboard } from './AdminDashboard';
import { BookingsView } from './BookingsView';
import { MessagesView } from './MessagesView';
import { formatIvorianPhone } from '../utils/calculations';
import {
  User,
  ShieldCheck,
  LogOut,
  CalendarCheck,
  MessageSquare,
  Building2,
  BellRing,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface Props {
  onOpenPublish: () => void;
  onOpenAlerts: () => void;
}

export const UserSpaceView: React.FC<Props> = ({ onOpenPublish, onOpenAlerts }) => {
  const {
    currentUser,
    setShowAuthModal,
    setShowRoleModal,
    switchRole,
    logout,
  } = useApp();

  const [clientSubTab, setClientSubTab] = useState<'reservations' | 'messages'>('reservations');

  if (!currentUser) {
    return (
      <div className="bg-white dark:bg-[#16261c] rounded-3xl p-8 sm:p-10 text-center border border-gray-200/80 dark:border-gray-800 shadow-sm max-w-lg mx-auto space-y-4 my-8">
        <div className="w-16 h-16 rounded-full bg-[#0F6B3F]/10 text-[#0F6B3F] mx-auto flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white">
          Accéder à mon espace
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
          Connectez-vous avec votre numéro de téléphone ou votre compte Google pour gérer vos annonces, réservations et messages.
        </p>
        <button
          type="button"
          onClick={() => setShowAuthModal(true)}
          className="w-full py-3.5 px-4 bg-[#0F6B3F] hover:bg-[#0B5431] text-white rounded-2xl text-sm font-extrabold shadow-md active:scale-[0.98] transition-all"
        >
          Se connecter / S'inscrire
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Card */}
      <div className="bg-white dark:bg-[#16261c] rounded-3xl p-5 sm:p-6 border border-gray-200/80 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#0F6B3F] text-white flex items-center justify-center text-xl font-black shadow-md shadow-[#0F6B3F]/20 shrink-0">
            {currentUser.nom.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                {currentUser.nom}
              </h2>
              {currentUser.verifie && (
                <span title="Profil certifié">
                  <ShieldCheck className="w-4 h-4 text-[#0F6B3F] fill-[#0F6B3F]/20" />
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {formatIvorianPhone(currentUser.telephone)} {currentUser.email && `• ${currentUser.email}`}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#0F6B3F] dark:text-[#34D399] border border-emerald-600/20">
                {currentUser.role === 'admin'
                  ? 'Administrateur'
                  : currentUser.role === 'proprietaire'
                  ? 'Bailleur / Hôtelier'
                  : 'Client / Voyageur'}
              </span>
              <button
                type="button"
                onClick={() => setShowRoleModal(true)}
                className="text-[11px] text-[#0F6B3F] dark:text-[#34D399] font-bold underline hover:opacity-80"
              >
                Changer de rôle
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="py-2 px-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold flex items-center gap-1.5 self-end sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>

      {/* Role specific dashboard */}
      {currentUser.role === 'admin' ? (
        <AdminDashboard />
      ) : currentUser.role === 'proprietaire' ? (
        <OwnerDashboard onOpenPublish={onOpenPublish} />
      ) : (
        /* Client View */
        <div className="space-y-6">
          {/* Quick Client Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setClientSubTab('reservations')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                clientSubTab === 'reservations'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#0F6B3F] text-[#0F6B3F]'
                  : 'bg-white dark:bg-[#16261c] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <CalendarCheck className="w-5 h-5 mb-2 text-[#0F6B3F]" />
              <span className="font-bold text-xs sm:text-sm">Mes Réservations</span>
              <span className="text-[11px] text-gray-500">Hôtels et meublés</span>
            </button>

            <button
              type="button"
              onClick={() => setClientSubTab('messages')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                clientSubTab === 'messages'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#0F6B3F] text-[#0F6B3F]'
                  : 'bg-white dark:bg-[#16261c] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <MessageSquare className="w-5 h-5 mb-2 text-[#0F6B3F]" />
              <span className="font-bold text-xs sm:text-sm">Mes Messages</span>
              <span className="text-[11px] text-gray-500">Discussions bailleurs</span>
            </button>

            <button
              type="button"
              onClick={onOpenAlerts}
              className="p-4 rounded-2xl border bg-white dark:bg-[#16261c] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-left transition-all flex flex-col justify-between col-span-2 sm:col-span-1"
            >
              <BellRing className="w-5 h-5 mb-2 text-[#F28C1B]" />
              <span className="font-bold text-xs sm:text-sm">Alertes de recherche</span>
              <span className="text-[11px] text-gray-500">Critères enregistrés</span>
            </button>
          </div>

          {/* Subtab content */}
          {clientSubTab === 'reservations' ? <BookingsView /> : <MessagesView />}

          {/* Banner to switch to Owner */}
          <div className="bg-[#F2F6F0] dark:bg-[#1a2d22] p-5 rounded-3xl border border-[#0F6B3F]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-base text-gray-900 dark:text-white">
                Vous possédez un bien immobilier ou un hôtel ?
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Passez en mode « Je publie » pour déposer des annonces et recevoir des locataires qualifiés.
              </p>
            </div>
            <button
              type="button"
              onClick={() => switchRole('proprietaire')}
              className="py-2.5 px-4 bg-[#0F6B3F] text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow"
            >
              <span>Activer mon profil bailleur</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
