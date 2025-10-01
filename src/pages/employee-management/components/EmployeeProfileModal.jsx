import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const EmployeeProfileModal = ({ employee, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !employee) return null;

  const tabs = [
    { id: 'overview', label: 'Información General', icon: 'User' },
    { id: 'performance', label: 'Rendimiento', icon: 'TrendingUp' },
    { id: 'training', label: 'Capacitación', icon: 'GraduationCap' },
    { id: 'documents', label: 'Documentos', icon: 'FileText' },
    { id: 'schedule', label: 'Horarios', icon: 'Calendar' }
  ];

  const performanceData = [
    { metric: 'Puntualidad', score: 4.8, trend: 'up' },
    { metric: 'Calidad del Trabajo', score: 4.6, trend: 'up' },
    { metric: 'Trabajo en Equipo', score: 4.7, trend: 'stable' },
    { metric: 'Atención al Cliente', score: 4.9, trend: 'up' },
    { metric: 'Iniciativa', score: 4.3, trend: 'down' }
  ];

  const trainingRecords = [
    {
      course: 'Manipulación de Alimentos',
      status: 'completed',
      completedDate: '2024-08-15',
      score: 95,
      certificate: 'CERT-2024-001'
    },
    {
      course: 'Atención al Cliente Avanzada',
      status: 'in-progress',
      progress: 75,
      dueDate: '2024-10-30'
    },
    {
      course: 'Seguridad e Higiene',
      status: 'pending',
      scheduledDate: '2024-11-15'
    }
  ];

  const documents = [
    { name: 'Contrato de Trabajo', type: 'PDF', uploadDate: '2022-03-15', size: '2.4 MB' },
    { name: 'Certificado Médico', type: 'PDF', uploadDate: '2024-01-10', size: '1.8 MB' },
    { name: 'Evaluación de Desempeño 2024', type: 'PDF', uploadDate: '2024-08-15', size: '3.2 MB' },
    { name: 'Capacitación Completada', type: 'PDF', uploadDate: '2024-08-20', size: '1.5 MB' }
  ];

  const scheduleData = [
    { day: 'Lunes', shift: '08:00 - 16:00', status: 'scheduled' },
    { day: 'Martes', shift: '08:00 - 16:00', status: 'scheduled' },
    { day: 'Miércoles', shift: 'Libre', status: 'off' },
    { day: 'Jueves', shift: '14:00 - 22:00', status: 'scheduled' },
    { day: 'Viernes', shift: '14:00 - 22:00', status: 'scheduled' },
    { day: 'Sábado', shift: '10:00 - 18:00', status: 'scheduled' },
    { day: 'Domingo', shift: 'Libre', status: 'off' }
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

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <Icon name="TrendingUp" size={14} className="text-success" />;
      case 'down':
        return <Icon name="TrendingDown" size={14} className="text-error" />;
      default:
        return <Icon name="Minus" size={14} className="text-muted-foreground" />;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Información Personal</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre Completo"
            value={employee?.name}
            readOnly
          />
          <Input
            label="Email"
            value={employee?.email}
            readOnly
          />
          <Input
            label="Teléfono"
            value={employee?.phone}
            readOnly
          />
          <Input
            label="ID de Empleado"
            value={employee?.id}
            readOnly
          />
          <Input
            label="Fecha de Contratación"
            value={new Date(employee.hireDate)?.toLocaleDateString('es-ES')}
            readOnly
          />
          <Input
            label="Salario"
            value={employee?.salary}
            readOnly
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Contacto de Emergencia</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            value="Carmen Rodríguez"
            readOnly
          />
          <Input
            label="Relación"
            value="Esposa"
            readOnly
          />
          <Input
            label="Teléfono"
            value="+34 687 654 321"
            readOnly
          />
          <Input
            label="Email"
            value="carmen.rodriguez@email.com"
            readOnly
          />
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4">Métricas de Rendimiento</h4>
          <div className="space-y-4">
            {performanceData?.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-foreground">{metric?.metric}</span>
                  {getTrendIcon(metric?.trend)}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)]?.map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={14}
                        className={i < Math.floor(metric?.score) ? 'text-warning fill-current' : 'text-muted-foreground'}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">{metric?.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4">Evaluaciones Recientes</h4>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">Evaluación Anual 2024</span>
                <span className="text-sm text-muted-foreground">15 Ago 2024</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Excelente desempeño en todas las áreas. Demuestra liderazgo y compromiso excepcional.
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">Calificación:</span>
                <div className="flex">
                  {[...Array(5)]?.map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={14}
                      className={i < 5 ? 'text-warning fill-current' : 'text-muted-foreground'}
                    />
                  ))}
                </div>
                <span className="text-sm text-foreground">(4.8/5.0)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrainingTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-foreground">Historial de Capacitación</h4>
        <Button variant="outline" iconName="Plus" size="sm">
          Asignar Curso
        </Button>
      </div>
      
      <div className="space-y-4">
        {trainingRecords?.map((record, index) => (
          <div key={index} className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-foreground">{record?.course}</h5>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                record?.status === 'completed' ? 'bg-success/10 text-success' :
                record?.status === 'in-progress'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
              }`}>
                {record?.status === 'completed' ? 'Completado' :
                 record?.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
              </span>
            </div>
            
            {record?.status === 'completed' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Fecha de Finalización:</span>
                  <div className="font-medium text-foreground">
                    {new Date(record.completedDate)?.toLocaleDateString('es-ES')}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Puntuación:</span>
                  <div className="font-medium text-foreground">{record?.score}%</div>
                </div>
              </div>
            )}
            
            {record?.status === 'in-progress' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progreso:</span>
                  <span className="font-medium text-foreground">{record?.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${record?.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-foreground">Documentos del Empleado</h4>
        <Button variant="outline" iconName="Upload" size="sm">
          Subir Documento
        </Button>
      </div>
      
      <div className="space-y-3">
        {documents?.map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 restaurant-transition">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-error" />
              </div>
              <div>
                <div className="font-medium text-foreground">{doc?.name}</div>
                <div className="text-sm text-muted-foreground">
                  {doc?.type} • {doc?.size} • Subido el {new Date(doc.uploadDate)?.toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Icon name="Download" size={16} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Eye" size={16} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="MoreHorizontal" size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-foreground">Horario Semanal</h4>
        <Button variant="outline" iconName="Edit" size="sm">
          Editar Horario
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {scheduleData?.map((schedule, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-20 font-medium text-foreground">{schedule?.day}</div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                schedule?.status === 'scheduled' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {schedule?.shift}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {schedule?.status === 'scheduled' && (
                <>
                  <span className="text-xs text-success">8 horas</span>
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-muted/30 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">40</div>
            <div className="text-sm text-muted-foreground">Horas/Semana</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">5</div>
            <div className="text-sm text-muted-foreground">Días Laborales</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">2</div>
            <div className="text-sm text-muted-foreground">Días Libres</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'performance':
        return renderPerformanceTab();
      case 'training':
        return renderTrainingTab();
      case 'documents':
        return renderDocumentsTab();
      case 'schedule':
        return renderScheduleTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg restaurant-shadow-modal w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
              <Image
                src={employee?.avatar}
                alt={employee?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{employee?.name}</h2>
              <p className="text-muted-foreground">{employee?.position} • {employee?.department}</p>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge(employee?.status)}
                <span className="text-sm text-muted-foreground">ID: {employee?.id}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`
                  flex items-center space-x-2 py-4 border-b-2 font-medium text-sm restaurant-transition
                  ${activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
          <div className="flex items-center space-x-4">
            <Button variant="outline" iconName="Edit">
              Editar Información
            </Button>
            <Button variant="outline" iconName="Calendar">
              Programar Revisión
            </Button>
            <Button variant="outline" iconName="GraduationCap">
              Asignar Capacitación
            </Button>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileModal;