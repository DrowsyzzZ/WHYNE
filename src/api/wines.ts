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
const USE_MOCK_CATALOG = true;

const mockTemplates: Array<Pick<WineListItem, 'name' | 'region' | 'price' | 'type'>> = [
  { name: 'Sentinel Cabernet Sauvignon', region: 'Western Cape, South Africa', price: 74000, type: 'red' },
  { name: 'Coastal Sparkling Brut', region: 'Coastal Region, South Africa', price: 52000, type: 'sparkling' },
  { name: 'Cape Blanc', region: 'Western Cape, South Africa', price: 43000, type: 'white' },
  { name: 'Reserve Merlot', region: 'Bordeaux, France', price: 68000, type: 'red' },
  { name: 'Estate Chardonnay', region: 'Napa Valley, United States', price: 89000, type: 'white' },
  { name: 'Rosé Sparkling Cuvée', region: 'Champagne, France', price: 126000, type: 'sparkling' },
  { name: 'Old Vine Shiraz', region: 'Barossa Valley, Australia', price: 61000, type: 'red' },
  { name: 'Sauvignon Blanc Reserve', region: 'Marlborough, New Zealand', price: 39000, type: 'white' },
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
    latestReview: rating ? '균형 잡힌 향과 풍미가 인상적이고 음식과 함께 즐기기 좋은 와인이에요.' : null,
  };
});

function filterMockWines(filters: WineFilters) {
  const search = filters.search.trim().toLocaleLowerCase();
  return mockWines.filter((wine) => (!search || wine.name.toLocaleLowerCase().includes(search))
    && (!filters.types.length || filters.types.includes(wine.type))
    && wine.price >= filters.minPrice
    && wine.price <= filters.maxPrice
    && (filters.ratingMin === null || wine.averageRating >= filters.ratingMin)
    && (filters.ratingMax === null || wine.averageRating <= filters.ratingMax));
}

function resolveWineImage(path: string, index: number) {
  if (path.startsWith('seed/')) return seedImages[index % seedImages.length] ?? wine1;
  if (/^https?:\/\//.test(path)) return path;
  return requireSupabase().storage.from('wine-images').getPublicUrl(path).data.publicUrl;
}

export async function getWines(filters: WineFilters): Promise<WineListItem[]> {
  if (USE_MOCK_CATALOG) return filterMockWines(filters);
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
