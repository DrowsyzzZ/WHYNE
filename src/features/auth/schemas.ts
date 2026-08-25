import { z } from 'zod';

const email = z.string().min(1, '이메일은 필수 입력입니다.').email('이메일 형식으로 작성해 주세요.');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, '비밀번호는 필수 입력입니다.'),
});

export const signupSchema = z
  .object({
    email,
    nickname: z
      .string()
      .min(1, '닉네임은 필수 입력입니다.')
      .max(20, '닉네임은 최대 20자까지 가능합니다.'),
    password: z
      .string()
      .min(1, '비밀번호는 필수 입력입니다.')
      .min(8, '비밀번호는 최소 8자 이상입니다.')
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])/, '비밀번호는 숫자, 영문, 특수문자로만 가능합니다.'),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
