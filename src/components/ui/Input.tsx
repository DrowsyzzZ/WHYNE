import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, hint, id: providedId, label, ...props },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-black" htmlFor={id}>
        {label}
      </label>
      <input
        ref={ref}
        aria-describedby={descriptionId}
        aria-invalid={Boolean(error)}
        className={cn(
          'min-h-12 w-full rounded-sm border bg-white px-4 text-base text-black transition-colors',
          'placeholder:text-gray-600 disabled:cursor-not-allowed disabled:bg-gray-100',
          error
            ? 'border-error pr-11 focus:border-error'
            : 'border-gray-300 hover:border-gray-600 focus:border-primary',
          className,
        )}
        id={id}
        {...props}
      />
      {error ? (
        <p className="text-sm text-error" id={descriptionId} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-gray-600" id={descriptionId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
