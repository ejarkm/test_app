import React from 'react';
import Icon from '../../../components/AppIcon';

const CapacityOverview = ({ 
  selectedDate, 
  reservations = [], 
  tables = [],
  timeSlots = [] 
}) => {
  const calculateCapacityData = () => {
    const totalCapacity = tables?.reduce((sum, table) => sum + table?.capacity, 0);
    const availableTables = tables?.filter(table => table?.status === 'available')?.length;
    const occupiedTables = tables?.filter(table => table?.status === 'occupied')?.length;
    const reservedTables = tables?.filter(table => table?.status === 'reserved')?.length;
    
    const todayReservations = reservations?.filter(r => r?.date === selectedDate);
    const totalGuests = todayReservations?.reduce((sum, r) => sum + r?.partySize, 0);
    const occupancyRate = totalCapacity > 0 ? Math.round((totalGuests / totalCapacity) * 100) : 0;
    
    return {
      totalCapacity,
      availableTables,
      occupiedTables,
      reservedTables,
      totalTables: tables?.length,
      totalGuests,
      occupancyRate,
      totalReservations: todayReservations?.length
    };
  };

  const getTimeSlotData = () => {
    const slots = [
      '12:00', '13:00', '14:00', '15:00',
      '18:00', '19:00', '20:00', '21:00', '22:00'
    ];
    
    return slots?.map(time => {
      const slotReservations = reservations?.filter(r => 
        r?.date === selectedDate && r?.time === time
      );
      const guestCount = slotReservations?.reduce((sum, r) => sum + r?.partySize, 0);
      const capacity = calculateCapacityData()?.totalCapacity;
      const utilization = capacity > 0 ? Math.round((guestCount / capacity) * 100) : 0;
      
      return {
        time,
        reservations: slotReservations?.length,
        guests: guestCount,
        utilization
      };
    });
  };

  const capacityData = calculateCapacityData();
  const timeSlotData = getTimeSlotData();

  const getUtilizationColor = (percentage) => {
    if (percentage >= 90) return 'text-error';
    if (percentage >= 70) return 'text-warning';
    if (percentage >= 50) return 'text-success';
    return 'text-muted-foreground';
  };

  const getUtilizationBg = (percentage) => {
    if (percentage >= 90) return 'bg-error/10';
    if (percentage >= 70) return 'bg-warning/10';
    if (percentage >= 50) return 'bg-success/10';
    return 'bg-muted/30';
  };

  return (
    <div className="space-y-6">
      {/* Overall Capacity Stats */}
      <div className="bg-card border border-border rounded-lg p-4 restaurant-shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Resumen de Capacidad
          </h3>
          <div className="text-sm text-muted-foreground">
            {new Date(selectedDate)?.toLocaleDateString('es-ES', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Users" size={20} className="text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {capacityData?.occupancyRate}%
            </div>
            <div className="text-xs text-muted-foreground">Ocupación</div>
          </div>

          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Calendar" size={20} className="text-success" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {capacityData?.totalReservations}
            </div>
            <div className="text-xs text-muted-foreground">Reservas</div>
          </div>

          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon name="UserCheck" size={20} className="text-accent" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {capacityData?.totalGuests}
            </div>
            <div className="text-xs text-muted-foreground">Comensales</div>
          </div>

          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Grid3X3" size={20} className="text-warning" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {capacityData?.availableTables}/{capacityData?.totalTables}
            </div>
            <div className="text-xs text-muted-foreground">Mesas Libres</div>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Capacidad Total: {capacityData?.totalCapacity} personas
            </span>
            <span className="text-sm text-muted-foreground">
              {capacityData?.totalGuests} ocupadas
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full restaurant-transition ${
                capacityData?.occupancyRate >= 90 ? 'bg-error' :
                capacityData?.occupancyRate >= 70 ? 'bg-warning': 'bg-success'
              }`}
              style={{ width: `${Math.min(capacityData?.occupancyRate, 100)}%` }}
            />
          </div>
        </div>
      </div>
      {/* Time Slot Analysis */}
      <div className="bg-card border border-border rounded-lg p-4 restaurant-shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Análisis por Horarios
        </h3>

        <div className="space-y-3">
          {timeSlotData?.map((slot, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-foreground min-w-[60px]">
                  {slot?.time}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>{slot?.reservations} reservas</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={14} />
                    <span>{slot?.guests} personas</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${getUtilizationBg(slot?.utilization)} ${getUtilizationColor(slot?.utilization)}
                `}>
                  {slot?.utilization}%
                </div>
                
                <div className="w-20 bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full restaurant-transition ${
                      slot?.utilization >= 90 ? 'bg-error' :
                      slot?.utilization >= 70 ? 'bg-warning' :
                      slot?.utilization >= 50 ? 'bg-success': 'bg-muted-foreground'
                    }`}
                    style={{ width: `${Math.min(slot?.utilization, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Peak Hours Indicator */}
        <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">Horas Pico</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Las horas con mayor demanda suelen ser entre las 20:00 y 21:00. 
            Considera optimizar la asignación de mesas durante estos períodos.
          </div>
        </div>
      </div>
      {/* Table Status Distribution */}
      <div className="bg-card border border-border rounded-lg p-4 restaurant-shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Estado de Mesas
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm text-foreground">Disponibles</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {capacityData?.availableTables}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <span className="text-sm text-foreground">Ocupadas</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {capacityData?.occupiedTables}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-sm text-foreground">Reservadas</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {capacityData?.reservedTables}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-muted rounded-full"></div>
                <span className="text-sm text-foreground">En limpieza</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {tables?.filter(t => t?.status === 'cleaning')?.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapacityOverview;