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
      className="group relative cursor-pointer rounded-lg bg-white p-4 shadow-card transition-transform hover:-translate-y-1"
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
      <div className="grid aspect-square place-items-center overflow-hidden rounded-md bg-gray-100 p-6">
        <img
          alt={`${wine.name} 와인 병`}
          className="h-full w-full object-contain transition-transform group-hover:scale-105"
          src={wine.imageUrl}
        />
      </div>
      <div className="mt-4">
        <Rating size="sm" value={wine.averageRating} />
        <span className="ml-2 text-xs text-gray-600">리뷰 {wine.reviewCount}개</span>
        <h3 className="mt-2 line-clamp-2 min-h-12 text-base font-semibold leading-6">{wine.name}</h3>
        <p className="mt-1 text-sm text-gray-600">{wine.region}</p>
        <p className="mt-3 font-bold">{wine.price.toLocaleString('ko-KR')}원</p>
      </div>
    </article>
  );
}
