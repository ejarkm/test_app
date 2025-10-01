import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InventoryFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  categories,
  suppliers 
}) => {
  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'in_stock', label: 'En Stock' },
    { value: 'low_stock', label: 'Stock Bajo' },
    { value: 'out_of_stock', label: 'Sin Stock' },
    { value: 'expired', label: 'Caducado' },
    { value: 'expiring_soon', label: 'Próximo a Caducar' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas las Categorías' },
    ...categories?.map(cat => ({ value: cat?.id, label: cat?.name }))
  ];

  const supplierOptions = [
    { value: 'all', label: 'Todos los Proveedores' },
    ...suppliers?.map(sup => ({ value: sup?.id, label: sup?.name }))
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value !== '' && value !== 'all'
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 restaurant-shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Filter" size={20} className="mr-2 text-primary" />
          Filtros de Inventario
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Limpiar Filtros
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <Select
          placeholder="Categoría"
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => handleFilterChange('category', value)}
        />

        {/* Status Filter */}
        <Select
          placeholder="Estado"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        {/* Supplier Filter */}
        <Select
          placeholder="Proveedor"
          options={supplierOptions}
          value={filters?.supplier}
          onChange={(value) => handleFilterChange('supplier', value)}
          searchable
        />

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="default"
            iconName="AlertTriangle"
            onClick={() => handleFilterChange('status', 'low_stock')}
            className="flex-1"
          >
            Stock Bajo
          </Button>
        </div>
      </div>
      {/* Advanced Filters Toggle */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Costo Mínimo
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={filters?.minCost}
              onChange={(e) => handleFilterChange('minCost', e?.target?.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Costo Máximo
            </label>
            <Input
              type="number"
              placeholder="1000.00"
              value={filters?.maxCost}
              onChange={(e) => handleFilterChange('maxCost', e?.target?.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Fecha de Caducidad
            </label>
            <Input
              type="date"
              value={filters?.expiryDate}
              onChange={(e) => handleFilterChange('expiryDate', e?.target?.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;