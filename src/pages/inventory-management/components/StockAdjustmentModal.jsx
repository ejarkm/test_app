import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StockAdjustmentModal = ({ isOpen, onClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    adjustmentType: 'add',
    quantity: '',
    reason: '',
    notes: '',
    cost: ''
  });

  const adjustmentReasons = [
    { value: 'received', label: 'Mercancía Recibida' },
    { value: 'damaged', label: 'Producto Dañado' },
    { value: 'expired', label: 'Producto Caducado' },
    { value: 'theft', label: 'Robo/Pérdida' },
    { value: 'correction', label: 'Corrección de Inventario' },
    { value: 'waste', label: 'Desperdicio' },
    { value: 'transfer', label: 'Transferencia' },
    { value: 'other', label: 'Otro' }
  ];

  const adjustmentTypes = [
    { value: 'add', label: 'Agregar Stock' },
    { value: 'remove', label: 'Reducir Stock' },
    { value: 'set', label: 'Establecer Cantidad' }
  ];

  useEffect(() => {
    if (item) {
      setFormData({
        adjustmentType: 'add',
        quantity: '',
        reason: '',
        notes: '',
        cost: item?.unitCost?.toString()
      });
    }
  }, [item]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateNewQuantity = () => {
    if (!formData?.quantity || !item) return item?.quantity || 0;
    
    const adjustment = parseFloat(formData?.quantity);
    const current = item?.quantity;
    
    switch (formData?.adjustmentType) {
      case 'add':
        return current + adjustment;
      case 'remove':
        return Math.max(0, current - adjustment);
      case 'set':
        return adjustment;
      default:
        return current;
    }
  };

  const calculateCostImpact = () => {
    if (!formData?.quantity || !formData?.cost) return 0;
    
    const adjustment = parseFloat(formData?.quantity);
    const cost = parseFloat(formData?.cost);
    
    switch (formData?.adjustmentType) {
      case 'add':
        return adjustment * cost;
      case 'remove':
        return -(adjustment * cost);
      case 'set':
        const current = item?.quantity || 0;
        const currentValue = current * (item?.unitCost || 0);
        const newValue = adjustment * cost;
        return newValue - currentValue;
      default:
        return 0;
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const adjustmentData = {
      itemId: item?.id,
      type: formData?.adjustmentType,
      quantity: parseFloat(formData?.quantity),
      reason: formData?.reason,
      notes: formData?.notes,
      cost: parseFloat(formData?.cost),
      newQuantity: calculateNewQuantity(),
      costImpact: calculateCostImpact(),
      timestamp: new Date()?.toISOString(),
      user: 'Usuario Actual' // This would come from auth context
    };

    onSave(adjustmentData);
    onClose();
  };

  const isFormValid = () => {
    return formData?.quantity && 
           formData?.reason && 
           formData?.cost && 
           parseFloat(formData?.quantity) > 0;
  };

  if (!isOpen || !item) return null;

  const newQuantity = calculateNewQuantity();
  const costImpact = calculateCostImpact();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg restaurant-shadow-modal w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Edit3" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Ajuste de Stock
              </h2>
              <p className="text-sm text-muted-foreground">
                {item?.name} - Stock actual: {item?.quantity} {item?.unit}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Adjustment Type */}
          <Select
            label="Tipo de Ajuste"
            required
            options={adjustmentTypes}
            value={formData?.adjustmentType}
            onChange={(value) => handleInputChange('adjustmentType', value)}
          />

          {/* Quantity */}
          <Input
            label="Cantidad"
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="Ingrese la cantidad"
            value={formData?.quantity}
            onChange={(e) => handleInputChange('quantity', e?.target?.value)}
            description={`Unidad: ${item?.unit}`}
          />

          {/* Cost per Unit */}
          <Input
            label="Costo por Unidad"
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            value={formData?.cost}
            onChange={(e) => handleInputChange('cost', e?.target?.value)}
            description="Costo unitario para este ajuste"
          />

          {/* Reason */}
          <Select
            label="Motivo del Ajuste"
            required
            options={adjustmentReasons}
            value={formData?.reason}
            onChange={(value) => handleInputChange('reason', value)}
            searchable
          />

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notas Adicionales
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={3}
              placeholder="Información adicional sobre el ajuste..."
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
            />
          </div>

          {/* Impact Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-foreground flex items-center">
              <Icon name="Calculator" size={16} className="mr-2 text-primary" />
              Resumen del Ajuste
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Stock Actual:</span>
                <div className="font-medium text-foreground">
                  {item?.quantity} {item?.unit}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Nuevo Stock:</span>
                <div className={`font-medium ${newQuantity <= item?.minStock ? 'text-warning' : 'text-foreground'}`}>
                  {newQuantity} {item?.unit}
                  {newQuantity <= item?.minStock && (
                    <Icon name="AlertTriangle" size={14} className="inline ml-1 text-warning" />
                  )}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Impacto en Costo:</span>
                <div className={`font-medium ${costImpact >= 0 ? 'text-success' : 'text-error'}`}>
                  {costImpact >= 0 ? '+' : ''}
                  {new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR'
                  })?.format(costImpact)}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha y Hora:</span>
                <div className="font-medium text-foreground">
                  {new Date()?.toLocaleString('es-ES')}
                </div>
              </div>
            </div>

            {newQuantity <= item?.minStock && (
              <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-md">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm text-warning font-medium">
                  El nuevo stock estará por debajo del mínimo requerido
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid()}
              iconName="Save"
              iconPosition="left"
            >
              Guardar Ajuste
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;