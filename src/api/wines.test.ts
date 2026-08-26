import { describe, expect, it } from 'vitest';
import { getRecommendedWines } from './wines';

describe('getRecommendedWines', () => {
  it('평점과 리뷰 수 순서로 최대 요청 개수만 반환한다', async () => {
    const wines = await getRecommendedWines(10);
    expect(wines).toHaveLength(10);
    for (let index = 1; index < wines.length; index += 1) {
      const previous = wines[index - 1]!;
      const current = wines[index]!;
      expect(previous.averageRating > current.averageRating
        || (previous.averageRating === current.averageRating && previous.reviewCount >= current.reviewCount)).toBe(true);
    }
  });

  it('요청 개수를 1개에서 10개 사이로 제한한다', async () => {
    await expect(getRecommendedWines(100)).resolves.toHaveLength(10);
    await expect(getRecommendedWines(0)).resolves.toHaveLength(1);
  });
});
