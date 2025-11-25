import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const Card = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
}: CardProps) => {
  const baseStyles = 'rounded-xl bg-white overflow-hidden';

  const variants = {
    default: 'border border-gray-200',
    bordered: 'border-2 border-gray-200',
    elevated: 'shadow-md border border-gray-100',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hover
    ? 'transition-all duration-200 hover:border-brand-gold hover:shadow-lg cursor-pointer'
    : '';

  return (
    <div className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return (
    <div className={`border-b border-gray-200 px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className = '' }: CardBodyProps) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  return (
    <div className={`border-t border-gray-200 px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardBody, CardFooter };
