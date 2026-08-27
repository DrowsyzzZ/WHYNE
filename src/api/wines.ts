import crimesCabernet from '../assets/wines/seed-12/19-crimes-cabernet-sauvignon.webp';
import diabloPinot from '../assets/wines/seed-12/diablo-pinot-noir.webp';
import essayCabernet from '../assets/wines/seed-12/essay-cabernet-sauvignon.webp';
import g7Chardonnay from '../assets/wines/seed-12/g7-chardonnay.webp';
import greenBaySauvignon from '../assets/wines/seed-12/green-bay-sauvignon-blanc.webp';
import iterChardonnay from '../assets/wines/seed-12/iter-chardonnay.webp';
import losMonterosCava from '../assets/wines/seed-12/los-monteros-cava-brut.webp';
import mvsaCava from '../assets/wines/seed-12/mvsa-cava-brut.webp';
import orchardLaneSauvignon from '../assets/wines/seed-12/orchard-lane-sauvignon-blanc.webp';
import puritaMoscato from '../assets/wines/seed-12/purita-moscato-dasti.webp';
import submissionCabernet from '../assets/wines/seed-12/submission-cabernet-sauvignon.webp';
import valhondoCava from '../assets/wines/seed-12/valhondo-cava-brut.webp';
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
  ownerId?: string;
  name: string;
  region: string;
  price: number;
  type: WineType;
  imageUrl: string;
  averageRating: number;
  reviewCount: number;
  latestReview: string | null;
}

export interface WineInput {
  name: string;
  price: number;
  type: WineType;
  region: string;
  image?: File;
}

export interface WineReview {
  id: string;
  authorId: string;
  authorNickname: string;
  authorAvatarUrl?: string;
  rating: number;
  content: string;
  aromas: string[];
  likeCount: number;
  createdAt: string;
  taste: { lightBold: number; smoothTannic: number; drySweet: number; softAcidic: number };
  isLiked?: boolean;
  isOwner?: boolean;
}

