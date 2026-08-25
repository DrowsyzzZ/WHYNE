import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

export function Modal({
  children,
  description,
  isOpen,
  onClose,
  size = 'md',
  title,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid items-end bg-black/55 p-0 sm:place-items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={`max-h-[92dvh] w-full overflow-y-auto rounded-t-xl bg-white p-6 shadow-modal sm:rounded-lg sm:p-8 ${sizeClasses[size]}`}
        role="dialog"
      >
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold" id={titleId}>
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm text-gray-600" id={descriptionId}>
                {description}
              </p>
            )}
          </div>
          <Button aria-label="모달 닫기" onClick={onClose} size="icon" variant="ghost">
            <span aria-hidden="true" className="text-2xl leading-none">
              ×
            </span>
          </Button>
        </header>
        {children}
      </div>
    </div>,
    document.body,
  );
}
