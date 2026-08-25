export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type WineType = 'red' | 'white' | 'sparkling';

export interface Database {
  public: {
    Tables: {
      profiles: { Row: { id: string; nickname: string; avatar_path: string | null; created_at: string; updated_at: string }; Insert: { id: string; nickname: string; avatar_path?: string | null }; Update: { nickname?: string; avatar_path?: string | null }; Relationships: [] };
      wines: { Row: { id: string; owner_id: string; name: string; price: number; region: string; type: WineType; image_path: string; created_at: string; updated_at: string }; Insert: { id?: string; owner_id: string; name: string; price: number; region: string; type: WineType; image_path: string }; Update: Partial<{ name: string; price: number; region: string; type: WineType; image_path: string }>; Relationships: [] };
      reviews: { Row: { id: string; wine_id: string; author_id: string; rating: number; content: string; light_bold: number; smooth_tannic: number; dry_sweet: number; soft_acidic: number; aromas: string[]; created_at: string; updated_at: string }; Insert: { id?: string; wine_id: string; author_id: string; rating: number; content: string; light_bold: number; smooth_tannic: number; dry_sweet: number; soft_acidic: number; aromas?: string[] }; Update: Partial<{ rating: number; content: string; light_bold: number; smooth_tannic: number; dry_sweet: number; soft_acidic: number; aromas: string[] }>; Relationships: [] };
      wine_likes: { Row: { user_id: string; wine_id: string; created_at: string }; Insert: { user_id: string; wine_id: string }; Update: never; Relationships: [] };
      review_likes: { Row: { user_id: string; review_id: string; created_at: string }; Insert: { user_id: string; review_id: string }; Update: never; Relationships: [] };
    };
    Views: { wine_stats: { Row: { wine_id: string | null; average_rating: number | null; review_count: number | null; light_bold: number | null; smooth_tannic: number | null; dry_sweet: number | null; soft_acidic: number | null }; Relationships: [] } };
    Functions: { get_recommended_wines: { Args: { result_limit?: number }; Returns: { wine_id: string; average_rating: number; review_count: number }[] } };
    Enums: { wine_type: WineType };
    CompositeTypes: Record<never, never>;
  };
}
