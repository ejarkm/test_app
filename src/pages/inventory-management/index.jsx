import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import InventoryStatsCards from './components/InventoryStatsCards';
import InventoryFilters from './components/InventoryFilters';
import InventoryTable from './components/InventoryTable';
import StockAdjustmentModal from './components/StockAdjustmentModal';
import AddItemModal from './components/AddItemModal';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InventoryManagement = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    supplier: 'all',
    minCost: '',
    maxCost: '',
    expiryDate: ''
  });
  const [sortConfig, setSortConfig] = useState({
    column: 'name',
    direction: 'asc'
  });
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stats, setStats] = useState({});

  // Mock data
  const mockCategories = [
    { id: 'vegetables', name: 'Verduras' },
    { id: 'fruits', name: 'Frutas' },
    { id: 'meat', name: 'Carnes' },
    { id: 'dairy', name: 'Lácteos' },
    { id: 'beverages', name: 'Bebidas' },
    { id: 'spices', name: 'Especias' },
    { id: 'grains', name: 'Granos' },
    { id: 'cleaning', name: 'Limpieza' }
  ];

  const mockSuppliers = [
    { id: 'supplier1', name: 'Distribuidora Central', contact: '+34 912 345 678' },
    { id: 'supplier2', name: 'Frutas y Verduras López', contact: '+34 913 456 789' },
    { id: 'supplier3', name: 'Carnicería Premium', contact: '+34 914 567 890' },
    { id: 'supplier4', name: 'Lácteos Frescos SA', contact: '+34 915 678 901' },
    { id: 'supplier5', name: 'Bebidas Martínez', contact: '+34 916 789 012' }
  ];

  const mockInventoryData = [
    {
      id: '1',
      name: 'Tomates Cherry',
      sku: 'PRD-TOM-001',
      category: 'Verduras',
      supplier: 'Frutas y Verduras López',
      supplierContact: '+34 913 456 789',
      quantity: 15,
      minStock: 20,
      unitCost: 3.50,
      unit: 'kg',
      expiryDate: '2024-10-15',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
    },
    {
      id: '2',
      name: 'Pechuga de Pollo',
      sku: 'PRD-CHK-002',
      category: 'Carnes',
      supplier: 'Carnicería Premium',
      supplierContact: '+34 914 567 890',
      quantity: 8,
      minStock: 10,
      unitCost: 12.80,
      unit: 'kg',
      expiryDate: '2024-10-02',
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400'
    },
    {
      id: '3',
      name: 'Leche Entera',
      sku: 'PRD-MLK-003',
      category: 'Lácteos',
      supplier: 'Lácteos Frescos SA',
      supplierContact: '+34 915 678 901',
      quantity: 24,
      minStock: 15,
      unitCost: 1.20,
      unit: 'l',
      expiryDate: '2024-10-08',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'
    },
    {
      id: '4',
      name: 'Aceite de Oliva Extra',
      sku: 'PRD-OIL-004',
      category: 'Condimentos',
      supplier: 'Distribuidora Central',
      supplierContact: '+34 912 345 678',
      quantity: 0,
      minStock: 5,
      unitCost: 8.90,
      unit: 'l',
      expiryDate: '2025-06-20',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'
    },
    {
      id: '5',
      name: 'Arroz Bomba',
      sku: 'PRD-RIC-005',
      category: 'Granos',
      supplier: 'Distribuidora Central',
      supplierContact: '+34 912 345 678',
      quantity: 50,
      minStock: 25,
      unitCost: 4.20,
      unit: 'kg',
      expiryDate: '2025-12-31',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'
    },
    {
      id: '6',
      name: 'Salmón Fresco',
      sku: 'PRD-SAL-006',
      category: 'Pescados',
      supplier: 'Pescadería del Mar',
      supplierContact: '+34 917 890 123',
      quantity: 3,
      minStock: 8,
      unitCost: 18.50,
      unit: 'kg',
      expiryDate: '2024-09-26',
      image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400'
    }
  ];

  const mockUser = {
    name: 'Carlos Rodríguez',
    role: 'manager',
    email: 'carlos@spaikrestaurant.com',
    avatar: null
  };

  const mockNotifications = [
    {
      id: 1,
      type: 'inventory',
      title: 'Stock Bajo',
      message: 'Tomates Cherry: Solo quedan 15 kg',
      time: '5 min',
      priority: 'high',
      read: false
    },
    {
      id: 2,
      type: 'inventory',
      title: 'Producto Caducado',
      message: 'Salmón Fresco caduca hoy',
      time: '1 hora',
      priority: 'high',
      read: false
    }
  ];

  // Initialize data
  useEffect(() => {
    setInventoryItems(mockInventoryData);
    calculateStats(mockInventoryData);
  }, []);

  // Filter and sort items
  useEffect(() => {
    let filtered = [...inventoryItems];

    // Apply filters
    if (filters?.search) {
      filtered = filtered?.filter(item =>
        item?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        item?.sku?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    if (filters?.category !== 'all') {
      filtered = filtered?.filter(item => {
        const category = mockCategories?.find(c => c?.id === filters?.category);
        return item?.category === category?.name;
      });
    }

    if (filters?.status !== 'all') {
      filtered = filtered?.filter(item => {
        const today = new Date();
        const expiry = new Date(item.expiryDate);
        const daysToExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        switch (filters?.status) {
          case 'in_stock':
            return item?.quantity > item?.minStock && daysToExpiry > 7;
          case 'low_stock':
            return item?.quantity <= item?.minStock && item?.quantity > 0;
          case 'out_of_stock':
            return item?.quantity === 0;
          case 'expired':
            return daysToExpiry <= 0;
          case 'expiring_soon':
            return daysToExpiry > 0 && daysToExpiry <= 7;
          default:
            return true;
        }
      });
    }

    if (filters?.supplier !== 'all') {
      const supplier = mockSuppliers?.find(s => s?.id === filters?.supplier);
      filtered = filtered?.filter(item => item?.supplier === supplier?.name);
    }

    if (filters?.minCost) {
      filtered = filtered?.filter(item => item?.unitCost >= parseFloat(filters?.minCost));
    }

    if (filters?.maxCost) {
      filtered = filtered?.filter(item => item?.unitCost <= parseFloat(filters?.maxCost));
    }

    if (filters?.expiryDate) {
      filtered = filtered?.filter(item => item?.expiryDate <= filters?.expiryDate);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.column];
      let bValue = b?.[sortConfig?.column];

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredItems(filtered);
  }, [inventoryItems, filters, sortConfig]);

  const calculateStats = (items) => {
    const today = new Date();
    
    const totalValue = items?.reduce((sum, item) => sum + (item?.quantity * item?.unitCost), 0);
    const lowStockItems = items?.filter(item => item?.quantity <= item?.minStock && item?.quantity > 0)?.length;
    const outOfStockItems = items?.filter(item => item?.quantity === 0)?.length;
    const inStockItems = items?.filter(item => item?.quantity > item?.minStock)?.length;
    const expiringItems = items?.filter(item => {
      const expiry = new Date(item.expiryDate);
      const daysToExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      return daysToExpiry <= 7 && daysToExpiry > 0;
    })?.length;

    setStats({
      totalValue,
      valueChange: 5.2, // Mock percentage change
      lowStockItems,
      outOfStockItems,
      inStockItems,
      expiringItems,
      pendingDeliveries: 3,
      deliveriesToday: 1,
      totalProducts: items?.length
    });
  };

  const handleSort = (config) => {
    setSortConfig(config);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      status: 'all',
      supplier: 'all',
      minCost: '',
      maxCost: '',
      expiryDate: ''
    });
  };

  const handleStockAdjustment = (item) => {
    setSelectedItem(item);
    setIsStockModalOpen(true);
  };

  const handleSaveAdjustment = (adjustmentData) => {
    setInventoryItems(prev => prev?.map(item => 
      item?.id === adjustmentData?.itemId 
        ? { ...item, quantity: adjustmentData?.newQuantity }
        : item
    ));
    calculateStats(inventoryItems);
  };

  const handleAddItem = (newItem) => {
    const updatedItems = [...inventoryItems, newItem];
    setInventoryItems(updatedItems);
    calculateStats(updatedItems);
  };

  const handleEditItem = (item) => {
    console.log('Edit item:', item);
    // Implement edit functionality
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`¿Está seguro de eliminar ${item?.name}?`)) {
      const updatedItems = inventoryItems?.filter(i => i?.id !== item?.id);
      setInventoryItems(updatedItems);
      calculateStats(updatedItems);
    }
  };

  const contextActions = [
    {
      label: 'Agregar Producto',
      icon: 'PackagePlus',
      action: () => setIsAddModalOpen(true),
      variant: 'default',
      primary: true
    },
    {
      label: 'Ajuste Rápido',
      icon: 'Edit3',
      action: () => console.log('Quick adjustment'),
      variant: 'outline'
    },
    {
      label: 'Generar Informe',
      icon: 'FileText',
      action: () => console.log('Generate report'),
      variant: 'outline'
    },
    {
      label: 'Importar Datos',
      icon: 'Upload',
      action: () => console.log('Import data'),
      variant: 'ghost'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} notifications={mockNotifications} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumb />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Gestión de Inventario
              </h1>
              <p className="text-muted-foreground mt-2">
                Controla y gestiona el stock de tu restaurante de forma eficiente
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Download"
                onClick={() => console.log('Export inventory')}
              >
                Exportar
              </Button>
              <Button
                iconName="PackagePlus"
                onClick={() => setIsAddModalOpen(true)}
              >
                Agregar Producto
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <InventoryStatsCards stats={stats} />

          {/* Quick Actions */}
          <QuickActions
            stats={stats}
            onAddItem={() => setIsAddModalOpen(true)}
            onBulkImport={() => console.log('Bulk import')}
            onGenerateReport={() => console.log('Generate report')}
            onLowStockAlert={() => setFilters(prev => ({ ...prev, status: 'low_stock' }))}
          />

          {/* Filters */}
          <InventoryFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            categories={mockCategories}
            suppliers={mockSuppliers}
          />

          {/* Inventory Table */}
          <InventoryTable
            items={filteredItems}
            onSort={handleSort}
            sortConfig={sortConfig}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onStockAdjustment={handleStockAdjustment}
          />

          {/* Pagination */}
          {filteredItems?.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredItems?.length} de {inventoryItems?.length} productos
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Modals */}
      <StockAdjustmentModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        item={selectedItem}
        onSave={handleSaveAdjustment}
      />
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddItem}
        categories={mockCategories}
        suppliers={mockSuppliers}
      />
      {/* Quick Action Toolbar */}
      <QuickActionToolbar
        contextActions={contextActions}
        position="floating"
        user={mockUser}
      />
    </div>
  );
};

export default InventoryManagement;