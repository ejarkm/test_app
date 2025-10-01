import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ReportExportPanel = ({ currentFilters, onExport }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeCharts: true,
    includeKPIs: true,
    includeDetailedData: true,
    includeSummary: true,
    includeFilters: true
  });
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'PDF', description: 'Documento portátil con formato' },
    { value: 'excel', label: 'Excel', description: 'Hoja de cálculo editable' },
    { value: 'csv', label: 'CSV', description: 'Datos separados por comas' },
    { value: 'json', label: 'JSON', description: 'Formato de datos estructurados' }
  ];

  const handleExportOptionChange = (option, checked) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = {
        format: exportFormat,
        options: exportOptions,
        filters: currentFilters,
        timestamp: new Date()?.toISOString(),
        filename: `informe-ventas-${new Date()?.toISOString()?.split('T')?.[0]}.${exportFormat}`
      };
      
      console.log('Exporting report:', exportData);
      onExport?.(exportData);
      
      // Show success message or trigger download
      alert(`Informe exportado exitosamente en formato ${exportFormat?.toUpperCase()}`);  
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Error al exportar el informe. Por favor, inténtelo de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'pdf':
        return 'FileText';
      case 'excel':
        return 'FileSpreadsheet';
      case 'csv':
        return 'Database';
      case 'json':
        return 'Code';
      default:
        return 'File';
    }
  };

  const estimateFileSize = () => {
    let baseSize = 0.5; // MB base
    
    if (exportOptions?.includeCharts) baseSize += 2;
    if (exportOptions?.includeDetailedData) baseSize += 5;
    if (exportOptions?.includeKPIs) baseSize += 0.5;
    
    if (exportFormat === 'pdf') baseSize *= 1.2;
    if (exportFormat === 'excel') baseSize *= 0.8;
    if (exportFormat === 'csv') baseSize *= 0.3;
    
    return baseSize?.toFixed(1);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 restaurant-shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Download" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Exportar Informe
        </h3>
      </div>
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Formato de Exportación
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formatOptions?.map((format) => (
              <button
                key={format?.value}
                onClick={() => setExportFormat(format?.value)}
                className={`
                  p-4 border rounded-lg text-left restaurant-transition
                  ${exportFormat === format?.value
                    ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50 hover:bg-muted/50'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={getFormatIcon(format?.value)} 
                    size={20} 
                    className={exportFormat === format?.value ? 'text-primary' : 'text-muted-foreground'}
                  />
                  <div>
                    <div className="font-medium">{format?.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {format?.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Contenido a Incluir
          </label>
          <div className="space-y-3">
            <Checkbox
              label="Gráficos y Visualizaciones"
              description="Incluir todos los gráficos del informe"
              checked={exportOptions?.includeCharts}
              onChange={(e) => handleExportOptionChange('includeCharts', e?.target?.checked)}
            />
            <Checkbox
              label="Indicadores Clave (KPIs)"
              description="Métricas de rendimiento principales"
              checked={exportOptions?.includeKPIs}
              onChange={(e) => handleExportOptionChange('includeKPIs', e?.target?.checked)}
            />
            <Checkbox
              label="Datos Detallados"
              description="Tabla completa de transacciones"
              checked={exportOptions?.includeDetailedData}
              onChange={(e) => handleExportOptionChange('includeDetailedData', e?.target?.checked)}
            />
            <Checkbox
              label="Resumen Ejecutivo"
              description="Análisis y conclusiones del período"
              checked={exportOptions?.includeSummary}
              onChange={(e) => handleExportOptionChange('includeSummary', e?.target?.checked)}
            />
            <Checkbox
              label="Filtros Aplicados"
              description="Información sobre los filtros utilizados"
              checked={exportOptions?.includeFilters}
              onChange={(e) => handleExportOptionChange('includeFilters', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Export Summary */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Resumen de Exportación
          </h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Formato:</span>
              <span className="font-medium text-foreground">
                {formatOptions?.find(f => f?.value === exportFormat)?.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tamaño estimado:</span>
              <span className="font-medium text-foreground">
                ~{estimateFileSize()} MB
              </span>
            </div>
            <div className="flex justify-between">
              <span>Elementos incluidos:</span>
              <span className="font-medium text-foreground">
                {Object.values(exportOptions)?.filter(Boolean)?.length} de 5
              </span>
            </div>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={handleExport}
            disabled={isExporting || !Object.values(exportOptions)?.some(Boolean)}
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
            className="flex-1"
          >
            {isExporting ? 'Exportando...' : 'Exportar Informe'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => console.log('Preview report')}
            iconName="Eye"
            iconPosition="left"
          >
            Vista Previa
          </Button>
        </div>

        {/* Quick Export Buttons */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Exportación Rápida:
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setExportFormat('pdf');
                setExportOptions({
                  includeCharts: true,
                  includeKPIs: true,
                  includeDetailedData: false,
                  includeSummary: true,
                  includeFilters: true
                });
              }}
              iconName="FileText"
            >
              Resumen PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setExportFormat('excel');
                setExportOptions({
                  includeCharts: false,
                  includeKPIs: true,
                  includeDetailedData: true,
                  includeSummary: false,
                  includeFilters: true
                });
              }}
              iconName="FileSpreadsheet"
            >
              Datos Excel
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setExportFormat('csv');
                setExportOptions({
                  includeCharts: false,
                  includeKPIs: false,
                  includeDetailedData: true,
                  includeSummary: false,
                  includeFilters: false
                });
              }}
              iconName="Database"
            >
              Solo Datos CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportExportPanel;