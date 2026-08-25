import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Logo({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('inline-block text-xl font-extrabold tracking-[-0.06em]', className)}
      {...props}
    >
      WHYNE
    </span>
  );
}
