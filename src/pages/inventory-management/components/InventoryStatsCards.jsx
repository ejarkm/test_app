import React from 'react';
import Icon from '../../../components/AppIcon';

const InventoryStatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Valor Total del Inventario',
      value: `$${stats?.totalValue?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      icon: 'DollarSign',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: stats?.valueChange,
      changeType: stats?.valueChange >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Productos con Stock Bajo',
      value: stats?.lowStockItems,
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      urgent: stats?.lowStockItems > 0
    },
    {
      title: 'Entregas Pendientes',
      value: stats?.pendingDeliveries,
      icon: 'Truck',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      subtitle: `${stats?.deliveriesToday} hoy`
    },
    {
      title: 'Productos Próximos a Caducar',
      value: stats?.expiringItems,
      icon: 'Clock',
      color: 'text-error',
      bgColor: 'bg-error/10',
      urgent: stats?.expiringItems > 0
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards?.map((card, index) => (
        <div
          key={index}
          className={`
            bg-card border border-border rounded-lg p-6 restaurant-shadow-sm
            restaurant-transition hover:restaurant-shadow-md
            ${card?.urgent ? 'ring-2 ring-warning/20' : ''}
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${card?.bgColor} flex items-center justify-center`}>
              <Icon name={card?.icon} size={24} className={card?.color} />
            </div>
            {card?.urgent && (
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {card?.title}
            </h3>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-foreground">
                {card?.value}
              </p>
              {card?.change !== undefined && (
                <span className={`
                  text-sm font-medium flex items-center
                  ${card?.changeType === 'positive' ? 'text-success' : 'text-error'}
                `}>
                  <Icon 
                    name={card?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                    size={14} 
                    className="mr-1" 
                  />
                  {Math.abs(card?.change)}%
                </span>
              )}
            </div>
            {card?.subtitle && (
              <p className="text-sm text-muted-foreground">
                {card?.subtitle}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryStatsCards;