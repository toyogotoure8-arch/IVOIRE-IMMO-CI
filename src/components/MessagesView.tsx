import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Send, User, Clock, Building } from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { messages, currentUser, sendMessage } = useApp();
  const [inputText, setInputText] = useState('');

  const myMessages = messages;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    await sendMessage('owner-koffi', inputText.trim(), 'demo-1', 'Studio Cocody Angré');
    setInputText('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
          Mes Messages
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Échanges directs avec les bailleurs et hôteliers
        </p>
      </div>

      <div className="bg-white dark:bg-[#16261c] rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {myMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Aucun message pour l'instant
              </p>
              <p className="text-xs text-gray-400 max-w-xs mt-1">
                Contactez un propriétaire depuis une annonce pour démarrer une conversation.
              </p>
            </div>
          ) : (
            myMessages.map((m) => {
              const isMe = currentUser && m.senderId === currentUser.id;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-gray-400 mb-1 px-1">
                    {m.senderNom} {m.listingTitre && `• ${m.listingTitre}`}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-sm ${
                      isMe
                        ? 'bg-[#0F6B3F] text-white rounded-br-xs'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-xs'
                    }`}
                  >
                    <p>{m.texte}</p>
                    <span className="text-[9px] opacity-75 block text-right mt-1">
                      {new Date(m.dateCreation).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Send message bar */}
        <form onSubmit={handleSend} className="p-3 bg-gray-50 dark:bg-[#132219] border-t border-gray-200/80 dark:border-gray-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Écrivez votre message au propriétaire..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-white dark:bg-[#1a2d22] border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F6B3F]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-2xl bg-[#0F6B3F] hover:bg-[#0B5431] text-white disabled:opacity-40 transition-all shadow shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
