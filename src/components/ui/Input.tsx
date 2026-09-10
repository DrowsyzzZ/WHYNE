import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, hint, id: providedId, label, type, ...props },
  ref,
) {
  const generatedId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const id = providedId ?? generatedId;
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-black" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          aria-describedby={descriptionId}
          aria-invalid={Boolean(error)}
          className={cn(
            'whyne-input min-h-12 w-full rounded-sm border bg-white px-4 text-base text-black',
            'placeholder:text-gray-600 disabled:cursor-not-allowed disabled:bg-gray-100',
            error ? 'border-error' : 'border-gray-300 hover:border-gray-600 focus:border-primary',
            className,
            isPassword && 'pr-14',
          )}
          id={id}
          {...props}
          type={isPassword && showPassword ? 'text' : type}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute top-1 right-1 flex size-10 items-center justify-center rounded-sm text-gray-600 hover:text-primary disabled:cursor-not-allowed"
            aria-label={`${label} ${showPassword ? '숨기기' : '보기'}`}
            aria-pressed={showPassword}
            aria-controls={id}
            disabled={props.disabled}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {showPassword ? (
                <>
                  <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.8 10.8 0 0 1 12 5c7 0 10 7 10 7a17 17 0 0 1-3.1 4.2M6.2 6.2A17.4 17.4 0 0 0 2 12s3 7 10 7a10.9 10.9 0 0 0 5.8-1.8" />
                </>
              ) : (
                <>
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>
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
