import React, { useState, useMemo } from 'react';
import Calendar from './components/Calendar';
import ReminderModal from './components/ReminderModal';
import ReminderList from './components/ReminderList';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Reminder } from './types';
import { formatDateISO } from './utils/date';

const App: React.FC = () => {
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('reminders', []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeView, setActiveView] = useState<'calendar' | 'list'>('calendar');

  const remindersMap = useMemo(() => {
    return new Map(reminders.map(r => [r.date, r]));
  }, [reminders]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddReminder = (date: Date, icon: string) => {
    const newReminder: Reminder = { date: formatDateISO(date), icon };
    if (!remindersMap.has(newReminder.date)) {
      setReminders([...reminders, newReminder].sort((a, b) => a.date.localeCompare(b.date)));
    }
    setSelectedDate(null);
  };

  const handleRemoveReminder = (date: Date) => {
    const reminderDate = formatDateISO(date);
    setReminders(reminders.filter(r => r.date !== reminderDate));
    setSelectedDate(null);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleShowCalendar = () => {
    setShowCalendar(true);
    setActiveView('calendar');
  };

  const handleReviewReminders = () => {
    setShowCalendar(true);
    setActiveView('list');
  };

  const shouldShowWelcome = reminders.length === 0 && !showCalendar;

  const getViewToggleClasses = (viewName: 'calendar' | 'list') => {
    const baseClasses = "w-full text-center py-2 px-4 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-500";
    if (activeView === viewName) {
        return `${baseClasses} bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow`;
    }
    return `${baseClasses} text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-600/50`;
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      {shouldShowWelcome ? (
        <div className="text-center animate-fade-in">
           <h1 className="text-5xl md:text-6xl font-medium text-indigo-600 dark:text-indigo-400 mb-4">
            Calendario de Recuerdo
          </h1>
          <p className="mt-2 text-xl text-slate-600 dark:text-slate-400 mb-8">
            ¿Listo para poner a prueba tu memoria?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleShowCalendar}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-6 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 uppercase tracking-wider w-full sm:w-auto justify-center"
            >
              <span className="material-symbols-outlined">add</span>
              Agregar Recordatorios
            </button>
            <button 
              onClick={handleReviewReminders}
              className="bg-transparent hover:bg-indigo-100 dark:hover:bg-slate-700 text-indigo-500 dark:text-indigo-400 font-medium py-3 px-6 rounded-full text-lg transition-all border-2 border-indigo-500 dark:border-indigo-400 flex items-center gap-2 uppercase tracking-wider w-full sm:w-auto justify-center"
            >
              <span className="material-symbols-outlined">event_available</span>
              Revisar Recordatorios
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl mx-auto">
          <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-medium text-indigo-600 dark:text-indigo-400">
              Calendario de Recuerdo
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
              Agudiza tu mente, un recordatorio a la vez.
            </p>
          </header>

          <div className="flex justify-center items-center p-1 bg-slate-200 dark:bg-slate-700 rounded-full my-6 max-w-sm mx-auto">
            <button onClick={() => setActiveView('calendar')} className={getViewToggleClasses('calendar')}>
                Calendario
            </button>
            <button onClick={() => setActiveView('list')} className={getViewToggleClasses('list')}>
                Mis Recordatorios
            </button>
          </div>

          <main className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 sm:p-6">
            {activeView === 'calendar' ? (
              <Calendar
                currentDate={currentDate}
                reminders={remindersMap}
                onDateSelect={handleDateSelect}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
            ) : (
              <ReminderList reminders={reminders} />
            )}
          </main>
        </div>
      )}

      {selectedDate && (
        <ReminderModal
          date={selectedDate}
          reminder={remindersMap.get(formatDateISO(selectedDate))}
          onAdd={(icon: string) => handleAddReminder(selectedDate, icon)}
          onRemove={() => handleRemoveReminder(selectedDate)}
          onClose={() => setSelectedDate(null)}
        />
      )}

      <footer className="absolute bottom-4 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} Calendario de Recuerdo. Agudiza tu mente.</p>
      </footer>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
