import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReservationList = ({ 
  reservations = [], 
  selectedDate, 
  onReservationSelect,
  onReservationUpdate,
  onReservationCancel 
}) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statusColors = {
    confirmed: 'bg-success/10 text-success border-success/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
    seated: 'bg-primary/10 text-primary border-primary/20',
    cancelled: 'bg-error/10 text-error border-error/20',
    completed: 'bg-muted text-muted-foreground border-border'
  };

  const statusLabels = {
    confirmed: 'Confirmada',
    pending: 'Pendiente',
    seated: 'Sentados',
    cancelled: 'Cancelada',
    completed: 'Completada'
  };

  const filteredReservations = reservations?.filter(reservation => {
    const matchesStatus = filterStatus === 'all' || reservation?.status === filterStatus;
    const matchesSearch = reservation?.customerName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         reservation?.phone?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const sortedReservations = filteredReservations?.sort((a, b) => {
    return new Date(`${selectedDate} ${a.time}`) - new Date(`${selectedDate} ${b.time}`);
  });

  const handleStatusChange = (reservationId, newStatus) => {
    onReservationUpdate(reservationId, { status: newStatus });
  };

  const formatTime = (time) => {
    return new Date(`2024-01-01 ${time}`)?.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeStatus = (time) => {
    const now = new Date();
    const reservationTime = new Date(`${selectedDate} ${time}`);
    const diffMinutes = (reservationTime - now) / (1000 * 60);
    
    if (diffMinutes < -30) return 'late';
    if (diffMinutes < 0) return 'current';
    if (diffMinutes < 30) return 'upcoming';
    return 'future';
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Reservas del Día
          </h2>
          <div className="text-sm text-muted-foreground">
            {sortedReservations?.length} reservas
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {['all', 'confirmed', 'pending', 'seated', 'completed']?.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`
                px-3 py-1 rounded-full text-xs font-medium restaurant-transition
                ${filterStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              {status === 'all' ? 'Todas' : statusLabels?.[status]}
            </button>
          ))}
        </div>
      </div>
      {/* Reservations List */}
      <div className="flex-1 overflow-y-auto">
        {sortedReservations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Icon name="Calendar" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No hay reservas
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || filterStatus !== 'all' ?'No se encontraron reservas con los filtros aplicados' :'No hay reservas para esta fecha'
              }
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {sortedReservations?.map((reservation) => (
              <div
                key={reservation?.id}
                onClick={() => onReservationSelect(reservation)}
                className="p-4 border border-border rounded-lg bg-background hover:bg-muted/50 restaurant-transition cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {reservation?.customerName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {reservation?.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`
                    px-2 py-1 rounded-full text-xs font-medium border
                    ${statusColors?.[reservation?.status]}
                  `}>
                    {statusLabels?.[reservation?.status]}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {formatTime(reservation?.time)}
                    </span>
                    {getTimeStatus(reservation?.time) === 'upcoming' && (
                      <span className="text-xs text-warning">Próxima</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {reservation?.partySize} personas
                    </span>
                  </div>
                </div>

                {reservation?.tableNumber && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="MapPin" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      Mesa {reservation?.tableNumber}
                    </span>
                  </div>
                )}

                {reservation?.specialRequests && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Solicitudes especiales:</p>
                    <p className="text-sm text-foreground bg-muted/50 p-2 rounded">
                      {reservation?.specialRequests}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {reservation?.status === 'pending' && (
                      <Button
                        variant="success"
                        size="xs"
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleStatusChange(reservation?.id, 'confirmed');
                        }}
                        iconName="Check"
                      >
                        Confirmar
                      </Button>
                    )}
                    
                    {reservation?.status === 'confirmed' && (
                      <Button
                        variant="default"
                        size="xs"
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleStatusChange(reservation?.id, 'seated');
                        }}
                        iconName="UserCheck"
                      >
                        Sentar
                      </Button>
                    )}
                    
                    {reservation?.status === 'seated' && (
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleStatusChange(reservation?.id, 'completed');
                        }}
                        iconName="CheckCircle"
                      >
                        Completar
                      </Button>
                    )}
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={(e) => {
                        e?.stopPropagation();
                        // Handle edit
                        console.log('Edit reservation:', reservation?.id);
                      }}
                      iconName="Edit"
                    />
                    
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onReservationCancel(reservation?.id);
                      }}
                      iconName="X"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationList;