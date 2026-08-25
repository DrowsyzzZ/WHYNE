import { cn } from '../../lib/cn';

interface RatingProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function Rating({ className, label, max = 5, size = 'md', value }: RatingProps) {
  const normalizedValue = Math.max(0, Math.min(max, value));
  return (
    <div
      aria-label={label ?? `${max}점 만점에 ${normalizedValue}점`}
      className={cn('inline-flex items-center gap-1', className)}
      role="img"
    >
      {Array.from({ length: max }, (_, index) => (
        <span
          aria-hidden="true"
          className={cn(index < Math.round(normalizedValue) ? 'text-black' : 'text-gray-300', {
            sm: 'text-sm',
            md: 'text-lg',
          }[size])}
          key={index}
        >
          ★
        </span>
      ))}
    </div>
  );
}
