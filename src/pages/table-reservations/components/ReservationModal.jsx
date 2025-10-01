import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ReservationModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  reservation = null,
  availableTables = [],
  selectedDate 
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    partySize: 2,
    time: '',
    tableNumber: '',
    specialRequests: '',
    status: 'pending'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (reservation) {
      setFormData({
        customerName: reservation?.customerName || '',
        phone: reservation?.phone || '',
        email: reservation?.email || '',
        partySize: reservation?.partySize || 2,
        time: reservation?.time || '',
        tableNumber: reservation?.tableNumber || '',
        specialRequests: reservation?.specialRequests || '',
        status: reservation?.status || 'pending'
      });
    } else {
      setFormData({
        customerName: '',
        phone: '',
        email: '',
        partySize: 2,
        time: '',
        tableNumber: '',
        specialRequests: '',
        status: 'pending'
      });
    }
    setErrors({});
  }, [reservation, isOpen]);

  const timeSlots = [
    { value: '12:00', label: '12:00 PM' },
    { value: '12:30', label: '12:30 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '13:30', label: '1:30 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '14:30', label: '2:30 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '18:30', label: '6:30 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '19:30', label: '7:30 PM' },
    { value: '20:00', label: '8:00 PM' },
    { value: '20:30', label: '8:30 PM' },
    { value: '21:00', label: '9:00 PM' },
    { value: '21:30', label: '9:30 PM' },
    { value: '22:00', label: '10:00 PM' }
  ];

  const partySizeOptions = [
    { value: 1, label: '1 persona' },
    { value: 2, label: '2 personas' },
    { value: 3, label: '3 personas' },
    { value: 4, label: '4 personas' },
    { value: 5, label: '5 personas' },
    { value: 6, label: '6 personas' },
    { value: 7, label: '7 personas' },
    { value: 8, label: '8 personas' },
    { value: 10, label: '10+ personas' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'confirmed', label: 'Confirmada' },
    { value: 'seated', label: 'Sentados' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' }
  ];

  const tableOptions = [
    { value: '', label: 'Asignación automática' },
    ...availableTables?.filter(table => table?.capacity >= formData?.partySize)?.map(table => ({
        value: table?.number,
        label: `Mesa ${table?.number} (${table?.capacity} personas) - ${table?.area}`
      }))
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.customerName?.trim()) {
      newErrors.customerName = 'El nombre del cliente es requerido';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\+?[\d\s-()]+$/?.test(formData?.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    if (formData?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!formData?.time) {
      newErrors.time = 'La hora es requerida';
    }

    if (formData?.partySize < 1 || formData?.partySize > 20) {
      newErrors.partySize = 'El número de personas debe estar entre 1 y 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reservationData = {
        ...formData,
        id: reservation?.id || Date.now(),
        date: selectedDate,
        createdAt: reservation?.createdAt || new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };

      await onSave(reservationData);
      onClose();
    } catch (error) {
      console.error('Error saving reservation:', error);
      setErrors({ submit: 'Error al guardar la reserva. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-card border border-border rounded-lg restaurant-shadow-modal max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {reservation ? 'Editar Reserva' : 'Nueva Reserva'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedDate ? new Date(selectedDate)?.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Fecha no seleccionada'}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                Información del Cliente
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre del Cliente"
                  type="text"
                  placeholder="Nombre completo"
                  value={formData?.customerName}
                  onChange={(e) => handleInputChange('customerName', e?.target?.value)}
                  error={errors?.customerName}
                  required
                />
                
                <Input
                  label="Teléfono"
                  type="tel"
                  placeholder="+34 600 000 000"
                  value={formData?.phone}
                  onChange={(e) => handleInputChange('phone', e?.target?.value)}
                  error={errors?.phone}
                  required
                />
              </div>
              
              <Input
                label="Email (Opcional)"
                type="email"
                placeholder="cliente@email.com"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
                description="Para enviar confirmaciones y recordatorios"
              />
            </div>

            {/* Reservation Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                Detalles de la Reserva
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Número de Personas"
                  options={partySizeOptions}
                  value={formData?.partySize}
                  onChange={(value) => handleInputChange('partySize', value)}
                  error={errors?.partySize}
                  required
                />
                
                <Select
                  label="Hora"
                  options={timeSlots}
                  value={formData?.time}
                  onChange={(value) => handleInputChange('time', value)}
                  error={errors?.time}
                  required
                  searchable
                />
                
                <Select
                  label="Mesa"
                  options={tableOptions}
                  value={formData?.tableNumber}
                  onChange={(value) => handleInputChange('tableNumber', value)}
                  description="Dejar vacío para asignación automática"
                />
              </div>
              
              {reservation && (
                <Select
                  label="Estado"
                  options={statusOptions}
                  value={formData?.status}
                  onChange={(value) => handleInputChange('status', value)}
                />
              )}
            </div>

            {/* Special Requests */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                Solicitudes Especiales
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Comentarios o solicitudes especiales
                </label>
                <textarea
                  placeholder="Ej: Celebración de cumpleaños, mesa junto a la ventana, alergias alimentarias..."
                  value={formData?.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e?.target?.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>

            {errors?.submit && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-md">
                <p className="text-sm text-error">{errors?.submit}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Save"
            >
              {reservation ? 'Actualizar Reserva' : 'Crear Reserva'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;