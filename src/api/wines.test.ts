import { describe, expect, it } from 'vitest';
import {
  createReview,
  deleteReview,
  getLikedWineIds,
  getRecommendedWines,
  getWineDetail,
  likeWine,
  toggleReviewLike,
  unlikeWine,
  updateReview,
} from './wines';

describe('getRecommendedWines', () => {
  it('평점과 리뷰 수 순서로 최대 요청 개수만 반환한다', async () => {
    const wines = await getRecommendedWines(10);
    expect(wines).toHaveLength(10);
    for (let index = 1; index < wines.length; index += 1) {
      const previous = wines[index - 1]!;
      const current = wines[index]!;
      expect(
        previous.averageRating > current.averageRating ||
          (previous.averageRating === current.averageRating &&
            previous.reviewCount >= current.reviewCount),
      ).toBe(true);
    }
  });

  it('요청 개수를 1개에서 10개 사이로 제한한다', async () => {
    await expect(getRecommendedWines(100)).resolves.toHaveLength(10);
    await expect(getRecommendedWines(0)).resolves.toHaveLength(1);
  });
});

describe('wine likes', () => {
  it('같은 와인을 중복 없이 저장하고 삭제한다', async () => {
    const userId = 'mock-like-user';
    await likeWine(userId, 'mock-wine-1');
    await likeWine(userId, 'mock-wine-1');
    await expect(getLikedWineIds(userId)).resolves.toEqual(['mock-wine-1']);
    await unlikeWine(userId, 'mock-wine-1');
    await expect(getLikedWineIds(userId)).resolves.toEqual([]);
  });
});

describe('review mutations', () => {
  const input = {
    rating: 5,
    content: '테스트 리뷰입니다.',
    lightBold: 4,
    smoothTannic: 3,
    drySweet: 2,
    softAcidic: 4,
    aromas: ['체리'],
  };

  it('리뷰 작성·수정·좋아요·삭제 결과가 상세 조회에 반영된다', async () => {
    const userId = 'mock-review-user';
    const review = await createReview('mock-wine-1', userId, '테스터', input);
    let detail = await getWineDetail('mock-wine-1', userId);
    expect(detail?.reviews[0]).toMatchObject({
      id: review.id,
      content: input.content,
      isOwner: true,
    });

    await updateReview(review.id, userId, { ...input, rating: 4, content: '수정된 리뷰입니다.' });
    await toggleReviewLike(review.id, userId, false);
    detail = await getWineDetail('mock-wine-1', userId);
    expect(detail?.reviews.find((item) => item.id === review.id)).toMatchObject({
      rating: 4,
      content: '수정된 리뷰입니다.',
      isLiked: true,
      likeCount: 1,
    });

    await deleteReview(review.id, userId);
    detail = await getWineDetail('mock-wine-1', userId);
    expect(detail?.reviews.some((item) => item.id === review.id)).toBe(false);
  });
});
