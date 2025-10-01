import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SecurityFeatures = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Conexión Segura',
      description: 'Cifrado SSL/TLS'
    },
    {
      icon: 'Clock',
      title: 'Sesión Automática',
      description: 'Cierre por inactividad'
    },
    {
      icon: 'MapPin',
      title: 'Multi-ubicación',
      description: 'Soporte para cadenas'
    },
    {
      icon: 'Database',
      title: 'Respaldo Automático',
      description: 'Datos protegidos'
    }
  ];

  const formatTime = (date) => {
    return date?.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <div className="text-center p-4 bg-card border border-border rounded-lg restaurant-shadow-sm">
        <div className="text-2xl font-mono font-bold text-primary mb-1">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-muted-foreground capitalize">
          {formatDate(currentTime)}
        </div>
      </div>
      {/* Security Features */}
      <div className="grid grid-cols-2 gap-3">
        {securityFeatures?.map((feature, index) => (
          <div
            key={index}
            className="p-3 bg-card border border-border rounded-md restaurant-shadow-sm hover:restaurant-shadow-md restaurant-transition"
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                <Icon name={feature?.icon} size={14} className="text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground">
                {feature?.title}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {feature?.description}
            </p>
          </div>
        ))}
      </div>
      {/* System Status */}
      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        <span>Sistema operativo - Todos los servicios funcionando</span>
      </div>
    </div>
  );
};

export default SecurityFeatures;