import { useState } from 'react';
import { getAromaIcon } from '../../features/wines/aromaIconAssets';
import { Rating } from '../ui/Rating';

export interface ReviewCardData {
  id: string;
  authorNickname: string;
  authorAvatarUrl?: string;
  rating: number;
  content: string;
  aromas: string[];
  likeCount: number;
  isLiked?: boolean;
  isOwner?: boolean;
  createdAt: string;
  taste?: { lightBold: number; smoothTannic: number; drySweet: number; softAcidic: number };
}

interface ReviewCardProps {
  review: ReviewCardData;
  expanded?: boolean;
  onToggleExpanded?: () => void;
  onToggleLike?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ReviewCard({
  expanded = false,
  onDelete,
  onEdit,
  onToggleExpanded,
  onToggleLike,
  review,
}: ReviewCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <article className="border-b border-gray-300 py-7 first:pt-0">
      <Rating className="mb-5" value={review.rating} />
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-100">
            {review.authorAvatarUrl ? (
              <img alt="" className="size-full object-cover" src={review.authorAvatarUrl} />
            ) : (
              <span aria-hidden="true" className="text-gray-600">
                ●
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{review.authorNickname}</p>
            <time className="text-xs text-gray-600" dateTime={review.createdAt}>
              {new Intl.DateTimeFormat('ko-KR').format(new Date(review.createdAt))}
            </time>
          </div>
        </div>
        {review.isOwner && (
          <div className="relative">
            <button
              aria-expanded={isMenuOpen}
              aria-label="리뷰 작업 메뉴"
              className="grid size-10 place-items-center rounded-full text-xl text-gray-600 hover:bg-gray-100"
              onClick={() => setIsMenuOpen((open) => !open)}
              type="button"
            >
              <span aria-hidden="true">⋮</span>
            </button>
            {isMenuOpen && (
              <div className="absolute top-10 right-0 z-10 w-28 overflow-hidden rounded-md border border-gray-300 bg-white py-1 shadow-modal">
                <button
                  className="min-h-10 w-full px-4 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEdit?.();
                  }}
                  type="button"
                >
                  수정하기
                </button>
                <button
                  className="min-h-10 w-full px-4 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDelete?.();
                  }}
                  type="button"
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        )}
      </header>
      {review.aromas.length > 0 && (
        <ul className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-3 text-sm text-gray-600">
          {review.aromas.map((aroma, index) => (
            <li className="flex items-center gap-2" key={aroma}>
              {index > 0 && <span aria-hidden="true">·</span>}
              <img alt="" className="size-5 object-contain" src={getAromaIcon(aroma)} />
              <span>{aroma}</span>
            </li>
          ))}
        </ul>
      )}
      <p
        className={`mt-5 text-sm leading-6 whitespace-pre-line text-gray-800 ${expanded ? '' : 'line-clamp-3'}`}
      >
        {review.content}
      </p>
      {expanded && review.taste && (
        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 tablet:grid-cols-2">
          {(
            [
              ['바디감', review.taste.lightBold],
              ['탄닌', review.taste.smoothTannic],
              ['당도', review.taste.drySweet],
              ['산미', review.taste.softAcidic],
            ] as const
          ).map(([label, value]) => (
            <div className="grid grid-cols-[48px_1fr] items-center gap-3 text-xs" key={label}>
              <span className="rounded bg-gray-100 px-1.5 py-1 text-center text-gray-600">
                {label}
              </span>
              <span className="grid grid-cols-5 gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <i
                    className={`h-2 rounded-sm ${index < value ? 'bg-gray-800' : 'bg-gray-200'}`}
                    key={index}
                  />
                ))}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="relative mt-6 flex min-h-10 items-center">
        {onToggleLike && (
          <button
            aria-label={review.isLiked ? '리뷰 좋아요 취소' : '리뷰 좋아요'}
            aria-pressed={review.isLiked}
            className={`inline-flex min-h-10 items-center gap-2 rounded-md border px-3 transition-colors ${review.isLiked ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 bg-white text-gray-600 hover:border-primary hover:text-primary'}`}
            onClick={onToggleLike}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="size-5"
              fill={review.isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>
            <span>{review.likeCount}</span>
          </button>
        )}
        {onToggleExpanded && (
          <button
            aria-label={expanded ? '후기 접기' : '후기 펼치기'}
            className="absolute left-1/2 grid size-10 -translate-x-1/2 place-items-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary"
            onClick={onToggleExpanded}
            type="button"
          >
            <svg
              aria-hidden="true"
              className={`size-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
}
