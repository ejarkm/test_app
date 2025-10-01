import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationBreadcrumb = ({ customBreadcrumbs = null }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const routeLabels = {
    '/': 'Inicio',
    '/point-of-sale': 'Punto de Venta',
    '/table-reservations': 'Reservas de Mesa',
    '/inventory-management': 'Gestión de Inventario',
    '/employee-management': 'Gestión de Personal',
    '/sales-reports': 'Informes de Ventas',
    '/login': 'Iniciar Sesión'
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [
      {
        label: 'Inicio',
        path: '/',
        icon: 'Home'
      }
    ];

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments?.length - 1;
      
      breadcrumbs?.push({
        label: routeLabels?.[currentPath] || segment?.charAt(0)?.toUpperCase() + segment?.slice(1),
        path: currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on login page or if only home
  if (location?.pathname === '/login' || breadcrumbs?.length <= 1) {
    return null;
  }

  const handleBreadcrumbClick = (path, isActive) => {
    if (!isActive) {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      {breadcrumbs?.map((breadcrumb, index) => (
        <div key={breadcrumb?.path} className="flex items-center">
          {index > 0 && (
            <Icon 
              name="ChevronRight" 
              size={16} 
              className="mx-2 text-muted-foreground/60" 
            />
          )}
          
          <button
            onClick={() => handleBreadcrumbClick(breadcrumb?.path, breadcrumb?.isActive)}
            className={`
              flex items-center space-x-1 px-2 py-1 rounded-md restaurant-transition
              ${breadcrumb?.isActive 
                ? 'text-foreground font-medium cursor-default' 
                : 'hover:text-foreground hover:bg-muted cursor-pointer'
              }
            `}
            disabled={breadcrumb?.isActive}
          >
            {breadcrumb?.icon && (
              <Icon 
                name={breadcrumb?.icon} 
                size={14} 
                className={breadcrumb?.isActive ? 'text-primary' : 'text-muted-foreground'} 
              />
            )}
            <span className="truncate max-w-32 sm:max-w-none">
              {breadcrumb?.label}
            </span>
          </button>
        </div>
      ))}
    </nav>
  );
};

export default NavigationBreadcrumb;