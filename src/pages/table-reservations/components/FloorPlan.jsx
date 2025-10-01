import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FloorPlan = ({ 
  tables = [], 
  selectedTable,
  onTableSelect,
  onTableStatusChange,
  draggedReservation,
  onReservationDrop 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showTableNumbers, setShowTableNumbers] = useState(true);

  const tableStatusColors = {
    available: 'bg-success/20 border-success text-success',
    occupied: 'bg-error/20 border-error text-error',
    reserved: 'bg-warning/20 border-warning text-warning',
    cleaning: 'bg-muted border-border text-muted-foreground',
    maintenance: 'bg-destructive/20 border-destructive text-destructive'
  };

  const tableStatusLabels = {
    available: 'Disponible',
    occupied: 'Ocupada',
    reserved: 'Reservada',
    cleaning: 'Limpieza',
    maintenance: 'Mantenimiento'
  };

  const getTableIcon = (capacity) => {
    if (capacity <= 2) return 'Square';
    if (capacity <= 4) return 'Circle';
    if (capacity <= 6) return 'Hexagon';
    return 'Octagon';
  };

  const handleTableClick = (table) => {
    onTableSelect(table);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
  };

  const handleDrop = (e, table) => {
    e?.preventDefault();
    if (draggedReservation && table?.status === 'available') {
      onReservationDrop(draggedReservation, table);
    }
  };

  const getTablesByArea = () => {
    const areas = {};
    tables?.forEach(table => {
      if (!areas?.[table?.area]) {
        areas[table.area] = [];
      }
      areas?.[table?.area]?.push(table);
    });
    return areas;
  };

  const tablesByArea = getTablesByArea();

  const TableComponent = ({ table }) => (
    <div
      key={table?.id}
      onClick={() => handleTableClick(table)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, table)}
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer restaurant-transition
        ${tableStatusColors?.[table?.status]}
        ${selectedTable?.id === table?.id ? 'ring-2 ring-primary ring-offset-2' : ''}
        ${draggedReservation && table?.status === 'available' ? 'ring-2 ring-accent ring-offset-1' : ''}
        hover:scale-105 min-h-[80px] flex flex-col items-center justify-center
      `}
      style={{
        gridColumn: viewMode === 'grid' ? `span ${Math.ceil(table?.capacity / 2)}` : 'auto'
      }}
    >
      {/* Table Icon */}
      <Icon 
        name={getTableIcon(table?.capacity)} 
        size={viewMode === 'grid' ? 24 : 20} 
        className="mb-1" 
      />
      
      {/* Table Number */}
      {showTableNumbers && (
        <div className="text-sm font-semibold">
          Mesa {table?.number}
        </div>
      )}
      
      {/* Capacity */}
      <div className="text-xs opacity-80">
        {table?.capacity} personas
      </div>

      {/* Reservation Info */}
      {table?.reservationInfo && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
          R
        </div>
      )}

      {/* Status Indicator */}
      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-current opacity-60"></div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Plano del Restaurante
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="xs"
              onClick={() => setViewMode('grid')}
              iconName="Grid3X3"
            />
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="xs"
              onClick={() => setViewMode('list')}
              iconName="List"
            />
            
            <Button
              variant={showTableNumbers ? 'default' : 'outline'}
              size="xs"
              onClick={() => setShowTableNumbers(!showTableNumbers)}
              iconName="Hash"
            />
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(tableStatusLabels)?.map(([status, label]) => (
            <div key={status} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full border ${tableStatusColors?.[status]}`}></div>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Floor Plan Content */}
      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'grid' ? (
          <div className="space-y-6">
            {Object.entries(tablesByArea)?.map(([area, areaTables]) => (
              <div key={area} className="space-y-3">
                <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
                  {area}
                </h3>
                <div className="grid grid-cols-6 gap-3 auto-rows-min">
                  {areaTables?.map(table => (
                    <TableComponent key={table?.id} table={table} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(tablesByArea)?.map(([area, areaTables]) => (
              <div key={area} className="space-y-3">
                <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
                  {area} ({areaTables?.length} mesas)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {areaTables?.map(table => (
                    <div
                      key={table?.id}
                      onClick={() => handleTableClick(table)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, table)}
                      className={`
                        p-3 rounded-lg border cursor-pointer restaurant-transition
                        ${tableStatusColors?.[table?.status]}
                        ${selectedTable?.id === table?.id ? 'ring-2 ring-primary ring-offset-1' : ''}
                        hover:bg-opacity-80
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon name={getTableIcon(table?.capacity)} size={20} />
                          <div>
                            <div className="font-medium">Mesa {table?.number}</div>
                            <div className="text-xs opacity-80">{table?.capacity} personas</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xs font-medium">
                            {tableStatusLabels?.[table?.status]}
                          </div>
                          {table?.reservationInfo && (
                            <div className="text-xs opacity-80">
                              {table?.reservationInfo?.time}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Quick Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-success">
              {tables?.filter(t => t?.status === 'available')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Disponibles</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-error">
              {tables?.filter(t => t?.status === 'occupied')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Ocupadas</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-warning">
              {tables?.filter(t => t?.status === 'reserved')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Reservadas</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {tables?.reduce((sum, t) => sum + t?.capacity, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Capacidad Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlan;