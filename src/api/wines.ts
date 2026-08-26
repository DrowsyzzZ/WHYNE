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

const seedImages = [wine1, wine2, wine3, wine4];

function resolveWineImage(path: string, index: number) {
  if (path.startsWith('seed/')) return seedImages[index % seedImages.length] ?? wine1;
  if (/^https?:\/\//.test(path)) return path;
  return requireSupabase().storage.from('wine-images').getPublicUrl(path).data.publicUrl;
}

export async function getWines(filters: WineFilters): Promise<WineListItem[]> {
  const client = requireSupabase();
  let query = client.from('wines').select('*').gte('price', filters.minPrice).lte('price', filters.maxPrice).order('created_at', { ascending: false });
  if (filters.search.trim()) query = query.ilike('name', `%${filters.search.trim()}%`);
  if (filters.types.length) query = query.in('type', filters.types);

  const [{ data: wines, error }, { data: stats, error: statsError }, { data: reviews, error: reviewsError }] = await Promise.all([
    query,
    client.from('wine_stats').select('wine_id,average_rating,review_count'),
    client.from('reviews').select('wine_id,content,created_at').order('created_at', { ascending: false }),
  ]);
  if (error) throw error;
  if (statsError) throw statsError;
  if (reviewsError) throw reviewsError;

  const statsById = new Map((stats ?? []).map((stat) => [stat.wine_id, stat]));
  const latestReviewByWine = new Map<string, string>();
  for (const review of reviews ?? []) if (!latestReviewByWine.has(review.wine_id)) latestReviewByWine.set(review.wine_id, review.content);
  return (wines ?? []).map((wine, index) => {
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
  }).filter((wine) => (filters.ratingMin === null || wine.averageRating >= filters.ratingMin)
    && (filters.ratingMax === null || wine.averageRating <= filters.ratingMax));
}
