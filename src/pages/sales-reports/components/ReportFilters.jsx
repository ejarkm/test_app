import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ReportFilters = ({ onFiltersChange, currentFilters }) => {
  const [filters, setFilters] = useState({
    dateRange: 'today',
    startDate: '',
    endDate: '',
    reportType: 'daily-sales',
    staffMember: 'all',
    tableSection: 'all',
    menuCategory: 'all',
    ...currentFilters
  });

  const dateRangeOptions = [
    { value: 'today', label: 'Hoy' },
    { value: 'yesterday', label: 'Ayer' },
    { value: 'this-week', label: 'Esta Semana' },
    { value: 'last-week', label: 'Semana Pasada' },
    { value: 'this-month', label: 'Este Mes' },
    { value: 'last-month', label: 'Mes Pasado' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const reportTypeOptions = [
    { value: 'daily-sales', label: 'Ventas Diarias' },
    { value: 'menu-performance', label: 'Rendimiento del Menú' },
    { value: 'payment-methods', label: 'Métodos de Pago' },
    { value: 'comparative-analysis', label: 'Análisis Comparativo' },
    { value: 'hourly-breakdown', label: 'Desglose por Horas' },
    { value: 'staff-performance', label: 'Rendimiento del Personal' }
  ];

  const staffOptions = [
    { value: 'all', label: 'Todo el Personal' },
    { value: 'maria-garcia', label: 'María García' },
    { value: 'carlos-rodriguez', label: 'Carlos Rodríguez' },
    { value: 'ana-martinez', label: 'Ana Martínez' },
    { value: 'luis-fernandez', label: 'Luis Fernández' }
  ];

  const sectionOptions = [
    { value: 'all', label: 'Todas las Secciones' },
    { value: 'terrace', label: 'Terraza' },
    { value: 'main-hall', label: 'Salón Principal' },
    { value: 'private-room', label: 'Sala Privada' },
    { value: 'bar', label: 'Barra' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas las Categorías' },
    { value: 'appetizers', label: 'Entrantes' },
    { value: 'main-courses', label: 'Platos Principales' },
    { value: 'desserts', label: 'Postres' },
    { value: 'beverages', label: 'Bebidas' },
    { value: 'wines', label: 'Vinos' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleQuickDateRange = (range) => {
    const today = new Date();
    let startDate = '';
    let endDate = '';

    switch (range) {
      case 'today':
        startDate = endDate = today?.toISOString()?.split('T')?.[0];
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday?.setDate(yesterday?.getDate() - 1);
        startDate = endDate = yesterday?.toISOString()?.split('T')?.[0];
        break;
      case 'this-week':
        const weekStart = new Date(today);
        weekStart?.setDate(today?.getDate() - today?.getDay());
        startDate = weekStart?.toISOString()?.split('T')?.[0];
        endDate = today?.toISOString()?.split('T')?.[0];
        break;
      case 'this-month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)?.toISOString()?.split('T')?.[0];
        endDate = today?.toISOString()?.split('T')?.[0];
        break;
    }

    const newFilters = { ...filters, dateRange: range, startDate, endDate };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      dateRange: 'today',
      startDate: '',
      endDate: '',
      reportType: 'daily-sales',
      staffMember: 'all',
      tableSection: 'all',
      menuCategory: 'all'
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 restaurant-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Filtros de Informe</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Restablecer
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <Select
            label="Rango de Fechas"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
          />
          
          {/* Quick Date Buttons */}
          <div className="flex flex-wrap gap-1">
            {['today', 'yesterday', 'this-week', 'this-month']?.map((range) => (
              <Button
                key={range}
                variant={filters?.dateRange === range ? 'default' : 'ghost'}
                size="xs"
                onClick={() => handleQuickDateRange(range)}
              >
                {dateRangeOptions?.find(opt => opt?.value === range)?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Date Range */}
        {filters?.dateRange === 'custom' && (
          <>
            <Input
              label="Fecha Inicio"
              type="date"
              value={filters?.startDate}
              onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
            />
            <Input
              label="Fecha Fin"
              type="date"
              value={filters?.endDate}
              onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
            />
          </>
        )}

        {/* Report Type */}
        <Select
          label="Tipo de Informe"
          options={reportTypeOptions}
          value={filters?.reportType}
          onChange={(value) => handleFilterChange('reportType', value)}
        />

        {/* Staff Member */}
        <Select
          label="Miembro del Personal"
          options={staffOptions}
          value={filters?.staffMember}
          onChange={(value) => handleFilterChange('staffMember', value)}
          searchable
        />

        {/* Table Section */}
        <Select
          label="Sección de Mesa"
          options={sectionOptions}
          value={filters?.tableSection}
          onChange={(value) => handleFilterChange('tableSection', value)}
        />

        {/* Menu Category */}
        <Select
          label="Categoría del Menú"
          options={categoryOptions}
          value={filters?.menuCategory}
          onChange={(value) => handleFilterChange('menuCategory', value)}
        />
      </div>
      {/* Active Filters Display */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(filters)?.map(([key, value]) => {
          if (value && value !== 'all' && key !== 'startDate' && key !== 'endDate') {
            const option = (() => {
              switch (key) {
                case 'dateRange':
                  return dateRangeOptions?.find(opt => opt?.value === value);
                case 'reportType':
                  return reportTypeOptions?.find(opt => opt?.value === value);
                case 'staffMember':
                  return staffOptions?.find(opt => opt?.value === value);
                case 'tableSection':
                  return sectionOptions?.find(opt => opt?.value === value);
                case 'menuCategory':
                  return categoryOptions?.find(opt => opt?.value === value);
                default:
                  return null;
              }
            })();

            if (option && option?.value !== 'today' && option?.value !== 'daily-sales') {
              return (
                <div
                  key={key}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  <span>{option?.label}</span>
                  <button
                    onClick={() => handleFilterChange(key, key === 'reportType' ? 'daily-sales' : 'all')}
                    className="hover:bg-primary/20 rounded-full p-0.5 restaurant-transition"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              );
            }
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ReportFilters;