export interface ReviewInput {
  rating: number;
  content: string;
  lightBold: number;
  smoothTannic: number;
  drySweet: number;
  softAcidic: number;
  aromas: string[];
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

export interface MyReview extends WineReview {
  wineId: string;
  wineImageUrl: string;
  wineName: string;
  wineRegion: string;
}

const USE_MOCK_CATALOG =
  import.meta.env.MODE === 'test' || import.meta.env.VITE_USE_MOCK_CATALOG === 'true';
const mockLikesByUser = new Map<string, Set<string>>();
const mockReviewLikesByUser = new Map<string, Set<string>>();
const mockReviewsByWine = new Map<string, WineReview[]>();

const mockWines: WineListItem[] = [
  ['Submission Cabernet Sauvignon', 'Napa Valley, United States', 21000, 'red', submissionCabernet],
  ['Diablo Pinot Noir', 'Rapel Valley, Chile', 13000, 'red', diabloPinot],
  [
    '19 Crimes Cabernet Sauvignon',
    'South Eastern Australia, Australia',
    26000,
    'red',
    crimesCabernet,
  ],
  ['ESSAY Cabernet Sauvignon', 'Western Cape, South Africa', 14900, 'red', essayCabernet],
  ['G7 Chardonnay', 'Maule Valley, Chile', 9700, 'white', g7Chardonnay],
  ['Iter Chardonnay', 'California, United States', 18000, 'white', iterChardonnay],
  ['Green Bay Sauvignon Blanc', 'Marlborough, New Zealand', 21000, 'white', greenBaySauvignon],
  [
    'Orchard Lane Sauvignon Blanc',
    'Marlborough, New Zealand',
    19900,
    'white',
    orchardLaneSauvignon,
  ],
  ['Mvsa Cava Brut', 'Cava, Spain', 25000, 'sparkling', mvsaCava],
  ['Valhondo Cava Brut', 'Spain', 10900, 'sparkling', valhondoCava],
  ['Los Monteros Cava Brut', 'Cava, Spain', 19900, 'sparkling', losMonterosCava],
  ["Purita Moscato D'Asti", 'Piedmont, Italy', 19900, 'sparkling', puritaMoscato],
].map(([name, region, price, type, imageUrl], index) => ({
  id: `mock-wine-${index + 1}`,
  name: name as string,
  region: region as string,
  price: price as number,
  type: type as WineType,
  imageUrl: imageUrl as string,
  averageRating: [4.8, 4.6, 4.5, 4.3, 4.2, 4.1, 3.9, 3.8, 4.7, 4.4, 4.0, 4.6][index] ?? 0,
  reviewCount: 3,
  latestReview: '기능 검증을 위해 작성된 임시 후기입니다.',
}));

const mockReviewContents = [
  '첫 모금부터 느껴지는 진한 과실 향과 균형 잡힌 바디감이 인상적이었어요. 식사와 함께 즐기기 좋았습니다.',
  '부드러운 질감 뒤로 은은한 오크와 스파이스가 이어져서 천천히 마시기 좋은 와인이에요.',
  '적당한 산미 덕분에 무겁지 않고, 치즈와 함께했을 때 풍미가 더 잘 살아났습니다.',
];

function createMockReviews(wine: WineListItem): WineReview[] {
  if (!wine.reviewCount) return [];
  return mockReviewContents.map((content, index) => ({
    id: `${wine.id}-review-${index + 1}`,
    authorId: `mock-author-${index + 1}`,
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
    taste: { lightBold: 4 - index, smoothTannic: 3, drySweet: 2 + index, softAcidic: 4 },
  }));
}

function getMockReviews(wine: WineListItem) {
  const existing = mockReviewsByWine.get(wine.id);
  if (existing) return existing;
  const reviews = createMockReviews(wine);
  mockReviewsByWine.set(wine.id, reviews);
  return reviews;
}

function averageTaste(reviews: WineReview[]) {
  if (!reviews.length) return { lightBold: 0, smoothTannic: 0, drySweet: 0, softAcidic: 0 };
  const average = (key: keyof WineReview['taste']) =>
    reviews.reduce((sum, review) => sum + review.taste[key], 0) / reviews.length;
  return {
    lightBold: average('lightBold'),
    smoothTannic: average('smoothTannic'),
    drySweet: average('drySweet'),
    softAcidic: average('softAcidic'),
  };
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

  return (recommendations ?? []).flatMap((recommendation) => {
    const wine = wineById.get(recommendation.wine_id);
    if (!wine) return [];
    return [
      {
        id: wine.id,
        name: wine.name,
        region: wine.region,
        price: wine.price,
        type: wine.type,
        imageUrl: resolveWineImage(wine.image_path),
        averageRating: Number(recommendation.average_rating),
        reviewCount: Number(recommendation.review_count),
        latestReview: latestReviewByWine.get(wine.id) ?? null,
      },
    ];
  });
}

export async function getWineDetail(wineId: string, userId?: string): Promise<WineDetail | null> {
  if (USE_MOCK_CATALOG) {
    const wine = mockWines.find((item) => item.id === wineId);
    if (!wine) return null;
    const reviews = getMockReviews(wine).map((review) => ({
      ...review,
      isOwner: review.authorId === userId,
      isLiked: userId ? mockReviewLikesByUser.get(userId)?.has(review.id) : false,
    }));
    const aromaCounts = new Map<string, number>();
    for (const review of reviews)
      for (const aroma of review.aromas) aromaCounts.set(aroma, (aromaCounts.get(aroma) ?? 0) + 1);
    return {
      ...wine,
      averageRating: reviews.length
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0,
      reviewCount: reviews.length,
      taste: averageTaste(reviews),
      aromas: [...aromaCounts]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
      ratingDistribution: [1, 2, 3, 4, 5].map(
        (rating) => reviews.filter((review) => review.rating === rating).length,
      ),
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

  const reviewIds = (reviews ?? []).map((review) => review.id);
  const { data: reviewLikes, error: reviewLikesError } = reviewIds.length
    ? await client.from('review_likes').select('review_id,user_id').in('review_id', reviewIds)
    : { data: [], error: null };
  if (reviewLikesError) throw reviewLikesError;
  const reviewLikeCounts = new Map<string, number>();
  for (const like of reviewLikes ?? [])
    reviewLikeCounts.set(like.review_id, (reviewLikeCounts.get(like.review_id) ?? 0) + 1);

  const reviewItems: WineReview[] = (reviews ?? []).map((review) => {
    const profile = profileById.get(review.author_id);
    return {
      id: review.id,
      authorId: review.author_id,
      authorNickname: profile?.nickname ?? '와인러버',
      authorAvatarUrl: profile?.avatar_path
        ? resolveWineImage(profile.avatar_path, 'avatars')
        : undefined,
      rating: review.rating,
      content: review.content,
      aromas: review.aromas ?? [],
      likeCount: reviewLikeCounts.get(review.id) ?? 0,
      createdAt: review.created_at,
      taste: {
        lightBold: review.light_bold,
        smoothTannic: review.smooth_tannic,
        drySweet: review.dry_sweet,
        softAcidic: review.soft_acidic,
      },
      isOwner: review.author_id === userId,
      isLiked: Boolean(
        userId &&
        reviewLikes?.some((like) => like.review_id === review.id && like.user_id === userId),
      ),
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
    imageUrl: resolveWineImage(wine.image_path),
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

export async function createReview(
  wineId: string,
  authorId: string,
  nickname: string,
  input: ReviewInput,
) {
  if (USE_MOCK_CATALOG) {
    const wine = mockWines.find((item) => item.id === wineId);
    if (!wine) throw new Error('와인을 찾을 수 없습니다.');
    const review: WineReview = {
      id: `mock-review-${crypto.randomUUID()}`,
      authorId,
      authorNickname: nickname,
      rating: input.rating,
      content: input.content,
      aromas: input.aromas,
      likeCount: 0,
      createdAt: new Date().toISOString(),
      taste: {
        lightBold: input.lightBold,
        smoothTannic: input.smoothTannic,
        drySweet: input.drySweet,
        softAcidic: input.softAcidic,
      },
    };
    getMockReviews(wine).unshift(review);
    return review;
  }
  const { data, error } = await requireSupabase()
    .from('reviews')
    .insert({
      wine_id: wineId,
      author_id: authorId,
      rating: input.rating,
      content: input.content,
      light_bold: input.lightBold,
      smooth_tannic: input.smoothTannic,
      dry_sweet: input.drySweet,
      soft_acidic: input.softAcidic,
      aromas: input.aromas,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateReview(reviewId: string, authorId: string, input: ReviewInput) {
  if (USE_MOCK_CATALOG) {
    for (const reviews of mockReviewsByWine.values()) {
      const review = reviews.find((item) => item.id === reviewId && item.authorId === authorId);
      if (review) {
        Object.assign(review, {
          rating: input.rating,
          content: input.content,
          aromas: input.aromas,
          taste: {
            lightBold: input.lightBold,
            smoothTannic: input.smoothTannic,
            drySweet: input.drySweet,
            softAcidic: input.softAcidic,
          },
        });
        return review;
      }
    }
    throw new Error('수정할 리뷰를 찾을 수 없습니다.');
  }
  const { error } = await requireSupabase()
    .from('reviews')
    .update({
      rating: input.rating,
      content: input.content,
      light_bold: input.lightBold,
      smooth_tannic: input.smoothTannic,
      dry_sweet: input.drySweet,
      soft_acidic: input.softAcidic,
      aromas: input.aromas,
    })
    .eq('id', reviewId)
    .eq('author_id', authorId);
  if (error) throw error;
}

export async function deleteReview(reviewId: string, authorId: string) {
  if (USE_MOCK_CATALOG) {
    for (const reviews of mockReviewsByWine.values()) {
      const index = reviews.findIndex((item) => item.id === reviewId && item.authorId === authorId);
      if (index >= 0) {
        reviews.splice(index, 1);
        return;
      }
    }
    throw new Error('삭제할 리뷰를 찾을 수 없습니다.');
  }
  const { error } = await requireSupabase()
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('author_id', authorId);
  if (error) throw error;
}

export async function toggleReviewLike(reviewId: string, userId: string, isLiked: boolean) {
  if (USE_MOCK_CATALOG) {
    const likes = mockReviewLikesByUser.get(userId) ?? new Set<string>();
    if (isLiked) likes.delete(reviewId);
    else likes.add(reviewId);
    mockReviewLikesByUser.set(userId, likes);
    for (const reviews of mockReviewsByWine.values()) {
      const review = reviews.find((item) => item.id === reviewId);
      if (review) review.likeCount = Math.max(0, review.likeCount + (isLiked ? -1 : 1));
    }
    return;
  }
  const client = requireSupabase();
  const { error } = isLiked
    ? await client.from('review_likes').delete().eq('review_id', reviewId).eq('user_id', userId)
    : await client.from('review_likes').insert({ review_id: reviewId, user_id: userId });
  if (error && error.code !== '23505') throw error;
}

export async function createWine(ownerId: string, input: WineInput) {
  if (!input.image) throw new Error('와인 이미지를 선택해주세요.');
  if (USE_MOCK_CATALOG) {
    const wine: WineListItem = {
      id: `mock-wine-${crypto.randomUUID()}`,
      ownerId,
      name: input.name,
      price: input.price,
      type: input.type,
      region: input.region,
      imageUrl: URL.createObjectURL(input.image),
      averageRating: 0,
      reviewCount: 0,
      latestReview: null,
    };
    mockWines.unshift(wine);
    return wine;
  }
  const client = requireSupabase();
  const imagePath = `${ownerId}/${crypto.randomUUID()}-${input.image.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const { error: uploadError } = await client.storage
    .from('wine-images')
    .upload(imagePath, input.image, { contentType: input.image.type, upsert: false });
  if (uploadError) throw uploadError;
  const { data, error } = await client
    .from('wines')
    .insert({
      owner_id: ownerId,
      name: input.name,
      price: input.price,
      type: input.type,
      region: input.region,
      image_path: imagePath,
    })
    .select()
    .single();
  if (error) {
    await client.storage.from('wine-images').remove([imagePath]);
    throw error;
  }
  return data;
}

export async function updateWine(wineId: string, ownerId: string, input: WineInput) {
  if (USE_MOCK_CATALOG) {
    const wine = mockWines.find((item) => item.id === wineId && item.ownerId === ownerId);
    if (!wine) throw new Error('수정할 와인을 찾을 수 없습니다.');
    Object.assign(wine, {
      name: input.name,
      price: input.price,
      type: input.type,
      region: input.region,
      ...(input.image ? { imageUrl: URL.createObjectURL(input.image) } : {}),
    });
    return wine;
  }
  const client = requireSupabase();
  const { data: current, error: currentError } = await client
    .from('wines')
    .select('image_path')
    .eq('id', wineId)
    .eq('owner_id', ownerId)
    .single();
  if (currentError) throw currentError;
  let imagePath = current.image_path;
  if (input.image) {
    const nextPath = `${ownerId}/${crypto.randomUUID()}-${input.image.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const { error: uploadError } = await client.storage
      .from('wine-images')
      .upload(nextPath, input.image, { contentType: input.image.type });
    if (uploadError) throw uploadError;
    imagePath = nextPath;
  }
  const { error } = await client
    .from('wines')
    .update({
      name: input.name,
      price: input.price,
      type: input.type,
      region: input.region,
      image_path: imagePath,
    })
    .eq('id', wineId)
    .eq('owner_id', ownerId);
  if (error) throw error;
  if (input.image && current.image_path)
    await client.storage.from('wine-images').remove([current.image_path]);
}

export async function deleteWine(wineId: string, ownerId: string) {
  if (USE_MOCK_CATALOG) {
    const index = mockWines.findIndex((item) => item.id === wineId && item.ownerId === ownerId);
    if (index < 0) throw new Error('삭제할 와인을 찾을 수 없습니다.');
    mockWines.splice(index, 1);
    mockReviewsByWine.delete(wineId);
    return;
  }
  const client = requireSupabase();
  const { data: wine, error: selectError } = await client
    .from('wines')
    .select('image_path')
    .eq('id', wineId)
    .eq('owner_id', ownerId)
    .single();
  if (selectError) throw selectError;
  const { error } = await client.from('wines').delete().eq('id', wineId).eq('owner_id', ownerId);
  if (error) throw error;
  if (wine.image_path) await client.storage.from('wine-images').remove([wine.image_path]);
}

export async function getMyWines(ownerId: string): Promise<WineListItem[]> {
  if (USE_MOCK_CATALOG) return mockWines.filter((wine) => wine.ownerId === ownerId);
  const client = requireSupabase();
  const { data, error } = await client
    .from('wines')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((wine) => ({
    id: wine.id,
    ownerId: wine.owner_id,
    name: wine.name,
    price: wine.price,
    type: wine.type,
    region: wine.region,
    imageUrl: resolveWineImage(wine.image_path),
    averageRating: 0,
    reviewCount: 0,
    latestReview: null,
  }));
}

export async function getMyReviews(authorId: string): Promise<MyReview[]> {
  if (USE_MOCK_CATALOG) {
    const result: MyReview[] = [];
    for (const [wineId, reviews] of mockReviewsByWine) {
      const wine = mockWines.find((item) => item.id === wineId);
      for (const review of reviews)
        if (review.authorId === authorId)
          result.push({
            ...review,
            wineId,
            wineImageUrl: wine?.imageUrl ?? submissionCabernet,
            wineName: wine?.name ?? '와인',
            wineRegion: wine?.region ?? '',
          });
    }
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const client = requireSupabase();
  const { data, error } = await client
    .from('reviews')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  const wineIds = [...new Set((data ?? []).map((review) => review.wine_id))];
  const reviewIds = (data ?? []).map((review) => review.id);
  const [{ data: wines, error: winesError }, { data: likes, error: likesError }] =
    await Promise.all([
      wineIds.length
        ? client.from('wines').select('id,name,region,image_path').in('id', wineIds)
        : Promise.resolve({ data: [], error: null }),
      reviewIds.length
        ? client.from('review_likes').select('review_id,user_id').in('review_id', reviewIds)
        : Promise.resolve({ data: [], error: null }),
    ]);
  if (winesError) throw winesError;
  if (likesError) throw likesError;
  const winesById = new Map((wines ?? []).map((wine) => [wine.id, wine]));
  const likeCounts = new Map<string, number>();
  for (const like of likes ?? [])
    likeCounts.set(like.review_id, (likeCounts.get(like.review_id) ?? 0) + 1);
  return (data ?? []).map((review) => ({
    id: review.id,
    authorId: review.author_id,
    authorNickname: '나',
    rating: review.rating,
    content: review.content,
    aromas: review.aromas,
    likeCount: likeCounts.get(review.id) ?? 0,
    isLiked: (likes ?? []).some(
      (like) => like.review_id === review.id && like.user_id === authorId,
    ),
    createdAt: review.created_at,
    taste: {
      lightBold: review.light_bold,
      smoothTannic: review.smooth_tannic,
      drySweet: review.dry_sweet,
      softAcidic: review.soft_acidic,
    },
    isOwner: true,
    wineId: review.wine_id,
    wineImageUrl: winesById.get(review.wine_id)?.image_path
      ? resolveWineImage(winesById.get(review.wine_id)!.image_path)
      : submissionCabernet,
    wineName: winesById.get(review.wine_id)?.name ?? '와인',
    wineRegion: winesById.get(review.wine_id)?.region ?? '',
  }));
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

function resolveWineImage(path: string, bucket = 'wine-images') {
  if (/^https?:\/\//.test(path)) return path;
  return requireSupabase().storage.from(bucket).getPublicUrl(path).data.publicUrl;
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
    .map((wine) => {
      const stat = statsById.get(wine.id);
      return {
        id: wine.id,
        name: wine.name,
        region: wine.region,
        price: wine.price,
        type: wine.type,
        imageUrl: resolveWineImage(wine.image_path),
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
