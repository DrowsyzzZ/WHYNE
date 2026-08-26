import { requireSupabase } from '../lib/supabase';

export interface ProfileData {
  id: string;
  nickname: string;
  avatarUrl?: string;
}
const mockProfiles = new Map<string, ProfileData>();

export async function getProfile(
  userId: string,
  fallbackNickname = '와인러버',
): Promise<ProfileData> {
  const existing = mockProfiles.get(userId);
  if (existing) return existing;
  const client = requireSupabase();
  const { data, error } = await client
    .from('profiles')
    .select('id,nickname,avatar_path')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  const profile = data
    ? {
        id: data.id,
        nickname: data.nickname,
        avatarUrl: data.avatar_path
          ? client.storage.from('avatars').getPublicUrl(data.avatar_path).data.publicUrl
          : undefined,
      }
    : { id: userId, nickname: fallbackNickname };
  mockProfiles.set(userId, profile);
  return profile;
}

export async function updateProfile(
  userId: string,
  nickname: string,
  avatar?: File,
): Promise<ProfileData> {
  const client = requireSupabase();
  let avatarPath: string | undefined;
  if (avatar) {
    avatarPath = `${userId}/${crypto.randomUUID()}-${avatar.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const { error } = await client.storage
      .from('avatars')
      .upload(avatarPath, avatar, { contentType: avatar.type });
    if (error) throw error;
  }
  const update = avatarPath ? { nickname, avatar_path: avatarPath } : { nickname };
  const { error } = await client.from('profiles').update(update).eq('id', userId);
  if (error) throw error;
  const profile = {
    id: userId,
    nickname,
    avatarUrl: avatarPath
      ? client.storage.from('avatars').getPublicUrl(avatarPath).data.publicUrl
      : mockProfiles.get(userId)?.avatarUrl,
  };
  mockProfiles.set(userId, profile);
  return profile;
}
