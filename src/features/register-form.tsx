import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/components/ui/form';
import { Input } from '@/components/components/ui/input';
import { LogoSmall } from '@/components/ui/LogoSmall';
import { registerClicked, registerFx } from '@/models/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUnit } from 'effector-react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const registerFormSchema = z
  .object({
    name: z.string().min(1, 'Введите имя'),
    tg: z
      .string()
      .min(5, 'Введите телеграм')
      .refine((value) => (value.split('@').at(0)?.length ?? 0) >= 1, {
        message: 'Введите телеграм',
      }),
    email: z.string().email('Некорректный email'),
    phone: z.string().min(1, 'Введите телефон'),
    howYouKnow: z.string(),
    password: z.string().min(8, 'Введите пароль'),
    confirmPassword: z.string().min(8, 'Введите пароль'),
  })
  .refine((values) => values.confirmPassword === values.password, {
    path: ['confirmPassword'],
    message: 'Пароли не совпадают',
  });

export const RegisterForm = () => {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      tg: '@',
      email: '',
      phone: '',
      howYouKnow: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { registerUser, pending } = useUnit({
    registerUser: registerClicked,
    pending: registerFx.pending,
  });

  const onSubmit = (values: z.infer<typeof registerFormSchema>) => {
    // Вызываем событие регистрации, преобразуя данные из формы в формат API
    registerUser({
      email: values.email,
      password: values.password,
      country: 'RU', // всегда "RU"
      login: values.name, // имя компании
      contact_person: values.tg, // ник в тг
      notes: values.howYouKnow, // как узнали о нас
    });
  };

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ваше имя</FormLabel>
            <FormControl>
              <Input {...field} autoComplete="name" className="font-inter" />
            </FormControl>
            <FormMessage className="font-inter text-sm" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tg"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ваш ник в Telegram</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="@"
                autoComplete="username"
                className="font-inter"
              />
            </FormControl>
            <FormMessage className="font-inter text-sm" />
          </FormItem>
        )}
      />
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
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ваш телефон</FormLabel>
            <FormControl>
              <Input {...field} autoComplete="tel" className="font-inter" />
            </FormControl>
            <FormMessage className="font-inter text-sm" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="howYouKnow"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Как вы узнали о нас?</FormLabel>
            <FormControl>
              <Input {...field} autoComplete="off" className="font-inter" />
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
                autoComplete="new-password"
                type="password"
                className="font-inter"
              />
            </FormControl>
            <FormMessage className="font-inter text-sm" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Повторите пароль</FormLabel>
            <FormControl>
              <Input
                {...field}
                autoComplete="new-password"
                type="password"
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
          src="/register-button-bg.svg"
          alt="register button"
          className="absolute inset-0 h-full w-full scale-y-[0.8] object-cover"
        />
        <span className="font-inter relative z-10 text-[0.9416666667vw] font-medium tracking-[0.09rem] text-white">
          {pending ? 'Регистрация...' : 'Зарегистрироваться'}
        </span>
      </button>
      <p className="font-inter max-w-[28.0208333333vw] text-[0.7291666667vw] text-[#CCC] [&_span]:cursor-pointer [&_span]:underline">
        Нажимая на кнопку, вы даете согласие на{' '}
        <span>Обработку персональных данных</span> и{' '}
        <span>Условиями публичной офертой</span>{' '}
      </p>
    </FormWrapper>
  );
};

export const FormWrapper = ({
  form,
  children,
  onSubmit,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: any) => void;
}) => {
  return (
    <Form {...form}>
      <a href="/">
        <LogoSmall className="absolute top-4 left-1/2 -translate-x-1/2" />
      </a>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="inter flex h-screen w-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col gap-y-[0.78125vw]">{children}</div>
        <img
          src="/big-logo.png"
          alt="logo"
          className="aspect-[487/567] w-[28.3645833333vw]"
        />
      </form>
    </Form>
  );
};
