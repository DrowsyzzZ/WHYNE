import wine1 from '../assets/wines/wine-1.png';
import wine2 from '../assets/wines/wine-2.png';
import wine3 from '../assets/wines/wine-3.png';
import wine4 from '../assets/wines/wine-4.png';
import { requireSupabase } from '../lib/supabase';
import type { WineType } from '../types/database';

export interface WineFilters {
  search: string;
  types: WineType[];
  minPrice: number;
  maxPrice: number;
  ratingMin: number | null;
  ratingMax: number | null;
  likedOnly: boolean;
}

export interface WineListItem {
  id: string;
  name: string;
  region: string;
  price: number;
  type: WineType;
  imageUrl: string;
  averageRating: number;
  reviewCount: number;
  latestReview: string | null;
}

export interface WineReview {
  id: string;
  authorNickname: string;
  authorAvatarUrl?: string;
  rating: number;
  content: string;
  aromas: string[];
  likeCount: number;
  createdAt: string;
}

export interface WineDetail extends WineListItem {
  taste: {
    lightBold: number;
    smoothTannic: number;
    drySweet: number;
    softAcidic: number;
  };
  aromas: Array<{ name: string; count: number }>;
  ratingDistribution: number[];
  reviews: WineReview[];
}

const seedImages = [wine1, wine2, wine3, wine4];
const USE_MOCK_CATALOG = true;
const mockLikesByUser = new Map<string, Set<string>>();

const mockTemplates: Array<Pick<WineListItem, 'name' | 'region' | 'price' | 'type'>> = [
  {
    name: 'Sentinel Cabernet Sauvignon',
    region: 'Western Cape, South Africa',
    price: 74000,
    type: 'red',
  },
  {
    name: 'Coastal Sparkling Brut',
    region: 'Coastal Region, South Africa',
    price: 52000,
    type: 'sparkling',
  },
  { name: 'Cape Blanc', region: 'Western Cape, South Africa', price: 43000, type: 'white' },
  { name: 'Reserve Merlot', region: 'Bordeaux, France', price: 68000, type: 'red' },
  { name: 'Estate Chardonnay', region: 'Napa Valley, United States', price: 89000, type: 'white' },
  { name: 'Rosé Sparkling Cuvée', region: 'Champagne, France', price: 126000, type: 'sparkling' },
  { name: 'Old Vine Shiraz', region: 'Barossa Valley, Australia', price: 61000, type: 'red' },
  {
    name: 'Sauvignon Blanc Reserve',
    region: 'Marlborough, New Zealand',
    price: 39000,
    type: 'white',
  },
];

const mockWines: WineListItem[] = Array.from({ length: 32 }, (_, index) => {
  const template = mockTemplates[index % mockTemplates.length] ?? mockTemplates[0]!;
  const vintage = 1992 + index;
  const rating = [4.8, 4.6, 4.3, 4.1, 3.8, 3.6, 3.3, 0][index % 8] ?? 0;
  return {
    id: `mock-wine-${index + 1}`,
    name: `${template.name} ${vintage}`,
    region: template.region,
    price: template.price + Math.floor(index / 8) * 5000,
    type: template.type,
    imageUrl: seedImages[index % seedImages.length] ?? wine1,
    averageRating: rating,
    reviewCount: rating ? 6 + index * 3 : 0,
    latestReview: rating
      ? '균형 잡힌 향과 풍미가 인상적이고 음식과 함께 즐기기 좋은 와인이에요.'
      : null,
  };
});

const mockReviewContents = [
  '첫 모금부터 느껴지는 진한 과실 향과 균형 잡힌 바디감이 인상적이었어요. 식사와 함께 즐기기 좋았습니다.',
  '부드러운 질감 뒤로 은은한 오크와 스파이스가 이어져서 천천히 마시기 좋은 와인이에요.',
  '적당한 산미 덕분에 무겁지 않고, 치즈와 함께했을 때 풍미가 더 잘 살아났습니다.',
];

function createMockReviews(wine: WineListItem): WineReview[] {
  if (!wine.reviewCount) return [];
  return mockReviewContents.map((content, index) => ({
    id: `${wine.id}-review-${index + 1}`,
    authorNickname: ['와인러버', '포도알', '오늘의한잔'][index] ?? '와인러버',
    rating: Math.max(1, Math.round(wine.averageRating) - (index === 2 ? 1 : 0)),
    content,
    aromas:
      index === 0
        ? ['체리', '오크', '바닐라']
        : index === 1
          ? ['블랙베리', '스파이스']
          : ['시트러스', '토스트'],
    likeCount: 8 - index * 2,
    createdAt: `2026-08-${String(20 - index).padStart(2, '0')}T09:00:00.000Z`,
  }));
}

