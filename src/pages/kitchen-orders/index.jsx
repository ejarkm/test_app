import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const KitchenOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, preparing, ready
  const [notifications, setNotifications] = useState([]);

  // Mock user data for kitchen staff
  const currentUser = {
    name: 'Pedro Martínez',
    role: 'kitchen',
    email: 'pedro.martinez@spaikrestaurant.com',
    avatar: null
  };

  // Load orders from localStorage (sent by waiters)
  useEffect(() => {
    const loadOrders = () => {
      const kitchenOrders = JSON.parse(localStorage.getItem('kitchenOrders') || '[]');
      // Add estimated time and sort by creation time
      const ordersWithTime = kitchenOrders.map(order => ({
        ...order,
        estimatedTime: calculateEstimatedTime(order.items),
        startedAt: order.startedAt || null,
        timeElapsed: order.startedAt ? Math.floor((Date.now() - new Date(order.startedAt).getTime()) / 1000 / 60) : 0
      }));
      
      // Sort: preparing first, then by creation time
      ordersWithTime.sort((a, b) => {
        if (a.status === 'preparing' && b.status !== 'preparing') return -1;
        if (b.status === 'preparing' && a.status !== 'preparing') return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      
      setOrders(ordersWithTime);
    };

    // Load initially
    loadOrders();

    // Poll for new orders every 5 seconds
    const interval = setInterval(loadOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  // Calculate estimated preparation time based on items
  const calculateEstimatedTime = (items) => {
    let totalTime = 0;
    items?.forEach(item => {
      // Mock time calculation based on item type
      if (item.category === 'Platos Principales') totalTime += 15;
      else if (item.category === 'Entrantes') totalTime += 8;
      else if (item.category === 'Postres') totalTime += 5;
      else if (item.category === 'Bebidas') totalTime += 2;
      else totalTime += 10; // default
    });
    return Math.max(5, totalTime); // minimum 5 minutes
  };

  // Update notifications
  useEffect(() => {
    const newOrders = orders.filter(order => 
      order.status === 'sent_to_kitchen' && 
      (Date.now() - new Date(order.timestamp).getTime()) < 60000 // last minute
    );

    setNotifications([
      ...newOrders.map(order => ({
        id: `order-${order.id}`,
        type: 'kitchen',
        title: 'Nueva Comanda',
        message: `Mesa ${order.table?.number} - ${order.items?.length} productos`,
        time: 'Ahora',
        priority: 'high',
        read: false
      })),
      {
        id: 2,
        type: 'kitchen',
        title: 'Recordatorio',
        message: 'Revisar temperaturas de refrigeración',
        time: '1h',
        priority: 'medium',
        read: true
      }
    ]);
  }, [orders]);

  // Handle order status changes
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updated = { 
          ...order, 
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
        
        if (newStatus === 'preparing' && !order.startedAt) {
          updated.startedAt = new Date().toISOString();
        }
        
        return updated;
      }
      return order;
    });

    setOrders(updatedOrders);

    // Update localStorage
    localStorage.setItem('kitchenOrders', JSON.stringify(updatedOrders));

    // Show notification
    const order = orders.find(o => o.id === orderId);
    const statusMessages = {
      'preparing': `Iniciada preparación de Mesa ${order?.table?.number}`,
      'ready': `¡Mesa ${order?.table?.number} lista para servir!`,
      'served': `Mesa ${order?.table?.number} ha sido servida`
    };
    
    if (statusMessages[newStatus]) {
      alert(statusMessages[newStatus]);
    }
  };

  // Filter orders based on current filter
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return order.status !== 'served';
    return order.status === filter;
  });

  // Quick actions for kitchen
  const quickActions = [
    {
      label: 'Actualizar',
      icon: 'RefreshCw',
      action: () => window.location.reload(),
      variant: 'default',
      primary: true
    },
    {
      label: 'Marcar Todo Listo',
      icon: 'CheckCircle',
      action: () => {
        const preparingOrders = orders.filter(o => o.status === 'preparing');
        preparingOrders.forEach(order => updateOrderStatus(order.id, 'ready'));
      },
      variant: 'outline',
      disabled: !orders.some(o => o.status === 'preparing')
    },
    {
      label: 'Ver Historial',
      icon: 'Clock',
      action: () => console.log('View history'),
      variant: 'ghost'
    }
  ];

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'sent_to_kitchen': return 'text-yellow-600 bg-yellow-50';
      case 'preparing': return 'text-blue-600 bg-blue-50';
      case 'ready': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get priority based on waiting time
  const getPriority = (order) => {
    const waitTime = Math.floor((Date.now() - new Date(order.timestamp).getTime()) / 1000 / 60);
    if (waitTime > 30) return 'urgent';
    if (waitTime > 15) return 'high';
    return 'normal';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={currentUser} notifications={notifications} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <NavigationBreadcrumb />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">Comandas de Cocina</h1>
                <div className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                  👨‍🍳 Cocina
                </div>
              </div>
              <p className="text-muted-foreground">
                Gestiona y prepara las comandas enviadas por los camareros
              </p>
            </div>
            
            {/* Stats */}
            <div className="text-right">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {orders.filter(o => o.status === 'sent_to_kitchen').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Pendientes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {orders.filter(o => o.status === 'preparing').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Preparando</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {orders.filter(o => o.status === 'ready').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Listas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2 mb-6">
            {[
              { key: 'all', label: 'Todas', count: filteredOrders.length },
              { key: 'sent_to_kitchen', label: 'Pendientes', count: orders.filter(o => o.status === 'sent_to_kitchen').length },
              { key: 'preparing', label: 'Preparando', count: orders.filter(o => o.status === 'preparing').length },
              { key: 'ready', label: 'Listas', count: orders.filter(o => o.status === 'ready').length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium restaurant-transition flex items-center space-x-2
                  ${filter === key 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card text-foreground border border-border hover:bg-muted'
                  }
                `}
              >
                <span>{label}</span>
                {count > 0 && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${filter === key 
                      ? 'bg-primary-foreground/20 text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Orders Grid */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="ChefHat" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {filter === 'all' ? 'No hay comandas' : `No hay comandas ${
                  filter === 'sent_to_kitchen' ? 'pendientes' :
                  filter === 'preparing' ? 'en preparación' :
                  filter === 'ready' ? 'listas' : ''
                }`}
              </h3>
              <p className="text-muted-foreground">
                Las nuevas comandas aparecerán aquí automáticamente
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOrders.map((order) => {
                const priority = getPriority(order);
                const waitTime = Math.floor((Date.now() - new Date(order.timestamp).getTime()) / 1000 / 60);
                
                return (
                  <div 
                    key={order.id}
                    className={`
                      bg-card border rounded-lg p-6 restaurant-shadow-sm relative
                      ${priority === 'urgent' ? 'border-red-500 ring-2 ring-red-200' :
                        priority === 'high' ? 'border-orange-400' : 'border-border'
                      }
                    `}
                  >
                    {/* Priority indicator */}
                    {priority === 'urgent' && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        ¡URGENTE!
                      </div>
                    )}
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">
                          Mesa {order.table?.number}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {order.table?.area} • {order.waiter}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className={`
                          px-3 py-1 rounded-full text-xs font-medium
                          ${getStatusColor(order.status)}
                        `}>
                          {order.status === 'sent_to_kitchen' ? '⏳ Pendiente' :
                           order.status === 'preparing' ? '👨‍🍳 Preparando' :
                           order.status === 'ready' ? '✅ Listo' : order.status}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Hace {waitTime}min
                        </p>
                      </div>
                    </div>

                    {/* Timer for orders in preparation */}
                    {order.status === 'preparing' && order.startedAt && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-800">
                            Tiempo de preparación
                          </span>
                          <span className="text-lg font-bold text-blue-600">
                            {order.timeElapsed}min / ~{order.estimatedTime}min
                          </span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ 
                              width: `${Math.min(100, (order.timeElapsed / order.estimatedTime) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-3 mb-4">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <div>
                            <span className="font-medium text-foreground">{item.name}</span>
                            {item.note && (
                              <p className="text-xs text-muted-foreground italic">
                                Nota: {item.note}
                              </p>
                            )}
                          </div>
                          <span className="font-bold text-primary">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Kitchen Notes */}
                    {order.notes && (
                      <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-start space-x-2">
                          <Icon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800 mb-1">
                              Notas Especiales:
                            </p>
                            <p className="text-sm text-yellow-700">{order.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {order.status === 'sent_to_kitchen' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          iconName="Play"
                          iconPosition="left"
                          className="w-full"
                        >
                          Comenzar Preparación
                        </Button>
                      )}

                      {order.status === 'preparing' && (
                        <div className="space-y-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            iconName="CheckCircle"
                            iconPosition="left"
                            className="w-full"
                          >
                            Marcar como Listo
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'sent_to_kitchen')}
                            iconName="RotateCcw"
                            iconPosition="left"
                            className="w-full"
                          >
                            Volver a Pendiente
                          </Button>
                        </div>
                      )}

                      {order.status === 'ready' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                          <Icon name="CheckCircle" size={24} className="text-green-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-green-800">
                            ¡Listo para servir!
                          </p>
                          <p className="text-xs text-green-600">
                            Esperando que el camarero recoja el pedido
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Order ID */}
                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Orden: {order.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.timestamp).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <QuickActionToolbar 
        contextActions={quickActions}
        user={currentUser}
      />
    </div>
  );
};

export default KitchenOrders;
