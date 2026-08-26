import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
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
  return (
    <article className="border-b border-gray-300 py-6 first:pt-0">
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-100">
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
          <div className="flex gap-1">
            <Button onClick={onEdit} size="sm" variant="ghost">
              수정
            </Button>
            <Button onClick={onDelete} size="sm" variant="ghost">
              삭제
            </Button>
          </div>
        )}
      </header>
      <Rating className="mt-5" value={review.rating} />
      <p
        className={`mt-4 text-sm leading-6 whitespace-pre-line text-gray-800 ${expanded ? '' : 'line-clamp-3'}`}
      >
        {review.content}
      </p>
      {onToggleExpanded && (
        <Button
          aria-label={expanded ? '후기 접기' : '후기 펼치기'}
          className="mt-2 px-0 text-base"
          onClick={onToggleExpanded}
          size="sm"
          variant="ghost"
        >
          <span aria-hidden="true">{expanded ? '⌃' : '⌄'}</span>
        </Button>
      )}
      {expanded && (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {review.aromas.map((aroma) => (
              <Chip disabled key={aroma}>
                {aroma}
              </Chip>
            ))}
          </div>
          {review.taste && (
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              {[
                ['바디감', review.taste.lightBold],
                ['탄닌', review.taste.smoothTannic],
                ['당도', review.taste.drySweet],
                ['산미', review.taste.softAcidic],
              ].map(([label, value]) => (
                <div className="flex items-center gap-2" key={label as string}>
                  <span className="w-8 text-gray-600">{label}</span>
                  <span className="grid flex-1 grid-cols-5 gap-0.5">
                    {Array.from({ length: 5 }, (_, index) => (
                      <i
                        className={`h-1.5 rounded-sm ${index < Number(value) ? 'bg-gray-800' : 'bg-gray-200'}`}
                        key={index}
                      />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {onToggleLike && (
        <Button
          aria-label={review.isLiked ? '리뷰 좋아요 취소' : '리뷰 좋아요'}
          aria-pressed={review.isLiked}
          className="mt-5"
          onClick={onToggleLike}
          size="sm"
          variant="secondary"
        >
          {review.isLiked ? '♥' : '♡'} {review.likeCount}
        </Button>
      )}
    </article>
  );
}
