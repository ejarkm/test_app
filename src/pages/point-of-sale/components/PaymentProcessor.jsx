import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentProcessor = ({ 
  total, 
  onProcessPayment, 
  onPrintReceipt, 
  disabled = false 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    { value: 'cash', label: 'Efectivo', icon: 'Banknote' },
    { value: 'card', label: 'Tarjeta de Crédito/Débito', icon: 'CreditCard' },
    { value: 'digital', label: 'Pago Digital', icon: 'Smartphone' }
  ];

  const digitalPaymentOptions = [
    { value: 'bizum', label: 'Bizum' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'apple_pay', label: 'Apple Pay' },
    { value: 'google_pay', label: 'Google Pay' }
  ];

  const change = cashReceived ? Math.max(0, parseFloat(cashReceived) - total) : 0;
  const canProcessPayment = () => {
    if (disabled || total <= 0) return false;
    
    switch (paymentMethod) {
      case 'cash':
        return cashReceived && parseFloat(cashReceived) >= total;
      case 'card':
        return cardNumber?.length >= 4;
      case 'digital':
        return true;
      default:
        return false;
    }
  };

  const handleProcessPayment = async () => {
    if (!canProcessPayment()) return;

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        method: paymentMethod,
        amount: total,
        cashReceived: paymentMethod === 'cash' ? parseFloat(cashReceived) : null,
        change: paymentMethod === 'cash' ? change : 0,
        cardLast4: paymentMethod === 'card' ? cardNumber?.slice(-4) : null,
        timestamp: new Date()?.toISOString()
      };

      onProcessPayment(paymentData);
      
      // Reset form
      setCashReceived('');
      setCardNumber('');
      
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedMethod = paymentMethods?.find(method => method?.value === paymentMethod);

  return (
    <div className="bg-card border border-border rounded-lg p-4 restaurant-shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="CreditCard" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Procesar Pago</h3>
      </div>
      {/* Payment Method Selection */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Método de Pago
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {paymentMethods?.map((method) => (
              <button
                key={method?.value}
                onClick={() => setPaymentMethod(method?.value)}
                disabled={disabled}
                className={`
                  flex items-center space-x-2 p-3 rounded-md border restaurant-transition
                  ${paymentMethod === method?.value
                    ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50 text-foreground hover:bg-muted/50'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <Icon name={method?.icon} size={18} />
                <span className="text-sm font-medium">{method?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Specific Fields */}
        {paymentMethod === 'cash' && (
          <div className="space-y-3">
            <Input
              label="Efectivo Recibido"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={cashReceived}
              onChange={(e) => setCashReceived(e?.target?.value)}
              disabled={disabled}
              className="w-full"
            />
            {cashReceived && parseFloat(cashReceived) >= total && (
              <div className="p-3 bg-success/10 border border-success/20 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-success">Cambio:</span>
                  <span className="text-lg font-bold text-success">
                    €{change?.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="space-y-3">
            <Input
              label="Últimos 4 dígitos de la tarjeta"
              type="text"
              placeholder="1234"
              maxLength="4"
              value={cardNumber}
              onChange={(e) => setCardNumber(e?.target?.value?.replace(/\D/g, ''))}
              disabled={disabled}
              className="w-full"
            />
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-md">
              <p className="text-sm text-accent">
                <Icon name="Info" size={14} className="inline mr-1" />
                Inserte o deslice la tarjeta en el terminal POS
              </p>
            </div>
          </div>
        )}

        {paymentMethod === 'digital' && (
          <div className="space-y-3">
            <Select
              label="Plataforma de Pago"
              options={digitalPaymentOptions}
              value=""
              onChange={() => {}}
              placeholder="Seleccionar plataforma"
              disabled={disabled}
            />
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-md">
              <p className="text-sm text-accent">
                <Icon name="Smartphone" size={14} className="inline mr-1" />
                Muestre el código QR al cliente
              </p>
            </div>
          </div>
        )}

        {/* Total Display */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-foreground">Total a Pagar:</span>
            <span className="text-2xl font-bold text-primary">€{total?.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="default"
            size="lg"
            onClick={handleProcessPayment}
            disabled={!canProcessPayment() || isProcessing}
            loading={isProcessing}
            iconName="CreditCard"
            iconPosition="left"
            className="flex-1"
          >
            {isProcessing ? 'Procesando...' : 'Procesar Pago'}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={onPrintReceipt}
            disabled={disabled}
            iconName="Printer"
            iconPosition="left"
          >
            Imprimir
          </Button>
        </div>

        {/* Payment Status */}
        {isProcessing && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-md">
            <div className="flex items-center space-x-2">
              <div className="animate-spin">
                <Icon name="Loader2" size={16} className="text-warning" />
              </div>
              <span className="text-sm text-warning">
                Procesando pago con {selectedMethod?.label?.toLowerCase()}...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentProcessor;