import { createEvent, createStore } from 'effector';

// События для изменения языка
export const changeLang = createEvent<string>();

// Хранилище для текущего языка
export const $lang = createStore<string>('ru')
  // Обновление языка при вызове события changeLang
  .on(changeLang, (_, newLang) => newLang);
