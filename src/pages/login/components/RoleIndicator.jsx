import React from 'react';
import Icon from '../../../components/AppIcon';

const RoleIndicator = () => {
  const roles = [
    {
      role: 'admin',
      label: 'Administrador',
      description: 'Acceso completo al sistema',
      icon: 'Shield',
      color: 'text-error'
    },
    {
      role: 'manager',
      label: 'Gerente',
      description: 'Gestión operativa e informes',
      icon: 'Users',
      color: 'text-primary'
    },
    {
      role: 'cashier',
      label: 'Cajero',
      description: 'Punto de venta y transacciones',
      icon: 'ShoppingCart',
      color: 'text-accent'
    },
    {
      role: 'host',
      label: 'Anfitrión',
      description: 'Reservas y gestión de mesas',
      icon: 'Calendar',
      color: 'text-success'
    },
    {
      role: 'kitchen',
      label: 'Cocina',
      description: 'Inventario y órdenes',
      icon: 'Package',
      color: 'text-warning'
    }
  ];

  return (
    <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="Info" size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Niveles de Acceso Disponibles
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {roles?.map((roleInfo) => (
          <div
            key={roleInfo?.role}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-background/50 restaurant-transition"
          >
            <Icon 
              name={roleInfo?.icon} 
              size={16} 
              className={roleInfo?.color}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-foreground">
                {roleInfo?.label}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {roleInfo?.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleIndicator;