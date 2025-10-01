import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for different user roles
  const mockCredentials = [
    { username: 'admin@spaikrestaurant.com', password: 'admin123', role: 'admin', name: 'Carlos Administrador' },
    { username: 'gerente@spaikrestaurant.com', password: 'gerente123', role: 'manager', name: 'María Gerente' },
    { username: 'cajero@spaikrestaurant.com', password: 'cajero123', role: 'cashier', name: 'Juan Cajero' },
    { username: 'anfitrion@spaikrestaurant.com', password: 'anfitrion123', role: 'host', name: 'Ana Anfitriona' },
    { username: 'cocina@spaikrestaurant.com', password: 'cocina123', role: 'kitchen', name: 'Pedro Cocinero' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.username?.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    } else if (!formData?.username?.includes('@')) {
      newErrors.username = 'Ingrese un email válido';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const user = mockCredentials?.find(
        cred => cred?.username === formData?.username && cred?.password === formData?.password
      );

      if (user) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({
          id: Date.now(),
          name: user?.name,
          email: user?.username,
          role: user?.role,
          loginTime: new Date()?.toISOString()
        }));

        if (formData?.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        // Navigate based on user role
        switch (user?.role) {
          case 'admin': case'manager': navigate('/sales-reports');
            break;
          case 'cashier': navigate('/point-of-sale');
            break;
          case 'host': navigate('/table-reservations');
            break;
          case 'kitchen': navigate('/kitchen-orders');
            break;
          default:
            navigate('/point-of-sale');
        }
      } else {
        setErrors({
          general: 'Credenciales incorrectas. Verifique su usuario y contraseña.'
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    // Mock forgot password functionality
    alert('Se ha enviado un enlace de recuperación a su correo electrónico.');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username/Email Field */}
        <Input
          label="Correo Electrónico"
          type="email"
          name="username"
          placeholder="usuario@spaikrestaurant.com"
          value={formData?.username}
          onChange={handleInputChange}
          error={errors?.username}
          required
          className="w-full"
        />

        {/* Password Field */}
        <div className="relative">
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Ingrese su contraseña"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            className="w-full pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground restaurant-transition"
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
          </button>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between">
          <Checkbox
            label="Recordarme"
            name="rememberMe"
            checked={formData?.rememberMe}
            onChange={handleInputChange}
          />
          
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 restaurant-transition"
          >
            ¿Olvidó su contraseña?
          </button>
        </div>

        {/* General Error Message */}
        {errors?.general && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <span className="text-sm text-error">{errors?.general}</span>
            </div>
          </div>
        )}

        {/* Login Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          loading={isLoading}
          iconName="LogIn"
          iconPosition="right"
          className="w-full"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;