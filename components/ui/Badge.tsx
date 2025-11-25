import { ReactNode } from 'react';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'navy' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const Badge = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  dot = false,
}: BadgeProps) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-success/10 text-success-dark',
    warning: 'bg-warning/10 text-warning-dark',
    error: 'bg-error/10 text-error-dark',
    info: 'bg-info/10 text-info-dark',
    navy: 'bg-brand-navy text-white',
    gold: 'bg-brand-gold text-brand-navy',
  };

  const dotColors = {
    default: 'bg-gray-500',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
    navy: 'bg-white',
    gold: 'bg-brand-navy',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className={`${dotSizes[size]} ${dotColors[variant]} rounded-full`} />}
      {children}
    </span>
  );
};

export { Badge };
