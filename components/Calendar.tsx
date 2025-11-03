import React, { useMemo } from 'react';
import type { Reminder } from '../types';
import { getDaysInMonth, getFirstDayOfMonth, formatDateISO } from '../utils/date';

interface CalendarProps {
  currentDate: Date;
  reminders: Map<string, Reminder>;
  onDateSelect: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, reminders, onDateSelect, onPrevMonth, onNextMonth }) => {
  const monthName = useMemo(() => {
    const name = currentDate.toLocaleString('es-ES', { month: 'long' });
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, [currentDate]);

  const year = currentDate.getFullYear();
  
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const calendarGrid = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    const grid = [];
    
    // Previous month's padding days
    for (let i = 0; i < firstDay; i++) {
      const day = daysInPrevMonth - firstDay + 1 + i;
      grid.push({ date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day), isCurrentMonth: false });
    }
    
    // Current month's days
    for (const day of daysInMonth) {
      grid.push({ date: day, isCurrentMonth: true });
    }
    
    // Next month's padding days
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const remainingSlots = 42 - grid.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingSlots; i++) {
      grid.push({ date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i), isCurrentMonth: false });
    }
    
    return grid;
  }, [currentDate]);

  const todayISO = formatDateISO(new Date());

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrevMonth} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">arrow_back_ios</span>
        </button>
        <h2 className="text-xl font-medium text-slate-800 dark:text-slate-200 w-48 text-center">{monthName} {year}</h2>
        <button onClick={onNextMonth} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">arrow_forward_ios</span>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center font-medium text-slate-500 dark:text-slate-400 mb-2">
        {daysOfWeek.map(day => <div key={day}>{day.slice(0, 3)}</div>)}
      </div>
      
      <div className="grid grid-cols-7 gap-y-1">
        {calendarGrid.map(({ date, isCurrentMonth }, index) => {
          const dateISO = formatDateISO(date);
          const reminder = reminders.get(dateISO);
          const isToday = dateISO === todayISO;

          let dayClasses = "relative flex items-center justify-center h-10 w-10 mx-auto rounded-full cursor-pointer transition-colors duration-200 ease-in-out ";
          
          if (isCurrentMonth) {
            dayClasses += "hover:bg-indigo-100 dark:hover:bg-indigo-900/50 ";
            if (reminder) {
                dayClasses += "bg-indigo-500 text-white font-medium shadow ";
            } else {
              dayClasses += "text-slate-700 dark:text-slate-300 ";
            }
             if (isToday) {
              dayClasses += reminder ? "ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-indigo-500 " : "border-2 border-indigo-500 ";
            }
          } else {
            dayClasses += "text-slate-400 dark:text-slate-600 cursor-default ";
          }

          return (
            <div key={index} className={dayClasses} onClick={() => isCurrentMonth && onDateSelect(date)}>
              {reminder ? (
                 <span
                  className="text-lg"
                  aria-label={`Icono de recordatorio: ${reminder.icon}`}
                 >
                  {reminder.icon}
                 </span>
              ) : (
                <span>{date.getDate()}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;