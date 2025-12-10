# TASK-003: Build Core UI Components

**Feature**: Design System
**Priority**: P0
**Estimated Time**: 45 minutes
**Dependencies**: TASK-002

## Description
Create reusable UI components (Button, Card, Input, Modal) following brutalist design system with all 8 states.

## Acceptance Criteria
- [ ] Button component with 4 variants (primary, secondary, ghost, danger)
- [ ] All 8 states implemented (default, hover, focus, active, disabled, loading, error, empty where applicable)
- [ ] Card component for feed items
- [ ] Input component with validation states
- [ ] Modal component with backdrop
- [ ] All components use Tailwind classes from design tokens
- [ ] TypeScript interfaces for all props
- [ ] Accessible (ARIA labels, keyboard nav)

## Implementation

Create `src/components/ui/button.tsx`:
```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', isLoading, className, children, disabled, ...props }, ref) => {
    const baseClasses = 'px-6 py-3 font-bold text-lg transition-all duration-fast';

    const variantClasses = {
      primary: 'bg-amber text-midnight border-2 border-midnight shadow-brutal-md hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1',
      secondary: 'bg-transparent text-silver border-2 border-silver hover:bg-silver hover:text-midnight',
      ghost: 'bg-transparent text-silver hover:text-amber',
      danger: 'bg-crimson text-paper border-2 border-midnight shadow-brutal-md',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

Create similar components for Card, Input, Modal.

## Files Created
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/modal.tsx`
- `src/lib/utils.ts` (for `cn` helper)

---

**Status**: Active
