import React from 'react';
import Icon from '../../../components/AppIcon';

const EmployeeStatsCards = () => {
  const statsData = [
    {
      title: "Total Empleados",
      value: "47",
      change: "+3",
      changeType: "positive",
      icon: "Users",
      description: "Activos este mes"
    },
    {
      title: "Revisiones Pendientes",
      value: "8",
      change: "2 caducadas",
      changeType: "warning",
      icon: "ClipboardCheck",
      description: "Próximas 30 días"
    },
    {
      title: "Capacitaciones Completadas",
      value: "92%",
      change: "+5%",
      changeType: "positive",
      icon: "GraduationCap",
      description: "Este trimestre"
    },
    {
      title: "Cobertura de Turnos",
      value: "98%",
      change: "Óptima",
      changeType: "positive",
      icon: "Calendar",
      description: "Esta semana"
    }
  ];

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getIconBgColor = (type) => {
    switch (type) {
      case 'positive':
        return 'bg-success/10 text-success';
      case 'negative':
        return 'bg-error/10 text-error';
      case 'warning':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData?.map((stat, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-6 restaurant-shadow-sm hover:restaurant-shadow-md restaurant-transition cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconBgColor(stat?.changeType)}`}>
              <Icon name={stat?.icon} size={24} />
            </div>
            <div className={`text-sm font-medium ${getChangeColor(stat?.changeType)}`}>
              {stat?.change}
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">{stat?.value}</h3>
            <p className="text-sm font-medium text-foreground">{stat?.title}</p>
            <p className="text-xs text-muted-foreground">{stat?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeStatsCards;