import { loginSchema, signupSchema } from './schemas';

describe('auth schemas', () => {
  it('requires a valid email and password on login', () => {
    const result = loginSchema.safeParse({ email: 'wrong', password: '' });
    expect(result.success).toBe(false);
  });

  it('accepts the required signup password composition', () => {
    const result = signupSchema.safeParse({
      email: 'user@example.com', nickname: '와인러버', password: 'Whyne123!', passwordConfirm: 'Whyne123!',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords and long nicknames', () => {
    const result = signupSchema.safeParse({
      email: 'user@example.com', nickname: '가'.repeat(21), password: 'Whyne123!', passwordConfirm: 'Different123!',
    });
    expect(result.success).toBe(false);
  });
});
