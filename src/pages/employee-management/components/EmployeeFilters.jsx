import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EmployeeFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    role: '',
    status: '',
    performanceRating: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const departmentOptions = [
    { value: '', label: 'Todos los Departamentos' },
    { value: 'kitchen', label: 'Cocina' },
    { value: 'service', label: 'Servicio' },
    { value: 'management', label: 'Gerencia' },
    { value: 'administration', label: 'Administración' },
    { value: 'cleaning', label: 'Limpieza' }
  ];

  const roleOptions = [
    { value: '', label: 'Todos los Roles' },
    { value: 'chef', label: 'Chef' },
    { value: 'sous-chef', label: 'Sous Chef' },
    { value: 'cook', label: 'Cocinero' },
    { value: 'waiter', label: 'Camarero' },
    { value: 'host', label: 'Anfitrión' },
    { value: 'cashier', label: 'Cajero' },
    { value: 'manager', label: 'Gerente' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'cleaner', label: 'Personal de Limpieza' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos los Estados' },
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'on-leave', label: 'En Licencia' },
    { value: 'probation', label: 'En Prueba' }
  ];

  const performanceOptions = [
    { value: '', label: 'Todas las Calificaciones' },
    { value: 'excellent', label: 'Excelente (4.5-5.0)' },
    { value: 'good', label: 'Bueno (3.5-4.4)' },
    { value: 'average', label: 'Promedio (2.5-3.4)' },
    { value: 'needs-improvement', label: 'Necesita Mejora (1.0-2.4)' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      department: '',
      role: '',
      status: '',
      performanceRating: ''
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 restaurant-shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filtros de Empleados</h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              iconName="X"
            >
              Limpiar Filtros
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          >
            {isExpanded ? 'Menos Filtros' : 'Más Filtros'}
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Buscar por nombre, email o ID de empleado..."
              value={filters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="w-full"
            />
          </div>
          <Button
            variant="outline"
            iconName="Search"
            className="sm:w-auto w-full"
          >
            Buscar
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Departamento"
            options={departmentOptions}
            value={filters?.department}
            onChange={(value) => handleFilterChange('department', value)}
          />

          <Select
            label="Rol"
            options={roleOptions}
            value={filters?.role}
            onChange={(value) => handleFilterChange('role', value)}
          />

          <Select
            label="Estado"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
          />

          {isExpanded && (
            <Select
              label="Calificación"
              options={performanceOptions}
              value={filters?.performanceRating}
              onChange={(value) => handleFilterChange('performanceRating', value)}
            />
          )}
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Fecha de Contratación</label>
                <div className="flex space-x-2">
                  <Input
                    type="date"
                    placeholder="Desde"
                    className="flex-1"
                  />
                  <Input
                    type="date"
                    placeholder="Hasta"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Próxima Revisión</label>
                <Select
                  options={[
                    { value: '', label: 'Todas las fechas' },
                    { value: 'overdue', label: 'Caducadas' },
                    { value: 'this-week', label: 'Esta semana' },
                    { value: 'this-month', label: 'Este mes' },
                    { value: 'next-month', label: 'Próximo mes' }
                  ]}
                  value=""
                  onChange={() => {}}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Capacitación Pendiente</label>
                <Select
                  options={[
                    { value: '', label: 'Todas' },
                    { value: 'safety', label: 'Seguridad' },
                    { value: 'customer-service', label: 'Atención al Cliente' },
                    { value: 'food-handling', label: 'Manipulación de Alimentos' },
                    { value: 'pos-system', label: 'Sistema POS' }
                  ]}
                  value=""
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Filtros activos:</span>
            {Object.entries(filters)?.map(([key, value]) => {
              if (!value) return null;
              
              let displayValue = value;
              if (key === 'department') {
                displayValue = departmentOptions?.find(opt => opt?.value === value)?.label || value;
              } else if (key === 'role') {
                displayValue = roleOptions?.find(opt => opt?.value === value)?.label || value;
              } else if (key === 'status') {
                displayValue = statusOptions?.find(opt => opt?.value === value)?.label || value;
              } else if (key === 'performanceRating') {
                displayValue = performanceOptions?.find(opt => opt?.value === value)?.label || value;
              }

              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                >
                  {displayValue}
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-1 hover:text-primary/80"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeFilters;