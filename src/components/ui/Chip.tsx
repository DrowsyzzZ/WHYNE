import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  selected?: boolean;
}

export function Chip({ children, className, selected = false, ...props }: ChipProps) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        'touch-target inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors',
        selected
          ? 'border-black bg-black text-white'
          : 'border-gray-300 bg-white text-gray-800 hover:border-gray-600',
        className,
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
