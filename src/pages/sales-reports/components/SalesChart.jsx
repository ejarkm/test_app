import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Button from '../../../components/ui/Button';


const SalesChart = ({ reportType, dateRange }) => {
  const [chartType, setChartType] = useState('bar');

  // Mock data based on report type
  const generateChartData = () => {
    switch (reportType) {
      case 'daily-sales':
        return [
          { name: 'Lun', ventas: 2400, ordenes: 24, promedio: 100 },
          { name: 'Mar', ventas: 1398, ordenes: 18, promedio: 77.67 },
          { name: 'Mié', ventas: 9800, ordenes: 98, promedio: 100 },
          { name: 'Jue', ventas: 3908, ordenes: 42, promedio: 93.05 },
          { name: 'Vie', ventas: 4800, ordenes: 56, promedio: 85.71 },
          { name: 'Sáb', ventas: 3800, ordenes: 45, promedio: 84.44 },
          { name: 'Dom', ventas: 4300, ordenes: 52, promedio: 82.69 }
        ];

      case 'hourly-breakdown':
        return [
          { name: '08:00', ventas: 120, ordenes: 3 },
          { name: '09:00', ventas: 280, ordenes: 7 },
          { name: '10:00', ventas: 450, ordenes: 12 },
          { name: '11:00', ventas: 680, ordenes: 18 },
          { name: '12:00', ventas: 1200, ordenes: 32 },
          { name: '13:00', ventas: 1850, ordenes: 48 },
          { name: '14:00', ventas: 2100, ordenes: 54 },
          { name: '15:00', ventas: 1650, ordenes: 42 },
          { name: '16:00', ventas: 890, ordenes: 23 },
          { name: '17:00', ventas: 560, ordenes: 15 },
          { name: '18:00', ventas: 780, ordenes: 20 },
          { name: '19:00', ventas: 1450, ordenes: 38 },
          { name: '20:00', ventas: 2200, ordenes: 56 },
          { name: '21:00', ventas: 1980, ordenes: 51 },
          { name: '22:00', ventas: 1320, ordenes: 34 }
        ];

      case 'menu-performance':
        return [
          { name: 'Paella Valenciana', ventas: 2400, cantidad: 48, categoria: 'Platos Principales' },
          { name: 'Gazpacho', ventas: 1200, cantidad: 60, categoria: 'Entrantes' },
          { name: 'Jamón Ibérico', ventas: 1800, cantidad: 24, categoria: 'Entrantes' },
          { name: 'Cordero Asado', ventas: 3200, cantidad: 32, categoria: 'Platos Principales' },
          { name: 'Crema Catalana', ventas: 800, cantidad: 40, categoria: 'Postres' },
          { name: 'Sangría', ventas: 960, cantidad: 80, categoria: 'Bebidas' }
        ];

      case 'payment-methods':
        return [
          { name: 'Tarjeta de Crédito', value: 45, ventas: 5600 },
          { name: 'Efectivo', value: 30, ventas: 3720 },
          { name: 'Tarjeta de Débito', value: 20, ventas: 2480 },
          { name: 'Transferencia', value: 5, ventas: 620 }
        ];

      default:
        return [];
    }
  };

  const chartData = generateChartData();
  const colors = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0EA5E9'];

  const renderChart = () => {
    if (reportType === 'payment-methods') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors?.[index % colors?.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="name" 
              stroke="#64748B"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748B"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="ventas" 
              stroke="#2563EB" 
              strokeWidth={3}
              dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              name="Ventas (€)"
            />
            {chartData?.[0]?.ordenes && (
              <Line 
                type="monotone" 
                dataKey="ordenes" 
                stroke="#059669" 
                strokeWidth={3}
                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                name="Órdenes"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="name" 
            stroke="#64748B"
            fontSize={12}
          />
          <YAxis 
            stroke="#64748B"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Bar 
            dataKey="ventas" 
            fill="#2563EB" 
            name="Ventas (€)"
            radius={[4, 4, 0, 0]}
          />
          {chartData?.[0]?.ordenes && (
            <Bar 
              dataKey="ordenes" 
              fill="#059669" 
              name="Órdenes"
              radius={[4, 4, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const getChartTitle = () => {
    switch (reportType) {
      case 'daily-sales':
        return 'Ventas Diarias';
      case 'hourly-breakdown':
        return 'Desglose por Horas';
      case 'menu-performance':
        return 'Rendimiento del Menú';
      case 'payment-methods':
        return 'Métodos de Pago';
      case 'comparative-analysis':
        return 'Análisis Comparativo';
      default:
        return 'Gráfico de Ventas';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 restaurant-shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {getChartTitle()}
        </h3>
        
        {reportType !== 'payment-methods' && (
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
              iconName="BarChart3"
            >
              Barras
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('line')}
              iconName="TrendingUp"
            >
              Líneas
            </Button>
          </div>
        )}
      </div>
      {/* Chart */}
      <div className="w-full">
        {renderChart()}
      </div>
      {/* Chart Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total de Ventas</p>
          <p className="text-lg font-semibold text-foreground">
            €{chartData?.reduce((sum, item) => sum + (item?.ventas || item?.value || 0), 0)?.toLocaleString()}
          </p>
        </div>
        
        {chartData?.[0]?.ordenes && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total de Órdenes</p>
            <p className="text-lg font-semibold text-foreground">
              {chartData?.reduce((sum, item) => sum + (item?.ordenes || item?.cantidad || 0), 0)}
            </p>
          </div>
        )}
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Promedio por Período</p>
          <p className="text-lg font-semibold text-foreground">
            €{(chartData?.reduce((sum, item) => sum + (item?.ventas || item?.value || 0), 0) / chartData?.length)?.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;