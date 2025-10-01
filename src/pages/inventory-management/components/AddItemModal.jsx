import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import BarcodeScanner from '../../../components/ui/BarcodeScanner';
import { getProductByCode, validateScannedCode } from '../../../utils/barcodeProductService';

const AddItemModal = ({ isOpen, onClose, onSave, categories, suppliers }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    supplier: '',
    quantity: '',
    minStock: '',
    maxStock: '',
    unitCost: '',
    unit: '',
    expiryDate: '',
    description: '',
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  const unitOptions = [
    { value: 'kg', label: 'Kilogramos (kg)' },
    { value: 'g', label: 'Gramos (g)' },
    { value: 'l', label: 'Litros (l)' },
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'pcs', label: 'Piezas (pcs)' },
    { value: 'box', label: 'Cajas (box)' },
    { value: 'bottle', label: 'Botellas (bottle)' },
    { value: 'can', label: 'Latas (can)' }
  ];

  const categoryOptions = categories?.map(cat => ({
    value: cat?.id,
    label: cat?.name
  }));

  const supplierOptions = suppliers?.map(sup => ({
    value: sup?.id,
    label: sup?.name
  }));

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'El nombre del producto es requerido';
    }

    if (!formData?.sku?.trim()) {
      newErrors.sku = 'El SKU es requerido';
    }

    if (!formData?.category) {
      newErrors.category = 'La categoría es requerida';
    }

    if (!formData?.supplier) {
      newErrors.supplier = 'El proveedor es requerido';
    }

    if (!formData?.quantity || parseFloat(formData?.quantity) < 0) {
      newErrors.quantity = 'La cantidad debe ser mayor o igual a 0';
    }

    if (!formData?.minStock || parseFloat(formData?.minStock) < 0) {
      newErrors.minStock = 'El stock mínimo debe ser mayor o igual a 0';
    }

    if (!formData?.unitCost || parseFloat(formData?.unitCost) <= 0) {
      newErrors.unitCost = 'El costo unitario debe ser mayor a 0';
    }

    if (!formData?.unit) {
      newErrors.unit = 'La unidad de medida es requerida';
    }

    if (!formData?.expiryDate) {
      newErrors.expiryDate = 'La fecha de caducidad es requerida';
    }

    if (formData?.maxStock && parseFloat(formData?.maxStock) < parseFloat(formData?.minStock)) {
      newErrors.maxStock = 'El stock máximo debe ser mayor al mínimo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newItem = {
      id: Date.now()?.toString(),
      name: formData?.name?.trim(),
      sku: formData?.sku?.trim(),
      category: categories?.find(c => c?.id === formData?.category)?.name || '',
      supplier: suppliers?.find(s => s?.id === formData?.supplier)?.name || '',
      supplierContact: suppliers?.find(s => s?.id === formData?.supplier)?.contact || '',
      quantity: parseFloat(formData?.quantity),
      minStock: parseFloat(formData?.minStock),
      maxStock: formData?.maxStock ? parseFloat(formData?.maxStock) : null,
      unitCost: parseFloat(formData?.unitCost),
      unit: formData?.unit,
      expiryDate: formData?.expiryDate,
      description: formData?.description?.trim(),
      image: formData?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      createdAt: new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString()
    };

    onSave(newItem);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      supplier: '',
      quantity: '',
      minStock: '',
      maxStock: '',
      unitCost: '',
      unit: '',
      expiryDate: '',
      description: '',
      image: ''
    });
    setErrors({});
    setScannedCode('');
    setIsLoadingProduct(false);
  };

  const generateSKU = () => {
    const timestamp = Date.now()?.toString()?.slice(-6);
    const randomStr = Math.random()?.toString(36)?.substring(2, 5)?.toUpperCase();
    const sku = `PRD-${randomStr}-${timestamp}`;
    handleInputChange('sku', sku);
  };

  // Handle barcode scanning
  const handleBarcodeScan = async (code) => {
    console.log('Scanned code:', code);
    
    // Validate the scanned code
    const validation = validateScannedCode(code);
    if (!validation.isValid) {
      setErrors({ general: validation.error || 'Código escaneado no válido' });
      return;
    }

    setIsLoadingProduct(true);
    setScannedCode(code);
    
    try {
      // Get product data from the scanned code
      const productData = await getProductByCode(code);
      
      if (productData) {
        // Auto-fill the form with the product data
        setFormData(prev => ({
          ...prev,
          name: productData.name || '',
          sku: productData.sku || prev.sku,
          category: productData.category || '',
          supplier: productData.supplier || '',
          unitCost: productData.unitCost?.toString() || '',
          unit: productData.unit || '',
          quantity: productData.quantity?.toString() || '10',
          minStock: productData.minStock?.toString() || '5',
          maxStock: productData.maxStock?.toString() || '',
          expiryDate: productData.expiryDate || '',
          description: productData.description || '',
          image: productData.image || ''
        }));

        // Show success message
        setErrors({ 
          success: `Producto escaneado: ${productData.name}. Revise y complete los datos faltantes.` 
        });
      } else {
        // Product not found in database
        setFormData(prev => ({
          ...prev,
          sku: code // At least set the SKU as the barcode
        }));
        setErrors({ 
          warning: 'Producto no encontrado en la base de datos. Complete manualmente los datos.' 
        });
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      setErrors({ general: 'Error al obtener datos del producto. Intente de nuevo.' });
    } finally {
      setIsLoadingProduct(false);
      setIsScannerOpen(false);
    }
  };

  const handleScannerError = (error) => {
    console.error('Scanner error:', error);
    setErrors({ general: 'Error del escáner. Verifique que la cámara esté disponible.' });
    setIsScannerOpen(false);
  };

  const openBarcodeScanner = () => {
    setErrors({});
    setIsScannerOpen(true);
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
      <div className="relative bg-card border border-border rounded-lg restaurant-shadow-modal w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="PackagePlus" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Agregar Nuevo Producto
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete la información manualmente o use el escáner de códigos
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={openBarcodeScanner}
              iconName="QrCode"
              disabled={isLoadingProduct}
              className="hidden sm:flex"
            >
              Escanear Código
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={openBarcodeScanner}
              iconName="QrCode"
              disabled={isLoadingProduct}
              className="sm:hidden"
              title="Escanear código de barras o QR"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              iconName="X"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoadingProduct && (
          <div className="flex items-center justify-center p-6 border-b border-border">
            <div className="flex items-center space-x-3 text-primary">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span className="text-sm font-medium">
                Obteniendo información del producto escaneado...
              </span>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {(errors?.success || errors?.warning || errors?.general) && (
          <div className="p-4 mx-6 mt-6 rounded-lg">
            {errors?.success && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm text-success font-medium">{errors?.success}</span>
                </div>
              </div>
            )}
            {errors?.warning && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <span className="text-sm text-warning font-medium">{errors?.warning}</span>
                </div>
              </div>
            )}
            {errors?.general && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-error" />
                  <span className="text-sm text-error">{errors?.general}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scanned Code Display */}
        {scannedCode && (
          <div className="mx-6 mt-4 p-3 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="QrCode" size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">Código escaneado:</span>
              <code className="px-2 py-1 bg-background rounded font-mono text-xs">
                {scannedCode}
              </code>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
                Información Básica
              </h3>

              <Input
                label="Nombre del Producto"
                required
                placeholder="Ej: Tomates Cherry"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
              />

              <div className="flex space-x-2">
                <Input
                  label="SKU"
                  required
                  placeholder="PRD-ABC-123456"
                  value={formData?.sku}
                  onChange={(e) => handleInputChange('sku', e?.target?.value)}
                  error={errors?.sku}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSKU}
                  iconName="RefreshCw"
                  className="mt-6"
                >
                  Generar
                </Button>
              </div>

              <Select
                label="Categoría"
                required
                placeholder="Seleccione una categoría"
                options={categoryOptions}
                value={formData?.category}
                onChange={(value) => handleInputChange('category', value)}
                error={errors?.category}
                searchable
              />

              <Select
                label="Proveedor"
                required
                placeholder="Seleccione un proveedor"
                options={supplierOptions}
                value={formData?.supplier}
                onChange={(value) => handleInputChange('supplier', value)}
                error={errors?.supplier}
                searchable
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descripción
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Descripción del producto..."
                  value={formData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
                Inventario y Precios
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Cantidad Inicial"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={formData?.quantity}
                  onChange={(e) => handleInputChange('quantity', e?.target?.value)}
                  error={errors?.quantity}
                />

                <Select
                  label="Unidad de Medida"
                  required
                  placeholder="Seleccione unidad"
                  options={unitOptions}
                  value={formData?.unit}
                  onChange={(value) => handleInputChange('unit', value)}
                  error={errors?.unit}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Stock Mínimo"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={formData?.minStock}
                  onChange={(e) => handleInputChange('minStock', e?.target?.value)}
                  error={errors?.minStock}
                />

                <Input
                  label="Stock Máximo"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Opcional"
                  value={formData?.maxStock}
                  onChange={(e) => handleInputChange('maxStock', e?.target?.value)}
                  error={errors?.maxStock}
                />
              </div>

              <Input
                label="Costo Unitario"
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData?.unitCost}
                onChange={(e) => handleInputChange('unitCost', e?.target?.value)}
                error={errors?.unitCost}
                description="Precio de compra por unidad"
              />

              <Input
                label="Fecha de Caducidad"
                type="date"
                required
                value={formData?.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e?.target?.value)}
                error={errors?.expiryDate}
              />

              <Input
                label="URL de Imagen"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData?.image}
                onChange={(e) => handleInputChange('image', e?.target?.value)}
                description="Opcional: URL de la imagen del producto"
              />
            </div>
          </div>

          {/* Preview */}
          {(formData?.name || formData?.quantity || formData?.unitCost) && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-foreground mb-3 flex items-center">
                <Icon name="Eye" size={16} className="mr-2 text-primary" />
                Vista Previa
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Producto:</span>
                  <div className="font-medium text-foreground">
                    {formData?.name || 'Sin nombre'}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Cantidad:</span>
                  <div className="font-medium text-foreground">
                    {formData?.quantity || '0'} {formData?.unit || 'unidades'}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Costo Unitario:</span>
                  <div className="font-medium text-foreground">
                    {formData?.unitCost ? 
                      new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })?.format(parseFloat(formData?.unitCost)) : 
                      '€0.00'
                    }
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor Total:</span>
                  <div className="font-medium text-success">
                    {(formData?.quantity && formData?.unitCost) ? 
                      new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })?.format(parseFloat(formData?.quantity) * parseFloat(formData?.unitCost)) : 
                      '€0.00'
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              iconName="RotateCcw"
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              iconName="Save"
              iconPosition="left"
            >
              Agregar Producto
            </Button>
          </div>
        </form>
      </div>

      {/* Barcode Scanner */}
      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleBarcodeScan}
        onError={handleScannerError}
      />
    </div>
  );
};

export default AddItemModal;
