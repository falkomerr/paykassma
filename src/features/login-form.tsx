import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/components/ui/form';
import { Input } from '@/components/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
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

  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    console.log(values);
  };

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="inter text-[0.875rem] font-medium">
              Ваша почта
            </FormLabel>
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
            <FormLabel className="inter text-[0.875rem] font-medium">
              Пароль
            </FormLabel>
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
        className="relative h-[74px] w-[587px] cursor-pointer overflow-hidden rounded-lg">
        <img
          src="/login-button.svg"
          alt="login button"
          className="absolute inset-0 h-full w-full scale-y-[0.8] object-cover"
        />
        <span className="font-inter relative z-10 text-lg font-medium tracking-[0.08rem] text-white">
          Войти
        </span>
      </button>
    </FormWrapper>
  );
};
