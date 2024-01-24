import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInner from '@/components/auth/FormInner.tsx';
import { Button } from '@/components/ui/button.tsx';
import SocialLogins from '@/components/auth/SocialLogins.tsx';
import { Link } from 'react-router-dom';
import AuthHeading from '@/components/auth/AuthHeading.tsx';
import { loginFormSchema } from '@/lib/zod/schemas.ts';

export default function LoginPage() {
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const submitHandler = (values: z.infer<typeof loginFormSchema>) => {
    console.log(values);
  };
  return (
    <>
      <div className={'pb-6'}>
        <AuthHeading text={'로그인'} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <FormInner form={form} name={'email'} label={'이메일'} />
            <FormInner form={form} name={'password'} label={'비밀번호'} />
            <Button className={'w-full mt-10 py-6'} type={'submit'}>
              로그인 하기
            </Button>
          </form>
          <p className={'text-center mt-8 text-sm text-zinc-600'}>
            계정이 없으신가요?
            <span className={'text-blue-500'}>
              <Link to={'/register/select'}> 회원가입 하기</Link>
            </span>
          </p>
          <SocialLogins />
        </Form>
      </div>
    </>
  );
}