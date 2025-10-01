import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const OrderSummary = ({ 
  orderItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onAddNote, 
  tableNumber,
  onTableChange,
  customerName,
  onCustomerChange 
}) => {
  const subtotal = orderItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
  const taxRate = 0.21; // 21% IVA
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Resumen del Pedido</h2>
        
        {/* Customer Info */}
        <div className="space-y-3">
          <Input
            label="Mesa"
            type="number"
            placeholder="Número de mesa"
            value={tableNumber}
            onChange={(e) => onTableChange(e?.target?.value)}
            className="w-full"
          />
          <Input
            label="Cliente (Opcional)"
            type="text"
            placeholder="Nombre del cliente"
            value={customerName}
            onChange={(e) => onCustomerChange(e?.target?.value)}
            className="w-full"
          />
        </div>
      </div>
      {/* Order Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {orderItems?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="ShoppingCart" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Pedido Vacío
            </h3>
            <p className="text-muted-foreground">
              Agrega productos del catálogo para comenzar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orderItems?.map((item) => (
              <div key={item?.id} className="bg-muted/30 rounded-lg p-3 border border-border">
                {/* Item Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      €{item?.price?.toFixed(2)} c/u
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(item?.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUpdateQuantity(item?.id, Math.max(1, item?.quantity - 1))}
                      disabled={item?.quantity <= 1}
                    >
                      <Icon name="Minus" size={16} />
                    </Button>
                    <span className="w-8 text-center font-medium text-foreground">
                      {item?.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUpdateQuantity(item?.id, item?.quantity + 1)}
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      €{(item?.price * item?.quantity)?.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {item?.note && (
                  <div className="mt-2 p-2 bg-warning/10 rounded border-l-2 border-warning">
                    <p className="text-sm text-foreground">
                      <Icon name="MessageSquare" size={14} className="inline mr-1" />
                      {item?.note}
                    </p>
                  </div>
                )}

                {/* Add Note Button */}
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MessageSquare"
                    iconPosition="left"
                    onClick={() => {
                      const note = prompt('Agregar nota especial:', item?.note || '');
                      if (note !== null) {
                        onAddNote(item?.id, note);
                      }
                    }}
                    className="text-xs"
                  >
                    {item?.note ? 'Editar Nota' : 'Agregar Nota'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Order Total */}
      {orderItems?.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="text-foreground">€{subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IVA (21%):</span>
              <span className="text-foreground">€{tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
              <span className="text-foreground">Total:</span>
              <span className="text-primary">€{total?.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              {orderItems?.length} {orderItems?.length === 1 ? 'artículo' : 'artículos'} en el pedido
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;