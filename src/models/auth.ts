import { createEffect, createEvent, createStore, sample } from 'effector';

// События
export const loginClicked = createEvent<LoginParams>();
export const registerClicked = createEvent<RegisterParams>();
export const logoutClicked = createEvent();

// Типы
type User = { id: string; name: string } | null;

// Типы для регистрации
export type RegisterParams = {
  email: string;
  password: string;
  country: string; // всегда "RU"
  contact_person: string; // ник в тг
  status: string; // статус партнера
  notify: number; // уведомления
  'custom_fields[2]': string; // ник в тг
  'custom_fields[13]': string; // как узнали о сервисе
};

// Типы для авторизации
export type LoginParams = {
  email: string;
  password: string;
};

// Эффекты (асинхронные операции)
export const loginFx = createEffect(async (params: LoginParams) => {
  try {
    // Создаем объект FormData
    const formData = new FormData();

    // Добавляем параметры в FormData
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(
      'https://api-affbid.affise.com/3.1/partner/auth',
      {
        method: 'POST',
        headers: {
          'API-Key': 'ab94e578c92da7ff4e934e50bd2b12ab40955836',
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка при авторизации');
    }

    const data = await response.json();
    return { id: data.id || '1', name: data.email || 'User Name' };
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    throw error;
  }
});

export const registerFx = createEffect(async (params: RegisterParams) => {
  try {
    // Создаем объект FormData
    const formData = new FormData();

    // Добавляем параметры в FormData
    Object.entries({
      ...params,
      country: 'DE', // всегда устанавливаем "RU"
    }).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const response = await fetch(
      'https://api-affbid.affise.com/3.0/admin/partner',
      {
        method: 'POST',
        headers: {
          'API-Key': 'ab94e578c92da7ff4e934e50bd2b12ab40955836',
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка при регистрации');
    }

    const data = await response.json();
    return { id: data.id || '1', name: params.email || 'User Name' };
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    throw error;
  }
});

export const logoutFx = createEffect(async () => {
  // Здесь в реальном приложении был бы запрос к API
  await new Promise((resolve) => setTimeout(resolve, 300));
  return true;
});

// Состояния
export const $user = createStore<User>(null)
  .on(loginFx.doneData, (_, user) => user)
  .on(registerFx.doneData, (_, user) => user)
  .on(logoutFx.done, () => null);

export const $isAuthenticated = $user.map((user) => user !== null);

export const $isAuthLoading = createStore(false)
  .on([loginFx, registerFx, logoutFx], () => true)
  .on(
    [
      loginFx.done,
      loginFx.fail,
      registerFx.done,
      registerFx.fail,
      logoutFx.done,
      logoutFx.fail,
    ],
    () => false,
  );

sample({
  clock: registerClicked,
  target: registerFx,
});

sample({
  clock: loginClicked,
  target: loginFx,
});

sample({
  clock: [registerFx.doneData, loginFx.doneData],
  fn: () =>
    (window.location.href = 'https://account.paykassma.partners/v2/sign/in'),
});
