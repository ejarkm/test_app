import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo y título principal */}
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center restaurant-shadow-md">
          <Icon name="ChefHat" size={28} color="white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-foreground">SpaikRestaurant</h1>
          <p className="text-sm text-muted-foreground">Sistema de Gestión</p>
        </div>
      </div>

      {/* Mensaje de bienvenida */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Bienvenido de vuelta</h2>
        <p className="text-muted-foreground">
          Inicie sesión para acceder al sistema de gestión de su restaurante
        </p>
      </div>

      {/* Indicador de estado del sistema */}
      <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1 bg-success/10 text-success rounded-full text-sm">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        <span>Sistema en línea</span>
      </div>
    </div>
  );
};

export default LoginHeader;