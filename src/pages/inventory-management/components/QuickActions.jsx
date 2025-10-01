import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ 
  onAddItem, 
  onBulkImport, 
  onGenerateReport, 
  onLowStockAlert,
  stats 
}) => {
  const actions = [
    {
      label: 'Agregar Producto',
      icon: 'PackagePlus',
      variant: 'default',
      onClick: onAddItem,
      description: 'Añadir nuevo producto al inventario'
    },
    {
      label: 'Importar Masivo',
      icon: 'Upload',
      variant: 'outline',
      onClick: onBulkImport,
      description: 'Importar productos desde Excel/CSV'
    },
    {
      label: 'Generar Informe',
      icon: 'FileText',
      variant: 'outline',
      onClick: onGenerateReport,
      description: 'Crear informe de inventario'
    },
    {
      label: 'Alertas de Stock',
      icon: 'AlertTriangle',
      variant: 'outline',
      onClick: onLowStockAlert,
      description: 'Ver productos con stock bajo',
      badge: stats?.lowStockItems > 0 ? stats?.lowStockItems : null,
      urgent: stats?.lowStockItems > 0
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 restaurant-shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Acciones Rápidas
          </h3>
          <p className="text-sm text-muted-foreground">
            Gestiona tu inventario de forma eficiente
          </p>
        </div>
        <Icon name="Zap" size={20} className="text-primary" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions?.map((action, index) => (
          <div key={index} className="relative">
            <Button
              variant={action?.variant}
              onClick={action?.onClick}
              iconName={action?.icon}
              iconPosition="left"
              className={`
                w-full h-auto p-4 flex-col items-start text-left
                ${action?.urgent ? 'ring-2 ring-warning/20 border-warning/30' : ''}
              `}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-medium">{action?.label}</span>
                {action?.badge && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-error text-error-foreground rounded-full">
                    {action?.badge}
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-normal">
                {action?.description}
              </span>
            </Button>
            
            {action?.urgent && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full animate-pulse"></div>
            )}
          </div>
        ))}
      </div>
      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats?.totalProducts || 0}
            </div>
            <div className="text-muted-foreground">Total Productos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {stats?.inStockItems || 0}
            </div>
            <div className="text-muted-foreground">En Stock</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {stats?.lowStockItems || 0}
            </div>
            <div className="text-muted-foreground">Stock Bajo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-error">
              {stats?.outOfStockItems || 0}
            </div>
            <div className="text-muted-foreground">Sin Stock</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;