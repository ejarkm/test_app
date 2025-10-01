import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import ProductCatalog from './components/ProductCatalog';
import OrderSummary from './components/OrderSummary';
import PaymentProcessor from './components/PaymentProcessor';
import QuickActions from './components/QuickActions';

import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const PointOfSale = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [isPaymentMode, setIsPaymentMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userMode, setUserMode] = useState('waiter'); // 'waiter' or 'cashier'
  const [selectedTable, setSelectedTable] = useState(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderStatus, setOrderStatus] = useState('draft'); // draft, sent_to_kitchen, preparing, ready, served, paid

  // Mock user data - can be waiter or cashier
  const currentUser = {
    name: 'María García',
    role: 'cashier', // This will determine available modes
    email: 'maria.garcia@spaikrestaurant.com',
    avatar: null
  };

  // Mock table data
  const [tables] = useState([
    { id: 1, number: '1', capacity: 2, area: 'Terraza', status: 'available' },
    { id: 2, number: '2', capacity: 2, area: 'Terraza', status: 'occupied', orderStatus: 'preparing' },
    { id: 3, number: '3', capacity: 4, area: 'Terraza', status: 'available' },
    { id: 4, number: '4', capacity: 4, area: 'Terraza', status: 'reserved' },
    { id: 5, number: '5', capacity: 4, area: 'Salón Principal', status: 'occupied', orderStatus: 'ready' },
    { id: 6, number: '6', capacity: 6, area: 'Salón Principal', status: 'available' },
    { id: 7, number: '7', capacity: 6, area: 'Salón Principal', status: 'cleaning' },
    { id: 8, number: '8', capacity: 8, area: 'Salón Principal', status: 'available' },
    { id: 9, number: '9', capacity: 2, area: 'Área VIP', status: 'available' },
    { id: 10, number: '10', capacity: 2, area: 'Área VIP', status: 'occupied', orderStatus: 'served' },
  ]);

  // Mock notifications
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: 'pos',
        title: userMode === 'waiter' ? 'Turno Iniciado' : 'Caja Abierta',
        message: userMode === 'waiter' ? 'Comenzó el turno de camarero' : 'Turno iniciado a las 09:00',
        time: '2h',
        priority: 'low',
        read: true
      },
      {
        id: 2,
        type: 'pos',
        title: userMode === 'waiter' ? 'Mesa 5 Lista' : 'Pedido Listo',
        message: userMode === 'waiter' ? 'El pedido de la mesa 5 está listo para servir' : 'Mesa 5: Pedido completado',
        time: '5min',
        priority: 'high',
        read: false
      },
      {
        id: 3,
        type: 'inventory',
        title: 'Stock Bajo',
        message: 'Cerveza Estrella Galicia: 3 unidades',
        time: '30min',
        priority: 'medium',
        read: false
      }
    ]);
  }, [userMode]);

  const addToOrder = (product) => {
    const existingItem = orderItems?.find(item => item?.id === product?.id);
    
    if (existingItem) {
      setOrderItems(orderItems?.map(item =>
        item?.id === product?.id
          ? { ...item, quantity: item?.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        ...product,
        quantity: 1,
        note: ''
      }]);
    }

    // Generate order ID if this is the first item
    if (!currentOrderId && orderItems?.length === 0) {
      setCurrentOrderId(`ORD-${Date.now()}`);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setOrderItems(orderItems?.map(item =>
      item?.id === itemId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeItem = (itemId) => {
    setOrderItems(orderItems?.filter(item => item?.id !== itemId));
    
    // Clear order ID if no items left
    if (orderItems?.length <= 1) {
      setCurrentOrderId(null);
      setIsPaymentMode(false);
    }
  };

  const addNote = (itemId, note) => {
    setOrderItems(orderItems?.map(item =>
      item?.id === itemId
        ? { ...item, note }
        : item
    ));
  };

  const calculateTotal = () => {
    const subtotal = orderItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
    const tax = subtotal * 0.21; // 21% IVA
    return subtotal + tax;
  };

  const handleNewOrder = () => {
    setOrderItems([]);
    setTableNumber('');
    setCustomerName('');
    setCurrentOrderId(null);
    setIsPaymentMode(false);
  };

  const handleHoldOrder = () => {
    if (orderItems?.length === 0) return;
    
    // Save current order to localStorage for later recall
    const heldOrder = {
      id: currentOrderId,
      items: orderItems,
      tableNumber,
      customerName,
      timestamp: new Date()?.toISOString()
    };
    
    const heldOrders = JSON.parse(localStorage.getItem('heldOrders') || '[]');
    heldOrders?.push(heldOrder);
    localStorage.setItem('heldOrders', JSON.stringify(heldOrders));
    
    // Clear current order
    handleNewOrder();
    
    alert('Orden suspendida correctamente');
  };

  const handleRecallOrder = () => {
    const heldOrders = JSON.parse(localStorage.getItem('heldOrders') || '[]');
    
    if (heldOrders?.length === 0) {
      alert('No hay órdenes suspendidas');
      return;
    }
    
    // For demo, recall the most recent held order
    const lastOrder = heldOrders?.[heldOrders?.length - 1];
    
    setOrderItems(lastOrder?.items);
    setTableNumber(lastOrder?.tableNumber);
    setCustomerName(lastOrder?.customerName);
    setCurrentOrderId(lastOrder?.id);
    
    // Remove from held orders
    const updatedHeldOrders = heldOrders?.filter(order => order?.id !== lastOrder?.id);
    localStorage.setItem('heldOrders', JSON.stringify(updatedHeldOrders));
    
    alert('Orden recuperada correctamente');
  };

  const handleOpenCashDrawer = () => {
    // Simulate cash drawer opening
    alert('Caja registradora abierta');
  };

  const handleVoidTransaction = () => {
    if (orderItems?.length === 0) return;
    
    const confirmed = window.confirm('¿Está seguro de que desea anular esta transacción?');
    if (confirmed) {
      handleNewOrder();
      alert('Transacción anulada');
    }
  };

  // Waiter specific functions
  const handleTableSelect = (table) => {
    if (table.status === 'cleaning' || table.status === 'reserved') {
      alert(`Mesa ${table.number} no disponible (${table.status === 'cleaning' ? 'en limpieza' : 'reservada'})`);
      return;
    }
    
    setSelectedTable(table);
    setTableNumber(table.number);
    setOrderStatus('draft');
    
    // Generate new order ID for the table
    setCurrentOrderId(`${table.area.substring(0, 3).toUpperCase()}-${table.number}-${Date.now()}`);
  };

  const handleSendToKitchen = () => {
    if (orderItems?.length === 0) {
      alert('No hay productos en la comanda');
      return;
    }
    
    if (!selectedTable) {
      alert('Debe seleccionar una mesa');
      return;
    }

    // Create the order to send to kitchen
    const orderData = {
      id: currentOrderId,
      table: selectedTable,
      items: orderItems,
      notes: orderNotes,
      customerName,
      waiter: currentUser.name,
      status: 'sent_to_kitchen',
      timestamp: new Date()?.toISOString()
    };
    
    console.log('Order sent to kitchen:', orderData);
    
    // Save to localStorage (simulating backend)
    const kitchenOrders = JSON.parse(localStorage.getItem('kitchenOrders') || '[]');
    kitchenOrders?.push(orderData);
    localStorage.setItem('kitchenOrders', JSON.stringify(kitchenOrders));
    
    // Update order status
    setOrderStatus('sent_to_kitchen');
    
    alert(`Comanda enviada a cocina\nMesa: ${selectedTable.number}\nProductos: ${orderItems.length}`);
    
    // Don't clear the order yet - waiter might need to add more items
  };

  const handleMarkAsServed = () => {
    if (orderStatus !== 'ready') {
      alert('El pedido debe estar listo para poder marcarlo como servido');
      return;
    }
    
    setOrderStatus('served');
    alert(`Mesa ${selectedTable?.number} marcada como servida`);
  };

  const handleProcessPayment = (paymentData) => {
    // Simulate payment processing
    const orderData = {
      id: currentOrderId,
      items: orderItems,
      tableNumber,
      customerName,
      payment: paymentData,
      total: calculateTotal(),
      timestamp: new Date()?.toISOString()
    };
    
    console.log('Order processed:', orderData);
    
    // Save to localStorage for reporting
    const completedOrders = JSON.parse(localStorage.getItem('completedOrders') || '[]');
    completedOrders?.push(orderData);
    localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
    
    alert(`Pago procesado correctamente\nTotal: €${calculateTotal()?.toFixed(2)}\nMétodo: ${paymentData?.method}`);
    
    // Clear order after successful payment
    handleNewOrder();
  };

  const handlePrintReceipt = () => {
    // Simulate receipt printing
    const receiptData = {
      orderId: currentOrderId,
      items: orderItems,
      tableNumber,
      customerName,
      total: calculateTotal(),
      timestamp: new Date()?.toLocaleString('es-ES')
    };
    
    console.log('Printing receipt:', receiptData);
    alert('Recibo enviado a la impresora');
  };

  const proceedToPayment = () => {
    if (orderItems?.length === 0) return;
    if (!tableNumber) {
      alert('Por favor, ingrese el número de mesa');
      return;
    }
    setIsPaymentMode(true);
  };

  // Context actions based on user mode
  const contextActions = userMode === 'waiter' ? [
    {
      label: 'Nueva Comanda',
      icon: 'Plus',
      action: handleNewOrder,
      variant: 'default',
      primary: true
    },
    {
      label: 'Enviar a Cocina',
      icon: 'ChefHat',
      action: handleSendToKitchen,
      variant: 'outline',
      disabled: orderItems?.length === 0 || !selectedTable
    },
    {
      label: 'Marcar Servido',
      icon: 'CheckCircle',
      action: handleMarkAsServed,
      variant: 'outline',
      disabled: orderStatus !== 'ready'
    },
    {
      label: 'Modo Cajero',
      icon: 'CreditCard',
      action: () => setUserMode('cashier'),
      variant: 'ghost'
    }
  ] : [
    {
      label: 'Nueva Orden',
      icon: 'Plus',
      action: handleNewOrder,
      variant: 'default',
      primary: true
    },
    {
      label: 'Procesar Pago',
      icon: 'CreditCard',
      action: proceedToPayment,
      variant: 'outline'
    },
    {
      label: 'Suspender Orden',
      icon: 'Pause',
      action: handleHoldOrder,
      variant: 'outline'
    },
    {
      label: 'Modo Camarero',
      icon: 'Users',
      action: () => setUserMode('waiter'),
      variant: 'ghost'
    }
  ];

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
                <h1 className="text-2xl font-bold text-foreground">
                  {userMode === 'waiter' ? 'Sistema de Comandas' : 'Punto de Venta'}
                </h1>
                <div className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${userMode === 'waiter' 
                    ? 'bg-success/10 text-success border border-success/20' 
                    : 'bg-primary/10 text-primary border border-primary/20'
                  }
                `}>
                  {userMode === 'waiter' ? '👨‍🍳 Camarero' : '💰 Cajero'}
                </div>
              </div>
              <p className="text-muted-foreground">
                {userMode === 'waiter' 
                  ? 'Toma comandas y gestiona pedidos por mesa'
                  : 'Procesa transacciones y gestiona pedidos de clientes'
                }
              </p>
            </div>
            
            {/* Order/Table Status */}
            <div className="text-right">
              {selectedTable && userMode === 'waiter' && (
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground">Mesa Seleccionada</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-foreground">
                      Mesa {selectedTable.number} - {selectedTable.area}
                    </p>
                    <div className={`
                      w-2 h-2 rounded-full
                      ${orderStatus === 'draft' ? 'bg-yellow-500' :
                        orderStatus === 'sent_to_kitchen' ? 'bg-orange-500' :
                        orderStatus === 'preparing' ? 'bg-blue-500' :
                        orderStatus === 'ready' ? 'bg-green-500' :
                        orderStatus === 'served' ? 'bg-purple-500' : 'bg-gray-500'
                      } animate-pulse
                    `}></div>
                  </div>
                </div>
              )}
              
              {currentOrderId && (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {userMode === 'waiter' ? 'Comanda Actual' : 'Orden Actual'}
                    </p>
                    <p className="font-semibold text-foreground">{currentOrderId}</p>
                    {userMode === 'waiter' && (
                      <p className="text-xs text-muted-foreground capitalize">
                        Estado: {orderStatus.replace('_', ' ')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions
            onNewOrder={handleNewOrder}
            onHoldOrder={handleHoldOrder}
            onRecallOrder={handleRecallOrder}
            onOpenCashDrawer={handleOpenCashDrawer}
            onVoidTransaction={handleVoidTransaction}
            hasActiveOrder={orderItems?.length > 0}
          />

          {/* Table Selection for Waiter Mode */}
          {userMode === 'waiter' && (
            <div className="mt-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Seleccionar Mesa
                  </h2>
                  {selectedTable && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTable(null);
                        setTableNumber('');
                        handleNewOrder();
                      }}
                      iconName="X"
                    >
                      Cambiar Mesa
                    </Button>
                  )}
                </div>
                
                {/* Tables Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {tables?.map((table) => (
                    <button
                      key={table.id}
                      onClick={() => handleTableSelect(table)}
                      disabled={table.status === 'cleaning'}
                      className={`
                        relative p-4 rounded-lg border-2 text-center restaurant-transition
                        ${selectedTable?.id === table.id
                          ? 'border-primary bg-primary/10 text-primary' 
                          : table.status === 'available'
                            ? 'border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-foreground'
                            : table.status === 'occupied'
                              ? 'border-warning bg-warning/10 text-warning cursor-not-allowed'
                              : table.status === 'reserved'
                                ? 'border-accent bg-accent/10 text-accent cursor-not-allowed'
                                : 'border-muted bg-muted text-muted-foreground cursor-not-allowed'
                        }
                        ${table.status === 'cleaning' ? 'opacity-50' : ''}
                      `}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-center">
                          <Icon 
                            name={
                              table.status === 'available' ? 'Circle' :
                              table.status === 'occupied' ? 'Users' :
                              table.status === 'reserved' ? 'Clock' :
                              'AlertCircle'
                            } 
                            size={20} 
                          />
                        </div>
                        
                        <div>
                          <div className="font-semibold">Mesa {table.number}</div>
                          <div className="text-xs opacity-75">
                            {table.capacity} personas
                          </div>
                          <div className="text-xs opacity-60">
                            {table.area}
                          </div>
                        </div>
                        
                        {table.orderStatus && (
                          <div className="text-xs font-medium">
                            {table.orderStatus === 'preparing' ? '👨‍🍳 Cocinando' :
                             table.orderStatus === 'ready' ? '✅ Listo' :
                             table.orderStatus === 'served' ? '🍽️ Servido' : ''}
                          </div>
                        )}

                        {/* Status indicator */}
                        <div className={`
                          absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-card
                          ${table.status === 'available' ? 'bg-success' :
                            table.status === 'occupied' ? 'bg-warning' :
                            table.status === 'reserved' ? 'bg-accent' :
                            'bg-muted-foreground'
                          }
                        `}></div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Disponible</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span>Ocupada</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Reservada</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                    <span>Limpieza</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Product Catalog - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <ProductCatalog onAddToOrder={addToOrder} />
            </div>

            {/* Order Summary and Actions - Takes 1 column */}
            <div className="space-y-6">
              <OrderSummary
                orderItems={orderItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onAddNote={addNote}
                tableNumber={tableNumber}
                onTableChange={setTableNumber}
                customerName={customerName}
                onCustomerChange={setCustomerName}
              />

              {/* Waiter Mode - Order Notes and Kitchen Actions */}
              {userMode === 'waiter' && orderItems?.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="space-y-4">
                    {/* Order Notes for Kitchen */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Notas para Cocina
                      </label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Ej: Sin cebolla, punto de carne, alérgico a frutos secos..."
                        className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                        rows={3}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {orderStatus === 'draft' && (
                        <Button
                          variant="default"
                          size="lg"
                          onClick={handleSendToKitchen}
                          iconName="ChefHat"
                          iconPosition="left"
                          className="w-full"
                          disabled={!selectedTable}
                        >
                          Enviar Comanda a Cocina
                        </Button>
                      )}

                      {orderStatus === 'sent_to_kitchen' && (
                        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center space-x-2 text-warning">
                            <Icon name="Clock" size={16} />
                            <span className="text-sm font-medium">Comanda enviada a cocina</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Esperando que cocina prepare el pedido...
                          </p>
                        </div>
                      )}

                      {orderStatus === 'preparing' && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center space-x-2 text-blue-600">
                            <Icon name="ChefHat" size={16} />
                            <span className="text-sm font-medium">Cocina preparando...</span>
                          </div>
                        </div>
                      )}

                      {orderStatus === 'ready' && (
                        <div className="space-y-2">
                          <div className="bg-success/10 border border-success/20 rounded-lg p-3 text-center">
                            <div className="flex items-center justify-center space-x-2 text-success">
                              <Icon name="CheckCircle" size={16} />
                              <span className="text-sm font-medium">¡Pedido listo para servir!</span>
                            </div>
                          </div>
                          <Button
                            variant="success"
                            size="lg"
                            onClick={handleMarkAsServed}
                            iconName="CheckCircle"
                            iconPosition="left"
                            className="w-full"
                          >
                            Marcar como Servido
                          </Button>
                        </div>
                      )}

                      {orderStatus === 'served' && (
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center space-x-2 text-purple-600">
                            <Icon name="Check" size={16} />
                            <span className="text-sm font-medium">Pedido servido ✨</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserMode('cashier')}
                            iconName="CreditCard"
                            className="mt-2"
                          >
                            Proceder al Cobro
                          </Button>
                        </div>
                      )}

                      {!selectedTable && (
                        <p className="text-sm text-destructive text-center">
                          Seleccione una mesa para continuar
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Cashier Mode - Payment Section */}
              {userMode === 'cashier' && orderItems?.length > 0 && (
                <>
                  {!isPaymentMode ? (
                    <div className="bg-card border border-border rounded-lg p-4">
                      <Button
                        variant="default"
                        size="lg"
                        onClick={proceedToPayment}
                        iconName="ArrowRight"
                        iconPosition="right"
                        className="w-full"
                        disabled={!tableNumber}
                      >
                        Proceder al Pago (€{calculateTotal()?.toFixed(2)})
                      </Button>
                      {!tableNumber && (
                        <p className="text-sm text-destructive mt-2 text-center">
                          Ingrese el número de mesa para continuar
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Procesar Pago</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsPaymentMode(false)}
                          iconName="ArrowLeft"
                          iconPosition="left"
                        >
                          Volver
                        </Button>
                      </div>
                      
                      <PaymentProcessor
                        total={calculateTotal()}
                        onProcessPayment={handleProcessPayment}
                        onPrintReceipt={handlePrintReceipt}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <QuickActionToolbar 
        contextActions={contextActions}
        user={currentUser}
      />
    </div>
  );
};

export default PointOfSale;