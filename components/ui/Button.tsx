'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    const variants = {
      primary:
        'bg-brand-gold text-brand-navy shadow-md hover:bg-brand-gold-dark hover:shadow-lg active:shadow-md',
      secondary:
        'bg-brand-navy text-white shadow-md hover:bg-brand-navy-dark hover:shadow-lg active:shadow-md',
      danger:
        'bg-error text-white shadow-md hover:bg-error-dark hover:shadow-lg active:shadow-md',
      ghost:
        'bg-transparent text-brand-navy hover:bg-brand-navy/10 active:bg-brand-navy/20',
      outline:
        'border-2 border-brand-navy bg-transparent text-brand-navy hover:bg-brand-navy hover:text-white active:bg-brand-navy-dark',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5 min-h-[36px]',
      md: 'px-4 py-2.5 text-sm gap-2 min-h-[44px]',
      lg: 'px-6 py-3 text-base gap-2.5 min-h-[52px]',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