function filterMockWines(filters: WineFilters) {
  const search = filters.search.trim().toLocaleLowerCase();
  return mockWines.filter(
    (wine) =>
      (!search || wine.name.toLocaleLowerCase().includes(search)) &&
      (!filters.types.length || filters.types.includes(wine.type)) &&
      wine.price >= filters.minPrice &&
      wine.price <= filters.maxPrice &&
      (filters.ratingMin === null || wine.averageRating >= filters.ratingMin) &&
      (filters.ratingMax === null || wine.averageRating <= filters.ratingMax),
  );
}

export async function getRecommendedWines(resultLimit = 10): Promise<WineListItem[]> {
  const limit = Math.min(Math.max(resultLimit, 1), 10);
  if (USE_MOCK_CATALOG) {
    return [...mockWines]
      .sort(
        (left, right) =>
          right.averageRating - left.averageRating ||
          right.reviewCount - left.reviewCount ||
          left.id.localeCompare(right.id),
      )
      .slice(0, limit);
  }

  const client = requireSupabase();
  const { data: recommendations, error } = await client.rpc('get_recommended_wines', {
    result_limit: limit,
  });
  if (error) throw error;
  const ids = (recommendations ?? []).map((item) => item.wine_id);
  if (!ids.length) return [];

  const [{ data: wines, error: winesError }, { data: reviews, error: reviewsError }] =
    await Promise.all([
      client.from('wines').select('*').in('id', ids),
      client
        .from('reviews')
        .select('wine_id,content,created_at')
        .in('wine_id', ids)
        .order('created_at', { ascending: false }),
    ]);
  if (winesError) throw winesError;
  if (reviewsError) throw reviewsError;

  const wineById = new Map((wines ?? []).map((wine) => [wine.id, wine]));
  const latestReviewByWine = new Map<string, string>();
  for (const review of reviews ?? [])
    if (!latestReviewByWine.has(review.wine_id))
      latestReviewByWine.set(review.wine_id, review.content);

  return (recommendations ?? []).flatMap((recommendation, index) => {
    const wine = wineById.get(recommendation.wine_id);
    if (!wine) return [];
    return [
      {
        id: wine.id,
        name: wine.name,
        region: wine.region,
        price: wine.price,
        type: wine.type,
        imageUrl: resolveWineImage(wine.image_path, index),
        averageRating: Number(recommendation.average_rating),
        reviewCount: Number(recommendation.review_count),
        latestReview: latestReviewByWine.get(wine.id) ?? null,
      },
    ];
  });
}

export async function getWineDetail(wineId: string): Promise<WineDetail | null> {
  if (USE_MOCK_CATALOG) {
    const wine = mockWines.find((item) => item.id === wineId);
    if (!wine) return null;
    const reviews = createMockReviews(wine);
    const aromaCounts = new Map<string, number>();
    for (const review of reviews)
      for (const aroma of review.aromas) aromaCounts.set(aroma, (aromaCounts.get(aroma) ?? 0) + 1);
    return {
      ...wine,
      taste: { lightBold: 4, smoothTannic: 3, drySweet: 2, softAcidic: 4 },
      aromas: [...aromaCounts].map(([name, count]) => ({ name, count })),
      ratingDistribution: [0, 0, 1, 2, Math.max(0, wine.reviewCount - 3)],
      reviews,
    };
  }

  const client = requireSupabase();
  const [
    { data: wine, error: wineError },
    { data: stat, error: statError },
    { data: reviews, error: reviewsError },
  ] = await Promise.all([
    client.from('wines').select('*').eq('id', wineId).maybeSingle(),
    client.from('wine_stats').select('*').eq('wine_id', wineId).maybeSingle(),
    client
      .from('reviews')
      .select('*')
      .eq('wine_id', wineId)
      .order('created_at', { ascending: false }),
  ]);
  if (wineError) throw wineError;
  if (statError) throw statError;
  if (reviewsError) throw reviewsError;
  if (!wine) return null;

  const authorIds = [...new Set((reviews ?? []).map((review) => review.author_id))];
  const { data: profiles, error: profilesError } = authorIds.length
    ? await client.from('profiles').select('id,nickname,avatar_path').in('id', authorIds)
    : { data: [], error: null };
  if (profilesError) throw profilesError;
  const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  const reviewItems: WineReview[] = (reviews ?? []).map((review) => {
    const profile = profileById.get(review.author_id);
    return {
      id: review.id,
      authorNickname: profile?.nickname ?? '와인러버',
      authorAvatarUrl: profile?.avatar_path ? resolveWineImage(profile.avatar_path, 0) : undefined,
      rating: review.rating,
      content: review.content,
      aromas: review.aromas ?? [],
      likeCount: 0,
      createdAt: review.created_at,
    };
  });
  const aromaCounts = new Map<string, number>();
  const distribution = [0, 0, 0, 0, 0];
  for (const review of reviewItems) {
    distribution[review.rating - 1] = (distribution[review.rating - 1] ?? 0) + 1;
    for (const aroma of review.aromas) aromaCounts.set(aroma, (aromaCounts.get(aroma) ?? 0) + 1);
  }
  return {
    id: wine.id,
    name: wine.name,
    region: wine.region,
    price: wine.price,
    type: wine.type,
    imageUrl: resolveWineImage(wine.image_path, 0),
    averageRating: Number(stat?.average_rating ?? 0),
    reviewCount: Number(stat?.review_count ?? 0),
    latestReview: reviewItems[0]?.content ?? null,
    taste: {
      lightBold: Number(stat?.light_bold ?? 0),
      smoothTannic: Number(stat?.smooth_tannic ?? 0),
      drySweet: Number(stat?.dry_sweet ?? 0),
      softAcidic: Number(stat?.soft_acidic ?? 0),
    },
    aromas: [...aromaCounts].map(([name, count]) => ({ name, count })),
    ratingDistribution: distribution,
    reviews: reviewItems,
  };
}

