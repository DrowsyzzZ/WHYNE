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
    <article className="rounded-lg border border-gray-300 bg-white p-5 sm:p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-100">
            {review.authorAvatarUrl ? (
              <img alt="" className="size-full object-cover" src={review.authorAvatarUrl} />
            ) : (
              <span aria-hidden="true" className="text-gray-600">●</span>
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
            <Button onClick={onEdit} size="sm" variant="ghost">수정</Button>
            <Button onClick={onDelete} size="sm" variant="ghost">삭제</Button>
          </div>
        )}
      </header>
      <Rating className="mt-5" value={review.rating} />
      <p className={`mt-4 whitespace-pre-line text-sm leading-6 text-gray-800 ${expanded ? '' : 'line-clamp-4'}`}>
        {review.content}
      </p>
      {onToggleExpanded && (
        <Button className="mt-1 px-0" onClick={onToggleExpanded} size="sm" variant="ghost">
          {expanded ? '접기' : '더 보기'}
        </Button>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {review.aromas.map((aroma) => <Chip disabled key={aroma}>{aroma}</Chip>)}
      </div>
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
