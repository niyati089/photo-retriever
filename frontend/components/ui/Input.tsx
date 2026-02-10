/**
 * Input Component
 * Reusable form input with label, error states, and validation
 */

'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

/**
 * Input component with label and error handling
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, fullWidth = false, className, ...props }, ref) => {
        const hasError = !!error;

        return (
            <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={props.id || props.name}
                        className="text-sm font-medium text-gray-700"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <input
                    ref={ref}
                    className={cn(
                        'px-3 py-2 border rounded-lg w-full transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-offset-1',
                        hasError
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500',
                        'disabled:bg-gray-100 disabled:cursor-not-allowed',
                        className
                    )}
                    {...props}
                />

                {error && (
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-gray-500 mt-1">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