export async function getLikedWineIds(userId: string): Promise<string[]> {
  if (USE_MOCK_CATALOG) return [...(mockLikesByUser.get(userId) ?? [])];
  const { data, error } = await requireSupabase()
    .from('wine_likes')
    .select('wine_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data ?? []).map((like) => like.wine_id);
}

export async function likeWine(userId: string, wineId: string) {
  if (USE_MOCK_CATALOG) {
    const likes = mockLikesByUser.get(userId) ?? new Set<string>();
    likes.add(wineId);
    mockLikesByUser.set(userId, likes);
    return;
  }
  const { error } = await requireSupabase()
    .from('wine_likes')
    .insert({ user_id: userId, wine_id: wineId });
  if (error && error.code !== '23505') throw error;
}

export async function unlikeWine(userId: string, wineId: string) {
  if (USE_MOCK_CATALOG) {
    mockLikesByUser.get(userId)?.delete(wineId);
    return;
  }
  const { error } = await requireSupabase()
    .from('wine_likes')
    .delete()
    .eq('user_id', userId)
    .eq('wine_id', wineId);
  if (error) throw error;
}

function resolveWineImage(path: string, index: number) {
  if (path.startsWith('seed/')) return seedImages[index % seedImages.length] ?? wine1;
  if (/^https?:\/\//.test(path)) return path;
  return requireSupabase().storage.from('wine-images').getPublicUrl(path).data.publicUrl;
}

export async function getWines(filters: WineFilters): Promise<WineListItem[]> {
  if (USE_MOCK_CATALOG) return filterMockWines(filters);
  const client = requireSupabase();
  let query = client
    .from('wines')
    .select('*')
    .gte('price', filters.minPrice)
    .lte('price', filters.maxPrice)
    .order('created_at', { ascending: false });
  if (filters.search.trim()) query = query.ilike('name', `%${filters.search.trim()}%`);
  if (filters.types.length) query = query.in('type', filters.types);

  const [
    { data: wines, error },
    { data: stats, error: statsError },
    { data: reviews, error: reviewsError },
  ] = await Promise.all([
    query,
    client.from('wine_stats').select('wine_id,average_rating,review_count'),
    client
      .from('reviews')
      .select('wine_id,content,created_at')
      .order('created_at', { ascending: false }),
  ]);
  if (error) throw error;
  if (statsError) throw statsError;
  if (reviewsError) throw reviewsError;

  const statsById = new Map((stats ?? []).map((stat) => [stat.wine_id, stat]));
  const latestReviewByWine = new Map<string, string>();
  for (const review of reviews ?? [])
    if (!latestReviewByWine.has(review.wine_id))
      latestReviewByWine.set(review.wine_id, review.content);
  return (wines ?? [])
    .map((wine, index) => {
      const stat = statsById.get(wine.id);
      return {
        id: wine.id,
        name: wine.name,
        region: wine.region,
        price: wine.price,
        type: wine.type,
        imageUrl: resolveWineImage(wine.image_path, index),
        averageRating: Number(stat?.average_rating ?? 0),
        reviewCount: Number(stat?.review_count ?? 0),
        latestReview: latestReviewByWine.get(wine.id) ?? null,
      };
    })
    .filter(
      (wine) =>
        (filters.ratingMin === null || wine.averageRating >= filters.ratingMin) &&
        (filters.ratingMax === null || wine.averageRating <= filters.ratingMax),
    );
}
