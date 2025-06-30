import { createEffect, createEvent, createStore, sample } from 'effector';

// События
export const loginClicked = createEvent();
export const registerClicked = createEvent<RegisterParams>();
export const logoutClicked = createEvent();

// Типы
type User = { id: string; name: string } | null;

// Типы для регистрации
export type RegisterParams = {
  email: string;
  password: string;
  country: string; // всегда "RU"
  login: string; // имя компании
  contact_person: string; // ник в тг
  notes: string; // как узнали о сервисе
};

// Эффекты (асинхронные операции)
export const loginFx = createEffect(async () => {
  // Здесь в реальном приложении был бы запрос к API с передачей параметров
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { id: '1', name: 'User Name' };
});

export const registerFx = createEffect(async (params: RegisterParams) => {
  try {
    const response = await fetch(
      'https://api-affbid.affise.com/3.0/admin/partner',
      {
        method: 'POST',
        headers: {
          'api-key': 'ab94e578c92da7ff4e934e50bd2b12ab40955836',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...params,
          country: 'RU', // всегда устанавливаем "RU"
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка при регистрации');
    }

    const data = await response.json();
    return { id: data.id || '1', name: params.login || 'User Name' };
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
