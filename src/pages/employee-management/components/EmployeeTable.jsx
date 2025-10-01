import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const EmployeeTable = ({ onEmployeeSelect }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const employeesData = [
    {
      id: 'EMP001',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@spaikrestaurant.com',
      phone: '+34 612 345 678',
      position: 'Chef Ejecutivo',
      department: 'Cocina',
      status: 'active',
      hireDate: '2022-03-15',
      lastReview: '2024-08-15',
      nextReview: '2025-02-15',
      performance: 4.8,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      salary: '€3,200',
      trainingStatus: 'completed'
    },
    {
      id: 'EMP002',
      name: 'María González',
      email: 'maria.gonzalez@spaikrestaurant.com',
      phone: '+34 623 456 789',
      position: 'Gerente de Servicio',
      department: 'Servicio',
      status: 'active',
      hireDate: '2021-11-20',
      lastReview: '2024-07-10',
      nextReview: '2025-01-10',
      performance: 4.6,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      salary: '€2,800',
      trainingStatus: 'in-progress'
    },
    {
      id: 'EMP003',
      name: 'Javier Martínez',
      email: 'javier.martinez@spaikrestaurant.com',
      phone: '+34 634 567 890',
      position: 'Sous Chef',
      department: 'Cocina',
      status: 'active',
      hireDate: '2023-01-10',
      lastReview: '2024-09-05',
      nextReview: '2025-03-05',
      performance: 4.4,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      salary: '€2,400',
      trainingStatus: 'pending'
    },
    {
      id: 'EMP004',
      name: 'Ana López',
      email: 'ana.lopez@spaikrestaurant.com',
      phone: '+34 645 678 901',
      position: 'Camarera Senior',
      department: 'Servicio',
      status: 'active',
      hireDate: '2022-08-05',
      lastReview: '2024-06-20',
      nextReview: '2024-12-20',
      performance: 4.7,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      salary: '€1,800',
      trainingStatus: 'completed'
    },
    {
      id: 'EMP005',
      name: 'Pedro Sánchez',
      email: 'pedro.sanchez@spaikrestaurant.com',
      phone: '+34 656 789 012',
      position: 'Cajero',
      department: 'Administración',
      status: 'probation',
      hireDate: '2024-07-01',
      lastReview: null,
      nextReview: '2024-10-01',
      performance: 3.8,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      salary: '€1,600',
      trainingStatus: 'in-progress'
    },
    {
      id: 'EMP006',
      name: 'Laura Fernández',
      email: 'laura.fernandez@spaikrestaurant.com',
      phone: '+34 667 890 123',
      position: 'Anfitriona',
      department: 'Servicio',
      status: 'on-leave',
      hireDate: '2023-05-15',
      lastReview: '2024-05-15',
      nextReview: '2024-11-15',
      performance: 4.2,
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      salary: '€1,700',
      trainingStatus: 'completed'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Activo', color: 'bg-success/10 text-success' },
      inactive: { label: 'Inactivo', color: 'bg-error/10 text-error' },
      'on-leave': { label: 'En Licencia', color: 'bg-warning/10 text-warning' },
      probation: { label: 'En Prueba', color: 'bg-secondary/10 text-secondary' }
    };

    const config = statusConfig?.[status] || statusConfig?.inactive;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getTrainingBadge = (status) => {
    const trainingConfig = {
      completed: { label: 'Completado', color: 'bg-success/10 text-success', icon: 'CheckCircle' },
      'in-progress': { label: 'En Progreso', color: 'bg-warning/10 text-warning', icon: 'Clock' },
      pending: { label: 'Pendiente', color: 'bg-error/10 text-error', icon: 'AlertCircle' }
    };

    const config = trainingConfig?.[status] || trainingConfig?.pending;
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span>{config?.label}</span>
      </span>
    );
  };

  const getPerformanceStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(<Icon key={i} name="Star" size={14} className="text-warning fill-current" />);
    }

    if (hasHalfStar) {
      stars?.push(<Icon key="half" name="StarHalf" size={14} className="text-warning fill-current" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(<Icon key={`empty-${i}`} name="Star" size={14} className="text-muted-foreground" />);
    }

    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        <span className="text-xs text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = [...employeesData]?.sort((a, b) => {
    if (sortConfig?.key) {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];
      
      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees(prev => 
      prev?.includes(employeeId) 
        ? prev?.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees?.length === employeesData?.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employeesData?.map(emp => emp?.id));
    }
  };

  const SortableHeader = ({ label, sortKey }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="flex items-center space-x-1 text-left font-medium text-muted-foreground hover:text-foreground restaurant-transition"
    >
      <span>{label}</span>
      <Icon 
        name={sortConfig?.key === sortKey && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
        size={16} 
        className={sortConfig?.key === sortKey ? 'text-primary' : 'text-muted-foreground'} 
      />
    </button>
  );

  return (
    <div className="bg-card border border-border rounded-lg restaurant-shadow-sm overflow-hidden">
      {/* Table Header Actions */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-foreground">
              Directorio de Empleados ({employeesData?.length})
            </h3>
            {selectedEmployees?.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedEmployees?.length} seleccionados
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedEmployees?.length > 0 && (
              <>
                <Button variant="outline" size="sm" iconName="Mail">
                  Enviar Email
                </Button>
                <Button variant="outline" size="sm" iconName="Calendar">
                  Asignar Turno
                </Button>
                <Button variant="outline" size="sm" iconName="GraduationCap">
                  Asignar Capacitación
                </Button>
              </>
            )}
            <Button variant="default" iconName="UserPlus">
              Nuevo Empleado
            </Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedEmployees?.length === employeesData?.length}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="px-6 py-3 text-left">
                <SortableHeader label="Empleado" sortKey="name" />
              </th>
              <th className="px-6 py-3 text-left">
                <SortableHeader label="Posición" sortKey="position" />
              </th>
              <th className="px-6 py-3 text-left">
                <SortableHeader label="Departamento" sortKey="department" />
              </th>
              <th className="px-6 py-3 text-left">
                <SortableHeader label="Estado" sortKey="status" />
              </th>
              <th className="px-6 py-3 text-left">
                <SortableHeader label="Rendimiento" sortKey="performance" />
              </th>
              <th className="px-6 py-3 text-left">
                <SortableHeader label="Próxima Revisión" sortKey="nextReview" />
              </th>
              <th className="px-6 py-3 text-left">Capacitación</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedEmployees?.map((employee) => (
              <tr 
                key={employee?.id} 
                className="hover:bg-muted/30 restaurant-transition cursor-pointer"
                onClick={() => onEmployeeSelect?.(employee)}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedEmployees?.includes(employee?.id)}
                    onChange={(e) => {
                      e?.stopPropagation();
                      handleSelectEmployee(employee?.id);
                    }}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={employee?.avatar}
                        alt={employee?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{employee?.name}</div>
                      <div className="text-sm text-muted-foreground">{employee?.email}</div>
                      <div className="text-xs text-muted-foreground">{employee?.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{employee?.position}</div>
                  <div className="text-sm text-muted-foreground">{employee?.salary}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">{employee?.department}</span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(employee?.status)}
                </td>
                <td className="px-6 py-4">
                  {getPerformanceStars(employee?.performance)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">
                    {new Date(employee.nextReview)?.toLocaleDateString('es-ES')}
                  </div>
                  {new Date(employee.nextReview) < new Date() && (
                    <div className="text-xs text-error">Caducada</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {getTrainingBadge(employee?.trainingStatus)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onEmployeeSelect?.(employee);
                      }}
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        console.log('Edit employee:', employee?.id);
                      }}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        console.log('More actions:', employee?.id);
                      }}
                    >
                      <Icon name="MoreHorizontal" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Table Footer */}
      <div className="px-6 py-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {employeesData?.length} de {employeesData?.length} empleados
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="ChevronLeft" disabled>
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">Página 1 de 1</span>
            <Button variant="outline" size="sm" iconName="ChevronRight" disabled>
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;