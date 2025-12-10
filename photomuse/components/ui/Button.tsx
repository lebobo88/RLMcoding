'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

/**
 * Primary button component with design system styling
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-semibold transition-all duration-fast',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-primary focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950',
          'disabled:opacity-40 disabled:cursor-not-allowed',

          // Variant styles
          variant === 'primary' && [
            'bg-copper-primary text-charcoal-950',
            'hover:bg-copper-light hover:shadow-copper-glow hover:-translate-y-0.5',
            'active:bg-copper-dark active:translate-y-0 active:scale-[0.98]',
          ],
          variant === 'secondary' && [
            'bg-charcoal-800 text-slate-100 border border-charcoal-700',
            'hover:bg-charcoal-700 hover:border-charcoal-600',
            'active:bg-charcoal-900',
          ],
          variant === 'ghost' && [
            'bg-transparent text-slate-300',
            'hover:bg-charcoal-800 hover:text-slate-100',
            'active:bg-charcoal-900',
          ],

          // Size styles
          size === 'sm' && 'px-3 py-1.5 text-body-s rounded-md',
          size === 'md' && 'px-5 py-2.5 text-body-m rounded-lg',
          size === 'lg' && 'px-8 py-4 text-heading-s rounded-xl',

          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner />
            <span>Crafting vision...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Loading spinner for button loading state
 */
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
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
  );
}
