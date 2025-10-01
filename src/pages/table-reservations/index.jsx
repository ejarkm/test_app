import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import ReservationList from './components/ReservationList';
import FloorPlan from './components/FloorPlan';
import ReservationModal from './components/ReservationModal';
import DateNavigator from './components/DateNavigator';
import CapacityOverview from './components/CapacityOverview';
import Icon from '../../components/AppIcon';


const TableReservations = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()?.toISOString()?.split('T')?.[0]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedReservation, setDraggedReservation] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // split, reservations, floor, capacity
  const [user] = useState({
    name: 'Ana García',
    role: 'manager',
    email: 'ana.garcia@spaikrestaurant.com',
    avatar: null
  });

  // Mock data for reservations
  const [reservations, setReservations] = useState([
    {
      id: 1,
      customerName: 'Carlos Rodríguez',
      phone: '+34 666 123 456',
      email: 'carlos@email.com',
      partySize: 4,
      time: '20:00',
      date: new Date()?.toISOString()?.split('T')?.[0],
      tableNumber: '12',
      specialRequests: 'Celebración de aniversario, mesa junto a la ventana si es posible',
      status: 'confirmed',
      createdAt: '2024-09-24T10:30:00Z',
      updatedAt: '2024-09-24T10:30:00Z'
    },
    {
      id: 2,
      customerName: 'María López',
      phone: '+34 677 987 654',
      email: 'maria.lopez@email.com',
      partySize: 2,
      time: '19:30',
      date: new Date()?.toISOString()?.split('T')?.[0],
      tableNumber: '',
      specialRequests: '',
      status: 'pending',
      createdAt: '2024-09-24T11:15:00Z',
      updatedAt: '2024-09-24T11:15:00Z'
    },
    {
      id: 3,
      customerName: 'José Martínez',
      phone: '+34 655 444 333',
      email: 'jose.martinez@email.com',
      partySize: 6,
      time: '21:00',
      date: new Date()?.toISOString()?.split('T')?.[0],
      tableNumber: '8',
      specialRequests: 'Cena de empresa, necesitan factura',
      status: 'seated',
      createdAt: '2024-09-24T09:45:00Z',
      updatedAt: '2024-09-24T18:30:00Z'
    },
    {
      id: 4,
      customerName: 'Laura Sánchez',
      phone: '+34 699 111 222',
      email: 'laura@email.com',
      partySize: 3,
      time: '20:30',
      date: new Date()?.toISOString()?.split('T')?.[0],
      tableNumber: '5',
      specialRequests: 'Alergia al gluten',
      status: 'confirmed',
      createdAt: '2024-09-24T12:00:00Z',
      updatedAt: '2024-09-24T12:00:00Z'
    }
  ]);

  // Mock data for tables
  const [tables, setTables] = useState([
    { id: 1, number: '1', capacity: 2, area: 'Terraza', status: 'available' },
    { id: 2, number: '2', capacity: 2, area: 'Terraza', status: 'available' },
    { id: 3, number: '3', capacity: 4, area: 'Terraza', status: 'occupied' },
    { id: 4, number: '4', capacity: 4, area: 'Terraza', status: 'available' },
    { id: 5, number: '5', capacity: 4, area: 'Salón Principal', status: 'reserved', reservationInfo: { time: '20:30', customerName: 'Laura Sánchez' } },
    { id: 6, number: '6', capacity: 6, area: 'Salón Principal', status: 'available' },
    { id: 7, number: '7', capacity: 6, area: 'Salón Principal', status: 'cleaning' },
    { id: 8, number: '8', capacity: 8, area: 'Salón Principal', status: 'occupied', reservationInfo: { time: '21:00', customerName: 'José Martínez' } },
    { id: 9, number: '9', capacity: 2, area: 'Salón Principal', status: 'available' },
    { id: 10, number: '10', capacity: 2, area: 'Salón Principal', status: 'available' },
    { id: 11, number: '11', capacity: 4, area: 'Área VIP', status: 'available' },
    { id: 12, number: '12', capacity: 4, area: 'Área VIP', status: 'reserved', reservationInfo: { time: '20:00', customerName: 'Carlos Rodríguez' } },
    { id: 13, number: '13', capacity: 6, area: 'Área VIP', status: 'available' },
    { id: 14, number: '14', capacity: 8, area: 'Área VIP', status: 'available' },
    { id: 15, number: '15', capacity: 2, area: 'Barra', status: 'occupied' },
    { id: 16, number: '16', capacity: 2, area: 'Barra', status: 'available' }
  ]);

  // Mock notifications
  const [notifications] = useState([
    {
      id: 1,
      type: 'reservation',
      title: 'Nueva Reserva',
      message: 'Mesa para 4 personas a las 20:00',
      time: '5 min',
      priority: 'medium',
      read: false
    },
    {
      id: 2,
      type: 'reservation',
      title: 'Reserva Confirmada',
      message: 'Carlos Rodríguez - Mesa 12',
      time: '10 min',
      priority: 'low',
      read: false
    }
  ]);

  // Calculate reservation statistics
  const getReservationStats = () => {
    const stats = {};
    reservations?.forEach(reservation => {
      const date = reservation?.date;
      if (!stats?.[date]) {
        stats[date] = { total: 0, confirmed: 0, pending: 0, seated: 0, completed: 0 };
      }
      stats[date].total++;
      stats[date][reservation.status]++;
    });
    return stats;
  };

  const reservationStats = getReservationStats();

  // Filter reservations by selected date
  const todayReservations = reservations?.filter(r => r?.date === selectedDate);

  // Handle reservation operations
  const handleReservationSave = (reservationData) => {
    if (reservationData?.id && reservations?.find(r => r?.id === reservationData?.id)) {
      // Update existing reservation
      setReservations(prev => prev?.map(r => 
        r?.id === reservationData?.id ? reservationData : r
      ));
    } else {
      // Create new reservation
      setReservations(prev => [...prev, { ...reservationData, id: Date.now() }]);
    }
  };

  const handleReservationUpdate = (reservationId, updates) => {
    setReservations(prev => prev?.map(r => 
      r?.id === reservationId ? { ...r, ...updates, updatedAt: new Date()?.toISOString() } : r
    ));
  };

  const handleReservationCancel = (reservationId) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      handleReservationUpdate(reservationId, { status: 'cancelled' });
    }
  };

  const handleReservationDrop = (reservation, table) => {
    handleReservationUpdate(reservation?.id, { tableNumber: table?.number });
    setTables(prev => prev?.map(t => 
      t?.id === table?.id 
        ? { ...t, status: 'reserved', reservationInfo: { time: reservation?.time, customerName: reservation?.customerName } }
        : t
    ));
    setDraggedReservation(null);
  };

  // Handle table operations
  const handleTableStatusChange = (tableId, newStatus) => {
    setTables(prev => prev?.map(t => 
      t?.id === tableId ? { ...t, status: newStatus } : t
    ));
  };

  // Quick actions for this page
  const quickActions = [
    {
      label: 'Nueva Reserva',
      icon: 'CalendarPlus',
      action: () => {
        setSelectedReservation(null);
        setIsModalOpen(true);
      },
      variant: 'default',
      primary: true
    },
    {
      label: 'Ver Disponibilidad',
      icon: 'Calendar',
      action: () => setViewMode('capacity'),
      variant: 'outline'
    },
    {
      label: 'Lista de Espera',
      icon: 'Clock',
      action: () => console.log('Manage waitlist'),
      variant: 'outline'
    },
    {
      label: 'Cambiar Mesa',
      icon: 'ArrowRightLeft',
      action: () => console.log('Change table'),
      variant: 'ghost'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} notifications={notifications} />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <NavigationBreadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Reservas de Mesa
              </h1>
              <p className="text-muted-foreground">
                Gestiona las reservas y optimiza la ocupación de mesas
              </p>
            </div>
            
            {/* View Mode Selector */}
            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('split')}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium restaurant-transition flex items-center space-x-2
                    ${viewMode === 'split' ?'bg-background text-foreground restaurant-shadow-sm' :'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon name="Columns" size={16} />
                  <span className="hidden sm:inline">División</span>
                </button>
                <button
                  onClick={() => setViewMode('reservations')}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium restaurant-transition flex items-center space-x-2
                    ${viewMode === 'reservations' ?'bg-background text-foreground restaurant-shadow-sm' :'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon name="List" size={16} />
                  <span className="hidden sm:inline">Reservas</span>
                </button>
                <button
                  onClick={() => setViewMode('floor')}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium restaurant-transition flex items-center space-x-2
                    ${viewMode === 'floor' ?'bg-background text-foreground restaurant-shadow-sm' :'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon name="Grid3X3" size={16} />
                  <span className="hidden sm:inline">Plano</span>
                </button>
                <button
                  onClick={() => setViewMode('capacity')}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium restaurant-transition flex items-center space-x-2
                    ${viewMode === 'capacity' ?'bg-background text-foreground restaurant-shadow-sm' :'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon name="BarChart3" size={16} />
                  <span className="hidden sm:inline">Capacidad</span>
                </button>
              </div>
            </div>
          </div>

          {/* Date Navigator */}
          <div className="mb-6">
            <DateNavigator
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              reservationStats={reservationStats}
            />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {viewMode === 'split' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
                <ReservationList
                  reservations={todayReservations}
                  selectedDate={selectedDate}
                  onReservationSelect={setSelectedReservation}
                  onReservationUpdate={handleReservationUpdate}
                  onReservationCancel={handleReservationCancel}
                />
                <FloorPlan
                  tables={tables}
                  selectedTable={selectedTable}
                  onTableSelect={setSelectedTable}
                  onTableStatusChange={handleTableStatusChange}
                  draggedReservation={draggedReservation}
                  onReservationDrop={handleReservationDrop}
                />
              </div>
            )}

            {viewMode === 'reservations' && (
              <div className="h-[calc(100vh-300px)]">
                <ReservationList
                  reservations={todayReservations}
                  selectedDate={selectedDate}
                  onReservationSelect={setSelectedReservation}
                  onReservationUpdate={handleReservationUpdate}
                  onReservationCancel={handleReservationCancel}
                />
              </div>
            )}

            {viewMode === 'floor' && (
              <div className="h-[calc(100vh-300px)]">
                <FloorPlan
                  tables={tables}
                  selectedTable={selectedTable}
                  onTableSelect={setSelectedTable}
                  onTableStatusChange={handleTableStatusChange}
                  draggedReservation={draggedReservation}
                  onReservationDrop={handleReservationDrop}
                />
              </div>
            )}

            {viewMode === 'capacity' && (
              <CapacityOverview
                selectedDate={selectedDate}
                reservations={reservations}
                tables={tables}
              />
            )}
          </div>
        </div>
      </main>
      {/* Reservation Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReservation(null);
        }}
        onSave={handleReservationSave}
        reservation={selectedReservation}
        availableTables={tables?.filter(t => t?.status === 'available')}
        selectedDate={selectedDate}
      />
      {/* Quick Action Toolbar */}
      <QuickActionToolbar
        contextActions={quickActions}
        position="floating"
        user={user}
      />
    </div>
  );
};

export default TableReservations;