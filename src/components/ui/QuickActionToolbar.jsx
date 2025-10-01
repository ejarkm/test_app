import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionToolbar = ({ 
  contextActions = [], 
  position = 'floating',
  user = null 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const getContextualActions = () => {
    if (contextActions?.length > 0) {
      return contextActions;
    }

    // Default actions based on current route
    switch (location?.pathname) {
      case '/point-of-sale':
        return [
          {
            label: 'Nueva Orden',
            icon: 'Plus',
            action: () => console.log('Create new order'),
            variant: 'default',
            primary: true
          },
          {
            label: 'Buscar Producto',
            icon: 'Search',
            action: () => console.log('Search products'),
            variant: 'outline'
          },
          {
            label: 'Abrir Caja',
            icon: 'DollarSign',
            action: () => console.log('Open cash register'),
            variant: 'outline'
          },
          {
            label: 'Imprimir Recibo',
            icon: 'Printer',
            action: () => console.log('Print receipt'),
            variant: 'ghost'
          }
        ];

      case '/table-reservations':
        return [
          {
            label: 'Nueva Reserva',
            icon: 'CalendarPlus',
            action: () => console.log('Create new reservation'),
            variant: 'default',
            primary: true
          },
          {
            label: 'Ver Disponibilidad',
            icon: 'Calendar',
            action: () => console.log('Check availability'),
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

      case '/inventory-management':
        return [
          {
            label: 'Agregar Producto',
            icon: 'PackagePlus',
            action: () => console.log('Add new product'),
            variant: 'default',
            primary: true
          },
          {
            label: 'Ajuste Rápido',
            icon: 'Edit3',
            action: () => console.log('Quick adjustment'),
            variant: 'outline'
          },
          {
            label: 'Escanear Código',
            icon: 'ScanLine',
            action: () => console.log('Scan barcode'),
            variant: 'outline'
          },
          {
            label: 'Generar Informe',
            icon: 'FileText',
            action: () => console.log('Generate report'),
            variant: 'ghost'
          }
        ];

      case '/employee-management':
        return [
          {
            label: 'Nuevo Empleado',
            icon: 'UserPlus',
            action: () => console.log('Add new employee'),
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
            label: 'Horarios',
            icon: 'Calendar',
            action: () => console.log('Manage schedules'),
            variant: 'outline'
          },
          {
            label: 'Nómina',
            icon: 'DollarSign',
            action: () => console.log('Payroll'),
            variant: 'ghost'
          }
        ];

      case '/sales-reports':
        return [
          {
            label: 'Nuevo Informe',
            icon: 'BarChart3',
            action: () => console.log('Create new report'),
            variant: 'default',
            primary: true
          },
          {
            label: 'Exportar Datos',
            icon: 'Download',
            action: () => console.log('Export data'),
            variant: 'outline'
          },
          {
            label: 'Filtros Avanzados',
            icon: 'Filter',
            action: () => console.log('Advanced filters'),
            variant: 'outline'
          },
          {
            label: 'Programar Informe',
            icon: 'Clock',
            action: () => console.log('Schedule report'),
            variant: 'ghost'
          }
        ];

      default:
        return [];
    }
  };

  const actions = getContextualActions();

  if (actions?.length === 0) {
    return null;
  }

  const primaryAction = actions?.find(action => action?.primary);
  const secondaryActions = actions?.filter(action => !action?.primary);

  if (position === 'floating') {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        {/* Mobile Bottom Sheet Style */}
        <div className="lg:hidden">
          {isExpanded && (
            <div className="mb-4 space-y-2">
              {secondaryActions?.map((action, index) => (
                <Button
                  key={index}
                  variant={action?.variant || 'outline'}
                  size="default"
                  onClick={action?.action}
                  iconName={action?.icon}
                  className="w-full justify-start restaurant-shadow-md"
                >
                  {action?.label}
                </Button>
              ))}
            </div>
          )}
          
          {primaryAction && (
            <div className="flex items-center space-x-2">
              {secondaryActions?.length > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="restaurant-shadow-md"
                >
                  <Icon name={isExpanded ? "X" : "MoreHorizontal"} size={20} />
                </Button>
              )}
              
              <Button
                variant={primaryAction?.variant || 'default'}
                onClick={primaryAction?.action}
                iconName={primaryAction?.icon}
                className="restaurant-shadow-md"
              >
                {primaryAction?.label}
              </Button>
            </div>
          )}
        </div>
        {/* Desktop Floating Actions */}
        <div className="hidden lg:block">
          <div className="flex flex-col-reverse space-y-reverse space-y-2">
            {primaryAction && (
              <Button
                variant={primaryAction?.variant || 'default'}
                size="lg"
                onClick={primaryAction?.action}
                iconName={primaryAction?.icon}
                className="restaurant-shadow-lg"
              >
                {primaryAction?.label}
              </Button>
            )}
            
            {isExpanded && secondaryActions?.map((action, index) => (
              <Button
                key={index}
                variant={action?.variant || 'outline'}
                size="default"
                onClick={action?.action}
                iconName={action?.icon}
                className="restaurant-shadow-md"
              >
                {action?.label}
              </Button>
            ))}
            
            {secondaryActions?.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="restaurant-shadow-sm"
              >
                <Icon name={isExpanded ? "ChevronDown" : "ChevronUp"} size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Inline toolbar
  return (
    <div className="flex items-center space-x-2 p-4 bg-card border border-border rounded-md restaurant-shadow-sm">
      {primaryAction && (
        <Button
          variant={primaryAction?.variant || 'default'}
          onClick={primaryAction?.action}
          iconName={primaryAction?.icon}
        >
          {primaryAction?.label}
        </Button>
      )}
      {secondaryActions?.slice(0, 3)?.map((action, index) => (
        <Button
          key={index}
          variant={action?.variant || 'outline'}
          onClick={action?.action}
          iconName={action?.icon}
        >
          {action?.label}
        </Button>
      ))}
      {secondaryActions?.length > 3 && (
        <div className="relative group">
          <Button variant="ghost" size="icon">
            <Icon name="MoreHorizontal" size={20} />
          </Button>
          
          <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md restaurant-shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible restaurant-transition z-50">
            {secondaryActions?.slice(3)?.map((action, index) => (
              <button
                key={index}
                onClick={action?.action}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-left text-popover-foreground hover:bg-muted restaurant-transition"
              >
                <Icon name={action?.icon} size={16} />
                <span>{action?.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionToolbar;