import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Heart, PlusCircle, User, CalendarCheck, Building2, MessageSquare, LayoutDashboard } from 'lucide-react';

interface Props {
  onOpenPublish: () => void;
}

export const BottomNav: React.FC<Props> = ({ onOpenPublish }) => {
  const { activeTab, setActiveTab, favorites, bookings, currentUser } = useApp();

  const activeSpace = currentUser?.espaceActif || 'chercheur';
  const myBookingsCount = bookings.filter((b) => currentUser && (b.clientId === currentUser.id || b.ownerId === currentUser.id)).length;
  const pendingBookingsCount = bookings.filter((b) => currentUser && b.ownerId === currentUser.id && b.statut === 'demandee').length;

  if (activeSpace === 'proprietaire') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#132219]/95 backdrop-blur-lg border-t border-gray-200/80 dark:border-gray-800 pb-[env(safe-area-inset-bottom)] shadow-lg">
        <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
          {/* 1. Accueil (Tableau de bord) */}
          <button
            type="button"
            onClick={() => setActiveTab('accueil')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
              activeTab === 'accueil'
                ? 'text-[#F28C1B] font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 font-medium'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'accueil' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Accueil</span>
            {activeTab === 'accueil' && (
              <span className="absolute top-1 w-6 h-0.5 rounded-full bg-[#F28C1B]"></span>
            )}
          </button>

          {/* 2. Mes annonces */}
          <button
            type="button"
            onClick={() => setActiveTab('mes_annonces')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
              activeTab === 'mes_annonces'
                ? 'text-[#F28C1B] font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 font-medium'
            }`}
          >
            <Building2 className={`w-5 h-5 ${activeTab === 'mes_annonces' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Mes annonces</span>
            {activeTab === 'mes_annonces' && (
              <span className="absolute top-1 w-6 h-0.5 rounded-full bg-[#F28C1B]"></span>
            )}
          </button>

          {/* 3. Publier (Bouton central rond orange) */}
          <button
            type="button"
            onClick={onOpenPublish}
            className="flex flex-col items-center justify-center flex-1 h-full group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#F28C1B] hover:bg-[#D9770E] text-white flex items-center justify-center shadow-md shadow-[#F28C1B]/30 active:scale-90 transition-all -mt-3 border-2 border-white dark:border-[#132219]">
              <PlusCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 mt-0.5 group-hover:text-[#F28C1B]">
              Publier
            </span>
          </button>

          {/* 4. Demandes reçues (avec pastille rouge si demandes en attente) */}
          <button
            type="button"
            onClick={() => setActiveTab('demandes_recues')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
              activeTab === 'demandes_recues'
                ? 'text-[#F28C1B] font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 font-medium'
            }`}
          >
            <div className="relative">
              <MessageSquare className={`w-5 h-5 ${activeTab === 'demandes_recues' ? 'stroke-[2.5]' : ''}`} />
              {pendingBookingsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {pendingBookingsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1">Demandes</span>
            {activeTab === 'demandes_recues' && (
              <span className="absolute top-1 w-6 h-0.5 rounded-full bg-[#F28C1B]"></span>
            )}
          </button>

          {/* 5. Mon espace */}
          <button
            type="button"
            onClick={() => setActiveTab('mon_espace')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
              activeTab === 'mon_espace'
                ? 'text-[#F28C1B] font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 font-medium'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'mon_espace' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-1">Mon espace</span>
            {activeTab === 'mon_espace' && (
              <span className="absolute top-1 w-6 h-0.5 rounded-full bg-[#F28C1B]"></span>
            )}
          </button>
        </div>
      </nav>
    );
  }

  // Espace Chercheur (AUCUN bouton Publier)
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#132219]/95 backdrop-blur-lg border-t border-gray-200/80 dark:border-gray-800 pb-[env(safe-area-inset-bottom)] shadow-lg">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {/* 1. Accueil / Recherche */}
        <button
          type="button"
          onClick={() => setActiveTab('accueil')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
            activeTab === 'accueil'
              ? 'text-[#0F6B3F] dark:text-[#34D399] font-bold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'accueil' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">Accueil</span>
          {activeTab === 'accueil' && (
            <span className="absolute top-1 w-6 h-0.5 rounded-full bg-[#0F6B3F] dark:bg-[#34D399]"></span>
          )}
        </button>

        {/* 2. Favoris */}
        <button
          type="button"
          onClick={() => setActiveTab('favoris')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
            activeTab === 'favoris'
              ? 'text-[#0F6B3F] dark:text-[#34D399] font-bold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 font-medium'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${activeTab === 'favoris' ? 'fill-current stroke-[2.5]' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1">Favoris</span>
          {activeTab === 'favoris' && (
            <span className="absolute top-1 w-6 h-0.5 rounded-full bg-[#0F6B3F] dark:bg-[#34D399]"></span>
          )}
        </button>

        {/* 3. Mes demandes */}
        <button
          type="button"
          onClick={() => setActiveTab('demandes')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
            activeTab === 'demandes'
              ? 'text-[#0F6B3F] dark:text-[#34D399] font-bold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 font-medium'
          }`}
        >
          <CalendarCheck className={`w-5 h-5 ${activeTab === 'demandes' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">Mes demandes</span>
          {activeTab === 'demandes' && (
            <span className="absolute top-1 w-6 h-0.5 rounded-full bg-[#0F6B3F] dark:bg-[#34D399]"></span>
          )}
        </button>

        {/* 4. Mon Espace */}
        <button
          type="button"
          onClick={() => setActiveTab('mon_espace')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
            activeTab === 'mon_espace'
              ? 'text-[#0F6B3F] dark:text-[#34D399] font-bold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 font-medium'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'mon_espace' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">Mon espace</span>
          {activeTab === 'mon_espace' && (
            <span className="absolute top-1 w-6 h-0.5 rounded-full bg-[#0F6B3F] dark:bg-[#34D399]"></span>
          )}
        </button>
      </div>
    </nav>
  );
};

