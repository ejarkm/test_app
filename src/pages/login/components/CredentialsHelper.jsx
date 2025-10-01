import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CredentialsHelper = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const testCredentials = [
    {
      role: 'Administrador',
      email: 'admin@spaikrestaurant.com',
      password: 'admin123',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      role: 'Gerente',
      email: 'gerente@spaikrestaurant.com',
      password: 'gerente123',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      role: 'Cajero',
      email: 'cajero@spaikrestaurant.com',
      password: 'cajero123',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      role: 'Anfitrión',
      email: 'anfitrion@spaikrestaurant.com',
      password: 'anfitrion123',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      role: 'Cocina',
      email: 'cocina@spaikrestaurant.com',
      password: 'cocina123',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text)?.then(() => {
      // Could add a toast notification here
      console.log('Copiado al portapapeles:', text);
    });
  };

  return (
    <div className="mt-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
        iconPosition="right"
        className="w-full justify-between text-muted-foreground hover:text-foreground"
      >
        Credenciales de Prueba
      </Button>
      {isExpanded && (
        <div className="mt-4 space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Key" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Usuarios de Demostración
            </span>
          </div>

          {testCredentials?.map((cred, index) => (
            <div
              key={index}
              className={`p-3 rounded-md border ${cred?.bgColor} border-border/50`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${cred?.color}`}>
                  {cred?.role}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => copyToClipboard(cred?.email)}
                    className="p-1 hover:bg-background/50 rounded restaurant-transition"
                    title="Copiar email"
                  >
                    <Icon name="Mail" size={12} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(cred?.password)}
                    className="p-1 hover:bg-background/50 rounded restaurant-transition"
                    title="Copiar contraseña"
                  >
                    <Icon name="Key" size={12} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Email:</span> {cred?.email}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Contraseña:</span> {cred?.password}
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 p-2 bg-background/50 rounded border border-border/50">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={14} className="text-muted-foreground mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Nota importante:</p>
                <p>Estas son credenciales de demostración. En producción, use credenciales seguras proporcionadas por su administrador.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialsHelper;