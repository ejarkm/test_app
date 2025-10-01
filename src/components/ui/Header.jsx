import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import UserProfileDropDown from './UserProfileDropDown';
import NotificationIndicator from './NotificationIndicator';

const Header = ({ user = null, notifications = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Punto de Venta',
      path: '/point-of-sale',
      icon: 'ShoppingCart',
      roleAccess: ['admin', 'cashier', 'manager'],
      notificationCount: notifications?.filter(n => n?.type === 'pos')?.length
    },
    {
      label: 'Reservas',
      path: '/table-reservations',
      icon: 'Calendar',
      roleAccess: ['admin', 'host', 'manager'],
      notificationCount: notifications?.filter(n => n?.type === 'reservation')?.length
    },
    {
      label: 'Inventario',
      path: '/inventory-management',
      icon: 'Package',
      roleAccess: ['admin', 'manager', 'kitchen'],
      notificationCount: notifications?.filter(n => n?.type === 'inventory')?.length
    },
    {
      label: 'Personal',
      path: '/employee-management',
      icon: 'Users',
      roleAccess: ['admin', 'manager'],
      notificationCount: notifications?.filter(n => n?.type === 'employee')?.length
    },
    {
      label: 'Cocina',
      path: '/kitchen-orders',
      icon: 'ChefHat',
      roleAccess: ['admin', 'manager', 'kitchen'],
      notificationCount: notifications?.filter(n => n?.type === 'kitchen')?.length
    }
  ];

  const secondaryItems = [
    {
      label: 'Informes',
      path: '/sales-reports',
      icon: 'BarChart3',
      roleAccess: ['admin', 'manager']
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const hasAccess = (roleAccess) => {
    if (!user || !user?.role) return true;
    return roleAccess?.includes(user?.role);
  };

  const Logo = () => (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
        <Icon name="ChefHat" size={20} color="white" />
      </div>
      <span className="text-xl font-semibold text-foreground">SpaikRestaurant</span>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border restaurant-shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.filter(item => hasAccess(item?.roleAccess))?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`
                relative flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium
                restaurant-transition hover:bg-muted
                ${isActivePath(item?.path) 
                  ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.label}</span>
              {item?.notificationCount > 0 && (
                <NotificationIndicator count={item?.notificationCount} />
              )}
            </button>
          ))}

          {/* More Menu for Secondary Items */}
          {secondaryItems?.some(item => hasAccess(item?.roleAccess)) && (
            <div className="relative group">
              <button className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted restaurant-transition">
                <span>Más</span>
                <Icon name="ChevronDown" size={16} />
              </button>
              
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md restaurant-shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible restaurant-transition z-50">
                {secondaryItems?.filter(item => hasAccess(item?.roleAccess))?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`
                      w-full flex items-center space-x-2 px-4 py-2 text-sm text-left
                      restaurant-transition hover:bg-muted
                      ${isActivePath(item?.path) 
                        ? 'text-primary bg-primary/10' :'text-popover-foreground'
                      }
                    `}
                  >
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Global Notifications */}
          <NotificationIndicator 
            count={notifications?.length} 
            notifications={notifications}
            showDropdown={true}
          />

          {/* User Profile */}
          <UserProfileDropDown user={user} />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted restaurant-transition"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border restaurant-shadow-md">
          <nav className="px-4 py-2 space-y-1">
            {[...navigationItems, ...secondaryItems]?.filter(item => hasAccess(item?.roleAccess))?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium
                    restaurant-transition
                    ${isActivePath(item?.path) 
                      ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon name={item?.icon} size={18} />
                    <span>{item?.label}</span>
                  </div>
                  {item?.notificationCount > 0 && (
                    <NotificationIndicator count={item?.notificationCount} />
                  )}
                </button>
              ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;