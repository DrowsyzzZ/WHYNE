import { Button } from '../ui/Button';
import { Rating } from '../ui/Rating';

export interface WineCardData {
  id: string;
  name: string;
  region: string;
  price: number;
  imageUrl: string;
  averageRating: number;
  reviewCount: number;
  latestReview?: string | null;
  isLiked?: boolean;
}

interface WineCardProps {
  wine: WineCardData;
  onOpen: (id: string) => void;
  onToggleLike?: (id: string) => void;
}

export function WineCard({ onOpen, onToggleLike, wine }: WineCardProps) {
  return (
    <article
      className="group relative cursor-pointer bg-white transition-transform hover:-translate-y-1"
      onClick={() => onOpen(wine.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onOpen(wine.id);
      }}
      role="link"
      tabIndex={0}
    >
      {onToggleLike && (
        <Button
          aria-label={wine.isLiked ? `${wine.name} 좋아요 취소` : `${wine.name} 좋아요`}
          aria-pressed={wine.isLiked}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90"
          onClick={(event) => {
            event.stopPropagation();
            onToggleLike(wine.id);
          }}
          onKeyDown={(event) => event.stopPropagation()}
          size="icon"
          variant="ghost"
        >
          <span aria-hidden="true" className={wine.isLiked ? 'text-primary' : 'text-gray-600'}>
            {wine.isLiked ? '♥' : '♡'}
          </span>
        </Button>
      )}
      <div className="grid aspect-square place-items-center overflow-hidden bg-[#f3f3f3] p-6">
        <img
          alt={`${wine.name} 와인 병`}
          className="h-full w-full object-contain transition-transform group-hover:scale-105"
          src={wine.imageUrl}
        />
      </div>
      <div className="mt-5">
        <Rating size="sm" value={wine.averageRating} />
        <span className="ml-2 text-xs text-gray-600">리뷰 {wine.reviewCount}개</span>
        <h3 className="mt-3 line-clamp-2 min-h-14 text-xl font-semibold leading-7">{wine.name}</h3>
        <div className="mt-5 border-t border-gray-300 pt-4"><p className="text-sm font-semibold">최신 후기</p><p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-600">{wine.latestReview ?? '아직 작성된 후기가 없습니다.'}</p></div>
      </div>
    </article>
  );
}
