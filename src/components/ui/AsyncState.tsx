import type { ReactNode } from 'react';
import { Button } from './Button';

export function Loading({ label = '불러오는 중' }: { label?: string }) {
  return (
    <div aria-live="polite" className="grid min-h-52 place-items-center text-gray-600" role="status">
      <div className="grid justify-items-center gap-3">
        <span className="size-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span>{label}</span>
      </div>
    </div>
  );
}

interface StateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ action, description, title }: StateProps) {
  return (
    <section className="grid min-h-64 place-items-center rounded-lg bg-gray-100 p-8 text-center">
      <div className="max-w-sm">
        <span aria-hidden="true" className="mx-auto grid size-12 place-items-center rounded-full bg-white text-xl">
          !
        </span>
        <h2 className="mt-4 text-lg font-bold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </section>
  );
}

export function ErrorState({
  description = '잠시 후 다시 시도해 주세요.',
  onRetry,
  title = '정보를 불러오지 못했어요',
}: {
  description?: string;
  onRetry?: () => void;
  title?: string;
}) {
  return (
    <EmptyState
      action={onRetry ? <Button onClick={onRetry}>다시 시도</Button> : undefined}
      description={description}
      title={title}
    />
  );
}
