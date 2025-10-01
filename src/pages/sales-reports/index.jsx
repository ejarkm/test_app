import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import ReportFilters from './components/ReportFilters';
import KPICards from './components/KPICards';
import SalesChart from './components/SalesChart';
import DetailedDataTable from './components/DetailedDataTable';
import ReportExportPanel from './components/ReportExportPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SalesReports = () => {
  const [currentUser] = useState({
    name: 'Carlos Mendoza',
    role: 'manager',
    email: 'carlos.mendoza@spaikrestaurant.com',
    avatar: null
  });

  const [notifications] = useState([
    {
      id: 1,
      type: 'system',
      title: 'Informe Programado',
      message: 'El informe mensual se generará automáticamente mañana',
      time: '2 min',
      priority: 'medium',
      read: false
    }
  ]);

  const [filters, setFilters] = useState({
    dateRange: 'today',
    startDate: '',
    endDate: '',
    reportType: 'daily-sales',
    staffMember: 'all',
    tableSection: 'all',
    menuCategory: 'all'
  });

  const [isExportPanelOpen, setIsExportPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock previous period data for comparison
  const [previousPeriodData] = useState({
    totalSales: 11230.50,
    transactions: 142,
    averageReceipt: 79.09,
    uniqueCustomers: 128,
    profitMargin: 31.2,
    productsSold: 398
  });

  useEffect(() => {
    // Simulate data loading when filters change
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleExportReport = (exportData) => {
    console.log('Exporting report with data:', exportData);
    // Implementation for actual export functionality
  };

  const quickActions = [
    {
      label: 'Nuevo Informe',
      icon: 'BarChart3',
      action: () => console.log('Create new report'),
      variant: 'default',
      primary: true
    },
    {
      label: 'Exportar Datos',
      icon: 'Download',
      action: () => setIsExportPanelOpen(true),
      variant: 'outline'
    },
    {
      label: 'Programar Informe',
      icon: 'Clock',
      action: () => console.log('Schedule report'),
      variant: 'outline'
    },
    {
      label: 'Comparar Períodos',
      icon: 'GitCompare',
      action: () => console.log('Compare periods'),
      variant: 'ghost'
    }
  ];

  const breadcrumbs = [
    {
      label: 'Inicio',
      path: '/',
      icon: 'Home'
    },
    {
      label: 'Informes de Ventas',
      path: '/sales-reports',
      isActive: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={currentUser} notifications={notifications} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <NavigationBreadcrumb customBreadcrumbs={breadcrumbs} />

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Informes de Ventas
              </h1>
              <p className="text-muted-foreground">
                Análisis completo del rendimiento financiero y operativo del restaurante
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsExportPanelOpen(!isExportPanelOpen)}
                iconName="Download"
                iconPosition="left"
              >
                Exportar
              </Button>
              <Button
                onClick={() => console.log('Generate new report')}
                iconName="Plus"
                iconPosition="left"
              >
                Nuevo Informe
              </Button>
            </div>
          </div>

          {/* Report Filters */}
          <div className="mb-8">
            <ReportFilters 
              onFiltersChange={handleFiltersChange}
              currentFilters={filters}
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Cargando datos del informe...</span>
              </div>
            </div>
          )}

          {/* Main Content */}
          {!isLoading && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <KPICards 
                data={filters}
                previousPeriodData={previousPeriodData}
              />

              {/* Charts and Export Panel Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <div className={`${isExportPanelOpen ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
                  <SalesChart 
                    reportType={filters?.reportType}
                    dateRange={filters?.dateRange}
                  />
                </div>

                {/* Export Panel */}
                {isExportPanelOpen && (
                  <div className="xl:col-span-1">
                    <ReportExportPanel
                      currentFilters={filters}
                      onExport={handleExportReport}
                    />
                  </div>
                )}
              </div>

              {/* Detailed Data Table */}
              <DetailedDataTable 
                reportType={filters?.reportType}
                filters={filters}
              />

              {/* Additional Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Summary */}
                <div className="bg-card border border-border rounded-lg p-6 restaurant-shadow-sm">
                  <div className="flex items-center space-x-2 mb-4">
                    <Icon name="TrendingUp" size={20} className="text-success" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Resumen de Rendimiento
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">Mejor Día</p>
                        <p className="text-xs text-muted-foreground">Sábado - €2,100</p>
                      </div>
                      <Icon name="Calendar" size={16} className="text-success" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">Hora Pico</p>
                        <p className="text-xs text-muted-foreground">20:00 - 21:00</p>
                      </div>
                      <Icon name="Clock" size={16} className="text-primary" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-warning/5 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">Plato Estrella</p>
                        <p className="text-xs text-muted-foreground">Paella Valenciana</p>
                      </div>
                      <Icon name="Star" size={16} className="text-warning" />
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-card border border-border rounded-lg p-6 restaurant-shadow-sm">
                  <div className="flex items-center space-x-2 mb-4">
                    <Icon name="Lightbulb" size={20} className="text-accent" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Recomendaciones
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-accent/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Optimizar Horarios
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Considere aumentar el personal durante las horas pico (20:00-21:00)
                      </p>
                    </div>
                    
                    <div className="p-3 bg-success/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Promocionar Platos
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Los postres tienen bajo rendimiento, considere ofertas especiales
                      </p>
                    </div>
                    
                    <div className="p-3 bg-warning/5 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Análisis de Costos
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Revise los costos de ingredientes para mantener el margen de beneficio
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Quick Action Toolbar */}
      <QuickActionToolbar 
        contextActions={quickActions}
        position="floating"
        user={currentUser}
      />
    </div>
  );
};

export default SalesReports;