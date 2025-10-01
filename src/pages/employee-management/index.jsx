import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import EmployeeStatsCards from './components/EmployeeStatsCards';
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeTable from './components/EmployeeTable';
import EmployeeProfileModal from './components/EmployeeProfileModal';

const EmployeeManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [filters, setFilters] = useState({});

  // Mock user data
  const currentUser = {
    name: 'María González',
    role: 'manager',
    email: 'maria.gonzalez@spaikrestaurant.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'employee',
      title: 'Revisión Caducada',
      message: 'Carlos Rodríguez tiene una evaluación pendiente desde hace 5 días',
      time: '2 horas',
      priority: 'high',
      read: false
    },
    {
      id: 2,
      type: 'employee',
      title: 'Capacitación Completada',
      message: 'Ana López completó el curso de Atención al Cliente',
      time: '4 horas',
      priority: 'medium',
      read: false
    },
    {
      id: 3,
      type: 'employee',
      title: 'Nuevo Empleado',
      message: 'Pedro Sánchez se incorpora mañana al equipo',
      time: '1 día',
      priority: 'low',
      read: true
    }
  ];

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Here you would typically filter the employee data
    console.log('Filters changed:', newFilters);
  };

  const contextActions = [
    {
      label: 'Nuevo Empleado',
      icon: 'UserPlus',
      action: () => console.log('Create new employee'),
      variant: 'default',
      primary: true
    },
    {
      label: 'Marcar Asistencia',
      icon: 'Clock',
      action: () => console.log('Clock in/out'),
      variant: 'outline'
    },
    {
      label: 'Generar Nómina',
      icon: 'DollarSign',
      action: () => console.log('Generate payroll'),
      variant: 'outline'
    },
    {
      label: 'Exportar Lista',
      icon: 'Download',
      action: () => console.log('Export employee list'),
      variant: 'ghost'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={currentUser} notifications={notifications} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <NavigationBreadcrumb />

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Gestión de Personal</h1>
                <p className="text-muted-foreground mt-2">
                  Administra empleados, horarios, capacitaciones y evaluaciones de desempeño
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Última actualización</div>
                  <div className="text-sm font-medium text-foreground">
                    {new Date()?.toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <EmployeeStatsCards />

          {/* Filters */}
          <EmployeeFilters onFiltersChange={handleFiltersChange} />

          {/* Employee Table */}
          <EmployeeTable onEmployeeSelect={handleEmployeeSelect} />

          {/* Employee Profile Modal */}
          <EmployeeProfileModal
            employee={selectedEmployee}
            isOpen={isProfileModalOpen}
            onClose={handleCloseProfileModal}
          />

          {/* Quick Action Toolbar */}
          <QuickActionToolbar
            contextActions={contextActions}
            position="floating"
            user={currentUser}
          />
        </div>
      </main>
    </div>
  );
};

export default EmployeeManagement;