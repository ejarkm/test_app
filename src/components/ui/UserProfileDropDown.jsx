import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const UserProfileDropdown = ({ user = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const defaultUser = {
    name: 'Usuario Invitado',
    role: 'guest',
    email: 'invitado@spaikrestaurant.com',
    avatar: null
  };

  const currentUser = user || defaultUser;

  const roleLabels = {
    admin: 'Administrador',
    manager: 'Gerente',
    cashier: 'Cajero',
    host: 'Anfitrión',
    kitchen: 'Cocina',
    waiter: 'Camarero',
    guest: 'Invitado'
  };

  const menuItems = [
    {
      label: 'Mi Perfil',
      icon: 'User',
      action: () => {
        // Navigate to profile page when implemented
        console.log('Navigate to profile');
        setIsOpen(false);
      }
    },
    {
      label: 'Configuración',
      icon: 'Settings',
      action: () => {
        // Navigate to settings page when implemented
        console.log('Navigate to settings');
        setIsOpen(false);
      }
    },
    {
      label: 'Ayuda',
      icon: 'HelpCircle',
      action: () => {
        // Navigate to help page when implemented
        console.log('Navigate to help');
        setIsOpen(false);
      }
    },
    {
      label: 'Cerrar Sesión',
      icon: 'LogOut',
      action: () => {
        // Handle logout
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        navigate('/login');
        setIsOpen(false);
      },
      destructive: true
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const getInitials = (name) => {
    return name?.split(' ')?.map(word => word?.charAt(0))?.join('')?.toUpperCase()?.slice(0, 2);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-error text-error-foreground',
      manager: 'bg-primary text-primary-foreground',
      cashier: 'bg-accent text-accent-foreground',
      host: 'bg-success text-success-foreground',
      kitchen: 'bg-warning text-warning-foreground',
      waiter: 'bg-secondary text-secondary-foreground',
      guest: 'bg-muted text-muted-foreground'
    };
    return colors?.[role] || colors?.guest;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted restaurant-transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
          {currentUser?.avatar ? (
            <img 
              src={currentUser?.avatar} 
              alt={currentUser?.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(currentUser?.name)
          )}
        </div>

        {/* User Info - Hidden on mobile */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-foreground">
            {currentUser?.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {roleLabels?.[currentUser?.role]}
          </div>
        </div>

        {/* Chevron */}
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-muted-foreground restaurant-transition ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-md restaurant-shadow-lg z-50 animate-fade-in">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser?.avatar} 
                    alt={currentUser?.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(currentUser?.name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-popover-foreground truncate">
                  {currentUser?.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {currentUser?.email}
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getRoleColor(currentUser?.role)}`}>
                  {roleLabels?.[currentUser?.role]}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems?.map((item, index) => (
              <button
                key={index}
                onClick={item?.action}
                className={`
                  w-full flex items-center space-x-3 px-4 py-2 text-sm text-left
                  restaurant-transition hover:bg-muted focus:outline-none focus:bg-muted
                  ${item?.destructive 
                    ? 'text-destructive hover:text-destructive' :'text-popover-foreground'
                  }
                `}
              >
                <Icon 
                  name={item?.icon} 
                  size={16} 
                  className={item?.destructive ? 'text-destructive' : 'text-muted-foreground'}
                />
                <span>{item?.label}</span>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border">
            <div className="text-xs text-muted-foreground">
              SpaikRestaurant v2.1.0
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;