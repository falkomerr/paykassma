import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/components/ui/form';
import { Input } from '@/components/components/ui/input';
import { loginClicked, loginFx } from '@/models/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUnit } from 'effector-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormWrapper } from './register-form';

export const loginFormSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Введите пароль'),
});

export const LoginForm = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login, pending } = useUnit({
    login: loginClicked,
    pending: loginFx.pending,
  });

  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    login({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ваша почта</FormLabel>
            <FormControl>
              <Input {...field} autoComplete="email" className="font-inter" />
            </FormControl>
            <FormMessage className="font-inter text-sm" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Пароль</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                autoComplete="current-password"
                className="font-inter"
              />
            </FormControl>
            <FormMessage className="font-inter text-sm" />
          </FormItem>
        )}
      />

      <button
        type="submit"
        disabled={pending}
        className="relative aspect-[587/74] w-[30.1041666667vw] cursor-pointer overflow-hidden rounded-[0.78125vw]">
        <img
          src="/login-button.svg"
          alt="login button"
          className="absolute inset-0 h-full w-full scale-y-[0.8] object-cover"
        />
        <span className="font-inter relative z-10 text-[0.9416666667vw] font-medium tracking-[0.09rem] text-white">
          {pending ? 'Вход...' : 'Войти'}
        </span>
      </button>
    </FormWrapper>
  );
};
