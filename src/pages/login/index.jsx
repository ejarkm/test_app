import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import RoleIndicator from './components/RoleIndicator';
import SecurityFeatures from './components/SecurityFeatures';
import CredentialsHelper from './components/CredentialsHelper';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      // Navigate based on user role
      switch (userData?.role) {
        case 'admin': case'manager': navigate('/sales-reports');
          break;
        case 'cashier': navigate('/point-of-sale');
          break;
        case 'host': navigate('/table-reservations');
          break;
        case 'kitchen': navigate('/kitchen-orders');
          break;
        default:
          navigate('/point-of-sale');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="relative min-h-screen flex">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <LoginHeader />
            <div className="bg-card border border-border rounded-xl restaurant-shadow-lg p-8">
              <LoginForm />
              <CredentialsHelper />
            </div>
          </div>
        </div>

        {/* Right Side - Security Features & Role Info */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-muted/30">
          <div className="w-full max-w-md space-y-8">
            {/* Security Features */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Características de Seguridad
              </h3>
              <SecurityFeatures />
            </div>

            {/* Role Indicator */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Roles del Sistema
              </h3>
              <RoleIndicator />
            </div>

            {/* System Information */}
            <div className="text-center p-6 bg-card border border-border rounded-lg restaurant-shadow-sm">
              <h4 className="text-sm font-medium text-foreground mb-2">
                SpaikRestaurant v2.1.0
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                Sistema integral de gestión restaurantera
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <span>© {new Date()?.getFullYear()} SpaikRestaurant</span>
                <span>•</span>
                <span>Todos los derechos reservados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Security Info */}
      <div className="lg:hidden p-6 bg-muted/30">
        <div className="max-w-md mx-auto">
          <SecurityFeatures />
          <RoleIndicator />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;