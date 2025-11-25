'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className={`
                peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300
                bg-white transition-colors duration-200
                checked:border-brand-gold checked:bg-brand-gold
                hover:border-brand-gold/50
                focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2
                disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200
                ${error ? 'border-error' : ''}
                ${className}
              `}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${checkboxId}-error` : description ? `${checkboxId}-description` : undefined}
              {...props}
            />
            <Check className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-brand-navy opacity-0 peer-checked:opacity-100" />
          </div>
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={checkboxId}
                className="cursor-pointer text-sm font-medium text-gray-700"
              >
                {label}
              </label>
            )}
            {description && (
              <p id={`${checkboxId}-description`} className="text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>
        )}
        {error && (
          <p id={`${checkboxId}-error`} className="mt-1 text-sm text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
