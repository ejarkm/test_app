import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DateNavigator = ({ 
  selectedDate, 
  onDateChange, 
  reservationStats = {} 
}) => {
  const [viewMode, setViewMode] = useState('week'); // week, month

  const today = new Date();
  const currentDate = new Date(selectedDate);

  const formatDate = (date, format = 'full') => {
    const options = {
      full: { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      },
      short: { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      },
      day: { 
        day: 'numeric' 
      },
      weekday: { 
        weekday: 'short' 
      }
    };
    
    return date?.toLocaleDateString('es-ES', options?.[format]);
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate?.setDate(newDate?.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate?.setDate(newDate?.getDate() + (direction === 'next' ? 7 : -7));
    }
    onDateChange(newDate?.toISOString()?.split('T')?.[0]);
  };

  const goToToday = () => {
    onDateChange(today?.toISOString()?.split('T')?.[0]);
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek?.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek?.setDate(startOfWeek?.getDate() + mondayOffset);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date?.setDate(startOfWeek?.getDate() + i);
      dates?.push(date);
    }
    return dates;
  };

  const isToday = (date) => {
    return date?.toDateString() === today?.toDateString();
  };

  const isSelected = (date) => {
    return date?.toDateString() === currentDate?.toDateString();
  };

  const getDateStats = (date) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    return reservationStats?.[dateStr] || { total: 0, confirmed: 0, pending: 0 };
  };

  const weekDates = getWeekDates();

  return (
    <div className="bg-card border border-border rounded-lg p-4 restaurant-shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-foreground">
            {formatDate(currentDate)}
          </h2>
          
          {!isToday(currentDate) && (
            <Button
              variant="outline"
              size="xs"
              onClick={goToToday}
              iconName="Calendar"
            >
              Hoy
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex bg-muted rounded-md p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`
                px-3 py-1 rounded text-xs font-medium restaurant-transition
                ${viewMode === 'week' ?'bg-background text-foreground restaurant-shadow-sm' :'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`
                px-3 py-1 rounded text-xs font-medium restaurant-transition
                ${viewMode === 'month' ?'bg-background text-foreground restaurant-shadow-sm' :'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              Mes
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate('prev')}
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate('next')}
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Week View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-2">
          {weekDates?.map((date, index) => {
            const stats = getDateStats(date);
            const isCurrentDay = isSelected(date);
            const isTodayDate = isToday(date);
            
            return (
              <button
                key={index}
                onClick={() => onDateChange(date?.toISOString()?.split('T')?.[0])}
                className={`
                  p-3 rounded-lg border text-center restaurant-transition
                  ${isCurrentDay 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : isTodayDate
                    ? 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20' :'bg-background text-foreground border-border hover:bg-muted'
                  }
                `}
              >
                <div className="text-xs font-medium mb-1">
                  {formatDate(date, 'weekday')}
                </div>
                <div className={`text-lg font-semibold ${isCurrentDay ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {formatDate(date, 'day')}
                </div>
                {stats?.total > 0 && (
                  <div className="flex justify-center space-x-1 mt-1">
                    <div className={`w-1 h-1 rounded-full ${stats?.confirmed > 0 ? 'bg-success' : 'bg-muted'}`}></div>
                    <div className={`w-1 h-1 rounded-full ${stats?.pending > 0 ? 'bg-warning' : 'bg-muted'}`}></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
      {/* Month View */}
      {viewMode === 'month' && (
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-2">
            {currentDate?.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </div>
          <div className="text-sm text-muted-foreground">
            Vista mensual próximamente
          </div>
        </div>
      )}
      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">
              {reservationStats?.[selectedDate]?.total || 0}
            </div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success">
              {reservationStats?.[selectedDate]?.confirmed || 0}
            </div>
            <div className="text-xs text-muted-foreground">Confirmadas</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-warning">
              {reservationStats?.[selectedDate]?.pending || 0}
            </div>
            <div className="text-xs text-muted-foreground">Pendientes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateNavigator;