import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const InventoryTable = ({ 
  items, 
  onSort, 
  sortConfig, 
  onEditItem, 
  onDeleteItem,
  onStockAdjustment 
}) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const getStatusBadge = (item) => {
    const { quantity, minStock, expiryDate } = item;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysToExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (quantity === 0) {
      return { label: 'Sin Stock', color: 'bg-error text-error-foreground' };
    } else if (quantity <= minStock) {
      return { label: 'Stock Bajo', color: 'bg-warning text-warning-foreground' };
    } else if (daysToExpiry <= 0) {
      return { label: 'Caducado', color: 'bg-error text-error-foreground' };
    } else if (daysToExpiry <= 7) {
      return { label: 'Próximo a Caducar', color: 'bg-warning text-warning-foreground' };
    } else {
      return { label: 'En Stock', color: 'bg-success text-success-foreground' };
    }
  };

  const handleSort = (column) => {
    const direction = sortConfig?.column === column && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    onSort({ column, direction });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(items?.map(item => item?.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems?.filter(id => id !== itemId));
    }
  };

  const getSortIcon = (column) => {
    if (sortConfig?.column !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-ES');
  };

  return (
    <div className="bg-card border border-border rounded-lg restaurant-shadow-sm overflow-hidden">
      {/* Table Header Actions */}
      {selectedItems?.length > 0 && (
        <div className="px-6 py-4 bg-primary/5 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {selectedItems?.length} elementos seleccionados
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" iconName="Edit3">
                Ajuste Masivo
              </Button>
              <Button variant="outline" size="sm" iconName="FileText">
                Generar Orden
              </Button>
              <Button variant="destructive" size="sm" iconName="Trash2">
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedItems?.length === items?.length && items?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary restaurant-transition"
                >
                  <span>Producto</span>
                  <Icon name={getSortIcon('name')} size={16} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary restaurant-transition"
                >
                  <span>Categoría</span>
                  <Icon name={getSortIcon('category')} size={16} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('quantity')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary restaurant-transition"
                >
                  <span>Cantidad</span>
                  <Icon name={getSortIcon('quantity')} size={16} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('unitCost')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary restaurant-transition"
                >
                  <span>Costo Unitario</span>
                  <Icon name={getSortIcon('unitCost')} size={16} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-foreground">Valor Total</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-foreground">Proveedor</span>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('expiryDate')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary restaurant-transition"
                >
                  <span>Caducidad</span>
                  <Icon name={getSortIcon('expiryDate')} size={16} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-foreground">Estado</span>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-sm font-medium text-foreground">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items?.map((item) => {
              const status = getStatusBadge(item);
              const totalValue = item?.quantity * item?.unitCost;
              
              return (
                <tr key={item?.id} className="hover:bg-muted/30 restaurant-transition">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems?.includes(item?.id)}
                      onChange={(e) => handleSelectItem(item?.id, e?.target?.checked)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={item?.image}
                          alt={item?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{item?.name}</div>
                        <div className="text-sm text-muted-foreground">{item?.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                      {item?.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">
                        {item?.quantity} {item?.unit}
                      </div>
                      <div className="text-muted-foreground">
                        Mín: {item?.minStock} {item?.unit}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-foreground">
                      {formatCurrency(item?.unitCost)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-foreground">
                      {formatCurrency(totalValue)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">{item?.supplier}</div>
                      <div className="text-muted-foreground">{item?.supplierContact}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">
                      {formatDate(item?.expiryDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status?.color}`}>
                      {status?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit3"
                        onClick={() => onStockAdjustment(item)}
                      >
                        Ajustar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={() => onEditItem(item)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => onDeleteItem(item)}
                        className="text-error hover:text-error"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Empty State */}
      {items?.length === 0 && (
        <div className="px-6 py-12 text-center">
          <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No se encontraron productos
          </h3>
          <p className="text-muted-foreground mb-4">
            No hay productos que coincidan con los filtros aplicados.
          </p>
          <Button variant="outline" iconName="Plus">
            Agregar Primer Producto
          </Button>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;