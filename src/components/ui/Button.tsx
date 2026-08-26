import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-gray-100 hover:bg-primary-hover disabled:bg-gray-300',
  secondary: 'border border-gray-300 bg-white text-black hover:bg-gray-100',
  dark: 'bg-black text-white hover:bg-gray-800',
  ghost: 'bg-transparent text-black hover:bg-gray-100',
  danger: 'bg-error text-white hover:brightness-95',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 text-sm',
  md: 'min-h-12 px-6 text-base',
  icon: 'touch-target p-2',
};

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-70',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      <span>{isLoading ? '처리 중' : children}</span>
    </button>
  );
}
