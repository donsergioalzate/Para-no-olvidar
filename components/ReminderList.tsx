import React from 'react';
import type { Reminder } from '../types';

interface ReminderListProps {
  reminders: Reminder[];
}

const ReminderList: React.FC<ReminderListProps> = ({ reminders }) => {
  if (reminders.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-500 mb-4" aria-hidden="true">
          event_busy
        </span>
        <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300">
          No tienes recordatorios
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Ve a la vista de calendario para agregar tu primer desafío de memoria.
        </p>
      </div>
    );
  }

  const formatReminderDate = (dateString: string): string => {
    const date = new Date(dateString + 'T00:00:00'); // Use T00:00:00 to avoid timezone issues
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4 px-2">
        Tus Desafíos de Memoria
      </h2>
      <ul className="space-y-3">
        {reminders.map((reminder) => (
          <li
            key={reminder.date}
            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl" aria-label={`Ícono: ${reminder.icon}`}>{reminder.icon}</span>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                  {formatReminderDate(reminder.date)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Recordatorio Misterioso
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReminderList;
