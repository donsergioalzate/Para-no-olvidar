import React, { useState } from 'react';
import type { Reminder } from '../types';

interface ReminderModalProps {
  date: Date;
  reminder: Reminder | undefined;
  onAdd: (icon: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

const ICONS = ['🧠', '💼', '❤️', '✈️', '🎉', '💪', '🍽️', '💡'];

const ReminderModal: React.FC<ReminderModalProps> = ({ date, reminder, onAdd, onRemove, onClose }) => {
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  const formattedDate = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-sm p-6 animate-scale-up text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-1 capitalize">{formattedDate}</h2>
        
        {reminder ? (
          <>
            <p className="text-slate-600 dark:text-slate-300 mt-4 mb-6">
              Tienes un recordatorio misterioso para este día. ¿Recuerdas qué es?
            </p>
            <div className="my-4 text-center text-6xl" aria-label={`Icono del recordatorio actual: ${reminder.icon}`}>
              {reminder.icon}
            </div>
            <div className="flex justify-end gap-2 mt-8">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md font-medium text-sm text-indigo-500 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors uppercase tracking-wider"
              >
                Cerrar
              </button>
              <button
                onClick={onRemove}
                className="px-4 py-2 rounded-md font-medium text-sm bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-all uppercase tracking-wider"
              >
                Eliminar
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-slate-600 dark:text-slate-300 mt-4 mb-6">
              Desafía tu memoria. Fija un recordatorio misterioso para este día.
            </p>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Selecciona un ícono:</p>
              <div className="flex flex-wrap justify-center gap-2 p-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                {ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setSelectedIcon(icon)}
                    className={`h-12 w-12 flex items-center justify-center text-3xl rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500 ${selectedIcon === icon ? 'bg-indigo-200 dark:bg-indigo-800' : 'bg-transparent'}`}
                    aria-label={`Seleccionar ícono: ${icon}`}
                    aria-pressed={selectedIcon === icon}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-8">
               <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md font-medium text-sm text-indigo-500 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => onAdd(selectedIcon)}
                  className="px-4 py-2 rounded-md font-medium text-sm bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-lg transition-all uppercase tracking-wider"
                >
                  Fijar Recordatorio
                </button>
            </div>
          </>
        )}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-scale-up { animation: scale-up 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ReminderModal;