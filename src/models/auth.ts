import { createEffect, createEvent, createStore } from 'effector';

// События
export const loginClicked = createEvent();
export const registerClicked = createEvent();
export const logoutClicked = createEvent();

// Эффекты (асинхронные операции)
export const loginFx = createEffect(async () => {
  // Здесь в реальном приложении был бы запрос к API с передачей параметров
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { id: '1', name: 'User Name' };
});

export const registerFx = createEffect(async () => {
  // Здесь в реальном приложении был бы запрос к API с передачей параметров
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { id: '1', name: 'User Name' };
});

export const logoutFx = createEffect(async () => {
  // Здесь в реальном приложении был бы запрос к API
  await new Promise((resolve) => setTimeout(resolve, 300));
  return true;
});

// Типы
type User = { id: string; name: string } | null;

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
