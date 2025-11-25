import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: ReactNode;
  className?: string;
  onDismiss?: () => void;
  icon?: boolean;
}

const Alert = ({
  variant = 'info',
  title,
  children,
  className = '',
  onDismiss,
  icon = true,
}: AlertProps) => {
  const variants = {
    success: {
      container: 'bg-success/10 border-success/20 text-success-dark',
      icon: <CheckCircle className="h-5 w-5 text-success" />,
      title: 'text-success-dark',
    },
    warning: {
      container: 'bg-warning/10 border-warning/20 text-warning-dark',
      icon: <AlertTriangle className="h-5 w-5 text-warning" />,
      title: 'text-warning-dark',
    },
    error: {
      container: 'bg-error/10 border-error/20 text-error-dark',
      icon: <AlertCircle className="h-5 w-5 text-error" />,
      title: 'text-error-dark',
    },
    info: {
      container: 'bg-info/10 border-info/20 text-info-dark',
      icon: <Info className="h-5 w-5 text-info" />,
      title: 'text-info-dark',
    },
  };

  const styles = variants[variant];

  return (
    <div
      className={`rounded-lg border-2 p-4 ${styles.container} ${className}`}
      role="alert"
    >
      <div className="flex gap-3">
        {icon && (
          <div className="flex-shrink-0" aria-hidden="true">
            {styles.icon}
          </div>
        )}
        <div className="flex-1">
          {title && (
            <h3 className={`font-semibold ${styles.title}`}>{title}</h3>
          )}
          <div className={`text-sm ${title ? 'mt-1' : ''}`}>{children}</div>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex-shrink-0 rounded-lg p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
            aria-label="Đóng thông báo"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export { Alert };
