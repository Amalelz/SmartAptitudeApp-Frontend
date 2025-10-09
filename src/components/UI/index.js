import React from 'react';

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error'
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes} 
      disabled={disabled} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ 
  children, 
  variant = 'default', 
  className = '', 
  hover = true,
  ...props 
}) => {
  const baseClasses = 'card';
  const variantClasses = {
    default: '',
    compact: 'card-compact',
    spacious: 'card-spacious'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Stat Card Component
export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'primary',
  className = '',
  ...props 
}) => {
  const colorClasses = {
    primary: 'stat-card-primary',
    success: 'stat-card-success',
    warning: 'stat-card-warning',
    purple: 'stat-card-purple'
  };

  const classes = [
    'stat-card',
    colorClasses[color],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="bg-gray-100 p-3 rounded-full">
            <span className="text-2xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Badge Component
export const Badge = ({ 
  children, 
  variant = 'primary', 
  className = '',
  ...props 
}) => {
  const baseClasses = 'badge';
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    purple: 'badge-purple'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

// Page Header Component
export const PageHeader = ({ 
  title, 
  subtitle, 
  children, 
  className = '',
  ...props 
}) => {
  const classes = ['page-header', className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="text-lg opacity-90">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
};

// Section Header Component
export const SectionHeader = ({ 
  title, 
  subtitle, 
  children, 
  className = '',
  ...props 
}) => {
  const classes = ['section-header', className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
};

// Form Input Component
export const Input = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input 
        className={`form-input ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Select Component
export const Select = ({ 
  label, 
  options = [], 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <select 
        className={`form-select ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-primary-200 border-t-primary-600 ${sizeClasses[size]} ${className}`}></div>
  );
};

// Progress Bar Component
export const ProgressBar = ({ 
  value, 
  max = 100, 
  color = 'primary', 
  size = 'md',
  showLabel = false,
  className = '' 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colorClasses = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500'
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`${colorClasses[color]} h-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Modal Component
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '' 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} ${className} animate-scale-in`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Alert Component
export const Alert = ({ 
  type = 'info', 
  title, 
  children, 
  onClose,
  className = '' 
}) => {
  const typeClasses = {
    info: 'bg-primary-50 border-primary-200 text-primary-800',
    success: 'bg-success-50 border-success-200 text-success-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    error: 'bg-error-50 border-error-200 text-error-800'
  };

  const iconMap = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <div className={`border rounded-xl p-4 ${typeClasses[type]} ${className}`}>
      <div className="flex items-start">
        <span className="text-lg mr-3">{iconMap[type]}</span>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div>{children}</div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-current opacity-70 hover:opacity-100 ml-3"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default {
  Button,
  Card,
  StatCard,
  Badge,
  PageHeader,
  SectionHeader,
  Input,
  Select,
  LoadingSpinner,
  ProgressBar,
  Modal,
  Alert
};
