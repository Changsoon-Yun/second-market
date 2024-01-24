import { z } from 'zod';

const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d|\W).{8,}$/;
export const loginFormSchema = z.object({
  email: z.string().email({ message: '이메일 형식에 맞지 않습니다.' }),
  password: z.string().regex(regex, { message: '비밀번호 형식에 맞지 않습니다.' }),
});

export const registerFormSchema = loginFormSchema.extend({
  userName: z
    .string()
    .min(1, { message: '이름은 최소 1자 이상 입니다.' })
    .max(20, { message: '이름은 최대 20자 입니다.' }),
});