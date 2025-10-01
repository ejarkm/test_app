import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const NotificationIndicator = ({ 
  count = 0, 
  notifications = [], 
  showDropdown = false,
  size = 'default' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    default: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm'
  };

  const mockNotifications = notifications?.length > 0 ? notifications : [
    {
      id: 1,
      type: 'inventory',
      title: 'Stock Bajo',
      message: 'Tomates: Solo quedan 5 unidades',
      time: '5 min',
      priority: 'high',
      read: false
    },
    {
      id: 2,
      type: 'reservation',
      title: 'Nueva Reserva',
      message: 'Mesa para 4 personas a las 20:00',
      time: '10 min',
      priority: 'medium',
      read: false
    },
    {
      id: 3,
      type: 'pos',
      title: 'Orden Completada',
      message: 'Mesa 12 - Orden #1234',
      time: '15 min',
      priority: 'low',
      read: true
    }
  ];

  const displayCount = count || mockNotifications?.filter(n => !n?.read)?.length;

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

  const getNotificationIcon = (type) => {
    const icons = {
      inventory: 'Package',
      reservation: 'Calendar',
      pos: 'ShoppingCart',
      employee: 'Users',
      system: 'Settings'
    };
    return icons?.[type] || 'Bell';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-error',
      medium: 'text-warning',
      low: 'text-muted-foreground'
    };
    return colors?.[priority] || colors?.low;
  };

  const handleNotificationClick = (notification) => {
    // Mark as read and handle navigation based on type
    console.log('Navigate to:', notification?.type, notification?.id);
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    // Handle mark all as read
    console.log('Mark all notifications as read');
    setIsOpen(false);
  };

  if (!showDropdown) {
    // Simple badge indicator
    return displayCount > 0 ? (
      <div className={`
        absolute -top-1 -right-1 bg-error text-error-foreground rounded-full
        flex items-center justify-center font-medium
        ${sizeClasses?.[size]}
      `}>
        {displayCount > 99 ? '99+' : displayCount}
      </div>
    ) : null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-md hover:bg-muted restaurant-transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon name="Bell" size={20} className="text-muted-foreground" />
        
        {/* Badge */}
        {displayCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground rounded-full flex items-center justify-center text-xs font-medium">
            {displayCount > 99 ? '99+' : displayCount}
          </div>
        )}
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-md restaurant-shadow-lg z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-popover-foreground">
              Notificaciones
            </h3>
            {mockNotifications?.some(n => !n?.read) && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:text-primary/80 restaurant-transition"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {mockNotifications?.length > 0 ? (
              mockNotifications?.map((notification) => (
                <button
                  key={notification?.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    w-full flex items-start space-x-3 px-4 py-3 text-left
                    restaurant-transition hover:bg-muted focus:outline-none focus:bg-muted
                    ${!notification?.read ? 'bg-primary/5' : ''}
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center mt-0.5
                    ${notification?.priority === 'high' ? 'bg-error/10' : 
                      notification?.priority === 'medium' ? 'bg-warning/10' : 'bg-muted'}
                  `}>
                    <Icon 
                      name={getNotificationIcon(notification?.type)} 
                      size={16} 
                      className={getPriorityColor(notification?.priority)}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-popover-foreground truncate">
                        {notification?.title}
                      </p>
                      <span className="text-xs text-muted-foreground ml-2">
                        {notification?.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {notification?.message}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!notification?.read && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <Icon name="Bell" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No hay notificaciones
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {mockNotifications?.length > 0 && (
            <div className="px-4 py-3 border-t border-border">
              <button className="w-full text-sm text-primary hover:text-primary/80 restaurant-transition">
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIndicator;