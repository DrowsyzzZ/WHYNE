import { signInWithSocial } from './auth';

const { signInWithOAuth } = vi.hoisted(() => ({ signInWithOAuth: vi.fn() }));
vi.mock('../lib/supabase', () => ({ requireSupabase: () => ({ auth: { signInWithOAuth } }) }));

beforeEach(() => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
  vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'test-public-key');
  vi.stubEnv('BASE_URL', '/WHYNE/');
  signInWithOAuth.mockReset();
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

it('keeps users on the form when a provider is not configured', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ external: { google: false } }),
      }),
  );
  await expect(signInWithSocial('google')).rejects.toThrow('아직 준비 중');
  expect(signInWithOAuth).not.toHaveBeenCalled();
});

it.each(['google', 'kakao'] as const)(
  'uses a same-origin callback under the application base for %s',
  async (provider) => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ external: { [provider]: true } }),
        }),
    );
    signInWithOAuth.mockResolvedValue({ data: {}, error: null });
    await signInWithSocial(provider);
    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider,
      options: {
        redirectTo: `${window.location.origin}/WHYNE/auth/callback`,
      },
    });
  },
);

it('does not start OAuth when provider settings cannot be checked', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
  await expect(signInWithSocial('kakao')).rejects.toThrow('연결하지 못했습니다');
  expect(signInWithOAuth).not.toHaveBeenCalled();
});
