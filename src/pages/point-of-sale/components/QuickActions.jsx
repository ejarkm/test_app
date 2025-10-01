import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ 
  onNewOrder, 
  onHoldOrder, 
  onRecallOrder, 
  onOpenCashDrawer,
  onVoidTransaction,
  hasActiveOrder = false 
}) => {
  const quickActions = [
    {
      id: 'new_order',
      label: 'Nueva Orden',
      icon: 'Plus',
      action: onNewOrder,
      variant: 'default',
      disabled: false
    },
    {
      id: 'hold_order',
      label: 'Suspender',
      icon: 'Pause',
      action: onHoldOrder,
      variant: 'outline',
      disabled: !hasActiveOrder
    },
    {
      id: 'recall_order',
      label: 'Recuperar',
      icon: 'RotateCcw',
      action: onRecallOrder,
      variant: 'outline',
      disabled: false
    },
    {
      id: 'cash_drawer',
      label: 'Abrir Caja',
      icon: 'DollarSign',
      action: onOpenCashDrawer,
      variant: 'secondary',
      disabled: false
    },
    {
      id: 'void_transaction',
      label: 'Anular',
      icon: 'X',
      action: onVoidTransaction,
      variant: 'destructive',
      disabled: !hasActiveOrder
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 restaurant-shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Zap" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Acciones Rápidas</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {quickActions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant}
            size="default"
            onClick={action?.action}
            disabled={action?.disabled}
            iconName={action?.icon}
            iconPosition="left"
            className="flex-col h-16 text-xs"
          >
            <span className="mt-1">{action?.label}</span>
          </Button>
        ))}
      </div>
      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              Turno: {new Date()?.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="User" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">Cajero: María García</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;