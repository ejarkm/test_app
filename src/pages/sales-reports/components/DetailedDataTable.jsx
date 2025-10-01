import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const DetailedDataTable = ({ reportType, filters }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock transaction data
  const mockTransactions = [
    {
      id: 'TXN-001',
      fecha: '2024-09-24',
      hora: '14:30',
      mesa: 'Mesa 12',
      camarero: 'María García',
      items: 'Paella Valenciana x2, Sangría x1',
      subtotal: 89.50,
      impuestos: 9.85,
      total: 99.35,
      metodoPago: 'Tarjeta de Crédito',
      estado: 'Completada'
    },
    {
      id: 'TXN-002',
      fecha: '2024-09-24',
      hora: '13:15',
      mesa: 'Mesa 8',
      camarero: 'Carlos Rodríguez',
      items: 'Gazpacho x1, Cordero Asado x1, Crema Catalana x1',
      subtotal: 78.00,
      impuestos: 8.58,
      total: 86.58,
      metodoPago: 'Efectivo',
      estado: 'Completada'
    },
    {
      id: 'TXN-003',
      fecha: '2024-09-24',
      hora: '12:45',
      mesa: 'Mesa 15',
      camarero: 'Ana Martínez',
      items: 'Jamón Ibérico x1, Vino Tinto x1',
      subtotal: 65.00,
      impuestos: 7.15,
      total: 72.15,
      metodoPago: 'Tarjeta de Débito',
      estado: 'Completada'
    },
    {
      id: 'TXN-004',
      fecha: '2024-09-24',
      hora: '19:20',
      mesa: 'Mesa 5',
      camarero: 'Luis Fernández',
      items: 'Paella Mixta x1, Ensalada x2, Cerveza x3',
      subtotal: 92.30,
      impuestos: 10.15,
      total: 102.45,
      metodoPago: 'Transferencia',
      estado: 'Completada'
    },
    {
      id: 'TXN-005',
      fecha: '2024-09-24',
      hora: '20:10',
      mesa: 'Mesa 3',
      camarero: 'María García',
      items: 'Tapas Variadas x1, Vino Blanco x2',
      subtotal: 56.80,
      impuestos: 6.25,
      total: 63.05,
      metodoPago: 'Tarjeta de Crédito',
      estado: 'Completada'
    }
  ];

  const sortOptions = [
    { value: 'fecha', label: 'Fecha' },
    { value: 'total', label: 'Total' },
    { value: 'mesa', label: 'Mesa' },
    { value: 'camarero', label: 'Camarero' }
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = mockTransactions?.filter(transaction => 
      transaction?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      transaction?.mesa?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      transaction?.camarero?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      transaction?.items?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )?.sort((a, b) => {
      if (sortConfig?.key) {
        const aValue = a?.[sortConfig?.key];
        const bValue = b?.[sortConfig?.key];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig?.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aString = String(aValue)?.toLowerCase();
        const bString = String(bValue)?.toLowerCase();
        
        if (sortConfig?.direction === 'asc') {
          return aString?.localeCompare(bString);
        } else {
          return bString?.localeCompare(aString);
        }
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSortedData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData?.slice(startIndex, startIndex + itemsPerPage);

  const exportData = (format) => {
    console.log(`Exporting data in ${format} format`);
    // Implementation for export functionality
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) {
      return 'ArrowUpDown';
    }
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="bg-card border border-border rounded-lg restaurant-shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h3 className="text-lg font-semibold text-foreground">
            Datos Detallados de Transacciones
          </h3>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex-1 sm:w-64">
              <Input
                type="search"
                placeholder="Buscar transacciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
              />
            </div>
            
            {/* Sort */}
            <Select
              options={sortOptions}
              value={sortConfig?.key}
              onChange={(value) => handleSort(value)}
              placeholder="Ordenar por"
            />
            
            {/* Export Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportData('excel')}
                iconName="FileSpreadsheet"
              >
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportData('pdf')}
                iconName="FileText"
              >
                PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center space-x-1 hover:text-foreground restaurant-transition"
                >
                  <span>ID Transacción</span>
                  <Icon name={getSortIcon('id')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('fecha')}
                  className="flex items-center space-x-1 hover:text-foreground restaurant-transition"
                >
                  <span>Fecha/Hora</span>
                  <Icon name={getSortIcon('fecha')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('mesa')}
                  className="flex items-center space-x-1 hover:text-foreground restaurant-transition"
                >
                  <span>Mesa</span>
                  <Icon name={getSortIcon('mesa')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('camarero')}
                  className="flex items-center space-x-1 hover:text-foreground restaurant-transition"
                >
                  <span>Camarero</span>
                  <Icon name={getSortIcon('camarero')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('total')}
                  className="flex items-center space-x-1 hover:text-foreground restaurant-transition"
                >
                  <span>Total</span>
                  <Icon name={getSortIcon('total')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Método de Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {paginatedData?.map((transaction) => (
              <tr key={transaction?.id} className="hover:bg-muted/50 restaurant-transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  {transaction?.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  <div>
                    <div>{transaction?.fecha}</div>
                    <div className="text-xs">{transaction?.hora}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {transaction?.mesa}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {transaction?.camarero}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs">
                  <div className="truncate" title={transaction?.items}>
                    {transaction?.items}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  €{transaction?.total?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {transaction?.metodoPago}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success/10 text-success">
                    {transaction?.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredAndSortedData?.length)} de {filteredAndSortedData?.length} transacciones
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
            >
              Anterior
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)?.map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedDataTable;