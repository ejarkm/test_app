import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICards = ({ data, previousPeriodData }) => {
  const kpiData = [
    {
      title: 'Ventas Totales',
      value: '€12,450.80',
      previousValue: '€11,230.50',
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Transacciones',
      value: '156',
      previousValue: '142',
      icon: 'Receipt',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Recibo Promedio',
      value: '€79.81',
      previousValue: '€79.09',
      icon: 'TrendingUp',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Clientes Únicos',
      value: '134',
      previousValue: '128',
      icon: 'Users',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Margen de Beneficio',
      value: '32.5%',
      previousValue: '31.2%',
      icon: 'Percent',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Productos Vendidos',
      value: '423',
      previousValue: '398',
      icon: 'Package',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  const calculatePercentageChange = (current, previous) => {
    const currentNum = parseFloat(current?.replace(/[€,%]/g, ''));
    const previousNum = parseFloat(previous?.replace(/[€,%]/g, ''));
    
    if (previousNum === 0) return 0;
    
    const change = ((currentNum - previousNum) / previousNum) * 100;
    return change;
  };

  const formatPercentageChange = (change) => {
    const absChange = Math.abs(change);
    const sign = change >= 0 ? '+' : '-';
    return `${sign}${absChange?.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiData?.map((kpi, index) => {
        const percentageChange = calculatePercentageChange(kpi?.value, kpi?.previousValue);
        const isPositive = percentageChange >= 0;
        
        return (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 restaurant-shadow-sm hover:restaurant-shadow-md restaurant-transition"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${kpi?.bgColor} flex items-center justify-center`}>
                <Icon name={kpi?.icon} size={20} className={kpi?.color} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                isPositive ? 'text-success' : 'text-error'
              }`}>
                <Icon 
                  name={isPositive ? 'TrendingUp' : 'TrendingDown'} 
                  size={14} 
                />
                <span>{formatPercentageChange(percentageChange)}</span>
              </div>
            </div>
            {/* Content */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                {kpi?.title}
              </h3>
              <p className="text-2xl font-bold text-foreground">
                {kpi?.value}
              </p>
              <p className="text-xs text-muted-foreground">
                vs. período anterior: {kpi?.previousValue}
              </p>
            </div>
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-muted rounded-full h-1">
                <div 
                  className={`h-1 rounded-full ${
                    isPositive ? 'bg-success' : 'bg-error'
                  }`}
                  style={{ 
                    width: `${Math.min(Math.abs(percentageChange) * 2, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;